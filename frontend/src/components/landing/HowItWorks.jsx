import React from 'react';
import { Command, MessageSquare, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '1',
    title: 'Press Cmd + K',
    desc: 'Hit Cmd+K on Mac or Ctrl+K on Windows anytime. Synapse pops up over whatever app or browser you are using.',
    icon: Command,
  },
  {
    step: '2',
    title: 'Ask or Type What You Need',
    desc: 'Ask a question, ask it to polish an email, summarize a page, or review your morning schedule.',
    icon: MessageSquare,
  },
  {
    step: '3',
    title: 'Done in Seconds',
    desc: 'Synapse searches the web via Tavily, drafts your message, and gets it done with zero waiting.',
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
          How It Works
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          No complex learning curve. It simply fits into your daily routine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="p-6 rounded-2xl bg-[#131318] border border-zinc-800 flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-white mb-4">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
