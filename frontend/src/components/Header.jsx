import React from 'react';
import { Cpu, Zap, Shield, Plus, Command } from 'lucide-react';

export default function Header({ metrics, stats, onOpenCapture }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
      {/* Brand & Track */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-nvidia-green to-nebius-cyan flex items-center justify-center shadow-lg shadow-nvidia-green/20">
          <span className="text-xl">🧠</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white">SynapseOS</h1>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-nebius-cyan border border-nebius-cyan/30">
              Personal AI
            </span>
          </div>
          <p className="text-xs text-slate-400">Ambient Cognitive Copilot & Contextual Second Brain</p>
        </div>
      </div>

      {/* Speedometer & Token Factory Telemetry */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
          {/* Nebius Badge */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nebius-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-nebius-cyan"></span>
            </span>
            <span className="text-xs font-medium text-slate-300">Nebius Token Factory</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* NVIDIA Model */}
          <div className="flex items-center gap-1.5 text-xs text-nvidia-green font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>Nemotron-3.5-Lightning</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Live Speedometer */}
          <div className="flex items-center gap-1 text-xs">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-slate-400">Speed:</span>
            <span className="font-mono font-bold text-white">
              {metrics?.tokens_per_second || "100+"}
            </span>
            <span className="text-[10px] text-slate-500">tok/s</span>
          </div>

          {metrics?.ttft_ms && (
            <>
              <div className="h-4 w-px bg-slate-800" />
              <div className="text-[11px] text-slate-400 font-mono">
                TTFT: <span className="text-slate-200">{metrics.ttft_ms}ms</span>
              </div>
            </>
          )}
        </div>

        {/* Quick Capture Button */}
        <button
          onClick={onOpenCapture}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-nvidia-green hover:bg-nvidia-dark text-slate-950 font-semibold text-xs shadow-md shadow-nvidia-green/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Capture</span>
          <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>
      </div>
    </header>
  );
}
