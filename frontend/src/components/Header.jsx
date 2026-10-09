import React from 'react';
import { Cpu, Plus, Command, Settings, Sparkles } from 'lucide-react';
import SpeedometerWidget from './SpeedometerWidget';
import SynapseCore3D from './SynapseCore3D';

export default function Header({ metrics, stats, onOpenCapture, onOpenSettings, isDemoMode }) {
  return (
    <header className="border-b border-purple-500/20 bg-obsidian-950/85 backdrop-blur-2xl sticky top-0 z-40 px-6 py-2.5 flex items-center justify-between shadow-[0_4px_30px_rgba(3,0,20,0.8)]">
      {/* Brand & Track */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative w-10 h-10 rounded-xl bg-obsidian-950 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-950">
            <span className="text-xl">🧠</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
              <span className="bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                SynapseOS
              </span>
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20">
              Personal AI
            </span>
          </div>
          <p className="text-[11px] text-purple-300/60 font-medium">
            Ambient Cognitive Copilot & Contextual Second Brain
          </p>
        </div>
      </div>

      {/* Telemetry & Badges */}
      <div className="flex items-center gap-3.5">
        {/* Interactive 3D Holographic Core */}
        <div className="hidden md:flex">
          <SynapseCore3D metrics={metrics} isDemoMode={isDemoMode} />
        </div>

        {/* Model & Providers Chip */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-900/90 border border-purple-500/20 text-xs font-mono shadow-sm">
          <div className="flex items-center gap-1.5 text-nvidia-green">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nvidia-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-nvidia-green"></span>
            </span>
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-semibold">Nemotron-3.5</span>
          </div>
          <div className="h-3 w-px bg-purple-900/50" />
          <span className="text-[11px] text-nebius-cyan font-medium">Nebius H100</span>
          <div className="h-3 w-px bg-purple-900/50" />
          <span className="text-[11px] text-purple-300 font-medium">Tavily Search</span>
        </div>

        {/* Animated Speedometer Tachometer */}
        <SpeedometerWidget metrics={metrics} />

        {/* Quick Capture Button */}
        <button
          onClick={onOpenCapture}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all duration-200 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Capture</span>
          <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono border border-white/10">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>

        {/* Settings / BYOK Button */}
        <button
          onClick={onOpenSettings}
          title="Settings & API Key Providers"
          className="p-2 rounded-xl bg-obsidian-900/90 hover:bg-purple-950/60 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-400/60 transition-all shadow-sm"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
