# Day 12 — Deployment: Đưa Agent Lên Cloud

---

## Running the Projects

This repo contains two runnable projects. They serve different purposes — read the difference before running.

---

### 1. `deliverable/` — Lab Submission (Mock LLM, no API key needed)

A standalone production-ready backend demonstrating all Day 12 concepts: auth, rate limiting, cost guard, health checks, graceful shutdown. Uses a mock LLM so it runs without any API key.

```bash
cd deliverable
cp .env.example .env          # no secrets needed, defaults work
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Or with Docker:
```bash
cd deliverable
cp .env.example .env
docker compose up --build
```

Test it:

```bash
# bash / Git Bash / WSL

# Health check (no auth)
curl http://localhost:8000/health

# Ask endpoint (requires API key)
curl -X POST http://localhost:8000/ask \
  -H "X-API-Key: dev-key-change-me-in-production" \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello"}'

# No key → 401
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello"}'

# Exceed rate limit → 429 (run 11+ times)
for i in $(seq 1 12); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8000/ask \
    -H "X-API-Key: dev-key-change-me-in-production" \
    -H "Content-Type: application/json" \
    -d '{"question": "test"}'
done
```

```powershell
# PowerShell

# Health check (no auth)
Invoke-RestMethod http://localhost:8000/health

# Ask endpoint (requires API key)
Invoke-RestMethod `
  -Method POST `
  -Uri "http://localhost:8000/ask" `
  -Headers @{ "X-API-Key" = "dev-key-change-me-in-production"; "Content-Type" = "application/json" } `
  -Body '{"question": "Hello"}'

# No key → 401
Invoke-RestMethod `
  -Method POST `
  -Uri "http://localhost:8000/ask" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"question": "Hello"}'

# Exceed rate limit → 429 (run 11+ times)
1..12 | ForEach-Object {
  try {
    Invoke-RestMethod `
      -Method POST `
      -Uri "http://localhost:8000/ask" `
      -Headers @{ "X-API-Key" = "dev-key-change-me-in-production"; "Content-Type" = "application/json" } `
      -Body '{"question": "test"}' | Out-Null
    Write-Host "200"
  } catch {
    Write-Host $_.Exception.Response.StatusCode.value__
  }
}
```

---

### 2. `project-to-deploy/` — Real Vinmec App (Frontend + Backend, needs OpenAI key)

The full MedRoute AI healthcare triage application. Frontend (React + Vite) and backend (FastAPI + LangGraph) are separate services that communicate via REST API.

**Run both together locally:**
```bash
cd project-to-deploy
# Make sure src/backend/.env exists with your OPENAI_API_KEY
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |

**Run backend only:**
```bash
cd project-to-deploy/src/backend
pip install -r requirements.txt
cp .env.example .env   # fill in OPENAI_API_KEY
uvicorn src.backend.main:app --reload
```

**Run frontend only:**
```bash
cd project-to-deploy/src/frontend/vinmec-patientguide
npm install
# Make sure .env has VITE_API_BASE_URL and VITE_API_KEY
npm run dev
```

### Health Check
```bash
# bash / Git Bash / WSL
curl https://2a202600228day12ha-tang-cloudvadeployment-production.up.railway.app/health
# Expected: {"status": "ok"}
```

```powershell
# PowerShell
Invoke-RestMethod https://2a202600228day12ha-tang-cloudvadeployment-production.up.railway.app/health
```

### API Test (with authentication)
```bash
# bash / Git Bash / WSL
curl -X POST https://2a202600228day12ha-tang-cloudvadeployment-production.up.railway.app/api/agent/chat \
  -H "X-API-Key: dev-key-local" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test", "message": "Hello"}'
```

```powershell
# PowerShell
Invoke-RestMethod `
  -Method POST `
  -Uri "https://2a202600228day12ha-tang-cloudvadeployment-production.up.railway.app/api/agent/chat" `
  -Headers @{ "X-API-Key" = "dev-key-local"; "Content-Type" = "application/json" } `
  -Body '{"session_id": "test", "message": "Hello"}'
```
---

### Key Differences

| | `deliverable/` | `project-to-deploy/` |
|--|---------------|----------------------|
| Purpose | Lab submission demonstrating Day 12 patterns | Real full-stack healthcare triage app |
| LLM | Mock (no API key) | Real OpenAI via LangGraph agent |
| Frontend | None | React + Vite on port 5173 |
| Backend | FastAPI + mock LLM | FastAPI + LangGraph + OpenAI |
| Deployment | Single Railway service | Two Railway services (frontend + backend) |
| API key needed | No | Yes — `OPENAI_API_KEY` required |

