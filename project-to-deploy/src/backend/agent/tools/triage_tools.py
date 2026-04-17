from __future__ import annotations

import json
import re
import unicodedata

from langchain_core.tools import tool
from src.backend.agent.helpers.data_loader import DATA_DIR, parse_js_export

# Load departments from the data file once at import time
_DEPARTMENTS: list[dict] = parse_js_export(DATA_DIR / "departments.js")



def _strip_accents(text: str) -> str:
    text = text.replace("đ", "d").replace("Đ", "D")
    normalized = unicodedata.normalize("NFD", text)
    return "".join(char for char in normalized if unicodedata.category(char) != "Mn")


def _normalize(text: str) -> str:
    lowered = _strip_accents(text).lower()
    lowered = re.sub(r"[^a-z0-9\s]", " ", lowered)
    return " ".join(lowered.split())


def _has_phrase(normalized_text: str, phrase: str) -> bool:
    normalized_phrase = _normalize(phrase)
    if not normalized_phrase:
        return False

    pattern = re.compile(rf"\b{re.escape(normalized_phrase)}\b")
    if not pattern.search(normalized_text):
        return False

    for negative_prefix in ("khong", "chua", "ko"):
        negative_pattern = re.compile(
            rf"\b{negative_prefix}\s+{re.escape(normalized_phrase)}\b"
        )
        if negative_pattern.search(normalized_text):
            return False

    return True




def _find_department_by_keyword(keyword: str) -> dict | None:
    """Search _DEPARTMENTS by exact keyword or exact name/slug match."""
    nk = _normalize(keyword)
    for dept in _DEPARTMENTS:
        if any(nk == _normalize(kw) for kw in dept.get("keywords", [])):
            return dept
        if nk == _normalize(dept["name"]) or nk == _normalize(dept.get("slug", "")):
            return dept
    return None


@tool
def lookup_specialty_info(specialty: str) -> str:
    """
    Tra cứu thông tin đầy đủ của một chuyên khoa dựa trên từ khóa triệu chứng hoặc tên khoa.

    Tìm kiếm theo keyword trong danh sách departments và trả về toàn bộ thông tin
    của khoa phù hợp nhất (mô tả, triệu chứng thường gặp, giờ làm việc, liên hệ, v.v.).
    """
    if not specialty.strip():
        names = ", ".join(d["name"] for d in _DEPARTMENTS)
        return f"Vui lòng cung cấp từ khóa hoặc tên chuyên khoa. Các khoa hiện có: {names}."

    dept = _find_department_by_keyword(specialty)
    if dept is None:
        names = ", ".join(d["name"] for d in _DEPARTMENTS)
        return (
            f"Không tìm thấy chuyên khoa phù hợp với '{specialty}'. "
            f"Các khoa hiện có: {names}."
        )

    return json.dumps(dept, ensure_ascii=False)


# if __name__ == "__main__":
#     import sys
#     sys.stdout.reconfigure(encoding="utf-8")

#     SEP = "-" * 60

#     def run(label: str, result: str) -> None:
#         print(f"\n{'=' * 60}")
#         print(f"  {label}")
#         print(SEP)
#         print(result)

#     # ── lookup_specialty_info ────────────────────────────────────
#     run(
#         "lookup_specialty_info: 'thần kinh'",
#         lookup_specialty_info.invoke({"specialty": "thần kinh"}),
#     )
#     run(
#         "lookup_specialty_info: 'tai mũi họng'",
#         lookup_specialty_info.invoke({"specialty": "tai mũi họng"}),
#     )
#     run(
#         "lookup_specialty_info: 'mắt'",
#         lookup_specialty_info.invoke({"specialty": "mắt"}),
#     )
#     run(
#         "lookup_specialty_info: không tìm thấy",
#         lookup_specialty_info.invoke({"specialty": "răng hàm mặt"}),
#     )
