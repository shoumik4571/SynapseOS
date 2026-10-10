import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Target,
  ShieldCheck,
  Eye,
  Globe2,
  Database,
  Cpu,
  Layers,
  ArrowUpRight,
  Lock,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: '165+ tok/s Ultra-Low Latency',
    tag: 'NVIDIA H100 SXM5',
    description:
      'Powered by NVIDIA Nemotron-3.5-Lightning on Nebius Token Factory. Near-instantaneous response generation with sub-220ms time-to-first-token.',
    accent: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-400',
    borderColor: 'group-hover:border-amber-500/40',
  },
  {
    icon: Target,
    title: 'Autonomous Goal Engine',
    tag: 'Reasoning & Sequence',
    description:
      'Decomposes ambitious high-level goals into executable, verifiable sub-steps with live progress tracking and automated self-correction.',
    accent: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'text-violet-400',
    borderColor: 'group-hover:border-violet-500/40',
  },
  {
    icon: ShieldCheck,
    title: 'NeMo Privacy Guardrail',
    tag: 'Local PII Shield',
    description:
      'Client-side sanitization inspects clipboard and prompt buffers to mask API keys, passwords, and sensitive credentials before inference.',
    accent: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
    borderColor: 'group-hover:border-emerald-500/40',
  },
  {
    icon: Eye,
    title: 'Ambient Desktop Watcher',
    tag: 'System Integration',
    description:
      'Seamlessly captures active application context and clipboard data with instant Cmd+K hotkey recall. No manual copy-pasting required.',
    accent: 'from-cyan-500/20 to-blue-500/10',
    iconColor: 'text-cyan-400',
    borderColor: 'group-hover:border-cyan-500/40',
  },
  {
    icon: Globe2,
    title: 'Tavily Deep Web Grounding',
    tag: 'Live Citations',
    description:
      'Real-time web search integration ensures answers are anchored in up-to-the-minute documentation, market data, and authoritative sources.',
    accent: 'from-sky-500/20 to-indigo-500/10',
    iconColor: 'text-sky-400',
    borderColor: 'group-hover:border-sky-500/40',
  },
  {
    icon: Database,
    title: 'Context Diff & Vector Sync',
    tag: 'Local SQLite Store',
    description:
      'Maintains a private persistent knowledge graph of your project history, user preferences, and working session context diffs over time.',
    accent: 'from-pink-500/20 to-rose-500/10',
    iconColor: 'text-pink-400',
    borderColor: 'group-hover:border-pink-500/40',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          SYSTEM CAPABILITIES
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Engineered for Deep Desktop Flow
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          Not another slow web interface. SynapseOS runs natively on your machine, combining extreme GPU throughput with privacy-first ambient context.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`group relative p-6 sm:p-7 rounded-2xl bg-[#131318]/90 border border-zinc-800/80 ${item.borderColor} hover:bg-[#181822] transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/40`}
            >
              {/* Subtle top gradient glow on hover */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    <Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-violet-200 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>VERIFIED HARDWARE SPEC</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
