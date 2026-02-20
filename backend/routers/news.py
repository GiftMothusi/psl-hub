from fastapi import APIRouter
from services.data_service import get_psl_news

router = APIRouter()


# ─────────────────────────────────────────────────────────────
# GET /api/news/
# Returns up to `limit` PSL-relevant articles from RSS feeds.
# Default limit = 15. Cached for 2 minutes.
# ─────────────────────────────────────────────────────────────
@router.get("/")
async def news(limit: int = 15):
    articles = await get_psl_news(limit=limit)
    return {
        "articles": articles,
        "count": len(articles),
    }