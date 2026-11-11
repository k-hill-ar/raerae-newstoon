/* 10화 소품: 시소, 용수철저울, 거중기, 돌 */
const seesaw = (cx, y, ang, len) => `<g><path d="M ${cx - 20} ${y + 40} L ${cx} ${y} L ${cx + 20} ${y + 40} Z" fill="#8a5a2b" ${S}/>
  <g transform="rotate(${ang} ${cx} ${y})"><rect x="${cx - len}" y="${y - 8}" width="${len * 2}" height="14" rx="5" fill="#f2c230" ${S}/></g></g>`;
const springScale = (x, y, stretch) => `<g transform="translate(${x} ${y})"><rect x="-14" y="-10" width="28" height="12" fill="#5b6b7e" ${S}/>
  <path d="M 0 2 ${Array.from({ length: 8 }, (_, i) => `L ${i % 2 ? -10 : 10} ${4 + (i + 1) * stretch / 8}`).join(' ')} L 0 ${stretch + 10}" stroke="${INK}" stroke-width="3" fill="none"/>
  <rect x="-14" y="${stretch + 10}" width="28" height="22" rx="4" fill="#e8443a" ${S}/></g>`;
const rock = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M -30 10 Q -36 -18 -8 -24 Q 22 -30 32 -6 Q 38 16 14 20 L -22 20 Q -32 18 -30 10 Z" fill="#9aa3ad" ${S}/></g>`;
const crane = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})">
  <path d="M -70 120 L -10 -40 L 10 -40 L 70 120" stroke="#8a5a2b" stroke-width="10" fill="none" stroke-linejoin="round"/>
  <path d="M -70 120 L -10 -40 L 10 -40 L 70 120" stroke="${INK}" stroke-width="2" fill="none"/>
  <rect x="-30" y="-44" width="60" height="12" fill="#6b4a2b" ${S}/>
  ${[-16, 0, 16].map(dx => `<circle cx="${dx}" cy="-26" r="7" fill="#c9a227" ${S}/>`).join('')}
  ${[-16, 0, 16].map(dx => `<line x1="${dx}" y1="-20" x2="${dx * .4}" y2="40" stroke="${INK}" stroke-width="2"/>`).join('')}
  <circle cx="0" cy="48" r="8" fill="#c9a227" ${S}/></g>`;

const PANELS = [
  { // 1. 도입: 기울어진 시소
    svg: outdoor('#cfe9f7', '#d9b98a') + seesaw(200, 214, -16, 140) +
      bob(friend('chan', { x: 312, y: 150, s: .5, expr: 'happy', flip: true })) + bob(ryan({ x: 86, y: 220, s: .54, expr: 'sad' }), 'd1'),
    html: `<div class="b shout t-bl" style="left:2%;top:3%;width:42%">내 쪽이 안 내려가!</div>
      <div class="b box t-br" style="left:58%;top:58%;width:40%">무게가 달라서 그래</div>`
  },
  { // 2. 피카: 무게 × 거리
    svg: `<rect width="400" height="300" fill="#fff8e6"/>` + seesaw(200, 180, 0, 150) +
      `<g class="grow g1"><rect x="76" y="140" width="30" height="30" fill="#2f6fde" ${S}/>${label('2', 91, 162, 18, '#fff')}</g>` +
      `<g class="grow g2"><rect x="250" y="126" width="30" height="44" fill="#e8443a" ${S}/>${label('3', 265, 156, 18, '#fff')}</g>` +
      label('3칸', 120, 214, 16) + label('2칸', 250, 214, 16) + label('2×3 = 3×2 ⭐', 200, 120, 20, '#e8443a') +
      hop(pika({ x: 340, y: 254, s: .54, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">수평 비밀: 무게 × 거리가 같으면 OK!</div>`
  },
  { // 3. 핵심: 용수철 저울
    svg: `<rect width="400" height="300" fill="#eef4ff"/><rect x="40" y="40" width="320" height="10" fill="#8a5a2b" ${S}/>` +
      springScale(110, 60, 40) + springScale(200, 60, 80) + springScale(290, 60, 120) +
      label('1개', 110, 150, 16) + label('2개', 200, 190, 16) + label('3개', 290, 230, 16) +
      bob(ryan({ x: 360, y: 250, s: .4, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:78%;width:70%">무게 2배 → 늘어난 길이도 2배!</div>`
  },
  { // 4. 야구 비유: 배트 짧게 잡기
    svg: field() + `<line x1="150" y1="120" x2="260" y2="60" stroke="#8a5a2b" stroke-width="12" stroke-linecap="round"/>` +
      `<circle cx="168" cy="110" r="8" fill="${SKIN}" ${S}/>` + label('짧게 잡으면 가볍게!', 170, 182, 16, '#2f6fde') +
      bob(aiden({ x: 70, y: 222, s: .62, expr: 'talk', pose: 'point' })) + bob(ryan({ x: 336, y: 226, s: .58, expr: 'happy', flip: true }), 'd2'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">배트도 손에서 먼 끝이 더 무겁게 느껴져요</div>
      <div class="b shout t-br" style="left:62%;top:44%;width:36%">이것도 지레!</div>`
  },
  { // 5. 역사(국내): 거중기
    svg: outdoor('#ffe8c2', '#c7a77a') + `<rect x="250" y="120" width="140" height="116" fill="#d9c7a0" ${S}/>` +
      [0, 1, 2].map(r => [0, 1, 2, 3].map(c => `<rect x="${252 + c * 34}" y="${122 + r * 38}" width="34" height="38" fill="none" stroke="#a08a5a" stroke-width="2"/>`).join('')).join('') +
      crane(150, 100, 1) + `<g class="float">${rock(150, 168, .8)}</g>` +
      hop(pika({ x: 40, y: 210, s: .44, expr: 'wow' })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:84%">정약용의 거중기: 도르래로 무거운 돌을 번쩍!</div>
      <div class="b box t-br" style="left:60%;top:22%;width:38%">10년 예상 공사를 2년 8개월에!</div>`
  },
  { // 6. 역사(해외): 아르키메데스
    svg: space(12) + earth(300, 90, 46) + `<path d="M 40 240 L 300 140" stroke="#f2c230" stroke-width="8"/><path d="M 210 186 l -16 30 h 32 z" fill="#8a5a2b" ${S}/>` +
      bob(aiden({ x: 70, y: 220, s: .5, expr: 'talk', pose: 'point' })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:62%">아르키메데스: “설 곳만 주면 지구도 움직이겠다!”</div>`
  },
  { // 7. 놀라운 포인트: 멀리 누를수록 쉽다
    svg: `<rect width="400" height="300" fill="#fff8e6"/><rect x="0" y="230" width="400" height="70" fill="#e9c99a" stroke="${INK}" stroke-width="3"/>` +
      rock(80, 196, 1.2) + `<path d="M 60 220 L 360 150" stroke="#8a5a2b" stroke-width="10" stroke-linecap="round"/><path d="M 120 208 l -16 22 h 32 z" fill="#5b6b7e" ${S}/>` +
      `<g class="pulse">${arrow(350, 100, 350, 140, '#e8443a')}</g>` +
      hop(ryan({ x: 330, y: 214, s: .5, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:58%">받침점에서 멀리 누를수록 힘이 덜 들어요</div>
      <div class="b shout t-bl" style="left:30%;top:50%;width:36%">한 손가락으로!</div>`
  },
  { // 8. 마무리
    svg: desk() + `<path d="M 120 200 L 280 200" stroke="#f2c230" stroke-width="8"/><path d="M 200 204 l -10 26 h 20 z" fill="#5b6b7e" ${S}/>` +
      `<circle cx="140" cy="192" r="8" fill="#c9a227" ${S}/><circle cx="262" cy="192" r="8" fill="#c9a227" ${S}/>` +
      bob(aiden({ x: 64, y: 206, s: .66, expr: 'smile' })) + bob(ryan({ x: 336, y: 208, s: .62, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 200, y: 130, s: .4, expr: 'happy' })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:42%">자와 동전으로 수평 잡기!</div>
      <div class="b shout t-br" style="left:54%;top:3%;width:44%">D-6! 균형 잡고 GO!</div>`
  }
];
renderPanels(PANELS);
