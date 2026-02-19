from fastapi import APIRouter
from services.data_service import get_standings, get_top_scorers

router = APIRouter()

@router.get("/")
async def standings(season: str = "2025-2026"):
    return {"standings": await get_standings(season), "season": season}

@router.get("/top-scorers")
async def top_scorers():
    return {"scorers": await get_top_scorers()}
