// 서비스 워커는 프로덕션 빌드에서만 등록한다.
// 개발 서버(npm start)에서는 캐시 때문에 수정 사항이 안 보이는 문제가 생겨서 등록하지 않고,
// 이전에 등록된 워커가 남아 있으면 해제한다.
export function register() {
  if (!('serviceWorker' in navigator)) return;

  if (process.env.NODE_ENV !== 'production') {
    unregister();
    return;
  }

  // PUBLIC_URL이 다른 도메인이면 서비스 워커가 동작하지 않는다.
  const publicUrl = new URL(process.env.PUBLIC_URL || '', window.location.href);
  if (publicUrl.origin !== window.location.origin) return;

  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.error('서비스 워커 등록 실패:', error);
    });
  });
}

export function unregister() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready
    .then((registration) => registration.unregister())
    .catch(() => {});
}
