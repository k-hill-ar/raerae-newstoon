// 래래 뉴스툰 의견 보내기 (모아보기 화면 오른쪽 위 버튼)
// 로그인이 없으므로 이름을 직접 적고, 기기 정보는 자동으로 모아 함께 보낸다.
// 받는 곳: 넘버 브리지 서버의 /api/newstoon-feedback → 보호자 디스코드 (웹후크 주소는 서버 비밀 변수에만 있음)
(function () {
  var ENDPOINT = 'https://numberbridge2.knj0606.workers.dev/api/newstoon-feedback';
  var NAME_KEY = 'nt-feedback-name';
  var DRAFT_KEY = 'nt-feedback-draft';

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k) || ''; if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return ''; } }

  // 사람이 읽기 쉬운 기기 설명 만들기 (예: "안드로이드 14 · SM-A156N · 삼성 인터넷 · 화면 384×832")
  function deviceInfo() {
    var ua = navigator.userAgent || '';
    var os = '알 수 없음', model = '', br = '';
    var m;
    if ((m = ua.match(/Android\s([\d.]+)/))) {
      os = '안드로이드 ' + m[1];
      var mm = ua.match(/Android[^;)]*;\s*([^;)]+?)(?:\sBuild|\))/);
      if (mm && !/^(K|wv|Linux)$/.test(mm[1].trim())) model = mm[1].trim();
    } else if (/iPhone|iPad|iPod/.test(ua)) {
      m = ua.match(/OS (\d+)[_.](\d+)/);
      os = (/iPad/.test(ua) ? '아이패드' : '아이폰') + (m ? ' iOS ' + m[1] + '.' + m[2] : '');
    } else if (/Windows NT/.test(ua)) os = '윈도우 PC';
    else if (/Macintosh/.test(ua)) os = (navigator.maxTouchPoints > 1 ? '아이패드' : '맥');
    else if (/CrOS/.test(ua)) os = '크롬북';
    else if (/Linux/.test(ua)) os = '리눅스';
    if (/KAKAOTALK/i.test(ua)) br = '카카오톡 안에서 열림';
    else if (/NAVER\(inapp/i.test(ua)) br = '네이버 앱';
    else if (/SamsungBrowser/.test(ua)) br = '삼성 인터넷';
    else if (/Edg\//.test(ua)) br = '엣지';
    else if (/Whale/.test(ua)) br = '웨일';
    else if (/CriOS|Chrome\//.test(ua)) br = '크롬';
    else if (/FxiOS|Firefox/.test(ua)) br = '파이어폭스';
    else if (/Safari/.test(ua)) br = '사파리';
    var scr = '화면 ' + (screen.width || 0) + '×' + (screen.height || 0);
    return [os, model, br, scr].filter(Boolean).join(' · ');
  }

  var css = document.createElement('style');
  css.textContent =
    '.fb-btn{position:absolute;top:18px;right:16px;font-family:Jua,sans-serif;font-size:15px;background:var(--yellow);color:var(--ink);border:2.5px solid var(--ink);border-radius:999px;padding:6px 12px;box-shadow:3px 3px 0 var(--ink);cursor:pointer}' +
    '.fb-btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink)}' +
    '.fb-back{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;padding:16px;z-index:50}' +
    '.fb-back.on{display:flex}' +
    '.fb-box{width:100%;max-width:440px;background:var(--paper);border:3px solid var(--ink);border-radius:16px;box-shadow:5px 5px 0 var(--ink);padding:16px;max-height:calc(100vh - 32px);overflow:auto}' +
    '.fb-box h2{font-family:Jua,sans-serif;font-weight:400;margin:0 0 4px;font-size:22px}' +
    '.fb-box p{margin:0 0 12px;font-size:14px}' +
    '.fb-box label{display:block;font-family:Jua,sans-serif;margin:10px 0 4px}' +
    '.fb-box input,.fb-box textarea{width:100%;font:inherit;font-size:16px;border:2px solid var(--ink);border-radius:10px;padding:8px 10px;background:#fff}' +
    '.fb-box textarea{min-height:120px;resize:vertical}' +
    '.fb-dev{font-size:13px;color:var(--muted);background:#f5f1e6;border-radius:8px;padding:6px 8px;margin-top:10px;word-break:keep-all}' +
    '.fb-row{display:flex;gap:8px;margin-top:14px}' +
    '.fb-row button{flex:1;font-family:Jua,sans-serif;font-size:17px;border:2.5px solid var(--ink);border-radius:10px;padding:8px;cursor:pointer}' +
    '.fb-send{background:var(--yellow)}.fb-cancel{background:#fff}' +
    '.fb-msg{min-height:20px;margin-top:10px;font-size:14px;color:var(--red)}' +
    '.fb-msg.ok{color:#2c8a3e}' +
    '.fb-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}';
  document.head.appendChild(css);

  var wrap = document.querySelector('.wrap');
  wrap.style.position = 'relative';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'fb-btn';
  btn.textContent = '📮 의견 보내기';
  wrap.appendChild(btn);

  var back = document.createElement('div');
  back.className = 'fb-back';
  back.innerHTML =
    '<div class="fb-box" role="dialog" aria-modal="true" aria-labelledby="fbTitle">' +
    '<h2 id="fbTitle">📮 의견 보내기</h2>' +
    '<p>재미있었던 점, 고쳤으면 하는 점, 다뤄 줬으면 하는 뉴스를 알려 주세요!</p>' +
    '<label for="fbName">이름</label><input id="fbName" maxlength="20" autocomplete="nickname" placeholder="예: 에이든, 엄마">' +
    '<label for="fbText">의견</label><textarea id="fbText" maxlength="1000" placeholder="여기에 적어 주세요"></textarea>' +
    '<input class="fb-hp" id="fbHp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
    '<div class="fb-dev">📱 함께 보내는 기기 정보: <span id="fbDev"></span></div>' +
    '<div class="fb-msg" id="fbMsg" role="status"></div>' +
    '<div class="fb-row"><button type="button" class="fb-cancel" id="fbCancel">닫기</button><button type="button" class="fb-send" id="fbSend">보내기</button></div>' +
    '</div>';
  document.body.appendChild(back);

  var $ = function (id) { return document.getElementById(id); };
  var nameEl = $('fbName'), textEl = $('fbText'), msg = $('fbMsg'), send = $('fbSend');

  function say(t, ok) { msg.textContent = t; msg.className = 'fb-msg' + (ok ? ' ok' : ''); }
  function open() {
    nameEl.value = store(NAME_KEY);
    textEl.value = store(DRAFT_KEY);
    $('fbDev').textContent = deviceInfo();
    say('');
    back.classList.add('on');
    (nameEl.value ? textEl : nameEl).focus();
  }
  function close() { back.classList.remove('on'); }

  btn.addEventListener('click', open);
  $('fbCancel').addEventListener('click', close);
  back.addEventListener('click', function (e) { if (e.target === back) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  textEl.addEventListener('input', function () { store(DRAFT_KEY, textEl.value); });

  var ERR = {
    no_name: '이름을 적어 주세요.',
    too_short: '의견을 조금 더 적어 주세요.',
    too_many: '오늘은 의견을 많이 보냈어요. 내일 다시 보내 주세요.',
    not_configured: '아직 의견함이 준비되지 않았어요. 잠시 뒤에 다시 해 주세요.',
    discord_failed: '전달하지 못했어요. 잠시 뒤에 다시 보내 주세요.'
  };

  send.addEventListener('click', function () {
    var name = nameEl.value.trim(), text = textEl.value.trim();
    if (!name) { say(ERR.no_name); nameEl.focus(); return; }
    if (text.length < 2) { say(ERR.too_short); textEl.focus(); return; }
    send.disabled = true;
    say('보내는 중…', true);
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: name, text: text, device: deviceInfo(), page: location.pathname, hp: $('fbHp').value })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; });
    }).then(function (res) {
      if (res.ok && res.j.ok) {
        store(NAME_KEY, name);
        store(DRAFT_KEY, null);
        textEl.value = '';
        say('고마워요! 의견이 잘 전달됐어요 💛', true);
        setTimeout(close, 1500);
      } else if (res.j.error === 'too_fast') {
        say((res.j.wait || 30) + '초 뒤에 다시 보내 주세요.');
      } else {
        say(ERR[res.j.error] || '전달하지 못했어요. 잠시 뒤에 다시 보내 주세요.');
      }
    }).catch(function () {
      say('인터넷 연결을 확인하고 다시 보내 주세요.');
    }).then(function () { send.disabled = false; });
  });
})();
