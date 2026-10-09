import React, { useState } from 'react';
import { Target, RefreshCw, AlertCircle, Lightbulb, CheckSquare, Square, Calendar } from 'lucide-react';

export default function BriefingView({ briefing, onRegenerate, loading }) {
  const [completedPriorities, setCompletedPriorities] = useState({});

  const togglePriority = (idx) => {
    setCompletedPriorities(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const data = briefing?.briefing || {};
  const priorities = data.priorities || [];
  const openLoops = data.open_loops || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-nvidia-green uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Executive Session Briefing • {briefing?.date || "Today"}</span>
          </div>
          <h2 className="text-xl font-bold text-white">Focus & Alignment Kickoff</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {data.summary || "Synthesizing your active workspace context, recent commits, and open loops..."}
          </p>
        </div>

        <button
          onClick={onRegenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-nebius-cyan" : ""}`} />
          <span>{loading ? "Synthesizing..." : "Regenerate with Nemotron"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* High-Leverage Priorities */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Target className="w-4 h-4 text-nvidia-green" />
            <span>High-Leverage Priorities Today</span>
          </div>

          <div className="space-y-2.5">
            {priorities.map((p, idx) => {
              const done = completedPriorities[idx];
              return (
                <div
                  key={idx}
                  onClick={() => togglePriority(idx)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    done
                      ? "bg-slate-950/40 border-slate-800/50 opacity-60 line-through text-slate-400"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200"
                  }`}
                >
                  <button className="mt-0.5 text-nvidia-green">
                    {done ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-500" />}
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
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span>Open Loops & Unresolved Threads</span>
            </div>
            <ul className="space-y-2">
              {openLoops.map((loop, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  <span className="text-amber-400">•</span>
                  <span>{loop}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Proactive Tip */}
          {data.proactive_tip && (
            <div className="p-5 rounded-2xl bg-nebius-violet/10 border border-nebius-violet/20 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-nebius-cyan flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-nebius-cyan uppercase tracking-wider">Cognitive Advice</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {data.proactive_tip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
