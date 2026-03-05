from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

from routes import identify, bookings, emergency, content, auth, experts

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("SNAKEMAN API starting up...")
    yield
    print("SNAKEMAN API shutting down...")

app = FastAPI(
    title="SNAKEMAN API",
    description="Zimbabwe Snake Identification & Expert Consultation Platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        o.strip()
        for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
        if o.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(identify.router, prefix="/api/identify", tags=["Identify"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(emergency.router, prefix="/api/emergency", tags=["Emergency"])
app.include_router(content.router, prefix="/api/content", tags=["Content"])
app.include_router(experts.router, prefix="/api/experts", tags=["Experts"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "snakeman-api", "version": "1.0.0"}

@app.get("/api/snakes")
async def get_all_snakes():
    from data.snakes import ZIMBABWE_SNAKES
    return {"snakes": ZIMBABWE_SNAKES, "total": len(ZIMBABWE_SNAKES)}

@app.get("/api/snakes/{snake_id}")
async def get_snake(snake_id: str):
    from data.snakes import ZIMBABWE_SNAKES
    snake = next((s for s in ZIMBABWE_SNAKES if s["id"] == snake_id), None)
    if not snake:
        raise HTTPException(status_code=404, detail="Snake not found")
    return snake
