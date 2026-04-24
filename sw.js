const CACHE_NAME = 'ultraforce-360-v2';
const ASSETS = [
    '/',
    'fuerza.html',
    'postulacion.html',
    'ultraforce.css',
    'ultraforce.js',
    'manifest.json',
    'images/logo.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => {
            return caches.match(e.request).then((res) => {
                if (res) return res;
                if (e.request.destination === 'document') {
                    return caches.match('fuerza.html');
                }
            });
        })
    );
});
