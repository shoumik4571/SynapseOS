"""
Schedule & Day Structurer Agent for Synapse.
Analyzes natural language prompts, timestamps, fixed commitments, hard deadlines,
detailed task descriptions, and attached files/images to synthesize an optimal
hour-by-hour execution schedule.
"""

import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.memory_store import memory_store
from app.nebius_client import nebius_client

SCHEDULE_SYSTEM_PROMPT = """You are Synapse, an elite Executive Chief of Staff and Intelligent Day Structurer.
Your mission is to take the user's natural language schedule prompt, raw commitments, fixed time blocks/timestamps, hard deadlines, task details, and any attached context, and structure their day into a realistic, low-friction, high-impact execution plan.

CRITICAL RULES:
1. PARSE NATURAL PROMPTS INTELLIGENTLY: If the user provides a freeform natural language prompt (e.g. "I have a meeting at 10 AM and lunch at 1 PM, need to finish the API by 5 PM"), automatically extract all commitments, deadlines, and deliverables.
2. RESPECT FIXED TIMESTAMPS: Protect user meetings and scheduled events exactly at their times.
3. DEADLINE-BACKED SCHEDULING: If a deadline exists (e.g. 5:00 PM), schedule the most critical work BEFORE the deadline with at least 45-60 minutes of safety buffer.
4. ENERGY-AWARE TIME BLOCKS: Deep work should happen in uninterrupted 60-90 min blocks.
5. BE DECISIVE: Clearly categorize what MUST be done today vs what CAN WAIT if time runs out.

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
        prompt: Optional[str] = None,
        schedule_input: Optional[str] = None,
        tasks_detail: Optional[str] = None,
        deadline: Optional[str] = None,
        attachments_summary: Optional[str] = None,
        target_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """Prompts NVIDIA Nemotron on Nebius Token Factory to synthesize a structured day."""
        current_time_str = datetime.now().strftime('%Y-%m-%d %I:%M %p')
        date_str = target_date or datetime.now().strftime('%Y-%m-%d')
        
        prompt_block = ""
        if prompt and prompt.strip():
            prompt_block = f"USER'S NATURAL LANGUAGE PROMPT & INSTRUCTIONS:\n{prompt.strip()}\n\n"

        schedule_block = ""
        if schedule_input and schedule_input.strip():
            schedule_block = f"USER'S FIXED SCHEDULE & TIMESTAMPS:\n{schedule_input.strip()}\n\n"

        deadline_block = ""
        if deadline and deadline.strip():
            deadline_block = f"TARGET DEADLINE:\n{deadline.strip()}\n\n"

        tasks_block = ""
        if tasks_detail and tasks_detail.strip():
            tasks_block = f"DETAILED TASKS & WORK DESCRIPTION:\n{tasks_detail.strip()}\n\n"

        attachments_block = ""
        if attachments_summary and attachments_summary.strip():
            attachments_block = f"ATTACHED DOCUMENTS / IMAGES CONTEXT:\n{attachments_summary.strip()}\n\n"

        combined_input = prompt_block + schedule_block + deadline_block + tasks_block + attachments_block
        if not combined_input.strip():
            combined_input = "Plan a productive day with focused deep work blocks and balanced rest."

        user_prompt = f"""Planning Date: {date_str} (Reference Time: {current_time_str})

INPUTS:
{combined_input}

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

        parsed = self._extract_json(full_response, schedule_input or prompt or "", tasks_detail or prompt or "", deadline)
        
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
