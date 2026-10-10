import React from 'react';
import { Sun, Globe, PenTool, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Sun,
    title: '1. Morning Planner',
    subtitle: 'Starts your day with clarity',
    description:
      'Wakes up before you do. It looks at your upcoming tasks and gives you a calm 1-minute briefing with your top 3 priorities for the day.',
    iconColor: 'text-amber-400',
  },
  {
    icon: Globe,
    title: '2. Live Web Search',
    subtitle: 'Powered by Tavily Search',
    description:
      'Unlike standard chatbots with outdated knowledge, Synapse searches the live internet in real time to find verified facts and documentation.',
    iconColor: 'text-cyan-400',
  },
  {
    icon: PenTool,
    title: '3. Instant Writer & Drafter',
    subtitle: 'Saves you 45 minutes daily',
    description:
      'Turn rough thoughts into polite, professional emails. Summarize lengthy articles, reports, or meeting notes with a single click.',
    iconColor: 'text-violet-400',
  },
  {
    icon: ShieldCheck,
    title: '4. Private Memory',
    subtitle: 'Safe on your computer',
    description:
      'Remembers what you worked on yesterday so you never lose context. Protected by built-in privacy firewalls that keep passwords and personal data safe.',
    iconColor: 'text-emerald-400',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
          What Synapse Does For You
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-400">
          Four everyday superpowers that save you hours every week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-[#131318] border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                <div className="text-xs font-mono text-zinc-500 mb-3">{item.subtitle}</div>
                <p className="text-sm text-zinc-300 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
