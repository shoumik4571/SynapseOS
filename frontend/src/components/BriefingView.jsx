import React, { useState } from 'react';
import { Target, RefreshCw, AlertCircle, Lightbulb, CheckSquare, Square, Calendar, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BriefingView({ briefing, onRegenerate, loading }) {
  const [completedPriorities, setCompletedPriorities] = useState({});

  const togglePriority = (idx) => {
    setCompletedPriorities(prev => {
      const isNowDone = !prev[idx];
      if (isNowDone) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#A855F7', '#C084FC', '#00E5FF', '#76B900']
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
  const summary = data.summary || briefing?.summary || "Synthesizing your active workspace context, recent commits, and open loops...";
  const proactiveTip = data.proactive_tip || briefing?.proactive_tip;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-7 rounded-3xl bg-gradient-to-br from-obsidian-900/90 via-purple-950/30 to-obsidian-950 border border-purple-500/25 shadow-xl shadow-purple-950/40 backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-synapse-purple uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Executive Session Briefing • {briefing?.date_str || briefing?.date || "Today"}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Focus & Alignment Kickoff
            <Sparkles className="w-4 h-4 text-purple-400" />
          </h2>
          <p className="text-sm text-purple-200/70 max-w-2xl leading-relaxed">
            {summary}
          </p>
        </div>

        <button
          onClick={onRegenerate}
          disabled={loading}
          className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold border border-purple-400/40 shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-nebius-cyan" : ""}`} />
          <span>{loading ? "Synthesizing..." : "Regenerate with Nemotron"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* High-Leverage Priorities */}
        <div className="p-6 rounded-3xl bg-obsidian-900/75 border border-purple-500/25 backdrop-blur-xl space-y-4 shadow-lg shadow-purple-950/40">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Target className="w-4 h-4 text-synapse-purple" />
            <span>High-Leverage Priorities Today</span>
          </div>

          <div className="space-y-2.5">
            {priorities.map((p, idx) => {
              const done = completedPriorities[idx];
              return (
                <div
                  key={idx}
                  onClick={() => togglePriority(idx)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    done
                      ? "bg-obsidian-950/40 border-purple-900/30 opacity-50 line-through text-purple-400/50"
                      : "bg-obsidian-950/80 border-purple-500/20 hover:border-purple-400/50 text-purple-100/90 shadow-sm"
                  }`}
                >
                  <button className="mt-0.5 text-synapse-purple">
                    {done ? <CheckSquare className="w-4 h-4 text-synapse-purple" /> : <Square className="w-4 h-4 text-purple-500/40" />}
                  </button>
                  <span className="text-xs leading-relaxed">{p}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Open Loops & Cognitive Tips */}
        <div className="space-y-6">
          {/* Open Loops */}
          <div className="p-6 rounded-3xl bg-obsidian-900/75 border border-purple-500/25 backdrop-blur-xl space-y-3.5 shadow-lg shadow-purple-950/40">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span>Open Loops & Unresolved Threads</span>
            </div>
            <ul className="space-y-2.5">
              {openLoops.map((loop, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-purple-200/80 bg-obsidian-950/70 p-3 rounded-xl border border-purple-500/15">
                  <span className="text-amber-400 font-bold">•</span>
                  <span className="leading-relaxed">{loop}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Proactive Tip */}
          {proactiveTip && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 backdrop-blur-xl flex items-start gap-3.5 shadow-md shadow-purple-950/50">
              <Lightbulb className="w-5 h-5 text-nebius-cyan flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-nebius-cyan uppercase tracking-wider">Cognitive Advice</h4>
                <p className="text-xs text-purple-200/80 mt-1.5 leading-relaxed">
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
