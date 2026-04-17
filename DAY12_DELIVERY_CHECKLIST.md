#  Delivery Checklist — Day 12 Lab Submission

> **Student Name:** _________________________  
> **Student ID:** _________________________  
> **Date:** _________________________

---

##  Submission Requirements

Submit a **GitHub repository** containing:

### 1. Mission Answers (40 points)

Create a file `MISSION_ANSWERS.md` with your answers to all exercises:

# Day 12 Lab - Mission Answers

## Part 1: Localhost vs Production

### Exercise 1.1: Anti-patterns found
1. **Hardcoded API key & database URL** (line 17-18)  
   `OPENAI_API_KEY = "sk-hardcoded-fake-key-never-do-this"` and `DATABASE_URL = "postgresql://admin:password123@localhost:5432/mydb"` are committed directly in source code. Anyone with repo access gets full credentials.

2. **Secrets printed to logs** (line 34)  
   `print(f"[DEBUG] Using key: {OPENAI_API_KEY}")` logs the secret key on every request. In production, logs are often stored and forwarded to third-party services, this exposes credentials.

3. **No config management** (line 21-22)  
   `DEBUG = True` and `MAX_TOKENS = 500` are hardcoded as constants. Values cannot be changed per environment (dev/staging/production) without modifying and redeploying source code.

4. **No health check endpoint** (line 42)  
   Without `GET /health`, platforms like Railway, Kubernetes, or load balancers cannot detect if the app has crashed and needs restarting. A dead app stays in rotation and serves errors.

5. **Hardcoded host, port, and reload=True** (line 51-53)  
   `host="localhost"` makes the app unreachable from outside the machine. `port=8000` ignores the `$PORT` env var injected by cloud platforms. `reload=True` runs the file-watcher in production, wasting CPU and causing unexpected restarts.

### Exercise 1.3: Observation
It runs, but it is not production-ready because:

- The terminal shows [DEBUG] Using key: sk-hardcoded-fake-key-never-do-this — secret leaked in logs
- reload=True is active, file watcher running unnecessarily
- No /health endpoint 
- Bound to localhost only, unreachable from any other machine or cloud platform

### Exercise 1.3: Comparison table

| Feature | Develop | Production | Why Important? |
|---------|--------------------------|-------------------------------|---------------------|
| Config | Hardcoded constants (`OPENAI_API_KEY = "sk-..."`, `DEBUG = True`) | Env vars via `config.py` + `.env` file (`settings.debug`, `settings.port`) | Secrets stay out of source code; values can change per environment without redeployment |
| Health check | Do not have `GET /health` | have `GET /health` (liveness) + `GET /ready` (readiness) | Platform biết khi nào restart container; load balancer không route vào instance chưa sẵn sàng |
| Logging | `print()` text không có cấu trúc, in ra cả secret key | Structured JSON logging (`{"event":"agent_request","question_length":5,...}`) | JSON logs có thể parse bởi Datadog/Loki/Grafana; không log sensitive data |
| Shutdown | Đột ngột SIGTERM kill ngay, request đang xử lý bị mất | Graceful `lifespan` context + `signal.signal(SIGTERM, handle_sigterm)` chờ request hoàn thành | Tránh mất request giữa chừng khi platform deploy version mới hoặc scale down |
| Host binding | `host="localhost"` chỉ nhận kết nối từ chính máy đó | `host=settings.host` = `0.0.0.0` nhận từ mọi network interface | Container/cloud cần `0.0.0.0` để nhận traffic từ bên ngoài |
| Port | Hardcoded `port=8000` | `port=settings.port` đọc từ `$PORT` env var | Railway/Render inject PORT động; hardcode sẽ crash hoặc conflict |
| Reload | `reload=True` luôn bật | `reload=settings.debug` — chỉ bật khi `DEBUG=true` | File watcher trong production tốn CPU và gây restart bất ngờ |

## Part 2: Docker

### Exercise 2.1: Dockerfile questions
1. Base image: [Your answer]
2. Working directory: [Your answer]
...

### Exercise 2.3: Image size comparison
- Develop: [X] MB
- Production: [Y] MB
- Difference: [Z]%

