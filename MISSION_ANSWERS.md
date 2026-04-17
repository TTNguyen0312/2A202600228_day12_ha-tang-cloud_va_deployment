# Day 12 Lab - Mission Answers

## Part 1: Localhost vs Production

### Exercise 1.1: Anti-patterns found in `01-localhost-vs-production/develop/app.py`

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

### Exercise 1.3: Comparison table — Basic vs Production

| Feature | Basic (`develop/app.py`) | Advanced (`production/app.py`) | Tại sao quan trọng? |
|---------|--------------------------|-------------------------------|---------------------|
| Config | Hardcoded constants (`OPENAI_API_KEY = "sk-..."`, `DEBUG = True`) | Env vars via `config.py` + `.env` file (`settings.debug`, `settings.port`) | Secrets stay out of source code; values can change per environment without redeployment |
| Health check | Không có — `GET /health` trả về 404 | `GET /health` (liveness) + `GET /ready` (readiness) | Platform biết khi nào restart container; load balancer không route vào instance chưa sẵn sàng |
| Logging | `print()` — text không có cấu trúc, in ra cả secret key | Structured JSON logging (`{"event":"agent_request","question_length":5,...}`) | JSON logs có thể parse bởi Datadog/Loki/Grafana; không log sensitive data |
| Shutdown | Đột ngột — SIGTERM kill ngay, request đang xử lý bị mất | Graceful — `lifespan` context + `signal.signal(SIGTERM, handle_sigterm)` chờ request hoàn thành | Tránh mất request giữa chừng khi platform deploy version mới hoặc scale down |
| Host binding | `host="localhost"` — chỉ nhận kết nối từ chính máy đó | `host=settings.host` = `0.0.0.0` — nhận từ mọi network interface | Container/cloud cần `0.0.0.0` để nhận traffic từ bên ngoài |
| Port | Hardcoded `port=8000` | `port=settings.port` đọc từ `$PORT` env var | Railway/Render inject PORT động; hardcode sẽ crash hoặc conflict |
| Reload | `reload=True` luôn bật | `reload=settings.debug` — chỉ bật khi `DEBUG=true` | File watcher trong production tốn CPU và gây restart bất ngờ |
