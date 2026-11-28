#!/usr/bin/env node
// 만화 컷 겹침 검사 (브라우저 없이)
//   node scripts/check_layout.js docs/2026-11-18-special/index.html
// - 말풍선(.b)·내레이션(.nar)이 인물 얼굴(data-head)을 가리는지
// - 말풍선이 컷 밖으로 나가는지, 말풍선끼리 겹치는지
// 말풍선 높이는 글자 수로 어림하므로 실제와 약간 다를 수 있다. 정확한 확인은 주소 뒤에 ?check 를 붙여 브라우저에서 본다.
// 문제가 있으면 목록을 출력하고 종료코드 1.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const file = process.argv[2];
if (!file) { console.error('사용법: node scripts/check_layout.js docs/SLUG/index.html'); process.exit(2); }
const html = fs.readFileSync(file, 'utf8');
const assetDir = path.join(__dirname, '..', 'docs', 'assets');
let lib = fs.readFileSync(path.join(assetDir, 'newstoon.js'), 'utf8');
if (html.includes('imgpanel.js')) lib += '\n' + fs.readFileSync(path.join(assetDir, 'imgpanel.js'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(s => s.includes('renderPanels'));
if (!scripts.length) { console.error('renderPanels 대본을 찾지 못했습니다.'); process.exit(2); }

let captured = null;
const ctx = {
  console, Math, JSON, Object, Array, String, Number,
  document: { getElementById: () => ({ innerHTML: '', set onclick(v) {} }), querySelector: () => null },
  location: { search: '' }, window: {},
};
vm.createContext(ctx);
vm.runInContext(lib + '\n;renderPanels = (p) => { __cap(p); }; setupSave = () => {};', Object.assign(ctx, { __cap: (p) => { captured = p; } }));
try { vm.runInContext(scripts.join('\n'), ctx); } catch (e) { console.error('대본 실행 오류: ' + e.message); process.exit(2); }
if (!captured) { console.error('renderPanels 가 호출되지 않았습니다.'); process.exit(2); }

const box = (p) => p.half ? [200, 300] : p.size === 'wide' ? [400, 200] : p.size === 'big' ? [400, 340] : [400, 300];
// 글자 폭(em): 한글·기호 1, 영문·숫자 0.58, 공백 0.3
const em = (t) => [...t].reduce((a, c) => a + (c === ' ' ? .3 : /[\x21-\x7e]/.test(c) ? .56 : .9), 0);
function lines(text, inner, fs) {
  let n = 0;
  for (const para of text.split('\n')) {
    let cur = 0; n++;
    for (const word of para.split(' ')) {
      const w = em(word) * fs;
      if (cur && cur + .3 * fs + w > inner) { n++; cur = w; } else cur += (cur ? .3 * fs : 0) + w;
      while (cur > inner) { n++; cur -= inner; } // 아주 긴 낱말
    }
  }
  return n;
}

const issues = [];
captured.forEach((p, i) => {
  const [W, H] = box(p);
  const scale = p.half ? 2 : 1; // half 컷은 cqw 값을 두 배로 쓴다 (newstoon.css)
  const heads = [...(p.svg || '').matchAll(/data-head="([\d.\-]+),([\d.\-]+),([\d.]+)"/g)].map(m => ({ x: +m[1], y: +m[2], r: +m[3] * .92 }));
  const bubbles = [...(p.html || '').matchAll(/<div class="(b[^"]*|nar[^"]*)"\s+style="([^"]*)">([\s\S]*?)<\/div>/g)].map(m => {
    const cls = m[1], st = m[2];
    const g = (k) => { const r = st.match(new RegExp(k + ':\\s*([\\d.]+)%')); return r ? +r[1] / 100 : null; };
    const text = m[3].replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim();
    const nar = /^nar/.test(cls), shout = /shout/.test(cls);
    const fs = (nar ? 3.8 : shout ? 5.6 : 4.6) / 100 * W * scale * (p.half ? (nar ? 7 / 7.6 : shout ? 9.6 / 11.2 : 8.4 / 9.2) : 1);
    const padX = (nar ? 2.6 : 3.4) / 100 * W * scale * (p.half ? .68 : 1), padY = (nar ? 1.2 : 1.6) / 100 * W * scale * (p.half ? .8 : 1);
    const x = (g('left') || 0) * W, y = (g('top') || 0) * H, w = (g('width') || .4) * W;
    const h = lines(text, w - 2 * padX - 5, fs) * fs * (nar ? 1.35 : 1.3) + 2 * padY + 5;
    return { text, x, y, w, h };
  });
  bubbles.forEach((b, bi) => {
    const why = [];
    if (heads.some(hd => { const nx = Math.max(b.x, Math.min(hd.x, b.x + b.w)), ny = Math.max(b.y, Math.min(hd.y, b.y + b.h)); return (nx - hd.x) ** 2 + (ny - hd.y) ** 2 < hd.r ** 2; })) why.push('얼굴 가림');
    if (b.x < -1 || b.y < -1 || b.x + b.w > W + 1 || b.y + b.h > H + 1) why.push('컷 밖');
    if (bubbles.some((o, oi) => oi !== bi && b.x < o.x + o.w && o.x < b.x + b.w && b.y < o.y + o.h && o.y < b.y + b.h)) why.push('말풍선끼리 겹침');
    if (why.length) issues.push(`${i + 1}컷 "${b.text.slice(0, 16)}": ${why.join(', ')}`);
  });
});

if (issues.length) { console.log('⚠️ 겹침 검사 문제 ' + issues.length + '개'); issues.forEach(s => console.log(' - ' + s)); process.exit(1); }
console.log(`✅ 겹침 검사 통과 (${captured.length}컷)`);
