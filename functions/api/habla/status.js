/**
 * POST /api/habla/status   { token }
 * La app lo llama como máximo una vez al día para renovar la fecha de vencimiento local.
 * También sirve para "restaurar" la membresía en otro dispositivo pegando el código.
 */
import { json, readJson, stripe, verify, licenseFromSubscription } from './_lib.js';

export async function onRequestPost({ request, env }) {
    try {
        if (!env.STRIPE_SECRET_KEY) return json({ error: 'Payment system not configured.' }, 500);
        const { token } = await readJson(request);
        const data = await verify(env, token);
        if (!data || typeof data.s !== 'string' || !data.s.startsWith('sub_')) return json({ error: 'Invalid code.' }, 401);

        const sub = await stripe(env, `subscriptions/${encodeURIComponent(data.s)}`);
        return json(await licenseFromSubscription(env, sub));
    } catch (err) {
        if (err.status === 404) return json({ active: false });
        return json({ error: 'Check failed.' }, 500);
    }
}
