/* 래래 뉴스툰 영재원 특별편 공용 도구 (newstoon.js 다음에 불러옴)
   - 소품: snowfall(), flake(), needle(), magnifier(), drop(), board(), field(), room(), camera(), thermo()
   - 움직임: bob(svg,'d1'|'d2'), hop(svg)  /  initPlayer(): 컷 등장·말풍선 순서 애니메이션 + 다시 보기 버튼
*/
const W = '#7ec8ff', G = '#ffe14d';
const bob = (svg, d) => `<g class="bob ${d || ''}">${svg}</g>`;
const hop = (svg) => `<g class="hop">${svg}</g>`;

/* 떨어지는 눈 (x0~x0+w 범위) */
function snowfall(n, seed, x0, w, big) {
  let a = seed, out = '';
  const rnd = () => (a = (a * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) {
    const x = x0 + rnd() * w, y = rnd() * 310, r = (big ? 2.2 : 1.4) + rnd() * 2.2;
    const dur = (5 + rnd() * 5).toFixed(1), del = (-rnd() * 10).toFixed(1);
    out += `<circle class="sn" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(.7 + rnd() * .3).toFixed(2)}" style="animation-duration:${dur}s;animation-delay:${del}s"/>`;
  }
  return out;
}

/* 여섯 갈래 눈 결정. draw=true면 컷에 들어올 때 선이 그려짐 */
function flake(x, y, r, o) {
  o = o || {};
  const col = o.color || '#2f6fde', sw = o.sw || 4;
  let d = '';
  for (let i = 0; i < 6; i++) {
    const t = (i * 60 - 90) * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
    d += `<path pathLength="1" d="M 0 0 L ${(c * r).toFixed(1)} ${(s * r).toFixed(1)}"/>`;
    [[.45, .32], [.72, .22]].forEach(([p, l]) => {
      const bx = c * r * p, by = s * r * p;
      [-1, 1].forEach(k => {
        const t2 = t + k * Math.PI / 3;
        d += `<path pathLength="1" d="M ${bx.toFixed(1)} ${by.toFixed(1)} L ${(bx + Math.cos(t2) * r * l).toFixed(1)} ${(by + Math.sin(t2) * r * l).toFixed(1)}"/>`;
      });
    });
  }
  const hex = Array.from({ length: 6 }, (_, i) => { const t = (i * 60 - 90) * Math.PI / 180; return `${(Math.cos(t) * r * .18).toFixed(1)},${(Math.sin(t) * r * .18).toFixed(1)}`; }).join(' ');
  return `<g transform="translate(${x} ${y})"><g class="${o.spin === false ? '' : 'spin'}">
    <g class="${o.draw ? 'draw' : ''}" stroke="${INK}" stroke-width="${sw + 4}" stroke-linecap="round" fill="none">${d}</g>
    <g class="${o.draw ? 'draw' : ''}" stroke="${o.fill || '#e6f3ff'}" stroke-width="${sw}" stroke-linecap="round" fill="none">${d}</g>
    <polygon points="${hex}" fill="${col}" stroke="${INK}" stroke-width="2"/></g></g>`;
}
/* 바늘 모양 눈 */
const needle = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="-26" width="10" height="52" rx="3" fill="#e6f3ff" ${S}/><rect x="9" y="-20" width="8" height="40" rx="3" fill="#e6f3ff" ${S}/></g>`;
/* 돋보기 */
const magnifier = (x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot || 0}) scale(${s})">
  <rect x="-7" y="34" width="14" height="52" rx="6" fill="#8a5a2b" ${S}/>
  <circle r="38" fill="#dff1ff" fill-opacity=".55" stroke="${INK}" stroke-width="7"/><circle r="38" fill="none" stroke="#c9a227" stroke-width="3"/>
  <path d="M -20 -14 Q -14 -24 -2 -26" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
/* 물 알갱이 (얼굴 있는 동그라미) */
const drop = (x, y, r) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#7ec8ff" ${S}/>
  <circle cx="${-r * .3}" cy="${-r * .1}" r="${r * .12}" fill="${INK}"/><circle cx="${r * .3}" cy="${-r * .1}" r="${r * .12}" fill="${INK}"/>
  <path d="M ${-r * .3} ${r * .25} Q 0 ${r * .5} ${r * .3} ${r * .25}" stroke="${INK}" stroke-width="2" fill="none"/></g>`;
/* 전광판 (원작과 같은 모양) */
function board(x, y, w, h, title, rows, fs) {
  fs = fs || 17;
  const gap = (h - 50) / rows.length;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#1f4d3a" ${S}/>
    <text x="${x + w / 2}" y="${y + 30}" font-family="Jua" font-size="${fs + 3}" text-anchor="middle" fill="#ffe14d">${title}</text>
    <line x1="${x + 10}" y1="${y + 42}" x2="${x + w - 10}" y2="${y + 42}" stroke="#3c7a5e" stroke-width="2"/>` +
    rows.map((r, i) => `<text x="${x + 16}" y="${y + 42 + gap * (i + .5) + fs * .35}" font-family="Jua" font-size="${fs}" fill="${r[1] || '#fff'}">${r[0]}</text>`).join('');
}
const field = () => `<rect width="400" height="300" fill="#bfe3ff"/><path d="M 0 214 Q 200 186 400 214 V 300 H 0 Z" fill="#5fae5a" stroke="${INK}" stroke-width="3"/>
  <path d="M 150 300 L 200 236 L 250 300 Z" fill="#d9a066" stroke="${INK}" stroke-width="3"/>`;
const room = () => `<rect width="400" height="300" fill="#fff4d6"/><rect x="0" y="232" width="400" height="68" fill="#e9c99a" stroke="${INK}" stroke-width="3"/>`;
/* 사진기 (옛날 상자 카메라) */
const camera = (x, y) => `<g transform="translate(${x} ${y})"><path d="M -6 40 L -26 96 M 6 40 L 26 96 M 0 40 V 96" stroke="${INK}" stroke-width="4"/>
  <rect x="-34" y="-4" width="56" height="44" rx="4" fill="#6b4a2b" ${S}/><path d="M 22 4 L 50 -4 L 50 46 L 22 36 Z" fill="#3a2a1e" ${S}/>
  <circle cx="54" cy="21" r="9" fill="#bfe3ff" ${S}/></g>`;
/* 온도계 */
const thermo = (x, y, h) => `<g transform="translate(${x} ${y})"><rect x="-9" y="0" width="18" height="${h}" rx="9" fill="#fff" ${S}/>
  <rect x="-4" y="${h * .45}" width="8" height="${h * .55}" fill="#4a8df0"/><circle cx="0" cy="${h + 8}" r="15" fill="#4a8df0" ${S}/></g>`;


function initPlayer() {

function playPanel(el) {
  el.classList.remove('in'); void el.offsetWidth;
  el.querySelectorAll('.nar, .b').forEach((b, i) => { b.style.animationDelay = (0.15 + i * 0.5) + 's'; });
  el.classList.add('in');
}
const panels = Array.from(document.querySelectorAll('#panels .panel'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { playPanel(e.target); io.unobserve(e.target); } }), { threshold: .45 });
  panels.forEach(p => io.observe(p));
}
document.getElementById('replay').addEventListener('click', () => {
  panels[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  panels.forEach((p, i) => setTimeout(() => playPanel(p), 250 + i * 120));
});
}

/* ── 날짜 잠금 ──
   각 회차는 한국 시간 그 날짜 0시에 자동으로 열린다.
   그 전에는 부모님 비밀번호로 미리 볼 수 있다 (이 브라우저 창을 닫으면 다시 잠김).
   비밀번호는 원문이 아니라 SHA-256 값만 저장한다. 바꾸려면 새 비밀번호의 SHA-256 값으로 교체. */
const GIFTED_PW_HASH = '01287c14b587fecc8482a3b8f390da7fdf41b64c9dfe6136f105ce1b9bcf3875';
const GIFTED_EXAM = '2026-12-05';
const GIFTED_KEY = 'raerae-gifted-preview';
const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

function giftedOpenAt(date) { return Date.parse(date + 'T00:00:00+09:00'); }
function giftedIsOpen(date) { return Date.now() >= giftedOpenAt(date); }
function giftedPreview() { try { return sessionStorage.getItem(GIFTED_KEY) === '1'; } catch (e) { return false; } }
function giftedSetPreview() { try { sessionStorage.setItem(GIFTED_KEY, '1'); } catch (e) { } }
function giftedDateLabel(date) {
  const [y, m, d] = date.split('-').map(Number);
  const w = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${m}월 ${d}일(${WEEK[w]})`;
}
function giftedDday() {
  const left = Math.ceil((giftedOpenAt(GIFTED_EXAM) - Date.now()) / 86400000);
  return left > 0 ? `시험까지 D-${left}` : left === 0 ? '오늘 시험! 화이팅' : '시험 끝! 수고했어요';
}
async function giftedCheck(pw) {
  if (!(window.crypto && crypto.subtle)) return false;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw.trim()));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('') === GIFTED_PW_HASH;
}
function giftedDecode(id) {
  const s = document.getElementById(id).textContent.trim();
  return new TextDecoder().decode(Uint8Array.from(atob(s), c => c.charCodeAt(0)));
}

