from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import standings, teams, matches, players, features, news

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(standings.router, prefix="/api/standings", tags=["standings"])
app.include_router(teams.router, prefix="/api/teams", tags=["teams"])
app.include_router(matches.router, prefix="/api/matches", tags=["matches"])
app.include_router(players.router, prefix="/api/players", tags=["players"])
app.include_router(features.router, prefix="/api/features", tags=["features"])
app.include_router(news.router, prefix="/api/news", tags=["news"])

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": settings.APP_VERSION, "season": settings.SEASON, "data_sources": ["supersport.com", "psl.co.za", "verified-data"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
