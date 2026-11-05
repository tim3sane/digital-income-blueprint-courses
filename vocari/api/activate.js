// Vercel Edge Function → /api/activate  (la lógica está en _activate.js)
import { onRequestGet } from './_activate.js';
import { json } from './_lib.js';
export const config = { runtime: 'edge' };
export default function handler(request) {
    if (request.method !== 'GET') return json({ error: 'Method not allowed.' }, 405);
    return onRequestGet({ request, env: process.env });
}
