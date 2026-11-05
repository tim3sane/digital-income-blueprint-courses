/**
 * POST /api/portal   { token, lang? }
 * Abre el portal de clientes de Stripe para cambiar de plan, actualizar la tarjeta o cancelar.
 * Requiere activar el Customer Portal una vez en el Dashboard de Stripe.
 */
import { json, readJson, stripe, verify } from './_lib.js';

export async function onRequestPost({ request, env }) {
    try {
        if (!env.STRIPE_SECRET_KEY) return json({ error: 'Payment system not configured.' }, 500);
        const { token, lang } = await readJson(request);
        const data = await verify(env, token);
        if (!data || typeof data.c !== 'string' || !data.c.startsWith('cus_')) return json({ error: 'Invalid code.' }, 401);

        const params = new URLSearchParams();
        params.append('customer', data.c);
        params.append('return_url', `${new URL(request.url).origin}/app.html`);
        params.append('locale', lang === 'en' ? 'en' : 'es');
        const session = await stripe(env, 'billing_portal/sessions', { method: 'POST', params });
        return json({ url: session.url });
    } catch (err) {
        return json({ error: 'Could not open portal.' }, 500);
    }
}
