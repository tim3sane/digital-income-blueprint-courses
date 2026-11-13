/**
 * Vocari — utilidades de pago (Paddle Billing). Los archivos que empiezan con "_" no son rutas.
 *
 * Paddle es el "Merchant of Record": cobra, calcula y declara impuestos en todo el mundo
 * y te transfiere el dinero (por ejemplo, a tu cuenta en USD de Payoneer).
 *
 * Variables de entorno (Vercel → Project → Settings → Environment Variables):
 *   PADDLE_API_KEY        — clave de API de Paddle (Developer tools → Authentication). SECRETA.
 *   PADDLE_CLIENT_TOKEN   — "client-side token" de Paddle (empieza con live_ o test_). Es pública.
 *   PADDLE_ENV            — "production" o "sandbox" (para pruebas). Por defecto: production.
 *   VOCARI_TOKEN_SECRET   — opcional. Cadena aleatoria larga para firmar los códigos de membresía.
 *   PADDLE_EBOOK_TAX_CATEGORY — opcional. "standard" (por defecto) o "ebooks" si Paddle te la aprueba.
 */

export const ITEMS = {
    plus_m: { kind: 'membership', plan: 'plus', name: 'Vocari Plus',        desc: 'Vocari Plus — mensual',        amount: 399,  interval: 'month' },
    plus_y: { kind: 'membership', plan: 'plus', name: 'Vocari Plus',        desc: 'Vocari Plus — anual',          amount: 2900, interval: 'year'  },
    pro_m:  { kind: 'membership', plan: 'pro',  name: 'Vocari Profesional', desc: 'Vocari Profesional — mensual', amount: 999,  interval: 'month' },
    pro_y:  { kind: 'membership', plan: 'pro',  name: 'Vocari Profesional', desc: 'Vocari Profesional — anual',   amount: 7900, interval: 'year'  },
    ebook:  { kind: 'ebook', name: 'Guía Vocari para familias (PDF)', desc: 'Guía práctica de comunicación aumentativa — libro digital', amount: 199 },
};
export const TRIAL_DAYS = 7;
const GRACE_MS = 7 * 86400000;
const ACTIVE = ['active', 'trialing', 'past_due'];

export const paddleEnv = env => (env.PADDLE_ENV === 'sandbox' ? 'sandbox' : 'production');
const apiBase = env => (paddleEnv(env) === 'sandbox' ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com');

export function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
}

export async function readJson(request) {
    const text = await request.text();
    if (text.length > 8192) throw new Error('too large');
    return JSON.parse(text);
}

export async function paddle(env, path, { method = 'GET', body } = {}) {
    const res = await fetch(apiBase(env) + path, {
        method,
        headers: {
            Authorization: `Bearer ${env.PADDLE_API_KEY}`,
            'Content-Type': 'application/json',
            'Paddle-Version': '1',
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) {
        const err = new Error(data.error?.detail || data.error?.code || `paddle ${res.status}`);
        err.status = res.status;
        throw err;
    }
    return data.data;
}

export const configured = env => Boolean(env.PADDLE_API_KEY && env.PADDLE_CLIENT_TOKEN);
export const PAID = ['paid', 'completed'];
export const validTxn = id => typeof id === 'string' && /^txn_[a-z0-9]{10,60}$/.test(id);

// ---- Códigos de membresía firmados (HMAC-SHA256) ----
const enc = new TextEncoder();
const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));

async function key(env) {
    const raw = env.VOCARI_TOKEN_SECRET
        ? enc.encode(env.VOCARI_TOKEN_SECRET)
        : await crypto.subtle.digest('SHA-256', enc.encode('vocari-token-v1:' + env.PADDLE_API_KEY));
    return crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function sign(env, payload) {
    const body = b64url(enc.encode(JSON.stringify(payload)));
    const sig = await crypto.subtle.sign('HMAC', await key(env), enc.encode(body));
    return `${body}.${b64url(sig)}`;
}

export async function verify(env, token) {
    if (typeof token !== 'string' || token.length > 1024 || !/^[\w-]+\.[\w-]+$/.test(token)) return null;
    const [body, sig] = token.split('.');
    const ok = await crypto.subtle.verify('HMAC', await key(env), fromB64url(sig), enc.encode(body));
    if (!ok) return null;
    try { return JSON.parse(new TextDecoder().decode(fromB64url(body))); } catch { return null; }
}

/** Convierte una suscripción de Paddle en la respuesta que guarda la app. */
export async function licenseFromSubscription(env, sub) {
    const price = sub?.items?.[0]?.price || {};
    const meta = { ...(price.custom_data || {}), ...(sub?.custom_data || {}) };
    if (!sub || meta.app !== 'vocari') return { active: false };
    if (!ACTIVE.includes(sub.status)) return { active: false, status: sub.status };
    const plan = meta.plan === 'pro' ? 'pro' : 'plus';
    const ends = Date.parse(sub.current_billing_period?.ends_at || '') || Date.now() + 35 * 86400000;
    const exp = ends + GRACE_MS;
    const token = await sign(env, { v: 2, s: sub.id, c: sub.customer_id, p: plan });
    return { active: true, plan, exp, status: sub.status, token };
}
