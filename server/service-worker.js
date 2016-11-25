
// Created using this tutorial
// https://developers.google.com/web/fundamentals/primers/service-worker/?hl=en

const CACHE_NAME = 'vecka-14islands-com-cache-v3'
const urlsToCache = [
  '/',
  '/style.css',
  '/main-compiled.js',
  '/fonts/swedensans-webfont.woff',
  '/fonts/swedensans-webfont.woff2'
]

function addToCache (request, response) {
  if (response.ok) {
    const copy = response.clone()
    caches.open(CACHE_NAME).then(cache => {
      cache.put(request, copy)
    })
    return response
  }
}

function fetchFromCache (event) {
  return caches.match(event.request).then(response => {
    if (!response) {
      // A synchronous error that will kick off the catch handler
      throw Error('${event.request.url} not found in cache')
    }
    return response
  })
}

function offlineResponse () {
  return new Response('Sorry, the application is offline.')
}

function respondFromNetworkThenCache (event) {
  // Check network first, then cache
  const request = event.request
  event.respondWith(
    fetch(request)
      .then(response => addToCache(request, response))
      .catch(() => fetchFromCache(event))
      .catch(() => offlineResponse())
  )
}

function respondFromCacheThenNetwork (event) {
  // Check cache first, then network
  const request = event.request
  event.respondWith(
    fetchFromCache(event)
      .catch(() => fetch(request))
      .then(response => addToCache(request, response))
      //.catch(() => offlineResponse())
    )
}

// Open cache and store assets
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  )
})

self.addEventListener('fetch', function(event) {
  if (event.request.headers.get('Accept').indexOf('text/html') >= 0) {
    respondFromNetworkThenCache(event)
  } else {
    respondFromCacheThenNetwork(event)
  }
})

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME]
  // Clean up old cache versions
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      )
    })
  )
})
