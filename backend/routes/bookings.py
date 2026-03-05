from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from datetime import datetime
import uuid

router = APIRouter()

# In-memory store — replace with Supabase in production.
bookings_db: dict[str, dict] = {}

BookingStatus = Literal["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]
VALID_TIME_SLOTS = {"08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"}


class BookingCreate(BaseModel):
    user_name: str = Field(..., min_length=2, max_length=100)
    user_email: EmailStr
    user_phone: str = Field(..., min_length=7, max_length=20)
    expert_id: Optional[str] = Field(None, max_length=50)
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    time_slot: str
    reason: str = Field(..., min_length=10, max_length=1000)
    location: Optional[str] = Field(None, max_length=200)
    snake_species_concern: Optional[str] = Field(None, max_length=100)


class BookingStatusUpdate(BaseModel):
    status: BookingStatus
    expert_notes: Optional[str] = Field(None, max_length=2000)
    expert_id: Optional[str] = Field(None, max_length=50)


@router.post("/")
async def create_booking(booking: BookingCreate):
    if booking.time_slot not in VALID_TIME_SLOTS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid time_slot. Must be one of: {', '.join(sorted(VALID_TIME_SLOTS))}",
        )

    booking_id = str(uuid.uuid4())[:8].upper()

    record = {
        "id": booking_id,
        "created_at": datetime.utcnow().isoformat(),
        "status": "PENDING",
        **booking.model_dump(),
    }
    bookings_db[booking_id] = record

    return {
        "success": True,
        "booking_id": booking_id,
        "message": "Booking submitted. An expert will confirm within 2 hours.",
        "booking": record,
    }


@router.get("/")
async def list_bookings(status: Optional[str] = None, expert_id: Optional[str] = None):
    bookings = list(bookings_db.values())
    if status:
        bookings = [b for b in bookings if b["status"] == status]
    if expert_id:
        bookings = [b for b in bookings if b.get("expert_id") == expert_id]
    return {"bookings": bookings, "total": len(bookings)}


@router.get("/{booking_id}")
async def get_booking(booking_id: str):
    booking = bookings_db.get(booking_id.upper())
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.patch("/{booking_id}/status")
async def update_booking_status(booking_id: str, update: BookingStatusUpdate):
    booking = bookings_db.get(booking_id.upper())
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking["status"] = update.status
    booking["updated_at"] = datetime.utcnow().isoformat()
    if update.expert_notes:
        booking["expert_notes"] = update.expert_notes
    if update.expert_id:
        booking["expert_id"] = update.expert_id

    return {"success": True, "booking": booking}


@router.get("/slots/available")
async def get_available_slots(date_str: str, expert_id: Optional[str] = None):
    all_slots = [
        "08:00", "09:00", "10:00", "11:00",
        "13:00", "14:00", "15:00", "16:00"
    ]
    booked_slots = [
        b["time_slot"] for b in bookings_db.values()
        if b["date"] == date_str
        and b["status"] in ("PENDING", "CONFIRMED")
        and (not expert_id or b.get("expert_id") == expert_id)
    ]
    available = [s for s in all_slots if s not in booked_slots]
    return {"date": date_str, "available_slots": available, "booked_slots": booked_slots}
