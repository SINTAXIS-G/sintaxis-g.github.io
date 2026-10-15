// ============================================================
// SINTAXIS G — Service Worker: cache-as-you-go, no precache manifest.
// Filosofía: "funciona offline para lo que ya visitaste", no "todo el
// sitio precacheado mágicamente" -- un manifest exhaustivo se desincroniza
// del repo real apenas se agrega una página, así que en vez de mantenerlo
// cacheamos cada página/asset la primera vez que se pide con éxito.
// Red primero (contenido siempre fresco si hay conexión), cache como
// respaldo si falla. Nunca toca orígenes externos (CDN de Three.js,
// Google Fonts) -- eso lo cachea el navegador solo con sus propios headers.
// ============================================================

const CACHE_NAME = 'sintaxis-g-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      // "Red primero" solo es de verdad red primero si el fetch no puede
      // resolverse con la caché HTTP normal del navegador -- sin esto,
      // un archivo servido sin headers agresivos de no-cache (como los
      // está mandando un servidor estático simple) puede devolver una
      // respuesta vieja de la caché del navegador, no una del Service
      // Worker, y "red primero" termina sirviendo contenido viejo igual.
      fetch(event.request, { cache: 'no-store' })
        .then((response) => {
          if (response && response.ok) cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => cache.match(event.request).then((cached) => cached || Response.error()))
    )
  );
});
