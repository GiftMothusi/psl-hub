"""PSL Hub Configuration — Zero API keys needed."""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "PSL Hub"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    SUPERSPORT_TABLES_URL: str = "https://supersport.com/football/tour/882fc52f-14b7-4e7c-a259-5ff5d18bde67/tables"
    PSL_BASE_URL: str = "https://www.psl.co.za"
    SEASON: str = "2025-2026"
    CACHE_STANDINGS: int = 300
    CACHE_FIXTURES: int = 120
    CACHE_TEAMS: int = 86400
    CACHE_PLAYERS: int = 3600

    class Config:
        env_file = ".env"

settings = Settings()
