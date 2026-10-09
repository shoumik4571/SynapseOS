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
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/40 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-nebius-cyan uppercase tracking-wider">
          <ArrowLeftRight className="w-4 h-4" />
          <span>Flow-State Guardian • Context Reload Engine</span>
        </div>
        <h2 className="text-xl font-bold text-white">Switch Context Without the Mental Drag</h2>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
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
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-nebius-cyan rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-nebius-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-semibold text-xs transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? "Computing Diff..." : "Generate Reload Diff"}</span>
          </button>
        </form>
      </div>

      {/* Diff Result Card */}
      {diffResult && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-nvidia-green">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cognitive State Reconstructed</span>
            </div>
            {diffResult.metrics?.tokens_per_second && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>{diffResult.metrics.tokens_per_second} tok/s</span>
                <span className="text-slate-600">•</span>
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
