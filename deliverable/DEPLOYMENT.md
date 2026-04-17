# Deployment Information

## Public URL
Frontend: https://reasonable-solace-production-4d3d.up.railway.app/
Backend: https://2a202600228day12ha-tang-cloudvadeployment-production.up.railway.app/
## Platform
Railway

## Test Commands
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

## Environment Variables Set
- PORT
- OPENAI_API_KEY
- AGENT_API_KEY
- LOG_LEVEL
