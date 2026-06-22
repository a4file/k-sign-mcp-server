# K-Sign MCP Server

| | |
|---|---|
| **서버 이름** | `ksign` (표시명: K-Sign) |
| **설명** | 국립국어원 공공 수어 데이터(3만 건+)를 검색·조회하는 한국수어(KSL) MCP 서버. 수어 단어, 수형 설명, 이미지·영상 URL을 AI에게 제공합니다. |
| **Git** | https://github.com/a4file/k-sign-mcp-server |
| **MCP Endpoint** | `https://k-sign-mcp-server.playmcp-endpoint.kakaocloud.io/mcp` |
| **인증** | 없음 |

Claude Desktop, ChatGPT MCP Client, [카카오 PlayMCP](https://playmcp.kakao.com) 등 MCP 클라이언트에서 사용할 수 있습니다.

## 기능

| Tool | 설명 |
|------|------|
| `search_sign` | 한국어 키워드로 수어 검색 (FTS5 + LIKE 폴백) |
| `get_sign_detail` | 수어 ID로 상세 정보·이미지·영상 URL 조회 |

### 데이터 소스 (Phase 2)

국립국어원 KCISA Open API에서 **실제** `sldict.korean.go.kr` 미디어 URL을 수집합니다.

| 데이터셋 | API | 약 件수 |
|----------|-----|--------|
| 일상생활 수어 | `getCTE01701` | ~7,500 |
| 전문용어 수어 | `getCTE01702` | ~10,000 |
| 문화정보 수어 | `getCTE01703` | ~1,200 |
| 통합 수어정보 | `API_CNV_054` | ~19,000 |

> API마다 **인증키가 다를 수 있습니다.** 아래 [공공데이터 수집](#공공데이터-수집) 참고.

## 아키텍처

Clean Architecture + DDD

```
src/
├── domain/sign/              # SignTerm, Repository, errors
├── application/sign/         # SearchSign, GetSignDetail UseCase
├── infrastructure/
│   ├── persistence/sqlite/   # SQLite + FTS5
│   ├── collectors/culture-sign/  # KCISA API 수집기
│   ├── transport/            # stdio / HTTP (Fastify)
│   └── di/
├── interfaces/mcp/           # MCP tool adapters
└── config/env.ts
```

- **MCP SDK:** `@modelcontextprotocol/server` 2.0.0-alpha.2
- **DB:** SQLite (기본) → PostgreSQL 교체 가능 (`SignTermRepository` 인터페이스)

## 요구 사항

- Node.js 22+
- npm 10+

## 빠른 시작

```bash
npm install
cp .env.example .env
npm run db:setup      # migrate + 공공 API 수집 (키 필요)
npm run dev           # stdio MCP
```

HTTP 모드 (배포/PlayMCP):

```bash
MCP_TRANSPORT=http npm run dev
# Health: GET http://localhost:8000/health
# MCP:    POST http://localhost:8000/mcp
```

프로덕션:

```bash
npm run build && npm start
```

## 환경 변수

### 서버

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `MCP_TRANSPORT` | `stdio` | `stdio` \| `http` |
| `MCP_SERVER_NAME` | `k-sign-mcp-server` | MCP 서버 이름 |
| `HTTP_HOST` | `0.0.0.0` | HTTP 바인드 호스트 |
| `HTTP_PORT` / `PORT` | `8000` | HTTP 포트 (KC는 `PORT` 우선) |
| `DB_PROVIDER` | `sqlite` | `sqlite` \| `postgres` |
| `SQLITE_PATH` | `./data/ksign.db` | SQLite 경로 |
| `SEARCH_RESULT_LIMIT` | `20` | 검색 결과 상한 |
| `LOG_LEVEL` | `info` | 로그 레벨 |

### 공공데이터 수집

| 변수 | 설명 |
|------|------|
| `DATA_GO_KR_SERVICE_KEY` | 공통 키 (단일 키 모드) |
| `DATA_GO_KR_SERVICE_KEY_DAILY` | 일상생활 수어 |
| `DATA_GO_KR_SERVICE_KEY_PROFESSIONAL` | 전문용어 수어 |
| `DATA_GO_KR_SERVICE_KEY_CULTURE` | 문화정보 수어 |
| `DATA_GO_KR_SERVICE_KEY_COMPREHENSIVE` | 통합 수어정보 |
| `KCISA_API_IP_FALLBACK` | `api.kcisa.kr` DNS 실패 시 IP (기본 `175.125.91.8`) |
| `COLLECT_ON_START` | Docker 시작 시 자동 수집 |
| `COLLECT_PAGE_SIZE` | 페이지 크기 (기본 100) |
| `COLLECT_REQUEST_DELAY_MS` | 요청 간격 ms (기본 200) |
| `USE_SAMPLE_DATA` | 키 없을 때 샘플 5건 (데모용) |

## 공공데이터 수집

### 1. API 키 발급

[문화공공데이터광장](https://www.culture.go.kr/data/openapi/openapiList.do?category=G&searchKeyword=%EC%88%98%EC%96%B4) 또는 [공공데이터포털](https://www.data.go.kr)에서 **API별** 활용신청:

| API | 환경변수 |
|-----|----------|
| 일상생활 수어 | `DATA_GO_KR_SERVICE_KEY_DAILY` |
| 전문용어 수어 | `DATA_GO_KR_SERVICE_KEY_PROFESSIONAL` |
| 문화정보 수어 | `DATA_GO_KR_SERVICE_KEY_CULTURE` |
| 통합 수어정보 | `DATA_GO_KR_SERVICE_KEY_COMPREHENSIVE` |

**키가 API마다 다를 때 (권장):**

```env
DATA_GO_KR_SERVICE_KEY_DAILY=...
DATA_GO_KR_SERVICE_KEY_PROFESSIONAL=...
DATA_GO_KR_SERVICE_KEY_CULTURE=...
DATA_GO_KR_SERVICE_KEY_COMPREHENSIVE=...
```

개별 키를 하나라도 넣으면 `DATA_GO_KR_SERVICE_KEY`로 나머지가 **자동 대체되지 않습니다.** 키가 있는 API만 수집됩니다.

### 2. 수집 실행

```bash
npm run db:migrate    # 스키마만
npm run db:collect    # API 수집 → DB 저장
npm run db:setup      # migrate + collect
```

504 타임아웃 등 일시 오류는 자동 재시도하며, 실패 시 이미 수집한 페이지는 유지합니다.

## PlayMCP in KC 배포

| 항목 | 값 |
|------|-----|
| MCP 식별자 | `ksign` |
| Git 저장소 | https://github.com/a4file/k-sign-mcp-server |
| Active Endpoint | https://k-sign-mcp-server.playmcp-endpoint.kakaocloud.io/mcp |

1. GitHub 저장소 연결 후 배포
2. 환경변수 예시:

```env
MCP_TRANSPORT=http
PORT=8000
DATA_GO_KR_SERVICE_KEY_DAILY=...
DATA_GO_KR_SERVICE_KEY_PROFESSIONAL=...
DATA_GO_KR_SERVICE_KEY_CULTURE=...
DATA_GO_KR_SERVICE_KEY_COMPREHENSIVE=...
COLLECT_ON_START=true
```

3. [PlayMCP 콘솔](https://playmcp.kakao.com/console)에서 위 Endpoint로 등록

## Docker

```bash
docker compose up --build
```

- Health: `GET http://localhost:8000/health`
- MCP: `POST http://localhost:8000/mcp`

## Claude Desktop 연동

`~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "k-sign": {
      "command": "node",
      "args": ["/absolute/path/to/k-sign-mcp-server/dist/index.js"],
      "env": {
        "SQLITE_PATH": "/absolute/path/to/k-sign-mcp-server/data/ksign.db"
      }
    }
  }
}
```

## MCP Tool 예시

### search_sign

```json
{ "keyword": "안녕하세요" }
```

```json
{
  "results": [
    {
      "id": "ksign-daily-…",
      "word": "안녕하세요",
      "description": "인사 표현",
      "imageUrl": "http://sldict.korean.go.kr/multimedia/…jpg",
      "videoUrl": "http://sldict.korean.go.kr/multimedia/…mp4"
    }
  ]
}
```

### get_sign_detail

```json
{ "signId": "ksign-daily-…" }
```

## 테스트

```bash
npm test
npm run test:coverage
```

## Git 커밋 설정 (a4file 계정)

Vercel/GitHub 연동은 **`a4file` 프로필 하나**만 사용합니다. 커밋이 `a4file-ai`로 잡히지 않도록 저장소 루트에서 한 번 실행하세요:

```bash
./scripts/setup-git.sh
```

이 스크립트는:

- 커밋 작성자를 `a4file` GitHub noreply 이메일로 설정 (`116946770+a4file@users.noreply.github.com`)
- `Co-authored-by: Cursor` / `a4file-ai` 트레일러를 커밋 메시지에서 자동 제거하는 Git hook 활성화

푸시는 `gh auth login`으로 **`a4file` 계정**이 active인지 확인 후 진행하세요.

## npm 스크립트

| 스크립트 | 설명 |
|----------|------|
| `npm run dev` | 개발 서버 (tsx watch) |
| `npm run build` | TypeScript 빌드 |
| `npm run db:migrate` | DB 스키마 생성 |
| `npm run db:collect` | 공공 API 수집 |
| `npm run db:setup` | migrate + collect |

## PostgreSQL 전환 (향후)

1. `PostgresSignTermRepository` 구현 완료 상태
2. `.env`: `DB_PROVIDER=postgres`, `POSTGRES_URL=…`

## 라이선스

MIT
