/* 3화 소품: 곰, 굴, 다람쥐, 도토리, 새 */
const bear = (x, y, s, sleep) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="20" rx="70" ry="38" fill="#3b2a20" ${S}/>
  <circle cx="-58" cy="-4" r="30" fill="#3b2a20" ${S}/><circle cx="-76" cy="-28" r="10" fill="#3b2a20" ${S}/><circle cx="-42" cy="-30" r="10" fill="#3b2a20" ${S}/>
  <path d="M -30 6 L -8 20 L 14 6 Z" fill="#fff" stroke="${INK}" stroke-width="2"/>
  <ellipse cx="-76" cy="4" rx="11" ry="8" fill="#8a6a50" stroke="${INK}" stroke-width="2"/><circle cx="-82" cy="1" r="3" fill="${INK}"/>
  ${sleep ? `<path d="M -66 -10 q 5 4 10 0 M -50 -10 q 5 4 10 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>` : `<circle cx="-62" cy="-10" r="3.5" fill="${INK}"/><circle cx="-46" cy="-10" r="3.5" fill="${INK}"/>`}</g>`;
const cave = () => `<rect width="400" height="300" fill="#cfe2f3"/>${snowfall(16, 9, 0, 400)}
  <path d="M 0 300 L 0 90 Q 80 40 200 50 Q 330 40 400 100 L 400 300 Z" fill="#8c8a83" ${S}/>
  <path d="M 70 300 Q 70 150 200 140 Q 330 150 330 300 Z" fill="#2b2a33" ${S}/>
  <path d="M 0 96 Q 80 50 200 58 Q 330 48 400 106 L 400 92 Q 330 30 200 40 Q 80 30 0 82 Z" fill="#fff"/>`;
const zzz = (x, y) => `<g class="zz">${label('Z', x, y, 22, '#fff')}</g><g class="zz" style="animation-delay:.8s">${label('z', x + 14, y - 14, 18, '#fff')}</g><g class="zz" style="animation-delay:1.6s">${label('z', x + 26, y - 28, 14, '#fff')}</g>`;
const acorn = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><ellipse cx="0" cy="6" rx="9" ry="11" fill="#b8763a" ${S}/><path d="M -11 -2 Q 0 -14 11 -2 Z" fill="#6b4423" ${S}/><line x1="0" y1="-8" x2="2" y2="-14" stroke="${INK}" stroke-width="3"/></g>`;
const squirrel = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M 26 20 Q 70 0 54 -50 Q 40 -70 22 -50 Q 40 -20 18 0 Z" fill="#c26d2a" ${S}/>
  <ellipse cx="0" cy="18" rx="24" ry="28" fill="#d9843a" ${S}/><circle cx="-4" cy="-18" r="18" fill="#d9843a" ${S}/>
  <path d="M -16 -32 L -12 -46 L -4 -34 Z M 4 -34 L 10 -46 L 12 -30 Z" fill="#d9843a" ${S}/>
  <circle cx="-10" cy="-20" r="3" fill="${INK}"/><circle cx="2" cy="-20" r="3" fill="${INK}"/><ellipse cx="-4" cy="-10" rx="4" ry="3" fill="#5a3418"/>
  <ellipse cx="-2" cy="22" rx="12" ry="15" fill="#f3d2a8"/></g>`;
const tern = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
  <path d="M -10 0 Q -50 -40 -86 -30 Q -50 -10 -10 8 Z M 10 0 Q 50 -40 86 -30 Q 50 -10 10 8 Z" fill="#f2f4f7" ${S}/>
  <ellipse cx="0" cy="4" rx="26" ry="11" fill="#fff" ${S}/><path d="M -24 4 L -44 -4 L -40 12 Z" fill="#fff" ${S}/>
  <circle cx="22" cy="-2" r="9" fill="#1d1d1f"/><path d="M 30 -2 L 46 2 L 30 4 Z" fill="#e8443a" stroke="${INK}" stroke-width="2"/></g>`;

