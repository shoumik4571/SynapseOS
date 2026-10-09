import React, { useState, useEffect } from 'react';
import { Target, Sparkles, CheckCircle2, Clock, Calendar, ChevronRight, Layers, Flag } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GoalPlannerView({ onGoalCreated, onUpdateMetrics }) {
  const [goalText, setGoalText] = useState('');
  const [targetDate, setTargetDate] = useState('2026-10-30');
  const [loading, setLoading] = useState(false);
  const [currentDecomposition, setCurrentDecomposition] = useState(null);
  const [savedGoals, setSavedGoals] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState({});

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals');
      const data = await res.json();
      setSavedGoals(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDecompose = async (e) => {
    e.preventDefault();
    if (!goalText.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/goals/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goalText,
          target_date: targetDate,
        }),
      });

      const data = await res.json();
      setCurrentDecomposition(data.decomposition);
      if (data.metrics && onUpdateMetrics) {
        onUpdateMetrics(data.metrics);
      }
      setGoalText('');
      fetchGoals();
      onGoalCreated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskName) => {
    setCheckedTasks(prev => {
      const isNowDone = !prev[taskName];
      if (isNowDone) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#A855F7', '#C084FC', '#00E5FF', '#76B900']
        });
      }
      return {
        ...prev,
        [taskName]: isNowDone
      };
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Create / Decompose Goal Form */}
      <div className="p-7 rounded-3xl bg-gradient-to-br from-obsidian-900/90 via-purple-950/30 to-obsidian-950 border border-purple-500/25 space-y-4 shadow-xl shadow-purple-950/40 backdrop-blur-2xl">
        <div className="flex items-center gap-2 text-xs font-bold text-synapse-purple uppercase tracking-wider">
          <Target className="w-4 h-4 text-synapse-purple" />
          <span>Autonomous Goal Engine • Nemotron Decomposer</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Define Your North Star Goal</h2>
        <p className="text-xs text-purple-200/70 max-w-2xl leading-relaxed">
          Tell SynapseOS what you want to achieve. NVIDIA Nemotron will break it down into strategic phases,
          derive today's tactical tasks, and sync directly with your morning briefing.
        </p>

        <form onSubmit={handleDecompose} className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g. Win Nebius x NVIDIA Hackathon with video demo and polish by Oct 30..."
              className="flex-1 bg-obsidian-950/90 border border-purple-500/30 focus:border-purple-400 rounded-2xl px-5 py-3 text-xs text-purple-100 placeholder-purple-400/40 focus:outline-none transition-all shadow-inner"
            />
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 bg-obsidian-950/90 border border-purple-500/30 rounded-2xl px-4 py-3 text-xs text-purple-300">
                <Calendar className="w-3.5 h-3.5 text-synapse-purple" />
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="bg-transparent text-purple-200 text-xs focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !goalText.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 border border-purple-400/40 transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? "Decomposing..." : "Decompose Goal"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Active Decomposition View */}
      {currentDecomposition && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Card */}
          <div className="p-6 rounded-3xl bg-obsidian-900/80 border border-purple-500/25 space-y-2 backdrop-blur-xl shadow-lg shadow-purple-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-nebius-cyan uppercase tracking-wider font-bold">
                Strategic Roadmap
              </span>
              <span className="text-xs text-purple-300/80 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-synapse-purple" />
                <span>Target: {targetDate || "Oct 30, 2026"}</span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{currentDecomposition.goal_title}</h3>
            <p className="text-xs text-purple-200/70 leading-relaxed max-w-2xl">
              {currentDecomposition.vision}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Tactical Tasks */}
            <div className="p-6 rounded-3xl bg-obsidian-900/75 border border-purple-500/25 space-y-4 backdrop-blur-xl shadow-lg shadow-purple-950/40">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Clock className="w-4 h-4 text-synapse-purple" />
                <span>Today's Tactical Execution Plan</span>
              </div>

              <div className="space-y-2.5">
                {(currentDecomposition.today_tasks || []).map((t, idx) => {
                  const done = checkedTasks[t.task];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleTask(t.task)}
                      className={`flex items-start justify-between gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        done
                          ? 'bg-obsidian-950/40 border-purple-900/30 opacity-50 line-through text-purple-400/50'
                          : 'bg-obsidian-950/80 border-purple-500/20 hover:border-purple-400/50 text-purple-100 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 ${done ? 'text-synapse-purple' : 'text-purple-500/40'}`} />
                        <span className="text-xs leading-relaxed">{t.task}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-md font-bold ${
                          t.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-purple-950/50 text-purple-300'
                        }`}>
                          {t.priority}
                        </span>
                        {t.estimated_minutes && (
                          <span className="text-[10px] text-purple-400/60 font-mono">
                            {t.estimated_minutes}m
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strategic Phases */}
            <div className="p-6 rounded-3xl bg-obsidian-900/75 border border-purple-500/25 space-y-4 backdrop-blur-xl shadow-lg shadow-purple-950/40">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Layers className="w-4 h-4 text-nebius-cyan" />
                <span>Strategic Milestone Phases</span>
              </div>

              <div className="space-y-3">
                {(currentDecomposition.phases || []).map((phase, pIdx) => (
                  <div key={pIdx} className="p-3.5 rounded-2xl bg-obsidian-950/80 border border-purple-500/20 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-200">
                      <span>{phase.phase_name}</span>
                      <span className="text-[10px] font-mono text-purple-400/60">{phase.timeframe}</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-purple-200/70">
                      {(phase.deliverables || []).map((d, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-1.5">
                          <span className="text-synapse-purple">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Goals List */}
      {savedGoals.length > 0 && (
        <div className="p-6 rounded-3xl bg-obsidian-900/60 border border-purple-500/20 space-y-3 backdrop-blur-xl">
          <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono">
            Active Tracked Goals ({savedGoals.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedGoals.map((g) => (
              <div key={g.id} className="p-3.5 rounded-2xl bg-obsidian-950/80 border border-purple-500/20 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white">{g.title}</h5>
                  <p className="text-[10px] text-purple-400/60 mt-0.5">Target: {g.target_date || "Ongoing"}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {g.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
