// Service worker for ShapNa PWA
const CACHE_NAME = "shapna-cache-v1"

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/placeholder.svg",
  "/images/shapna-logo.png",
]

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
}

// URL patterns and their corresponding cache strategies
const URL_CACHE_STRATEGIES = [
  { urlPattern: /\/api\//, strategy: CACHE_STRATEGIES.NETWORK_FIRST },
  { urlPattern: /\.(js|css|png|jpg|jpeg|svg|gif|webp)$/, strategy: CACHE_STRATEGIES.CACHE_FIRST },
  { urlPattern: /\/shop\//, strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE },
  { urlPattern: /\/product\//, strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE },
  { urlPattern: /\/categories\//, strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE },
  // Default strategy for other routes
  { urlPattern: /.*/, strategy: CACHE_STRATEGIES.NETWORK_FIRST },
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker...")
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell and static assets")
      return cache.addAll(STATIC_ASSETS)
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("[Service Worker] Removing old cache:", name)
            return caches.delete(name)
          }),
      )
    }),
  )
  return self.clients.claim()
})

// Helper function to determine cache strategy based on request URL
function getCacheStrategy(url) {
  const matchedStrategy = URL_CACHE_STRATEGIES.find(({ urlPattern }) => urlPattern.test(url))
  return matchedStrategy ? matchedStrategy.strategy : CACHE_STRATEGIES.NETWORK_FIRST
}

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  const strategy = getCacheStrategy(event.request.url)

  if (strategy === CACHE_STRATEGIES.CACHE_FIRST) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Update cache in the background
          fetch(event.request)
            .then((response) => {
              if (response.ok) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, response.clone())
                })
              }
            })
            .catch(() => {})
          return cachedResponse
        }

        return fetch(event.request).then((response) => {
          if (response.ok) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return response
        })
      }),
    )
  } else if (strategy === CACHE_STRATEGIES.NETWORK_FIRST) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match("/")
          })
        }),
    )
  } else if (strategy === CACHE_STRATEGIES.STALE_WHILE_REVALIDATE) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone())
              })
            }
            return networkResponse
          })
          .catch(() => {
            // If network fails and we don't have a cached response, try to return the homepage
            if (!cachedResponse) {
              return caches.match("/")
            }
            throw new Error("Network and cache both failed")
          })

        return cachedResponse || fetchPromise
      }),
    )
  }
})

// Handle offline fallbacks
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/") || caches.match("/offline.html")
      }),
    )
  }
})

// Background sync for offline form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-forms") {
    event.waitUntil(syncForms())
  }
})

// Push notification support
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})

// Helper function for syncing forms (placeholder for actual implementation)
async function syncForms() {
  // Implementation would retrieve stored form data and submit it
  console.log("[Service Worker] Syncing forms")
  return Promise.resolve()
}

