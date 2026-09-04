const CACHE_NAME = "tirage-au-sort-v1";

// Chemins relatifs : fonctionne aussi bien à la racine d'un domaine
// que dans un sous-dossier de type github.io/mon-repo/
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((noms) =>
      Promise.all(
        noms
          .filter((nom) => nom !== CACHE_NAME)
          .map((nom) => caches.delete(nom))
      )
    )
  );
  self.clients.claim();
});

// Stratégie : cache d'abord, réseau en secours (et mise à jour du cache).
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((reponseCache) => {
      const fetchPromise = fetch(event.request)
        .then((reponseReseau) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, reponseReseau.clone());
          });
          return reponseReseau;
        })
        .catch(() => reponseCache);

      return reponseCache || fetchPromise;
    })
  );
});
