# 이미지개선편 만들기 (나노바나나 그림)

요청 예: "오늘의뉴스 4번 이미지개선편", "DATE=2026-11-28 2번 이미지개선편"
→ 그 날짜 후보 N번 뉴스로, 컷 그림을 **나노바나나(Gemini 이미지 모델)** 가 그린 회차를 만든다.

## 어떻게 돌아가나
1. Claude가 원고(대사·말풍선·본문)와 **컷별 그림 설명서** `image-prompts.json`을 써서 main에 올린다.
2. 올라가는 순간 GitHub Actions(`.github/workflows/nano-images.yml`)가 저장소 비밀값 `GEMINI_API_KEY`로 나노바나나를 불러 그림을 그린다.
3. 그림이 `docs/SLUG/img/`에 커밋되고 웹페이지가 다시 만들어진다. `DISCORD_BOT_TOKEN` 비밀값이 있으면 디스코드로 링크도 보낸다.
- 그래서 **구글 API에 직접 접속할 수 없는 환경(claude.ai 채팅 등)에서도** git push만 되면 만들 수 있다.
- 그림이 생기기 전에는 컷에 "🎨 그림을 그리는 중이에요"가 보인다. 보통 2~5분 걸린다.

## 1. 준비
- `git pull origin main`
- DATE: 요청에 있으면 그 날짜, 없으면 오늘(한국 시간). `docs/DATE/candidates.json`의 N번 후보를 쓴다.
- SLUG = `DATE-img` (이미 있으면 `DATE-img2`).

## 2. 취재와 원고
- `config/rules.md`를 **그대로** 따른다 (출처 2곳, 아이 눈높이, 역사 카드, 도감, 퀴즈, 창의 도전 유형 돌리기, 금지 사항).
- 만화는 7~9컷. 컷 크기는 정규편처럼 섞는다: `size:'wide'`(첫 컷), `half:true` 두 칸, `size:'big'`(야구 비유).
- 실제 인물(선수·정치인 등)의 얼굴은 그리지 않는다. 뒷모습, 멀리 있는 일반 인물, 또는 물건·장소로 표현한다.

## 3. 페이지 (`docs/SLUG/index.html`)
- 가장 최근 특별편을 복사해 틀로 쓴다. 바꿀 곳:
  - `<title>래래 뉴스툰 MM월 DD일 이미지개선편</title>`
  - 태그: `<span class="tag" style="background:#e0712c">🎨 이미지개선편 · 분야</span>`
  - `<script src="../assets/newstoon.js"></script>` 다음 줄에 `<script src="../assets/imgpanel.js"></script>`
  - 컷의 `svg`는 그림 대신 `imgPanel('pN', 가로, 세로)`:
    | 컷 | 페이지 칸 | 쓰는 법 | 그림 비율(ratio) |
    |---|---|---|---|
    | 보통 | 400×300 | `imgPanel('p4')` | `4:3` |
    | 넓은 컷 `size:'wide'` | 400×200 | `imgPanel('p1', 400, 200)` | `16:9` |
    | 반 컷 `half:true` | 200×300 | `imgPanel('p2', 200, 300)` | `2:3` |
    | 큰 컷 `size:'big'` | 400×340 | `imgPanel('p6', 400, 340)` | `5:4` |
  - 말풍선·나레이션(`html`)은 지금처럼 HTML로 얹는다. **그림 위쪽 1/3**에 두는 것을 기본으로 한다 (그림 설명서에서 위쪽을 비워 두게 했다).
  - **대체 그림 필수**: `imgPanel('p4', 400, 300, FB.p4)`처럼 4번째 인자로 기존 SVG 그림을 넣는다. 나노바나나 그림이 없거나 실패해도 만화가 완성돼 보이고, 그림이 생기면 그 위를 덮는다. (예: `docs/2026-11-28-img`)
  - 마지막 컷(도감 획득)도 그림으로 만든다. 도감 카드 글자는 그림에 넣지 말고 말풍선으로 쓴다.
  - `setupSave('SLUG')`
- 본문 섹션(뉴스 정리, 역사, 도감, 한 걸음 더, 퀴즈, 출처)은 정규편과 같다.