---

> **AICB-P1 · VinUniversity 2026**  
> Repository thực hành đi kèm bài giảng Day 12.  
> Mỗi phần có ví dụ **cơ bản** (hiểu concept) và **chuyên sâu** (production-ready).

---

## Cấu Trúc Project

```
day12_ha-tang-cloud_va_deployment/
├── 01-localhost-vs-production/     # Section 1: Dev ≠ Production
│   ├── develop/                      #   Agent "đúng kiểu localhost"
│   └── production/                   #   12-Factor compliant agent
│
├── 02-docker/                      # Section 2: Containerization
│   ├── develop/                      #   Dockerfile đơn giản
│   └── production/                   #   Multi-stage + Docker Compose stack
│
├── 03-cloud-deployment/            # Section 3: Cloud Options
│   ├── railway/                    #   Deploy Railway (< 5 phút)
│   ├── render/                     #   Deploy Render + render.yaml
│   └── production-cloud-run/         #   GCP Cloud Run + CI/CD
│
├── 04-api-gateway/                 # Section 4: Security
│   ├── develop/                      #   API Key authentication
│   └── production/                   #   JWT + Rate Limiting + Cost Guard
│
├── 05-scaling-reliability/         # Section 5: Scale & Reliability
│   ├── develop/                      #   Health check + graceful shutdown
│   └── production/                   #   Stateless + Redis + Nginx LB
│
├── 06-lab-complete/                # Lab 12: Production-ready agent
│   └── (full project kết hợp tất cả)
│
└── utils/                          # Mock LLM dùng chung (không cần API key)
```

---

## 🚀 Bắt Đầu Nhanh

**Muốn thử ngay?** → [QUICK_START.md](QUICK_START.md) (5 phút)

**Muốn học kỹ?** → [CODE_LAB.md](CODE_LAB.md) (3-4 giờ)

## Cách Học

| Bước | Làm gì |
|------|--------|
| 0 | **[Khuyến nghị]** Đọc [QUICK_START.md](QUICK_START.md) để thử nhanh |
| 1 | Đọc [CODE_LAB.md](CODE_LAB.md) để hiểu chi tiết |
| 2 | Chạy ví dụ **basic** trước — hiểu concept |
| 3 | So sánh với ví dụ **advanced** — thấy sự khác biệt |
| 4 | Tự làm Lab 06 từ đầu trước khi xem solution |
| 5 | Tham khảo [QUICK_REFERENCE.md](QUICK_REFERENCE.md) khi cần |
| 6 | Xem [TROUBLESHOOTING.md](TROUBLESHOOTING.md) khi gặp lỗi |

---

## Yêu Cầu

```bash
python 3.11+
docker & docker compose
```

Mỗi folder có `requirements.txt` riêng. Không cần API key thật — các ví dụ dùng **mock LLM** để chạy offline.

---

## Sections

| # | Folder | Concept chính |
|---|--------|--------------|
| 1 | `01-localhost-vs-production` | Dev/prod gap, 12-factor, secrets |
| 2 | `02-docker` | Dockerfile, multi-stage, docker-compose |
| 3 | `03-cloud-deployment` | Railway, Render, Cloud Run |
| 4 | `04-api-gateway` | Auth, rate limiting, cost protection |
| 5 | `05-scaling-reliability` | Health check, stateless, rolling deploy |
| 6 | `06-lab-complete` | **Full production agent** |

---

## 📚 Lab Materials

Chúng tôi đã chuẩn bị đầy đủ tài liệu hướng dẫn:

### Cho Sinh Viên

| Tài liệu | Mô tả | Thời gian |
|----------|-------|-----------|
| **[CODE_LAB.md](CODE_LAB.md)** | Hướng dẫn lab chi tiết từng bước | 3-4 giờ |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Cheat sheet các lệnh và patterns | Tra cứu |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Giải quyết lỗi thường gặp | Khi cần |

### Cho Giảng Viên

| Tài liệu | Mô tả |
|----------|-------|
| **[INSTRUCTOR_GUIDE.md](INSTRUCTOR_GUIDE.md)** | Hướng dẫn chấm điểm và đánh giá |

### Cách Sử Dụng

1. **Trước lab:** Đọc [CODE_LAB.md](CODE_LAB.md) để hiểu tổng quan
2. **Trong lab:** Làm theo từng Part, tham khảo [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
3. **Gặp lỗi:** Xem [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
4. **Sau lab:** Nộp Part 6 Final Project để chấm điểm
