/**
 * GET /api/activate?session_id=cs_...
 * Tras pagar, Stripe vuelve a la app con session_id. Devolvemos el código de membresía firmado.
 */
import { json, stripe, licenseFromSubscription } from './_lib.js';

export async function onRequestGet({ request, env }) {
    try {
        if (!env.STRIPE_SECRET_KEY) return json({ error: 'Payment system not configured.' }, 500);
        const sid = new URL(request.url).searchParams.get('session_id') || '';
        if (!/^cs_[A-Za-z0-9_]{10,200}$/.test(sid)) return json({ error: 'Invalid session.' }, 400);

        const session = await stripe(env, `checkout/sessions/${encodeURIComponent(sid)}?expand[]=subscription`);
        if (session.metadata?.app !== 'vocari' || session.mode !== 'subscription') return json({ error: 'Invalid session.' }, 400);
        if (session.status !== 'complete') return json({ error: 'Payment not completed.' }, 402);

        const lic = await licenseFromSubscription(env, session.subscription);
        if (!lic.active) return json({ error: 'Subscription inactive.' }, 402);
        return json(lic);
    } catch (err) {
        return json({ error: 'Activation failed.' }, err.status === 404 ? 404 : 500);
    }
}
