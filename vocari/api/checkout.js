/**
 * POST /api/checkout   { item: "plus_m" | "plus_y" | "pro_m" | "pro_y" | "ebook", lang?: "es" | "en" }
 * Crea una transacción en Paddle y devuelve lo necesario para abrir el checkout de Paddle.js.
 */
import { ITEMS, TRIAL_DAYS, json, readJson, paddle, paddleEnv, configured } from './_lib.js';
export const config = { runtime: 'edge' };

export default async function handler(request) {
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
    const env = process.env;
    try {
        if (!configured(env)) return json({ error: 'Payment system not configured.' }, 503);
        const body = await readJson(request);
        const id = body.item || body.plan;
        const it = typeof id === 'string' && Object.hasOwn(ITEMS, id) ? ITEMS[id] : null;
        if (!it) return json({ error: 'Invalid item.' }, 400);
        const lang = body.lang === 'en' ? 'en' : 'es';

        const custom = { app: 'vocari', item: it.kind, ...(it.plan ? { plan: it.plan } : {}) };
        const price = {
            name: it.desc,
            description: it.desc,
            unit_price: { amount: String(it.amount), currency_code: 'USD' },
            product: {
                name: it.name,
                tax_category: it.kind === 'ebook' ? (env.PADDLE_EBOOK_TAX_CATEGORY || 'standard') : 'standard',
            },
            custom_data: custom,
        };
        if (it.kind === 'membership') {
            price.billing_cycle = { interval: it.interval, frequency: 1 };
            price.trial_period = { interval: 'day', frequency: TRIAL_DAYS };
        }
        const txn = await paddle(env, '/transactions', {
            method: 'POST',
            body: { items: [{ quantity: 1, price }], custom_data: custom },
        });

        const origin = new URL(request.url).origin;
        const successUrl = it.kind === 'ebook'
            ? `${origin}/guia.html?txn=${txn.id}${lang === 'en' ? '&lang=en' : ''}`
            : `${origin}/app.html?txn=${txn.id}`;
        return json({ transactionId: txn.id, clientToken: env.PADDLE_CLIENT_TOKEN, env: paddleEnv(env), successUrl, locale: lang });
    } catch (err) {
        return json({ error: 'Could not start checkout.' }, 502);
    }
}
