import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Zap, Shield, Crown, ArrowRight, Star, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProFeatureTrial({ onOpenLiveDemo }) {
  const [activated, setActivated] = useState(false);

  const handleActivateTrial = () => {
    setActivated(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#8B5CF6', '#22D3EE', '#FFFFFF', '#D946EF'],
    });
  };

  const proPerks = [
    {
      title: 'Autonomous Overnight Pre-Computation',
      desc: 'SynapseOS synthesizes your calendars, repository issues, and open workspaces at 04:00 AM so your morning briefing is instant.',
    },
    {
      title: 'Cross-Device Neural Memory Sync',
      desc: 'Seamlessly relays your contextual memory and preferences between your macOS MacBook and Windows desktop workstation.',
    },
    {
      title: 'Uncapped Nebius H100 Priority Lane',
      desc: 'Guaranteed 165+ tok/s throughput with zero rate limits or queuing during peak developer hours.',
    },
    {
      title: 'Autonomous Multi-Turn Execution Chains',
      desc: 'Executes complex 10-step research and refactoring workflows with built-in Tavily web verification.',
    },
  ];

  return (
    <section id="pro-trial" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/5 to-cyan-500/10 blur-3xl pointer-events-none -z-10 rounded-3xl" />

      <div className="rounded-3xl border-2 border-violet-500/30 bg-[#131318]/95 p-8 sm:p-12 shadow-2xl shadow-violet-950/30 backdrop-blur-xl relative overflow-hidden">
        {/* Decorative corner tag */}
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-l from-violet-600 to-purple-600 text-white font-mono text-xs font-bold px-6 py-2 rounded-bl-2xl shadow-md flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            HACKATHON LAUNCH TRIAL
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 text-xs font-mono mb-4">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            THE FLAGSHIP INNOVATION
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Proactive Deep Flow Engine & Neural Sync
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
            Standard AI chatbots wait for you to type a prompt. SynapseOS’s flaghip engine anticipates what you need next:
            proactively compiling your morning agenda, organizing git branch context diffs, and keeping your memory perfectly synced across devices.
          </p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-display font-black text-white">$0.00</span>
            <span className="text-sm text-zinc-400 line-through font-mono">$19 / month</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
              100% COMPLIMENTARY TRIAL FOR EVALUATION
            </span>
          </div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
          {proPerks.map((perk, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex items-start gap-3.5"
            >
              <div className="w-6 h-6 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-violet-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{perk.title}</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div className="mt-10 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Instant activation • No credit card required • Active for Hackathon 2026</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {activated ? (
              <div className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Pro Trial Activated! Ready to test.
              </div>
            ) : (
              <button
                onClick={handleActivateTrial}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Activate Free Pro Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenLiveDemo}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700/80 hover:text-white text-sm font-semibold transition-all border border-zinc-700/60"
            >
              Test Live
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
