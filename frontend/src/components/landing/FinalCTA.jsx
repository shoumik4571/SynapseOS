import React from 'react';
import { motion } from 'framer-motion';
import { Download, Apple, Monitor, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function FinalCTA({ onOpenDownload, onOpenLiveDemo }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <div className="relative rounded-3xl bg-gradient-to-b from-[#181822] to-[#0c0c10] border border-violet-500/30 p-10 sm:p-16 text-center shadow-2xl shadow-violet-950/40 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-mono mb-6">
          <Zap className="w-3.5 h-3.5 text-cyan-400" /> READY TO ELEVATE YOUR DESKTOP
        </div>

        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Supercharge Your Operating System with SynapseOS
        </h2>

        <p className="mt-5 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
          Download the native desktop client for macOS and Windows. Free for Hackathon 2026 evaluation with full Pro Deep Flow access.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onOpenDownload('mac')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 font-bold text-sm transition-all shadow-xl shadow-white/10"
          >
            <Apple className="w-4 h-4 fill-current" />
            <span>macOS Universal (.dmg)</span>
          </button>

          <button
            onClick={() => onOpenDownload('win')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#131318] text-white border border-zinc-700 hover:border-violet-500/60 hover:bg-zinc-900 active:scale-95 font-bold text-sm transition-all"
          >
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Windows 64-bit (.exe)</span>
          </button>

          <button
            onClick={onOpenLiveDemo}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-violet-600/20 text-violet-200 border border-violet-500/40 hover:bg-violet-600/30 hover:text-white transition-all text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Test In Browser</span>
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 font-mono">
          <span>v1.2.0 Universal</span>
          <span>•</span>
          <span>Instant One-Click Install</span>
          <span>•</span>
          <span>No Credit Card Required</span>
        </div>
      </div>
    </section>
  );
}
