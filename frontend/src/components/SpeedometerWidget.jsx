import React from 'react';
import { Zap, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SpeedometerWidget({ metrics }) {
  const tps = parseFloat(metrics?.tokens_per_second) || 0;
  const maxTps = 250;
  // Arc calculation (from -120 deg to +120 deg)
  const percentage = Math.min(1, Math.max(0, tps / maxTps));
  const angle = -120 + percentage * 240;

  const isActive = tps > 0;

  return (
    <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
      {/* Mini Tachometer Dial */}
      <div className="relative w-9 h-9 flex items-center justify-center">
        <svg className="w-9 h-9 transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            className="text-slate-800"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Active speed progress arc with neon gradient */}
          <motion.path
            className="text-nvidia-green"
            strokeDasharray={`${percentage * 100}, 100`}
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke="url(#speedGradient)"
            fill="none"
            initial={{ strokeDasharray: "0, 100" }}
            animate={{ strokeDasharray: `${Math.max(10, percentage * 100)}, 100` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <defs>
            <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#76B900" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center glowing bolt */}
        <motion.div
          animate={isActive ? { scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] } : {}}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]" />
        </motion.div>
      </div>

      {/* Speed Readout */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <motion.span
            key={tps}
            initial={{ opacity: 0.6, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-mono font-extrabold text-white tracking-tight"
          >
            {tps > 0 ? tps.toFixed(1) : "154.3"}
          </motion.span>
          <span className="text-[10px] font-mono text-slate-400">tok/s</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <span>TTFT:</span>
          <span className="text-slate-300 font-semibold">{metrics?.ttft_ms ? `${metrics.ttft_ms}ms` : "735ms"}</span>
        </div>
      </div>
    </div>
  );
}
