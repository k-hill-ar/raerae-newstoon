/* 4화 소품: 손전등, 막대와 그림자, 거울, 앙부일구 */
const torch = (x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot || 0}) scale(${s || 1})">
  <rect x="-40" y="-10" width="44" height="20" rx="4" fill="#5b6b7e" ${S}/><path d="M 4 -16 L 24 -22 L 24 22 L 4 16 Z" fill="#8fa3b8" ${S}/></g>`;
const beam = (x1, y1, x2, ytop, ybot) => `<path d="M ${x1} ${y1} L ${x2} ${ytop} L ${x2} ${ybot} Z" fill="#fff6b0" opacity=".75"/>`;
const stick = (x, y, h) => `<rect x="${x - 4}" y="${y - h}" width="8" height="${h}" fill="#8a5a2b" ${S}/>`;
const mirror = (x, y, w, h) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#cfe8ff" ${S}/><path d="M ${x + 8} ${y + h - 12} L ${x + w - 12} ${y + 10}" stroke="#fff" stroke-width="5"/></g>`;
const angbu = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M -70 0 A 70 56 0 0 0 70 0 Z" fill="#c9a227" ${S}/><ellipse cx="0" cy="0" rx="70" ry="16" fill="#e8d48a" ${S}/>
  <path d="M -54 -2 Q 0 10 54 -2 M -60 -6 Q 0 4 60 -6" stroke="#8a6d1a" stroke-width="2" fill="none"/>
  <line x1="-30" y1="0" x2="10" y2="-40" stroke="${INK}" stroke-width="4"/>
  <path d="M -40 60 L -50 92 M 40 60 L 50 92 M 0 56 L 0 92" stroke="#6b4a2b" stroke-width="7"/></g>`;

const PANELS = [
  { // 1. 도입: 운동장 그림자
    svg: outdoor('#bfe3ff', '#d9b98a') + sun(350, 50, 24) +
      `<ellipse cx="150" cy="268" rx="70" ry="12" fill="#1d1d1f" opacity=".25"/><ellipse cx="300" cy="266" rx="60" ry="11" fill="#1d1d1f" opacity=".25"/>` +
      bob(ryan({ x: 100, y: 206, s: .74, expr: 'wow' })) + bob(aiden({ x: 300, y: 200, s: .78, expr: 'talk', flip: true }), 'd1'),
    html: `<div class="b shout t-bl" style="left:2%;top:3%;width:40%">그림자가 졸졸 따라와!</div>
      <div class="b box t-br" style="left:52%;top:20%;width:36%">빛이 곧게 가서 그래</div>`
  },
  { // 2. 피카: 빛의 직진
    svg: `<rect width="400" height="300" fill="#2b2d42"/>` + beam(110, 150, 330, 40, 260) + torch(90, 150, 1.1) +
      `<rect x="196" y="120" width="34" height="60" rx="6" fill="#e8443a" ${S}/>` +
      `<path d="M 230 120 L 330 70 L 330 230 L 230 180 Z" fill="#2b2d42"/>` + `<rect x="330" y="30" width="16" height="240" fill="#f3efe4" ${S}/>` +
      `<rect x="330" y="80" width="16" height="140" fill="#555"/>` + hop(pika({ x: 120, y: 250, s: .62, pose: 'explain' })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:62%">빛은 곧게 가요. 막히면 그림자!</div>
      <div class="b box t-bl" style="left:36%;top:68%;width:40%">돌아가지 못해서 깜깜!</div>`
  },
  { // 3. 핵심: 가까울수록 그림자가 커요
    svg: `<rect width="400" height="300" fill="#2b2d42"/><rect x="350" y="20" width="16" height="260" fill="#f3efe4" ${S}/>` +
      beam(60, 90, 350, 30, 150) + torch(40, 90, .8) + `<rect x="150" y="76" width="16" height="28" rx="4" fill="#e8443a" ${S}/><rect x="350" y="52" width="16" height="78" fill="#555"/>` +
      beam(60, 210, 350, 170, 250) + torch(40, 210, .8) + `<rect x="260" y="196" width="16" height="28" rx="4" fill="#e8443a" ${S}/><rect x="350" y="190" width="16" height="40" fill="#555"/>` +
      label('가까이', 158, 132, 15, '#ffe14d') + label('멀리', 268, 252, 15, '#ffe14d'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:62%">손전등에 가까울수록 그림자가 커져요</div>
      <div class="b shout t-l" style="left:50%;top:40%;width:34%">진짜 크네!</div>`
  },
  { // 4. 야구 비유: 반사
    svg: field() + `<rect x="300" y="60" width="30" height="160" fill="#2e7d4f" ${S}/>` + label('펜스', 315, 240, 14) +
      `<path d="M 120 190 L 300 120 L 150 70" stroke="#e8443a" stroke-width="4" stroke-dasharray="10 8" fill="none"/>` +
      `<g class="pulse">${baseball(156, 72, 11)}</g>` +
      bob(aiden({ x: 70, y: 220, s: .66, expr: 'talk', pose: 'point' })) + bob(ryan({ x: 214, y: 232, s: .56, expr: 'happy', flip: true }), 'd2'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:76%">공이 펜스에 맞고 튕기듯, 빛도 거울에서 튕겨요</div>
      <div class="b box t-bl" style="left:2%;top:40%;width:34%">들어간 각 = 나온 각!</div>`
  },
  { // 5. 역사(국내): 앙부일구
    svg: outdoor('#ffe8c2', '#d9b98a') + sun(60, 48, 20) + angbu(240, 150, 1.25) +
      `<path d="M 230 154 L 262 150" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity=".6"/>` +
      bob(aiden({ x: 80, y: 218, s: .62, expr: 'talk' })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:84%">1434년 세종, 길가에 해시계 ‘앙부일구’를 세웠어요</div>
      <div class="b box t-bl" style="left:2%;top:26%;width:38%">그림자로 시각과 절기를 읽어!</div>`
  },
  { // 6. 역사(해외): 에라토스테네스
    svg: `<rect width="400" height="300" fill="#fff4d6"/><path d="M 20 300 A 360 360 0 0 1 380 300" fill="#e9c99a" ${S}/>` +
      `<g stroke="#ffd43b" stroke-width="3">${[60, 120, 180, 240, 300, 360].map(x => `<line x1="${x}" y1="10" x2="${x}" y2="60"/>`).join('')}</g>` +
      label('햇빛', 30, 30, 14, '#c27c00', 'start') +
      `<line x1="120" y1="150" x2="112" y2="96" stroke="#8a5a2b" stroke-width="6"/><path d="M 112 96 L 120 150 L 104 150 Z" fill="#555" opacity=".5"/>` +
      `<line x1="280" y1="134" x2="284" y2="80" stroke="#8a5a2b" stroke-width="6"/>` +
      label('알렉산드리아', 112, 176, 14) + label('시에네', 286, 160, 14) + label('그림자 7.2°', 112, 86, 14, '#e8443a') + label('그림자 없음', 286, 70, 14, '#2f6fde'),
    html: `<div class="nar" style="left:2%;top:74%;width:96%">같은 시각, 두 도시 그림자 각도가 달라요 → 지구는 둥글다!</div>`
  },
  { // 7. 놀라운 포인트: 지구 둘레 계산
    svg: `<rect width="400" height="300" fill="#e8f1ff"/>` + earth(110, 160, 80) +
      `<path d="M 110 160 L 110 80 M 110 160 L 120 81" stroke="#e8443a" stroke-width="3"/>` + label('7.2°', 128, 118, 14, '#e8443a', 'start') +
      board(210, 70, 176, 150, '지구 둘레', [['7.2° = 1/50 바퀴', '#fff'], ['800km × 50', W], ['= 약 4만 km ⭐', G]], 14) +
      hop(ryan({ x: 330, y: 262, s: .4, expr: 'wow', flip: true })),
    html: `<div class="b shout t-bl" style="left:2%;top:3%;width:52%">막대 하나로 지구를 쟀어!</div>`
  },
  { // 8. 마무리
    svg: `<rect width="400" height="300" fill="#2b2d42"/>` + beam(170, 120, 330, 40, 200) + torch(150, 120, .9, 0) +
      `<path d="M 250 140 l 10 -20 l 10 20 z" fill="#e8443a" ${S}/>` +
      bob(aiden({ x: 74, y: 210, s: .66, expr: 'smile' })) + bob(ryan({ x: 320, y: 214, s: .62, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 200, y: 262, s: .4, expr: 'happy' })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:42%">그림자 모양 실험해 보자!</div>
      <div class="b shout t-br" style="left:54%;top:3%;width:44%">빛처럼 곧게 직진!</div>`
  }
];
renderPanels(PANELS);
