/* 8화 소품: 선인장, 민들레 씨, 우엉 열매, 씨앗 금고, 목화 */
const cactus = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})">
  <rect x="-16" y="-100" width="32" height="100" rx="16" fill="#2e9d5b" ${S}/>
  <path d="M -16 -50 H -36 V -76 a 9 9 0 0 1 18 0" fill="#2e9d5b" ${S}/><path d="M 16 -40 H 36 V -70 a 9 9 0 0 0 -18 0" fill="#2e9d5b" ${S}/>
  <path d="M -6 -86 l -6 -4 M 6 -70 l 6 -4 M -6 -50 l -6 -4 M 6 -30 l 6 -4" stroke="${INK}" stroke-width="2"/>
  <rect x="-30" y="-2" width="60" height="22" rx="4" fill="#c26d2a" ${S}/></g>`;
const fluff = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><line x1="0" y1="0" x2="0" y2="18" stroke="${INK}" stroke-width="2"/>
  ${[-60, -30, 0, 30, 60].map(a => `<line x1="0" y1="0" x2="${(Math.sin(a * Math.PI / 180) * 14).toFixed(1)}" y2="${(-Math.cos(a * Math.PI / 180) * 14).toFixed(1)}" stroke="#999" stroke-width="1.5"/>`).join('')}
  <ellipse cx="0" cy="20" rx="2.5" ry="4" fill="#6b4423"/></g>`;
