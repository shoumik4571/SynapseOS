import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Plus, Command, Settings, Download, Award } from 'lucide-react';
import SpeedometerWidget from './SpeedometerWidget';

export default function Header({ metrics, stats, onOpenCapture, onOpenSettings, onOpenDownload, onSelectTab, isDemoMode }) {
  return (
    <header className="border-b border-neutral-800/80 bg-black/95 backdrop-blur-2xl sticky top-0 z-40 px-4 sm:px-6 py-2.5 flex items-center justify-between">
      {/* Brand & Track */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="flex items-center gap-3 cursor-default"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 p-[1px] shadow-md">
          <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center text-lg">
            🧠
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-display">
              Synapse<span className="text-violet-400">OS</span>
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 text-violet-300 border border-violet-500/30 font-semibold">
              Hackathon 2026
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 font-mono hidden sm:block">
            NVIDIA Nemotron-3.5 • Nebius Token Factory H100
          </p>
        </div>
      </motion.div>

      {/* Center Rubric Shortcut (Clickable for Judges) */}
      <button
        onClick={() => onSelectTab && onSelectTab('guide')}
        className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 hover:border-violet-400 text-violet-300 text-xs font-mono transition-colors"
      >
        <Award className="w-3.5 h-3.5 text-amber-400" />
        <span>Judges Evaluation Guide</span>
      </button>

      {/* Clean Telemetry & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Speedometer */}
        <SpeedometerWidget metrics={metrics} />

        {/* Download Native App Button */}
        <motion.button
          onClick={onOpenDownload}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700/80 font-medium text-xs transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Get App</span>
        </motion.button>

        {/* Quick Capture Button (⌘K) */}
        <motion.button
          onClick={onOpenCapture}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs shadow-md shadow-white/10 active:scale-95 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Capture</span>
          <span className="hidden sm:inline-flex items-center text-[10px] bg-neutral-200 text-neutral-800 px-1 py-0.2 rounded font-mono">
            ⌘K
          </span>
        </motion.button>

        {/* Settings Button */}
        <motion.button
          onClick={onOpenSettings}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title="Settings & BYOK"
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      </div>
    </header>
  );
}
