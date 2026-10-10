import React from 'react';
import { motion } from 'framer-motion';
import { Command, MessageSquareText, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Press Cmd + K Anytime',
    subtitle: 'Zero Friction',
    description:
      'Whether you are browsing the web, reading an email, or writing in Word, press Cmd+K (or Ctrl+K on Windows) to summon SynapseOS instantly.',
    icon: Command,
    color: 'text-violet-400',
  },
  {
    step: '02',
    title: 'Ask or Let it Think Ahead',
    subtitle: 'Natural & Effortless',
    description:
      'Ask a question, ask it to polish an email, find a lost link, or simply read your morning plan. SynapseOS understands your context naturally.',
    icon: MessageSquareText,
    color: 'text-cyan-400',
  },
  {
    step: '03',
    title: 'Action in an Instant',
    subtitle: 'Done in Seconds',
    description:
      'Get clean answers, copy ready-to-send drafts, or check off tasks. Your thoughts are saved privately to your local memory for next time.',
    icon: CheckCircle2,
    color: 'text-emerald-400',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          How It Works
        </h2>
        <p className="mt-3 text-base text-zinc-400">
          No complex setup or learning curve. It simply fits into the way you already use your computer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-[#131318] border border-zinc-800/80 flex flex-col justify-between shadow-lg shadow-black/40"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display font-black text-3xl text-zinc-700">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                </div>

                <div className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider mb-1">
                  {item.subtitle}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
