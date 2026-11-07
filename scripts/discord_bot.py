"""래래 뉴스툰 디스코드 봇 (서버 없이 동작)

상시 대기하지 않고, 필요할 때 한 번씩 실행되는 방식입니다.

사용법:
  python scripts/discord_bot.py test                     # 연결 확인 메시지 보내기
  python scripts/discord_bot.py candidates 2026-11-07    # 후보 5개 보내기 + 1~5 반응 달기
  python scripts/discord_bot.py choice 2026-11-07        # 부모님이 누른 번호 확인
  python scripts/discord_bot.py link 2026-11-07          # 완성된 만화 링크 보내기

설정은 프로젝트 폴더의 .env 파일에서 읽습니다 (.env.example 참고).
"""
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
STATE = ROOT / "state"
API = "https://discord.com/api/v10"
NUM_EMOJI = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]


def load_env():
    env = {}
    path = ROOT / ".env"
    if not path.exists():
        sys.exit(".env 파일이 없습니다. .env.example을 복사해서 .env를 만들고 값을 채워 주세요.")
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"')
    for key in ("DISCORD_BOT_TOKEN", "DISCORD_CHANNEL_ID", "SITE_BASE_URL"):
        if not env.get(key):
            sys.exit(f".env에 {key} 값이 비어 있습니다.")
    return env


ENV = None


def api(method, path, body=None):
    url = API + path
    data = json.dumps(body).encode("utf-8") if body is not None else None
    for _ in range(5):
        req = urllib.request.Request(url, data=data, method=method, headers={
            "Authorization": f"Bot {ENV['DISCORD_BOT_TOKEN']}",
            "Content-Type": "application/json",
            "User-Agent": "DiscordBot (https://github.com/k-hill-ar/raerae-newstoon, 1.0)",
        })
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                raw = r.read()
                return json.loads(raw) if raw else None
        except urllib.error.HTTPError as e:
            if e.code == 429:  # 너무 빨리 보냄: 잠깐 기다렸다 다시
                wait = json.loads(e.read() or b"{}").get("retry_after", 1)
                time.sleep(float(wait) + 0.2)
                continue
            detail = e.read().decode("utf-8", "replace")
            hint = {401: "봇 토큰이 틀렸습니다.", 403: "봇에게 이 채널 권한이 없습니다.", 404: "채널 ID가 틀렸습니다."}.get(e.code, "")
            sys.exit(f"디스코드 오류 {e.code}: {hint}\n{detail}")
    sys.exit("디스코드가 계속 '잠시 후 다시' 응답을 보냅니다. 나중에 다시 실행해 주세요.")


def channel():
    return ENV["DISCORD_CHANNEL_ID"]


def state_path(date):
    STATE.mkdir(exist_ok=True)
    return STATE / f"{date}.json"


def load_state(date):
    p = state_path(date)
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}


def save_state(date, data):
    state_path(date).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def cmd_test():
    me = api("GET", "/users/@me")
    api("POST", f"/channels/{channel()}/messages", {"content": "⚡ 꼬미 연결 완료! 래래 뉴스툰 봇이 준비됐어요."})
    print(f"연결 성공: 봇 이름 {me['username']}")


def cmd_candidates(date):
    src = DOCS / date / "candidates.json"
    items = json.loads(src.read_text(encoding="utf-8"))["candidates"]
    fields = [{
        "name": f"{NUM_EMOJI[i]} {c['emoji']} {c['title']}",
        "value": f"{c['summary']}\n└ 흥미 포인트: {c['hook']}",
        "inline": False,
    } for i, c in enumerate(items[:5])]
    msg = api("POST", f"/channels/{channel()}/messages", {
        "content": f"☀️ **{date} 래래 뉴스툰 후보**\n만화로 만들 뉴스의 번호 반응을 눌러 주세요!",
        "embeds": [{"color": 0xFFE14D, "fields": fields}],
    })
    for e in NUM_EMOJI[:len(fields)]:
        api("PUT", f"/channels/{channel()}/messages/{msg['id']}/reactions/{urllib.parse.quote(e)}/@me")
        time.sleep(0.3)
    st = load_state(date)
    st["candidates_message_id"] = msg["id"]
    save_state(date, st)
    print(f"후보 {len(fields)}개 전송 완료 (메시지 {msg['id']})")


def cmd_choice(date):
    st = load_state(date)
    mid = st.get("candidates_message_id")
    if not mid:
        sys.exit(f"{date} 후보 메시지 기록이 없습니다. 먼저 candidates를 실행해 주세요.")
    picked = []
    for i, e in enumerate(NUM_EMOJI):
        users = api("GET", f"/channels/{channel()}/messages/{mid}/reactions/{urllib.parse.quote(e)}")
        if any(not u.get("bot") for u in users or []):
            picked.append(i + 1)
    if not picked:
        print("아직 선택 없음")
        sys.exit(2)
    choice = picked[0]
    st["choice"] = choice
    save_state(date, st)
    note = f" (여러 개 눌려 있어 가장 앞 번호 선택: {picked})" if len(picked) > 1 else ""
    print(f"선택: {choice}{note}")


def cmd_link(date):
    meta_path = DOCS / date / "meta.json"
    if not meta_path.exists():
        sys.exit(f"{meta_path} 가 없습니다. 만화를 먼저 만들어 주세요.")
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    title = f"{meta.get('category', '')} {meta.get('title', '오늘의 뉴스툰')}".strip()
    url = f"{ENV['SITE_BASE_URL'].rstrip('/')}/{date}/"
    api("POST", f"/channels/{channel()}/messages", {
        "content": f"🎉 **오늘의 만화 완성!**\n{title}\n{url}\n\n👉 이 링크를 아이들에게 보내 주세요. 키즈폰에서 안 열리면 페이지 아래 '이미지로 저장'을 눌러 이미지를 보내면 돼요.",
    })
    print(f"링크 전송 완료: {url}")


def main():
    global ENV
    sys.stdout.reconfigure(encoding="utf-8")
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    ENV = load_env()
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "test":
        cmd_test()
    elif cmd in ("candidates", "choice", "link") and args:
        {"candidates": cmd_candidates, "choice": cmd_choice, "link": cmd_link}[cmd](args[0])
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
