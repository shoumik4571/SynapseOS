import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, MessageSquare, Gauge, ArrowLeftRight, Database } from 'lucide-react';

const TABS = [
  { id: 'briefing', label: 'Executive Briefing', icon: Target },
  { id: 'goals', label: 'Goal Engine', icon: Compass },
  { id: 'chat', label: 'Thought Partner', icon: MessageSquare },
  { id: 'benchmark', label: 'H100 Benchmark', icon: Gauge },
  { id: 'diff', label: 'Context Diff', icon: ArrowLeftRight },
  { id: 'memory', label: 'Memory & Watcher', icon: Database },
];

export default function MagnifyingNav({ activeTab, onSelectTab, isDemoMode }) {
  return (
    <div className="sticky top-[58px] bg-black/90 backdrop-blur-2xl z-30 pt-2 pb-3 flex items-center justify-between border-b border-neutral-800/80">
      {/* Magnifying Navigation Dock */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-950/80 border border-neutral-800 shadow-inner">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              whileHover={{ 
                scale: 1.14, 
                y: -3,
                transition: { type: "spring", stiffness: 450, damping: 22 }
              }}
              whileTap={{ scale: 0.92 }}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors z-10 ${
                isActive
                  ? 'text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {/* Sliding Active White Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute inset-0 bg-white rounded-xl shadow-md shadow-white/20 z-[-1]"
                />
              )}

              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Telemetry Status Chip */}
      <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300"
        >
          <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-cyan-400' : 'bg-emerald-400 animate-pulse'}`} />
          <span>{isDemoMode ? "Interactive Demo" : "Nebius H100 Live"}</span>
        </motion.span>
        <span className="hidden md:inline text-neutral-500">Track 2: Personal AI</span>
      </div>
    </div>
  );
}
