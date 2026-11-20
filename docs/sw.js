/* 래래 뉴스툰 서비스 워커
   - 앱 설치(홈 화면 추가)가 되도록 하고, 인터넷이 끊겼을 때 마지막으로 본 화면을 보여 준다.
   - 새 뉴스 알림: 알림 서버가 '새 뉴스 있음' 신호만 보내면, 여기서 모아보기 화면을 읽어
     가장 최근 만화의 제목과 주소로 알림을 띄운다. */
const CACHE = 'raeraetoon-v1';
const BASE = new URL('./', self.location).href;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
));

// 매일 새 만화가 올라오므로 항상 인터넷 먼저, 안 될 때만 저장본을 쓴다.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(BASE)) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok && (req.mode === 'navigate' || /\/assets\/|\/icons\//.test(req.url))) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then((r) => r || caches.match(BASE)))
  );
});

// 모아보기 화면에서 맨 위 뉴스(고정 항목 제외) 찾기
async function latestNews() {
  try {
    const html = await (await fetch(BASE + '?t=' + Date.now(), { cache: 'no-store' })).text();
    const part = html.split('<!-- 새 뉴스는')[1] || html;
    const m = part.match(/<a class="item" href="([^"]+)"[\s\S]*?<span class="date">([^<]*)<\/span>[\s\S]*?<span class="title">([^<]*)<\/span>/);
    if (m) return { url: BASE + m[1], date: m[2].trim(), title: m[3].trim() };
  } catch (e) { /* 아래 기본 알림 */ }
  return null;
}

self.addEventListener('push', (e) => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch (err) { data = {}; }
  e.waitUntil((async () => {
    const n = data.test ? { title: '알림 테스트', url: BASE } : await latestNews();
    const title = data.test ? '🔔 래래툰 알림이 잘 와요!' : '📰 래래툰 새 만화가 올라왔어요!';
    const body = data.test ? '새 만화가 올라오면 이렇게 알려 줄게요.' : (n ? `${n.title}\n${n.date}` : '눌러서 오늘의 만화를 봐요!');
    await self.registration.showNotification(title, {
      body,
      icon: BASE + 'icons/icon-192.png',
      badge: BASE + 'icons/badge-96.png',
      tag: 'raeraetoon-news',
      renotify: true,
      data: { url: (n && n.url) || BASE },
    });
  })());
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || BASE;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) if (c.url.startsWith(BASE) && 'focus' in c) { c.navigate(url); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
