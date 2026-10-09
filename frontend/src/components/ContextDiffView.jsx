import React, { useState } from 'react';
import { ArrowLeftRight, Sparkles, Clock, CheckCircle2, Zap } from 'lucide-react';
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
      {/* Header Card */}
      <div className="p-7 rounded-3xl bg-gradient-to-br from-obsidian-900/90 via-purple-950/30 to-obsidian-950 border border-purple-500/25 space-y-4 shadow-xl shadow-purple-950/40 backdrop-blur-2xl">
        <div className="flex items-center gap-2 text-xs font-bold text-synapse-purple uppercase tracking-wider">
          <ArrowLeftRight className="w-4 h-4 text-synapse-purple" />
          <span>Flow-State Guardian • Context Reload Engine</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Switch Context Without Mental Drag</h2>
        <p className="text-xs text-purple-200/70 max-w-2xl leading-relaxed">
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
            className="flex-1 bg-obsidian-950/90 border border-purple-500/30 focus:border-purple-400 rounded-2xl px-5 py-3 text-xs text-purple-100 placeholder-purple-400/40 focus:outline-none transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 border border-purple-400/40 transition-all disabled:opacity-50 active:scale-95"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? "Computing Diff..." : "Generate Reload Diff"}</span>
          </button>
        </form>
      </div>

      {/* Diff Result Card */}
      {diffResult && (
        <div className="p-7 rounded-3xl bg-obsidian-900/80 border border-purple-500/25 space-y-4 backdrop-blur-xl shadow-xl shadow-purple-950/40 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-synapse-purple">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cognitive State Reconstructed</span>
            </div>
            {diffResult.metrics?.tokens_per_second && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-200 bg-obsidian-950 px-3 py-1 rounded-xl border border-purple-500/30">
                <Zap className="w-3 h-3 text-synapse-purple" />
                <span>{diffResult.metrics.tokens_per_second} tok/s</span>
                <span className="text-purple-600">•</span>
                <span>{diffResult.metrics.total_time_ms}ms</span>
              </div>
            )}
          </div>

          <div className="py-1">
            <MarkdownRenderer content={diffResult.diff_markdown} />
          </div>
        </div>
      )}
    </div>
  );
}
