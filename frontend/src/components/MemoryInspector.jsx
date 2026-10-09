import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, FileText, ShieldCheck, HardDrive, RefreshCw } from 'lucide-react';

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
      {/* Overview Stat Cards with Hover Magnifications */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Watcher Status */}
        <motion.div 
          whileHover={{ scale: 1.025, y: -3 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium font-mono">Ambient Watcher</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-white" />
            <span>Active & Indexing</span>
          </div>
          <p className="text-[11px] text-neutral-500 font-mono truncate" title={stats?.watch_directory}>
            {stats?.watch_directory || "workspace/"}
          </p>
        </motion.div>

        {/* Total Context Items */}
        <motion.div 
          whileHover={{ scale: 1.025, y: -3 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 shadow-lg"
        >
          <span className="text-xs text-neutral-400 font-medium font-mono">Context Ingested</span>
          <div className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-white" />
            <span>{items.length || stats?.total_items || 0} items</span>
          </div>
          <p className="text-[11px] text-neutral-500 font-mono">Auto-synchronized with hybrid SQLite</p>
        </motion.div>

        {/* Privacy Guardrail Sanitizations */}
        <motion.div 
          whileHover={{ scale: 1.025, y: -3 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 shadow-lg"
        >
          <span className="text-xs text-neutral-400 font-medium font-mono">NeMo Guardrail</span>
          <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span>{stats?.total_redactions ?? 0} Protected</span>
          </div>
          <p className="text-[11px] text-neutral-500 font-mono">API keys & credentials kept local</p>
        </motion.div>
      </div>

      {/* Ingested Items Table / List with Magnification */}
      <motion.div 
        whileHover={{ scale: 1.008 }}
        className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Eye className="w-4 h-4 text-white" />
            <span>Recent Ambient Memory Ingestion</span>
          </div>
          <motion.button
            onClick={fetchItems}
            disabled={loading}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-white" : ""}`} />
            <span>Refresh</span>
          </motion.button>
        </div>

        <div className="space-y-2.5">
          {items.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02, x: 3 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
              className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold border ${
                    item.item_type === 'file'
                      ? 'bg-neutral-800 text-cyan-300 border-neutral-700'
                      : item.item_type === 'thought'
                      ? 'bg-neutral-800 text-purple-300 border-neutral-700'
                      : 'bg-neutral-800 text-emerald-300 border-neutral-700'
                  }`}>
                    {item.item_type}
                  </span>
                  <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                </div>

                {item.redactions_count > 0 && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
                    {item.redactions_count} Secret(s) Redacted
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-mono">
                {item.sanitized_content}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
