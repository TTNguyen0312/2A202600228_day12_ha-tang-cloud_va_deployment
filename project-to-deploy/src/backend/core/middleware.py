"""HTTP request middleware — logging, security headers, counters."""
import json
import logging
import time

from fastapi import Request, Response

import src.backend.core.state as state

logger = logging.getLogger(__name__)


async def request_middleware(request: Request, call_next):
    start = time.time()
    state.request_count += 1
    try:
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        if "server" in response.headers:
            del response.headers["server"]
        logger.info(json.dumps({
            "event": "request",
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "ms": round((time.time() - start) * 1000, 1),
        }))
        return response
    except Exception:
        state.error_count += 1
        raise
