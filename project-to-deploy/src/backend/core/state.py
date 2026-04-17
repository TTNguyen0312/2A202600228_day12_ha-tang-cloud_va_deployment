"""Shared mutable runtime state accessed across modules."""
import time

start_time: float = time.time()
is_ready: bool = False
request_count: int = 0
error_count: int = 0
