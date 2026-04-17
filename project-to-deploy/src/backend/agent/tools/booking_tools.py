from __future__ import annotations

import json
from datetime import datetime, timezone

from langchain_core.tools import tool
from src.backend.agent.helpers.data_loader import DATA_DIR, parse_js_export

# Load once at import time
DEPARTMENTS: list[dict] = parse_js_export(DATA_DIR / "departments.js")
DOCTORS: list[dict] = parse_js_export(DATA_DIR / "doctors.js")

# Day index: Python weekday() → schedule key
_DAY_KEY = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

# Helpers 


def _fresh_appointments() -> list[dict]:
    """Re-parse appointments.js each call so writes are immediately visible."""
    return parse_js_export(DATA_DIR / "appointments.js")


def _booked_times(doctor_id: str, date: str) -> set[str]:
    """Return time strings already booked for a doctor on a specific date."""
    active = {"confirmed", "pending"}
    return {
        apt["time"]
        for apt in _fresh_appointments()
        if apt.get("doctorId") == doctor_id
        and apt.get("date") == date
        and apt.get("status") in active
    }


def _append_to_appointments_js(apt: dict) -> None:
    """Append a new appointment object to appointments.js."""
    path = DATA_DIR / "appointments.js"
    raw = path.read_text(encoding="utf-8")
    block = json.dumps(apt, ensure_ascii=False, indent=2)
    # Indent every line 2 spaces to match the file's array indentation
    indented = "\n".join("  " + line for line in block.splitlines())
    # Insert before the closing ];
    insert_pos = raw.rfind("];")
    raw = raw[:insert_pos] + indented + ",\n" + raw[insert_pos:]
    path.write_text(raw, encoding="utf-8")


def _next_apt_id() -> str:
    apts = _fresh_appointments()
    nums = []
    for a in apts:
        parts = a.get("id", "").split("-")
        if len(parts) == 2 and parts[0] == "apt" and parts[1].isdigit():
            nums.append(int(parts[1]))
    return f"apt-{(max(nums, default=0) + 1):03d}"


# ── Tools ─────────────────────────────────────────────────────────────────────


@tool
def look_up_doctors_by_department(department_id: str) -> str:
    """
    Tra cứu tất cả bác sĩ thuộc một khoa dựa trên department ID.

    Trả về danh sách đầy đủ các bác sĩ đang hoạt động dưới dạng JSON.

    Args:
        department_id: ID của khoa (ví dụ: 'dept-than-kinh', 'dept-tim-mach').
    """
    if not department_id.strip():
        ids = ", ".join(d["id"] for d in DEPARTMENTS)
        return f"Vui lòng cung cấp department_id. Các ID hiện có: {ids}."

    dept = next((d for d in DEPARTMENTS if d["id"] == department_id.strip()), None)
    if dept is None:
        ids = ", ".join(d["id"] for d in DEPARTMENTS)
        return (
            f"Không tìm thấy khoa với ID '{department_id}'. "
            f"Các ID hiện có: {ids}."
        )

    doctors = [d for d in DOCTORS if d["departmentId"] == dept["id"] and d.get("isAvailable")]
    return json.dumps(doctors, ensure_ascii=False)


@tool
def look_up_free_schedule(doctor_id: str, date: str) -> str:
    """
    Tra cứu các khung giờ còn trống của một bác sĩ vào một ngày cụ thể.

    Lấy lịch làm việc từ doctors.js, loại bỏ các slot đã được đặt
    (confirmed/pending) trong appointments.js cho ngày đó.
    Trả về JSON.

    Args:
        doctor_id: ID bác sĩ (ví dụ: 'doc-004').
        date:      Ngày khám theo định dạng YYYY-MM-DD (ví dụ: '2026-04-15').
    """
    if not doctor_id.strip() or not date.strip():
        return json.dumps({"error": "Vui lòng cung cấp doctor_id và date."})

    doc = next((d for d in DOCTORS if d["id"] == doctor_id.strip()), None)
    if doc is None:
        return json.dumps({"error": f"Không tìm thấy bác sĩ với ID '{doctor_id}'."}, ensure_ascii=False)

    try:
        day_index = datetime.strptime(date.strip(), "%Y-%m-%d").weekday()
    except ValueError:
        return json.dumps({"error": f"Định dạng ngày không hợp lệ '{date}'. Dùng YYYY-MM-DD."})

    day_key = _DAY_KEY[day_index]
    all_slots: list[str] = doc.get("schedule", {}).get(day_key, [])

    if not all_slots:
        return json.dumps({
            "doctorId": doc["id"],
            "doctorName": doc["name"],
            "departmentId": doc["departmentId"],
            "date": date,
            "dayOfWeek": day_key,
            "availableSlots": [],
            "note": "Bác sĩ không làm việc vào ngày này.",
        }, ensure_ascii=False)

    if all_slots == ["00:00"]:
        return json.dumps({
            "doctorId": doc["id"],
            "doctorName": doc["name"],
            "departmentId": doc["departmentId"],
            "date": date,
            "dayOfWeek": day_key,
            "availableSlots": "24/7",
            "note": "Khoa Cấp cứu luôn tiếp nhận.",
        }, ensure_ascii=False)

    already_booked = _booked_times(doc["id"], date)
    free_slots = [s for s in all_slots if s not in already_booked]

    return json.dumps({
        "doctorId": doc["id"],
        "doctorName": doc["name"],
        "departmentId": doc["departmentId"],
        "date": date,
        "dayOfWeek": day_key,
        "availableSlots": free_slots,
        "bookedSlots": sorted(already_booked),
    }, ensure_ascii=False)


