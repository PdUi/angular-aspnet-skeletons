const CACHE_NAME = 'ng-custom-cache-v1';
const urlsToCache = [
  './',
  './shim.min.js',
  './zone.min.js',
  './build.js'
];
const cacheWhitelist = ['ng-custom-cache-v1'];

self.addEventListener('install', (event: any) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(resp) {
            // Check if we received a valid response
            if (!resp || resp.status !== 200 || resp.type !== 'basic') {
              return resp;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = resp.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return resp;
          }
        );
      })
    );
});

self.addEventListener('activate', (event: any) => {
  console.log('[ServiceWorker] Activate');

  event.waitUntil(caches.keys().then((cacheNames: any) => {
      return Promise.all(cacheNames.map((cacheName: any) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[ServiceWorker] Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  return (<any> self).clients.claim();
});
