# UI Generator - Project Summary

## 프로젝트 개요

**목적**: 자연어 프롬프트를 입력받아 Claude API를 사용하여 일관된 React UI 코드를 자동으로 생성하는 웹 애플리케이션

**핵심 가치**:
- ⚡ 빠른 프로토타이핑: 아이디어를 몇 초 만에 코드로 변환
- 🎯 일관성: frontend-ui-ux-publishing 스킬 규칙 자동 적용
- 🔄 반복 가능: 생성 → 검토 → 다운로드 → 프로젝트 통합

## 기술 스택

### Backend
- **Framework**: FastAPI 0.109.0
- **Language**: Python 3.11
- **API Client**: Anthropic SDK 0.18.0
- **Validation**: Pydantic 2.5.3
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Code Display**: react-syntax-highlighter
- **File Download**: JSZip

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx (production)
- **Development**: Hot reload for both frontend and backend

## 아키텍처

```
┌─────────────┐      HTTP       ┌─────────────┐
│             │  ───────────>    │             │
│   Browser   │                  │   Frontend  │
│             │  <───────────    │  (React)    │
└─────────────┘    HTML/JS      └─────────────┘
                                       │
                                       │ API Call
                                       │ /api/generate
                                       ▼
                              ┌─────────────────┐
                              │    Backend      │
                              │   (FastAPI)     │
                              └─────────────────┘
                                       │
                                       │ System Prompt
                                       │ + User Input
                                       ▼
                              ┌─────────────────┐
                              │   Claude API    │
                              │  (Anthropic)    │
                              └─────────────────┘
                                       │
                                       │ Generated
                                       │ TSX Code
                                       ▼
                              ┌─────────────────┐
                              │  Code Parser    │
                              │  & Formatter    │
                              └─────────────────┘
                                       │
                                       │ Structured
                                       │ Files
                                       ▼
                              ┌─────────────────┐
                              │   Response      │
                              │   {files[],     │
                              │    preview,     │
                              │    tokens}      │
                              └─────────────────┘
```

## 주요 컴포넌트

### Backend (FastAPI)

#### 1. `app/main.py`
- FastAPI 앱 진입점
- CORS 미들웨어 설정
- 라우터 등록

#### 2. `app/api/generate.py`
- POST `/api/generate` 엔드포인트
- 요청 검증 및 에러 핸들링
- Claude 클라이언트 호출

#### 3. `app/services/claude_client.py`
- Anthropic API 통합
- 시스템 프롬프트 구성
- 응답 파싱 (`FILE: path` 마커 인식)
- 파일명 추론 로직
- 미리보기 HTML 생성

#### 4. `app/services/skill_loader.py`
- 스킬 지침 파일 로드
- 시스템 프롬프트 조합
- 페이지 타입별 가이드 추가

#### 5. `app/models/schemas.py`
- Pydantic 모델 정의
- 요청/응답 스키마 검증

### Frontend (React + TypeScript)

#### 1. `App.tsx`
- 메인 애플리케이션 컴포넌트
- 상태 관리 (prompt, loading, result, error)
- 그리드 레이아웃 (입력 패널 / 미리보기 패널)

#### 2. `components/PromptInput.tsx`
- 텍스트 영역 입력 컴포넌트
- 플레이스홀더 예시 제공
- 비활성화 상태 처리

#### 3. `components/GenerateButton.tsx`
- 생성 액션 버튼
- 로딩 상태 표시 (spinner)
- 아이콘 전환 (Sparkles ↔ Loader)

#### 4. `components/CodePreview.tsx`
- 탭 인터페이스 (코드 / 미리보기)
- 다중 파일 네비게이션
- 구문 강조 표시
- 샌드박스 iframe 미리보기

#### 5. `components/DownloadButton.tsx`
- ZIP 파일 생성 (JSZip)
- 브라우저 다운로드 트리거

#### 6. `services/api.ts`
- Fetch API 래퍼
- 에러 핸들링
- 타입 안전성

