"""Agent chat endpoints."""
import json
import logging
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from src.backend.agent.agent import run_turn
from src.backend.core.auth import verify_api_key
from src.backend.core.cost import check_and_record_cost
from src.backend.core.limiter import check_rate_limit

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/agent", tags=["Agent"])

_sessions: dict[str, list] = {}


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: Optional[str] = None
    image: Optional[str] = None  # base64-encoded image


class ChatResponse(BaseModel):
    reply: str
    session_id: str


@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    request: Request,
    _key: str = Depends(verify_api_key),
):
    check_rate_limit(_key[:8])
    check_and_record_cost(len(payload.message.split()) * 2, 0)

    logger.info(json.dumps({
        "event": "agent_chat",
        "msg_len": len(payload.message),
        "client": str(request.client.host) if request.client else "unknown",
    }))

    session_id = payload.session_id or str(uuid.uuid4())
    history = _sessions.get(session_id, [])

    try:
        updated_history = run_turn(payload.message, history, image_b64=payload.image or None)
    except Exception as exc:
        logger.error(json.dumps({"event": "agent_error", "error": str(exc)}))
        raise HTTPException(status_code=500, detail=str(exc))

    _sessions[session_id] = updated_history
    reply = updated_history[-1].content

    check_and_record_cost(0, len(str(reply).split()) * 2)

    return ChatResponse(reply=reply, session_id=session_id)


@router.delete("/chat/{session_id}")
def clear_session(session_id: str, _key: str = Depends(verify_api_key)):
    """Clear conversation history for a session."""
    _sessions.pop(session_id, None)
    return {"cleared": session_id}
