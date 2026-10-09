import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, RefreshCw, AlertCircle, Lightbulb, CheckSquare, Square, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BriefingView({ briefing, onRegenerate, loading }) {
  const [completedPriorities, setCompletedPriorities] = useState({});

  const togglePriority = (idx) => {
    setCompletedPriorities(prev => {
      const isNowDone = !prev[idx];
      if (isNowDone) {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.7 },
          colors: ['#FFFFFF', '#A855F7', '#10B981']
        });
      }
      return {
        ...prev,
        [idx]: isNowDone
      };
    });
  };

  const data = briefing?.briefing || briefing || {};
  const priorities = data.priorities || briefing?.priorities || [];
  const openLoops = data.open_loops || briefing?.open_loops || [];
  const summary = data.summary || briefing?.summary || "Deep work session initialized. Workspace context ingested.";
  const proactiveTip = data.proactive_tip || briefing?.proactive_tip;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner with Subtle Hover Magnification */}
      <motion.div 
        whileHover={{ scale: 1.012, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Calendar className="w-3.5 h-3.5 text-white" />
            <span>EXECUTIVE BRIEFING • {briefing?.date_str || briefing?.date || "2026-10-09"}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Focus & Alignment Kickoff
          </h2>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Crisp White Action Button with Micro-Interaction */}
        <motion.button
          onClick={onRegenerate}
          disabled={loading}
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-md shadow-white/10 disabled:opacity-50 flex-shrink-0 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Synthesizing..." : "Regenerate with Nemotron"}</span>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* High-Leverage Priorities Section with Magnification */}
        <motion.div 
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-lg"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Target className="w-4 h-4 text-white" />
            <span>High-Leverage Priorities Today</span>
          </div>

          <div className="space-y-2">
            {priorities.map((p, idx) => {
              const done = completedPriorities[idx];
              return (
                <motion.div
                  key={idx}
                  onClick={() => togglePriority(idx)}
                  whileHover={{ scale: 1.025, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 450, damping: 22 }}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    done
                      ? "bg-black/60 border-neutral-900 opacity-40 line-through text-neutral-500"
                      : "bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 text-neutral-200 shadow-sm"
                  }`}
                >
                  <motion.button 
                    whileTap={{ scale: 1.3 }}
                    className="mt-0.5 text-white flex-shrink-0"
                  >
                    {done ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-neutral-500" />}
                  </motion.button>
                  <span className="text-xs leading-relaxed">{p}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Open Loops & Cognitive Advice with Magnification */}
        <div className="space-y-6">
          {/* Open Loops */}
          <motion.div 
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 shadow-lg"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <AlertCircle className="w-4 h-4" />
              <span>Open Loops & Unresolved Threads</span>
            </div>
            <ul className="space-y-2">
              {openLoops.map((loop, idx) => (
                <motion.li 
                  key={idx} 
                  whileHover={{ scale: 1.02, x: 3 }}
                  className="flex items-start gap-2.5 text-xs text-neutral-300 bg-neutral-900/70 p-3 rounded-xl border border-neutral-800/80"
                >
                  <span className="text-amber-400 font-bold">•</span>
                  <span className="leading-relaxed">{loop}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Proactive Tip */}
          {proactiveTip && (
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-3 shadow-md"
            >
              <Lightbulb className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Cognitive Advice</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {proactiveTip}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
