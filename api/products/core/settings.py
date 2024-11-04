from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGODB_URI: str
    PRODUCTS_DB: str = "Products"
    JWT_PUBLIC: str
    JWT_ALGORITHM: str = "RS256"
    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings():
    return Settings()
