from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional

router = APIRouter()

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_CONTEXT_CHARS = 500


@router.post("/")
async def identify_snake(
    image: UploadFile = File(...),
    context: Optional[str] = Form(None),
):
    # content_type is Optional[str] — must guard before set membership test.
    if not image.content_type or image.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(sorted(ALLOWED_MIME_TYPES))}",
        )

    image_data = await image.read()

    if len(image_data) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Image too large. Max size is 10MB.")

    # Truncate user-supplied context before it reaches the LLM prompt builder.
    safe_context = context[:MAX_CONTEXT_CHARS] if context else None

    from ai.claude_identify import identify_snake_from_image

    result = await identify_snake_from_image(
        image_data=image_data,
        image_mime_type=image.content_type,
        additional_context=safe_context,
    )

    return JSONResponse(content={"success": True, "result": result})


@router.get("/species")
async def list_species():
    from data.snakes import ZIMBABWE_SNAKES
    return {
        "species": [
            {
                "id": s["id"],
                "common_name": s["common_name"],
                "scientific_name": s["scientific_name"],
                "danger_level": s["danger_level"],
                "venom_type": s["venom_type"],
            }
            for s in ZIMBABWE_SNAKES
        ]
    }