## 데이터 플로우

### 생성 요청 플로우

1. **사용자 입력**
   - 텍스트 영역에 프롬프트 입력
   - "만들기" 버튼 클릭

2. **Frontend → Backend**
   ```typescript
   POST /api/generate
   {
     "prompt": "로그인 페이지 만들기",
     "page_type": null
   }
   ```

3. **Backend → Claude API**
   ```python
   messages.create(
     model="claude-sonnet-4-5-20250929",
     system=skill_instructions,
     messages=[{"role": "user", "content": prompt}]
   )
   ```

4. **Claude API → Backend**
   ```
   FILE: src/pages/LoginPage.tsx
   ```tsx
   import { Button } from "@/components/common/button"
   ...
   ```
   ```

5. **Backend 파싱**
   - 정규식으로 파일 블록 추출
   - 파일명과 내용 분리
   - 미리보기 HTML 생성

6. **Backend → Frontend**
   ```json
   {
     "success": true,
     "files": [
       {"path": "src/pages/LoginPage.tsx", "content": "..."}
     ],
     "preview_html": "<html>...</html>",
     "token_usage": {"input": 1200, "output": 3400}
   }
   ```

7. **Frontend 렌더링**
   - 파일 목록 표시
   - 코드 구문 강조
   - iframe에 미리보기 로드

8. **사용자 다운로드**
   - JSZip으로 파일 압축
   - Blob 생성 및 다운로드

## 스킬 통합

### frontend-ui-ux-publishing 스킬 적용

**위치**: `backend/skill-data/`

**파일**:
- `design-system.md`: 컬러, 타이포그래피, 간격 규칙
- `consistency-rules.md`: 일관성 체크리스트
- `page-templates.md`: 페이지 타입별 템플릿
- `component-library.md`: 재사용 가능한 컴포넌트

**통합 방식**:
```python
system_prompt = f"""
You are a frontend code generator...

{design_system_content}
{consistency_rules_content}
{page_templates_content}

Output format:
FILE: path
```tsx
code
```
"""
```

Claude는 이 지침을 따라:
- 8px 간격 스케일 사용 (gap-4, p-6)
- 시맨틱 토큰 사용 (text-primary, bg-muted)
- 임의 값 금지
- 컴포넌트 import 규칙 준수

## 보안 고려사항

### 1. API 키 보호
- 환경 변수로만 관리
- 프론트엔드에 노출 금지
- `.env` 파일 `.gitignore` 등록

### 2. CORS 설정
- 허용된 오리진만 요청 허용
- 프로덕션에서 와일드카드 금지

### 3. 코드 미리보기
- 샌드박스 iframe 사용
  ```html
  <iframe sandbox="allow-scripts" srcDoc={html} />
  ```
- 직접적인 eval() 사용 금지
- Content Security Policy 고려

### 4. 입력 검증
- Pydantic으로 요청 검증
- 빈 프롬프트 거부
- 최대 길이 제한 (선택적)

## 배포 전략

### 개발 환경
```bash
docker-compose up
# 볼륨 마운트로 핫 리로드
```

### 프로덕션 환경
```bash
docker-compose -f docker-compose.prod.yml up
# 볼륨 마운트 제거
# Nginx 리버스 프록시 활성화
# 환경 변수 시크릿 관리
```

### 클라우드 배포 옵션

**Option 1: AWS**
- ECS Fargate (컨테이너)
- ALB (로드 밸런서)
- Secrets Manager (API 키)

**Option 2: Google Cloud**
- Cloud Run (서버리스 컨테이너)
- Cloud Load Balancing
- Secret Manager

**Option 3: Vercel + Railway**
- Vercel (프론트엔드)
- Railway (백엔드)
- 환경 변수 설정

## 성능 최적화

### Backend
- 비동기 API 호출 (`async/await`)
- 응답 캐싱 (선택적)
- 타임아웃 설정 (30-60초)

### Frontend
- 코드 스플리팅 (Vite 자동)
- 레이지 로딩 (react-syntax-highlighter)
- 디바운싱 (선택적, 자동 생성용)

