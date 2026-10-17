const CACHE_NAME = "grand-pelerinage-v2";
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/favicon.ico",
  "/icon-192.png",
  "/icon-512.png"
];

// 1. Installation : Pré-mise en cache des ressources critiques
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activation : Nettoyage des anciennes versions de cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Stratégie de récupération (Fetch) :
// - Cache-First pour les assets immuables (images, fonts, bundles hashés)
// - Network-First avec fallback Cache pour les navigations HTML
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Ignorer les requêtes d'API externes temps réel (Firebase Firestore, Auth, Brevo)
  if (
    url.hostname.includes("firestore.googleapis.com") ||
    url.hostname.includes("identitytoolkit.googleapis.com") ||
    url.hostname.includes("api.brevo.com") ||
    url.hostname.includes("chrome-extension")
  ) {
    return;
  }

  // Navigation HTML principale : Network-First avec repli sur le cache
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match("/index.html").then((cached) => cached || caches.match("/"));
        })
    );
    return;
  }

  // Assets statiques et polices : Cache-First avec remplissage dynamique
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === "opaque") {
            return networkResponse;
          }
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(() => {
          // Si image manquante en hors-ligne, fallback sur favicon.svg
          if (event.request.destination === "image") {
            return caches.match("/favicon.svg");
          }
        });
    })
  );
});