const PANELS = [
  { // 1. 도입
    svg: outdoor('#cfe2f3', '#f4f8ff') + snowfall(22, 4, 0, 400, true) + `<path d="M 160 236 L 200 150 L 240 236 Z" fill="#2e7d4f" ${S}/>` +
      bob(ryan({ x: 92, y: 206, s: .74, expr: 'think' })) + bob(aiden({ x: 304, y: 200, s: .78, expr: 'talk', flip: true }), 'd1'),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:40%">곰은 겨울에 뭐 해?</div>
      <div class="b box t-br" style="left:56%;top:3%;width:42%">겨울 내내 잠을 자!</div>`
  },
  { // 2. 피카: 네 가지 작전
    svg: `<rect width="400" height="300" fill="#fff8e6"/>` +
      `<g class="grow g1">${label('💤 잠자기', 90, 92, 22)}</g><g class="grow g2">${label('✈️ 떠나기', 90, 140, 22)}</g>` +
      `<g class="grow g3">${label('🌰 모아 두기', 104, 188, 22)}</g><g class="grow g4">${label('🧥 몸 바꾸기', 104, 236, 22)}</g>` +
      hop(pika({ x: 320, y: 220, s: .86, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">추위와 배고픔을 이기는 4가지 작전!</div>
      <div class="b box t-br" style="left:56%;top:22%;width:42%">동물마다 작전이 달라!</div>`
  },
  { // 3. 핵심: 겨울잠
    svg: cave() + bear(214, 238, .8, true) + zzz(150, 196) + bob(ryan({ x: 346, y: 236, s: .52, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:76%">겨울잠: 숨과 심장을 느리게 해서 에너지 절약</div>
      <div class="b shout t-br" style="left:62%;top:36%;width:36%">절전 모드다!</div>`
  },
  { // 4. 야구 비유: 스토브리그
    svg: field() + `<rect x="150" y="110" width="100" height="70" rx="8" fill="#fff" ${S}/>` + label('비시즌', 200, 138, 18) + label('체력 충전 중', 200, 164, 15, '#2f6fde') +
      bob(aiden({ x: 82, y: 220, s: .72, expr: 'talk', pose: 'point' })) + bob(ryan({ x: 318, y: 226, s: .64, expr: 'happy', flip: true }), 'd2'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:72%">야구 선수도 겨울엔 시합 대신 충전!</div>
      <div class="b box t-bl" style="left:2%;top:40%;width:30%">곰은 겨울잠 충전!</div>
      <div class="b shout t-br" style="left:66%;top:40%;width:32%">봄에 개막!</div>`
  },
  { // 5. 역사(국내): 지리산 반달가슴곰
    svg: `<rect width="400" height="300" fill="#e6f2df"/>` + board(14, 44, 250, 196, '지리산 반달가슴곰', [
      ['2004년  6마리 방사', '#fff'], ['겨울마다 바위굴 겨울잠', W], ['2022년 겨울  79마리 ⭐', G]], 16) +
      bear(338, 150, .42) + hop(pika({ x: 340, y: 250, s: .5, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:72%">사라질 뻔한 곰을 지리산에 되살렸어요</div>
      <div class="b shout t-r" style="left:8%;top:82%;width:62%">곰 가족이 늘었어!</div>`
  },
  { // 6. 역사(해외): 북극제비갈매기
    svg: `<rect width="400" height="300" fill="#bfe3ff"/>` +
      `<path d="M 0 40 H 400 V 70 Q 200 92 0 66 Z" fill="#fff" stroke="${INK}" stroke-width="3"/>` + label('그린란드', 80, 60, 16) +
      `<path d="M 0 300 V 250 Q 200 226 400 252 V 300 Z" fill="#fff" stroke="${INK}" stroke-width="3"/>` + label('남극', 320, 280, 16) +
      `<path d="M 120 80 Q 40 160 150 240 M 170 240 Q 300 160 220 80" stroke="#e8443a" stroke-width="3" stroke-dasharray="8 7" fill="none"/>` +
      `<g class="float">${tern(200, 150, .7)}</g>`,
    html: `<div class="nar" style="left:2%;top:26%;width:46%">북극제비갈매기는 1년에 7만 km 넘게 날아요</div>
      <div class="b shout t-l" style="left:58%;top:30%;width:40%">지구 한 바퀴 반!</div>`
  },
  { // 7. 놀라운 포인트: 다람쥐는 가끔 깬다
    svg: `<rect width="400" height="300" fill="#f2e3c9"/><path d="M 40 300 Q 40 120 200 110 Q 360 120 360 300 Z" fill="#a37a4f" ${S}/>` +
      `<path d="M 80 300 Q 80 160 200 152 Q 320 160 320 300 Z" fill="#6b4a2b" ${S}/>` +
      squirrel(160, 236, .9) + `<g class="grow g1">${acorn(250, 250, 1.1)}</g><g class="grow g2">${acorn(276, 254, 1)}</g><g class="grow g3">${acorn(262, 228, 1)}</g>` +
      hop(ryan({ x: 360, y: 236, s: .5, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:76%">작은 다람쥐는 겨울잠 중에도 가끔 깨서 먹어요</div>
      <div class="b shout t-bl" style="left:2%;top:24%;width:42%">야식 타임이다!</div>`
  },
  { // 8. 마무리
    svg: outdoor('#cfe2f3', '#f4f8ff') + snowfall(26, 21, 0, 400, true) +
      bob(aiden({ x: 74, y: 206, s: .7, expr: 'smile' })) + bob(ryan({ x: 300, y: 208, s: .66, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 186, y: 252, s: .46, expr: 'happy' })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:42%">동물들을 기준 정해 나눠 볼까?</div>
      <div class="b shout t-br" style="left:54%;top:3%;width:44%">우리도 충전 완료!</div>`
  }
];
renderPanels(PANELS);
