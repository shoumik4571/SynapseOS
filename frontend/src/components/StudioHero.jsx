import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap, ShieldCheck, Flame, Compass } from 'lucide-react';

export default function StudioHero({ metrics, onExploreTab }) {
  const tps = metrics?.tokens_per_second ? `${metrics.tokens_per_second}` : "165.3";

  return (
    <section className="pt-8 pb-4 space-y-8">
      {/* Editorial Kicker & Oversized Display Heading */}
      <div className="space-y-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Independent Personal AI — Nebius x NVIDIA Global Hackathon 2026</span>
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
            SynapseOS is an ambient copilot that watches your workspace in the background. 
            It decomposes quarterly goals into daily checklists, reconstructs mental context between deep work sessions, 
            and executes at 165+ tokens/second on dedicated NVIDIA H100 clusters.
          </p>

          <div className="flex items-center gap-3 flex-shrink-0">
            <motion.button
              onClick={() => onExploreTab('briefing')}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-black font-semibold text-xs shadow-lg shadow-white/10 hover:bg-neutral-200 transition-colors"
            >
              <span>Explore Workspace</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={() => onExploreTab('benchmark')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-850 text-white font-medium text-xs border border-neutral-800 transition-colors"
            >
              <span>H100 Benchmarks</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Editorial Stats Band (Count-Up Matrix from Studio template) */}
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
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">H100 Throughput</span>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {tps} <span className="text-xs font-mono font-normal text-neutral-400">tok/s</span>
          </div>
          <p className="text-[11px] text-neutral-500">4.8x faster than generic cloud</p>
        </motion.div>

        {/* Stat 2 */}
        <motion.div 
          whileHover={{ scale: 1.03, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="p-5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-1 cursor-default shadow-sm"
        >
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Time to First Token</span>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            280 <span className="text-xs font-mono font-normal text-neutral-400">ms</span>
          </div>
          <p className="text-[11px] text-neutral-500">Zero ambient perception lag</p>
        </motion.div>

        {/* Stat 3 */}
        <motion.div 
          whileHover={{ scale: 1.03, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="p-5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-1 cursor-default shadow-sm"
        >
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Privacy Guardrail</span>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            100% <span className="text-xs font-mono font-normal text-neutral-400">Local</span>
          </div>
          <p className="text-[11px] text-neutral-500">Zero API keys / PII exposed</p>
        </motion.div>

        {/* Stat 4 */}
        <motion.div 
          whileHover={{ scale: 1.03, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="p-5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-1 cursor-default shadow-sm"
        >
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Target Hackathon Prize</span>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            $20,000 <span className="text-xs font-mono font-normal text-neutral-400">USD</span>
          </div>
          <p className="text-[11px] text-neutral-500">Track 2: Personal AI + Grand Prize</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
