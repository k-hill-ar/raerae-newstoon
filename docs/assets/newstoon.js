/* 래래 뉴스툰 공용 그림 도구
   - 등장인물: aiden(), ryan(), pika(), friend('chan'|'jayden'|'julia'|'heart'|'sophia', opts)
   - 배경/소품: space(), sky(), stars(), earth(), voyager(), moon(), planet(), meteor(), baseball(), fx()
   - renderPanels(panels): 만화 컷을 #panels 에 그림
   ── 2026-11 확장 (연출 도구) ──
   - 표정 expr 추가: 'angry'|'cry'|'shock'|'grin'|'wink'
   - 감정 기호 mark(문자열 또는 배열): 'sweat'|'sparkle'|'vein'|'bulb'|'blush'|'gloom'|'heart'|'q'|'ex'|'music'
   - 포즈 pose 추가: 'run'|'cheer'|'cross'|'chin'|'raise'|'swing'|'shock'
   - 클로즈업: s를 1.3~1.8로 키우고 y를 230~260에 두면 몸이 컷 아래로 잘린 '얼굴 컷'이 된다
   - 배경 bg*(w,h): bgClassroom, bgLiving, bgStadium, bgField, bgMuseum, bgForest, bgCity, bgLab, bgSnow, bgStudio
   - 효과: focusLines, burst, speed, sparkles, impact, dexCard
   - 컷 크기: panel.size = 'wide'(400×200) | 'big'(400×340), panel.half = true(200×300, 두 컷 나란히)
   - 겹침 검사: 주소 뒤에 ?check 를 붙이면 말풍선·얼굴 겹침을 빨간 선으로 표시 (scripts/check_layout.js 도 같은 검사)
*/
/* 앱 설치용: 모든 만화 페이지에 앱 정보(manifest)·아이콘을 붙이고 서비스 워커를 등록한다 */
(function () {
  const me = document.currentScript && document.currentScript.src;
  if (!me) return;
  const root = new URL('../', me).href; // docs/ 위치
  const add = (tag, attrs) => { const el = document.createElement(tag); Object.assign(el, attrs); document.head.appendChild(el); };
  if (!document.querySelector('link[rel="manifest"]')) {
    add('link', { rel: 'manifest', href: root + 'manifest.webmanifest' });
    add('link', { rel: 'icon', type: 'image/png', href: root + 'icons/favicon-48.png' });
    add('link', { rel: 'apple-touch-icon', href: root + 'icons/apple-touch-icon.png' });
    add('meta', { name: 'theme-color', content: '#e8443a' });
    add('meta', { name: 'apple-mobile-web-app-title', content: '래래툰' });
  }
  if ('serviceWorker' in navigator) navigator.serviceWorker.register(root + 'sw.js', { scope: root }).catch(() => {});
})();

const INK = '#1d1d1f', SKIN = '#ffd9b8';
const S = 'stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"';

function arm(x1, y1, x2, y2, color) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="15" stroke-linecap="round"/>
          <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="9" stroke-linecap="round"/>
          <circle cx="${x2}" cy="${y2}" r="8" fill="${SKIN}" ${S}/>`;
}
function baseball(x, y, r) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/>
          <path d="M ${x - r * .55} ${y - r * .7} Q ${x - r * .1} ${y} ${x - r * .55} ${y + r * .7}" stroke="#e8443a" stroke-width="2" fill="none"/>
          <path d="M ${x + r * .55} ${y - r * .7} Q ${x + r * .1} ${y} ${x + r * .55} ${y + r * .7}" stroke="#e8443a" stroke-width="2" fill="none"/>`;
}

/* 사람 캐릭터 공통
   o: {x,y,s,flip,expr:'smile'|'talk'|'wow'|'happy'|'think'|'sad', pose:'stand'|'point'|'wave'|'pitch',
       jersey, cap(null이면 모자 없음), num, big, hair:'short'|'long'|'pony', hairColor, bow, stripes} */
