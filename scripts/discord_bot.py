"""래래 뉴스툰 디스코드 봇 (서버 없이 동작)

상시 대기하지 않고, 필요할 때 한 번씩 실행되는 방식입니다.
PC에서도, Claude 클라우드 예약 작업에서도 똑같이 동작합니다.

사용법:
  python scripts/discord_bot.py test                     # 연결 확인 메시지 보내기
  python scripts/discord_bot.py today                    # 한국 시간 기준 오늘 날짜 출력 (YYYY-MM-DD)
  python scripts/discord_bot.py candidates 2026-11-07    # 후보 5개 보내기 + 1~5 반응 달기
  python scripts/discord_bot.py choice 2026-11-07        # 부모님이 누른 번호 확인 (없으면 종료코드 2)
  python scripts/discord_bot.py link 2026-11-07          # 웹페이지 반영을 기다린 뒤 링크 보내기
  python scripts/discord_bot.py notify "메시지"           # 알림 보내기 (실패 알림 등)

설정:
  - 채널 ID와 사이트 주소: config/settings.json (공개해도 되는 값)
  - 봇 토큰: 환경 변수 또는 .env 의 DISCORD_BOT_TOKEN
    클라우드에서는 토큰을 '네트워크 시크릿'으로 등록하면, 토큰 없이 실행해도
    클라우드 프록시가 discord.com 요청에 자동으로 붙여 줍니다.
"""
import datetime
import json
import os
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
KST = datetime.timezone(datetime.timedelta(hours=9))
NUM_EMOJI = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]
UA = "DiscordBot (https://github.com/k-hill-ar/raerae-newstoon, 1.1)"


def load_config():
    cfg = json.loads((ROOT / "config" / "settings.json").read_text(encoding="utf-8"))
    token = os.environ.get("DISCORD_BOT_TOKEN", "").strip()
    env_file = ROOT / ".env"
    if not token and env_file.exists():
        for line in env_file.read_text(encoding="utf-8-sig").splitlines():
            line = line.strip()
            if line.startswith("DISCORD_BOT_TOKEN="):
                token = line.split("=", 1)[1].strip().strip('"')
    cfg["token"] = token  # 비어 있으면 클라우드 프록시가 붙여 준다고 가정
    return cfg


CFG = None


def api(method, path, body=None):
    url = API + path
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"Content-Type": "application/json", "User-Agent": UA}
    if CFG["token"]:
        headers["Authorization"] = f"Bot {CFG['token']}"
    for _ in range(5):
        req = urllib.request.Request(url, data=data, method=method, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                raw = r.read()
                return json.loads(raw) if raw else None
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = json.loads(e.read() or b"{}").get("retry_after", 1)
                time.sleep(float(wait) + 0.2)
                continue
            detail = e.read().decode("utf-8", "replace")
            hint = {401: "봇 토큰이 없거나 틀렸습니다 (클라우드라면 네트워크 시크릿 확인).",
                    403: "봇에게 이 채널 권한이 없습니다.",
                    404: "채널 ID가 틀렸습니다."}.get(e.code, "")
            sys.exit(f"디스코드 오류 {e.code}: {hint}\n{detail}")
        except urllib.error.URLError as e:
            sys.exit(f"디스코드에 접속하지 못했습니다 (네트워크 허용 설정 확인): {e.reason}")
    sys.exit("디스코드가 계속 '잠시 후 다시' 응답을 보냅니다. 나중에 다시 실행해 주세요.")


def channel():
    return CFG["discord_channel_id"]


def candidates_header(date):
    return f"☀️ **{date} 래래 뉴스툰 후보**"


def find_candidates_message(date):
    """오늘 보낸 후보 메시지를 찾는다. 로컬 기록이 없으면 디스코드에서 직접 찾는다."""
    p = STATE / f"{date}.json"
    if p.exists():
        mid = json.loads(p.read_text(encoding="utf-8")).get("candidates_message_id")
        if mid:
            return mid
    me = api("GET", "/users/@me")
    for m in api("GET", f"/channels/{channel()}/messages?limit=50") or []:
        if m["author"]["id"] == me["id"] and m.get("content", "").startswith(candidates_header(date)):
            return m["id"]
    return None


def save_state(date, **kv):
    STATE.mkdir(exist_ok=True)
    p = STATE / f"{date}.json"
    st = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}
    st.update(kv)
    p.write_text(json.dumps(st, ensure_ascii=False, indent=2), encoding="utf-8")


def cmd_today():
    print(datetime.datetime.now(KST).strftime("%Y-%m-%d"))


def cmd_test():
    me = api("GET", "/users/@me")
    api("POST", f"/channels/{channel()}/messages", {"content": "⚡ 피카 연결 완료! 래래 뉴스툰 봇이 준비됐어요."})
    print(f"연결 성공: 봇 이름 {me['username']}")


