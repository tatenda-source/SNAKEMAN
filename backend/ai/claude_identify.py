import anthropic
import base64
import json
import os
from typing import Optional
from data.snakes import ZIMBABWE_SNAKES

# Use AsyncAnthropic so API calls don't block the event loop.
# The sync client.messages.create() stalls every concurrent request.
client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

_MAX_CONTEXT_CHARS = 500   # cap free-text fields injected into prompts
_MAX_DESC_CHARS = 1000

SNAKE_NAMES = [s["common_name"] for s in ZIMBABWE_SNAKES]
SNAKE_CONTEXT = "\n".join([
    f"- {s['common_name']} ({s['scientific_name']}): {s['danger_level']} danger, {s['venom_type']}, ID tags: {', '.join(s['image_tags'])}"
    for s in ZIMBABWE_SNAKES
])

IDENTIFICATION_PROMPT = f"""You are an expert herpetologist specializing in Zimbabwean snake species.
Analyze the provided image and identify the snake.

The 8 snake species commonly found in Zimbabwe are:
{SNAKE_CONTEXT}

Respond ONLY with a valid JSON object in this exact format:
{{
  "identified": true/false,
  "snake_id": "snake-id-slug or null",
  "common_name": "Common Name or null",
  "scientific_name": "Scientific name or null",
  "confidence": 0.0-1.0,
  "confidence_label": "High/Medium/Low",
  "danger_level": "CRITICAL/HIGH/MEDIUM/LOW or null",
  "is_snake": true/false,
  "reasoning": "Brief explanation of key identifying features observed",
  "visible_features": ["feature1", "feature2"],
  "immediate_action": "What the user should do RIGHT NOW",
  "alternative_matches": [
    {{"snake_id": "id", "common_name": "name", "confidence": 0.0}}
  ]
}}

If the image does not contain a snake, set is_snake to false and identified to false.
If you cannot identify it as one of the 8 Zimbabwe species, still provide your best analysis.
Always err on the side of caution with danger level assessments.
"""


def _strip_code_fence(text: str) -> str:
    """Remove markdown ```json ... ``` fences that Claude occasionally emits."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        text = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])
    return text.strip()


async def identify_snake_from_image(
    image_data: bytes,
    image_mime_type: str = "image/jpeg",
    additional_context: Optional[str] = None,
) -> dict:
    """Send image to Claude for snake identification. Returns structured result."""
    image_b64 = base64.standard_b64encode(image_data).decode("utf-8")

    # Wrap user-supplied text in XML tags so it can't override the system prompt.
    context_block = ""
    if additional_context:
        safe_context = additional_context[:_MAX_CONTEXT_CHARS]
        context_block = f"\n\n<user_context>{safe_context}</user_context>"

    message = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image_mime_type,
                            "data": image_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": IDENTIFICATION_PROMPT + context_block,
                    },
                ],
            }
        ],
    )

    response_text = _strip_code_fence(message.content[0].text)
    result = json.loads(response_text)

    # Enrich with full snake data if identified
    if result.get("identified") and result.get("snake_id"):
        snake_data = next(
            (s for s in ZIMBABWE_SNAKES if s["id"] == result["snake_id"]), None
        )
        if snake_data:
            result["snake_data"] = snake_data

    return result


async def get_emergency_guidance(
    description: str,
    location: Optional[str] = None,
    bitten: bool = False,
) -> dict:
    """Get AI guidance for an active snake emergency."""
    # Sanitise + truncate before interpolation to prevent prompt injection.
    safe_desc = description[:_MAX_DESC_CHARS]
    safe_loc = (location or "Unknown")[:_MAX_CONTEXT_CHARS]

    prompt = f"""You are an emergency response coordinator for snake encounters in Zimbabwe.

<situation>
<description>{safe_desc}</description>
<location>{safe_loc}</location>
<bitten>{"YES - CRITICAL" if bitten else "No"}</bitten>
</situation>

Respond ONLY with a JSON object:
{{
  "severity": "CRITICAL/HIGH/MEDIUM/LOW",
  "call_emergency": true/false,
  "immediate_steps": ["step1", "step2"],
  "do_not": ["dont1", "dont2"],
  "estimated_response": "time estimate",
  "nearest_facility_type": "hospital/clinic",
  "reassurance": "calming message for the person"
}}"""

    message = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    )

    response_text = _strip_code_fence(message.content[0].text)
    return json.loads(response_text)
