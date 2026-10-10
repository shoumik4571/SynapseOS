import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Monitor, Sparkles, ArrowRight, ShieldCheck, Check, Command } from 'lucide-react';

export default function HeroSection({ onOpenDownload, onOpenLiveDemo }) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Soft ambient violet glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-gradient-to-tr from-violet-600/15 via-purple-500/10 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Simple friendly badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131318] border border-violet-500/30 text-xs text-zinc-300 shadow-md mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">SynapseOS 1.2</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">Available for macOS & Windows</span>
        </motion.div>

        {/* Clear, human headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]"
        >
          Your Personal AI Assistant.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">
            Right on Your Desktop.
          </span>
        </motion.h1>

        {/* Simple, relatable description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto font-sans leading-relaxed"
        >
          SynapseOS organizes your day, drafts your messages, remembers what you read, and takes care of tasks—instantly summoned with a single keystroke.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {/* macOS Download */}
          <button
            onClick={() => onOpenDownload('mac')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 transition-all font-semibold text-sm shadow-xl shadow-white/10"
          >
            <Apple className="w-4 h-4 fill-current" />
            <span>Download for Mac</span>
          </button>

          {/* Windows Download */}
          <button
            onClick={() => onOpenDownload('win')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#131318] text-white border border-zinc-700/80 hover:border-zinc-500 hover:bg-zinc-900 active:scale-95 transition-all font-semibold text-sm shadow-md"
          >
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Download for Windows</span>
          </button>

          {/* Try in Browser */}
          <button
            onClick={onOpenLiveDemo}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-violet-600/20 text-violet-200 border border-violet-500/40 hover:bg-violet-600/30 hover:text-white transition-all text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Try in Browser</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* 3 Simple Pillars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400"
        >
          <div className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-violet-400" />
            <span>Always ready (Cmd + K)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Private on your device</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-cyan-400" />
            <span>Free to use & no credit card</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
