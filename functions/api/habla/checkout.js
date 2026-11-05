/**
 * POST /api/habla/checkout   { plan: "plus_m" | "plus_y" | "pro_m" | "pro_y", lang?: "es" | "en" }
 * Crea una sesión de Stripe Checkout en modo suscripción con 7 días de prueba.
 */
import { PLANS, TRIAL_DAYS, json, readJson, stripe } from './_lib.js';

export async function onRequestPost({ request, env }) {
    try {
        if (!env.STRIPE_SECRET_KEY) return json({ error: 'Payment system not configured.' }, 500);
        const { plan, lang } = await readJson(request);
        const p = typeof plan === 'string' ? PLANS[plan] : null;
        if (!p) return json({ error: 'Invalid plan.' }, 400);

        const origin = new URL(request.url).origin;
        const params = new URLSearchParams();
        params.append('mode', 'subscription');
        params.append('success_url', `${origin}/habla/app.html?session_id={CHECKOUT_SESSION_ID}`);
        params.append('cancel_url', `${origin}/habla/#planes`);
        params.append('locale', lang === 'en' ? 'en' : 'es');
        params.append('line_items[0][quantity]', '1');
        params.append('line_items[0][price_data][currency]', 'usd');
        params.append('line_items[0][price_data][unit_amount]', String(p.amount));
        params.append('line_items[0][price_data][recurring][interval]', p.interval);
        params.append('line_items[0][price_data][product_data][name]', p.name);
        params.append('subscription_data[trial_period_days]', String(TRIAL_DAYS));
        params.append('subscription_data[metadata][app]', 'habla');
        params.append('subscription_data[metadata][plan]', p.plan);
        params.append('metadata[app]', 'habla');
        params.append('metadata[plan]', p.plan);
        params.append('allow_promotion_codes', 'true');
        params.append('custom_text[submit][message]',
            lang === 'en'
                ? `By subscribing you accept the Terms (${origin}/habla/terminos.html) and Refund policy (${origin}/habla/reembolsos.html). Cancel anytime.`
                : `Al suscribirte aceptas los Términos (${origin}/habla/terminos.html) y la Política de reembolsos (${origin}/habla/reembolsos.html). Cancela cuando quieras.`);

        const session = await stripe(env, 'checkout/sessions', { method: 'POST', params });
        return json({ url: session.url });
    } catch (err) {
        return json({ error: 'Could not start checkout.' }, err.status === 400 ? 400 : 500);
    }
}
