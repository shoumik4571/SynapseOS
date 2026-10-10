import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Monitor, Chrome, Command, Sparkles, ShieldCheck, Globe } from 'lucide-react';

export default function HeroSection({ onOpenDownload }) {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 text-center px-4 max-w-4xl mx-auto">
      {/* Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Free Personal AI Assistant for Mac & Windows</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1]">
        Your Daily AI Assistant.{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">
          Simple, fast, and helpful.
        </span>
      </h1>

      {/* Clear Explanation */}
      <p className="mt-5 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
        Synapse sits quietly in your background to organize your day, draft polite messages, and find up-to-date answers on the web—ready the moment you press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs">Cmd + K</kbd>.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onOpenDownload('mac')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
        >
          <Apple className="w-4 h-4 fill-current" />
          <span>Download for Mac</span>
        </button>

        <button
          onClick={() => onOpenDownload('win')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#131318] text-white border border-zinc-700 hover:bg-zinc-800 transition-colors font-semibold text-sm"
        >
          <Monitor className="w-4 h-4 text-cyan-400" />
          <span>Download for Windows</span>
        </button>

        <button
          onClick={() => onOpenDownload('ext')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#131318] text-white border border-zinc-700 hover:bg-zinc-800 transition-colors font-semibold text-sm"
        >
          <Chrome className="w-4 h-4 text-emerald-400" />
          <span>Chrome Extension</span>
        </button>
      </div>

      {/* 3 Simple Badges */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Powered by NVIDIA & Nebius</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Live Web Search with Tavily</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Free & Private</span>
        </div>
      </div>
    </section>
  );
}
