"""
Schedule & Day Structurer Agent for Synapse.
Analyzes timestamps, fixed commitments, hard deadlines, detailed task descriptions,
and attached files/images to synthesize an optimal hour-by-hour execution schedule.
"""

import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.memory_store import memory_store
from app.nebius_client import nebius_client

SCHEDULE_SYSTEM_PROMPT = """You are Synapse, an elite Executive Chief of Staff and Intelligent Day Structurer.
Your mission is to take the user's raw daily commitments, fixed time blocks/timestamps, hard deadlines, task details, and any attached context, and structure their day into a realistic, low-friction, high-impact execution plan.

CRITICAL RULES:
1. RESPECT FIXED TIMESTAMPS: Protect user meetings and scheduled events exactly at their times.
2. DEADLINE-BACKED SCHEDULING: If a deadline exists (e.g. 5:00 PM), schedule the most critical work BEFORE the deadline with at least 45-60 minutes of safety buffer.
3. ENERGY-AWARE TIME BLOCKS: Deep work should happen in uninterrupted 60-90 min blocks.
4. BE DECISIVE: Clearly categorize what MUST be done today vs what CAN WAIT if time runs out.

Return strictly valid JSON with this exact schema (no markdown formatting, no conversational text):
{
  "summary": "1-2 sentence high-level executive summary of today's plan and deadline viability.",
  "deadline_assessment": {
    "deadline": "e.g. 5:00 PM",
    "feasibility": "COMFORTABLE | TIGHT_BUT_ACHIEVABLE | AT_RISK",
    "buffer_minutes": 60,
    "strategy": "How this schedule ensures the deadline is met without panic."
  },
  "time_blocks": [
    {
      "time": "e.g. 09:30 AM - 11:00 AM",
      "title": "Block Title",
      "type": "DEEP_WORK | FIXED_COMMITMENT | DEADLINE_SPRINT | BUFFER_REVIEW | BREAK",
      "focus": "Specific deliverable or objective for this window",
      "action_items": [
        "Concrete step 1",
        "Concrete step 2"
      ]
    }
  ],
  "must_do_today": [
    {
      "task": "Task name",
      "priority": "CRITICAL_BEFORE_DEADLINE | HIGH | MEDIUM",
      "estimated_minutes": 45,
      "block_assigned": "e.g. 09:30 AM - 11:00 AM"
    }
  ],
  "can_wait_or_defer": [
    "Task that can safely be postponed if unexpected delays occur"
  ],
  "chief_of_staff_tip": "One high-leverage cognitive or tactical tip for today."
}
"""

class ScheduleStructurerAgent:
    async def structure_day(
        self,
        schedule_input: str,
        tasks_detail: str,
        deadline: Optional[str] = None,
        attachments_summary: Optional[str] = None
    ) -> Dict[str, Any]:
        """Prompts NVIDIA Nemotron on Nebius Token Factory to synthesize a structured day."""
        current_time_str = datetime.now().strftime('%Y-%m-%d %I:%M %p')
        
        user_prompt = f"""Current Date & Time: {current_time_str}

USER'S SCHEDULE & FIXED TIMESTAMPS:
{schedule_input.strip() if schedule_input else "No fixed meetings provided; full day available for focused work."}

DEADLINE:
{deadline.strip() if deadline else "No hard cutoff specified today."}

DETAILED TASKS & WORK DESCRIPTION:
{tasks_detail.strip() if tasks_detail else "General focus on advancing key project milestones."}

ATTACHED DOCUMENTS / IMAGES CONTEXT:
{attachments_summary.strip() if attachments_summary else "No attachments."}

Synthesize the optimal hour-by-hour structured day JSON now:"""

        full_response = ""
        metrics = {}
        async for chunk in nebius_client.stream_completion(
            messages=[{"role": "user", "content": user_prompt}],
            system_prompt=SCHEDULE_SYSTEM_PROMPT,
            temperature=0.3,
            max_tokens=2500
        ):
            if chunk["type"] == "token":
                full_response += chunk["text"]
            elif chunk["type"] == "metrics":
                metrics = chunk["data"]

        parsed = self._extract_json(full_response, schedule_input, tasks_detail, deadline)
        
        # Save structured priorities into memory store so it syncs with briefing
        date_str = datetime.now().strftime('%Y-%m-%d')
        priorities_list = [f"{item['task']} ({item.get('block_assigned', 'Today')})" for item in parsed.get("must_do_today", [])[:4]]
        if priorities_list:
            memory_store.save_briefing(
                date_str=date_str,
                summary=parsed.get("summary", "Personal schedule structured with active deadline protection."),
                priorities=priorities_list,
                open_loops=parsed.get("can_wait_or_defer", []),
                metrics=metrics
            )

        return {
            "date": date_str,
            "schedule": parsed,
            "metrics": metrics
        }

    def _extract_json(self, raw_text: str, schedule_input: str, tasks_detail: str, deadline: Optional[str]) -> Dict[str, Any]:
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

        # Robust Fallback
        deadline_text = deadline or "End of Day"
        return {
            "summary": f"Your day has been structured around your {deadline_text} deadline with built-in deep work blocks and safety buffers.",
            "deadline_assessment": {
              "deadline": deadline_text,
              "feasibility": "COMFORTABLE",
              "buffer_minutes": 60,
              "strategy": "Core deliverables are scheduled in early morning deep-work blocks, leaving the afternoon for verification and contingency."
            },
            "time_blocks": [
              {
                "time": "09:30 AM - 11:30 AM",
                "title": "Deep Work: Core Deliverable Sprint",
                "type": "DEEP_WORK",
                "focus": tasks_detail[:80] if tasks_detail else "Core project implementation",
                "action_items": [
                  "Execute primary feature without interruption",
                  "Verify implementation against requirements"
                ]
              },
              {
                "time": "11:30 AM - 12:30 PM",
                "title": "Fixed Commitments & Review",
                "type": "FIXED_COMMITMENT",
                "focus": "Scheduled meetings and inbox sweep",
                "action_items": [
                  "Attend scheduled syncs",
                  "Unblock team dependencies"
                ]
              },
              {
                "time": "01:30 PM - 03:30 PM",
                "title": "Deadline Sprint & Final Polish",
                "type": "DEADLINE_SPRINT",
                "focus": "Finalize deliverable before cutoff",
                "action_items": [
                  "Complete secondary task details",
                  "Package final output"
                ]
              },
              {
                "time": "03:30 PM - 04:30 PM",
                "title": "Buffer & Final Verification",
                "type": "BUFFER_REVIEW",
                "focus": "Safety margin ahead of deadline",
                "action_items": [
                  "Review against acceptance criteria",
                  "Submit with 30-minute margin"
                ]
              }
            ],
            "must_do_today": [
              {
                "task": "Primary deliverable completion",
                "priority": "CRITICAL_BEFORE_DEADLINE",
                "estimated_minutes": 90,
                "block_assigned": "09:30 AM - 11:30 AM"
              },
              {
                "task": "Verification and submission package",
                "priority": "HIGH",
                "estimated_minutes": 45,
                "block_assigned": "01:30 PM - 03:30 PM"
              }
            ],
            "can_wait_or_defer": [
              "Non-essential documentation refactoring",
              "Optional stretch enhancements"
            ],
            "chief_of_staff_tip": "Keep Slack / notifications muted during your 09:30 AM deep work window to protect your submission timeline."
        }

schedule_structurer = ScheduleStructurerAgent()
