# Quick Start Guide

## 최소 설정으로 5분 만에 시작하기

### 1. API 키 설정 (1분)

```bash
cd ui-generator
cp .env.example .env
```

`.env` 파일을 열고 API 키 입력:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

### 2. Docker로 실행 (2분)

```bash
docker-compose up --build
```

첫 실행시 이미지 빌드에 2-3분 소요됩니다.

### 3. 브라우저에서 접속 (1분)

http://localhost:3000 열기

### 4. 첫 UI 생성! (1분)

1. 텍스트 입력: "로그인 페이지를 만들어주세요"
2. "만들기" 클릭
3. 생성된 코드 확인
4. "코드 다운로드" 클릭

끝! 🎉

---

## Docker 없이 로컬 개발

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# .env에 API 키 입력
uvicorn app.main:app --reload
```

### Frontend (새 터미널)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:8000

---

## 문제 해결

### "ANTHROPIC_API_KEY not set" 에러
→ `.env` 파일에 유효한 API 키가 있는지 확인

### CORS 에러
→ 백엔드가 http://localhost:8000 에서 실행되고 있는지 확인

### Docker 빌드 실패
→ Docker Desktop이 실행 중인지 확인
→ `docker-compose down && docker-compose up --build` 재시도

### 포트 충돌
→ 8000, 3000 포트가 사용 중이면:
```bash
# docker-compose.yml에서 포트 변경
ports:
  - "8080:8000"  # 8000 → 8080
  - "3001:80"    # 3000 → 3001
```

---

## 다음 단계

- 다양한 프롬프트 시도해보기
- 생성된 코드를 프로젝트에 통합
- `backend/skill-data/` 파일 커스터마이징
- 디자인 시스템 규칙 조정

자세한 내용은 [README.md](./README.md)를 참고하세요.
