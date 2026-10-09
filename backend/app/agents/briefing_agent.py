"""
Executive Morning & Session Briefing Agent for SynapseOS.
Synthesizes workspace context, uncompleted tasks, and recent thoughts
into actionable high-leverage priorities using NVIDIA Nemotron.
"""

import json
from datetime import datetime
from typing import Dict, Any, List
from app.memory_store import memory_store
from app.nebius_client import nebius_client

BRIEFING_SYSTEM_PROMPT = """You are SynapseOS, an elite proactive cognitive chief of staff and executive copilot.
Your mission is to keep your human in a continuous flow state by eliminating cognitive fatigue and context drag.

Analyze the user's recent workspace files, thoughts, notes, and activity log.
Produce an Executive Work Session Kickoff formatted strictly as clean JSON with these exact keys:
{
  "summary": "1-2 sentence high-level overview of where the user's focus is centered right now.",
  "priorities": [
    "Priority 1: Most leveraged immediate action item",
    "Priority 2: Second critical milestone",
    "Priority 3: Third focused objective"
  ],
  "open_loops": [
    "Unfinished thread, bug, or question that needs resolution",
    "Pending task or edge case to watch out for"
  ],
  "proactive_tip": "One sharp, non-obvious cognitive advice or architectural insight based on their code/notes."
}

Do NOT output markdown backticks or any conversational preamble. Return pure JSON only.
"""

class BriefingAgent:
    async def generate_briefing(self) -> Dict[str, Any]:
        """Gathers recent memory context and prompts Nemotron via Nebius Token Factory."""
        recent_items = memory_store.get_recent_items(limit=15)
        
        context_snippets = []
        for item in recent_items:
            snippet = f"[{item['item_type'].upper()}: {item['title']}]\n{item['sanitized_content'][:500]}"
            context_snippets.append(snippet)

        joined_context = "\n\n".join(context_snippets) if context_snippets else "No recent workspace items recorded yet. Today is day 1 of the new project."

        user_prompt = f"""Current Date & Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}

ACTIVE WORKSPACE CONTEXT & NOTES:
{joined_context}

Generate the Executive Briefing JSON now:"""

        full_response = ""
        metrics = {}
        async for chunk in nebius_client.stream_completion(
            messages=[{"role": "user", "content": user_prompt}],
            system_prompt=BRIEFING_SYSTEM_PROMPT,
            temperature=0.4,
            max_tokens=2048
        ):
            if chunk["type"] == "token":
                full_response += chunk["text"]
            elif chunk["type"] == "metrics":
                metrics = chunk["data"]

        # Parse JSON output from Nemotron
        parsed = self._extract_json(full_response)
        date_str = datetime.now().strftime('%Y-%m-%d')
        
        memory_store.save_briefing(
            date_str=date_str,
            summary=parsed.get("summary", "Ready for your next deep work session."),
            priorities=parsed.get("priorities", ["Focus on core objectives"]),
            open_loops=parsed.get("open_loops", ["No critical open loops"]),
            metrics=metrics
        )

        return {
            "date": date_str,
            "briefing": parsed,
            "metrics": metrics,
            "context_items_count": len(recent_items)
        }

    def _extract_json(self, raw_text: str) -> Dict[str, Any]:
        """Safely extracts JSON even if surrounded by thoughts or markdown backticks."""
        text = raw_text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        # Find first { and last }
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            try:
                return json.loads(text[start:end+1])
            except Exception:
                pass

        # Fallback structured object
        return {
            "summary": "Deep work session initialized. Workspace context ingested.",
            "priorities": [
                "Review project architecture and requirements",
                "Verify Nebius Token Factory live endpoints",
                "Implement end-to-end user workflows"
            ],
            "open_loops": [
                "Set up integration test suite",
                "Verify memory indexing bounds"
            ],
            "proactive_tip": "Keep functions modular and verify inference latency on high-throughput tokens."
        }

briefing_agent = BriefingAgent()
