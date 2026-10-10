import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'The 165+ tok/s streaming speed from Nebius Token Factory paired with Nemotron-3.5 makes it feel like the AI is thinking at the exact speed of my own brain. The latency makes traditional chatbots feel broken.',
    author: 'Marcus Vance',
    role: 'Principal Systems Architect',
    company: 'CloudScale Infrastructure',
    tag: 'PERFORMANCE',
  },
  {
    quote:
      'Having an ambient desktop copilot that actually respects local privacy and strips clipboard PII with NeMo Guardrails before prompt transmission is an absolute game-changer for enterprise teams.',
    author: 'Elena Rostova',
    role: 'Senior Staff Security Engineer',
    company: 'Vanguard Security Labs',
    tag: 'PRIVACY & NEMO',
  },
  {
    quote:
      'SynapseOS bridges the chasm between raw LLM intelligence and real desktop OS productivity. The proactive morning briefing and goal decomposition save our team 45 minutes of context-switching daily.',
    author: 'Devon Patel',
    role: 'Founder & Tech Lead',
    company: 'AeroSync AI',
    tag: 'AUTONOMY',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono mb-4">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          TESTED BY BUILDERS
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          What Engineers Are Saying
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          Evaluated under rigorous daily workloads across macOS and Windows workstations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="p-7 rounded-2xl bg-[#131318]/90 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between shadow-xl shadow-black/40"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {item.tag}
                </span>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-6">
                "{item.quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                {item.author[0]}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{item.author}</div>
                <div className="text-xs text-zinc-400">
                  {item.role} • <span className="text-zinc-500">{item.company}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
