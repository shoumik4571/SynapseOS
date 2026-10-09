import React, { useState, useEffect } from 'react';
import { Eye, FileText, ShieldCheck, HardDrive, RefreshCw, Clock } from 'lucide-react';

export default function MemoryInspector({ stats }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/context');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Watcher Status */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Ambient Watcher</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nvidia-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-nvidia-green"></span>
            </span>
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-nvidia-green" />
            <span>Active & Indexing</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono truncate" title={stats?.watch_directory}>
            {stats?.watch_directory || "workspace/"}
          </p>
        </div>

        {/* Total Context Items */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Context Ingested</span>
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-nebius-cyan" />
            <span>{items.length || stats?.total_items || 0} items</span>
          </div>
          <p className="text-[11px] text-slate-500">Auto-synchronized with hybrid memory</p>
        </div>

        {/* Privacy Guardrail Sanitizations */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">NeMo Privacy Guardrail</span>
          <div className="text-2xl font-bold text-nvidia-green flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span>{stats?.total_redactions ?? 0} Protected</span>
          </div>
          <p className="text-[11px] text-slate-500">API keys & credentials kept local</p>
        </div>
      </div>

      {/* Ingested Items Table / List */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Eye className="w-4 h-4 text-nvidia-green" />
            <span>Recent Ambient Memory Ingestion</span>
          </div>
          <button
            onClick={fetchItems}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-nvidia-green" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                    item.item_type === 'file'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : item.item_type === 'thought'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {item.item_type}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                </div>

                {item.redactions_count > 0 && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                    {item.redactions_count} Secret(s) Redacted
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-mono">
                {item.sanitized_content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
