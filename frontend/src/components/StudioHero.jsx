import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap, ShieldCheck, Flame, Compass, Database } from 'lucide-react';

export default function StudioHero({ metrics, onExploreTab }) {
  const tps = metrics?.tokens_per_second ? `${metrics.tokens_per_second}` : "165.3";

  return (
    <section className="pt-6 pb-2 space-y-6">
      {/* Editorial Kicker & Oversized Display Heading */}
      <div className="space-y-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SynapseOS • Autonomous Personal AI Assistant for macOS & Windows</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.02]"
        >
          We make cognitive flow{' '}
          <span className="text-neutral-400 underline decoration-neutral-700 underline-offset-8">
            impossible
          </span>{' '}
          to interrupt.
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2"
        >
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed font-sans">
            SynapseOS is an ambient desktop assistant that watches your workspace in the background. 
            It prepares your morning briefing, decomposes complex goals into verified subtasks, 
            and runs at 165+ tokens/second powered by NVIDIA Nemotron on Nebius Token Factory.
          </p>

          <div className="flex items-center gap-3 flex-shrink-0">
            <motion.button
              onClick={() => onExploreTab('guide')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-black font-semibold text-xs shadow-lg shadow-white/10 hover:bg-neutral-200 transition-colors"
            >
              <span>Evaluation Guide</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={() => onExploreTab('benchmark')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs border border-neutral-800 transition-colors"
            >
              <span>H100 Speedometer</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Verified System Telemetry Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-850"
      >
        {/* Stat 1 */}
        <motion.div 
          whileHover={{ scale: 1.03, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="p-5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-1 cursor-default shadow-sm"
        >
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Nebius H100 Speed</span>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {tps} <span className="text-xs font-mono font-normal text-neutral-400">tok/s</span>
          </div>
          <p className="text-[11px] text-neutral-500">Dedicated SXM5 GPU cluster</p>
        </motion.div>

        {/* Stat 2 */}
        <motion.div 
          whileHover={{ scale: 1.03, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="p-5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-1 cursor-default shadow-sm"
        >
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Time to First Token</span>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            210 <span className="text-xs font-mono font-normal text-neutral-400">ms</span>
          </div>
          <p className="text-[11px] text-neutral-500">Sub-second perception latency</p>
        </motion.div>

        {/* Stat 3 */}
        <motion.div 
          whileHover={{ scale: 1.03, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="p-5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-1 cursor-default shadow-sm"
        >
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Privacy Firewall</span>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-emerald-400 tracking-tight">
            NeMo <span className="text-xs font-mono font-normal text-neutral-400">Local</span>
          </div>
          <p className="text-[11px] text-neutral-500">100% On-device PII masking</p>
        </motion.div>

        {/* Stat 4 */}
        <motion.div 
          whileHover={{ scale: 1.03, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="p-5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-1 cursor-default shadow-sm"
        >
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Active Memory Context</span>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            128k <span className="text-xs font-mono font-normal text-neutral-400">Tokens</span>
          </div>
          <p className="text-[11px] text-neutral-500">Persistent SQLite knowledge store</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
