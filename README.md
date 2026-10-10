# Synapse 🧠⚡

> **Ambient Cognitive Copilot & Contextual Second Brain**  
> *Built for the **Nebius x NVIDIA Global AI Hackathon 2026** — Track: **Personal AI***

[![Nebius AI Cloud](https://img.shields.io/badge/Powered%20By-Nebius%20Token%20Factory-00E5FF?style=for-the-badge&logo=cloud)](https://tokenfactory.nebius.com/)
[![NVIDIA Nemotron](https://img.shields.io/badge/Model-NVIDIA%20Nemotron--3.5--Lightning-76B900?style=for-the-badge&logo=nvidia)](https://build.nvidia.com/)
[![Tavily Search](https://img.shields.io/badge/Web%20Grounding-Tavily%20AI-blue?style=for-the-badge)](https://tavily.com/)
[![Track](https://img.shields.io/badge/Track-Personal%20AI-blueviolet?style=for-the-badge)](https://nebiusglobalaihackathon.devpost.com/)

---

## 🏆 Hackathon Focus & Architecture Highlights

- 🤖 **Track 2: Personal AI**: Autonomous desktop OS copilot with ambient context, daily executive briefings, and local SQLite memory graph.
- ⚡ **High-Throughput Inference**: 165+ tok/s streaming powered by `nvidia/Nemotron-3_5-Lightning` on Nebius Token Factory H100 SXM5 clusters.
- 🛡️ **Client-Side Privacy**: NVIDIA NeMo Guardrails on-device PII and credential scrubbing firewall.
- 🔎 **Real-Time Web Grounding**: Deep technical search and citation verification powered by Tavily AI Search API.

---

## 💡 Overview

Most personal AI assistants today are **passive chat bots**: they wait dormant until prompted, possess no awareness of your active workspace, and cause cognitive friction as you constantly re-explain context.

**Synapse** is an **ambient, proactive personal AI copilot** that maintains your flow state by bridging workspace context, thoughts, and high-speed reasoning:

- **Ambient Context Ingestion**: Silently indexes active workspace files, markdown notes, code diffs, and quick captures.
- **Ultra-Fast Streaming via Nebius Token Factory**: Powers continuous reasoning with `nvidia/Nemotron-3_5-Lightning` on Nebius H100 infrastructure at hundreds of tokens per second.
- **Autonomous Goal Decomposer**: Turns ambitious goals into 3-phase strategic roadmaps and daily tactical checklists.
- **Tavily Live Web Grounding**: Performs real-time external research and technical documentation lookup on the fly.
- **NVIDIA NeMo Privacy Guardrails**: Enforces local-first PII and secret redaction—ensuring API keys and personal data are never leaked to the cloud.
- **Ambient Screen Edge HUD**: Smooth slide-in glassmorphic drawer (`Cmd+Shift+S` or hover) for distraction-free glances.

---

## 🏛️ Architecture

```mermaid
flowchart TD
    subgraph Client ["Synapse Frontend (React / Tailwind)"]
        UI["Web Dashboard & Ambient HUD"]
        CmdK["Quick Capture Modal (Cmd+K)"]
        SpeedMeter["Live Token Factory Speedometer"]
        EdgeHUD["Screen Edge Slide-Out HUD (Cmd+Shift+S)"]
    end

    subgraph Backend ["Synapse Backend (FastAPI)"]
        Watcher["Ambient Workspace Watcher"]
        Guardrails["NVIDIA NeMo Privacy Scrubber"]
        MemoryStore["Hybrid Context Store (SQLite + Vector)"]
        TavilyEngine["Tavily Real-Time Web Engine"]
        
        Briefing["Executive Briefing Agent"]
        GoalEngine["Autonomous Goal Agent"]
        ContextDiff["Context Switch Diff Agent"]
        Copilot["Flow-State Copilot Agent"]
    end

    subgraph CloudInfra ["Cloud AI Providers"]
        NebiusCloud["Nebius Token Factory (NVIDIA Nemotron-3.5-Lightning)"]
        TavilyCloud["Tavily AI Search API"]
    end

    UI <--> Backend
    EdgeHUD <--> Backend
    Watcher --> MemoryStore
    Backend --> Guardrails
    Guardrails <--> NebiusCloud
    TavilyEngine <--> TavilyCloud
    NebiusCloud --> SpeedMeter
```

---

## 🚀 Key Features

1. **Executive Morning Briefing & Session Kickoff**: Synthesizes what you were working on yesterday, unresolved threads, and high-leverage priorities for today.
2. **Context Switch Diff**: When switching between projects or tasks, Synapse computes a 3-bullet recap of where you left off.
3. **Ambient Memory Graph**: Inspect your contextual second brain in real-time.
4. **Local-First Privacy**: NeMo Guardrail pipeline sanitizes API keys and PII on your local machine before cloud transmission.
5. **Real-Time Token Throughput Gauge**: Showcases Nebius Token Factory's inference speed (tokens/sec, TTFT) right inside the UI.

---

## 🛠️ Quickstart

### Prerequisites
- Python 3.11+
- Node.js 18+
- Nebius AI Studio API Key ([https://studio.nebius.ai/](https://studio.nebius.ai/))

### 1. Configuration
```bash
cp .env.example .env
# Edit .env with your NEBIUS_API_KEY
```

### 2. Run Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🏆 Hackathon Submission Details

- **Event**: Nebius x NVIDIA Global AI Hackathon 2026
- **Track**: Personal AI
- **Models**: `nvidia/Llama-3.1-Nemotron-70B-Instruct`
- **Infrastructure**: Nebius AI Cloud (Token Factory)
- **Portal**: [https://nebiusglobalaihackathon.devpost.com/](https://nebiusglobalaihackathon.devpost.com/)