const dandelion = (x, y) => `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 90}" stroke="#2e9d5b" stroke-width="5"/><circle cx="${x}" cy="${y}" r="26" fill="#fff" stroke="#ccc" stroke-width="2"/>`;
const bur = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><circle r="16" fill="#8a6a50" ${S}/>${Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180; return `<path d="M ${(Math.cos(a) * 16).toFixed(1)} ${(Math.sin(a) * 16).toFixed(1)} L ${(Math.cos(a) * 26).toFixed(1)} ${(Math.sin(a) * 26).toFixed(1)}" stroke="${INK}" stroke-width="2"/>`; }).join('')}</g>`;
const hook = (x, y) => `<path d="M ${x} ${y + 24} V ${y} a 7 7 0 0 1 14 0" stroke="#6b4423" stroke-width="3" fill="none"/>`;

const PANELS = [
  { // 1. 도입: 민들레 씨 날리기
    svg: outdoor('#cfe9f7', '#8fbf6a') + dandelion(200, 150) +
      `<g class="float">${fluff(240, 110, 1.2)}</g><g class="float" style="animation-delay:-1.4s">${fluff(280, 80, 1)}</g><g class="float" style="animation-delay:-2.6s">${fluff(320, 120, 1.1)}</g>` +
      bob(ryan({ x: 90, y: 206, s: .72, expr: 'happy' })) + bob(aiden({ x: 330, y: 204, s: .72, expr: 'talk', flip: true }), 'd1'),
    html: `<div class="b shout t-bl" style="left:2%;top:3%;width:36%">후~ 날아간다!</div>
      <div class="b box t-br" style="left:56%;top:3%;width:42%">식물의 여행 작전이야</div>`
  },
  { // 2. 피카: 사는 곳 맞춤
    svg: `<rect width="400" height="300" fill="#ffe8c2"/><rect x="0" y="230" width="400" height="70" fill="#e9c99a" stroke="${INK}" stroke-width="3"/>` +
      sun(60, 50, 22) + cactus(160, 236, 1.1) + hop(pika({ x: 320, y: 220, s: .8, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:22%;top:2.5%;width:56%">사막 선인장: 잎은 가시, 줄기엔 물!</div>
      <div class="b box t-br" style="left:58%;top:26%;width:40%">물이 덜 날아가게!</div>`
  },
  { // 3. 핵심: 씨 퍼뜨리기 4가지
    svg: `<rect width="400" height="300" fill="#eef8ee"/>` +
      `<g class="grow g1">${fluff(70, 100, 1.4)}${label('바람', 70, 160, 18)}</g>` +
      `<g class="grow g2">${bur(160, 120, 1)}${label('동물 털', 160, 160, 18)}</g>` +
      `<g class="grow g3"><circle cx="250" cy="116" r="22" fill="#8a5a2b" ${S}/>${label('물', 250, 160, 18)}</g>` +
      `<g class="grow g4"><path d="M 330 96 q -20 20 0 40 q 20 -20 0 -40" fill="#2e9d5b" ${S}/><circle cx="318" cy="104" r="4" fill="#5a3418"/><circle cx="342" cy="112" r="4" fill="#5a3418"/>${label('톡 터지기', 330, 160, 18)}</g>` +
      bob(ryan({ x: 200, y: 236, s: .5, expr: 'wow' })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:66%">걷지 못하는 식물의 씨앗 여행 방법</div>`
  },
  { // 4. 야구 비유: 홈런과 번트
    svg: field() + `<path d="M 120 190 Q 220 20 360 80" stroke="#e8443a" stroke-width="3" stroke-dasharray="8 7" fill="none"/>` + `<g class="pulse">${baseball(360, 80, 10)}</g>` +
      `<path d="M 120 196 Q 150 200 170 214" stroke="#2f6fde" stroke-width="3" stroke-dasharray="6 6" fill="none"/>` +
      bob(aiden({ x: 60, y: 222, s: .62, expr: 'talk', pose: 'point' })) + bob(ryan({ x: 300, y: 226, s: .58, expr: 'happy', flip: true }), 'd2'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:64%">민들레는 홈런, 봉선화는 번트!</div>
      <div class="b box t-bl" style="left:2%;top:40%;width:34%">멀리 또는 가까이</div>
      <div class="b shout t-br" style="left:62%;top:42%;width:36%">작전이 달라!</div>`
  },
  { // 5. 역사(국내): 문익점 목화
    svg: outdoor('#fff4d6', '#c7a77a') +
      [80, 150, 220].map((x, i) => `<g class="grow g${i + 1}"><line x1="${x}" y1="236" x2="${x}" y2="170" stroke="#2e9d5b" stroke-width="5"/><circle cx="${x}" cy="164" r="16" fill="#fff" ${S}/><circle cx="${x - 12}" cy="174" r="10" fill="#fff" ${S}/><circle cx="${x + 12}" cy="174" r="10" fill="#fff" ${S}/></g>`).join('') +
      hop(pika({ x: 330, y: 236, s: .6, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:84%">1363년 문익점이 들여온 목화씨, 3년 만에 성공!</div>
      <div class="b box t-br" style="left:58%;top:30%;width:40%">따뜻한 솜옷이 생겼어</div>`
  },
  { // 6. 역사(해외): 씨앗 금고
    svg: sky('s6', ['#2b3a67', '#7d9bd1'], 20) + `<path d="M 0 300 L 0 180 Q 120 110 260 150 Q 340 130 400 170 V 300 Z" fill="#f4f8ff" ${S}/>` +
      `<path d="M 170 300 L 200 170 L 240 170 L 270 300 Z" fill="#8a8f99" ${S}/><rect x="198" y="196" width="44" height="70" fill="#5b6070" ${S}/>` +
      label('-18℃', 220, 236, 16, '#7ec8ff') + snowfall(14, 3, 0, 400),
    html: `<div class="nar" style="left:2%;top:2.5%;width:84%">노르웨이 북극 섬, 씨앗 450만 종류를 지키는 금고</div>`
  },
  { // 7. 놀라운 포인트: 우엉 → 찍찍이
    svg: `<rect width="400" height="300" fill="#eef1f6"/>` + bur(90, 140, 2) + arrow(150, 140, 200, 140, '#e8443a') +
      `<circle cx="280" cy="140" r="70" fill="#fff" ${S}/>` + [240, 262, 284, 306].map(x => hook(x, 130)).join('') +
      label('작은 갈고리!', 280, 196, 16, '#e8443a') +
      hop(ryan({ x: 60, y: 254, s: .44, expr: 'wow' })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:84%">1941년 메스트랄, 우엉 열매의 갈고리를 보고 찍찍이 발명!</div>`
  },
  { // 8. 마무리
    svg: desk() + `<g class="float"><path d="M 200 120 L 170 80 L 196 110 Z M 200 120 L 230 80 L 204 110 Z" fill="#ffe14d" ${S}/><rect x="196" y="118" width="8" height="40" fill="#ffe14d" ${S}/></g>` +
      bob(aiden({ x: 74, y: 206, s: .7, expr: 'smile' })) + bob(ryan({ x: 326, y: 208, s: .66, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 200, y: 262, s: .4, expr: 'happy' })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:42%">종이 헬리콥터 날려 볼까?</div>
      <div class="b shout t-br" style="left:54%;top:3%;width:44%">D-10! 쑥쑥 자라자!</div>`
  }
];
renderPanels(PANELS);
