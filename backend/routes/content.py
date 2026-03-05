from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Optional, List
from datetime import datetime
import uuid

router = APIRouter()

# In-memory content store — replace with Supabase + storage in production.
content_db: dict[str, dict] = {}

ContentType = Literal["article", "video", "photo", "tip"]


class ContentCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    content_type: ContentType
    body: Optional[str] = Field(None, max_length=50_000)
    video_url: Optional[str] = Field(None, max_length=500)
    tags: List[str] = Field(default_factory=list, max_length=10)
    snake_species: Optional[str] = Field(None, max_length=100)
    author_id: str = Field(..., min_length=1, max_length=100)
    author_name: str = Field(..., min_length=1, max_length=100)
    is_featured: bool = False


@router.get("/")
async def list_content(
    content_type: Optional[str] = None,
    snake_species: Optional[str] = None,
    featured_only: bool = False,
    limit: int = 20,
    offset: int = 0,
):
    items = list(content_db.values())

    if content_type:
        items = [i for i in items if i["content_type"] == content_type]
    if snake_species:
        items = [i for i in items if i.get("snake_species") == snake_species]
    if featured_only:
        items = [i for i in items if i.get("is_featured")]

    items.sort(key=lambda x: x["created_at"], reverse=True)
    total = len(items)
    items = items[offset : offset + limit]

    return {"items": items, "total": total, "limit": limit, "offset": offset}


@router.post("/")
async def create_content(item: ContentCreate):
    # Pydantic's Literal["article","video","photo","tip"] already rejects
    # invalid values with a 422 — no manual check needed.
    content_id = str(uuid.uuid4())
    record = {
        "id": content_id,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
        "views": 0,
        "likes": 0,
        **item.model_dump(),
    }
    content_db[content_id] = record
    return {"success": True, "content": record}


@router.get("/{content_id}")
async def get_content(content_id: str):
    item = content_db.get(content_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content not found")
    item["views"] += 1
    return item


class DeleteRequest(BaseModel):
    # TODO: replace author_id with a JWT claim once auth middleware is wired up.
    # Accepting it as a request body (vs query param) at least prevents it
    # from appearing in server logs and proxy access logs.
    author_id: str = Field(..., min_length=1, max_length=100)


@router.delete("/{content_id}")
async def delete_content(content_id: str, body: DeleteRequest):
    item = content_db.get(content_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content not found")
    if item["author_id"] != body.author_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    del content_db[content_id]
    return {"success": True}


@router.post("/{content_id}/like")
async def like_content(content_id: str):
    item = content_db.get(content_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content not found")
    item["likes"] += 1
    return {"likes": item["likes"]}