@tool
def book_appointment(date: str, time: str, department_id: str, doctor_id: str) -> str:
    """
    Đặt lịch hẹn khám bệnh và ghi vào appointments.js.

    Kiểm tra bác sĩ tồn tại, khoa hợp lệ, và slot còn trống trước khi đặt.
    Trả về JSON của lịch hẹn vừa tạo.

    Args:
        date:          Ngày khám theo định dạng YYYY-MM-DD (ví dụ: '2026-04-15').
        time:          Giờ khám theo định dạng HH:MM (ví dụ: '09:00').
        department_id: ID khoa (ví dụ: 'dept-than-kinh').
        doctor_id:     ID bác sĩ (ví dụ: 'doc-004').
    """
    # Validate inputs
    doc = next((d for d in DOCTORS if d["id"] == doctor_id.strip()), None)
    if doc is None:
        return json.dumps({"error": f"Không tìm thấy bác sĩ với ID '{doctor_id}'."}, ensure_ascii=False)

    dept = next((d for d in DEPARTMENTS if d["id"] == department_id.strip()), None)
    if dept is None:
        return json.dumps({"error": f"Không tìm thấy khoa với ID '{department_id}'."}, ensure_ascii=False)

    if doc["departmentId"] != dept["id"]:
        return json.dumps({
            "error": f"Bác sĩ '{doc['name']}' không thuộc khoa '{dept['name']}'."
        }, ensure_ascii=False)

    try:
        day_index = datetime.strptime(date.strip(), "%Y-%m-%d").weekday()
    except ValueError:
        return json.dumps({"error": f"Định dạng ngày không hợp lệ '{date}'. Dùng YYYY-MM-DD."}, ensure_ascii=False)

    day_key = _DAY_KEY[day_index]
    all_slots: list[str] = doc.get("schedule", {}).get(day_key, [])

    if time not in all_slots and all_slots != ["00:00"]:
        return json.dumps({
            "error": f"Bác sĩ không có khung giờ '{time}' vào {day_key} ({date}).",
            "availableSlots": all_slots,
        }, ensure_ascii=False)

    already_booked = _booked_times(doctor_id, date)
    if time in already_booked:
        return json.dumps({
            "error": f"Khung giờ '{time}' ngày {date} đã được đặt.",
            "bookedSlots": sorted(already_booked),
        }, ensure_ascii=False)

    # Build appointment object
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+07:00")
    apt = {
        "id": _next_apt_id(),
        "patientId": None,
        "doctorId": doc["id"],
        "departmentId": dept["id"],
        "branchId": doc.get("branchId", "branch-hn-1"),
        "date": date.strip(),
        "time": time.strip(),
        "endTime": None,
        "status": "confirmed",
        "source": "ai_triage",
        "symptoms": None,
        "consultationFee": doc.get("consultationFee", 0),
        "notes": "",
        "createdAt": now,
        "updatedAt": now,
    }

    _append_to_appointments_js(apt)
    return json.dumps(apt, ensure_ascii=False)


# if __name__ == "__main__":
#     import sys
#     sys.stdout.reconfigure(encoding="utf-8")

#     SEP = "-" * 60

#     def run(label: str, result: str) -> None:
#         print(f"\n{'=' * 60}")
#         print(f"  {label}")
#         print(SEP)
#         print(result)

#     # ── look_up_doctors_by_department ─────────────────────────────
#     run(
#         "look_up_doctors_by_department: 'dept-than-kinh'",
#         look_up_doctors_by_department.invoke({"department_id": "dept-than-kinh"}),
#     )
#     run(
#         "look_up_doctors_by_department: ID không hợp lệ",
#         look_up_doctors_by_department.invoke({"department_id": "dept-xyz"}),
#     )

#     # ── look_up_free_schedule ─────────────────────────────────────
#     run(
#         "look_up_free_schedule: doc-004 ngày 2026-04-13 (Thứ 2)",
#         look_up_free_schedule.invoke({"doctor_id": "doc-004", "date": "2026-04-13"}),
#     )
#     run(
#         "look_up_free_schedule: ngày bác sĩ nghỉ (Thứ 4 doc-004)",
#         look_up_free_schedule.invoke({"doctor_id": "doc-004", "date": "2026-04-15"}),
#     )
#     run(
#         "look_up_free_schedule: ID không hợp lệ",
#         look_up_free_schedule.invoke({"doctor_id": "doc-999", "date": "2026-04-13"}),
#     )

#     # ── book_appointment ──────────────────────────────────────────
#     run(
#         "book_appointment: đặt lịch hợp lệ",
#         book_appointment.invoke({
#             "date": "2026-04-13",
#             "time": "08:00",
#             "department_id": "dept-than-kinh",
#             "doctor_id": "doc-004",
#         }),
#     )
#     run(
#         "book_appointment: slot đã đặt",
#         book_appointment.invoke({
#             "date": "2026-04-13",
#             "time": "08:00",
#             "department_id": "dept-than-kinh",
#             "doctor_id": "doc-004",
#         }),
#     )
#     run(
#         "book_appointment: bác sĩ sai khoa",
#         book_appointment.invoke({
#             "date": "2026-04-13",
#             "time": "08:00",
#             "department_id": "dept-noi",
#             "doctor_id": "doc-004",
#         }),
#     )
