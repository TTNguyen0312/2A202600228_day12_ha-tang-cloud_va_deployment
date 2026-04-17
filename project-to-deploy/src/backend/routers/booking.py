"""Booking REST endpoints — departments, doctor schedules, appointments."""
import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from src.backend.agent.tools.booking_tools import (
    DEPARTMENTS,
    DOCTORS,
    book_appointment,
    look_up_free_schedule,
)
from src.backend.core.auth import verify_api_key

router = APIRouter(tags=["Booking"])


class BookingRequest(BaseModel):
    date: str = Field(..., min_length=1, max_length=20)
    time: str = Field(..., min_length=1, max_length=10)
    department_id: str = Field(..., min_length=1, max_length=50)
    doctor_id: str = Field(..., min_length=1, max_length=50)


@router.get("/api/departments/{dept_id}/doctors")
def get_doctors_by_department(dept_id: str, _key: str = Depends(verify_api_key)):
    """Return available doctors for a department."""
    dept = next((d for d in DEPARTMENTS if d["id"] == dept_id), None)
    if dept is None:
        raise HTTPException(status_code=404, detail=f"Khoa '{dept_id}' không tồn tại.")
    doctors = [
        {
            "id": d["id"],
            "name": d["name"],
            "title": d.get("title", ""),
            "avatar": d.get("avatar", "👨‍⚕️"),
            "experience": d.get("experience", 0),
            "rating": d.get("rating", 0),
            "reviewCount": d.get("reviewCount", 0),
            "consultationFee": d.get("consultationFee", 0),
            "subSpecialties": d.get("subSpecialties", []),
        }
        for d in DOCTORS
        if d["departmentId"] == dept_id and d.get("isAvailable")
    ]
    return {
        "department": {"id": dept["id"], "name": dept["name"], "icon": dept.get("icon", "")},
        "doctors": doctors,
    }


@router.get("/api/doctors/{doctor_id}/schedule")
def get_doctor_schedule(doctor_id: str, date: str, _key: str = Depends(verify_api_key)):
    """Return available time slots for a doctor on a given date."""
    result_json = look_up_free_schedule.invoke({"doctor_id": doctor_id, "date": date})
    result = json.loads(result_json)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/api/booking")
def create_booking(payload: BookingRequest, _key: str = Depends(verify_api_key)):
    """Create a confirmed booking."""
    result_json = book_appointment.invoke({
        "date": payload.date,
        "time": payload.time,
        "department_id": payload.department_id,
        "doctor_id": payload.doctor_id,
    })
    result = json.loads(result_json)
    if "error" in result:
        raise HTTPException(status_code=409, detail=result["error"])
    return result
