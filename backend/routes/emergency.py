from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional
import json
import uuid
from datetime import datetime

router = APIRouter()

# In-memory stores — replace with Supabase in production.
active_emergencies: dict[str, dict] = {}


class _ConnectionManager:
    """Encapsulates the expert WebSocket registry. Using a set avoids the
    duplicate-removal bug that a plain list introduces when the same socket
    object appears twice (shouldn't happen, but defensive)."""

    def __init__(self) -> None:
        self._connections: set[WebSocket] = set()

    def add(self, ws: WebSocket) -> None:
        self._connections.add(ws)

    def remove(self, ws: WebSocket) -> None:
        self._connections.discard(ws)

    async def broadcast(self, payload: dict) -> None:
        text = json.dumps(payload)
        dead: list[WebSocket] = []
        for ws in list(self._connections):
            try:
                await ws.send_text(text)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.remove(ws)


expert_manager = _ConnectionManager()


class EmergencyReport(BaseModel):
    description: str = Field(..., min_length=10, max_length=2000)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = Field(None, max_length=200)
    bitten: bool = False
    snake_description: Optional[str] = Field(None, max_length=500)
    user_phone: Optional[str] = Field(None, max_length=20)


class ResolveRequest(BaseModel):
    expert_notes: Optional[str] = Field(None, max_length=2000)


@router.post("/report")
async def report_emergency(report: EmergencyReport):
    # Timestamp + hex suffix prevents ID collision under concurrent requests.
    emergency_id = (
        f"EMG-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6].upper()}"
    )

    from ai.claude_identify import get_emergency_guidance

    guidance = await get_emergency_guidance(
        description=report.description,
        location=report.location_name,
        bitten=report.bitten,
    )

    emergency_record = {
        "id": emergency_id,
        "timestamp": datetime.utcnow().isoformat(),
        "status": "ACTIVE",
        "report": report.model_dump(),
        "guidance": guidance,
    }

    active_emergencies[emergency_id] = emergency_record
    await expert_manager.broadcast({"type": "NEW_EMERGENCY", "emergency": emergency_record})

    return JSONResponse(
        content={
            "success": True,
            "emergency_id": emergency_id,
            "guidance": guidance,
            "message": "Emergency reported. Experts have been notified.",
        }
    )


@router.get("/active")
async def get_active_emergencies():
    return {"emergencies": list(active_emergencies.values())}


@router.post("/{emergency_id}/resolve")
async def resolve_emergency(emergency_id: str, body: ResolveRequest):
    if emergency_id not in active_emergencies:
        raise HTTPException(status_code=404, detail="Emergency not found")

    active_emergencies[emergency_id]["status"] = "RESOLVED"
    active_emergencies[emergency_id]["resolved_at"] = datetime.utcnow().isoformat()
    active_emergencies[emergency_id]["expert_notes"] = body.expert_notes

    await expert_manager.broadcast({
        "type": "EMERGENCY_RESOLVED",
        "emergency_id": emergency_id,
    })

    return {"success": True, "emergency_id": emergency_id}


@router.websocket("/ws/expert")
async def expert_websocket(websocket: WebSocket):
    await websocket.accept()
    expert_manager.add(websocket)
    try:
        await websocket.send_text(json.dumps({
            "type": "INIT",
            "active_emergencies": list(active_emergencies.values()),
        }))
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            if msg.get("type") == "PING":
                await websocket.send_text(json.dumps({"type": "PONG"}))
    except WebSocketDisconnect:
        expert_manager.remove(websocket)


@router.websocket("/ws/user/{emergency_id}")
async def user_emergency_websocket(websocket: WebSocket, emergency_id: str):
    await websocket.accept()
    try:
        # Push current state immediately; subsequent updates arrive via broadcast.
        if emergency_id in active_emergencies:
            await websocket.send_text(json.dumps({
                "type": "STATUS_UPDATE",
                "emergency": active_emergencies[emergency_id],
            }))
        # Keep alive — wait for client messages (ping/disconnect).
        # The old asyncio.sleep(5) polling sent redundant identical payloads
        # every 5 s and blocked the socket from receiving client-side messages.
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
