import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
          particleCount: 40,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#FFFFFF', '#A855F7', '#10B981']
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
      {/* Create / Decompose Goal Form with Magnification */}
      <motion.div 
        whileHover={{ scale: 1.012, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
          <Target className="w-4 h-4 text-white" />
          <span>Autonomous Goal Engine • Nemotron Decomposer</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Define Your North Star Goal</h2>
        <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
          Tell SynapseOS what you want to achieve. NVIDIA Nemotron breaks it down into strategic phases,
          derives today's tactical tasks, and syncs directly with your morning briefing.
        </p>

        <form onSubmit={handleDecompose} className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g. Win Nebius x NVIDIA Hackathon with video demo and polish by Oct 30..."
              className="flex-1 bg-black border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
            />
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="bg-transparent text-neutral-200 text-xs focus:outline-none"
                />
              </div>

              {/* Crisp White Action Button */}
              <motion.button
                type="submit"
                disabled={loading || !goalText.trim()}
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-md shadow-white/10 transition-all active:scale-95 disabled:opacity-50 flex-shrink-0"
              >
                <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? "Decomposing..." : "Decompose Goal"}</span>
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Active Decomposition View */}
      {currentDecomposition && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Card with Magnification */}
          <motion.div 
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                Strategic Roadmap
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-white" />
                <span>Target: {targetDate || "Oct 30, 2026"}</span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{currentDecomposition.goal_title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
              {currentDecomposition.vision}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Tactical Tasks */}
            <motion.div 
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-lg"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Clock className="w-4 h-4 text-white" />
                <span>Today's Tactical Execution Plan</span>
              </div>

              <div className="space-y-2">
                {(currentDecomposition.today_tasks || []).map((t, idx) => {
                  const done = checkedTasks[t.task];
                  return (
                    <motion.div
                      key={idx}
                      onClick={() => toggleTask(t.task)}
                      whileHover={{ scale: 1.025, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 450, damping: 22 }}
                      className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                        done
                          ? 'bg-black/60 border-neutral-900 opacity-40 line-through text-neutral-500'
                          : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 text-neutral-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 ${done ? 'text-emerald-400' : 'text-neutral-500'}`} />
                        <span className="text-xs leading-relaxed">{t.task}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          t.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-neutral-800 text-neutral-300'
                        }`}>
                          {t.priority}
                        </span>
                        {t.estimated_minutes && (
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {t.estimated_minutes}m
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Strategic Phases */}
            <motion.div 
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-lg"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Layers className="w-4 h-4 text-white" />
                <span>Strategic Milestone Phases</span>
              </div>

              <div className="space-y-3">
                {(currentDecomposition.phases || []).map((phase, pIdx) => (
                  <motion.div 
                    key={pIdx} 
                    whileHover={{ scale: 1.02, x: 3 }}
                    className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span>{phase.phase_name}</span>
                      <span className="text-[10px] font-mono text-neutral-400">{phase.timeframe}</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-neutral-400">
                      {(phase.deliverables || []).map((d, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-1.5">
                          <span className="text-white font-bold">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Saved Goals List with Magnification */}
      {savedGoals.length > 0 && (
        <motion.div 
          whileHover={{ scale: 1.008 }}
          className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 shadow-lg"
        >
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider font-mono">
            Active Tracked Goals ({savedGoals.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedGoals.map((g) => (
              <motion.div 
                key={g.id} 
                whileHover={{ scale: 1.025, y: -2 }}
                transition={{ type: "spring", stiffness: 450, damping: 22 }}
                className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h5 className="text-xs font-semibold text-white">{g.title}</h5>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Target: {g.target_date || "Ongoing"}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {g.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
