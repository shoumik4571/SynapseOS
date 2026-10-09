import React from 'react';
import { Cpu, Plus, Command, Settings } from 'lucide-react';
import SpeedometerWidget from './SpeedometerWidget';

export default function Header({ metrics, stats, onOpenCapture, onOpenSettings, isDemoMode }) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-xl sticky top-0 z-40 px-6 py-2.5 flex items-center justify-between">
      {/* Brand & Track */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-nvidia-green to-nebius-cyan p-0.5 shadow-lg shadow-nvidia-green/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <span className="text-xl">🧠</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>SynapseOS</span>
            </h1>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-nebius-cyan border border-nebius-cyan/30">
              Personal AI
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Ambient Cognitive Copilot & Contextual Second Brain</p>
        </div>
      </div>

      {/* Telemetry & Badges */}
      <div className="flex items-center gap-4">
        {/* Model & Providers */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-nvidia-green">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nvidia-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-nvidia-green"></span>
            </span>
            <Cpu className="w-3.5 h-3.5" />
            <span>Nemotron-3.5-Lightning</span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <span className="text-[11px] text-nebius-cyan">Nebius Token Factory</span>
          <div className="h-3 w-px bg-slate-800" />
          <span className="text-[11px] text-blue-400">Tavily Search</span>
        </div>

        {/* Animated Speedometer Tachometer */}
        <SpeedometerWidget metrics={metrics} />

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

        {/* Settings / BYOK Button */}
        <button
          onClick={onOpenSettings}
          title="Settings & API Key Providers"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