## Part 3: Cloud Deployment

### Exercise 3.1: Railway deployment
- URL: https://your-app.railway.app
- Screenshot: [Link to screenshot in repo]

## Part 4: API Security

### Exercise 4.1-4.3: Test results
[Paste your test outputs]

### Exercise 4.4: Cost guard implementation
[Explain your approach]

## Part 5: Scaling & Reliability

### Exercise 5.1-5.5: Implementation notes
[Your explanations and test results]

---

### 2. Full Source Code - Lab 06 Complete (60 points)

Your final production-ready agent with all files:

```
your-repo/
├── app/
│   ├── main.py              # Main application
│   ├── config.py            # Configuration
│   ├── auth.py              # Authentication
│   ├── rate_limiter.py      # Rate limiting
│   └── cost_guard.py        # Cost protection
├── utils/
│   └── mock_llm.py          # Mock LLM (provided)
├── Dockerfile               # Multi-stage build
├── docker-compose.yml       # Full stack
├── requirements.txt         # Dependencies
├── .env.example             # Environment template
├── .dockerignore            # Docker ignore
├── railway.toml             # Railway config (or render.yaml)
└── README.md                # Setup instructions
```

**Requirements:**
-  All code runs without errors
-  Multi-stage Dockerfile (image < 500 MB)
-  API key authentication
-  Rate limiting (10 req/min)
-  Cost guard ($10/month)
-  Health + readiness checks
-  Graceful shutdown
-  Stateless design (Redis)
-  No hardcoded secrets

---

### 3. Service Domain Link

Create a file `DEPLOYMENT.md` with your deployed service information:

```markdown
# Deployment Information

## Public URL
https://your-agent.railway.app

## Platform
Railway / Render / Cloud Run

## Test Commands

### Health Check
```bash
curl https://your-agent.railway.app/health
# Expected: {"status": "ok"}
```

### API Test (with authentication)
```bash
curl -X POST https://your-agent.railway.app/ask \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "question": "Hello"}'
```

## Environment Variables Set
- PORT
- REDIS_URL
- AGENT_API_KEY
- LOG_LEVEL

## Screenshots
- [Deployment dashboard](screenshots/dashboard.png)
- [Service running](screenshots/running.png)
- [Test results](screenshots/test.png)
```

##  Pre-Submission Checklist

- [ ] Repository is public (or instructor has access)
- [ ] `MISSION_ANSWERS.md` completed with all exercises
- [ ] `DEPLOYMENT.md` has working public URL
- [ ] All source code in `app/` directory
- [ ] `README.md` has clear setup instructions
- [ ] No `.env` file committed (only `.env.example`)
- [ ] No hardcoded secrets in code
- [ ] Public URL is accessible and working
- [ ] Screenshots included in `screenshots/` folder
- [ ] Repository has clear commit history

---

##  Self-Test

Before submitting, verify your deployment:

```bash
# 1. Health check
curl https://your-app.railway.app/health

# 2. Authentication required
curl https://your-app.railway.app/ask
# Should return 401

# 3. With API key works
curl -H "X-API-Key: YOUR_KEY" https://your-app.railway.app/ask \
  -X POST -d '{"user_id":"test","question":"Hello"}'
# Should return 200

# 4. Rate limiting
for i in {1..15}; do 
  curl -H "X-API-Key: YOUR_KEY" https://your-app.railway.app/ask \
    -X POST -d '{"user_id":"test","question":"test"}'; 
done
# Should eventually return 429
```

---

##  Submission

**Submit your GitHub repository URL:**

```
https://github.com/your-username/day12-agent-deployment
```

**Deadline:** 17/4/2026

---

##  Quick Tips

1.  Test your public URL from a different device
2.  Make sure repository is public or instructor has access
3.  Include screenshots of working deployment
4.  Write clear commit messages
5.  Test all commands in DEPLOYMENT.md work
6.  No secrets in code or commit history

---

##  Need Help?

- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Review [CODE_LAB.md](CODE_LAB.md)
- Ask in office hours
- Post in discussion forum

---

**Good luck! **
