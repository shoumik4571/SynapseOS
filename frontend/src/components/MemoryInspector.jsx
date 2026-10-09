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
        <div className="p-6 rounded-3xl bg-obsidian-900/75 border border-purple-500/25 space-y-2.5 backdrop-blur-xl shadow-lg shadow-purple-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-300/80 font-medium font-mono">Ambient Watcher</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-synapse-purple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-synapse-purple"></span>
            </span>
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-synapse-purple" />
            <span>Active & Indexing</span>
          </div>
          <p className="text-[11px] text-purple-400/60 font-mono truncate" title={stats?.watch_directory}>
            {stats?.watch_directory || "workspace/"}
          </p>
        </div>

        {/* Total Context Items */}
        <div className="p-6 rounded-3xl bg-obsidian-900/75 border border-purple-500/25 space-y-2.5 backdrop-blur-xl shadow-lg shadow-purple-950/40">
          <span className="text-xs text-purple-300/80 font-medium font-mono">Context Ingested</span>
          <div className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-nebius-cyan" />
            <span>{items.length || stats?.total_items || 0} items</span>
          </div>
          <p className="text-[11px] text-purple-400/60 font-mono">Auto-synchronized with hybrid SQLite</p>
        </div>

        {/* Privacy Guardrail Sanitizations */}
        <div className="p-6 rounded-3xl bg-obsidian-900/75 border border-purple-500/25 space-y-2.5 backdrop-blur-xl shadow-lg shadow-purple-950/40">
          <span className="text-xs text-purple-300/80 font-medium font-mono">NeMo Privacy Guardrail</span>
          <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span>{stats?.total_redactions ?? 0} Protected</span>
          </div>
          <p className="text-[11px] text-purple-400/60 font-mono">API keys & credentials kept local</p>
        </div>
      </div>

      {/* Ingested Items Table / List */}
      <div className="p-7 rounded-3xl bg-obsidian-900/80 border border-purple-500/25 space-y-5 backdrop-blur-xl shadow-xl shadow-purple-950/50">
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
          <div className="flex items-center gap-2.5 text-sm font-bold text-white">
            <Eye className="w-4 h-4 text-synapse-purple" />
            <span>Recent Ambient Memory Ingestion</span>
          </div>
          <button
            onClick={fetchItems}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-purple-300/80 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-synapse-purple" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-obsidian-950/80 border border-purple-500/20 hover:border-purple-400/50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md font-bold border ${
                    item.item_type === 'file'
                      ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      : item.item_type === 'thought'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {item.item_type}
                  </span>
                  <h4 className="text-xs font-bold text-purple-100">{item.title}</h4>
                </div>

                {item.redactions_count > 0 && (
                  <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-mono">
                    {item.redactions_count} Secret(s) Redacted
                  </span>
                )}
              </div>

              <p className="text-xs text-purple-200/70 line-clamp-2 leading-relaxed font-mono">
                {item.sanitized_content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
