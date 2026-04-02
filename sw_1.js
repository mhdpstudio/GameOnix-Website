// Service Worker for automatic cache busting

const CACHE_NAME = 'xhyper-v5';

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

    if (self.location.protocol === 'file:') return;

    if (event.request.method !== "GET") return;

    if (!event.request.url.startsWith(self.location.origin)) return;

    // ❌ تجاهل الفيديوهات (Range requests)
    if (event.request.destination === "video") {
        return;
    }

    // BYPASS CACHE FOR DOWNLOADS
    if (
        event.request.url.includes('/downloads/') || 
        event.request.url.endsWith('.torrent') ||
        event.request.headers.get('accept')?.includes('octet-stream')
    ) {
        return fetch(event.request);
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {

                // ❌ تجاهل partial responses (206)
                if (!response || response.status !== 200) {
                    return response;
                }

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