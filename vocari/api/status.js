/**
 * POST /api/status   { token }
 * La app lo llama como máximo una vez al día para renovar la fecha de vencimiento local,
 * y también al pegar un código de restauración en otro dispositivo.
 */
import { json, readJson, paddle, configured, verify, licenseFromSubscription } from './_lib.js';
export const config = { runtime: 'edge' };

export default async function handler(request) {
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
    const env = process.env;
    try {
        if (!configured(env)) return json({ error: 'Payment system not configured.' }, 503);
        const { token } = await readJson(request);
        const data = await verify(env, token);
        if (!data || typeof data.s !== 'string' || !/^sub_[a-z0-9]+$/.test(data.s)) return json({ error: 'Invalid code.' }, 401);
        const sub = await paddle(env, `/subscriptions/${data.s}`);
        return json(await licenseFromSubscription(env, sub));
    } catch (err) {
        if (err.status === 404) return json({ active: false });
        return json({ error: 'Check failed.' }, 502);
    }
}