function kid(o) {
  const f = o.flip ? -1 : 1, s = o.s || 1, big = o.big ? 1.25 : 1;
  const jersey = o.jersey, cap = o.cap, hc = o.hairColor || '#3a2a1e';
  let arms, legs = `<rect x="-22" y="100" width="18" height="44" rx="6" fill="#d9d4c7" ${S}/>
    <rect x="4" y="100" width="18" height="44" rx="6" fill="#d9d4c7" ${S}/>`;
  if (o.pose === 'run') {
    legs = `<rect x="-22" y="96" width="18" height="44" rx="6" fill="#d9d4c7" transform="rotate(32 -13 100)" ${S}/>
      <rect x="4" y="96" width="18" height="44" rx="6" fill="#d9d4c7" transform="rotate(-28 13 100)" ${S}/>`;
    arms = arm(-24, 52, -58, 70, jersey) + arm(24, 52, 50, 18, jersey);
  } else if (o.pose === 'cheer') arms = arm(-24, 52, -52, -30, jersey) + arm(24, 52, 52, -30, jersey);
  else if (o.pose === 'cross') arms = arm(-24, 52, 16, 72, jersey) + arm(24, 52, -16, 64, jersey);
  else if (o.pose === 'chin') arms = arm(-24, 52, -36, 96, jersey) + arm(24, 52, 16, 36, jersey);
  else if (o.pose === 'raise') arms = arm(-24, 52, -36, 96, jersey) + arm(24, 52, 46, -36, jersey);
  else if (o.pose === 'shock') arms = arm(-24, 52, -62, 30, jersey) + arm(24, 52, 62, 30, jersey);
  else if (o.pose === 'swing') arms = `<line x1="40" y1="62" x2="-46" y2="-34" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>
      <line x1="40" y1="62" x2="-46" y2="-34" stroke="#c8873e" stroke-width="8" stroke-linecap="round"/>` + arm(-24, 52, 36, 66, jersey) + arm(24, 52, 44, 58, jersey);
  else if (o.pose === 'point') arms = arm(-24, 52, -36, 96, jersey) + arm(24, 52, 54, -6, jersey);
  else if (o.pose === 'wave') arms = arm(-24, 52, -56, 4, jersey) + arm(24, 52, 56, 4, jersey);
  else if (o.pose === 'pitch') arms = arm(24, 52, 44, 92, jersey) + arm(-24, 52, -66, 18, jersey) + baseball(-74, 8, 10);
  else arms = arm(-24, 52, -36, 96, jersey) + arm(24, 52, 36, 96, jersey);

  const ex = 4;
  let eyes, mouth, extra = '';
  const eye = (x) => `<ellipse cx="${x + ex}" cy="8" rx="${4.2 * big}" ry="${6.2 * big}" fill="${INK}"/><circle cx="${x + ex + 1.5}" cy="5.5" r="${1.8 * big}" fill="#fff"/>`;
  switch (o.expr) {
    case 'wow':
      eyes = [-13, 13].map(x => `<circle cx="${x + ex}" cy="7" r="${8 * big}" fill="#fff" ${S}/><circle cx="${x + ex}" cy="8" r="${2.6 * big}" fill="${INK}"/>`).join('');
      mouth = `<ellipse cx="${ex}" cy="27" rx="7" ry="9" fill="#a8322c" ${S}/>`;
      extra = `<path d="M 44 -30 L 52 -42 M 50 -22 L 62 -28 M 40 -38 L 42 -52" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      break;
    case 'happy':
      eyes = [-13, 13].map(x => `<path d="M ${x + ex - 6} 10 Q ${x + ex} 0 ${x + ex + 6} 10" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('');
      mouth = `<path d="M ${ex - 12} 20 Q ${ex} 38 ${ex + 12} 20 Z" fill="#a8322c" ${S}/>`;
      break;
    case 'talk':
      eyes = eye(-13) + eye(13);
      mouth = `<path d="M ${ex - 9} 21 Q ${ex} 33 ${ex + 9} 21 Z" fill="#a8322c" ${S}/>`;
      break;
    case 'think':
      eyes = eye(-13) + eye(13);
      mouth = `<path d="M ${ex - 6} 25 L ${ex + 6} 23" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      break;
    case 'sad':
      eyes = eye(-13) + eye(13) + `<path d="M ${ex - 20} -4 L ${ex - 7} 0 M ${ex + 20} -4 L ${ex + 7} 0" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      mouth = `<path d="M ${ex - 8} 28 Q ${ex} 20 ${ex + 8} 28" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      break;
    case 'angry':
      eyes = eye(-13) + eye(13) + `<path d="M ${ex - 22} -8 L ${ex - 6} 0 M ${ex + 22} -8 L ${ex + 6} 0" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
      mouth = `<path d="M ${ex - 9} 28 Q ${ex} 21 ${ex + 9} 28" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      break;
    case 'cry':
      eyes = [-13, 13].map(x => `<path d="M ${x + ex - 6} 6 Q ${x + ex} 12 ${x + ex + 6} 6" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M ${x + ex} 12 Q ${x + ex - 3} 26 ${x + ex} 34 Q ${x + ex + 4} 26 ${x + ex} 12 Z" fill="#7ec8ff" stroke="#3d8bfd" stroke-width="1.5"/>`).join('');
      mouth = `<path d="M ${ex - 9} 26 Q ${ex - 4} 20 ${ex} 26 Q ${ex + 4} 20 ${ex + 9} 26" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      break;
    case 'shock':
      eyes = [-13, 13].map(x => `<circle cx="${x + ex}" cy="7" r="${8 * big}" fill="#fff" ${S}/><circle cx="${x + ex}" cy="7" r="1.8" fill="${INK}"/>`).join('');
      mouth = `<path d="M ${ex - 9} 26 L ${ex - 4} 22 L ${ex} 26 L ${ex + 4} 22 L ${ex + 9} 26" stroke="${INK}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
      break;
    case 'grin':
      eyes = eye(-13) + eye(13);
      mouth = `<path d="M ${ex - 13} 19 Q ${ex} 40 ${ex + 13} 19 Z" fill="#fff" ${S}/><path d="M ${ex - 12} 21 H ${ex + 12}" stroke="${INK}" stroke-width="2"/>`;
      break;
    case 'wink':
      eyes = eye(-13) + `<path d="M ${13 + ex - 6} 9 Q ${13 + ex} 3 ${13 + ex + 6} 9" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M ${ex - 10} 21 Q ${ex} 34 ${ex + 10} 21 Z" fill="#a8322c" ${S}/>`;
      break;
    default:
      eyes = eye(-13) + eye(13);
      mouth = `<path d="M ${ex - 9} 22 Q ${ex} 30 ${ex + 9} 22" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }

  // 머리카락(뒤)
  let hairBack = '';
  if (o.hair === 'long') hairBack = `<path d="M -40 -6 Q -48 50 -30 62 L 30 62 Q 48 50 40 -6 Z" fill="${hc}" ${S}/>`;
  if (o.hair === 'pony') hairBack = `<path d="M -30 -26 Q -70 -20 -62 30 Q -50 10 -36 6 Z" fill="${hc}" ${S}/>`;
  // 머리 위쪽: 모자 또는 머리카락
  let top;
  if (cap) {
    const numX = f === 1 ? -12 : 12;
    top = `<path d="M -38 -2 Q -44 16 -32 20 L -30 0 Z M 38 -2 Q 44 16 32 20 L 30 0 Z" fill="${hc}"/>
      <path d="M -39 -1 A 39 39 0 0 1 39 -1 Q 0 -9 -39 -1 Z" fill="${cap}" ${S}/>
      <path d="M 8 -5 Q 46 -12 64 -1 Q 46 5 8 2 Z" fill="${cap}" ${S}/>
      <text x="${numX}" y="-14" transform="scale(${f},1)" font-family="Jua" font-size="20" fill="#fff" text-anchor="middle">${o.num || ''}</text>`;
  } else if (o.hair === 'long' || o.hair === 'pony') {
    top = `<path d="M -40 6 Q -42 -40 0 -40 Q 42 -40 40 6 Q 30 -14 12 -16 Q -6 -6 -26 -12 Q -36 -4 -40 6 Z" fill="${hc}" ${S}/>`;
  } else {
    top = `<path d="M -40 8 Q -44 -38 -4 -40 L 2 -50 L 10 -40 L 18 -48 L 22 -38 Q 44 -30 40 8 Q 34 -10 18 -14 Q 0 -6 -22 -14 Q -34 -6 -40 8 Z" fill="${hc}" ${S}/>`;
  }
  const bow = o.bow ? `<g transform="translate(-26,-30)"><path d="M 0 0 L -14 -9 L -14 9 Z M 0 0 L 14 -9 L 14 9 Z" fill="${o.bow}" ${S}/><circle r="4" fill="${o.bow}" ${S}/></g>` : '';
  const stripes = o.stripes === false ? '' : `<path d="M -12 42 V 104 M 12 42 V 104" stroke="#fff" stroke-width="2" opacity=".55"/>`;

  return `<g data-head="${o.x},${o.y},${(38 * s).toFixed(1)}" transform="translate(${o.x},${o.y}) scale(${f * s},${s})">
    ${legs}
    ${hairBack}
    <rect x="-29" y="38" width="58" height="70" rx="18" fill="${jersey}" ${S}/>
    ${stripes}
    <path d="M -10 38 L 0 50 L 10 38" fill="#fff" ${S}/>
    ${arms}
    <circle cx="0" cy="0" r="38" fill="${SKIN}" ${S}/>
    ${top}${bow}
    <ellipse cx="${-22 + ex}" cy="20" rx="6" ry="3.5" fill="#ff8f8f" opacity=".7"/>
    <ellipse cx="${22 + ex}" cy="20" rx="6" ry="3.5" fill="#ff8f8f" opacity=".7"/>
    ${eyes}${mouth}${extra}${marks(o.mark)}
  </g>`;
}

/* 감정 기호 (머리 기준 좌표, 머리 반지름 38) */
function marks(m) {
  if (!m) return '';
  return [].concat(m).map(k => {
    switch (k) {
      case 'sweat': return `<path d="M 44 -30 Q 36 -14 44 -8 Q 52 -14 44 -30 Z" fill="#9fdcff" stroke="#3d8bfd" stroke-width="2.5"/>`;
      case 'sparkle': return [[-9, 4], [17, 4]].map(([x, y]) => `<path d="M ${x} ${y - 6} L ${x + 1.6} ${y - 1.6} L ${x + 6} ${y} L ${x + 1.6} ${y + 1.6} L ${x} ${y + 6} L ${x - 1.6} ${y + 1.6} L ${x - 6} ${y} L ${x - 1.6} ${y - 1.6} Z" fill="#fff"/>`).join('')
        + `<path d="M 50 -44 l 3 9 l 9 3 l -9 3 l -3 9 l -3 -9 l -9 -3 l 9 -3 Z" fill="#ffe14d" ${S}/>`;
      case 'vein': return `<g transform="translate(34,-36)" stroke="#e8443a" stroke-width="4" stroke-linecap="round" fill="none"><path d="M -10 -3 Q -3 -3 -3 -10 M 3 -10 Q 3 -3 10 -3 M 10 3 Q 3 3 3 10 M -3 10 Q -3 3 -10 3"/></g>`;
      case 'bulb': return `<g transform="translate(0,-74)"><path d="M -14 0 A 16 16 0 1 1 14 0 Q 8 6 8 14 H -8 Q -8 6 -14 0 Z" fill="#ffe14d" ${S}/><rect x="-8" y="14" width="16" height="8" rx="2" fill="#adb5bd" ${S}/>
        <path d="M -28 -18 L -36 -24 M 28 -18 L 36 -24 M 0 -28 V -38" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`;
      case 'blush': return `<path d="M -32 14 l 5 -6 M -26 16 l 5 -6 M -20 18 l 5 -6 M 22 14 l 5 -6 M 28 16 l 5 -6 M 34 18 l 5 -6" stroke="#e8443a" stroke-width="2.5" stroke-linecap="round"/>`;
      case 'gloom': return `<path d="M -20 -30 V -6 M -8 -34 V -4 M 4 -34 V -4 M 16 -30 V -6" stroke="#5b6fd6" stroke-width="3" stroke-linecap="round" opacity=".75"/>`;
      case 'heart': return `<path d="M 48 -40 C 48 -48 60 -48 60 -40 C 60 -48 72 -48 72 -40 C 72 -32 60 -24 60 -22 C 60 -24 48 -32 48 -40 Z" fill="#ff6b9a" ${S}/>`;
      case 'q': return `<text x="46" y="-34" font-family="Jua" font-size="34" fill="#2f6fde" stroke="${INK}" stroke-width="4" paint-order="stroke">?</text>`;
      case 'ex': return `<text x="46" y="-34" font-family="Jua" font-size="36" fill="#e8443a" stroke="${INK}" stroke-width="4" paint-order="stroke">!</text>`;
      case 'music': return `<text x="44" y="-30" font-family="Jua" font-size="28" fill="#7b4fd6" stroke="#fff" stroke-width="3" paint-order="stroke">♪</text>`;
      default: return '';
    }
  }).join('');
}

/* 주인공 */
const aiden = (o) => kid(Object.assign({ jersey: '#2f6fde', cap: '#1f4fa8', num: '6' }, o));
const ryan = (o) => kid(Object.assign({ jersey: '#e8443a', cap: '#b52b23', num: '4', big: true }, o));

/* 친구들 */
const FRIENDS = {
  chan:   { jersey: '#2e9d5b', cap: null, hair: 'short' },
  jayden: { jersey: '#f08c00', cap: '#c26d00', num: '4', big: true },
  julia:  { jersey: '#7b4fd6', cap: null, hair: 'long', stripes: false },
  heart:  { jersey: '#e64980', cap: null, hair: 'pony', hairColor: '#5a3418', stripes: false, big: true },
  sophia: { jersey: '#12b886', cap: null, hair: 'long', hairColor: '#6b4423', bow: '#ff6b9a', stripes: false, big: true },
};
const friend = (name, o) => kid(Object.assign({}, FRIENDS[name], o));

/* 피카: 오리지널 해설 몬스터 */
function pika(o) {
  const s = o.s || 1, f = o.flip ? -1 : 1;
  const armUp = o.pose === 'explain'
    ? `<ellipse cx="32" cy="-6" rx="7" ry="13" transform="rotate(35 32 -6)" fill="#ffd43b" ${S}/>`
    : `<ellipse cx="31" cy="8" rx="7" ry="11" transform="rotate(-20 31 8)" fill="#ffd43b" ${S}/>`;
  let eyes = `<ellipse cx="-11" cy="-5" rx="6" ry="8.5" fill="${INK}"/><circle cx="-9" cy="-8" r="2.6" fill="#fff"/>
    <ellipse cx="11" cy="-5" rx="6" ry="8.5" fill="${INK}"/><circle cx="13" cy="-8" r="2.6" fill="#fff"/>`;
  if (o.expr === 'shock') eyes = `<circle cx="-11" cy="-5" r="7" fill="#fff" ${S}/><circle cx="-11" cy="-5" r="1.8" fill="${INK}"/><circle cx="11" cy="-5" r="7" fill="#fff" ${S}/><circle cx="11" cy="-5" r="1.8" fill="${INK}"/>`;
  if (o.expr === 'wink') eyes = `<ellipse cx="-11" cy="-5" rx="6" ry="8.5" fill="${INK}"/><circle cx="-9" cy="-8" r="2.6" fill="#fff"/><path d="M 5 -4 Q 11 -12 17 -4" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  if (o.expr === 'happy') eyes = `<path d="M -17 -3 Q -11 -13 -5 -3 M 5 -3 Q 11 -13 17 -3" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  const mouth = o.expr === 'wow'
    ? `<ellipse cx="0" cy="12" rx="6" ry="7" fill="#a8322c" ${S}/>`
    : o.expr === 'happy'
      ? `<path d="M -9 7 Q 0 20 9 7 Z" fill="#a8322c" ${S}/>`
      : `<path d="M -8 9 Q -4 15 0 10 Q 4 15 8 9" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return `<g data-head="${o.x},${o.y},${(31 * s).toFixed(1)}" transform="translate(${o.x},${o.y}) scale(${f * s},${s})">
    ${o.zap ? `<path d="M -40 -46 L -50 -60 M 40 -46 L 50 -60 M -48 -28 L -64 -32 M 48 -28 L 64 -32" stroke="#ffb800" stroke-width="4" stroke-linecap="round"/>` : ''}
    <path d="M -2 -28 L -12 -50 L 0 -47 L -7 -70 L 13 -42 L 1 -45 L 7 -28 Z" fill="#ffb800" ${S}/>
    <circle cx="-25" cy="-20" r="11" fill="#ffd43b" ${S}/><circle cx="-25" cy="-20" r="5" fill="#ff9aa2"/>
    <circle cx="25" cy="-20" r="11" fill="#ffd43b" ${S}/><circle cx="25" cy="-20" r="5" fill="#ff9aa2"/>
    <ellipse cx="-13" cy="31" rx="10" ry="6" fill="#ffb800" ${S}/>
    <ellipse cx="13" cy="31" rx="10" ry="6" fill="#ffb800" ${S}/>
    <ellipse cx="-31" cy="8" rx="7" ry="11" transform="rotate(20 -31 8)" fill="#ffd43b" ${S}/>
    ${armUp}
    <circle cx="0" cy="0" r="31" fill="#ffd43b" ${S}/>
    <ellipse cx="0" cy="14" rx="17" ry="12" fill="#fff3b0"/>
    ${eyes}
    <circle cx="-21" cy="6" r="5" fill="#ff6b6b" opacity=".85"/><circle cx="21" cy="6" r="5" fill="#ff6b6b" opacity=".85"/>
    ${mouth}${marks(o.mark)}
  </g>`;
}

/* 배경과 소품 */
function voyager(x, y, s, rot) {
  return `<g transform="translate(${x},${y}) rotate(${rot || 0}) scale(${s})">
    <line x1="0" y1="10" x2="-70" y2="40" stroke="${INK}" stroke-width="3"/>
    <line x1="0" y1="10" x2="60" y2="38" stroke="${INK}" stroke-width="3"/>
    <rect x="52" y="32" width="14" height="10" fill="#c9c9c9" ${S}/>
    <line x1="0" y1="10" x2="10" y2="-40" stroke="${INK}" stroke-width="2"/>
    <rect x="-14" y="6" width="28" height="16" rx="2" fill="#e0a800" ${S}/>
    <path d="M -36 -6 Q 0 26 36 -6 Z" fill="#fff" ${S}/>
    <ellipse cx="0" cy="-6" rx="36" ry="9" fill="#f2f2f2" ${S}/>
    <line x1="0" y1="-6" x2="0" y2="-22" stroke="${INK}" stroke-width="3"/>
    <circle cx="0" cy="-23" r="3" fill="${INK}"/>
  </g>`;
}
function earth(x, y, r) {
  return `<g><circle cx="${x}" cy="${y}" r="${r}" fill="#3d8bfd" ${S}/>
    <path d="M ${x - r * .6} ${y - r * .3} q ${r * .3} ${-r * .4} ${r * .6} ${-r * .1} q ${r * .1} ${r * .4} ${-r * .3} ${r * .5} q ${-r * .3} 0 ${-r * .3} ${-r * .4} Z" fill="#43c463" stroke="${INK}" stroke-width="2"/>
    <path d="M ${x + r * .1} ${y + r * .2} q ${r * .4} ${-r * .2} ${r * .6} ${r * .1} q ${-r * .1} ${r * .4} ${-r * .5} ${r * .3} Z" fill="#43c463" stroke="${INK}" stroke-width="2"/></g>`;
}
function moon(x, y, r) {
  return `<g><circle cx="${x}" cy="${y}" r="${r * 1.35}" fill="#fff6c8" opacity=".18"/>
    <circle cx="${x}" cy="${y}" r="${r * 1.15}" fill="#fff6c8" opacity=".25"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="#fff4c2" ${S}/>
    <circle cx="${x - r * .35}" cy="${y - r * .25}" r="${r * .18}" fill="#e9dca0"/>
    <circle cx="${x + r * .3}" cy="${y + r * .1}" r="${r * .24}" fill="#e9dca0"/>
    <circle cx="${x - r * .1}" cy="${y + r * .45}" r="${r * .12}" fill="#e9dca0"/></g>`;
}
function planet(x, y, r, kind) {
  if (kind === 'jupiter') {
    return `<g><circle cx="${x}" cy="${y}" r="${r * 1.6}" fill="#fff" opacity=".12"/>
      <circle cx="${x}" cy="${y}" r="${r}" fill="#f1d9b0" ${S}/>
      <path d="M ${x - r * .95} ${y - r * .35} H ${x + r * .95} M ${x - r} ${y + r * .1} H ${x + r} M ${x - r * .85} ${y + r * .5} H ${x + r * .85}" stroke="#c58f5a" stroke-width="${r * .18}"/>
      <ellipse cx="${x + r * .35}" cy="${y + r * .3}" rx="${r * .2}" ry="${r * .12}" fill="#c0504d"/></g>`;
  }
  return `<g><circle cx="${x}" cy="${y}" r="${r * 1.8}" fill="#ff7b54" opacity=".15"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="#e2583e" ${S}/>
    <circle cx="${x - r * .3}" cy="${y - r * .2}" r="${r * .22}" fill="#b8402c"/></g>`;
}
function meteor(x, y, len, ang, w) {
  const rad = ang * Math.PI / 180, x2 = x - Math.cos(rad) * len, y2 = y - Math.sin(rad) * len;
  const id = 'm' + Math.round(x) + '_' + Math.round(y);
  return `<defs><linearGradient id="${id}" x1="${x2}" y1="${y2}" x2="${x}" y2="${y}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fffbe0" stop-opacity="1"/></linearGradient></defs>
    <line x1="${x2}" y1="${y2}" x2="${x}" y2="${y}" stroke="url(#${id})" stroke-width="${w || 3}" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y}" r="${(w || 3) * .9}" fill="#fff"/>`;
}
function stars(n, seed, h) {
  let out = '', a = seed;
  const rnd = () => (a = (a * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) {
    const x = rnd() * 400, y = rnd() * (h || 300), r = rnd() * 1.8 + .6;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(.5 + rnd() * .5).toFixed(2)}"/>`;
  }
  return out;
}
function fx(text, x, y, size, rot, color) {
  return `<text x="${x}" y="${y}" transform="rotate(${rot} ${x} ${y})" font-family="Jua" font-size="${size}" fill="${color || '#ffe14d'}"
    stroke="${INK}" stroke-width="5" paint-order="stroke" stroke-linejoin="round" text-anchor="middle">${text}</text>`;
}
/* 세로 그라데이션 하늘. colors: 위→아래 */
function sky(id, colors, starCount) {
  const stops = colors.map((c, i) => `<stop offset="${i / (colors.length - 1)}" stop-color="${c}"/>`).join('');
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient></defs>
    <rect width="400" height="300" fill="url(#${id})"/>${starCount ? stars(starCount, id.length * 7 + starCount) : ''}`;
}
const space = (seed) => sky('sp' + seed, ['#0b1236', '#2a1f5c'], 0) + stars(60, seed);

/* 컷 렌더링
   panel: {svg, html, size:'wide'|'big', half:true}
   - 기본 400×300, wide 400×200(장소 소개), big 400×340(결정적 장면), half 200×300(두 컷 나란히) */
function panelBox(p) {
  if (p.half) return [200, 300];
  if (p.size === 'wide') return [400, 200];
  if (p.size === 'big') return [400, 340];
  return [400, 300];
}
function renderPanels(panels) {
  const one = (p, i) => {
    const [w, h] = panelBox(p);
    const cls = 'panel' + (p.half ? ' half' : '') + (p.size ? ' size-' + p.size : '');
    return `<div class="${cls}" style="aspect-ratio:${w}/${h}"><svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${p.svg}</svg>${p.html || ''}<span class="num">${i + 1}</span></div>`;
  };
  let out = '';
  for (let i = 0; i < panels.length; i++) {
    if (panels[i].half && panels[i + 1] && panels[i + 1].half) { out += `<div class="row">${one(panels[i], i)}${one(panels[i + 1], i + 1)}</div>`; i++; }
    else out += one(panels[i], i);
  }
  document.getElementById('panels').innerHTML = out;
  if (/[?&]check/.test(location.search)) setTimeout(checkLayout, 600);
}

/* 겹침 검사: 말풍선이 얼굴을 가리거나 컷 밖으로 나가는지 실제 화면 크기로 잰다 */
function checkLayout() {
  const issues = [];
  document.querySelectorAll('#panels .panel').forEach((panel, pi) => {
    const pr = panel.getBoundingClientRect();
    const svg = panel.querySelector('svg');
    const vb = svg.viewBox.baseVal, k = pr.width / vb.width;
    const heads = [...svg.querySelectorAll('[data-head]')].map(g => g.dataset.head.split(',').map(Number)).map(([x, y, r]) => ({ x: x * k, y: y * k, r: r * k * .92 }));
    const boxes = [...panel.querySelectorAll('.b,.nar')].map(el => { const r = el.getBoundingClientRect(); return { el, x: r.left - pr.left, y: r.top - pr.top, w: r.width, h: r.height }; });
    heads.forEach(hd => {
      const c = document.createElement('div');
      c.style.cssText = `position:absolute;z-index:9;border:2px dashed #e8443a;border-radius:50%;left:${hd.x - hd.r}px;top:${hd.y - hd.r}px;width:${hd.r * 2}px;height:${hd.r * 2}px;pointer-events:none`;
      panel.appendChild(c);
    });
    boxes.forEach((b, bi) => {
      const hit = heads.some(hd => { const nx = Math.max(b.x, Math.min(hd.x, b.x + b.w)), ny = Math.max(b.y, Math.min(hd.y, b.y + b.h)); return (nx - hd.x) ** 2 + (ny - hd.y) ** 2 < hd.r ** 2; });
      const out = b.x < -1 || b.y < -1 || b.x + b.w > pr.width + 1 || b.y + b.h > pr.height + 1;
      const over = boxes.some((o, oi) => oi !== bi && b.x < o.x + o.w && o.x < b.x + b.w && b.y < o.y + o.h && o.y < b.y + b.h);
      if (hit || out || over) { b.el.style.outline = '3px solid #e8443a'; issues.push(`${pi + 1}컷: "${b.el.textContent.trim().slice(0, 14)}" ${[hit && '얼굴 가림', out && '컷 밖', over && '말풍선끼리 겹침'].filter(Boolean).join(', ')}`); }
    });
  });
  window.NT_CHECK = issues;
  console[issues.length ? 'warn' : 'log']('겹침 검사: ' + (issues.length ? issues.join(' / ') : '문제 없음'));
  return issues;
}

