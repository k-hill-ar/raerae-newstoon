#!/usr/bin/env node
/* 만화 그림 검수용: 회차 페이지의 만화 부분을 이미지로 저장한다.
   사용: node scripts/render_comic.js docs/SLUG/index.html [저장할 폴더]
   → 저장할 폴더(기본: 운영체제 임시 폴더)/comic-SLUG.png 경로를 출력한다.
   그 이미지를 직접 눈으로 보고 config/routine-comic.md 5-5 체크리스트로 검수한다. */
const path = require('path');
const os = require('os');
const http = require('http');
const fs = require('fs');

let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { console.log('⚠️ playwright가 없어 그림을 렌더하지 못했어요. 대본(svg 좌표)을 직접 읽고 5-5를 검수하세요.'); process.exit(2); }

const file = process.argv[2];
if (!file || !fs.existsSync(file)) { console.log('사용: node scripts/render_comic.js docs/SLUG/index.html [폴더]'); process.exit(1); }
const docs = path.resolve(path.dirname(file), '..');
const slug = path.basename(path.dirname(path.resolve(file)));
const outDir = process.argv[3] || os.tmpdir();
const out = path.join(outDir, `comic-${slug}.png`);

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(docs, p);
  if (!f.startsWith(docs) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 420, height: 900 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${port}/${slug}/`, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1200);
  const comic = await page.$('#comic');
  if (comic) await comic.screenshot({ path: out });
  await browser.close();
  server.close();
  if (errors.length) { console.log('⚠️ 스크립트 오류:\n - ' + errors.join('\n - ')); process.exit(1); }
  if (!comic) { console.log('⚠️ #comic 을 찾지 못했어요.'); process.exit(1); }
  console.log(`🖼️ 만화 이미지: ${out}\n이 이미지를 열어 5-5 그림 검수 체크리스트를 확인하세요.`);
});
