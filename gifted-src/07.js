/* 7화 소품: 체, 염전, 소금 더미, 재활용 */
const sieve = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><ellipse cx="0" cy="0" rx="60" ry="16" fill="#e9c99a" ${S}/>
  <ellipse cx="0" cy="0" rx="50" ry="11" fill="#fff8e6" stroke="${INK}" stroke-width="2"/>
  <path d="M -40 -4 H 40 M -44 2 H 44 M -30 -9 V 9 M -10 -11 V 11 M 10 -11 V 11 M 30 -9 V 9" stroke="#999" stroke-width="1.5"/>
  <rect x="58" y="-5" width="40" height="10" rx="4" fill="#8a5a2b" ${S}/></g>`;
const saltPile = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M -40 0 Q 0 -60 40 0 Z" fill="#fff" ${S}/><path d="M -14 -24 L -8 -30 M 6 -30 L 12 -22 M -2 -12 L 4 -16" stroke="#cfd6e2" stroke-width="3"/></g>`;
const pans = () => `<rect width="400" height="300" fill="#ffe8c2"/>` +
  [0, 1, 2].map(i => `<rect x="${20 + i * 128}" y="150" width="114" height="70" fill="#9fc6e8" ${S}/>`).join('') +
  `<rect x="0" y="220" width="400" height="80" fill="#c7a77a" stroke="${INK}" stroke-width="3"/>`;
