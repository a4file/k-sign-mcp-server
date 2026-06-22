# K-Sign MCP Server

한국수어(KSL) 공공데이터를 AI가 활용할 수 있도록 제공하는 **Model Context Protocol(MCP) 서버**입니다.  
Claude Desktop, ChatGPT MCP Client, 카카오 Play MCP 등 다양한 MCP 환경에서 사용할 수 있습니다.

## Phase 1 기능

| Tool | 설명 |
|------|------|
| `search_sign` | 한국어 키워드로 수어 검색 |
| `get_sign_detail` | 수어 ID로 상세 정보 조회 |

## 아키텍처

Clean Architecture + DDD 구조를 따릅니다.

```
src/
├── domain/           # 엔티티, Repository 인터페이스, 도메인 에러
├── application/      # Use Case, DTO
├── infrastructure/   # SQLite/PostgreSQL, DI, Transport, Logger
├── interfaces/       # MCP Tool 어댑터
└── config/           # 환경변수 설정
```

- **Repository Pattern**: `SignTermRepository` 인터페이스로 DB 구현체를 교체 가능 (SQLite → PostgreSQL)
- **MCP SDK v2**: `@modelcontextprotocol/server` 2.0.0-alpha.2
- **Full-Text Search**: SQLite FTS5 기반 검색 (LIKE 폴백 포함)

## 요구 사항

- Node.js 22+
- npm 10+

## 빠른 시작

### 1. 설치

```bash
npm install
cp .env.example .env
```

### 2. DB 마이그레이션 및 시드

```bash
npm run db:migrate
```

### 3. 개발 실행

```bash
# stdio (Claude Desktop 등 로컬 MCP 클라이언트)
npm run dev

# HTTP (원격 배포)
MCP_TRANSPORT=http npm run dev
```

### 4. 빌드 및 프로덕션 실행

```bash
npm run build
npm start
```

## 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `MCP_TRANSPORT` | `stdio` | `stdio` 또는 `http` |
| `MCP_SERVER_NAME` | `k-sign-mcp-server` | MCP 서버 이름 |
| `MCP_SERVER_VERSION` | `0.1.0` | MCP 서버 버전 |
| `HTTP_HOST` | `0.0.0.0` | HTTP 바인드 호스트 |
| `HTTP_PORT` | `3000` | HTTP 포트 |
| `DB_PROVIDER` | `sqlite` | `sqlite` 또는 `postgres` |
| `SQLITE_PATH` | `./data/ksign.db` | SQLite DB 경로 |
| `POSTGRES_URL` | — | PostgreSQL 연결 URL (postgres 사용 시 필수) |
| `SEARCH_RESULT_LIMIT` | `20` | 검색 결과 최대 개수 |
| `LOG_LEVEL` | `info` | `debug`, `info`, `warn`, `error` |

## MCP Tool 사용 예시

### search_sign

```json
{
  "keyword": "학교"
}
```

응답:

```json
{
  "results": [
    {
      "id": "sign-001",
      "word": "학교",
      "description": "교육기관을 의미하는 수어",
      "imageUrl": "https://example.com/signs/school.png",
      "videoUrl": "https://example.com/signs/school.mp4"
    }
  ]
}
```

### get_sign_detail

```json
{
  "signId": "sign-001"
}
```

응답:

```json
{
  "id": "sign-001",
  "word": "학교",
  "meaning": "교육기관을 의미하는 수어",
  "category": "일상생활",
  "handShape": "주먹을 쥔 손",
  "movement": "손등을 위로 향하게 하여 앞으로 이동",
  "imageUrl": "https://example.com/signs/school.png",
  "videoUrl": "https://example.com/signs/school.mp4",
  "source": "문화체육관광부 일상생활 수어 데이터"
}
```

## Claude Desktop 연동

`~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "k-sign": {
      "command": "node",
      "args": ["/absolute/path/to/K-Sign MCP Server/dist/index.js"],
      "env": {
        "SQLITE_PATH": "/absolute/path/to/K-Sign MCP Server/data/ksign.db"
      }
    }
  }
}
```

## Docker

```bash
docker compose up --build
```

- Health check: `GET http://localhost:3000/health`
- MCP endpoint: `POST http://localhost:3000/mcp`

## 테스트

```bash
npm test
npm run test:coverage
```

## PostgreSQL 전환 (향후)

1. `PostgresSignTermRepository` 구현
2. `.env`에서 `DB_PROVIDER=postgres`, `POSTGRES_URL` 설정
3. `RepositoryFactory`가 자동으로 PostgreSQL 구현체 사용

## 라이선스

MIT
