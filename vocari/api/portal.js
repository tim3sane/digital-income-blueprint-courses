/**
 * POST /api/portal   { token }
 * Abre el portal de clientes de Paddle: cancelar, cambiar tarjeta, ver facturas.
 */
import { json, readJson, paddle, configured, verify } from './_lib.js';
export const config = { runtime: 'edge' };

export default async function handler(request) {
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
    const env = process.env;
    try {
        if (!configured(env)) return json({ error: 'Payment system not configured.' }, 503);
        const { token } = await readJson(request);
        const data = await verify(env, token);
        if (!data || !/^ctm_[a-z0-9]+$/.test(data.c || '') || !/^sub_[a-z0-9]+$/.test(data.s || '')) return json({ error: 'Invalid code.' }, 401);
        const session = await paddle(env, `/customers/${data.c}/portal-sessions`, { method: 'POST', body: { subscription_ids: [data.s] } });
        const url = session?.urls?.general?.overview;
        if (!url) throw new Error('no url');
        return json({ url });
    } catch (err) {
        return json({ error: 'Could not open portal.' }, 502);
    }
}
