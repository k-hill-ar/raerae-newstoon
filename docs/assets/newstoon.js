/* 래래 뉴스툰 공용 그림 도구
   - 등장인물: aiden(), ryan(), pika(), friend('chan'|'jayden'|'julia'|'heart'|'sophia', opts)
   - 배경/소품: space(), sky(), stars(), earth(), voyager(), moon(), planet(), meteor(), baseball(), fx()
   - renderPanels(panels): 만화 컷을 #panels 에 그림
*/
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
  let arms;
  if (o.pose === 'point') arms = arm(-24, 52, -36, 96, jersey) + arm(24, 52, 54, -6, jersey);
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

  return `<g transform="translate(${o.x},${o.y}) scale(${f * s},${s})">
    <rect x="-22" y="100" width="18" height="44" rx="6" fill="#d9d4c7" ${S}/>
    <rect x="4" y="100" width="18" height="44" rx="6" fill="#d9d4c7" ${S}/>
    ${hairBack}
    <rect x="-29" y="38" width="58" height="70" rx="18" fill="${jersey}" ${S}/>
    ${stripes}
    <path d="M -10 38 L 0 50 L 10 38" fill="#fff" ${S}/>
    ${arms}
    <circle cx="0" cy="0" r="38" fill="${SKIN}" ${S}/>
    ${top}${bow}
    <ellipse cx="${-22 + ex}" cy="20" rx="6" ry="3.5" fill="#ff8f8f" opacity=".7"/>
    <ellipse cx="${22 + ex}" cy="20" rx="6" ry="3.5" fill="#ff8f8f" opacity=".7"/>
    ${eyes}${mouth}${extra}
  </g>`;
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
  if (o.expr === 'happy') eyes = `<path d="M -17 -3 Q -11 -13 -5 -3 M 5 -3 Q 11 -13 17 -3" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  const mouth = o.expr === 'wow'
    ? `<ellipse cx="0" cy="12" rx="6" ry="7" fill="#a8322c" ${S}/>`
    : o.expr === 'happy'
      ? `<path d="M -9 7 Q 0 20 9 7 Z" fill="#a8322c" ${S}/>`
      : `<path d="M -8 9 Q -4 15 0 10 Q 4 15 8 9" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${o.x},${o.y}) scale(${f * s},${s})">
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
    ${mouth}
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

/* 컷 렌더링 */
function renderPanels(panels) {
  document.getElementById('panels').innerHTML = panels.map((p, i) =>
    `<div class="panel"><svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${p.svg}</svg>${p.html || ''}<span class="num">${i + 1}</span></div>`
  ).join('');
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
