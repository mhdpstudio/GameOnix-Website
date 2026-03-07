// Service Worker for automatic cache busting
// This forces the browser to always fetch fresh content from the server

const CACHE_NAME = 'xhyper-v1';

// Install event - activate immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate event - claim all clients immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Fetch event - network-first strategy to always get fresh content
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests (like Google Fonts, Font Awesome CDN)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Network-first strategy: try network, fall back to cache only if offline
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone the response before returning it
                const responseClone = response.clone();
                
                // Optionally cache the fresh response
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                
                return response;
            })
            .catch(() => {
                // If network fails, try to get from cache
                return caches.match(event.request);
            })
    );
});

