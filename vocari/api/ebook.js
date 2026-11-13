/**
 * GET /api/ebook?txn=txn_...
 * Entrega el PDF de la Guía Vocari solo si la transacción de Paddle está pagada y corresponde a la guía.
 */
import { json, paddle, configured, validTxn, PAID } from './_lib.js';
import { EBOOK_B64, EBOOK_FILENAME } from './_ebook.js';
export const config = { runtime: 'edge' };

export default async function handler(request) {
    if (request.method !== 'GET') return json({ error: 'Method not allowed.' }, 405);
    const env = process.env;
    try {
        if (!configured(env)) return json({ error: 'Payment system not configured.' }, 503);
        const url = new URL(request.url);
        const id = url.searchParams.get('txn');
        if (!validTxn(id)) return json({ error: 'Invalid transaction.' }, 400);
        const txn = await paddle(env, `/transactions/${id}`);
        if (txn.custom_data?.app !== 'vocari' || txn.custom_data?.item !== 'ebook') return json({ error: 'Invalid transaction.' }, 400);
        if (!PAID.includes(txn.status)) return json({ error: 'Pending.' }, 409);
        if (url.searchParams.get('check') === '1') return json({ ok: true });

        const bytes = Uint8Array.from(atob(EBOOK_B64), c => c.charCodeAt(0));
        return new Response(bytes, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${EBOOK_FILENAME}"`,
                'Cache-Control': 'private, no-store',
            },
        });
    } catch (err) {
        return json({ error: 'Download failed.' }, err.status === 404 ? 404 : 502);
    }
}
