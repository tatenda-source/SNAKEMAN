from fastapi import APIRouter
from typing import List

router = APIRouter()

# Seeded expert profiles
EXPERTS = [
    {
        "id": "exp-001",
        "name": "Dr. Tendai Moyo",
        "title": "Senior Herpetologist",
        "specialization": "Venomous Snake Ecology & Venom Research",
        "qualifications": ["PhD Zoology - University of Zimbabwe", "Certified Snake Handler", "WHO Snakebite Advisor"],
        "experience_years": 18,
        "location": "Harare",
        "languages": ["English", "Shona"],
        "avatar_initials": "TM",
        "rating": 4.9,
        "total_consultations": 847,
        "available": True,
        "bio": "Dr. Moyo has spent 18 years studying Zimbabwe's venomous snake population and has been instrumental in developing local antivenom protocols.",
    },
    {
        "id": "exp-002",
        "name": "Sibongile Ncube",
        "title": "Wildlife Rescue Specialist",
        "specialization": "Snake Relocation & Human-Wildlife Conflict",
        "qualifications": ["BSc Wildlife Management - NUST", "SARPA Certified", "First Responder"],
        "experience_years": 12,
        "location": "Bulawayo",
        "languages": ["English", "Ndebele", "Shona"],
        "avatar_initials": "SN",
        "rating": 4.8,
        "total_consultations": 623,
        "available": True,
        "bio": "Sibongile specializes in safe snake removal and relocation, having handled over 2,000 snakes without incident.",
    },
    {
        "id": "exp-003",
        "name": "Marcus Fitzgerald",
        "title": "Emergency Toxicologist",
        "specialization": "Snakebite Management & Antivenom Therapy",
        "qualifications": ["MBChB - UZ Medical School", "Toxicology Fellowship", "Emergency Medicine Specialist"],
        "experience_years": 15,
        "location": "Harare",
        "languages": ["English"],
        "avatar_initials": "MF",
        "rating": 4.95,
        "total_consultations": 1204,
        "available": False,
        "bio": "Dr. Fitzgerald leads the snakebite response unit at Parirenyatwa Group of Hospitals and has treated over 1,200 envenomation cases.",
    },
    {
        "id": "exp-004",
        "name": "Ruvimbo Chikwanda",
        "title": "Conservation Educator",
        "specialization": "Snake Safety Education & Community Outreach",
        "qualifications": ["MSc Conservation Biology", "Wildlife Educator Certification"],
        "experience_years": 8,
        "location": "Mutare",
        "languages": ["English", "Shona"],
        "avatar_initials": "RC",
        "rating": 4.7,
        "total_consultations": 312,
        "available": True,
        "bio": "Ruvimbo focuses on educating rural communities about snake safety and coexistence, reducing unnecessary snake killings.",
    },
]


@router.get("/")
async def list_experts(available_only: bool = False):
    experts = EXPERTS
    if available_only:
        experts = [e for e in experts if e["available"]]
    return {"experts": experts, "total": len(experts)}


@router.get("/{expert_id}")
async def get_expert(expert_id: str):
    expert = next((e for e in EXPERTS if e["id"] == expert_id), None)
    if not expert:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Expert not found")
    return expert
