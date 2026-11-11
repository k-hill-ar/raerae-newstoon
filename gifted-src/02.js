/* 2화 소품: 막대자석, 나침반, 클립 */
const magnet = (x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot || 0}) scale(${s || 1})">
  <rect x="-60" y="-16" width="60" height="32" fill="#e8443a" ${S}/><rect x="0" y="-16" width="60" height="32" fill="#2f6fde" ${S}/>
  ${label('N', -30, 8, 22, '#fff')}${label('S', 30, 8, 22, '#fff')}</g>`;
const compass = (x, y, r, ang, cls) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#fffdf6" stroke="${INK}" stroke-width="4"/>
  <circle r="${r * .82}" fill="none" stroke="#c9a227" stroke-width="2"/>
  ${label('N', 0, -r * .55, r * .32, '#e8443a')}${label('S', 0, r * .7, r * .28)}
  <g class="${cls || ''}"><g transform="rotate(${ang || 0})">
  <path d="M 0 ${-r * .7} L ${r * .13} 0 L ${-r * .13} 0 Z" fill="#e8443a" stroke="${INK}" stroke-width="2"/>
  <path d="M 0 ${r * .7} L ${r * .13} 0 L ${-r * .13} 0 Z" fill="#fff" stroke="${INK}" stroke-width="2"/></g></g>
  <circle r="${r * .08}" fill="${INK}"/></g>`;
const clip = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot || 0})"><rect x="-6" y="-12" width="12" height="24" rx="6" fill="none" stroke="#7d8794" stroke-width="3"/><rect x="-3" y="-7" width="6" height="16" rx="3" fill="none" stroke="#7d8794" stroke-width="2.5"/></g>`;

