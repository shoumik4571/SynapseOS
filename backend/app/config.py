import os
from pathlib import Path
from pydantic_settings import BaseSettings

# Locate root directory containing .env
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

class Settings(BaseSettings):
    # Nebius Token Factory
    nebius_api_key: str = ""
    nebius_base_url: str = "https://api.tokenfactory.nebius.com/v1/"
    nebius_model: str = "nvidia/Nemotron-3_5-Lightning"

    # NVIDIA API / NIM (Optional / Fallback)
    nvidia_api_key: str = ""
    nvidia_base_url: str = "https://integrate.api.nvidia.com/v1"
    nvidia_model: str = "nvidia/llama-3.1-nemotron-70b-instruct"

    # Tavily Web Search
    tavily_api_key: str = ""

    # Server Settings
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    watch_directory: str = str(BASE_DIR / "workspace")
    db_path: str = str(BASE_DIR / "synapse_memory.db")
    demo_mode: bool = False

    class Config:
        env_file = str(ENV_PATH)
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
