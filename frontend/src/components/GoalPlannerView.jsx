import React, { useState, useEffect } from 'react';
import { Target, Sparkles, CheckCircle2, Clock, AlertCircle, ChevronRight, Plus, Calendar, Flag } from 'lucide-react';

export default function GoalPlannerView({ onGoalCreated, onUpdateMetrics }) {
  const [goalText, setGoalText] = useState('');
  const [targetDate, setTargetDate] = useState('2026-10-30');
  const [loading, setLoading] = useState(false);
  const [activeGoals, setActiveGoals] = useState([]);
  const [currentDecomposition, setCurrentDecomposition] = useState(null);
  const [checkedTasks, setCheckedTasks] = useState({});

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals');
      const data = await res.json();
      setActiveGoals(data);
      if (data.length > 0 && !currentDecomposition) {
        setCurrentDecomposition(data[0].decomposition);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDecompose = async (e) => {
    e?.preventDefault();
    if (!goalText.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/goals/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goalText.trim(),
          target_date: targetDate,
        }),
      });
      const data = await res.json();
      setCurrentDecomposition(data.decomposition);
      if (data.metrics?.tokens_per_second) {
        onUpdateMetrics?.(data.metrics);
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
    setCheckedTasks(prev => ({
      ...prev,
      [taskName]: !prev[taskName]
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Create / Decompose Goal Form */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-nvidia-green uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>Autonomous Goal Engine • Nemotron Decomposer</span>
        </div>
        <h2 className="text-xl font-bold text-white">Define Your North Star Goal</h2>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Tell SynapseOS what you want to achieve. NVIDIA Nemotron will break it down into strategic phases,
          derive today's tactical tasks, and sync with your morning briefing.
        </p>

        <form onSubmit={handleDecompose} className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g. Win Nebius x NVIDIA Hackathon with video demo and polish by Oct 30..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-nvidia-green rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
            />
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="bg-transparent text-slate-200 text-xs focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !goalText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nvidia-green hover:bg-nvidia-dark text-slate-950 font-semibold text-xs shadow-md shadow-nvidia-green/20 transition-all disabled:opacity-50"
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
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-nebius-cyan uppercase tracking-wider font-semibold">
                Strategic Roadmap
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-nvidia-green" />
                <span>Target: {targetDate || "Oct 30, 2026"}</span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{currentDecomposition.goal_title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {currentDecomposition.vision}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Tactical Tasks */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Clock className="w-4 h-4 text-nvidia-green" />
                <span>Today's Tactical Execution Plan</span>
              </div>

              <div className="space-y-2.5">
                {(currentDecomposition.today_tasks || []).map((t, idx) => {
                  const done = checkedTasks[t.task];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleTask(t.task)}
                      className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        done
                          ? 'bg-slate-950/40 border-slate-800/50 opacity-60 line-through text-slate-400'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 ${done ? 'text-nvidia-green' : 'text-slate-600'}`} />
                        <span className="text-xs leading-relaxed">{t.task}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                          t.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {t.priority}
                        </span>
                        {t.estimated_minutes && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {t.estimated_minutes}m
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strategic Phases & Milestones */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-nebius-cyan">
                <Target className="w-4 h-4" />
                <span>Milestone Phases</span>
              </div>

              <div className="space-y-3">
                {(currentDecomposition.phases || []).map((ph, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{ph.phase_name}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                        {ph.timeframe}
                      </span>
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1 pt-1">
                      {(ph.milestones || []).map((m, mIdx) => (
                        <li key={mIdx} className="flex items-center gap-1.5">
                          <ChevronRight className="w-3 h-3 text-nvidia-green" />
                          <span>{m}</span>
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
    </div>
  );
}
