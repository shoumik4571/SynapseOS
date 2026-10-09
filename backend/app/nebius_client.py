"""
Nebius Token Factory Client for NVIDIA Nemotron-3.5-Lightning.
Provides ultra-fast streaming completions with real-time throughput
and latency telemetry (tokens/sec, TTFT).
"""

import time
import asyncio
from typing import AsyncGenerator, Dict, Any, List, Optional
from openai import AsyncOpenAI
from app.config import settings
from app.guardrails import PrivacyGuardrail

class NebiusClient:
    def __init__(self):
        self.api_key = settings.nebius_api_key
        self.base_url = settings.nebius_base_url
        self.model = settings.nebius_model
        self.demo_mode = settings.demo_mode or not self.api_key

        if not self.demo_mode:
            self.client = AsyncOpenAI(
                api_key=self.api_key,
                base_url=self.base_url
            )
        else:
            self.client = None

    async def stream_completion(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.6,
        max_tokens: int = 2048,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Streams completion from Nebius Token Factory with real-time telemetry.
        Yields dictionaries with format:
          {"type": "token", "text": "..."}
          {"type": "reasoning", "text": "..."}
          {"type": "metrics", "data": {...}}
        """
        # Ensure system prompt is present
        sanitized_messages = []
        if system_prompt:
            sanitized_messages.append({"role": "system", "content": system_prompt})

        for msg in messages:
            safe_content, _ = PrivacyGuardrail.sanitize(msg["content"])
            sanitized_messages.append({"role": msg["role"], "content": safe_content})

        start_time = time.perf_counter()
        first_token_time = None
        token_count = 0
        full_text = []

        # If in Demo Mode (e.g. offline testing)
        if self.demo_mode or not self.client:
            async for chunk in self._demo_stream(sanitized_messages):
                yield chunk
            return

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=sanitized_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
            )

            async for chunk in response:
                if not chunk.choices:
                    continue

                delta = chunk.choices[0].delta
                token_text = delta.content or ""
                reasoning_text = getattr(delta, "reasoning_content", None) or getattr(delta, "reasoning", None) or ""

                if first_token_time is None and (token_text or reasoning_text):
                    first_token_time = time.perf_counter()

                if reasoning_text:
                    token_count += 1
                    yield {
                        "type": "reasoning",
                        "text": reasoning_text
                    }

                if token_text:
                    token_count += 1
                    full_text.append(token_text)
                    yield {
                        "type": "token",
                        "text": token_text
                    }

            end_time = time.perf_counter()
            total_time_ms = round((end_time - start_time) * 1000, 1)
            ttft_ms = round((first_token_time - start_time) * 1000, 1) if first_token_time else total_time_ms
            
            gen_duration = (end_time - first_token_time) if first_token_time and end_time > first_token_time else (total_time_ms / 1000.0)
            tokens_per_sec = round(token_count / max(0.001, gen_duration), 1)

            yield {
                "type": "metrics",
                "data": {
                    "provider": "Nebius Token Factory",
                    "model": self.model,
                    "tokens_generated": token_count,
                    "ttft_ms": ttft_ms,
                    "total_time_ms": total_time_ms,
                    "tokens_per_second": tokens_per_sec,
                }
            }

        except Exception as e:
            # Graceful error streaming
            yield {
                "type": "error",
                "message": f"Nebius Token Factory Error: {str(e)}"
            }

    async def _demo_stream(self, messages: List[Dict[str, str]]) -> AsyncGenerator[Dict[str, Any], None]:
        """High-fidelity simulated stream for offline testing."""
        start_time = time.perf_counter()
        await asyncio.sleep(0.08)
        first_token_time = time.perf_counter()

        simulated_response = (
            "I am SynapseOS, your personal proactive cognitive partner powered by NVIDIA Nemotron "
            "running on Nebius Token Factory infrastructure. I have synthesized your recent workspace "
            "activity and notes to keep you in flow state. How can we proceed?"
        )
        words = simulated_response.split(" ")
        for i, word in enumerate(words):
            yield {"type": "token", "text": word + (" " if i < len(words) - 1 else "")}
            await asyncio.sleep(0.02)

        end_time = time.perf_counter()
        total_time_ms = round((end_time - start_time) * 1000, 1)
        ttft_ms = round((first_token_time - start_time) * 1000, 1)
        token_count = len(words)
        tokens_per_sec = round(token_count / max(0.001, (end_time - first_token_time)), 1)

        yield {
            "type": "metrics",
            "data": {
                "provider": "Nebius Token Factory (Simulated)",
                "model": self.model,
                "tokens_generated": token_count,
                "ttft_ms": ttft_ms,
                "total_time_ms": total_time_ms,
                "tokens_per_second": tokens_per_sec,
            }
        }

nebius_client = NebiusClient()
