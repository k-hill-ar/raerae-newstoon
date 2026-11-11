/* 9화 소품: 구불구불 강, 협곡, 흙 언덕, 갈대 */
const river = () => `<rect width="400" height="300" fill="#8fbf6a"/>
  <path d="M 40 0 C 40 80 200 60 200 140 C 200 220 60 210 80 300 L 150 300 C 130 230 260 230 260 140 C 260 50 110 70 110 0 Z" fill="#7ec8ff" ${S}/>`;
const canyon = () => `<rect width="400" height="300" fill="#ffd9a8"/>
  <path d="M 0 60 L 150 60 L 170 120 L 160 170 L 180 230 L 190 300 L 0 300 Z" fill="#c2603a" ${S}/>
  <path d="M 400 60 L 260 60 L 240 110 L 250 170 L 230 230 L 220 300 L 400 300 Z" fill="#c2603a" ${S}/>
  ${[90, 130, 170, 210, 250].map(y => `<path d="M 0 ${y} L ${150 + (y - 60) / 10} ${y} M 400 ${y} L ${258 - (y - 60) / 12} ${y}" stroke="#a04a2a" stroke-width="3"/>`).join('')}
  <path d="M 190 300 L 180 230 Q 205 240 230 230 L 220 300 Z" fill="#2f7fd0" ${S}/>`;
const reed = (x, y) => `<path d="M ${x} ${y} Q ${x - 4} ${y - 40} ${x + 2} ${y - 70}" stroke="#b59a5a" stroke-width="4" fill="none"/><ellipse cx="${x + 2}" cy="${y - 74}" rx="5" ry="12" fill="#a3713a" stroke="${INK}" stroke-width="2"/>`;
const pebble = (x, y, r, c) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .7}" fill="${c || '#9aa3ad'}" stroke="${INK}" stroke-width="2"/>`;

