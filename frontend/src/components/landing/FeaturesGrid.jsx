import React from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Globe,
  Zap,
  Target,
  ShieldCheck,
  Command,
  Sparkles
} from 'lucide-react';

const features = [
  {
    number: '01',
    icon: Sun,
    title: 'Autonomous Morning Briefing',
    highlight: 'DAILY INTELLIGENCE',
    description:
      'Wakes up before you do. Synthesizes your calendar, unresolved tasks, and top priorities so your day is organized the moment you open your computer.',
    iconColor: 'text-amber-400',
    borderColor: 'group-hover:border-amber-500/40',
  },
  {
    number: '02',
    icon: Globe,
    title: 'Live Web Grounding with Tavily',
    highlight: 'REAL-TIME FACTS',
    description:
      'Unlike static AI chatbots, SynapseOS connects directly to the live web via Tavily Search, grounding technical answers and news in verified, authoritative sources.',
    iconColor: 'text-pink-400',
    borderColor: 'group-hover:border-pink-500/40',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Powered by NVIDIA Nemotron & Nebius',
    highlight: '165+ TOKENS / SEC',
    description:
      'Uses the state-of-the-art nvidia/Nemotron-3_5-Lightning model hosted on Nebius Token Factory H100 clusters, streaming answers at blinding speed with zero lag.',
    iconColor: 'text-cyan-400',
    borderColor: 'group-hover:border-cyan-500/40',
  },
  {
    number: '04',
    icon: Target,
    title: 'Intelligent Goal Decomposer',
    highlight: 'ACTION ROADMAPS',
    description:
      'Give SynapseOS an ambitious goal (e.g., "Plan product launch"). It automatically breaks it down into structured milestones and a prioritized daily checklist.',
    iconColor: 'text-violet-400',
    borderColor: 'group-hover:border-violet-500/40',
  },
  {
    number: '05',
    icon: ShieldCheck,
    title: 'Client-Side Privacy Shield',
    highlight: 'NEMO GUARDRAILS',
    description:
      'Protected by on-device privacy filters. Passwords, API keys, and personal credentials are automatically scrubbed on your computer before any prompt is sent.',
    iconColor: 'text-emerald-400',
    borderColor: 'group-hover:border-emerald-500/40',
  },
  {
    number: '06',
    icon: Command,
    title: 'Universal Desktop Shortcut',
    highlight: 'ALWAYS READY',
    description:
      'Press Cmd+K on macOS or Ctrl+K on Windows from any window, document, or app. SynapseOS floats instantly to help without switching context.',
    iconColor: 'text-purple-400',
    borderColor: 'group-hover:border-purple-500/40',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          SYNAPSEOS CAPABILITIES
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          What SynapseOS Does for You
        </h2>
        <p className="mt-3 text-base text-zinc-400">
          A personal AI companion built from the ground up for desktop productivity and daily peace of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className={`group p-7 rounded-2xl bg-[#131318] border border-zinc-800/80 ${item.borderColor} hover:bg-[#181822] transition-all flex flex-col justify-between shadow-xl shadow-black/40`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-600">
                    {item.number}
                  </span>
                </div>

                <div className="text-[11px] font-mono uppercase text-violet-400 font-semibold tracking-wider mb-1">
                  {item.highlight}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-violet-200 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
