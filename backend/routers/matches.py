from fastapi import APIRouter
from services.data_service import get_fixtures, get_live_matches, get_match_detail

router = APIRouter()

@router.get("/")
async def matches(status: str = None, team_id: str = None, last: int = None, next_n: int = None):
    return {"matches": await get_fixtures(status=status, team_id=team_id, last=last, next_n=next_n)}

@router.get("/live")
async def live():
    return {"matches": await get_live_matches()}

@router.get("/{match_id}")
async def match_detail(match_id: str):
    match = await get_match_detail(match_id)
    return match or {"error": "Match not found"}
