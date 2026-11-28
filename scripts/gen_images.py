#!/usr/bin/env python3
"""이미지개선편: 나노바나나(Gemini 이미지 모델)로 만화 컷 그림을 만든다.

docs/SLUG/image-prompts.json 을 읽어 컷마다 그림을 만들고 docs/SLUG/img/ 에 저장한다.
- 이미 만든 컷은 건너뛴다. 프롬프트를 고치면(내용이 바뀌면) 그 컷만 다시 만든다.
- 캐릭터 일관성을 위해 docs/assets/ref/small/{aiden,ryan,pika}.jpg (768px 이하, 토큰 절약)를 참고 이미지로 보낸다.

토큰 절약 규칙 (config/settings.json):
- image_size: 작은 크기부터 시도 (예: ["512", "1K"]). 모델이 거절하면 다음 크기.
- 반복 컷은 "stock": "이름" → docs/assets/stock/ 그림을 복사 (API 호출 없음).
- 한도 초과(429)가 나오면 다른 모델로 넘어가지 않고 바로 멈춘다.
- max_images_per_run / max_images_per_day 를 넘으면 멈춘다 (기록: config/image_usage.json).

어디로 부를지 (config/settings.json "image_backend"):
- "vertex" (기본): Google Cloud Vertex AI. 구글 클라우드 크레딧(무료 체험 $300 등)으로 결제된다.
    인증은 둘 중 하나 (GitHub 비밀값):
      GCP_SA_KEY     서비스 계정 JSON 키 전체 (추천)
      VERTEX_API_KEY 서비스 계정에 묶은 Google Cloud API 키
    프로젝트: GCP_SA_KEY 안의 project_id, 또는 GCP_PROJECT_ID / settings "gcp_project"
    위치: settings "gcp_location" (기본 global)
- "ai_studio": 예전 방식. GEMINI_API_KEY (Google AI Studio 키, 크레딧 못 씀)

사용:
  python3 scripts/gen_images.py                  # 그림이 비어 있거나 프롬프트가 바뀐 모든 회차
  python3 scripts/gen_images.py 2026-11-28-img   # 한 회차만
  python3 scripts/gen_images.py SLUG --force     # 그 회차 전부 다시
  python3 scripts/gen_images.py SLUG --dry-run   # API 없이 자리 표시 그림으로 흐름만 시험
"""
import base64
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
REF = DOCS / "assets" / "ref" / "small"
STOCK = DOCS / "assets" / "stock"
USAGE = ROOT / "config" / "image_usage.json"
CFG = json.loads((ROOT / "config" / "settings.json").read_text(encoding="utf-8"))
MODEL = os.environ.get("IMAGE_MODEL") or CFG.get("image_model", "gemini-nano-banana-2.1")
FALLBACK_MODELS = CFG.get("image_model_fallbacks", ["gemini-3.1-flash-image", "gemini-2.5-flash-image"])
SIZES = CFG.get("image_size", ["512", "1K"])
MAX_RUN = int(CFG.get("max_images_per_run", 12))
MAX_DAY = int(CFG.get("max_images_per_day", 30))
API = os.environ.get("GEMINI_API_BASE", "https://generativelanguage.googleapis.com/v1beta")
BACKEND = os.environ.get("IMAGE_BACKEND") or CFG.get("image_backend", "vertex")
LOCATION = os.environ.get("GCP_LOCATION") or CFG.get("gcp_location", "global")
VERTEX_HOST = os.environ.get("VERTEX_API_BASE") or (
    "https://aiplatform.googleapis.com" if LOCATION == "global" else f"https://{LOCATION}-aiplatform.googleapis.com")

# 컷 크기 → 요청 비율 (페이지에서는 칸에 맞게 잘라서 꽉 채운다)
RATIO = {"normal": "4:3", "wide": "16:9", "half": "2:3", "big": "5:4"}

