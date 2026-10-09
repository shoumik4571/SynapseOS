import React from 'react';
import { Cpu, Plus, Command, Settings } from 'lucide-react';
import SpeedometerWidget from './SpeedometerWidget';

export default function Header({ metrics, stats, onOpenCapture, onOpenSettings, isDemoMode }) {
  return (
    <header className="border-b border-white/[0.08] bg-[#07050f]/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
      {/* Brand & Track */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/20 flex items-center justify-center text-lg shadow-sm">
          🧠
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-white">
              SynapseOS
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/50 text-purple-300 border border-purple-500/20">
              Personal AI
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Ambient Cognitive Copilot & Contextual Second Brain
          </p>
        </div>
      </div>

      {/* Clean Telemetry & Actions */}
      <div className="flex items-center gap-3">
        {/* Model Chip */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d091a] border border-white/[0.08] text-xs font-mono text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-nvidia-green" />
          <span className="text-zinc-200">Nemotron-3.5</span>
          <span className="text-zinc-600">•</span>
          <span className="text-purple-300">Nebius H100</span>
        </div>

        {/* Speedometer */}
        <SpeedometerWidget metrics={metrics} />

        {/* Quick Capture Button */}
        <button
          onClick={onOpenCapture}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Capture</span>
          <span className="hidden sm:inline-flex items-center text-[10px] bg-purple-800/60 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Settings & API Key Providers"
          className="p-2 rounded-xl bg-[#0d091a] hover:bg-purple-950/40 text-zinc-400 hover:text-white border border-white/[0.08] transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
