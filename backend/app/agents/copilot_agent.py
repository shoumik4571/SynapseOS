"""
Flow-State Copilot Agent for SynapseOS.
Conversational thought partner powered by NVIDIA Nemotron-3.5-Lightning on Nebius Token Factory,
with contextual memory retrieval and privacy-preserving guardrails.
"""

from typing import AsyncGenerator, Dict, Any, List
from app.memory_store import memory_store
from app.nebius_client import nebius_client
from app.guardrails import PrivacyGuardrail

COPILOT_SYSTEM_PROMPT = """You are SynapseOS, an ambient proactive cognitive copilot and intellectual sparring partner.
You assist the user in deep technical problem solving, coding, architectural design, and workflow orchestration.

Guidelines:
- Ground your responses in the retrieved workspace context and notes when applicable.
- Answer directly with extreme technical precision and high information density.
- Suggest actionable next steps or code implementations when relevant.
- Respect privacy: Never regurgitate or request sensitive credentials or secrets.
"""

class CopilotAgent:
    async def chat_stream(
        self,
        session_id: str,
        user_message: str,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        # 1. Sanitize user message
        safe_message, redactions = PrivacyGuardrail.sanitize(user_message)
        if redactions:
            yield {
                "type": "guardrail_alert",
                "redactions_count": len(redactions),
                "message": f"Sanitized {len(redactions)} sensitive credential(s)/PII locally before sending to Nebius Token Factory."
            }

        # 2. Retrieve relevant context memory (RAG)
        context_items = memory_store.search_context(query=safe_message, limit=4)
        context_block = ""
        if context_items:
            context_block = "RELEVANT WORKSPACE CONTEXT & NOTES:\n" + "\n\n".join(
                [f"[{item['item_type'].upper()}: {item['title']}]\n{item['sanitized_content'][:600]}" for item in context_items]
            )

        # 3. Retrieve prior chat history
        history = memory_store.get_chat_history(session_id=session_id, limit=6)
        messages: List[Dict[str, str]] = []

        if context_block:
            messages.append({"role": "system", "content": context_block})

        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": safe_message})

        # Save user message
        memory_store.save_chat_message(session_id=session_id, role="user", content=safe_message)

        # 4. Stream response from Nebius Token Factory
        assistant_reply = []
        last_metrics = {}

        async for chunk in nebius_client.stream_completion(
            messages=messages,
            system_prompt=COPILOT_SYSTEM_PROMPT,
            temperature=0.6,
            max_tokens=2048
        ):
            if chunk["type"] == "token":
                assistant_reply.append(chunk["text"])
            elif chunk["type"] == "metrics":
                last_metrics = chunk["data"]

            yield chunk

        # Save assistant message to memory store
        full_assistant_text = "".join(assistant_reply)
        if full_assistant_text:
            memory_store.save_chat_message(
                session_id=session_id,
                role="assistant",
                content=full_assistant_text,
                metrics=last_metrics
            )

copilot_agent = CopilotAgent()
