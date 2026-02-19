from fastapi import APIRouter, HTTPException
from services.data_service import get_top_scorers, get_player_detail

router = APIRouter()

@router.get("/")
async def players():
    return {"players": await get_top_scorers()}

@router.get("/top-scorers")
async def top_scorers():
    return {"scorers": await get_top_scorers()}

@router.get("/{player_id}")
async def player_detail(player_id: str):
    player = await get_player_detail(player_id)
    if not player:
        raise HTTPException(404, "Player not found")
    return player
