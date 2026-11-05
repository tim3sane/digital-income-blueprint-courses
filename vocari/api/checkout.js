// Vercel Edge Function → /api/checkout  (la lógica está en _checkout.js)
import { onRequestPost } from './_checkout.js';
import { json } from './_lib.js';
export const config = { runtime: 'edge' };
export default function handler(request) {
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
    return onRequestPost({ request, env: process.env });
}
