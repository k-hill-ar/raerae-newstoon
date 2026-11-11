#!/usr/bin/env python3
"""영재원 특별편 페이지 만들기.

gifted-src/episodes.json (회차 정보) + gifted-src/NN.html (본문) + gifted-src/NN.js (만화 대본)
→ docs/gifted/NN/index.html, docs/gifted/NN/meta.json, docs/gifted/index.html

본문과 대본은 페이지 안에 base64로 넣어 두고, docs/assets/gifted.js의 giftedGate()가
한국 시간 그 날짜 0시가 되면(또는 부모님 비밀번호를 넣으면) 풀어서 보여 준다.

사용: python3 scripts/build_gifted.py
"""
import base64
import html
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "gifted-src"
OUT = ROOT / "docs" / "gifted"
WEEK = "월화수목금토일"


def b64(s: str) -> str:
    return base64.b64encode(s.encode("utf-8")).decode("ascii")


def date_label(d: str) -> str:
    import datetime
    y, m, dd = map(int, d.split("-"))
    w = WEEK[datetime.date(y, m, dd).weekday()]
    return f"{y}.{m:02d}.{dd:02d} ({w})"


def header(ep: dict) -> str:
    return f"""<div id="capture">
  <header class="card">
    <div class="brand"><a href="../"><b>래래 뉴스툰</b> · 영재원 특별편</a><span>{date_label(ep['date'])}</span></div>
    <span class="tag gifted">⭐ 영재원 특별편 {ep['no']}화 · {ep['field']}</span><span class="dday"></span>
    <h1>{ep['title']} <em>{ep['em']}</em></h1>
    <p class="sub">{ep['sub']}</p>
    <div class="exam">🎯 <b>영재원 연결</b> · {ep['exam']}</div>
  </header>

  <section id="comic" aria-label="{ep['panels']}컷 만화">
    <div class="comic-title">⭐ 에이든 &amp; 라이언의 특별편 ⚡</div>
    <div id="panels"></div>
    <div class="replay"><button type="button" class="alt" id="replay">▶ 만화 처음부터 다시 보기</button></div>
  </section>
</div>
"""


SAVE = """
<section class="card">
  <h2><span class="chip">💾 저장하기</span></h2>
  <div class="btns">
    <button type="button" id="saveComic">🖼️ 만화만 이미지로 저장</button>
    <button type="button" class="alt" id="saveAll">📄 전체 페이지 저장</button>
  </div>
  <div class="status" id="status"></div>
</section>
"""


def page(ep: dict, body: str, js: str, nxt: dict | None) -> str:
    foot = f'<footer><a href="../">← 영재원 특별편 모아보기</a>'
    if nxt:
        foot += f" · 다음 화는 {nxt['date'][5:7].lstrip('0')}월 {nxt['date'][8:].lstrip('0')}일"
    foot += ' · <a href="../../">아침 뉴스툰</a></footer>'
    # 저장하기 칸은 출처 칸 바로 앞에 넣는다
    if '<section class="card src">' in body:
        body = body.replace('<section class="card src">', SAVE + '\n<section class="card src">', 1)
    else:
        body += SAVE
    content = header(ep) + body + "\n" + foot
    cfg = json.dumps({"no": ep["no"], "date": ep["date"], "topic": ep["topic"], "slug": f"gifted-{ep['no']:02d}"}, ensure_ascii=False)
    return f"""<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>래래 뉴스툰 영재원편 {ep['no']}화</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jua&family=Gowun+Dodum&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/newstoon.css">
<link rel="stylesheet" href="../../assets/gifted.css">
<script src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js"></script>
<script src="../../assets/newstoon.js"></script>
<script src="../../assets/gifted.js"></script>
</head>
<body>
<div class="wrap" id="app"><noscript>이 페이지를 보려면 자바스크립트를 켜 주세요.</noscript></div>
<script type="text/plain" id="ep-html">{b64(content)}</script>
<script type="text/plain" id="ep-js">{b64(js)}</script>
<script>giftedGate({cfg});</script>
</body>
</html>
"""


