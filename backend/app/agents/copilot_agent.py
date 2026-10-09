"""
Flow-State Copilot Agent for SynapseOS.
Conversational thought partner powered by NVIDIA Nemotron-3.5-Lightning on Nebius Token Factory,
with contextual memory retrieval and privacy-preserving guardrails.
"""

from typing import AsyncGenerator, Dict, Any, List, Optional
from app.memory_store import memory_store
from app.nebius_client import nebius_client
from app.guardrails import PrivacyGuardrail
from app.tavily_search import tavily_client

COPILOT_SYSTEM_PROMPT = """You are SynapseOS, an ambient proactive cognitive copilot and intellectual sparring partner.
You assist the user in deep technical problem solving, coding, architectural design, and workflow orchestration.

Guidelines:
- Ground your responses in both the retrieved workspace context and any live Tavily web research provided.
- If web sources are provided, synthesize them with extreme technical precision and cite relevant findings.
- Answer directly with high information density.
- Suggest actionable next steps or code implementations when relevant.
- Respect privacy: Never regurgitate or request sensitive credentials or secrets.
"""

class CopilotAgent:
    async def chat_stream(
        self,
        session_id: str,
        user_message: str,
        enable_web_search: bool = True,
        custom_tavily_key: Optional[str] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        # 1. Sanitize user message
        safe_message, redactions = PrivacyGuardrail.sanitize(user_message)
        if redactions:
            yield {
                "type": "guardrail_alert",
                "redactions_count": len(redactions),
                "message": f"Sanitized {len(redactions)} sensitive credential(s)/PII locally before sending to Nebius Token Factory."
            }

        # 2. Live Web Search via Tavily ($3,000 Hackathon Prize Track)
        web_context_block = ""
        if enable_web_search:
            yield {
                "type": "tavily_status",
                "status": "searching",
                "query": safe_message
            }
            search_data = await tavily_client.search(
                query=safe_message,
                max_results=3,
                custom_key=custom_tavily_key
            )
            if search_data.get("results"):
                yield {
                    "type": "tavily_sources",
                    "sources": search_data["results"],
                    "response_time": search_data.get("response_time")
                }
                sources_text = "\n\n".join([
                    f"[Source: {s['title']} ({s['url']})]\n{s['content']}"
                    for s in search_data["results"]
                ])
                web_context_block = f"LIVE WEB KNOWLEDGE (via Tavily Search):\n{sources_text}\n\n"
            else:
                yield {
                    "type": "tavily_status",
                    "status": "idle"
                }

        # 3. Retrieve relevant local workspace context memory (RAG)
        context_items = memory_store.search_context(query=safe_message, limit=3)
        local_context_block = ""
        if context_items:
            local_context_block = "LOCAL WORKSPACE CONTEXT & NOTES:\n" + "\n\n".join(
                [f"[{item['item_type'].upper()}: {item['title']}]\n{item['sanitized_content'][:500]}" for item in context_items]
            )

        # 4. Construct messages with hybrid context
        history = memory_store.get_chat_history(session_id=session_id, limit=6)
        messages: List[Dict[str, str]] = []

        combined_system = web_context_block + local_context_block
        if combined_system:
            messages.append({"role": "system", "content": combined_system})

        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": safe_message})

        # Save user message
        memory_store.save_chat_message(session_id=session_id, role="user", content=safe_message)

        # 5. Stream response from Nebius Token Factory
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