const PANELS = [
  { // 1. 도입
    svg: desk() + compass(200, 150, 48, 0, 'wiggle') +
      bob(ryan({ x: 86, y: 206, s: .74, expr: 'wow' })) + bob(aiden({ x: 312, y: 200, s: .78, expr: 'think', flip: true }), 'd1'),
    html: `<div class="b shout t-bl" style="left:2%;top:3%;width:38%">바늘이 북쪽만 봐!</div>
      <div class="b box t-br" style="left:56%;top:3%;width:42%">누가 북쪽에서 당기나?</div>`
  },
  { // 2. 피카 등장: N극 S극
    svg: `<rect width="400" height="300" fill="#fff0f0"/>` + magnet(150, 130, 1.3) +
      `<g class="grow g1">${clip(58, 168, 10)}</g><g class="grow g2">${clip(66, 196, -8)}</g><g class="grow g3">${clip(236, 168, -10)}</g><g class="grow g4">${clip(246, 196, 6)}</g>` +
      hop(pika({ x: 334, y: 236, s: .8, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">자석의 두 끝, N극과 S극!</div>
      <div class="b box t-br" style="left:56%;top:24%;width:42%">끝에 클립이 제일 많이 붙어!</div>`
  },
  { // 3. 핵심: 지구는 자석
    svg: space(5) + earth(150, 160, 86) + `<g opacity=".9">` + magnet(150, 160, .9, 90) + `</g>` +
      `<path d="M 150 64 C 20 80 20 240 150 256 M 150 64 C 280 80 280 240 150 256" stroke="#ffe14d" stroke-width="3" stroke-dasharray="8 8" fill="none"/>` +
      bob(ryan({ x: 330, y: 228, s: .6, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:66%">지구 전체가 커다란 자석!</div>
      <div class="b shout t-br" style="left:58%;top:30%;width:40%">지구가 자석이라고?</div>`
  },
  { // 4. 야구 비유
    svg: field() + `<rect x="300" y="120" width="40" height="40" rx="18" fill="#a0522d" ${S}/>` +
      `<g class="pulse">${baseball(222, 134, 11)}</g>` + arrow(150, 134, 206, 134, '#e8443a') +
      bob(aiden({ x: 110, y: 220, s: .72, expr: 'talk', pose: 'point' })) + bob(ryan({ x: 236, y: 232, s: .56, expr: 'happy', flip: true }), 'd2'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:76%">다른 극은 공과 포수 미트처럼 쏙!</div>
      <div class="b box t-bl" style="left:2%;top:38%;width:42%">같은 극끼리는 튕겨 내!</div>
      <div class="b shout t-br" style="left:58%;top:58%;width:40%">S극은 N극의 미트!</div>`
  },
  { // 5. 역사: 연표
    svg: `<rect width="400" height="300" fill="#e6f2df"/>` + board(14, 44, 262, 196, '나침반 연표', [
      ['1100년쯤  중국에서 사용', '#fff'], ['1187년까지  유럽에서도', W], ['1600년  길버트의 책 ⭐', G]], 16) +
      compass(334, 110, 34, 0, 'wiggle') + hop(pika({ x: 338, y: 236, s: .58, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">별이 안 보여도 길을 찾는 도구!</div>
      <div class="b shout t-r" style="left:10%;top:82%;width:62%">900년 넘게 길잡이!</div>`
  },
  { // 6. 역사: 길버트의 테렐라
    svg: `<rect width="400" height="300" fill="#eef1f6"/><rect x="0" y="236" width="400" height="64" fill="#cfd6e2" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="250" cy="150" r="56" fill="#8a8f99" ${S}/><path d="M 210 124 Q 250 110 290 124" stroke="#6b7079" stroke-width="3" fill="none"/>` +
      `<rect x="236" y="206" width="28" height="30" fill="#a0522d" ${S}/>` +
      compass(170, 112, 20, -35) + compass(330, 112, 20, 35) + compass(250, 74, 18, 0) +
      bob(aiden({ x: 82, y: 214, s: .7, expr: 'talk', pose: 'point' })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:82%">1600년 길버트, ‘작은 지구’ 자석 공으로 실험</div>
      <div class="b box t-bl" style="left:2%;top:24%;width:38%">지구랑 똑같이 움직여!</div>`
  },
  { // 7. 놀라운 포인트: 자석 북극이 움직여
    svg: `<rect width="400" height="300" fill="#a9d6f0"/><circle cx="170" cy="150" r="118" fill="#eef6fb" ${S}/>` +
      `<path d="M 60 120 Q 90 90 120 110 Q 110 150 80 160 Z" fill="#9fd08a" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M 230 70 Q 280 60 286 110 Q 260 120 236 100 Z" fill="#9fd08a" stroke="${INK}" stroke-width="2"/>` +
      label('캐나다', 88, 186, 15) + label('시베리아', 262, 140, 15) +
      `<circle cx="170" cy="150" r="5" fill="${INK}"/>` + label('북극점', 170, 172, 13) +
      `<path d="M 116 132 Q 160 120 214 112" stroke="#e8443a" stroke-width="4" stroke-dasharray="8 7" fill="none"/>` +
      `<g class="pulse"><circle cx="214" cy="112" r="9" fill="#e8443a" ${S}/></g>` +
      hop(ryan({ x: 340, y: 230, s: .56, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">자석의 북극은 1년에 약 55km씩 이동 중!</div>
      <div class="b shout t-r" style="left:2%;top:80%;width:40%">북극이 이사 가!</div>`
  },
  { // 8. 마무리
    svg: desk() + magnet(200, 200, .7) + `<g class="grow g1">${clip(146, 222, 8)}</g><g class="grow g2">${clip(256, 222, -8)}</g>` +
      bob(aiden({ x: 74, y: 206, s: .7, expr: 'smile' })) + bob(ryan({ x: 320, y: 208, s: .66, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 200, y: 120, s: .46, expr: 'happy' })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:42%">클립 몇 개 붙나 실험하자!</div>
      <div class="b shout t-br" style="left:54%;top:3%;width:44%">영재원까지 착 붙자!</div>`
  }
];
renderPanels(PANELS);
