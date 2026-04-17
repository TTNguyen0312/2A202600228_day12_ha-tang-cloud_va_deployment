"""Operational endpoints: root info, health, readiness, metrics."""
import time
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

import src.backend.core.state as state
from src.backend.core.auth import verify_api_key
from src.backend.core.cost import get_daily_cost
from src.backend.config import settings

router = APIRouter(tags=["Operations"])


@router.get("/")
def root():
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }


@router.get("/health")
def health():
    """Liveness probe — platform restarts container if this fails."""
    return {
        "status": "ok",
        "version": settings.app_version,
        "environment": settings.environment,
        "uptime_seconds": round(time.time() - state.start_time, 1),
        "total_requests": state.request_count,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/ready")
def ready():
    """Readiness probe — load balancer stops routing here if not ready."""
    if not state.is_ready:
        raise HTTPException(503, "Not ready")
    return {"ready": True}


@router.get("/metrics")
def metrics(_key: str = Depends(verify_api_key)):
    """Basic metrics — protected by API key."""
    daily_cost = get_daily_cost()
    return {
        "uptime_seconds": round(time.time() - state.start_time, 1),
        "total_requests": state.request_count,
        "error_count": state.error_count,
        "daily_cost_usd": round(daily_cost, 4),
        "daily_budget_usd": settings.daily_budget_usd,
        "budget_used_pct": round(daily_cost / settings.daily_budget_usd * 100, 1),
    }
