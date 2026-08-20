/* eslint-disable no-restricted-globals */

// CRA는 빌드할 때마다 정적 파일 이름에 해시를 붙이므로 미리 캐싱할 목록을 알 수 없다.
// 그래서 앱 셸(index.html)과 아이콘만 설치 시 캐싱하고, 나머지 정적 파일은
// 요청이 들어올 때 런타임에 캐싱한다.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `nura-${CACHE_VERSION}`;
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // 아이콘 하나가 없어도 설치 자체가 실패하지 않도록 개별로 담는다.
      .then((cache) => Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // API 응답은 항상 최신이어야 하고 인증 정보가 섞여 있으므로 캐싱하지 않는다.
  if (url.pathname.startsWith('/api/')) return;

  // 화면 이동(SPA 라우팅)은 네트워크 우선, 오프라인이면 캐시된 앱 셸로 대체한다.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/index.html').then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // 정적 파일은 캐시 우선 + 백그라운드 갱신(stale-while-revalidate).
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