const steam = (x, y) => [0, 1, 2].map(i => `<g class="zz" style="animation-delay:${i * .7}s"><path d="M ${x + i * 18} ${y} q -8 -10 0 -20 q 8 -10 0 -20" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g>`).join('');
const dots = (x, y, n, color, r, seed) => { let a = seed, o = ''; const rnd = () => (a = (a * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < n; i++) o += `<circle cx="${(x + rnd() * 80 - 40).toFixed(1)}" cy="${(y + rnd() * 30 - 15).toFixed(1)}" r="${r}" fill="${color}" stroke="${INK}" stroke-width="1"/>`; return o; };

const PANELS = [
  { // 1. 도입: 엎어진 통
    svg: desk() + `<ellipse cx="200" cy="230" rx="110" ry="20" fill="#e9c99a"/>` +
      dots(150, 226, 12, '#f3efe4', 4, 3) + dots(200, 230, 10, '#d9b98a', 3, 5) + dots(250, 226, 8, '#e8b04a', 6, 7) + dots(200, 222, 8, '#7d8794', 3, 9) +
      bob(ryan({ x: 70, y: 206, s: .7, expr: 'sad' })) + bob(aiden({ x: 330, y: 200, s: .74, expr: 'think', flip: true }), 'd1'),
    html: `<div class="b shout t-bl" style="left:2%;top:3%;width:40%">다 섞여 버렸어!</div>
      <div class="b box t-br" style="left:56%;top:3%;width:42%">성질이 다르면 나눌 수 있어</div>`
  },
  { // 2. 피카: 네 가지 도구
    svg: `<rect width="400" height="300" fill="#eef4ff"/>` +
      `<g class="grow g1">${label('🕳️ 크기 → 체', 110, 96, 20)}</g><g class="grow g2">${label('🧲 철 → 자석', 110, 140, 20)}</g>` +
      `<g class="grow g3">${label('💧 녹음 → 거르기', 124, 184, 20)}</g><g class="grow g4">${label('☀️ 물 날리기 → 증발', 136, 228, 20)}</g>` +
      hop(pika({ x: 334, y: 230, s: .78, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:60%">나누는 열쇠는 ‘다른 성질’!</div>
      <div class="b box t-br" style="left:60%;top:26%;width:38%">성질마다 도구가 달라!</div>`
  },
  { // 3. 핵심: 체와 자석
    svg: `<rect width="400" height="300" fill="#fff8e6"/>` + sieve(130, 140, 1.2) + dots(130, 132, 6, '#e8b04a', 7, 11) +
      `<g class="zz">${dots(130, 180, 6, '#d9b98a', 3, 13)}</g>` +
      `<g class="float"><path d="M 270 90 v 40 a 24 24 0 0 0 48 0 v -40 h -14 v 40 a 10 10 0 0 1 -20 0 v -40 Z" fill="#e8443a" ${S}/></g>` + dots(294, 160, 6, '#7d8794', 3, 17) +
      bob(ryan({ x: 350, y: 238, s: .46, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:74%">작은 건 체로 빠지고, 철은 자석에 착!</div>`
  },
  { // 4. 야구 비유: 스카우트
    svg: field() + board(116, 56, 168, 140, '선수 고르기', [['빠른 공 → 투수', '#fff'], ['강한 팔 → 외야', W], ['잘 맞힘 → 타자', G]], 14) +
      bob(aiden({ x: 60, y: 222, s: .62, expr: 'talk', pose: 'point' })) + bob(ryan({ x: 340, y: 226, s: .58, expr: 'happy', flip: true }), 'd2'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">감독도 장점(성질)으로 선수를 나눠요</div>
      <div class="b shout t-br" style="left:66%;top:42%;width:32%">기준이 중요해!</div>`
  },
  { // 5. 역사(국내): 염전
    svg: pans() + sun(340, 50, 24) + steam(60, 140) + steam(190, 140) + steam(316, 140) +
      saltPile(90, 216, .8) + saltPile(310, 216, .7) + hop(pika({ x: 200, y: 260, s: .5, expr: 'wow' })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:76%">1907년 인천 주안, 우리나라 첫 근대 천일염전</div>
      <div class="b box t-bl" style="left:2%;top:24%;width:44%">햇볕과 바람으로 물을 날려!</div>`
  },
  { // 6. 역사: 바닷물 속 소금 양
    svg: `<rect width="400" height="300" fill="#e8f1ff"/><rect x="60" y="80" width="110" height="150" rx="10" fill="#7ec8ff" ${S}/>` + label('바닷물', 115, 160, 18) + label('1kg', 115, 186, 22) +
      arrow(186, 156, 236, 156, '#e8443a') + saltPile(300, 186, 1) + label('소금 약 35g', 300, 220, 18, '#e8443a') +
      bob(aiden({ x: 340, y: 120, s: .4, expr: 'talk', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">바닷물 1kg에는 소금이 약 35g 녹아 있어요</div>`
  },
  { // 7. 놀라운 포인트: 끓여도 소금은 남는다
    svg: desk() + `<rect x="150" y="180" width="100" height="52" rx="8" fill="#b0b8c4" ${S}/><rect x="146" y="232" width="108" height="10" fill="#5b6b7e" ${S}/>` +
      `<path d="M 166 236 l 10 -16 l 10 16 M 194 236 l 10 -16 l 10 16 M 222 236 l 10 -16 l 10 16" fill="#ff8f3d" stroke="${INK}" stroke-width="2"/>` +
      steam(176, 170) + saltPile(200, 184, .5) +
      hop(ryan({ x: 76, y: 218, s: .6, expr: 'wow' })) + bob(aiden({ x: 330, y: 214, s: .6, expr: 'talk', flip: true }), 'd1'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:70%">물은 날아가도 소금은 그릇에 남아요</div>
      <div class="b shout t-bl" style="left:2%;top:24%;width:36%">소금은 안 날아가!</div>`
  },
  { // 8. 마무리
    svg: desk() + [0, 1, 2].map(i => `<ellipse cx="${140 + i * 60}" cy="230" rx="24" ry="8" fill="#cfe8ff" ${S}/>`).join('') +
      bob(aiden({ x: 64, y: 206, s: .68, expr: 'smile' })) + bob(ryan({ x: 336, y: 208, s: .64, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 200, y: 170, s: .44, expr: 'happy' })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:42%">햇볕·그늘·바람 대결!</div>
      <div class="b shout t-br" style="left:54%;top:3%;width:44%">D-12! 실력만 남기자!</div>`
  }
];
renderPanels(PANELS);
