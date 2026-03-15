// ============================================================
//  Service Worker — Enseignements PWA
//  Stratégie : Network First avec cache de la shell GitHub Pages.
//  Le contenu GAS (données) n'est PAS mis en cache (dynamique + auth).
// ============================================================

const CACHE_NAME    = 'enseignements-shell-v1';
const SHELL_ASSETS  = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

// ─── Installation : mise en cache des assets statiques de la shell ────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Mise en cache de la shell');
        return cache.addAll(SHELL_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Erreur cache install:', err))
  );
});

// ─── Activation : nettoyer les anciens caches ──────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Suppression ancien cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => clients.claim())
  );
});

// ─── Interception des requêtes ─────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Requêtes vers GAS (script.google.com) : Network Only — jamais mettre en cache
  //    Les données sont dynamiques et nécessitent une session Google authentifiée.
  if (url.hostname.includes('google.com') || url.hostname.includes('googleapis.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. Assets de la shell GitHub Pages : Cache First (installation rapide)
  if (SHELL_ASSETS.some(asset => url.pathname === asset || url.pathname === '/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        // Retourner le cache immédiatement, puis revalider en arrière-plan
        const networkFetch = fetch(event.request).then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => null);

        return cached || networkFetch;
      })
    );
    return;
  }

  // 3. Toutes les autres requêtes : Network First avec fallback cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// ─── Message : forcer la mise à jour depuis l'app ─────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
