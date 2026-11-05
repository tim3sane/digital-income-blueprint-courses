/**
 * Habla — utilidades compartidas para las funciones de membresía.
 * Este archivo no exporta handlers, así que no crea ninguna ruta.
 *
 * Variables de entorno (Cloudflare Pages → Settings → Environment variables):
 *   STRIPE_SECRET_KEY    — la misma que ya usan los cursos (sk_live_... / sk_test_...)
 *   HABLA_TOKEN_SECRET   — opcional. Cadena larga aleatoria para firmar los códigos de membresía.
 *                          Si no existe, se deriva de STRIPE_SECRET_KEY.
 */

export const PLANS = {
    plus_m: { plan: 'plus', name: 'Habla Plus — mensual',        amount: 399,  interval: 'month' },
    plus_y: { plan: 'plus', name: 'Habla Plus — anual',          amount: 2900, interval: 'year'  },
    pro_m:  { plan: 'pro',  name: 'Habla Profesional — mensual', amount: 999,  interval: 'month' },
    pro_y:  { plan: 'pro',  name: 'Habla Profesional — anual',   amount: 7900, interval: 'year'  },
};
export const TRIAL_DAYS = 7;
const GRACE_MS = 7 * 86400000;          // días extra sin internet antes de que caduque en el dispositivo
const ACTIVE = ['active', 'trialing', 'past_due'];

export function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
}

export async function readJson(request) {
    const len = Number(request.headers.get('Content-Length') || 0);
    if (len > 8192) throw new Error('too large');
    const text = await request.text();
    if (text.length > 8192) throw new Error('too large');
    return JSON.parse(text);
}

export async function stripe(env, path, { method = 'GET', params } = {}) {
    const res = await fetch(`https://api.stripe.com/v1/${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
            ...(params ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
        },
        body: params ? params.toString() : undefined,
    });
    const data = await res.json();
    if (data.error) {
        const err = new Error(data.error.message || 'stripe');
        err.status = res.status;
        throw err;
    }
    return data;
}

// ---- Códigos de membresía firmados (HMAC-SHA256) ----
const enc = new TextEncoder();
const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));

async function key(env) {
    const raw = env.HABLA_TOKEN_SECRET
        ? enc.encode(env.HABLA_TOKEN_SECRET)
        : await crypto.subtle.digest('SHA-256', enc.encode('habla-token-v1:' + env.STRIPE_SECRET_KEY));
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

/** Convierte una suscripción de Stripe en la respuesta que guarda la app. */
export async function licenseFromSubscription(env, sub) {
    if (!sub || sub.metadata?.app !== 'habla') return { active: false };
    if (!ACTIVE.includes(sub.status)) return { active: false, status: sub.status };
    const plan = sub.metadata.plan === 'pro' ? 'pro' : 'plus';
    const periodEnd = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end ?? (Date.now() / 1000 + 35 * 86400);
    const exp = periodEnd * 1000 + GRACE_MS;
    const customer = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
    const token = await sign(env, { v: 1, s: sub.id, c: customer, p: plan });
    return { active: true, plan, exp, status: sub.status, token };
}
