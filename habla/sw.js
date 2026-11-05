// Habla — service worker: la app funciona sin internet y se actualiza sola en segundo plano.
const C = 'habla-v2';
const FILES = ['./', './index.html', './app.html', './app.js', './vocab.js', './site.css', './site.js', './manifest.json', './icon.svg',
  './privacidad.html', './terminos.html', './reembolsos.html'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('habla-') && x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  const key = url.pathname.endsWith('/app.html') ? './app.html' : e.request; // ignora ?session_id
  e.respondWith(caches.open(C).then(async c => {
    const hit = await c.match(key);
    const net = fetch(e.request).then(r => { if (r.ok && !url.search) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
