/* 6화 소품: 지층 절벽, 발자국, 어룡 화석, 망치 */
const strata = (y0, colors, h) => colors.map((c, i) => `<rect x="0" y="${y0 + i * h}" width="400" height="${h}" fill="${c}" stroke="${INK}" stroke-width="2"/>`).join('');
const track = (x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot || 0}) scale(${s || 1})" fill="#6b4a2b"><ellipse cx="0" cy="6" rx="8" ry="10"/><ellipse cx="-11" cy="-10" rx="4" ry="9" transform="rotate(-25 -11 -10)"/><ellipse cx="0" cy="-14" rx="4" ry="10"/><ellipse cx="11" cy="-10" rx="4" ry="9" transform="rotate(25 11 -10)"/></g>`;
const ichthy = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#f3efe4" stroke-width="4" stroke-linecap="round">
  <path d="M -120 0 Q -40 -26 60 -6 Q 100 0 130 -20 M 130 -20 L 116 6 M 130 -20 L 112 -30"/>
  <path d="M -120 0 L -160 -6 M -120 0 L -158 6"/><circle cx="-108" cy="-6" r="8"/>
  ${[-80, -60, -40, -20, 0, 20, 40].map(xx => `<path d="M ${xx} ${-14 + Math.abs(xx) / 12} q 2 14 0 26"/>`).join('')}
  <path d="M -50 10 q -14 22 -30 26 M 40 6 q -8 16 -20 22"/></g>`;

const PANELS = [
  { // 1. 도입: 줄무늬 절벽
    svg: `<rect width="400" height="300" fill="#bfe3ff"/>` + strata(90, ['#c9a46b', '#a37a4f', '#d9b98a', '#8a6a50', '#c9a46b'], 30) +
      `<rect x="0" y="240" width="400" height="60" fill="#e9c99a" stroke="${INK}" stroke-width="3"/>` +
      bob(ryan({ x: 92, y: 210, s: .72, expr: 'wow' })) + bob(aiden({ x: 304, y: 204, s: .76, expr: 'talk', flip: true }), 'd1'),
    html: `<div class="b shout t-bl" style="left:2%;top:3%;width:40%">절벽에 줄무늬가!</div>
      <div class="b box t-br" style="left:56%;top:3%;width:42%">땅속 달력, 지층이야</div>`
  },
  { // 2. 피카: 아래가 먼저
    svg: `<rect width="400" height="300" fill="#fff8e6"/>` +
      `<g class="grow g3"><rect x="60" y="80" width="200" height="40" fill="#d9b98a" ${S}/></g>` + label('3. 나중', 160, 106, 16) +
      `<g class="grow g2"><rect x="60" y="120" width="200" height="40" fill="#a37a4f" ${S}/></g>` + label('2.', 160, 146, 16, '#fff') +
      `<g class="grow g1"><rect x="60" y="160" width="200" height="40" fill="#8a6a50" ${S}/></g>` + label('1. 먼저', 160, 186, 16, '#fff') +
      arrow(36, 196, 36, 90, '#e8443a') + hop(pika({ x: 330, y: 226, s: .8, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:62%">아래층이 먼저, 위층이 나중!</div>
      <div class="b box t-br" style="left:58%;top:26%;width:40%">시루떡처럼 쌓여!</div>`
  },
  { // 3. 핵심: 화석이 되는 과정
    svg: `<rect width="400" height="300" fill="#2f7fd0"/>` + strata(200, ['#d9b98a', '#a37a4f', '#8a6a50'], 34) +
      `<g class="grow g1">${ichthy(200, 220, .7)}</g>` + arrow(200, 120, 200, 186, '#fff') + label('빨리 묻히면', 200, 110, 18, '#fff'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">빨리 묻히고 오래 굳으면 화석이 돼요</div>`
  },
  { // 4. 야구 비유: 스코어북
    svg: field() + board(110, 60, 180, 136, '스코어북', [['9회  위', G], ['5회  가운데', '#fff'], ['1회  맨 아래', W]], 15) +
      bob(aiden({ x: 60, y: 222, s: .62, expr: 'talk', pose: 'point' })) + bob(ryan({ x: 340, y: 226, s: .58, expr: 'happy', flip: true }), 'd2'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:76%">기록을 아래부터 쌓으면 1회가 맨 아래!</div>
      <div class="b shout t-br" style="left:64%;top:40%;width:34%">지층도 똑같네!</div>`
  },
  { // 5. 역사(국내): 고성 공룡 발자국
    svg: `<rect width="400" height="300" fill="#bfe3ff"/><path d="M 0 120 L 400 140 L 400 300 L 0 300 Z" fill="#8c8a83" ${S}/>` +
      [[60, 250], [100, 220], [140, 252], [180, 222], [220, 254], [260, 224]].map(([x, y], i) => `<g class="grow g${i + 1}">${track(x, y, .9, 70)}</g>`).join('') +
      hop(pika({ x: 340, y: 230, s: .6, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:74%">경남 고성 바닷가 바위에 공룡 발자국이 가득!</div>
      <div class="b box t-br" style="left:56%;top:24%;width:42%">200개 넘는 층에서 나왔대</div>`
  },
  { // 6. 역사(해외): 메리 애닝
    svg: `<rect width="400" height="300" fill="#dcebf5"/>` + strata(60, ['#8a8f99', '#6b7079', '#8a8f99'], 50) +
      `<rect x="40" y="88" width="300" height="80" fill="#5b6070" stroke="${INK}" stroke-width="3"/>` + ichthy(190, 128, .9) +
      `<rect x="0" y="210" width="400" height="90" fill="#d9c7a0" stroke="${INK}" stroke-width="3"/>` +
      friend('sophia', { x: 330, y: 230, s: .52, expr: 'wow', flip: true }),
    html: `<div class="nar" style="left:2%;top:2.5%;width:90%">1811년 영국, 12살 메리 애닝이 어룡 화석을 찾았어요</div>
      <div class="b shout t-br" style="left:44%;top:62%;width:36%">12살에?!</div>`
  },
  { // 7. 놀라운 포인트: 산꼭대기 조개
    svg: `<rect width="400" height="300" fill="#cfe9f7"/><path d="M 0 300 L 170 70 L 230 120 L 290 60 L 400 300 Z" fill="#8c8a83" ${S}/>` +
      `<path d="M 150 96 L 170 70 L 190 96 Z M 272 84 L 290 60 L 310 86 Z" fill="#fff"/>` +
      `<g class="pulse" transform="translate(290 100)"><path d="M -16 8 Q 0 -22 16 8 Z" fill="#ffd6a5" ${S}/><path d="M -8 6 L -4 -8 M 0 6 L 0 -10 M 8 6 L 4 -8" stroke="${INK}" stroke-width="2"/></g>` +
      hop(ryan({ x: 70, y: 232, s: .56, expr: 'wow' })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:56%">산꼭대기에서 조개 화석이!</div>
      <div class="b shout t-bl" style="left:2%;top:38%;width:40%">옛날엔 바다였구나!</div>`
  },
  { // 8. 마무리
    svg: desk() + `<g transform="translate(200 160)"><rect x="-20" y="-50" width="40" height="90" rx="6" fill="#cfe8ff" ${S}/><rect x="-18" y="10" width="36" height="12" fill="#8a6a50"/><rect x="-18" y="-2" width="36" height="12" fill="#d9b98a"/><rect x="-18" y="22" width="36" height="16" fill="#6b6658"/></g>` +
      bob(aiden({ x: 74, y: 206, s: .7, expr: 'smile' })) + bob(ryan({ x: 326, y: 208, s: .66, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 200, y: 262, s: .4, expr: 'happy' })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:42%">병 속에 지층을 만들어 보자</div>
      <div class="b shout t-br" style="left:54%;top:3%;width:44%">실력도 차곡차곡!</div>`
  }
];
renderPanels(PANELS);