CHAR_DESC = {
    "aiden": "AIDEN: 6th-grade boy, blue baseball cap with white number 6, blue baseball jersey with thin white stripes, brown hair, friendly older brother who explains things. (see reference image 'aiden')",
    "ryan": "RYAN: 4th-grade boy, red baseball cap with white number 4, red baseball jersey with thin white stripes, brown hair, curious and expressive younger brother. (see reference image 'ryan')",
    "pika": "PIKA: small round yellow electric creature mascot with a lightning-bolt antenna on top, round ears with pink insides, pink cheeks, cream belly, tiny feet. Original character, NOT Pikachu. (see reference image 'pika')",
}

RULES = (
    "Rules: Absolutely NO text, letters, numbers (except the 4 and 6 on the caps), speech bubbles, captions or logos in the image. "
    "Keep the upper third of the image simple (sky, wall or plain background) because speech bubbles will be placed there. "
    "Do not depict any real, identifiable person; if a real person is mentioned, show only a generic figure from behind or far away, or leave them out. "
    "No brand logos, no team logos. Child-friendly, no scary or violent content. "
    "Keep each character exactly as in the reference images: same cap colors and numbers, same proportions, same faces."
)


class QuotaStop(Exception):
    """한도 초과: 다른 모델·방식으로 넘어가도 소용없으니 바로 멈춘다."""


