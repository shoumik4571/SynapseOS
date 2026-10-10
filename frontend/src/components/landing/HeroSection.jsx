import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Monitor, Chrome, Sparkles, ArrowRight, ShieldCheck, Globe, Zap, Command, Laptop } from 'lucide-react';

export default function HeroSection({ onOpenDownload, onOpenLiveDemo }) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Soft ambient violet glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[340px] bg-gradient-to-tr from-violet-600/15 via-purple-500/10 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Model & Infrastructure Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131318] border border-violet-500/30 text-xs text-zinc-300 shadow-md mb-6 flex-wrap justify-center"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">SynapseOS</span>
          <span className="text-zinc-600">•</span>
          <span className="text-violet-300 font-mono">NVIDIA Nemotron-3.5</span>
          <span className="text-zinc-600">•</span>
          <span className="text-cyan-300 font-mono flex items-center gap-1">
            <Zap className="w-3 h-3" /> Nebius Token Factory
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-pink-300 font-mono flex items-center gap-1">
            <Globe className="w-3 h-3" /> Tavily Search
          </span>
        </motion.div>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]"
        >
          Meet SynapseOS:{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">
            The Personal AI Assistant
          </span>{' '}
          for Your Desktop & Browser.
        </motion.h1>

        {/* Clear Relatable Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto font-sans leading-relaxed"
        >
          Available as a <strong>background native desktop app</strong> for complete cross-application productivity, or as a <strong>browser extension</strong> for active tab intelligence and real-time fact-checking via Tavily.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {/* Desktop App */}
          <button
            onClick={() => onOpenDownload('mac')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 transition-all font-semibold text-sm shadow-xl shadow-white/10"
          >
            <Laptop className="w-4 h-4 fill-current" />
            <div className="text-left">
              <div className="leading-none text-[10px] text-neutral-600 font-medium">macOS & Windows</div>
              <div className="leading-tight text-sm font-bold">Download Desktop App</div>
            </div>
          </button>

          {/* Browser Extension */}
          <button
            onClick={() => onOpenDownload('ext')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#131318] text-white border border-zinc-700/80 hover:border-cyan-500/60 hover:bg-zinc-900 active:scale-95 transition-all font-semibold text-sm shadow-md"
          >
            <Chrome className="w-4 h-4 text-cyan-400" />
            <div className="text-left">
              <div className="leading-none text-[10px] text-zinc-400 font-medium">Chrome / Arc / Edge</div>
              <div className="leading-tight text-sm font-bold">Add Browser Extension</div>
            </div>
          </button>

          {/* Try in Browser */}
          <button
            onClick={onOpenLiveDemo}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-violet-600/20 text-violet-200 border border-violet-500/40 hover:bg-violet-600/30 hover:text-white transition-all text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Test Drive Live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* 3 Core Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400"
        >
          <div className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-violet-400" />
            <span>Universal Shortcut (Cmd + K)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-pink-400" />
            <span>Deep Tavily Fact Verification</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Free & Open-Source</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
