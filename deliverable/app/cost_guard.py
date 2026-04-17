"""Daily cost guard — tracks token usage against a USD budget."""
import time

from fastapi import HTTPException

from app.config import settings

_INPUT_COST_PER_1K = 0.00015
_OUTPUT_COST_PER_1K = 0.0006

_daily_cost: float = 0.0
_reset_day: str = time.strftime("%Y-%m-%d")


def check_and_record_cost(input_tokens: int, output_tokens: int) -> None:
    global _daily_cost, _reset_day
    today = time.strftime("%Y-%m-%d")
    if today != _reset_day:
        _daily_cost = 0.0
        _reset_day = today
    if _daily_cost >= settings.daily_budget_usd:
        raise HTTPException(503, "Daily budget exhausted. Try tomorrow.")
    _daily_cost += (input_tokens / 1000) * _INPUT_COST_PER_1K
    _daily_cost += (output_tokens / 1000) * _OUTPUT_COST_PER_1K


def get_daily_cost() -> float:
    return _daily_cost
