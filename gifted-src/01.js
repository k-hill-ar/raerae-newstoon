const PANELS = [
  { // 1. 도입: 창밖 첫눈
    svg: room() + `<defs><clipPath id="win1"><rect x="132" y="62" width="136" height="96" rx="6"/></clipPath></defs>
      <g clip-path="url(#win1)"><rect x="132" y="62" width="136" height="96" fill="#5b7fb8"/>${snowfall(26, 7, 132, 136, true)}</g>
      <rect x="132" y="62" width="136" height="96" rx="6" fill="none" ${S}/><line x1="200" y1="62" x2="200" y2="158" stroke="${INK}" stroke-width="3"/>` +
      bob(ryan({ x: 92, y: 206, s: .74, expr: 'wow' })) + bob(aiden({ x: 304, y: 200, s: .78, expr: 'talk', flip: true }), 'd1'),
    html: `<div class="b shout t-bl" style="left:2%;top:3%;width:38%">형! 눈 온다!</div>
      <div class="b box t-br" style="left:56%;top:3%;width:42%">돋보기로 보면 깜짝 놀랄걸?</div>`
  },
  { // 2. 피카 등장 + 확대한 눈 결정
    svg: `<rect width="400" height="300" fill="#dff1ff"/>${snowfall(18, 3, 0, 400)}` +
      `<circle cx="150" cy="168" r="104" fill="#fff" stroke="${INK}" stroke-width="3" stroke-dasharray="8 8"/>` +
      flake(150, 168, 78, { draw: true }) + hop(pika({ x: 334, y: 236, s: .8, pose: 'explain', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:62%">돋보기로 본 눈 결정. 가지가 6개!</div>
      <div class="b box t-br" style="left:58%;top:24%;width:40%">피카! 6의 비밀 알려 줄게!</div>`
  },
  { // 3. 핵심 사실: 육각형 손잡기
    svg: `<rect width="400" height="300" fill="#eef6ff"/>` + (() => {
      const cx = 140, cy = 170, R = 66; let lines = '', dots = '';
      const pts = Array.from({ length: 6 }, (_, i) => { const t = (i * 60 - 90) * Math.PI / 180; return [cx + Math.cos(t) * R, cy + Math.sin(t) * R]; });
      pts.forEach((p, i) => { const q = pts[(i + 1) % 6]; lines += `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${INK}" stroke-width="4" stroke-dasharray="2 7" stroke-linecap="round"/>`; });
      pts.forEach((p, i) => { dots += `<g class="grow g${i + 1}">${drop(p[0], p[1], 20)}</g>`; });
      return lines + dots + `<text x="${cx}" y="${cy + 8}" font-family="Jua" font-size="22" text-anchor="middle" fill="${INK}">육각형</text>`;
    })() + bob(ryan({ x: 320, y: 222, s: .62, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:76%">물 알갱이는 얼 때 육각형으로 손을 잡아요</div>
      <div class="b shout t-br" style="left:58%;top:30%;width:40%">벌집이랑 똑같아!</div>`
  },
  { // 4. 야구 비유: 그립과 구종
    svg: field() + `<path d="M 60 90 Q 140 40 230 110" stroke="#e8443a" stroke-width="4" stroke-dasharray="10 8" fill="none"/>
      <path d="M 60 120 Q 150 120 230 150" stroke="${INK}" stroke-width="3" stroke-dasharray="4 6" fill="none" opacity=".5"/>` +
      `<g class="pulse">${baseball(236, 112, 11)}</g>` +
      bob(aiden({ x: 112, y: 220, s: .72, expr: 'talk', pose: 'pitch' })) + bob(ryan({ x: 310, y: 226, s: .64, expr: 'happy', flip: true }), 'd2'),
    html: `<div class="nar" style="left:2%;top:2.5%;width:72%">투수는 공 쥐는 법만 바꿔도 직구·커브!</div>
      <div class="b box t-bl" style="left:2%;top:40%;width:42%">눈도 온도 따라 모양이 바뀌어</div>
      <div class="b shout t-br" style="left:56%;top:40%;width:42%">구름 속이 마운드네!</div>`
  },
  { // 5. 역사: 벤틀리
    svg: `<rect width="400" height="300" fill="#e6f2df"/>` + board(14, 44, 250, 196, '벤틀리의 눈 사진', [
      ['46년 동안 찍었어요', '#fff'], ['5000장 넘게! 📷', G], ['똑같은 눈: 0개', W]], 17) +
      camera(320, 120) + flake(370, 70, 18, { sw: 3 }) + `<g class="twinkle">${fx('찰칵!', 330, 104, 24, -8)}</g>`,
    html: `<div class="nar" style="left:2%;top:2.5%;width:74%">미국 농부 벤틀리가 평생 찍은 눈 사진</div>
      <div class="b shout t-r" style="left:6%;top:82%;width:62%">똑같은 눈송이는 없대!</div>`
  },
  { // 6. 역사: 나카야의 인공 눈
    svg: `<rect width="400" height="300" fill="#eef1f6"/><rect x="0" y="236" width="400" height="64" fill="#cfd6e2" stroke="${INK}" stroke-width="3"/>
      <rect x="196" y="70" width="120" height="166" rx="10" fill="#dff1ff" fill-opacity=".7" ${S}/>
      <path d="M 256 76 Q 250 110 258 140 Q 264 160 256 176" stroke="#d9d4c7" stroke-width="3" fill="none"/>` +
      flake(256, 184, 16, { sw: 3 }) + thermo(352, 96, 110) +
      `<text x="352" y="86" font-family="Jua" font-size="15" text-anchor="middle" fill="${INK}">-15℃</text>` +
      bob(aiden({ x: 92, y: 214, s: .7, expr: 'talk', pose: 'point' })) + `<g class="twinkle">${fx('성공!', 256, 230, 26, -6)}</g>`,
    html: `<div class="nar" style="left:2%;top:2.5%;width:84%">1936년 나카야, 토끼털 끝에서 첫 인공 눈!</div>
      <div class="b box t-bl" style="left:2%;top:22%;width:40%">온도와 습기를 바꿔 가며 실험했대</div>`
  },
  { // 7. 놀라운 포인트: 눈 모양 = 구름 속 날씨
    svg: `<rect width="400" height="300" fill="#e8f1ff"/>` + thermo(52, 46, 186) +
      `<g font-family="Jua" font-size="20" fill="${INK}"><text x="78" y="102">-5℃</text><text x="78" y="196">-15℃</text></g>` +
      `<line x1="122" y1="96" x2="150" y2="96" stroke="${INK}" stroke-width="3"/><line x1="130" y1="190" x2="150" y2="190" stroke="${INK}" stroke-width="3"/>` +
      needle(178, 96, 1) + flake(186, 190, 32) +
      `<g font-family="Jua" font-size="18" fill="#2f6fde"><text x="210" y="102">바늘</text><text x="226" y="196">별</text></g>` +
      hop(ryan({ x: 330, y: 226, s: .62, expr: 'wow', flip: true })),
    html: `<div class="nar" style="left:2%;top:2.5%;width:50%">눈 모양 = 구름 속 온도 기록</div>
      <div class="b shout t-br" style="left:56%;top:4%;width:42%">하늘에서 온 편지다!</div>`
  },
  { // 8. 마무리: 밤에 눈 관찰
    svg: sky('n8', ['#1c2b5a', '#3b5b9a'], 18) + snowfall(34, 11, 0, 400, true) +
      `<path d="M 0 244 Q 200 228 400 244 V 300 H 0 Z" fill="#f4f8ff" stroke="${INK}" stroke-width="3"/>
      <rect x="146" y="238" width="90" height="34" rx="4" fill="#26262b" ${S}/>` + flake(176, 254, 9, { sw: 2, color: '#fff' }) + flake(206, 256, 7, { sw: 2, color: '#fff' }) +
      magnifier(196, 214, .42, -20) +
      bob(aiden({ x: 74, y: 206, s: .7, expr: 'smile' })) + bob(ryan({ x: 296, y: 208, s: .66, expr: 'happy', pose: 'wave', flip: true }), 'd1') +
      hop(pika({ x: 360, y: 262, s: .4, expr: 'happy', flip: true })),
    html: `<div class="b box t-bl" style="left:2%;top:3%;width:42%">검은 천에 받아서 관찰하자</div>
      <div class="b shout t-br" style="left:52%;top:3%;width:46%">12월 5일까지 같이 가자!</div>`
  }
];
renderPanels(PANELS);