## 4. 그림 설명서 (`docs/SLUG/image-prompts.json`)
```json
{
  "slug": "2026-11-28-img",
  "style": "bright, clean digital webtoon illustration for kids, soft cel shading, bold dark outlines, warm cheerful colors",
  "panels": [
    {"id": "p1", "size": "wide",   "chars": ["ryan", "aiden"], "prompt": "…영어로 장면 설명…"},
    {"id": "p2", "size": "half",   "chars": ["ryan"],          "prompt": "…"},
    {"id": "p3", "size": "half",   "chars": ["pika"],          "prompt": "…"},
    {"id": "p4", "size": "normal", "chars": ["pika", "ryan"],  "prompt": "…"}
  ]
}
```
- `id`는 페이지의 `imgPanel('pN')`과 같게. `size`는 위 표대로(또는 `"ratio": "4:3"`로 직접 지정).
- `chars`에 넣은 캐릭터만 참고 그림(`docs/assets/ref/*.png`)과 설명이 함께 간다. 캐릭터 생김새는 스크립트가 알아서 붙이니, `prompt`에는 **장면만** 쓴다.
- `prompt`는 **영어로, 구체적으로**: 장소, 누가 어디에(왼쪽/오른쪽), 자세, 표정, 소품, 빛·날씨, 카메라 거리(close-up / wide shot).
  - 예: `"Wide shot of a bright science exhibition hall. Ryan on the left points excitedly at a white humanoid robot in the center that is waving; Aiden on the right smiles. Upper third is the plain white ceiling."`
- **그림 사실 검수(5-5)를 프롬프트에서 먼저 지킨다**: 방향·크기·순서가 중요한 컷은 그 사실을 문장으로 분명히 쓴다.
  - 예: `"seen from behind home plate: first base on the right, third base on the left; a left-handed batter stands on the RIGHT side of home plate; the curveball from the left-handed pitcher breaks toward the LEFT (third-base side), away from the batter."`
- 글자는 그림에 넣지 않는다(스크립트가 금지 문장을 붙인다). 숫자·연도·이름은 말풍선과 나레이션으로.
- 정확한 그래프·표·지도가 필요한 컷은 그림 대신 기존 SVG(`bgClassroom` 칠판, 전광판 등)로 그려도 된다. 한 회차 안에 섞어도 된다.

## 5. 올리기
- `meta.json`: `{"date": "DATE", "title": "제목", "category": "🎨 분야", "special": true}`
- `docs/index.html` 목록 맨 위(`<!-- 새 뉴스는 … -->` 바로 아래)에 `🎨 이미지개선편 · YYYY.MM.DD (요일) · 분야`로 추가.
- `node scripts/check_layout.js docs/SLUG/index.html` (말풍선끼리 겹침 확인)
- 커밋하고 `git push origin HEAD:main` → Actions가 그림을 그린다.

## 6. 그림 검수 (그림이 생긴 뒤)
- 2~5분 뒤 `git pull`. `docs/SLUG/img/manifest.json`에 모든 컷이 있으면 완료. (10분이 지나도 없으면 GitHub Actions 실행 기록을 확인하고 사용자에게 알린다. 대부분 `GEMINI_API_KEY` 비밀값이 없거나 한도 초과다. 로그에 `HTTP 429 … limit: 0 … Free Tier`가 보이면 무료 등급이라 이미지 모델을 쓸 수 없는 것이니, 사용자에게 Google AI Studio에서 결제(유료 등급) 연결을 요청한다. 연결 뒤 Actions → '이미지개선편 그림 만들기' → Run workflow(slug 입력)로 다시 돌리면 된다.)
- `node scripts/render_comic.js docs/SLUG/index.html` → 이미지를 열어 `routine-comic.md` 5-5 체크리스트로 **모든 컷**을 본다. 추가로:
  - 캐릭터가 참고 그림과 같은가(모자 색·번호 4/6, 피카 모양)? 피카가 다른 유명 캐릭터처럼 보이지 않는가?
  - 그림에 글자·로고가 생기지 않았는가? 실제 인물 얼굴이 그려지지 않았는가?
  - 말풍선이 그림 속 얼굴을 가리지 않는가? 가리면 말풍선 위치를 옮긴다.
- 틀린 컷은 그 컷의 `prompt`를 고쳐 다시 올린다. **프롬프트가 바뀐 컷만** 다시 그려진다. 같은 프롬프트로 다시 그리고 싶으면 문장 끝에 `(v2)`처럼 덧붙인다.
- 두 번 고쳐도 안 되는 컷은 그 컷만 기존 SVG 그림으로 바꾼다.

## 7. 링크
- `DISCORD_BOT_TOKEN` 비밀값이 있으면 Actions가 그림 완성 뒤 링크를 보낸다.
- 없으면 디스코드에 접속할 수 있는 환경에서 `python scripts/discord_bot.py link SLUG`.

## 처음 한 번 설정 (사용자)
- Google AI Studio(또는 Google Cloud 콘솔의 Gemini API)에서 API 키를 만든다. 이미지 모델은 결제가 연결된 프로젝트가 필요할 수 있다.
- GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret
  - `GEMINI_API_KEY` (필수)
  - `DISCORD_BOT_TOKEN` (선택: 그림 완성 뒤 디스코드 링크)
- 모델은 `config/settings.json`의 `image_model`에서 바꾼다 (기본 `gemini-nano-banana-2.1`, 안 되면 `image_model_fallbacks` 순서로 시도).
