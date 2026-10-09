import React, { useState } from 'react';
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
          colors: ['#A855F7', '#C084FC', '#FFFFFF']
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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 rounded-2xl bg-[#0d091a]/80 border border-white/[0.08] backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>EXECUTIVE SESSION BRIEFING • {briefing?.date_str || briefing?.date || "2026-10-09"}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Focus & Alignment Kickoff
          </h2>
          <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
            {summary}
          </p>
        </div>

        <button
          onClick={onRegenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50 flex-shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Synthesizing..." : "Regenerate with Nemotron"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* High-Leverage Priorities */}
        <div className="p-6 rounded-2xl bg-[#0d091a]/80 border border-white/[0.08] backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Target className="w-4 h-4 text-purple-400" />
            <span>High-Leverage Priorities Today</span>
          </div>

          <div className="space-y-2">
            {priorities.map((p, idx) => {
              const done = completedPriorities[idx];
              return (
                <div
                  key={idx}
                  onClick={() => togglePriority(idx)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    done
                      ? "bg-[#06040d]/40 border-white/[0.04] opacity-40 line-through text-zinc-500"
                      : "bg-[#080512]/80 border-white/[0.06] hover:border-purple-500/30 text-zinc-200"
                  }`}
                >
                  <button className="mt-0.5 text-purple-400">
                    {done ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-zinc-600" />}
                  </button>
                  <span className="text-xs leading-relaxed">{p}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Open Loops & Cognitive Advice */}
        <div className="space-y-6">
          {/* Open Loops */}
          <div className="p-6 rounded-2xl bg-[#0d091a]/80 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <AlertCircle className="w-4 h-4" />
              <span>Open Loops & Unresolved Threads</span>
            </div>
            <ul className="space-y-2">
              {openLoops.map((loop, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-[#080512]/80 p-3 rounded-xl border border-white/[0.06]">
                  <span className="text-amber-400 font-bold">•</span>
                  <span className="leading-relaxed">{loop}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Proactive Tip */}
          {proactiveTip && (
            <div className="p-5 rounded-2xl bg-[#0d091a]/80 border border-purple-500/20 backdrop-blur-xl flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider font-mono">Cognitive Advice</h4>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {proactiveTip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
