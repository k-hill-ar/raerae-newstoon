/* 12화 소품: 시험 책상, 시계, 연필 */
const clock = (x, y, r) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#fff" stroke="${INK}" stroke-width="4"/>
  ${Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180; return `<line x1="${(Math.sin(a) * r * .78).toFixed(1)}" y1="${(-Math.cos(a) * r * .78).toFixed(1)}" x2="${(Math.sin(a) * r * .9).toFixed(1)}" y2="${(-Math.cos(a) * r * .9).toFixed(1)}" stroke="${INK}" stroke-width="2"/>`; }).join('')}
  <line x1="0" y1="0" x2="0" y2="${-r * .5}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  <g class="spin" style="animation-duration:6s"><line x1="0" y1="0" x2="${r * .7}" y2="0" stroke="#e8443a" stroke-width="3" stroke-linecap="round"/></g>
  <circle r="4" fill="${INK}"/></g>`;
const pencil = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot || 0})"><rect x="-6" y="-40" width="12" height="60" fill="#ffd43b" ${S}/><path d="M -6 20 L 0 34 L 6 20 Z" fill="#f3d2a8" ${S}/><rect x="-6" y="-48" width="12" height="10" fill="#ff9aa2" ${S}/></g>`;
const paper = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-50" y="-34" width="100" height="68" fill="#fff" ${S}/><path d="M -38 -18 H 38 M -38 -4 H 38 M -38 10 H 20" stroke="#999" stroke-width="3"/></g>`;

const PANELS = [
  { // 1. 모의고사 시작
    svg: desk() + clock(200, 80, 40) + paper(140, 200) + paper(280, 200) + pencil(170, 196, 30) +
      bob(ryan({ x: 70, y: 210, s: .6, expr: 'think' })) + bob(aiden({ x: 340, y: 206, s: .62, expr: 'talk', flip: true }), 'd1'),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:30%">진짜 시험처럼?</div>
      <div class="b box t-br" style="left:68%;top:3%;width:30%">60분 시작!</div>`
  },
  { // 2. 피카: 생각 근육
    svg: `<rect width="400" height="300" fill="#f1eaff"/>` +
      [['❄️', 60, 80], ['🧲', 120, 70], ['🐻', 180, 80], ['🔦', 240, 70], ['🔔', 60, 140], ['🦴', 120, 150], ['🧂', 180, 140], ['🌱', 240, 150], ['🏞️', 60, 210], ['⚖️', 120, 220], ['🌋', 180, 210]].map(([e, x, y], i) => `<g class="grow g${(i % 6) + 1}">${label(e, x, y, 30)}</g>`).join('') +
      hop(pika({ x: 330, y: 220, s: .82, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">11번 동안 키운 생각 근육, 모두 꺼내 봐!</div>`
  },
  { // 3. 시험장 팁
    svg: `<rect width="400" height="300" fill="#fff8e6"/>` + board(20, 50, 230, 190, '시험장 3단계', [['① 끝까지 읽기', '#fff'], ['② 생각 메모', W], ['③ 쓰고 다시 읽기', G]], 16) +
      bob(aiden({ x: 320, y: 206, s: .64, expr: 'talk', pose: 'point', flip: true })),
    html: `<div class="b shout t-br" style="left:52%;top:3%;width:46%">빈칸은 안 돼, 생각이라도!</div>`
  },
  { // 4. 응원
    svg: sky('e4', ['#ffd9a8', '#fff4d6'], 0) + sun(200, 70, 30) + `<path d="M 0 250 Q 200 232 400 250 V 300 H 0 Z" fill="#8fbf6a" stroke="${INK}" stroke-width="3"/>` +
      fx('D-2', 200, 160, 44, -4, '#ffe14d') +
      bob(aiden({ x: 74, y: 214, s: .62, expr: 'happy', pose: 'wave' })) + bob(ryan({ x: 326, y: 214, s: .6, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 200, y: 262, s: .44, expr: 'happy' })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:38%">라이언, 할 수 있어!</div>
      <div class="b shout t-br" style="left:56%;top:3%;width:42%">생각을 보여 줄게!</div>`
  }
];
renderPanels(PANELS);
