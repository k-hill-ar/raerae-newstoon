/* 11화 소품: 화산, 흔들리는 건물, 책상, 지진계 */
const volcano = (x, y, s, erupt) => `<g transform="translate(${x} ${y}) scale(${s || 1})">
  ${erupt ? `<g class="pulse"><circle cx="0" cy="-130" r="34" fill="#8a8f99" opacity=".8"/><circle cx="-30" cy="-160" r="26" fill="#9aa3ad" opacity=".8"/><circle cx="28" cy="-170" r="30" fill="#8a8f99" opacity=".8"/></g>` : ''}
  <path d="M -130 0 L -30 -110 L 30 -110 L 130 0 Z" fill="#7a5a44" ${S}/>
  ${erupt ? `<path d="M -30 -110 Q -40 -60 -60 -20 Q -40 -40 -20 -90 Z M 30 -110 Q 50 -60 70 -10 Q 40 -40 20 -96 Z" fill="#ff6b2b" stroke="${INK}" stroke-width="2"/><ellipse cx="0" cy="-110" rx="30" ry="8" fill="#ff8f3d" ${S}/>` : `<ellipse cx="0" cy="-110" rx="30" ry="8" fill="#5a3e2e" ${S}/>`}</g>`;
const building = (x, y, w, h, c) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${c || '#cfd6e2'}" ${S}/>
  ${Array.from({ length: Math.floor(h / 36) }, (_, r) => Array.from({ length: Math.floor(w / 30) }, (_, c2) => `<rect x="${-w / 2 + 8 + c2 * 30}" y="${-h + 10 + r * 36}" width="16" height="18" fill="#7ec8ff" stroke="${INK}" stroke-width="2"/>`).join('')).join('')}</g>`;
const table = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><rect x="-90" y="-8" width="180" height="14" fill="#c98f52" ${S}/><rect x="-80" y="6" width="12" height="70" fill="#a3713a" ${S}/><rect x="68" y="6" width="12" height="70" fill="#a3713a" ${S}/></g>`;
const seismo = () => `<rect x="40" y="60" width="320" height="120" rx="10" fill="#fff" ${S}/><path d="M 50 120 H 120 L 128 100 L 136 140 L 144 80 L 152 160 L 160 70 L 168 170 L 176 90 L 184 150 L 192 110 L 200 120 H 350" stroke="#e8443a" stroke-width="3" fill="none"/>`;

