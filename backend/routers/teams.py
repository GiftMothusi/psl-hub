from fastapi import APIRouter, HTTPException
from services.data_service import get_teams, get_team_detail, get_team_roster

router = APIRouter()

@router.get("/")
async def teams():
    return {"teams": await get_teams()}

@router.get("/{team_id}")
async def team_detail(team_id: str):
    team = await get_team_detail(team_id)
    if not team:
        raise HTTPException(404, "Team not found")
    return team

@router.get("/{team_id}/roster")
async def team_roster(team_id: str):
    roster = await get_team_roster(team_id)
    return {"team_id": team_id, "players": roster, "count": len(roster)}
