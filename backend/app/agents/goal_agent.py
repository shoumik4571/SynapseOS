"""
Autonomous Goal Decomposer Agent for SynapseOS.
Breaks down high-level user ambitions into structured milestones,
phases, and daily tactical sprints using NVIDIA Nemotron.
"""

import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.nebius_client import nebius_client
from app.memory_store import memory_store

GOAL_SYSTEM_PROMPT = """You are SynapseOS Goal Engine, an elite strategic planner and execution architect.
Your mission is to take an ambitious high-level goal and autonomously decompose it into an actionable,
hyper-realistic roadmap with immediate daily execution steps.

Output strictly valid JSON with this exact schema:
{
  "goal_title": "Clean concise goal title",
  "vision": "1-2 sentences on why this goal matters and the final definition of done",
  "phases": [
    {
      "phase_name": "Phase 1: Foundation & Prototype",
      "timeframe": "Days 1-5",
      "milestones": ["Milestone A", "Milestone B"]
    },
    {
      "phase_name": "Phase 2: Core Engineering & Polish",
      "timeframe": "Days 6-15",
      "milestones": ["Milestone C", "Milestone D"]
    },
    {
      "phase_name": "Phase 3: Launch, Video & Packaging",
      "timeframe": "Days 16-21",
      "milestones": ["Milestone E", "Milestone F"]
    }
  ],
  "today_tasks": [
    {
      "task": "Specific actionable micro-task",
      "priority": "HIGH",
      "estimated_minutes": 45
    },
    {
      "task": "Second micro-task",
      "priority": "MEDIUM",
      "estimated_minutes": 30
    },
    {
      "task": "Third micro-task",
      "priority": "LOW",
      "estimated_minutes": 20
    }
  ],
  "potential_blockers": [
    "Common trap or blocker to avoid"
  ]
}

Do NOT output markdown backticks or conversational explanations. Return valid JSON only.
"""

class GoalAgent:
    async def decompose_goal(self, goal_input: str, target_date: str = "") -> Dict[str, Any]:
        recent_context = memory_store.get_recent_items(limit=8)
        context_titles = [f"- {item['title']} ({item['item_type']})" for item in recent_context]
        context_str = "\n".join(context_titles) if context_titles else "New workspace."

        prompt = f"""Current Date: {datetime.now().strftime('%Y-%m-%d')}
Target Completion Date: {target_date if target_date else 'Within 3 weeks'}

USER'S HIGH-LEVEL GOAL:
"{goal_input}"

ACTIVE RECENT CONTEXT:
{context_str}

Decompose this goal into a strategic roadmap and today's tactical tasks now:"""

        full_response = ""
        metrics = {}
        async for chunk in nebius_client.stream_completion(
            messages=[{"role": "user", "content": prompt}],
            system_prompt=GOAL_SYSTEM_PROMPT,
            temperature=0.4,
            max_tokens=2048
        ):
            if chunk["type"] == "token":
                full_response += chunk["text"]
            elif chunk["type"] == "metrics":
                metrics = chunk["data"]

        parsed = self._extract_json(full_response, goal_input)
        
        # Save into database
        goal_id = memory_store.save_goal(
            title=goal_input,
            decomposition=parsed,
            target_date=target_date
        )

        return {
            "goal_id": goal_id,
            "decomposition": parsed,
            "metrics": metrics
        }

    def _extract_json(self, raw_text: str, fallback_title: str) -> Dict[str, Any]:
        text = raw_text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            try:
                return json.loads(text[start:end+1])
            except Exception:
                pass

        # Fallback structured decomposition
        return {
            "goal_title": fallback_title,
            "vision": "Execute systematically to deliver production-grade results.",
            "phases": [
                {
                    "phase_name": "Phase 1: Architecture & Scaffolding",
                    "timeframe": "Days 1-7",
                    "milestones": ["Set up repositories", "Validate endpoints & core engine"]
                },
                {
                    "phase_name": "Phase 2: Core Feature Implementation",
                    "timeframe": "Days 8-16",
                    "milestones": ["Build autonomous loops", "Integrate UI components"]
                },
                {
                    "phase_name": "Phase 3: Verification & Submission",
                    "timeframe": "Days 17-21",
                    "milestones": ["Record 3-min demo video", "Final documentation & submit"]
                }
            ],
            "today_tasks": [
                {"task": "Verify Nebius Token Factory live streaming", "priority": "HIGH", "estimated_minutes": 30},
                {"task": "Test ambient workspace watcher file updates", "priority": "MEDIUM", "estimated_minutes": 20},
                {"task": "Complete first end-to-end task checklist", "priority": "MEDIUM", "estimated_minutes": 30}
            ],
            "potential_blockers": ["Scope creep before core flow is polished"]
        }

goal_agent = GoalAgent()
