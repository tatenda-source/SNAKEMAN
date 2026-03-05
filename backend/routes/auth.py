from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str
    role: str = "user"  # user | expert


class UserLogin(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
async def register(user: UserRegister):
    # TODO: Integrate with Supabase Auth
    return {
        "success": True,
        "message": "Registration successful. Please verify your email.",
        "user": {
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
        },
    }


@router.post("/login")
async def login(credentials: UserLogin):
    # TODO: Integrate with Supabase Auth
    return {
        "success": True,
        "token": "placeholder_jwt_token",
        "user": {
            "email": credentials.email,
            "role": "user",
        },
    }


@router.post("/logout")
async def logout():
    return {"success": True, "message": "Logged out successfully"}
