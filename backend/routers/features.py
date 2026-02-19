from fastapi import APIRouter
from services.data_service import get_h2h, get_teams, get_top_scorers

router = APIRouter()

@router.get("/h2h")
async def h2h(team_a: str, team_b: str):
    return await get_h2h(team_a, team_b)

@router.get("/form-fire")
async def form_fire():
    scorers = await get_top_scorers()
    fire = []
    for s in scorers:
        rating = min(95, 60 + s["goals"] * 4)
        fire.append({**s, "rating": rating, "tier": "World Class" if rating >= 80 else "Elite" if rating >= 70 else "Form"})
    return {"players": fire}
