import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Crown, ArrowRight, Star, Moon, Laptop, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProFeatureTrial({ onOpenLiveDemo }) {
  const [activated, setActivated] = useState(false);

  const handleActivateTrial = () => {
    setActivated(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8B5CF6', '#22D3EE', '#FFFFFF'],
    });
  };

  const perks = [
    {
      title: 'Works Ahead While You Sleep',
      desc: 'Wakes up early to review your calendar and tasks so your morning plan is waiting when you open your laptop.',
      icon: Moon,
    },
    {
      title: 'Syncs Between Mac and PC',
      desc: 'Seamlessly keeps your notes, preferences, and assistant memory updated across your MacBook and desktop workstation.',
      icon: Laptop,
    },
    {
      title: 'Pre-Drafts Daily Replies',
      desc: 'Intelligently prepares draft responses to routine messages so you can approve them in one click.',
      icon: Sparkles,
    },
    {
      title: 'Private & Secure Storage',
      desc: 'All personal preferences and schedules are protected with local encryption on your machine.',
      icon: Shield,
    },
  ];

  return (
    <section id="pro-trial" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
      <div className="rounded-3xl border border-violet-500/30 bg-[#131318] p-8 sm:p-12 shadow-2xl shadow-violet-950/20 backdrop-blur-xl relative overflow-hidden">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 text-xs font-semibold mb-4">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          FLAGSHIP PRO FEATURE
        </div>

        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Proactive Deep Flow: An Assistant That Thinks Ahead
        </h2>

        <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
          Most AI assistants sit idle until you remember to ask them a question. SynapseOS works ahead of you—pre-sorting your day, anticipating your meetings, and drafting replies so you start each morning focused.
        </p>

        <div className="mt-6 flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-display font-extrabold text-white">Free on Trial</span>
          <span className="text-sm text-zinc-400 line-through">$19 / month</span>
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            AVAILABLE COMPLIMENTARY FOR EARLY USERS
          </span>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-violet-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{perk.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-zinc-400">
            No credit card required. Free to test during launch.
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {activated ? (
              <div className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Pro Trial Activated!
              </div>
            ) : (
              <button
                onClick={handleActivateTrial}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Activate Free Pro Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onOpenLiveDemo}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold transition-all border border-zinc-700"
            >
              Test in Browser
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
