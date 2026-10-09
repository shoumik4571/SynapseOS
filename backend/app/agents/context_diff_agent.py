"""
Context Switch Diff Agent for SynapseOS.
Preserves flow state by computing the mental diff between what you were
working on previously and your target task, eliminating context reload fatigue.
"""

from typing import Dict, Any, List
from app.memory_store import memory_store
from app.nebius_client import nebius_client

DIFF_SYSTEM_PROMPT = """You are SynapseOS, an expert flow-state guardian and cognitive diff engineer.
When a developer or creator switches tasks or returns to work after a break, the reload cost is massive.

Your job is to read their recent context and produce a sharp, 3-point "Context Reload Diff":
1. 📍 **Where You Left Off**: Exactly what was actively being changed or thought about.
2. 🧠 **Mental Cache to Reload**: 2-3 essential architectural details or assumptions they need in mind.
3. 🚀 **First Immediate Next Step**: The single micro-action that restores forward momentum in under 60 seconds.

Be concise, dense with high-value technical context, and completely avoid fluff.
"""

class ContextDiffAgent:
    async def compute_context_diff(self, target_topic: str = "") -> Dict[str, Any]:
        recent_items = memory_store.get_recent_items(limit=10)
        
        context_snippets = []
        for item in recent_items:
            snippet = f"[{item['item_type'].upper()}: {item['title']}]\n{item['sanitized_content'][:400]}"
            context_snippets.append(snippet)

        joined_context = "\n\n".join(context_snippets) if context_snippets else "No prior context logged."

        prompt = f"""RECENT ACTIVITY SNAPSHOT:
{joined_context}

TARGET TASK / CONTEXT FOCUS:
{target_topic if target_topic else 'Resume ongoing development session'}

Compute the Context Reload Diff now:"""

        full_response = ""
        metrics = {}
        async for chunk in nebius_client.stream_completion(
            messages=[{"role": "user", "content": prompt}],
            system_prompt=DIFF_SYSTEM_PROMPT,
            temperature=0.3,
            max_tokens=800
        ):
            if chunk["type"] == "token":
                full_response += chunk["text"]
            elif chunk["type"] == "metrics":
                metrics = chunk["data"]

        return {
            "target_topic": target_topic,
            "diff_markdown": full_response,
            "metrics": metrics
        }

context_diff_agent = ContextDiffAgent()
