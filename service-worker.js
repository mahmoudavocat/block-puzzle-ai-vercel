const CACHE = "block-puzzle-cache-v1";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// ✅ أهم نقطة: لا تستخدم skipWaiting بدون تنسيق
// ❌ self.skipWaiting() ← هذه هي سبب ال reload loop
self.addEventListener("install", () => {
  console.log("📦 Service Worker Installed");
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE) return caches.delete(key);
      }))
    )
  );
  console.log("🧹 Service Worker Activated and Old Caches Cleared");
});

workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
        purgeOnQuotaError: true
      })
    ]
  })
);

// ✅ باقي الملفات (صور، CSS، JS)
workbox.routing.registerRoute(
  ({ request }) =>
    ['style', 'script', 'worker', 'image'].includes(request.destination),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'block-puzzle-static-v1'
  })
);