/* 회차 페이지: giftedGate({no, date, topic, slug}) */
function giftedGate(cfg) {
  const app = document.getElementById('app');
  function reveal(early) {
    app.innerHTML = giftedDecode('ep-html');
    if (early) {
      const tag = document.createElement('div');
      tag.className = 'preview-badge';
      tag.textContent = `🔑 부모님 미리보기 · 아이에게는 ${giftedDateLabel(cfg.date)}에 열려요`;
      app.prepend(tag);
    }
    document.querySelectorAll('.dday').forEach(el => { el.textContent = giftedDday(); });
    (new Function(giftedDecode('ep-js')))();
    initPlayer();
    if (document.getElementById('saveComic')) setupSave(cfg.slug);
  }
  if (giftedIsOpen(cfg.date)) return reveal(false);
  if (giftedPreview()) return reveal(true);

  app.innerHTML = `<section class="card lock">
      <div class="brand"><a href="../"><b>래래 뉴스툰</b> · 영재원 특별편</a><span class="dday">${giftedDday()}</span></div>
      <div class="lock-ico" aria-hidden="true">🔒</div>
      <h1>${cfg.no}화 <em>${cfg.topic}</em></h1>
      <p class="lock-when">${giftedDateLabel(cfg.date)}에 열려요!</p>
      <p class="lock-count" id="count"></p>
      <form id="pw" class="pw" autocomplete="off">
        <label for="pwInput">부모님 비밀번호로 미리 보기</label>
        <div class="pw-row"><input id="pwInput" type="password" inputmode="text" autocapitalize="off" spellcheck="false"><button type="submit">열기</button></div>
        <p class="pw-msg" id="pwMsg" role="status"></p>
      </form>
    </section>
    <footer><a href="../">← 영재원 특별편 모아보기</a></footer>`;
  const tick = () => {
    const ms = giftedOpenAt(cfg.date) - Date.now();
    if (ms <= 0) { location.reload(); return; }
    const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000) % 24, m = Math.floor(ms / 60000) % 60;
    document.getElementById('count').textContent = `열리기까지 ${d ? d + '일 ' : ''}${h}시간 ${m}분`;
  };
  tick(); setInterval(tick, 30000);
  document.getElementById('pw').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('pwMsg');
    if (await giftedCheck(document.getElementById('pwInput').value)) { giftedSetPreview(); reveal(true); window.scrollTo(0, 0); }
    else { msg.textContent = '비밀번호가 맞지 않아요. 날짜가 되면 저절로 열려요!'; }
  });
}

