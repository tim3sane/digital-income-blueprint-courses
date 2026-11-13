// Vocari se publica aparte en Vercel. Este sitio (Cloudflare Pages) no debe servir sus archivos
// (incluye el PDF pagado de la guía), así que respondemos 404 a todo lo que esté bajo esta carpeta.
export function onRequest() {
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
}
