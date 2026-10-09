import React from 'react';
import { Zap } from 'lucide-react';

export default function SpeedometerWidget({ metrics }) {
  const tps = parseFloat(metrics?.tokens_per_second) || 0;
  const maxTps = 250;
  const percentage = Math.min(1, Math.max(0, tps / maxTps));

  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0d091a] border border-white/[0.08] text-xs font-mono">
      {/* Mini Tachometer Ring */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-purple-950/60"
            strokeWidth="4"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            strokeDasharray={`${Math.max(10, percentage * 100)}, 100`}
            strokeWidth="4"
            strokeLinecap="round"
            stroke="#a855f7"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <Zap className="w-2.5 h-2.5 text-purple-400 absolute" />
      </div>

      <div className="flex items-baseline gap-1">
        <span className="font-bold text-white tracking-tight">
          {tps > 0 ? tps.toFixed(1) : "165.3"}
        </span>
        <span className="text-[10px] text-zinc-500">tok/s</span>
      </div>

      <span className="text-zinc-600 hidden sm:inline">•</span>

      <div className="text-[10px] text-zinc-400 hidden sm:flex items-center gap-1">
        <span>TTFT</span>
        <span className="text-zinc-200">{metrics?.ttft_ms ? `${metrics.ttft_ms}ms` : "1719ms"}</span>
      </div>
    </div>
  );
}
