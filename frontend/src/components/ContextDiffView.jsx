import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export default function ContextDiffView({ onComputeDiff }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [diffResult, setDiffResult] = useState(null);

  const handleCompute = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/context-diff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_topic: topic }),
      });
      const data = await res.json();
      setDiffResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Card with Hover Magnification */}
      <motion.div 
        whileHover={{ scale: 1.012, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
          <ArrowLeftRight className="w-4 h-4 text-white" />
          <span>Flow-State Guardian • Context Reload Engine</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Switch Context Without Mental Drag</h2>
        <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
          Switching projects or returning after hours away drains cognitive energy. 
          SynapseOS diffs your active workspace snapshot and reconstructs your mental cache in seconds.
        </p>

        {/* Input Form */}
        <form onSubmit={handleCompute} className="flex gap-3 pt-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Resuming frontend token speedometer, or Switching to API security..."
            className="flex-1 bg-black border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
          />

          {/* Crisp White Action Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-md shadow-white/10 transition-all active:scale-95 disabled:opacity-50 flex-shrink-0"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? "Computing Diff..." : "Generate Reload Diff"}</span>
          </motion.button>
        </form>
      </motion.div>

      {/* Diff Result Card with Magnification */}
      {diffResult && (
        <motion.div 
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cognitive State Reconstructed</span>
            </div>
            {diffResult.metrics?.tokens_per_second && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-300 bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">
                <Zap className="w-3 h-3 text-white" />
                <span>{diffResult.metrics.tokens_per_second} tok/s</span>
                <span className="text-neutral-600">•</span>
                <span>{diffResult.metrics.total_time_ms}ms</span>
              </div>
            )}
          </div>

          <div className="py-1">
            <MarkdownRenderer content={diffResult.diff_markdown} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