class Usage:
    """하루·한 번 실행 그림 수 상한 (한국 날짜 기준)."""

    def __init__(self):
        from datetime import datetime, timedelta, timezone
        self.day = datetime.now(timezone(timedelta(hours=9))).strftime("%Y-%m-%d")
        self.data = json.loads(USAGE.read_text(encoding="utf-8")) if USAGE.exists() else {}
        self.run = 0

    def check(self):
        if self.run >= MAX_RUN:
            raise QuotaStop(f"한 번 실행 상한 {MAX_RUN}장에 닿았어요 (config/settings.json max_images_per_run)")
        if self.data.get(self.day, 0) >= MAX_DAY:
            raise QuotaStop(f"오늘 상한 {MAX_DAY}장에 닿았어요 (config/settings.json max_images_per_day)")

    def add(self):
        self.run += 1
        self.data[self.day] = self.data.get(self.day, 0) + 1
        keep = dict(sorted(self.data.items())[-60:])
        USAGE.write_text(json.dumps(keep, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


class Auth:
    """요청에 붙일 인증 헤더. ai_studio 는 API 키, vertex 는 서비스 계정 토큰(또는 Cloud API 키)."""

    def __init__(self):
        self.backend = BACKEND
        self.creds = None
        self.api_key = None
        self.project = os.environ.get("GCP_PROJECT_ID") or CFG.get("gcp_project") or ""
        if BACKEND == "ai_studio":
            self.api_key = os.environ.get("GEMINI_API_KEY", "").strip()
            if not self.api_key:
                sys.exit("GEMINI_API_KEY 가 없습니다. GitHub 저장소 Settings → Secrets → Actions 에 넣어 주세요.")
            return
        if BACKEND != "vertex":
            sys.exit(f"image_backend '{BACKEND}' 를 모르겠어요 (vertex 또는 ai_studio)")
        sa = os.environ.get("GCP_SA_KEY", "").strip()
        self.token = os.environ.get("VERTEX_ACCESS_TOKEN", "").strip()  # 시험·외부 토큰용
        if sa:
            info = json.loads(sa)
            self.project = self.project or info.get("project_id", "")
            from google.oauth2 import service_account
            self.creds = service_account.Credentials.from_service_account_info(
                info, scopes=["https://www.googleapis.com/auth/cloud-platform"])
        elif not self.token:
            self.api_key = os.environ.get("VERTEX_API_KEY", "").strip()
            if not self.api_key and os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
                import google.auth
                self.creds, proj = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
                self.project = self.project or proj or ""
        if not (self.creds or self.token or self.api_key):
            sys.exit("Vertex AI 인증이 없습니다. GitHub 비밀값 GCP_SA_KEY(서비스 계정 JSON) 또는 VERTEX_API_KEY 를 넣어 주세요.\n"
                     "(예전 AI Studio 키로 돌리려면 config/settings.json 에서 \"image_backend\": \"ai_studio\")")
        if (self.creds or self.token) and not self.project:
            sys.exit("Google Cloud 프로젝트 ID 를 모르겠어요. 비밀값 GCP_PROJECT_ID 또는 settings \"gcp_project\" 를 넣어 주세요.")

    def headers(self):
        if self.api_key:
            return {"x-goog-api-key": self.api_key}
        if self.creds:
            if not self.creds.valid:
                import google.auth.transport.requests
                self.creds.refresh(google.auth.transport.requests.Request())
            return {"Authorization": "Bearer " + self.creds.token}
        return {"Authorization": "Bearer " + self.token}

    def vertex_url(self, model):
        path = f"publishers/google/models/{model}:generateContent"
        if self.api_key and not self.project:  # Cloud API 키는 프로젝트 없는 주소도 된다
            return f"{VERTEX_HOST}/v1/{path}"
        return f"{VERTEX_HOST}/v1/projects/{self.project}/locations/{LOCATION}/{path}"

    def fns(self):
        if self.backend == "vertex":
            return (call_vertex,)
        return (call_interactions, call_generate_content)


def b64(path):
    return base64.b64encode(Path(path).read_bytes()).decode("ascii")


def post(url, body, auth, timeout=180):
    req = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"), method="POST",
                                 headers={"Content-Type": "application/json", **auth.headers()})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def mime(p):
    return "image/png" if str(p).endswith(".png") else "image/jpeg"


def call_interactions(model, text, refs, ratio, size, auth):
    """최신 형식 (Interactions API)."""
    inp = [{"type": "text", "text": text}] + [{"type": "image", "mime_type": mime(p), "data": b64(p)} for p in refs]
    res = post(f"{API}/interactions", {
        "model": model, "input": inp,
        "response_format": {"type": "image", "mime_type": "image/jpeg", "aspect_ratio": ratio, "image_size": size},
    }, auth)
    data = (res.get("output_image") or {}).get("data")
    if not data:
        for o in res.get("outputs", []) or res.get("output", []) or []:
            if isinstance(o, dict) and o.get("type") == "image" and o.get("data"):
                data = o["data"]
                break
    if not data:
        raise RuntimeError("응답에 이미지가 없음: " + json.dumps(res, ensure_ascii=False)[:400])
    return base64.b64decode(data)


def gc_body(text, refs, ratio, size):
    parts = [{"text": text}] + [{"inlineData": {"mimeType": mime(p), "data": b64(p)}} for p in refs]
    return {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": ratio, "imageSize": size}},
    }


def image_from(res):
    for c in res.get("candidates", []):
        for p in (c.get("content") or {}).get("parts", []):
            d = p.get("inlineData") or p.get("inline_data")
            if d and d.get("data"):
                return base64.b64decode(d["data"])
    raise RuntimeError("응답에 이미지가 없음: " + json.dumps(res, ensure_ascii=False)[:400])


def call_generate_content(model, text, refs, ratio, size, auth):
    """AI Studio 예전 형식 (generateContent). 새 형식이 안 될 때 쓴다."""
    return image_from(post(f"{API}/models/{model}:generateContent", gc_body(text, refs, ratio, size), auth))


def call_vertex(model, text, refs, ratio, size, auth):
    """Google Cloud Vertex AI (generateContent). 클라우드 크레딧으로 결제된다."""
    return image_from(post(auth.vertex_url(model), gc_body(text, refs, ratio, size), auth))


BAD_SIZE = set()  # 이번 실행에서 거절된 (모델, 크기): 다음 컷부터는 건너뛴다
DEAD_MODEL = set()  # 404 가 난 모델
MODELS_VERTEX = CFG.get("vertex_models") or [MODEL] + [m for m in FALLBACK_MODELS if m != MODEL]


def generate(text, refs, ratio, auth):
    errors = []
    models = MODELS_VERTEX if auth.backend == "vertex" else [MODEL] + [m for m in FALLBACK_MODELS if m != MODEL]
    for model in models:
        if model in DEAD_MODEL:
            continue
        for fn in auth.fns():
            for size in SIZES:
                if (model, size) in BAD_SIZE and size != SIZES[-1]:
                    continue
                for attempt in range(2):
                    try:
                        return fn(model, text, refs, ratio, size, auth), f"{auth.backend}:{model}@{size}"
                    except urllib.error.HTTPError as e:
                        body = e.read().decode("utf-8", "ignore")[:300]
                        errors.append(f"{model}/{fn.__name__}/{size}: HTTP {e.code} {body}")
                        if e.code == 429:
                            # Vertex 는 공유 한도라 잠깐 몰릴 때도 429 가 난다: 30초 뒤 한 번만 다시, 그래도면 멈춤
                            if auth.backend == "vertex" and attempt == 0:
                                time.sleep(30)
                                continue
                            raise QuotaStop("구글 API 한도 초과(429): " + body[:200])
                        if e.code in (401, 403):
                            raise QuotaStop(f"구글 인증/권한 문제(HTTP {e.code}): " + body[:200])
                        if e.code == 404:
                            DEAD_MODEL.add(model)  # 이 위치에 없는 모델: 다음 컷부터 건너뛴다
                        if e.code in (500, 503) and attempt == 0:
                            time.sleep(20)
                            continue
                        break
                    except Exception as e:  # noqa: BLE001
                        errors.append(f"{model}/{fn.__name__}/{size}: {e}")
                        break
                else:
                    continue
                if errors and " 400 " in errors[-1]:
                    BAD_SIZE.add((model, size))
                    continue
                break  # 크기 문제가 아니면 다음 크기는 소용없다
    raise RuntimeError("그림 생성 실패\n - " + "\n - ".join(errors[-6:]))


def shrink(raw, out_path):
    """가로 900px 이하 JPEG 로 줄여 저장 (Pillow 가 없으면 그대로 저장)."""
    try:
        from io import BytesIO
        from PIL import Image
        im = Image.open(BytesIO(raw)).convert("RGB")
        if im.width > 900:
            im = im.resize((900, round(im.height * 900 / im.width)), Image.LANCZOS)
        im.save(out_path, "JPEG", quality=84, optimize=True)
    except Exception:  # noqa: BLE001
        out_path.write_bytes(raw)


def placeholder(out_path, ratio, label):
    from PIL import Image, ImageDraw
    w, h = map(int, ratio.split(":"))
    W = 900
    im = Image.new("RGB", (W, round(W * h / w)), (214, 232, 250))
    d = ImageDraw.Draw(im)
    d.rectangle([20, 20, im.width - 20, im.height - 20], outline=(29, 29, 31), width=6)
    d.text((40, im.height // 2), f"DRY RUN {label}", fill=(29, 29, 31))
    im.save(out_path, "JPEG", quality=80)


def build_prompt(spec, panel):
    chars = [c for c in panel.get("chars", []) if c in CHAR_DESC]
    lines = [
        "Create one panel of a Korean children's morning news webtoon.",
        "Art style: " + spec.get("style", "bright, clean digital webtoon illustration for kids, soft cel shading, bold dark outlines, warm cheerful colors, simple readable shapes"),
        "Characters in this panel: " + ("; ".join(CHAR_DESC[c] for c in chars) if chars else "none (scene only)"),
        "Scene: " + panel["prompt"],
        RULES,
    ]
    refs = [REF / f"{c}.jpg" for c in chars if (REF / f"{c}.jpg").exists()]
    return "\n".join(lines), refs


STOCK_SPEC = json.loads((STOCK / "stock.json").read_text(encoding="utf-8")) if (STOCK / "stock.json").exists() else {}


def draw(spec, panel, out, usage, auth, dry):
    """API로 한 장 그려 out에 저장. 모델 이름을 돌려준다."""
    ratio = panel.get("ratio") or RATIO.get(panel.get("size", "normal"), "4:3")
    text, refs = build_prompt(spec, panel)
    if dry:
        placeholder(out, ratio, out.stem)
        return "dry-run"
    usage.check()
    raw, model = generate(text, refs, ratio, auth)
    shrink(raw, out)
    usage.add()
    return model


AUTH_CACHE = {}


def run(slug, force=False, dry=False, usage=None):
    usage = usage or Usage()
    spec_path = DOCS / slug / "image-prompts.json"
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    img_dir = DOCS / slug / "img"
    img_dir.mkdir(exist_ok=True)
    man_path = img_dir / "manifest.json"
    manifest = json.loads(man_path.read_text(encoding="utf-8")) if man_path.exists() else {}
    auth = None if dry else AUTH_CACHE.setdefault("a", Auth())
    made, failed, stopped = 0, [], None
    for panel in spec["panels"]:
        pid = panel["id"]
        out = img_dir / f"{pid}.jpg"
        try:
            if panel.get("stock"):  # 돌려 쓰는 그림: 복사만 (없으면 딱 한 번 그려 둔다)
                name = panel["stock"]
                digest = "stock:" + name
                if out.exists() and manifest.get(pid, {}).get("hash") == digest:
                    continue
                src = STOCK / f"{name}.jpg"
                if not src.exists():
                    if name not in STOCK_SPEC:
                        raise RuntimeError(f"stock.json에 '{name}'이 없어요")
                    print(f"🎨 stock/{name} 처음 그리는 중…", flush=True)
                    draw(spec, STOCK_SPEC[name], src, usage, auth, dry)
                out.write_bytes(src.read_bytes())
                manifest[pid] = {"hash": digest, "model": "stock", "stock": name}
                print(f"♻️ {slug}/{pid} ← stock/{name} (API 호출 없음)", flush=True)
                made += 1
                continue
            ratio = panel.get("ratio") or RATIO.get(panel.get("size", "normal"), "4:3")
            text, refs = build_prompt(spec, panel)
            digest = hashlib.sha256((text + ratio + "".join(p.name for p in refs)).encode("utf-8")).hexdigest()[:16]
            if out.exists() and manifest.get(pid, {}).get("hash") == digest and not force:
                continue
            print(f"🎨 {slug}/{pid} ({ratio}) 그리는 중…", flush=True)
            model = draw(spec, panel, out, usage, auth, dry)
            manifest[pid] = {"hash": digest, "model": model, "ratio": ratio}
            made += 1
        except QuotaStop as e:
            stopped = str(e)
            failed.append(f"{pid}: {e}")
            print(f"⛔ 멈춤: {e}", flush=True)
            break
        except Exception as e:  # noqa: BLE001
            failed.append(f"{pid}: {e}")
            print(f"⚠️ {pid} 실패: {e}", flush=True)
    man_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"✅ {slug}: 새 그림 {made}장 (API {usage.run}장, 오늘 누적 {usage.data.get(usage.day, 0)}장)" + (f", 실패 {len(failed)}장" if failed else ""))
    report = os.environ.get("GEN_REPORT")
    if report and made and not failed:
        with open(report, "a", encoding="utf-8") as f:
            f.write(slug + "\n")
    if stopped:
        raise QuotaStop(stopped)
    return failed


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    force, dry = "--force" in sys.argv, "--dry-run" in sys.argv
    slugs = args or sorted(p.parent.name for p in DOCS.glob("*/image-prompts.json"))
    usage = Usage()
    all_failed = []
    for s in slugs:
        try:
            all_failed += run(s, force, dry, usage)
        except QuotaStop as e:
            sys.exit(f"⛔ 그림 만들기를 멈췄어요: {e}")
    if all_failed:
        sys.exit("일부 그림을 만들지 못했어요:\n - " + "\n - ".join(all_failed))


if __name__ == "__main__":
    main()