def cmd_candidates(date):
    if find_candidates_message(date):
        print(f"{date} 후보는 이미 보냈습니다. 다시 보내지 않습니다.")
        return
    items = json.loads((DOCS / date / "candidates.json").read_text(encoding="utf-8"))["candidates"]
    fields = [{
        "name": f"{NUM_EMOJI[i]} {c['emoji']} {c['title']}",
        "value": f"{c['summary']}\n└ 흥미 포인트: {c['hook']}",
        "inline": False,
    } for i, c in enumerate(items[:5])]
    msg = api("POST", f"/channels/{channel()}/messages", {
        "content": candidates_header(date) + "\n만화로 만들 뉴스의 번호 반응을 눌러 주세요! (08:07에 만화 제작 시작)",
        "embeds": [{"color": 0xFFE14D, "fields": fields}],
    })
    for e in NUM_EMOJI[:len(fields)]:
        api("PUT", f"/channels/{channel()}/messages/{msg['id']}/reactions/{urllib.parse.quote(e)}/@me")
        time.sleep(0.3)
    save_state(date, candidates_message_id=msg["id"])
    print(f"후보 {len(fields)}개 전송 완료 (메시지 {msg['id']})")


def cmd_choice(date):
    mid = find_candidates_message(date)
    if not mid:
        print(f"{date} 후보 메시지를 찾지 못했습니다.")
        sys.exit(3)
    picked = []
    for i, e in enumerate(NUM_EMOJI):
        users = api("GET", f"/channels/{channel()}/messages/{mid}/reactions/{urllib.parse.quote(e)}")
        if any(not u.get("bot") for u in users or []):
            picked.append(i + 1)
    if not picked:
        print("아직 선택 없음")
        sys.exit(2)
    save_state(date, choice=picked[0])
    note = f" (여러 개 눌려 있어 가장 앞 번호 선택: {picked})" if len(picked) > 1 else ""
    print(f"선택: {picked[0]}{note}")


def wait_for_pages_build(timeout=300):
    """GitHub API로 최신 커밋의 Pages 빌드가 끝났는지 확인한다.
    클라우드에서는 github.io 접속이 막혀 있지만 gh(GitHub API)는 쓸 수 있다.
    확인할 수 없으면 None."""
    import subprocess
    try:
        head = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True, timeout=10).stdout.strip()
        repo = "k-hill-ar/raerae-newstoon"
        deadline = time.time() + timeout
        while time.time() < deadline:
            r = subprocess.run(["gh", "api", f"repos/{repo}/pages/builds/latest"], capture_output=True, text=True, timeout=30)
            if r.returncode != 0:
                return None
            b = json.loads(r.stdout)
            if b.get("commit") == head and b.get("status") == "built":
                return True
            if b.get("commit") == head and b.get("status") == "errored":
                return False
            time.sleep(10)
        return False
    except (OSError, subprocess.SubprocessError, ValueError):
        return None


def wait_for_page(url, timeout=300):
    """GitHub Pages 반영을 기다린다. GitHub API로 먼저 확인하고, 안 되면 페이지를 직접 열어 본다."""
    built = wait_for_pages_build(timeout)
    if built is not None:
        return built
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Cache-Control": "no-cache"})
            with urllib.request.urlopen(req, timeout=15) as r:
                if r.status == 200:
                    return True
        except urllib.error.HTTPError as e:
            if e.code != 404:
                return None  # 프록시가 막는 등 확인 불가
        except (urllib.error.URLError, OSError):
            return None  # 네트워크 정책으로 막힘: 확인 불가
        time.sleep(10)
    return False


def cmd_link(date):
    meta_path = DOCS / date / "meta.json"
    if not meta_path.exists():
        sys.exit(f"{meta_path} 가 없습니다. 만화를 먼저 만들어 주세요.")
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    title = f"{meta.get('category', '')} {meta.get('title', '오늘의 뉴스툰')}".strip()
    url = f"{CFG['site_base_url'].rstrip('/')}/{date}/"
    ok = wait_for_page(url)
    if ok is None:  # 확인할 방법이 없는 환경(클라우드): 보통 1분 안에 반영되므로 넉넉히 기다린다
        time.sleep(90)
    note = "\n(웹페이지 반영이 늦어지고 있어요. 링크가 안 열리면 1~2분 뒤 다시 눌러 주세요.)" if ok is False else ""
    api("POST", f"/channels/{channel()}/messages", {
        "content": f"🎉 **오늘의 만화 완성!**\n{title}\n{url}{note}\n\n👉 이 링크를 아이들에게 보내 주세요. 키즈폰에서 안 열리면 페이지 아래 '이미지로 저장'을 눌러 이미지를 보내면 돼요.",
    })
    print(f"링크 전송 완료: {url} (반영 확인: {ok})")


def cmd_notify(text):
    api("POST", f"/channels/{channel()}/messages", {"content": text[:1900]})
    print("알림 전송 완료")


def main():
    global CFG
    sys.stdout.reconfigure(encoding="utf-8")
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "today":
        return cmd_today()
    CFG = load_config()
    if cmd == "test":
        cmd_test()
    elif cmd in ("candidates", "choice", "link", "notify") and args:
        {"candidates": cmd_candidates, "choice": cmd_choice, "link": cmd_link, "notify": cmd_notify}[cmd](args[0])
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