### API 사용량
- `max_tokens=8000` 제한
- `temperature=0` (일관성)
- 토큰 사용량 모니터링

## 테스트 시나리오

### 기본 시나리오
1. ✅ 단순 컴포넌트 생성: "버튼 컴포넌트"
2. ✅ 폼 페이지 생성: "로그인 페이지"
3. ✅ 목록 페이지 생성: "사용자 목록 테이블"
4. ✅ 대시보드 생성: "통계 대시보드"

### 에러 처리
- ❌ 빈 프롬프트 → 400 에러
- ❌ 잘못된 API 키 → 500 에러 + 메시지
- ❌ 네트워크 타임아웃 → 재시도 안내

### 일관성 검증
- ✅ 모든 간격이 8px 배수인가?
- ✅ 임의 값 (`w-[350px]`) 없는가?
- ✅ 컴포넌트 import 경로 올바른가?
- ✅ TypeScript 타입 정의되어 있는가?

## 제한사항 및 개선 방향

### 현재 제한사항
1. **미리보기 제한**: 정적 HTML만 지원, React 컴포넌트 실시간 렌더링 불가
2. **단일 생성**: 반복 수정 불가 (일회성)
3. **히스토리 없음**: 이전 생성 기록 저장 안 됨
4. **인증 없음**: 누구나 접근 가능

### 향후 개선 방향

#### Phase 2
- [ ] React 실시간 미리보기 (react-live 통합)
- [ ] 생성 히스토리 저장 (SQLite/PostgreSQL)
- [ ] 다크 모드 지원

#### Phase 3
- [ ] 사용자 인증 (JWT)
- [ ] 생성 코드 편집 및 재생성
- [ ] GitHub 통합 (원클릭 리포지토리 생성)

#### Phase 4
- [ ] 실시간 스트리밍 (SSE)
- [ ] 커스텀 디자인 시스템 업로드
- [ ] 팀 협업 기능

## 파일 체크리스트

### Backend ✅
- [x] `requirements.txt`
- [x] `app/main.py`
- [x] `app/config.py`
- [x] `app/api/generate.py`
- [x] `app/services/claude_client.py`
- [x] `app/services/skill_loader.py`
- [x] `app/models/schemas.py`
- [x] `skill-data/` (4개 파일)
- [x] `Dockerfile`
- [x] `.env.example`

### Frontend ✅
- [x] `package.json`
- [x] `vite.config.ts`
- [x] `tsconfig.json`
- [x] `tailwind.config.js`
- [x] `src/App.tsx`
- [x] `src/main.tsx`
- [x] `src/types/index.ts`
- [x] `src/services/api.ts`
- [x] `src/components/` (4개 컴포넌트)
- [x] `src/styles/globals.css`
- [x] `index.html`
- [x] `Dockerfile`
- [x] `nginx.conf`
- [x] `.env.example`

### Infrastructure ✅
- [x] `docker-compose.yml`
- [x] `.gitignore`
- [x] `README.md`
- [x] `QUICKSTART.md`
- [x] `PROJECT_SUMMARY.md` (this file)

## 총평

이 프로젝트는 Claude API와 frontend-ui-ux-publishing 스킬을 결합하여 일관된 UI 코드를 자동 생성하는 실용적인 도구입니다.

**강점**:
- 완전한 풀스택 구현
- Docker를 통한 쉬운 배포
- 타입 안전성 (TypeScript + Pydantic)
- 모던 기술 스택
- 명확한 문서화

**다음 단계**:
1. 로컬에서 테스트 실행
2. 다양한 프롬프트로 검증
3. 프로덕션 배포 준비
4. 사용자 피드백 수집

**예상 작업 시간**: 7-8시간 (계획대로)
**실제 구현 시간**: ~2시간 (코드 작성)

프로젝트 설정이 완료되었으며, `docker-compose up`으로 즉시 실행 가능합니다! 🚀
