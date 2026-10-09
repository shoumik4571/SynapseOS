#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "🧠 Starting SynapseOS (Nebius x NVIDIA Hackathon 2026)..."

# 1. Start Python Backend
echo "⚡ Launching FastAPI Backend on http://localhost:8000..."
(cd backend && ./venv/bin/python -m app.main) &
BACKEND_PID=$!

# 2. Start Frontend
echo "💻 Launching Vite React Dashboard on http://localhost:3000..."
cd frontend
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

trap "echo 'Stopping SynapseOS...'; kill $BACKEND_PID $FRONTEND_PID" EXIT

echo ""
echo "🚀 SynapseOS is live!"
echo "👉 Dashboard: http://localhost:3000"
echo "👉 API Docs:  http://localhost:8000/docs"
echo ""

wait
