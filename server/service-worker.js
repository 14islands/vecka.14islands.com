
console.log('Service Worker loading...')

// Created using this tutorial
// https://developers.google.com/web/fundamentals/primers/service-worker/?hl=en

var CACHE_NAME = 'vecka-14islands-com-cache-v2';
var urlsToCache = [
  '/',
  '/style.css',
  '/main-compiled.js',
  '/fonts/swedensans-webfont.woff',
  '/fonts/swedensans-webfont.woff2'
];

// Open cache and store assets
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker install and cache open', CACHE_NAME, cache);
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Service Worker fetch call', CACHE_NAME)
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('Service Worker returning same cache response', event.request, response)
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activate')
  var cacheWhitelist = [CACHE_NAME];

  // Clean up old cache versions
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Service Worker activate', cacheWhitelist, cacheName, (cacheWhitelist.indexOf(cacheName) === -1))
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
