import React from 'react';
import { motion } from 'framer-motion';
import {
  Command,
  Sun,
  Bookmark,
  PenTool,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Command,
    title: 'One Keystroke Away',
    tag: 'UNIVERSAL SHORTCUT',
    description:
      'Press Cmd+K on Mac or Ctrl+K on Windows from any app. No switching windows or opening a browser tab—your assistant is instantly ready.',
    iconColor: 'text-violet-400',
    borderColor: 'group-hover:border-violet-500/40',
  },
  {
    icon: Sun,
    title: 'Proactive Morning Briefing',
    tag: 'DAILY CLARITY',
    description:
      'Start each morning with a concise summary of your upcoming meetings, prioritized to-dos, and suggested actions, ready before you even open your laptop.',
    iconColor: 'text-amber-400',
    borderColor: 'group-hover:border-amber-500/40',
  },
  {
    icon: Bookmark,
    title: 'Total Recall Memory',
    tag: 'NEVER FORGET',
    description:
      'Ask "What did we decide about the budget on Tuesday?" SynapseOS searches your past notes, meeting points, and links with instant accuracy.',
    iconColor: 'text-cyan-400',
    borderColor: 'group-hover:border-cyan-500/40',
  },
  {
    icon: PenTool,
    title: 'Smart Writing & Polishing',
    tag: 'CLEAR COMMUNICATION',
    description:
      'Turn rough thoughts into polished emails, adjust tone, fix grammar, and summarize lengthy articles in clean, easy-to-read bullet points.',
    iconColor: 'text-pink-400',
    borderColor: 'group-hover:border-pink-500/40',
  },
  {
    icon: ShieldCheck,
    title: 'Strict Personal Privacy',
    tag: 'ON-DEVICE SAFETY',
    description:
      'Built with built-in privacy firewalls. Your personal notes, passwords, and sensitive information are protected and kept safe on your computer.',
    iconColor: 'text-emerald-400',
    borderColor: 'group-hover:border-emerald-500/40',
  },
  {
    icon: Zap,
    title: 'Instant Lightning Responses',
    tag: 'ZERO WAITING',
    description:
      'Powered by high-performance AI engines. Enjoy instantaneous responses with zero lag, so your creative flow is never interrupted.',
    iconColor: 'text-purple-400',
    borderColor: 'group-hover:border-purple-500/40',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          BUILT FOR DAILY LIFE
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Everything You Need From an Assistant
        </h2>
        <p className="mt-3 text-base text-zinc-400">
          Designed to be simple, unobtrusive, and genuinely helpful across every task on your computer.
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
              className={`group p-6 rounded-2xl bg-[#131318] border border-zinc-800/80 ${item.borderColor} hover:bg-[#181822] transition-all flex flex-col justify-between shadow-lg shadow-black/40`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-violet-200 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
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
