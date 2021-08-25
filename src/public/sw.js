const offlinePage = `paint.html`;
const cacheName = 'app_cache_poke';
const files = [
    `./paint.html`,
    `./pokeball128128.png`,
    `./pokeball256256.png`,
    `./manifest.json`
];

this.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(files);
        })
    );
    event.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        await cache.add(new Request(offlinePage, { cache: 'reload' }));
    })());
});

this.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(cacheNamesLocal => {
            return Promise.all(
                cacheNamesLocal
                    .filter(cacheNameLocal => (cacheNameLocal.startsWith(cacheName)))
                    .filter(cacheNameLocal => (cacheNameLocal !== cacheName))
                    .map(cacheNameLocal => caches.delete(cacheNameLocal))
            );
        })
    );
});


this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                console.log('Retornando OFFLINE_URL...');
                return caches.match(offlinePage);
            })
    )
});