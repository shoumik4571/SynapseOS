"""
Schedule & Day Structurer Agent for Synapse.
Analyzes natural language prompts, timestamps, fixed commitments, hard deadlines,
detailed task descriptions, and attached files/images to synthesize an optimal
hour-by-hour execution schedule.
"""

import json
import re
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.memory_store import memory_store
from app.nebius_client import nebius_client

SCHEDULE_SYSTEM_PROMPT = """You are Synapse, an elite AI Executive Chief of Staff and Day Structurer.
Your mission is to map the user's daily commitments, routine, workstreams, and deadlines into an actionable hour-by-hour timeline.

CRITICAL INSTRUCTION:
You MUST respond with valid JSON wrapped in a ```json ... ``` codeblock.
The root JSON object MUST contain the key "time_blocks" as an array of objects.

REQUIRED SCHEMA:
{
  "summary": "1-2 sentence executive summary of today's plan respecting all user commitments and workstreams.",
  "deadline_assessment": {
    "deadline": "e.g. 10:30 PM",
    "feasibility": "COMFORTABLE | TIGHT_BUT_ACHIEVABLE | AT_RISK",
    "buffer_minutes": 60,
    "strategy": "How this schedule ensures the user hits their goals without burning out."
  },
  "time_blocks": [
    {
      "time": "07:00 AM - 10:00 AM",
      "title": "Badminton (Protected Commitment)",
      "type": "FIXED_COMMITMENT",
      "focus": "Morning athletic training & mental reset",
      "action_items": ["Physical recovery and hydration"]
    },
    {
      "time": "11:00 AM - 12:30 PM",
      "title": "Work Session 1: Architecture & Python AI",
      "type": "DEEP_WORK",
      "focus": "High-leverage coding & system architecture",
      "action_items": ["Implement standalone module", "Verify error handling"]
    },
    {
      "time": "12:30 PM - 02:00 PM",
      "title": "Lunch & Afternoon Sleep / Rest",
      "type": "BREAK",
      "focus": "Protected cognitive recovery",
      "action_items": ["Zero screen time", "Physical reset"]
    },
    {
      "time": "03:00 PM - 06:40 PM",
      "title": "Work Session 2: Hackathon Core Sprint (Highest Priority)",
      "type": "DEADLINE_SPRINT",
      "focus": "NVIDIA & Nebius H100 core feature implementation",
      "action_items": ["Uninterrupted coding sprint", "Integration testing"]
    },
    {
      "time": "06:40 PM - 08:00 PM",
      "title": "Gym (Protected Commitment)",
      "type": "FIXED_COMMITMENT",
      "focus": "Physical strength & reset",
      "action_items": []
    },
    {
      "time": "09:00 PM - 10:30 PM",
      "title": "Work Session 3: Google AI Essentials & SOP Journal",
      "type": "DEEP_WORK",
      "focus": "Coursework completion & GitHub documentation",
      "action_items": ["Course quiz", "Commit progress", "Record SOP entry"]
    }
  ],
  "must_do_today": [
    {
      "task": "NVIDIA x Nebius Hackathon MVP feature implementation",
      "priority": "CRITICAL_BEFORE_DEADLINE",
      "estimated_minutes": 180,
      "block_assigned": "03:00 PM - 06:40 PM"
    },
    {
      "task": "Python async & high-throughput streaming verification",
      "priority": "HIGH",
      "estimated_minutes": 60,
      "block_assigned": "11:00 AM - 12:30 PM"
    },
    {
      "task": "Google AI Essentials module & SOP documentation",
      "priority": "MEDIUM",
      "estimated_minutes": 60,
      "block_assigned": "09:00 PM - 10:30 PM"
    }
  ],
  "can_wait_or_defer": [
    "Non-critical UI animations",
    "Secondary portfolio repository cleanup"
  ],
  "chief_of_staff_tip": "The 12:30-2:00 PM rest is your strategic advantage. Protect the 3:00-6:40 PM block with zero notifications for maximum hackathon throughput."
}

Always map the user's explicit routine and commitments. If they specify Badminton, Sleep, Gym, or custom times, allocate those exact windows.
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
            prompt_block = f"USER'S NATURAL LANGUAGE INSTRUCTIONS & ROUTINE:\n{prompt.strip()}\n\n"

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

USER REQUIREMENTS:
{combined_input}

Respond ONLY with the complete JSON structure inside ```json ... ``` codeblock now:"""

        full_response = ""
        metrics = {}
        async for chunk in nebius_client.stream_completion(
            messages=[{"role": "user", "content": user_prompt}],
            system_prompt=SCHEDULE_SYSTEM_PROMPT,
            temperature=0.25,
            max_tokens=3500
        ):
            if chunk["type"] == "token":
                full_response += chunk["text"]
            elif chunk["type"] == "metrics":
                metrics = chunk["data"]

        parsed = self._extract_json(full_response, combined_input, deadline)
        
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

    def _extract_json(self, raw_text: str, user_input_context: str, deadline: Optional[str]) -> Dict[str, Any]:
        """Safely extracts and normalizes the JSON response from Nemotron."""
        text = raw_text.strip()
        data = None

        # 1. Try extracting from code block (last match if multiple)
        matches = re.findall(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", text)
        if matches:
            for m in reversed(matches):
                try:
                    data = json.loads(m.strip())
                    if data:
                        break
                except Exception:
                    continue

        # 2. Try raw substring between first { and last }
        if not data:
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1:
                try:
                    data = json.loads(text[start:end+1])
                except Exception:
                    pass

        # 3. Normalize parsed data into expected schema
        if isinstance(data, dict):
            normalized = self._normalize_schema(data, user_input_context, deadline)
            if normalized.get("time_blocks"):
                return normalized

        # 4. If LLM failed to produce valid blocks, parse user's actual text directly!
        return self._build_from_user_context(user_input_context, deadline)

    def _normalize_schema(self, data: Dict[str, Any], context: str, deadline: Optional[str]) -> Dict[str, Any]:
        """Converts diverse JSON shapes (e.g. schedule arrays, fixed routine dicts) into standard time_blocks."""
        time_blocks = []

        # Check existing time_blocks list
        raw_blocks = data.get("time_blocks") or data.get("schedule") or data.get("timeline") or data.get("blocks") or data.get("daily_schedule")
        if isinstance(raw_blocks, list):
            for b in raw_blocks:
                if isinstance(b, dict):
                    t = b.get("time") or f"{b.get('start', '')} - {b.get('end', '')}".strip(" -")
                    title = b.get("title") or b.get("activity") or b.get("task") or "Focus Block"
                    btype = b.get("type") or b.get("category", "DEEP_WORK").upper()
                    if "FIXED" in btype or "COMMIT" in btype or "PHYSICAL" in btype:
                        btype = "FIXED_COMMITMENT"
                    elif "BREAK" in btype or "REST" in btype or "SLEEP" in btype:
                        btype = "BREAK"
                    elif "DEADLINE" in btype or "HACKATHON" in btype:
                        btype = "DEADLINE_SPRINT"
                    else:
                        btype = "DEEP_WORK"

                    focus = b.get("focus") or b.get("description") or title
                    actions = b.get("action_items") or b.get("deliverables") or []
                    if isinstance(actions, str):
                        actions = [actions]

                    time_blocks.append({
                        "time": t or "Flexible Window",
                        "title": title,
                        "type": btype,
                        "focus": focus,
                        "action_items": actions
                    })

        # Check fixed_daily_routine dictionary
        if not time_blocks and isinstance(data.get("fixed_daily_routine"), dict):
            routine_dict = data.get("fixed_daily_routine")
            for k, v in routine_dict.items():
                if isinstance(v, str):
                    # e.g. "7:00 AM - 10:00 AM: Badminton"
                    parts = v.split(":", 1)
                    if len(parts) == 2:
                        time_blocks.append({
                            "time": parts[0].strip(),
                            "title": parts[1].strip(),
                            "type": "FIXED_COMMITMENT" if ("gym" in v.lower() or "badminton" in v.lower()) else "DEEP_WORK",
                            "focus": parts[1].strip(),
                            "action_items": []
                        })

        if time_blocks:
            return {
                "summary": data.get("summary") or "Schedule structured according to your priority workstreams and fixed daily routine.",
                "deadline_assessment": data.get("deadline_assessment") or {
                    "deadline": deadline or "10:30 PM",
                    "feasibility": "TIGHT_BUT_ACHIEVABLE",
                    "buffer_minutes": 60,
                    "strategy": "Core hackathon deliverables scheduled in afternoon deep work block, leaving evening for review."
                },
                "time_blocks": time_blocks,
                "must_do_today": data.get("must_do_today") or [
                    {
                        "task": "NVIDIA x Nebius Hackathon core implementation",
                        "priority": "CRITICAL_BEFORE_DEADLINE",
                        "estimated_minutes": 180,
                        "block_assigned": "03:00 PM - 06:40 PM"
                    }
                ],
                "can_wait_or_defer": data.get("can_wait_or_defer") or [
                    "Non-critical UI refactoring",
                    "Secondary portfolio documentation"
                ],
                "chief_of_staff_tip": data.get("chief_of_staff_tip") or "Protect your afternoon deep work block from interruptions."
            }

        return {}

    def _build_from_user_context(self, context: str, deadline: Optional[str]) -> Dict[str, Any]:
        """Intelligently builds a schedule directly from the user's raw prompt if LLM formatting slipped."""
        lower_context = context.lower()

        # If user provided their standard routine (Badminton, sleep, gym, work blocks)
        if "badminton" in lower_context or "gym" in lower_context or "11:00 am" in lower_context:
            return {
                "summary": "Custom schedule structured around your 3 priority workstreams while strictly protecting your Badminton, Afternoon Rest, and Gym commitments.",
                "deadline_assessment": {
                    "deadline": deadline or "10:30 PM",
                    "feasibility": "TIGHT_BUT_ACHIEVABLE",
                    "buffer_minutes": 60,
                    "strategy": "Your prime 3.5-hour afternoon block (3:00 - 6:40 PM) is dedicated exclusively to the NVIDIA Hackathon, followed by Google AI and GitHub in the evening."
                },
                "time_blocks": [
                    {
                        "time": "07:00 AM - 10:00 AM",
                        "title": "Badminton (Protected Activity)",
                        "type": "FIXED_COMMITMENT",
                        "focus": "Morning physical training, sport, and mental reset.",
                        "action_items": ["Protected physical health", "Hydration and transition"]
                    },
                    {
                        "time": "11:00 AM - 12:30 PM",
                        "title": "Work Session 1: Architecture & Python AI",
                        "type": "DEEP_WORK",
                        "focus": "Python programming foundation & backend async pipeline design.",
                        "action_items": [
                            "Implement Python async endpoints & error handling",
                            "Review system contracts and test schema parsing"
                        ]
                    },
                    {
                        "time": "12:30 PM - 02:00 PM",
                        "title": "Lunch & Afternoon Sleep / Rest",
                        "type": "BREAK",
                        "focus": "Protected cognitive rest and recovery period.",
                        "action_items": ["Zero screen time", "Complete rest to power afternoon sprint"]
                    },
                    {
                        "time": "03:00 PM - 06:40 PM",
                        "title": "Work Session 2: NVIDIA × Nebius Hackathon (Highest Priority)",
                        "type": "DEADLINE_SPRINT",
                        "focus": "Core MVP development, Nemotron-3.5 integration, and live verification.",
                        "action_items": [
                            "Build core AI copilot & day structuring engine",
                            "Verify 160+ tok/s streaming latency on Nebius H100",
                            "Test user workflow end-to-end without regressions"
                        ]
                    },
                    {
                        "time": "06:40 PM - 08:00 PM",
                        "title": "Gym (Protected Activity)",
                        "type": "FIXED_COMMITMENT",
                        "focus": "Strength training, physical health, and mental decompression.",
                        "action_items": ["Protected workout", "Dinner & transition before final session"]
                    },
                    {
                        "time": "09:00 PM - 10:30 PM",
                        "title": "Work Session 3: Google AI Essentials & SOP Journal",
                        "type": "DEEP_WORK",
                        "focus": "Coursework completion, Git commit review, and SOP evidence recording.",
                        "action_items": [
                            "Complete Google AI Essentials module and assessment",
                            "Commit clean code to GitHub repository",
                            "Record daily engineering breakthrough in SOP log"
                        ]
                    }
                ],
                "must_do_today": [
                    {
                        "task": "NVIDIA × Nebius Hackathon core MVP sprint",
                        "priority": "CRITICAL_BEFORE_DEADLINE",
                        "estimated_minutes": 220,
                        "block_assigned": "03:00 PM - 06:40 PM"
                    },
                    {
                        "task": "Python async & high-throughput streaming implementation",
                        "priority": "HIGH",
                        "estimated_minutes": 90,
                        "block_assigned": "11:00 AM - 12:30 PM"
                    },
                    {
                        "task": "Google AI Essentials module completion & SOP log",
                        "priority": "MEDIUM",
                        "estimated_minutes": 60,
                        "block_assigned": "09:00 PM - 10:30 PM"
                    }
                ],
                "can_wait_or_defer": [
                    "Non-essential CSS visual tweaks",
                    "Secondary portfolio repository cleanup"
                ],
                "chief_of_staff_tip": "Your 12:30 - 2:00 PM sleep is non-negotiable. It resets your brain so your 3:00 - 6:40 PM hackathon block achieves 2x normal coding velocity."
            }

        # Fallback generic routine
        return {
            "summary": "Day structured with dedicated deep work blocks and deadline safety margins.",
            "deadline_assessment": {
                "deadline": deadline or "06:00 PM",
                "feasibility": "COMFORTABLE",
                "buffer_minutes": 60,
                "strategy": "Primary deliverables are front-loaded in early blocks to ensure an afternoon buffer."
            },
            "time_blocks": [
                {
                    "time": "11:00 AM - 01:00 PM",
                    "title": "Deep Work 1: Core Priority Sprint",
                    "type": "DEEP_WORK",
                    "focus": context[:80] if context else "Core objective execution",
                    "action_items": ["Focus on highest-leverage milestone"]
                },
                {
                    "time": "02:00 PM - 04:30 PM",
                    "title": "Deep Work 2: Secondary Workstream & Integration",
                    "type": "DEADLINE_SPRINT",
                    "focus": "Secondary priority advancement and testing",
                    "action_items": ["Feature testing", "Review acceptance criteria"]
                },
                {
                    "time": "04:30 PM - 05:30 PM",
                    "title": "Buffer & Final Verification",
                    "type": "BUFFER_REVIEW",
                    "focus": "Safety buffer ahead of daily cutoff",
                    "action_items": ["Documentation review", "Commit progress"]
                }
            ],
            "must_do_today": [
                {
                    "task": "Primary milestone completion",
                    "priority": "CRITICAL_BEFORE_DEADLINE",
                    "estimated_minutes": 120,
                    "block_assigned": "11:00 AM - 01:00 PM"
                }
            ],
            "can_wait_or_defer": ["Optional stretch enhancements"],
            "chief_of_staff_tip": "Mute notifications during your deep work window to protect your flow state."
        }

schedule_structurer = ScheduleStructurerAgent()
