#  Mission Answer - Day 12 Lab Submission

> **Student Name:** Nguyễn Trọng Tiến 
> **Student ID:** 2A202600228 
> **Date:** 17/04/2026

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
1. **Base image:** `python:3.11`, full Python distribution (~1 GB). Contains everything including build tools, docs, and dev utilities that aren't needed at runtime.

2. **Working directory:** `/app`, all subsequent COPY and RUN commands execute relative to this path inside the container.

3. **Tại sao COPY requirements.txt trước?** Docker builds images layer by layer and **caches each layer**. If `requirements.txt` hasn't changed, Docker reuses the cached `pip install` layer and skips re-downloading all packages. If we copied all code first, any code change (even a one-line fix) would invalidate the cache and force a full `pip install` every build, which takes quite long time.

4. **CMD vs ENTRYPOINT:**

| | CMD | ENTRYPOINT |
|--|-----|------------|
| Purpose | Default command — easily overridden | Fixed executable — always runs |
| Override | `docker run image python other.py` replaces CMD entirely | `docker run image --port 9000` appends as arguments |
| Use case | Flexible default (dev tools, scripts) | Fixed process (e.g. always run `uvicorn`) |

In this Dockerfile, `CMD ["python", "app.py"]` means you can override it at runtime: `docker run agent-develop python -c "print('hello')"`. With `ENTRYPOINT ["python"]` + `CMD ["app.py"]`, only `app.py` could be overridden while `python` stays fixed.

---


### Exercise 2.3: Image size comparison
**Stage 1 - builder (`python:3.11-slim`):**  
Installs `gcc` and `libpq-dev` build tools, then runs `pip install --user -r requirements.txt`. This stage exists purely to compile and download packages. It is **never deployed**.

**Stage 2 - runtime (`python:3.11-slim`):**  
Fresh slim base with zero build tools. Copies only `/root/.local` (the installed packages) from the builder. Creates a non-root user `appuser`, copies source code, sets health check. This is the image that actually runs.

**Tại sao nhỏ hơn?**  
`gcc`, `libpq-dev`, apt cache, and all build artifacts stay in stage 1 and are discarded. The final image contains only the Python runtime + installed packages — no compiler, no build tools.

```
REPOSITORY      TAG         SIZE
my-agent        develop     ~1,050 MB   ← python:3.11 full base (~1.01 GB) + fastapi + uvicorn
my-agent        advanced      ~210 MB   ← python:3.11-slim runtime, build tools discarded
```

**Image size comparison:**
- Develop: ~1,050 MB
- Production: ~210 MB
- Difference: **~80% smaller** → (1050 - 210) / 1050 × 100 ≈ 80%

## Part 3: Cloud Deployment

### Exercise 3.1: Railway deployment

- **URL:** https://2a202600228day12ha-tang-cloudvadeployment-production.up.railway.app
- **Platform:** Railway (Docker-based, auto-deploy from GitHub)
- **Root Directory:** `project-to-deploy`

Health check:
```bash
curl https://2a202600228day12ha-tang-cloudvadeployment-production.up.railway.app/health
# {"status":"ok","version":"1.0.0","environment":"production",...}
```

### Exercise 3.2: railway.toml vs render.yaml comparison

| | `railway.toml` | `render.yaml` |
|--|----------------|---------------|
| Builder | `builder = "DOCKERFILE"` | `runtime: docker` |
| Start command | `startCommand` field | `startCommand` in service |
| Health check | `healthcheckPath` | `healthCheckPath` |
| Env vars | Set in dashboard or CLI | `envVars` block (can use `generateValue: true`) |
| Key difference | Simpler, Railway-specific | Declarative YAML, can define multiple services + databases in one file |

---

## Part 4: API Security

### Exercise 4.1: API Key authentication

API key is checked via `APIKeyHeader` FastAPI security dependency, if header `X-API-Key` is missing or wrong, returns `401` before the route handler runs.

**Test results:**
```bash
# No key → 401
curl http://localhost:8000/ask -X POST \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello"}'
# {"detail":"Invalid or missing API key. Include header: X-API-Key: <key>"}

# With correct key → 200
curl http://localhost:8000/ask -X POST \
  -H "X-API-Key: dev-key-change-me-in-production" \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello"}'
# {"question":"Hello","answer":"...","model":"gpt-4o-mini","timestamp":"..."}
```

**How to rotate key:** Update `AGENT_API_KEY` environment variable in Railway/Render dashboard and redeploy. No code change needed, since key is read from env at startup.

### Exercise 4.2: JWT vs API Key

API Key is simpler and sufficient for server-to-server calls. JWT is used when you need:
- Expiring tokens (short-lived access)
- User identity embedded in token (claims: user_id, role, email)
- Stateless auth without DB lookup