const PANELS = [
  { // 1. 도입: 백두산 사진
    svg: desk() + `<rect x="120" y="40" width="160" height="110" fill="#bfe3ff" ${S}/><path d="M 130 140 L 180 80 L 200 92 L 220 76 L 270 140 Z" fill="#8a8f99" stroke="${INK}" stroke-width="2"/><ellipse cx="200" cy="96" rx="22" ry="7" fill="#2f7fd0"/>` +
      bob(ryan({ x: 72, y: 206, s: .7, expr: 'think' })) + bob(aiden({ x: 330, y: 200, s: .74, expr: 'talk', flip: true }), 'd1'),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:28%">백두산도 화산이야?</div>
      <div class="b box t-br" style="left:70%;top:3%;width:28%">응, 아직 살아 있어!</div>`
  },
  { // 2. 피카: 화산 분출물
    svg: `<rect width="400" height="300" fill="#ffe8c2"/>` + volcano(170, 290, 1.1, true) +
      label('기체: 가스', 300, 80, 16) + label('고체: 화산재', 300, 110, 16) + label('액체: 용암', 300, 140, 16, '#e8443a') +
      hop(pika({ x: 334, y: 232, s: .66, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:66%">화산에서는 고체·액체·기체가 다 나와요</div>`
  },
  { // 3. 핵심: 지진 → 대피
    svg: `<rect width="400" height="300" fill="#fff4d6"/><g class="shake">${table(200, 170, 1)}</g>` +
      `<g class="shake">${ryan({ x: 200, y: 214, s: .44, expr: 'sad' })}</g>` + fx('흔들흔들!', 200, 60, 30, -6) +
      bob(aiden({ x: 60, y: 220, s: .54, expr: 'talk' })) + hop(pika({ x: 346, y: 248, s: .48, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:2%;top:78%;width:96%">흔들리면 책상 아래 → 멈추면 계단 → 운동장!</div>`
  },
  { // 4. 야구 비유: 파도타기 응원
    svg: field() + `<rect x="0" y="40" width="400" height="90" fill="#5b6b7e" ${S}/>` +
      Array.from({ length: 12 }, (_, i) => `<circle cx="${20 + i * 33}" cy="${i > 4 && i < 8 ? 64 : 92}" r="12" fill="${SKIN}" ${S}/>`).join('') +
      arrow(150, 30, 300, 30, '#e8443a') +
      bob(aiden({ x: 70, y: 226, s: .58, expr: 'talk', pose: 'point' })) + bob(ryan({ x: 336, y: 228, s: .54, expr: 'happy', pose: 'wave', flip: true }), 'd2'),
    html: `<div class="nar" style="left:2%;top:46%;width:58%">관중 파도타기처럼 흔들림이 옆으로 전해져요</div>
      <div class="b shout t-br" style="left:60%;top:50%;width:38%">이게 지진파!</div>`
  },
  { // 5. 역사(국내): 백두산 대분화
    svg: sky('v5', ['#5b3a2e', '#d98c4a'], 0) + volcano(200, 300, 1.4, true) +
      board(270, 40, 124, 90, '946년쯤', [['천년 대분화', G]], 14),
    html: `<div class="nar" style="left:2%;top:2.5%;width:62%">고려 시대 백두산, 한반도 역사상 가장 큰 분화</div>`
  },
  { // 6. 역사(국내): 경주 지진 기록
    svg: `<rect width="400" height="300" fill="#eef1f6"/>` + seismo() +
      board(60, 196, 280, 92, '관측 이래 가장 강한 지진', [['2016 경주 5.8 · 2017 포항 5.4', G]], 14) +
      hop(ryan({ x: 360, y: 30, s: .3, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">우리나라도 지진에서 안전하지 않아요</div>`
  },
  { // 7. 놀라운 포인트: 폼페이
    svg: `<rect width="400" height="300" fill="#d9c7a0"/>` + volcano(310, 180, .7, false) +
      `<rect x="20" y="180" width="360" height="120" fill="#bdb6a6" stroke="${INK}" stroke-width="3"/>` +
      `<g class="grow g1"><path d="M 60 300 V 220 H 90 V 300 M 110 300 V 210 H 150 V 300" fill="#e8d9b5" ${S}/></g>` +
      `<g class="grow g2"><path d="M 170 300 V 230 L 200 210 L 230 230 V 300 Z" fill="#e8d9b5" ${S}/></g>` +
      bob(aiden({ x: 290, y: 236, s: .44, expr: 'talk', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:66%">79년 화산재에 묻힌 폼페이, 1748년에 다시 발견!</div>
      <div class="b box t-bl" style="left:2%;top:36%;width:40%">2000년 전 타임캡슐!</div>`
  },
  { // 8. 마무리
    svg: desk() + `<rect x="160" y="120" width="80" height="100" fill="#fff" ${S}/><path d="M 172 140 H 228 M 172 156 H 228 M 172 172 H 228 M 172 188 H 210" stroke="#999" stroke-width="3"/>` +
      bob(aiden({ x: 64, y: 206, s: .66, expr: 'smile' })) + bob(ryan({ x: 336, y: 208, s: .62, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 200, y: 262, s: .4, expr: 'happy' })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:42%">주장·이유·인정·해결!</div>
      <div class="b shout t-br" style="left:54%;top:3%;width:44%">D-4! 글로 이겨 보자!</div>`
  }
];
renderPanels(PANELS);
