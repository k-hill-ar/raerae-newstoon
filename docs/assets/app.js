// 래래 뉴스툰 앱 기능 (모아보기 화면)
// - 서비스 워커 등록: 앱 설치(홈 화면 추가)와 알림에 필요
// - 🔔 알림 버튼: 새 만화가 올라오면 기기로 알림 받기 (넘버 브리지 서버의 /api/newstoon-push/*)
// feedback.js 다음에 불러온다 (의견 창 모양과 기기 정보를 같이 쓴다).
(function () {
  var API = 'https://numberbridge2.knj0606.workers.dev/api/newstoon-push';
  var NAME_KEY = 'nt-feedback-name';
  var canPush = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var regReady = 'serviceWorker' in navigator ? navigator.serviceWorker.register('sw.js').then(function () { return navigator.serviceWorker.ready; }) : Promise.reject(new Error('no sw'));
  regReady.catch(function () {});

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k) || ''; localStorage.setItem(k, v); } catch (e) { return ''; } }
  function device() { return window.ntDeviceInfo ? window.ntDeviceInfo() : navigator.userAgent.slice(0, 80); }
  function b64ToBytes(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
    var raw = atob(s), out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }
  function post(path, body) {
    return fetch(API + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._ok = r.ok; return j; }); });
  }

  // 오른쪽 위 버튼 묶음 (의견 보내기 버튼을 옆으로 옮겨 온다)
  var css = document.createElement('style');
  css.textContent = '.top-btns{position:absolute;top:18px;right:16px;display:flex;gap:8px}' +
    '.top-btns .fb-btn{position:static}' +
    '.bell.on{background:#9be39b}';
  document.head.appendChild(css);
  var wrap = document.querySelector('.wrap');
  var box = document.createElement('div');
  box.className = 'top-btns';
  var bell = document.createElement('button');
  bell.type = 'button';
  bell.className = 'fb-btn bell';
  bell.textContent = '🔔 알림';
  box.appendChild(bell);
  var fb = document.querySelector('.fb-btn:not(.bell)');
  if (fb) box.appendChild(fb);
  wrap.appendChild(box);

  // 알림 창 (의견 창과 같은 모양)
  var back = document.createElement('div');
  back.className = 'fb-back';
  back.innerHTML = '<div class="fb-box" role="dialog" aria-modal="true" aria-labelledby="ntTitle">' +
    '<h2 id="ntTitle">🔔 새 만화 알림</h2><div id="ntBody"></div>' +
    '<div class="fb-msg" id="ntMsg" role="status"></div>' +
    '<div class="fb-row" id="ntBtns"></div></div>';
  document.body.appendChild(back);
  var $ = function (id) { return document.getElementById(id); };
  function say(t, ok) { $('ntMsg').textContent = t; $('ntMsg').className = 'fb-msg' + (ok ? ' ok' : ''); }
  function close() { back.classList.remove('on'); }
  back.addEventListener('click', function (e) { if (e.target === back) close(); });
  function buttons(list) {
    var row = $('ntBtns'); row.innerHTML = '';
    list.forEach(function (b) {
      var el = document.createElement('button'); el.type = 'button'; el.className = b.cls; el.textContent = b.label;
      el.addEventListener('click', function () { b.fn(el); }); row.appendChild(el);
    });
  }

  function currentSub() {
    if (!canPush) return Promise.resolve(null);
    return regReady.then(function (reg) { return reg.pushManager.getSubscription(); }).catch(function () { return null; });
  }
  function refreshBell() {
    currentSub().then(function (s) {
      var on = !!s && Notification.permission === 'granted';
      bell.classList.toggle('on', on);
      bell.textContent = on ? '🔔 알림 켜짐' : '🔔 알림';
    });
  }
  refreshBell();

  function showUnsupported() {
    $('ntBody').innerHTML = isIOS && !standalone
      ? '<p>아이폰·아이패드는 먼저 <b>앱으로 설치</b>해야 알림을 받을 수 있어요.</p><p>사파리 아래쪽 <b>공유 버튼(□↑)</b> → <b>홈 화면에 추가</b>를 누른 뒤, 홈 화면의 <b>래래툰</b> 앱을 열고 이 버튼을 다시 눌러 주세요.</p>'
      : '<p>이 브라우저는 알림을 지원하지 않아요.</p><p>안드로이드는 <b>크롬</b>이나 <b>삼성 인터넷</b>으로 열어 주세요. 카카오톡 안에서 열었다면 오른쪽 위 메뉴에서 <b>다른 브라우저로 열기</b>를 눌러 주세요.</p>';
    buttons([{ label: '닫기', cls: 'fb-cancel', fn: close }]);
  }

  function showOff() {
    $('ntBody').innerHTML = '<p>새 만화가 올라오면 이 기기로 알려 줄게요. 누가 받는지 알 수 있게 이름을 적어 주세요.</p>' +
      '<label for="ntName">이름</label><input id="ntName" maxlength="20" placeholder="예: 라이언, 아빠">' +
      '<div class="fb-dev">📱 이 기기: ' + device() + '</div>';
    $('ntName').value = store(NAME_KEY);
    buttons([{ label: '닫기', cls: 'fb-cancel', fn: close }, { label: '알림 켜기', cls: 'fb-send', fn: turnOn }]);
  }

  function showOn(sub) {
    $('ntBody').innerHTML = '<p>알림이 켜져 있어요. 새 만화가 올라오면 이 기기로 알려 줘요.</p><div class="fb-dev">📱 이 기기: ' + device() + '</div>';
    buttons([
      { label: '알림 끄기', cls: 'fb-cancel', fn: function (el) { turnOff(sub, el); } },
      { label: '테스트 알림', cls: 'fb-send', fn: function (el) { test(sub, el); } },
    ]);
  }

  function turnOn(el) {
    var name = ($('ntName').value || '').trim();
    if (!name) { say('이름을 적어 주세요.'); $('ntName').focus(); return; }
    el.disabled = true; say('알림을 켜는 중…', true);
    Notification.requestPermission().then(function (perm) {
      if (perm !== 'granted') throw new Error(perm === 'denied' ? 'denied' : 'dismissed');
      return Promise.all([regReady, fetch(API + '/key').then(function (r) { return r.json(); })]);
    }).then(function (res) {
      var reg = res[0], key = res[1].key;
      return reg.pushManager.getSubscription().then(function (old) {
        return old || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(key) });
      });
    }).then(function (sub) {
      return post('/subscribe', { sub: sub.toJSON(), name: name, device: device() }).then(function (j) {
        if (!j._ok) throw new Error(j.error || 'server');
        store(NAME_KEY, name);
        say('알림이 켜졌어요! 아래 테스트 알림으로 확인해 보세요.', true);
        refreshBell(); showOn(sub);
      });
    }).catch(function (e) {
      say(e.message === 'denied'
        ? '알림이 막혀 있어요. 브라우저(앱) 설정 → 사이트 설정 → 알림에서 허용으로 바꿔 주세요.'
        : e.message === 'dismissed' ? '알림 허용을 눌러 주셔야 켤 수 있어요.' : '알림을 켜지 못했어요. 잠시 뒤에 다시 해 주세요.');
    }).then(function () { el.disabled = false; });
  }

  function turnOff(sub, el) {
    el.disabled = true;
    post('/unsubscribe', { endpoint: sub.endpoint }).catch(function () {}).then(function () { return sub.unsubscribe(); })
      .then(function () { say('알림을 껐어요.', true); refreshBell(); showOff(); })
      .catch(function () { say('알림을 끄지 못했어요.'); })
      .then(function () { el.disabled = false; });
  }

  function test(sub, el) {
    el.disabled = true; say('보내는 중…', true);
    post('/test', { endpoint: sub.endpoint }).then(function (j) {
      if (j._ok) say('보냈어요! 잠시 뒤 알림이 와요. (최신 만화가 보여요)', true);
      else if (j.error === 'too_fast') say('1분 뒤에 다시 눌러 주세요.');
      else if (j.error === 'not_subscribed') { say('알림을 다시 켜 주세요.'); showOff(); }
      else say('보내지 못했어요. 잠시 뒤에 다시 해 주세요.');
    }).catch(function () { say('인터넷 연결을 확인해 주세요.'); }).then(function () { el.disabled = false; });
  }

  bell.addEventListener('click', function () {
    say('');
    back.classList.add('on');
    if (!canPush) { showUnsupported(); return; }
    currentSub().then(function (s) { if (s && Notification.permission === 'granted') showOn(s); else showOff(); });
  });
})();