def index(eps: list) -> str:
    items = []
    for ep in eps:
        items.append(f"""  <a class="item" href="{ep['no']:02d}/" data-date="{ep['date']}" data-title="{html.escape(ep['title'] + ' ' + ep['em'])}">
    <span><span class="date">{ep['no']}화 · {date_label(ep['date'])} · {ep['field']}</span><br><span class="title"></span></span>
    <span class="go"></span>
  </a>""")
    return """<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>래래 뉴스툰 영재원 특별편</title>
<link href="https://fonts.googleapis.com/css2?family=Jua&family=Gowun+Dodum&display=swap" rel="stylesheet">
<script src="../assets/gifted.js"></script>
<style>
  :root{--ink:#1d1d1f;--paper:#fffdf6;--bg:#f3efe4;--yellow:#ffe14d;--purple:#7b4fd6;--muted:#6b6658}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:"Gowun Dodum",system-ui,sans-serif}
  .wrap{max-width:560px;margin:0 auto;padding:16px}
  h1{font-family:Jua,sans-serif;font-weight:400;font-size:30px;margin:8px 0 2px;color:var(--purple)}
  p{margin:0 0 16px;color:var(--muted)}
  .dday{display:inline-block;font-family:Jua,sans-serif;background:var(--yellow);border:2px solid var(--ink);border-radius:999px;padding:0 10px;color:var(--ink)}
  a.item{display:flex;justify-content:space-between;align-items:center;gap:12px;text-decoration:none;color:var(--ink);
    background:var(--paper);border:3px solid var(--ink);border-radius:14px;padding:14px 16px;margin-bottom:12px;box-shadow:4px 4px 0 var(--ink)}
  a.item:active{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--ink)}
  a.item.locked{background:#ece8dc;box-shadow:4px 4px 0 #9a9484}
  a.item.locked .title{color:#8a8474}
  .date{font-size:13px;color:var(--muted)}
  .title{font-family:Jua,sans-serif;font-size:19px;line-height:1.3}
  .go{font-family:Jua,sans-serif;background:var(--yellow);border:2px solid var(--ink);border-radius:8px;padding:2px 10px;white-space:nowrap}
  .locked .go{background:#fff;font-size:14px}
  .back{display:block;text-align:center;font-size:13px;color:var(--muted);margin-top:8px}
</style>
</head>
<body>
<div class="wrap">
  <h1>⭐ 영재원 특별편</h1>
  <p>라이언의 영재원(과학) 시험 대비 만화 · <span class="dday">12월 5일 시험</span><br>새 회차는 그날 0시에 열려요 🔒</p>
""" + "\n".join(items) + """
  <a class="back" href="../">← 아침 뉴스툰으로</a>
</div>
<script>giftedList();</script>
</body>
</html>
"""


def main():
    eps = json.loads((SRC / "episodes.json").read_text(encoding="utf-8"))
    for i, ep in enumerate(eps):
        nn = f"{ep['no']:02d}"
        body = (SRC / f"{nn}.html").read_text(encoding="utf-8")
        js = (SRC / f"{nn}.js").read_text(encoding="utf-8")
        nxt = eps[i + 1] if i + 1 < len(eps) else None
        d = OUT / nn
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(page(ep, body, js, nxt), encoding="utf-8")
        meta = {"no": ep["no"], "date": ep["date"], "title": f"{ep['title']} {ep['em']}",
                "category": f"⭐ 영재원 {ep['no']}화 · {ep['field']}", "special": True}
        (d / "meta.json").write_text(json.dumps(meta, ensure_ascii=False) + "\n", encoding="utf-8")
    (OUT / "index.html").write_text(index(eps), encoding="utf-8")
    print(f"{len(eps)}개 회차를 만들었어요.")


if __name__ == "__main__":
    main()
