/* 5화 소품: 소리 물결, 큰 종, 종이컵 실 전화기, 번개 */
const waves = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
  ${[1, 2, 3].map(i => `<path class="wave w${i}" d="M ${i * 14} -${i * 14} Q ${i * 22} 0 ${i * 14} ${i * 14}" stroke="#2f6fde" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
const bell = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-70" y="-110" width="140" height="10" fill="#6b4a2b" ${S}/><rect x="-8" y="-100" width="16" height="16" fill="#6b4a2b" ${S}/>
  <path d="M -40 -84 Q -44 -30 -60 20 L 60 20 Q 44 -30 40 -84 Q 0 -96 -40 -84 Z" fill="#3e7f6e" ${S}/>
  <path d="M -48 -10 Q 0 -2 48 -10" stroke="#2c5f52" stroke-width="3" fill="none"/>
  <ellipse cx="0" cy="20" rx="60" ry="10" fill="#2c5f52" ${S}/>
  <circle cx="-22" cy="-40" r="8" fill="#56a08c" stroke="${INK}" stroke-width="2"/></g>`;
const cup = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><path d="M 0 -18 L 30 -26 L 30 26 L 0 18 Z" fill="#fff" ${S}/><path d="M 4 -10 L 26 -16 M 4 10 L 26 16" stroke="#e8443a" stroke-width="3"/></g>`;
const bolt = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" class="twinkle"><path d="M 0 0 L -18 46 L -4 46 L -16 90 L 22 34 L 6 34 L 18 0 Z" fill="#ffe14d" ${S}/></g>`;

const PANELS = [
  { // 1. 도입: 북 치기
    svg: desk() + `<g class="shake"><ellipse cx="200" cy="200" rx="46" ry="14" fill="#f2c230" ${S}/><path d="M 154 200 L 154 236 Q 200 252 246 236 L 246 200" fill="#e8443a" ${S}/></g>` + waves(250, 170, 1) + waves(150, 170, 1, true) +
      bob(ryan({ x: 86, y: 206, s: .74, expr: 'happy', pose: 'wave' })) + bob(aiden({ x: 314, y: 200, s: .78, expr: 'think', flip: true }), 'd1'),
    html: `<div class="b shout t-bl" style="left:2%;top:3%;width:38%">둥둥둥!</div>
      <div class="b box t-br" style="left:54%;top:3%;width:44%">소리는 어떻게 귀까지 올까?</div>`
  },
  { // 2. 피카: 떨림
    svg: `<rect width="400" height="300" fill="#eef4ff"/><g class="shake">${`<rect x="96" y="70" width="14" height="110" rx="6" fill="#b0b8c4" ${S}/><rect x="136" y="70" width="14" height="110" rx="6" fill="#b0b8c4" ${S}/><path d="M 103 180 Q 123 200 143 180 L 128 180 L 128 240 L 118 240 L 118 180 Z" fill="#b0b8c4" ${S}/>`}</g>` +
      waves(160, 110, 1.1) + hop(pika({ x: 320, y: 228, s: .82, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">소리를 내는 물체는 모두 떨려요</div>
      <div class="b box t-br" style="left:56%;top:24%;width:42%">손으로 잡으면 소리가 뚝!</div>`
  },
  { // 3. 핵심: 물질을 타고 전달
    svg: `<rect width="400" height="300" fill="#fff8e6"/>` + cup(70, 150, 1.4, true) + cup(330, 150, 1.4) +
      `<line x1="70" y1="150" x2="330" y2="150" stroke="${INK}" stroke-width="3"/>` +
      `<g class="pulse"><circle cx="140" cy="150" r="6" fill="#2f6fde"/><circle cx="200" cy="150" r="6" fill="#2f6fde"/><circle cx="260" cy="150" r="6" fill="#2f6fde"/></g>` +
      bob(aiden({ x: 50, y: 232, s: .5, expr: 'talk' })) + bob(ryan({ x: 352, y: 236, s: .48, expr: 'wow', flip: true }), 'd1'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:76%">떨림은 공기·물·실을 타고 전해져요</div>
      <div class="b shout t-br" style="left:58%;top:22%;width:40%">실로 들려!</div>`
  },
  { // 4. 야구 비유: 배트 소리가 늦게
    svg: field() + `<rect x="300" y="60" width="96" height="70" fill="#5b6b7e" ${S}/>` + label('외야석', 348, 100, 16, '#fff') +
      `<line x1="96" y1="180" x2="140" y2="150" stroke="#8a5a2b" stroke-width="7" stroke-linecap="round"/>` + `<g class="pulse">${baseball(150, 146, 9)}</g>` +
      fx('딱!', 120, 128, 28, -10) + `<path d="M 160 140 Q 230 100 296 96" stroke="#2f6fde" stroke-width="3" stroke-dasharray="6 8" fill="none"/>` +
      bob(ryan({ x: 70, y: 226, s: .6, expr: 'happy' })) + bob(aiden({ x: 330, y: 222, s: .58, expr: 'talk', flip: true }), 'd2'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:66%">외야석에선 ‘딱!’ 소리가 늦게 와요</div>
      <div class="b box t-br" style="left:34%;top:50%;width:32%">소리는 1초에 340m!</div>`
  },
  { // 5. 역사(국내): 성덕대왕신종
    svg: `<rect width="400" height="300" fill="#e6f2df"/><rect x="0" y="250" width="400" height="50" fill="#b7a07a" stroke="${INK}" stroke-width="3"/>` +
      bell(150, 220, 1.2) + waves(232, 160, 1.3) + waves(68, 160, 1.3, true) +
      hop(pika({ x: 334, y: 244, s: .6, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:62%">771년 성덕대왕신종, 웅~ 웅~ 맥놀이!</div>
      <div class="b box t-br" style="left:58%;top:32%;width:40%">1250년 넘게 울려!</div>`
  },
  { // 6. 역사(해외): 물속은 빠르다
    svg: `<rect width="400" height="300" fill="#2f7fd0"/><rect width="400" height="60" fill="#bfe3ff"/><path d="M 0 60 Q 50 52 100 60 T 200 60 T 300 60 T 400 60" stroke="#fff" stroke-width="4" fill="none"/>` +
      `<g class="float"><path d="M 60 180 Q 120 130 200 170 Q 230 150 250 136 Q 244 166 256 196 Q 230 182 200 190 Q 120 220 60 180 Z" fill="#5b7fb8" ${S}/><circle cx="90" cy="172" r="4" fill="${INK}"/></g>` +
      waves(260, 170, 1.2) +
      board(250, 84, 140, 110, '빠르기', [['공기 340m', '#fff'], ['물 1500m ⭐', G]], 15),
    html: `<div class="nar" style="left:2%;top:74%;width:60%">물속에서는 소리가 4배 넘게 빨라요</div>`
  },
  { // 7. 놀라운 포인트: 번개와 천둥 계산
    svg: sky('n7', ['#2b2d42', '#5b6b7e'], 0) + cloud(150, 50, 1.3) + bolt(150, 66, 1) +
      `<path d="M 0 250 Q 200 236 400 250 V 300 H 0 Z" fill="#4a6b3a" stroke="${INK}" stroke-width="3"/>` +
      board(230, 90, 160, 120, '1, 2, 3초!', [['340 × 3', '#fff'], ['= 약 1km', G]], 15) +
      hop(ryan({ x: 80, y: 234, s: .5, expr: 'wow' })),
    html: `<div class="b shout t-bl" style="left:24%;top:72%;width:40%">천둥으로 거리 계산!</div>`
  },
  { // 8. 마무리
    svg: desk() + cup(140, 170, 1, true) + cup(260, 170, 1) + `<line x1="140" y1="170" x2="260" y2="170" stroke="${INK}" stroke-width="3"/>` +
      bob(aiden({ x: 74, y: 206, s: .7, expr: 'smile' })) + bob(ryan({ x: 326, y: 208, s: .66, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 200, y: 256, s: .42, expr: 'happy' })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:42%">실 종류 바꿔 실험해 볼까?</div>
      <div class="b shout t-br" style="left:54%;top:3%;width:44%">D-16! 크게 외쳐!</div>`
  }
];
renderPanels(PANELS);
