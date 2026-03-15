// Service Worker for automatic cache busting

const CACHE_NAME = 'xhyper-v2';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {

    // مهم جدا: لا تتعامل مع الملفات المحلية في Electron
    if (self.location.protocol === 'file:') {
        return;
    }

    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {

                const responseClone = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });

                return response;
            })
            .catch(async () => {

                const cachedResponse = await caches.match(event.request);

                if (cachedResponse) {
                    return cachedResponse;
                }

                return new Response("Offline", {
                    status: 503,
                    statusText: "Offline"
                });

            })
    );
});