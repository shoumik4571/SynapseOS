import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Plus, Command, Settings } from 'lucide-react';
import SpeedometerWidget from './SpeedometerWidget';

export default function Header({ metrics, stats, onOpenCapture, onOpenSettings, isDemoMode }) {
  return (
    <header className="border-b border-neutral-800/80 bg-black/90 backdrop-blur-xl sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
      {/* Brand & Track */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="flex items-center gap-3 cursor-default"
      >
        <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-lg shadow-sm">
          🧠
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-white">
              SynapseOS
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800">
              Personal AI
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Ambient Cognitive Copilot & Contextual Second Brain
          </p>
        </div>
      </motion.div>

      {/* Clean Telemetry & White Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Model Chip */}
        <motion.div 
          whileHover={{ scale: 1.04 }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-medium">Nemotron-3.5</span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-300">Nebius H100</span>
        </motion.div>

        {/* Speedometer */}
        <SpeedometerWidget metrics={metrics} />

        {/* Crisp White Quick Capture Button */}
        <motion.button
          onClick={onOpenCapture}
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-md shadow-white/10 active:scale-95 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Quick Capture</span>
          <span className="hidden sm:inline-flex items-center text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded font-mono font-medium">
            ⌘K
          </span>
        </motion.button>

        {/* Settings Button */}
        <motion.button
          onClick={onOpenSettings}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title="Settings & API Key Providers"
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      </div>
    </header>
  );
}
