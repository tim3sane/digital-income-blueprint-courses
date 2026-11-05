// Vercel Edge Function → /api/portal  (la lógica está en _portal.js)
import { onRequestPost } from './_portal.js';
import { json } from './_lib.js';
export const config = { runtime: 'edge' };
export default function handler(request) {
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
    return onRequestPost({ request, env: process.env });
}
