# 프로젝트명

K-Sign MCP Server

# 프로젝트 목표

한국수어(KSL) 공공데이터를 활용하여 AI가 수어를 설명하고, 수어 기반 동화책·교육 콘텐츠를 제공할 수 있는 MCP(Model Context Protocol) 서버를 구축한다.

본 프로젝트는 카카오 Play MCP 및 Claude Desktop, ChatGPT MCP Client 등 다양한 MCP 환경에서 활용 가능하도록 설계한다.

향후 AI41 사회적기업의 장애인·아동 교육 서비스 및 수어 교육 플랫폼의 핵심 인프라로 활용한다.

---

# 1. 개발 목표

1차 MVP

* 수어 단어 검색
* 수어 상세 조회
* 오늘의 수어 추천
* 문장을 수어 표현으로 변환

2차

* 동화책 → 수어 학습 콘텐츠 변환
* 수어 학습 카드 생성
* 수어 퀴즈 생성

3차

* AI 아바타 수어 생성
* 수어 동화책 자동 생성
* AAC 연계
* 자폐·청각장애 아동 대상 학습 서비스

---

# 2. 기술 스택

Backend

* Node.js 22+
* TypeScript
* Fastify
* MCP SDK

Database

* SQLite (MVP)
* PostgreSQL (운영)

Search

* Full Text Search

Infra

* Docker
* Vercel
* Railway

---

# 3. MCP Tool 설계

## search_sign

설명

사용자가 입력한 한국어 단어에 해당하는 수어 정보를 검색한다.

입력

```json
{
  "keyword":"학교"
}
```

출력

```json
{
  "word":"학교",
  "description":"학교를 의미하는 수어",
  "imageUrl":"...",
  "videoUrl":"..."
}
```

---

## get_sign_detail

설명

특정 수어의 상세 정보를 반환한다.

입력

```json
{
  "signId":"123"
}
```

출력

```json
{
  "word":"학교",
  "meaning":"교육기관",
  "handShape":"...",
  "movement":"...",
  "imageUrl":"..."
}
```

---

## daily_sign

설명

오늘의 추천 수어를 반환한다.

입력

```json
{}
```

출력

```json
{
  "date":"2026-06-22",
  "signs":[]
}
```

---

## sentence_to_sign

설명

문장을 분석하여 핵심 수어 표현을 추출한다.

입력

```json
{
  "text":"나는 학교에 갑니다."
}
```

출력

```json
{
  "tokens":[
    {
      "word":"나",
      "sign":"..."
    },
    {
      "word":"학교",
      "sign":"..."
    },
    {
      "word":"가다",
      "sign":"..."
    }
  ]
}
```

---

## story_to_sign_script

설명

동화책 문장을 수어 학습용 스크립트로 변환한다.

입력

```json
{
  "title":"토끼와 거북이",
  "content":"..."
}
```

출력

```json
{
  "scenes":[]
}
```

---

# 4. 데이터 소스

공공데이터포털

우선 적용

* 문화체육관광부 일상생활 수어 데이터
* 한국수어사전 API
* 수어 영상 데이터
* 국립국어원 수어 데이터

모든 데이터는 원본 출처를 기록한다.

---

# 5. 데이터 모델

## sign_terms

```sql
CREATE TABLE sign_terms(
    id TEXT PRIMARY KEY,
    word TEXT,
    category TEXT,
    description TEXT,
    hand_shape TEXT,
    movement TEXT,
    image_url TEXT,
    video_url TEXT,
    source TEXT,
    created_at DATETIME
);
```

---

# 6. 개발 순서

Phase 1

* 프로젝트 생성
* MCP SDK 연결
* search_sign 구현
* get_sign_detail 구현

Phase 2

* 공공데이터 자동 수집
* SQLite 저장
* 캐싱 구현

Phase 3

* sentence_to_sign 구현
* LLM 연동

Phase 4

* story_to_sign_script 구현
* 동화책 학습 콘텐츠 생성

Phase 5

* Docker 배포
* Play MCP 등록

---

# 7. 향후 확장

AI41 연계

* 청각장애인 수어 교육
* 발달장애인 AAC 지원
* 자폐 아동 의사소통 지원
* 수어 동화책 제작
* AI 수어 교사

장기적으로

"한국수어 GPT"

수준의 MCP 기반 수어 플랫폼 구축을 목표로 한다.