"""
Tavily AI Search Engine for SynapseOS.
Powers real-time web research, documentation lookup, and live grounding
for the $3,000 "Best Use of Tavily" Hackathon Prize track.
"""

import httpx
from typing import Dict, Any, List, Optional
from app.config import settings
from app.guardrails import PrivacyGuardrail

class TavilySearchClient:
    def __init__(self):
        self.api_key = settings.tavily_api_key
        self.api_url = "https://api.tavily.com/search"

    async def search(
        self,
        query: str,
        search_depth: str = "basic",
        max_results: int = 3,
        custom_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes a real-time web search via Tavily.
        Locally redacts sensitive PII / secrets before sending.
        """
        key = custom_key or self.api_key or settings.tavily_api_key
        if not key:
            return {
                "enabled": False,
                "error": "Tavily API key not configured.",
                "results": []
            }

        safe_query, _ = PrivacyGuardrail.sanitize(query)

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    self.api_url,
                    json={
                        "api_key": key,
                        "query": safe_query,
                        "search_depth": search_depth,
                        "max_results": max_results,
                        "include_answer": True,
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    results = []
                    for item in data.get("results", []):
                        results.append({
                            "title": item.get("title", ""),
                            "url": item.get("url", ""),
                            "content": item.get("content", ""),
                            "score": item.get("score", 0),
                        })
                    return {
                        "enabled": True,
                        "query": safe_query,
                        "answer": data.get("answer"),
                        "results": results,
                        "response_time": data.get("response_time", 0)
                    }
                else:
                    return {
                        "enabled": False,
                        "error": f"Tavily returned {resp.status_code}: {resp.text[:100]}",
                        "results": []
                    }
        except Exception as e:
            return {
                "enabled": False,
                "error": str(e),
                "results": []
            }

tavily_client = TavilySearchClient()
