/**
 * GET /api/activate?txn=txn_...
 * Tras pagar, Paddle vuelve a la app con el id de transacción. Devolvemos el código de membresía firmado.
 * Responde 409 mientras Paddle todavía está creando la suscripción (la app reintenta).
 */
import { json, paddle, configured, validTxn, PAID, licenseFromSubscription } from './_lib.js';
export const config = { runtime: 'edge' };

export default async function handler(request) {
    if (request.method !== 'GET') return json({ error: 'Method not allowed.' }, 405);
    const env = process.env;
    try {
        if (!configured(env)) return json({ error: 'Payment system not configured.' }, 503);
        const id = new URL(request.url).searchParams.get('txn');
        if (!validTxn(id)) return json({ error: 'Invalid transaction.' }, 400);

        const txn = await paddle(env, `/transactions/${id}`);
        if (txn.custom_data?.app !== 'vocari' || txn.custom_data?.item !== 'membership') return json({ error: 'Invalid transaction.' }, 400);
        if (!PAID.includes(txn.status) || !txn.subscription_id) return json({ error: 'Pending.' }, 409);

        const sub = await paddle(env, `/subscriptions/${txn.subscription_id}`);
        const lic = await licenseFromSubscription(env, sub);
        if (!lic.active) return json({ error: 'Subscription inactive.' }, 402);
        return json(lic);
    } catch (err) {
        return json({ error: 'Activation failed.' }, err.status === 404 ? 404 : 502);
    }
}
