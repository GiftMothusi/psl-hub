"""Simple in-memory cache with TTL."""
import time
import functools
from config import settings

_cache = {}
_TTL_MAP = {
    "standings": settings.CACHE_STANDINGS,
    "fixtures": settings.CACHE_FIXTURES,
    "teams": settings.CACHE_TEAMS,
    "players": settings.CACHE_PLAYERS,
}

def cached(namespace: str):
    ttl = _TTL_MAP.get(namespace, 300)
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            key = f"{namespace}:{args}:{kwargs}"
            if key in _cache:
                val, ts = _cache[key]
                if time.time() - ts < ttl:
                    return val
            result = await func(*args, **kwargs)
            _cache[key] = (result, time.time())
            return result
        return wrapper
    return decorator
