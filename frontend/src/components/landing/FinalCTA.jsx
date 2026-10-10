import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Monitor, Sparkles, ArrowRight } from 'lucide-react';

export default function FinalCTA({ onOpenDownload, onOpenLiveDemo }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
      <div className="relative rounded-3xl bg-gradient-to-b from-[#181822] to-[#0d0d12] border border-violet-500/30 p-10 sm:p-14 text-center shadow-2xl shadow-violet-950/30 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/15 blur-[100px] rounded-full pointer-events-none -z-10" />

        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
          Ready for a Faster, Calmer Way to Work?
        </h2>

        <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
          Download SynapseOS for your Mac or PC today. Free to use with our complete Pro feature suite unlocked.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onOpenDownload('mac')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 font-semibold text-sm transition-all shadow-lg shadow-white/10"
          >
            <Apple className="w-4 h-4 fill-current" />
            <span>Download for Mac</span>
          </button>

          <button
            onClick={() => onOpenDownload('win')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#131318] text-white border border-zinc-700 hover:bg-zinc-800 active:scale-95 font-semibold text-sm transition-all"
          >
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Download for Windows</span>
          </button>

          <button
            onClick={onOpenLiveDemo}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600/20 text-violet-200 border border-violet-500/40 hover:bg-violet-600/30 text-sm font-semibold transition-all"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Try in Browser</span>
          </button>
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Instant download • 100% Private • No credit card needed
        </div>
      </div>
    </section>
  );
}