/* 이미지 저장 버튼 */
function setupSave(date) {
  const status = document.getElementById('status');
  async function save(el, name) {
    status.textContent = '이미지를 만드는 중…';
    try {
      if (!window.htmlToImage) throw new Error('저장 도구를 불러오지 못했어요');
      const url = await htmlToImage.toPng(el, { pixelRatio: 2, backgroundColor: '#f3efe4' });
      const a = document.createElement('a');
      a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      status.textContent = '저장했어요! 휴대폰은 다운로드 폴더나 사진첩을 확인하세요.';
    } catch (e) {
      status.textContent = '저장에 실패했어요. 화면을 캡처해서 보내 주세요. (' + e.message + ')';
    }
  }
  document.getElementById('saveComic').onclick = () => save(document.getElementById('capture'), `newstoon-${date}.png`);
  document.getElementById('saveAll').onclick = () => save(document.querySelector('.wrap'), `newstoon-${date}-full.png`);
}

/* ───────── 배경 묶음 (w,h 기본 400×300; wide는 400,200 / half는 200,300 을 넘긴다) ───────── */
const floorY = (h) => Math.round(h * .74);
function bgClassroom(w = 400, h = 300, chalk = '') {
  const f = floorY(h);
  return `<rect width="${w}" height="${h}" fill="#f6efd9"/>
    <rect y="${f}" width="${w}" height="${h - f}" fill="#d9a066" stroke="${INK}" stroke-width="3"/>
    ${[1, 2, 3, 4].map(i => `<line x1="${w * i / 5}" y1="${f}" x2="${w * i / 5 - 20}" y2="${h}" stroke="#b97f45" stroke-width="2"/>`).join('')}
    <rect x="${w * .08}" y="${h * .1}" width="${w * .84}" height="${h * .42}" rx="6" fill="#2f6b4f" stroke="#8a5a2b" stroke-width="7"/>
    <text x="${w / 2}" y="${h * .33}" font-family="Jua" font-size="${Math.round(w * .06)}" text-anchor="middle" fill="#f1f3e8" opacity=".9">${chalk}</text>
    <rect x="${w * .08}" y="${h * .52}" width="${w * .84}" height="6" fill="#8a5a2b"/>`;
}
function bgLiving(w = 400, h = 300, sofa = true) {
  const f = floorY(h);
  return `<rect width="${w}" height="${h}" fill="#fdf1dc"/>
    <rect x="${w * .62}" y="${h * .1}" width="${w * .3}" height="${h * .36}" fill="#bfe3ff" ${S}/>
    <line x1="${w * .77}" y1="${h * .1}" x2="${w * .77}" y2="${h * .46}" stroke="${INK}" stroke-width="3"/>
    <path d="M ${w * .58} ${h * .07} H ${w * .66} V ${h * .52} Q ${w * .6} ${h * .4} ${w * .58} ${h * .52} Z M ${w * .96} ${h * .07} H ${w * .88} V ${h * .52} Q ${w * .94} ${h * .4} ${w * .96} ${h * .52} Z" fill="#f4a3a3" ${S}/>
    <rect y="${f}" width="${w}" height="${h - f}" fill="#c99b6d" stroke="${INK}" stroke-width="3"/>
    ${sofa ? `<rect x="${w * .04}" y="${f - h * .2}" width="${w * .4}" height="${h * .2}" rx="14" fill="#7b9ccf" ${S}/>
    <rect x="${w * .04}" y="${f - h * .28}" width="${w * .4}" height="${h * .12}" rx="14" fill="#93b2e0" ${S}/>` : ''}
    <circle cx="${w * .52}" cy="${h * .2}" r="${w * .04}" fill="#fff" ${S}/><path d="M ${w * .52} ${h * .2} V ${h * .17} M ${w * .52} ${h * .2} H ${w * .54}" stroke="${INK}" stroke-width="2"/>`;
}
function bgStadium(seat = '#c03a5c', w = 400, h = 300) {
  const n = Math.ceil(w / 40);
  return `<rect width="${w}" height="${h}" fill="#bfe3ff"/>
    <path d="M 0 ${h * .2} L ${w} ${h * .2} L ${w} ${h * .5} L 0 ${h * .5} Z" fill="${seat}" ${S}/>
    ${Array.from({ length: n }, (_, i) => `<circle cx="${20 + i * 40}" cy="${h * .3 + (i % 2) * h * .07}" r="10" fill="${SKIN}" ${S}/>`).join('')}
    <path d="M 0 ${h * .71} Q ${w / 2} ${h * .62} ${w} ${h * .71} V ${h} H 0 Z" fill="#5fae5a" stroke="${INK}" stroke-width="3"/>`;
}
function bgField(w = 400, h = 300) {
  const cx = w / 2, cy = h * .62, r = Math.min(w, h) * .3;
  return `<rect width="${w}" height="${h}" fill="#5fae5a"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="${i * w / 6}" width="${w / 12}" height="${h}" fill="#6dbb67"/>`).join('')}
    <path d="M ${cx} ${cy + r} L ${cx - r} ${cy} L ${cx} ${cy - r} L ${cx + r} ${cy} Z" fill="#d9a066" ${S}/>
    ${[[cx, cy + r], [cx - r, cy], [cx, cy - r], [cx + r, cy]].map(([x, y]) => `<rect x="${x - 7}" y="${y - 7}" width="14" height="14" fill="#fff" transform="rotate(45 ${x} ${y})" ${S}/>`).join('')}
    <circle cx="${cx}" cy="${cy}" r="10" fill="#c98a52" ${S}/>`;
}
function bgMuseum(w = 400, h = 300) {
  const f = floorY(h);
  return `<rect width="${w}" height="${h}" fill="#ece4d6"/>
    <rect y="${f}" width="${w}" height="${h - f}" fill="#9c8b75" stroke="${INK}" stroke-width="3"/>
    ${[0, 1, 2].map(i => { const x = w * (.1 + i * .3); return `<path d="M ${x + w * .1} 0 L ${x - w * .02} ${f} H ${x + w * .22} Z" fill="#fff8d6" opacity=".55"/>
      <rect x="${x}" y="${h * .16}" width="${w * .2}" height="${h * .26}" fill="#fff" stroke="#b8902f" stroke-width="6"/>`; }).join('')}`;
}
function bgForest(w = 400, h = 300) {
  const f = floorY(h);
  const tree = (x, s) => `<rect x="${x - 8 * s}" y="${f - 70 * s}" width="${16 * s}" height="${70 * s}" fill="#8a5a2b" ${S}/><circle cx="${x}" cy="${f - 90 * s}" r="${42 * s}" fill="#3f9b52" ${S}/>`;
  return `<rect width="${w}" height="${h}" fill="#cfeeff"/>
    ${tree(w * .1, 1.1)}${tree(w * .32, .8)}${tree(w * .7, .95)}${tree(w * .92, 1.2)}
    <rect y="${f}" width="${w}" height="${h - f}" fill="#7cc46a" stroke="${INK}" stroke-width="3"/>`;
}
function bgCity(w = 400, h = 300) {
  const f = floorY(h);
  const b = [[0, .3, .5], [.16, .2, .66], [.34, .22, .42], [.54, .18, .72], [.7, .16, .5], [.84, .2, .6]];
  return `<rect width="${w}" height="${h}" fill="#bfe3ff"/>
    ${b.map(([x, bw, bh], i) => { const X = x * w, W = bw * w, Y = f - bh * h * .9; let win = '';
      for (let yy = Y + 12; yy < f - 14; yy += 22) for (let xx = X + 8; xx < X + W - 12; xx += 18) win += `<rect x="${xx}" y="${yy}" width="9" height="11" fill="#fff6c2"/>`;
      return `<rect x="${X}" y="${Y}" width="${W}" height="${f - Y}" fill="${['#8fa3c7', '#a7b6d6', '#7d92b8'][i % 3]}" ${S}/>${win}`; }).join('')}
    <rect y="${f}" width="${w}" height="${h - f}" fill="#9aa1ab" stroke="${INK}" stroke-width="3"/>
    <path d="M 0 ${(f + h) / 2} H ${w}" stroke="#fff" stroke-width="5" stroke-dasharray="26 18"/>`;
}
function bgLab(w = 400, h = 300) {
  const f = floorY(h);
  let tiles = '';
  for (let x = 0; x < w; x += 40) tiles += `<line x1="${x}" y1="0" x2="${x}" y2="${f}" stroke="#d7e4ec" stroke-width="2"/>`;
  for (let y = 0; y < f; y += 40) tiles += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#d7e4ec" stroke-width="2"/>`;
  const flask = (x, c) => `<path d="M ${x - 6} ${h * .22} V ${h * .3} L ${x - 18} ${h * .42} H ${x + 18} L ${x + 6} ${h * .3} V ${h * .22} Z" fill="#fff" ${S}/><path d="M ${x - 14} ${h * .38} L ${x - 18} ${h * .42} H ${x + 18} L ${x + 14} ${h * .38} Z" fill="${c}"/>`;
  return `<rect width="${w}" height="${h}" fill="#eef6fa"/>${tiles}
    <rect x="${w * .05}" y="${h * .43}" width="${w * .9}" height="6" fill="#8a96a8"/>
    ${flask(w * .15, '#7ee08a')}${flask(w * .3, '#ff8fb1')}${flask(w * .8, '#7ec8ff')}
    <rect y="${f}" width="${w}" height="${h - f}" fill="#c7d3dc" stroke="${INK}" stroke-width="3"/>`;
}
function bgSnow(w = 400, h = 300, seed = 3) {
  const f = floorY(h);
  let a = seed, flakes = '';
  const rnd = () => (a = (a * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 40; i++) flakes += `<circle cx="${(rnd() * w).toFixed(1)}" cy="${(rnd() * f).toFixed(1)}" r="${(rnd() * 3 + 2).toFixed(1)}" fill="#fff" opacity=".9"/>`;
  return `<rect width="${w}" height="${h}" fill="#c9d6e3"/>${flakes}
    <path d="M 0 ${f} Q ${w * .3} ${f - 14} ${w * .6} ${f} T ${w} ${f} V ${h} H 0 Z" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
}
function bgStudio(w = 400, h = 300, screen = '') {
  return `<rect width="${w}" height="${h}" fill="#26324f"/>
    <rect x="${w * .08}" y="${h * .08}" width="${w * .84}" height="${h * .46}" rx="8" fill="#3e5a99" ${S}/>
    <text x="${w / 2}" y="${h * .34}" font-family="Jua" font-size="${Math.round(w * .065)}" text-anchor="middle" fill="#fff">${screen}</text>
    <path d="M 0 ${h * .78} H ${w} V ${h} H 0 Z" fill="#c9a05f" stroke="${INK}" stroke-width="3"/>
    <rect x="0" y="${h * .76}" width="${w}" height="8" fill="#e8c27d" ${S}/>`;
}

/* ───────── 만화 효과 ───────── */
/* 집중선: 가운데(cx,cy)를 비워 두고 바깥에서 안쪽으로 모이는 선 */
function focusLines(cx, cy, w = 400, h = 300, color = INK, n = 44, inner = .42) {
  let a = 7, out = '';
  const rnd = () => (a = (a * 9301 + 49297) % 233280) / 233280;
  const R = Math.hypot(w, h);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2 + rnd() * .08, r0 = Math.min(w, h) * (inner + rnd() * .15), sp = .012 + rnd() * .012;
    out += `<path d="M ${cx + Math.cos(t - sp) * R} ${cy + Math.sin(t - sp) * R} L ${cx + Math.cos(t) * r0} ${cy + Math.sin(t) * r0} L ${cx + Math.cos(t + sp) * R} ${cy + Math.sin(t + sp) * R} Z" fill="${color}" opacity=".85"/>`;
  }
  return out;
}
/* 햇살 배경: 번갈아 칠한 부채꼴 (짜잔! 장면) */
function burst(cx, cy, c1 = '#ffe14d', c2 = '#fff3b0', w = 400, h = 300, n = 18) {
  const R = Math.hypot(w, h);
  let out = `<rect width="${w}" height="${h}" fill="${c2}"/>`;
  for (let i = 0; i < n; i += 2) {
    const t1 = i / n * Math.PI * 2, t2 = (i + 1) / n * Math.PI * 2;
    out += `<path d="M ${cx} ${cy} L ${cx + Math.cos(t1) * R} ${cy + Math.sin(t1) * R} L ${cx + Math.cos(t2) * R} ${cy + Math.sin(t2) * R} Z" fill="${c1}"/>`;
  }
  return out;
}
/* 속도선: 왼쪽(또는 오른쪽)으로 흐르는 가로줄 */
function speed(x, y, len = 70, rows = 4, dir = -1) {
  return Array.from({ length: rows }, (_, i) => `<line x1="${x}" y1="${y + i * 14}" x2="${x + dir * (len - i * 9)}" y2="${y + i * 14}" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`).join('');
}
/* 반짝이: 네 꼭짓점 별 */
function sparkles(n = 8, seed = 5, w = 400, h = 300, color = '#fff') {
  let a = seed, out = '';
  const rnd = () => (a = (a * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) {
    const x = rnd() * w, y = rnd() * h * .6, r = 5 + rnd() * 8;
    out += `<path d="M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z" fill="${color}" stroke="${INK}" stroke-width="1.5"/>`;
  }
  return out;
}
/* 쾅! 터지는 모양 (가운데에 fx 글자를 올린다) */
function impact(x, y, r = 60, color = '#ffe14d') {
  let d = '';
  for (let i = 0; i < 24; i++) { const t = i / 24 * Math.PI * 2, rr = i % 2 ? r * .62 : r; d += (i ? 'L' : 'M') + ` ${(x + Math.cos(t) * rr).toFixed(1)} ${(y + Math.sin(t) * rr).toFixed(1)} `; }
  return `<path d="${d}Z" fill="${color}" ${S}/>`;
}
/* 도감 카드 소품 (마지막 컷 '오늘의 도감 획득!'에 쓴다) */
function dexCard(x, y, s, no, name, color = '#e8443a', rot = -6) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <rect x="-52" y="-70" width="104" height="140" rx="10" fill="#fff" ${S}/>
    <rect x="-52" y="-70" width="104" height="36" rx="10" fill="${color}" ${S}/>
    <text x="0" y="-45" font-family="Jua" font-size="17" text-anchor="middle" fill="#fff">도감 No.${no}</text>
    <circle cx="0" cy="4" r="24" fill="#fff3b0" ${S}/><text x="0" y="13" font-family="Jua" font-size="26" text-anchor="middle">⭐</text>
    <text x="0" y="54" font-family="Jua" font-size="${name.length > 5 ? 15 : 19}" text-anchor="middle">${name}</text></g>`;
}
