# UI Generator

자연어 프롬프트를 입력하면 Claude API를 사용하여 일관된 React UI 코드를 자동 생성하는 웹 애플리케이션입니다.

## 프로젝트 구조

```
ui-generator/
├── backend/          # FastAPI 서버
│   ├── app/
│   │   ├── api/      # API 엔드포인트
│   │   ├── services/ # Claude API 클라이언트
│   │   └── models/   # Pydantic 스키마
│   └── skill-data/   # frontend-ui-ux-publishing 스킬 데이터
├── frontend/         # React + Vite 앱
│   └── src/
│       ├── components/  # UI 컴포넌트
│       ├── services/    # API 클라이언트
│       └── types/       # TypeScript 타입
└── docker-compose.yml
```

## 주요 기능

- 🤖 **자연어 입력**: "로그인 페이지를 만들어주세요"와 같은 자연어로 UI 요구사항 입력
- ⚡ **즉시 생성**: Claude API가 일관된 React 컴포넌트 코드 자동 생성
- 👀 **실시간 미리보기**: 생성된 코드를 브라우저에서 바로 확인
- 💾 **다운로드**: 생성된 파일을 ZIP으로 다운로드
- 🎨 **디자인 시스템 준수**: 8px 간격 스케일, Tailwind CSS 적용

## 빠른 시작

### 사전 요구사항

- Docker & Docker Compose
- Anthropic API Key

### 1. 환경 설정

```bash
# .env 파일 생성
cp .env.example .env

# API 키 입력
# .env 파일을 열어서 ANTHROPIC_API_KEY 설정
```

### 2. Docker로 실행

```bash
# 전체 스택 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d --build
```

### 3. 접속

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 4. 중지

```bash
docker-compose down
```

## 로컬 개발 (Docker 없이)

### Backend 개발

```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# .env 파일 생성
cp .env.example .env
# ANTHROPIC_API_KEY 설정

# 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend 개발

```bash
cd frontend

# 의존성 설치
npm install

# .env 파일 생성
cp .env.example .env

# 개발 서버 실행
npm run dev
```

Frontend는 http://localhost:5173 에서 실행됩니다.

## 사용 방법

### 1. 프롬프트 입력

텍스트 영역에 만들고 싶은 UI를 자연어로 설명합니다.

**예시:**
- "이메일과 비밀번호를 입력받는 로그인 페이지"
- "사용자 목록을 보여주는 테이블"
- "프로필 정보를 보여주는 상세 페이지"
- "통계를 보여주는 대시보드"

### 2. 생성하기

"만들기" 버튼을 클릭하여 코드를 생성합니다.

### 3. 코드 확인

생성된 코드는 두 가지 방식으로 확인할 수 있습니다:

- **코드 탭**: 구문 강조된 소스 코드 보기
- **미리보기 탭**: 샌드박스 iframe에서 렌더링된 UI 미리보기

### 4. 다운로드

"코드 다운로드" 버튼을 클릭하여 생성된 모든 파일을 ZIP으로 다운로드합니다.

## API 엔드포인트

### POST /api/generate

React UI 코드 생성

**Request Body:**
```json
{
  "prompt": "Create a login page with email and password",
  "page_type": "form"  // 선택사항: form | list | detail | dashboard
}
```

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "path": "src/pages/LoginPage.tsx",
      "content": "..."
    }
  ],
  "preview_html": "<html>...</html>",
  "token_usage": {
    "input": 1200,
    "output": 3400
  }
}
```

### GET /api/health

서버 상태 확인

**Response:**
```json
{
  "status": "healthy",
  "service": "ui-generator"
}
```

## 생성 규칙

생성되는 코드는 다음 규칙을 따릅니다:

### 간격 시스템
- 8px 스케일 엄격히 준수 (gap-2, gap-4, gap-6, gap-8)
- 임의 값 사용 금지 (예: `w-[350px]` ❌)

### 디자인 토큰
- 시맨틱 컬러: `text-primary`, `bg-muted`, `border-border`
- 타이포그래피: `text-3xl`, `text-xl`, `text-base`

### 컴포넌트 구조
- TypeScript 사용
- `@/components/common/`에서 컴포넌트 import
- 적절한 ARIA 레이블 포함

### 파일 구조
```
src/
├── pages/          # 페이지 컴포넌트
├── components/     # 재사용 가능한 컴포넌트
└── ...
```

## 아키텍처 결정

### Claude API 통합

**선택한 방법:** Anthropic Messages API + 임베디드 스킬 프롬프트

시스템 프롬프트에 frontend-ui-ux-publishing 스킬 지침을 직접 삽입하여:
- CLI 래퍼 불필요
- 간단한 Docker 배포
- 표준 API 클라이언트 사용

### 보안 고려사항

**코드 미리보기:**
- 샌드박스 iframe 사용 (`sandbox="allow-scripts"`)
- 격리된 컨텍스트에서 렌더링
- 직접적인 코드 실행 방지

## 환경 변수

### Backend

- `ANTHROPIC_API_KEY`: Anthropic API 키 (필수)
- `CORS_ORIGINS`: 허용된 CORS 오리진 (쉼표로 구분)
- `LOG_LEVEL`: 로깅 레벨 (기본값: info)

### Frontend

- `VITE_API_URL`: 백엔드 API URL (기본값: http://localhost:8000)

## 트러블슈팅

### Backend가 시작되지 않음

1. API 키 확인:
```bash
echo $ANTHROPIC_API_KEY  # Linux/Mac
echo %ANTHROPIC_API_KEY%  # Windows
```

2. 의존성 재설치:
```bash
cd backend
pip install --upgrade -r requirements.txt
```

### Frontend 빌드 실패

1. Node 버전 확인 (20.x 권장):
```bash
node --version
```

2. node_modules 재설치:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS 에러

1. 백엔드 `.env`의 `CORS_ORIGINS` 확인
2. Frontend URL이 허용된 오리진에 포함되어 있는지 확인

### 생성된 코드 파싱 실패

백엔드 로그 확인:
```bash
docker-compose logs backend
```

Claude 응답이 예상 형식과 다를 수 있습니다. skill-data/ 파일이 올바르게 마운트되었는지 확인하세요.

## 개발 워크플로

### 1. Backend 수정

```bash
cd backend
# app/ 수정
# 서버는 --reload로 자동 재시작됨
```

### 2. Frontend 수정

```bash
cd frontend
# src/ 수정
# Vite가 HMR로 자동 갱신
```

### 3. 스킬 업데이트

```bash
# backend/skill-data/ 파일 수정
# 서버 재시작 필요
docker-compose restart backend
```

## 라이선스

이 프로젝트는 개인 및 교육 목적으로 자유롭게 사용할 수 있습니다.

## 기여

이슈 및 풀 리퀘스트를 환영합니다.

## 향후 개선 사항

- [ ] 사용자 인증 및 세션 관리
- [ ] 생성 히스토리 데이터베이스 저장
- [ ] Claude 응답 실시간 스트리밍
- [ ] GitHub 통합 (생성된 코드 자동 커밋)
- [ ] 다단계 생성 (생성된 코드 반복 수정)
- [ ] 커스텀 디자인 시스템 설정
- [ ] 토큰 사용량 분석 대시보드
- [ ] 클라우드 배포 (AWS, GCP, Vercel)