const PANELS = [
  { // 1. 도입: 계곡 돌
    svg: outdoor('#cfe9f7', '#8fbf6a', 210) + `<path d="M 0 250 Q 200 230 400 250 V 300 H 0 Z" fill="#7ec8ff" stroke="${INK}" stroke-width="3"/>` +
      pebble(150, 262, 18) + pebble(200, 270, 12, '#b0b8c4') + pebble(250, 264, 20, '#8a8f99') +
      bob(ryan({ x: 80, y: 190, s: .7, expr: 'think' })) + bob(aiden({ x: 330, y: 186, s: .72, expr: 'talk', flip: true }), 'd1'),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:40%">돌이 왜 다 동글동글해?</div>
      <div class="b box t-br" style="left:56%;top:3%;width:42%">물이 깎고 굴렸거든!</div>`
  },
  { // 2. 피카: 깎고 나르고 쌓고
    svg: `<rect width="400" height="300" fill="#fff8e6"/>` +
      `<g class="grow g1">${label('⛏️ 깎고 (침식)', 120, 100, 22)}</g><g class="grow g2">${label('🚚 나르고 (운반)', 126, 150, 22)}</g><g class="grow g3">${label('🧱 쌓고 (퇴적)', 120, 200, 22)}</g>` +
      hop(pika({ x: 330, y: 226, s: .8, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:56%">흐르는 물의 3단 기술!</div>
      <div class="b box t-br" style="left:58%;top:24%;width:40%">물은 땅의 조각가야!</div>`
  },
  { // 3. 핵심: 굽은 강 안쪽·바깥쪽
    svg: river() + `<path d="M 200 140 C 200 200 120 210 110 250" stroke="#fff" stroke-width="3" stroke-dasharray="6 8" fill="none"/>` +
      `<path d="M 262 120 q 8 20 0 40" stroke="#e8443a" stroke-width="6" fill="none"/>` + label('깎임', 300, 146, 18, '#e8443a') +
      `<ellipse cx="170" cy="90" rx="22" ry="12" fill="#f2d39a" ${S}/>` + label('쌓임', 170, 122, 18, '#c27c00') +
      bob(ryan({ x: 340, y: 236, s: .5, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:42%">굽은 강: 바깥쪽은 깎이고 안쪽엔 쌓여요</div>`
  },
  { // 4. 야구 비유: 강타자와 번트
    svg: field() + `<path d="M 120 190 Q 240 60 380 60" stroke="#e8443a" stroke-width="4" fill="none"/>` + label('강타 = 상류', 320, 50, 16, '#e8443a') +
      `<path d="M 120 196 Q 140 204 160 216" stroke="#2f6fde" stroke-width="4" fill="none"/>` + label('번트 = 하류', 170, 200, 16, '#2f6fde', 'start') +
      bob(aiden({ x: 60, y: 222, s: .62, expr: 'talk', pose: 'point' })) + bob(ryan({ x: 340, y: 226, s: .58, expr: 'happy', flip: true }), 'd2'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:64%">빠른 물은 강타, 느린 물은 번트!</div>
      <div class="b shout t-br" style="left:58%;top:24%;width:40%">세게 치면 멀리!</div>`
  },
  { // 5. 역사(해외): 그랜드캐니언
    svg: canyon() + `<g class="pulse">${arrow(206, 70, 206, 220, '#fff', 4)}</g>` + label('깊이 약 1.6km', 206, 52, 18, INK) +
      hop(pika({ x: 72, y: 34, s: .44, expr: 'wow' })),
    html: `<div class="nar" style="left:2%;top:84%;width:80%">미국 그랜드캐니언: 콜로라도강이 깎아 만든 골짜기</div>`
  },
  { // 6. 역사(국내): 낙동강 하구
    svg: `<rect width="400" height="300" fill="#2f7fd0"/><path d="M 0 0 H 400 V 80 Q 300 120 240 100 Q 200 160 160 100 Q 100 120 0 80 Z" fill="#8fbf6a" ${S}/>` +
      `<path d="M 170 0 L 230 0 L 220 104 Q 200 130 180 104 Z" fill="#7ec8ff" ${S}/>` +
      `<g class="grow g1"><ellipse cx="200" cy="170" rx="70" ry="22" fill="#f2d39a" ${S}/></g><g class="grow g2"><ellipse cx="110" cy="200" rx="40" ry="14" fill="#f2d39a" ${S}/></g>` +
      reed(180, 170) + reed(200, 166) + reed(220, 170) +
      `<g class="float">${'<path d="M 300 160 q 10 -10 20 0 q 10 -10 20 0" stroke="#1d1d1f" stroke-width="3" fill="none"/>'}</g>`,
    html: `<div class="nar" style="left:2%;top:80%;width:86%">낙동강 하구: 강물이 실어 온 모래가 쌓이고 철새가 찾아와요</div>`
  },
  { // 7. 놀라운 포인트: 상류 큰 돌 → 하류 모래
    svg: `<rect width="400" height="300" fill="#eef8ee"/><path d="M 0 80 L 400 220 L 400 300 L 0 300 Z" fill="#7ec8ff" ${S}/>` +
      pebble(50, 120, 26, '#8a8f99') + pebble(130, 150, 18) + pebble(210, 180, 12, '#b0b8c4') + pebble(280, 208, 7, '#c9b38a') + `<circle cx="340" cy="232" r="3" fill="#c9b38a"/><circle cx="356" cy="238" r="3" fill="#c9b38a"/><circle cx="372" cy="232" r="3" fill="#c9b38a"/>` +
      label('상류', 50, 90, 18) + label('하류', 360, 210, 18) +
      hop(ryan({ x: 90, y: 258, s: .42, expr: 'wow' })),
    html: `<div class="nar" style="left:30%;top:2.5%;width:68%">내려갈수록 돌이 작고 둥글어져요</div>`
  },
  { // 8. 마무리
    svg: desk() + `<path d="M 130 232 L 130 170 Q 200 150 270 200 L 270 232 Z" fill="#a37a4f" ${S}/><path d="M 150 176 Q 190 200 230 232" stroke="#7ec8ff" stroke-width="5" fill="none"/>` +
      bob(aiden({ x: 64, y: 206, s: .66, expr: 'smile' })) + bob(ryan({ x: 336, y: 208, s: .62, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 200, y: 120, s: .4, expr: 'happy' })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:42%">흙 언덕에 물 부어 보자!</div>
      <div class="b shout t-br" style="left:54%;top:3%;width:44%">D-8! 꾸준히 흐르자!</div>`
  }
];
renderPanels(PANELS);