/* 모아보기 목록: <a class="item" data-date data-topic data-title> */
function giftedList() {
  document.querySelectorAll('.dday').forEach(el => { el.textContent = giftedDday(); });
  const preview = giftedPreview();
  document.querySelectorAll('a.item[data-date]').forEach(a => {
    const date = a.dataset.date, open = giftedIsOpen(date);
    const title = (open || preview) ? a.dataset.title : '무엇이 나올까요?';
    a.classList.toggle('locked', !open);
    a.querySelector('.title').textContent = title;
    a.querySelector('.go').textContent = open ? '보기' : (preview ? '미리보기' : '🔒 ' + giftedDateLabel(date));
  });
}

/* ── 공용 소품 (2화부터) ── */
const outdoor = (top, ground, gy) => { gy = gy || 236; return `<rect width="400" height="300" fill="${top || '#cfe9f7'}"/><path d="M 0 ${gy} Q 200 ${gy - 16} 400 ${gy} V 300 H 0 Z" fill="${ground || '#8fbf6a'}" stroke="${INK}" stroke-width="3"/>`; };
const sun = (x, y, r) => `<g class="pulse"><circle cx="${x}" cy="${y}" r="${r * 1.5}" fill="#ffe14d" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffd43b" ${S}/></g>`;
const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M -40 10 Q -44 -14 -20 -14 Q -14 -34 8 -28 Q 26 -40 38 -20 Q 58 -18 52 4 Q 54 16 40 16 L -30 16 Q -46 16 -40 10 Z" fill="#fff" ${S}/></g>`;
const arrow = (x1, y1, x2, y2, c, w) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 12; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c || INK}" stroke-width="${w || 4}" stroke-linecap="round"/><path d="M ${x2} ${y2} L ${(x2 - h * Math.cos(a - .5)).toFixed(1)} ${(y2 - h * Math.sin(a - .5)).toFixed(1)} L ${(x2 - h * Math.cos(a + .5)).toFixed(1)} ${(y2 - h * Math.sin(a + .5)).toFixed(1)} Z" fill="${c || INK}"/>`; };
const label = (t, x, y, size, color, anchor) => `<text x="${x}" y="${y}" font-family="Jua" font-size="${size || 18}" fill="${color || INK}" text-anchor="${anchor || 'middle'}">${t}</text>`;
const desk = () => `<rect width="400" height="300" fill="#fff4d6"/><rect x="0" y="232" width="400" height="68" fill="#e9c99a" stroke="${INK}" stroke-width="3"/>`;
