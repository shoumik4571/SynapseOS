import React from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles, Apple, Monitor, Terminal, ArrowRight, ShieldCheck, Zap, Cpu } from 'lucide-react';

export default function HeroSection({ onOpenDownload, onOpenLiveDemo }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Subtle ambient lighting gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-violet-600/15 via-purple-500/10 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-900/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Release / Tech Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131318]/90 border border-violet-500/30 text-xs font-mono text-zinc-300 shadow-lg shadow-violet-950/20 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-violet-300 font-semibold">v1.2.0 Launch</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" /> Nebius H100 × NVIDIA Nemotron
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]"
        >
          The Personal AI Copilot for Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">
            Operating System
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mt-6 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-sans leading-relaxed"
        >
          SynapseOS seamlessly orchestrates your daily workflows, memory, and proactive task planning with blazing{' '}
          <span className="text-white font-semibold">165+ tok/s</span> inference powered by NVIDIA Nemotron on Nebius Token Factory.
        </motion.p>

        {/* Download & Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {/* macOS Download */}
          <button
            onClick={() => onOpenDownload('mac')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 transition-all font-semibold text-sm shadow-xl shadow-white/10 group"
          >
            <Apple className="w-4 h-4 fill-current group-hover:-translate-y-0.5 transition-transform" />
            <div className="text-left">
              <div className="leading-none text-xs text-neutral-600 font-medium">Download for</div>
              <div className="leading-tight text-sm font-bold">macOS (.dmg)</div>
            </div>
          </button>

          {/* Windows Download */}
          <button
            onClick={() => onOpenDownload('win')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#131318] text-white border border-zinc-700/80 hover:border-violet-500/60 hover:bg-zinc-900 active:scale-95 transition-all font-semibold text-sm shadow-xl shadow-black/40 group"
          >
            <Monitor className="w-4 h-4 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
            <div className="text-left">
              <div className="leading-none text-xs text-zinc-400 font-medium">Download for</div>
              <div className="leading-tight text-sm font-bold">Windows (.exe)</div>
            </div>
          </button>

          {/* Try in Browser */}
          <button
            onClick={onOpenLiveDemo}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-violet-600/20 text-violet-200 border border-violet-500/40 hover:bg-violet-600/30 hover:text-white transition-all text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Try Live Cloud Demo</span>
            <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
          </button>
        </motion.div>

        {/* Micro-specs under buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-400 font-mono"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> NeMo Guardrails Privacy Firewall
          </span>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <span>Apple Silicon & Intel 64-bit</span>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <span>Windows 10/11 x64</span>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <span className="text-violet-400">Zero telemetry lock-in</span>
        </motion.div>
      </div>
    </section>
  );
}
