"""
SynapseOS Backend API Server.
FastAPI entrypoint with streaming endpoints, ambient context management,
and Nebius Token Factory inference telemetry.
"""

import json
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from app.config import settings
from app.guardrails import PrivacyGuardrail
from app.memory_store import memory_store
from app.watcher import ambient_watcher
from app.nebius_client import nebius_client
from app.agents.briefing_agent import briefing_agent
from app.agents.context_diff_agent import context_diff_agent
from app.agents.copilot_agent import copilot_agent
from app.agents.goal_agent import goal_agent
import httpx

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: start ambient workspace watcher
    ambient_watcher.start()
    yield
    # Shutdown: stop watcher
    ambient_watcher.stop()

app = FastAPI(
    title="SynapseOS API",
    description="Ambient Cognitive Copilot & Contextual Second Brain (Nebius x NVIDIA Hackathon 2026)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class CaptureRequest(BaseModel):
    title: str
    content: str
    item_type: str = "thought"  # 'thought', 'note', 'task', 'snippet'
    metadata: Optional[Dict[str, Any]] = None

class ContextDiffRequest(BaseModel):
    target_topic: Optional[str] = ""

class ChatStreamRequest(BaseModel):
    session_id: str = "default-session"
    message: str

class GoalDecomposeRequest(BaseModel):
    goal: str
    target_date: Optional[str] = ""

class VerifyKeyRequest(BaseModel):
    api_key: str
    base_url: Optional[str] = "https://api.tokenfactory.nebius.com/v1/"

# Endpoints
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app": "SynapseOS",
        "nebius_model": settings.nebius_model,
        "nebius_base_url": settings.nebius_base_url,
        "demo_mode": settings.demo_mode or not settings.nebius_api_key,
        "watch_directory": settings.watch_directory,
    }

@app.get("/api/stats")
async def get_stats():
    stats = memory_store.get_stats()
    stats["model"] = settings.nebius_model
    stats["watch_directory"] = settings.watch_directory
    return stats

@app.get("/api/context")
async def get_context_items(limit: int = Query(25, ge=1, le=100), item_type: Optional[str] = None):
    return memory_store.get_recent_items(limit=limit, item_type=item_type)

@app.post("/api/capture")
async def quick_capture(req: CaptureRequest):
    if not req.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    
    result = memory_store.add_context_item(
        item_type=req.item_type,
        title=req.title or "Quick Thought",
        content=req.content,
        metadata=req.metadata or {}
    )
    return result

@app.post("/api/briefing/generate")
async def generate_briefing():
    result = await briefing_agent.generate_briefing()
    return result

@app.get("/api/briefing/latest")
async def get_latest_briefing():
    latest = memory_store.get_latest_briefing()
    if not latest:
        # Generate on the fly if none exists
        return await briefing_agent.generate_briefing()
    return latest

@app.post("/api/context-diff")
async def compute_context_diff(req: ContextDiffRequest):
    return await context_diff_agent.compute_context_diff(target_topic=req.target_topic or "")

@app.post("/api/chat/stream")
async def chat_stream(req: ChatStreamRequest):
    async def event_generator():
        async for chunk in copilot_agent.chat_stream(
            session_id=req.session_id,
            user_message=req.message
        ):
            yield {"data": json.dumps(chunk)}

    return EventSourceResponse(event_generator())

@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str, limit: int = 30):
    return memory_store.get_chat_history(session_id=session_id, limit=limit)

@app.post("/api/goals/decompose")
async def decompose_goal(req: GoalDecomposeRequest):
    if not req.goal.strip():
        raise HTTPException(status_code=400, detail="Goal cannot be empty.")
    return await goal_agent.decompose_goal(goal_input=req.goal, target_date=req.target_date)

@app.get("/api/goals")
async def list_goals(status: str = "active"):
    return memory_store.get_goals(status=status)

@app.post("/api/goals/{goal_id}/status")
async def update_goal_status(goal_id: int, status: str = Query("completed")):
    memory_store.update_goal_status(goal_id=goal_id, status=status)
    return {"status": "updated", "goal_id": goal_id, "new_status": status}

@app.post("/api/settings/verify-key")
async def verify_nebius_key(req: VerifyKeyRequest):
    """Pings Nebius Token Factory live to verify that an API key is valid."""
    url = req.base_url.rstrip("/") + "/models"
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(url, headers={"Authorization": f"Bearer {req.api_key.strip()}"})
            if resp.status_code == 200:
                data = resp.json()
                models = [m.get("id") for m in data.get("data", [])]
                nemotron_models = [m for m in models if "nemotron" in m.lower()]
                return {
                    "valid": True,
                    "provider": "Nebius Token Factory",
                    "nemotron_models": nemotron_models,
                    "total_models": len(models)
                }
            else:
                return {
                    "valid": False,
                    "error": f"Nebius returned status code {resp.status_code}: {resp.text[:100]}"
                }
    except Exception as e:
        return {"valid": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.backend_host, port=settings.backend_port, reload=True)
