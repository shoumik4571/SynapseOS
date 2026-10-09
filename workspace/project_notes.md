# SynapseOS — Hackathon Architecture & Priorities

## High-Leverage Goals
- Deliver the Personal AI ambient copilot for the Nebius x NVIDIA Hackathon 2026.
- Benchmark Nebius Token Factory throughput with `nvidia/Nemotron-3_5-Lightning`.
- Implement local-first NeMo privacy guardrails to protect user API keys and PII.
- Build clean Next.js HUD with live tokens/sec speedometer gauge.

## Current Architecture Notes
- Backend: FastAPI async server with SSE streaming.
- Model: Serving Nemotron over Nebius Token Factory.
- Memory: SQLite hybrid store with ambient file watching and semantic recency scoring.
- Privacy boundary: Zero credentials ever sent to cloud.