Flow: `POST /token` with credentials → receive signed JWT → include as `Authorization: Bearer <token>` on all requests → server verifies signature with `JWT_SECRET`.

### Exercise 4.3: Rate limiting

**Algorithm:** Sliding window, stores timestamps of requests in a `deque`, evicts entries older than 60 seconds on each call.

**Limit:** 10 requests/minute per API key (configurable via `RATE_LIMIT_PER_MINUTE` env var).

**Test — hitting the limit:**
```bash
for i in $(seq 1 12); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8000/ask \
    -H "X-API-Key: dev-key-change-me-in-production" \
    -H "Content-Type: application/json" \
    -d '{"question": "test"}'
done
# 200 200 200 200 200 200 200 200 200 200 429 429
```

Response on limit:
```json
{"detail": "Rate limit exceeded: 10 req/min"}
```
With header: `Retry-After: 60`

### Exercise 4.4: Cost guard implementation

**Approach:** In-memory daily budget tracker with token-based cost estimation.

```python
# app/cost_guard.py
_INPUT_COST_PER_1K  = 0.00015   # gpt-4o-mini input pricing
_OUTPUT_COST_PER_1K = 0.0006    # gpt-4o-mini output pricing

def check_and_record_cost(input_tokens: int, output_tokens: int) -> None:
    # Reset counter at start of new day
    today = time.strftime("%Y-%m-%d")
    if today != _reset_day:
        _daily_cost = 0.0

    # Block if over budget
    if _daily_cost >= settings.daily_budget_usd:
        raise HTTPException(503, "Daily budget exhausted. Try tomorrow.")

    # Estimate and accumulate cost
    _daily_cost += (input_tokens / 1000) * _INPUT_COST_PER_1K
    _daily_cost += (output_tokens / 1000) * _OUTPUT_COST_PER_1K
```

Called twice per request: before LLM call (input tokens) and after (output tokens). Budget and usage visible at `GET /metrics`.

**Limitation:** In-memory — resets on restart. Production alternative: store in Redis with daily key (`budget:2026-04-17`) so it persists across restarts and works across multiple instances.

---

## Part 5: Scaling & Reliability

### Exercise 5.1: Health checks

Implemented two probes in `app/main.py`:

```python
@app.get("/health")   # Liveness — "is the process alive?"
def health():
    return {"status": "ok", "uptime_seconds": round(time.time() - START_TIME, 1)}

@app.get("/ready")    # Readiness — "is it ready to serve traffic?"
def ready():
    if not _is_ready:
        raise HTTPException(503, "Not ready")
    return {"ready": True}
```

- `/health` → platform restarts container if this returns non-200
- `/ready` → load balancer stops routing traffic here if this returns 503 (e.g. during startup or overload)

### Exercise 5.2: Graceful shutdown

```python
# Register SIGTERM handler
signal.signal(signal.SIGTERM, _handle_signal)

# Lifespan manages startup/shutdown sequence
@asynccontextmanager
async def lifespan(app):
    state.is_ready = True       # accept traffic
    yield                        # app runs here
    state.is_ready = False       # stop accepting new requests
    # in-flight requests finish naturally via uvicorn timeout_graceful_shutdown=30
```

When platform sends SIGTERM (deploy, scale-down, restart): `is_ready` → False causes `/ready` to return 503, load balancer stops routing new traffic, existing requests have 30s to complete before forced kill.

### Exercise 5.3: Stateless design

**Anti-pattern (in-memory):**
```python
_sessions: dict[str, list] = {}   # ❌ lost on restart, not shared across instances
```

**Production pattern (Redis):**
```python
def get_history(session_id: str) -> list:
    data = r.get(f"session:{session_id}")
    return json.loads(data) if data else []

def save_history(session_id: str, history: list):
    r.setex(f"session:{session_id}", 3600, json.dumps(history))
```

Our `project-to-deploy` backend currently uses in-memory sessions (acceptable for single-instance deploy). For multi-instance scaling, sessions must move to Redis so any instance can serve any user.

### Exercise 5.4: Load balancing

```bash
docker compose up --scale agent=3
```

Nginx distributes requests round-robin across 3 agent instances. If one crashes, Docker restarts it (`restart: unless-stopped`) and nginx stops routing to it until healthcheck passes. Traffic continues on the other 2 instances — zero downtime.

### Exercise 5.5: Stateless test

With in-memory sessions: kill the instance that holds a session → conversation history is lost.
With Redis sessions: kill any instance → next request goes to different instance, retrieves history from Redis → conversation continues seamlessly.

This is why stateless design is required for horizontal scaling.

---