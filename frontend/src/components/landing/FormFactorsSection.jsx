import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, Chrome, Download, Check, Sparkles, Command, Shield, Globe } from 'lucide-react';

export default function FormFactorsSection({ onOpenDownload, onOpenExtension }) {
  return (
    <section id="form-factors" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          FLEXIBLE ARCHITECTURE
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Two Ways to Experience SynapseOS
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
          Because web browsers sandbox what an app can see, SynapseOS gives you full control: run the complete native application for whole-system automation, or use the lightweight browser extension.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Option 1: Full Desktop Application */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-violet-500/30 bg-[#131318] p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-violet-600/30 border-b border-l border-violet-500/40 rounded-bl-xl text-[11px] font-mono text-violet-300 font-semibold">
            RECOMMENDED FOR POWER USERS
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center mb-6">
              <Laptop className="w-6 h-6 text-violet-400" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Full Desktop Application
            </h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Runs quietly in your macOS Menu Bar or Windows Taskbar Tray. Monitors tasks across all applications with global hotkeys.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 mb-8">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Cross-Application Monitoring:</strong> Understands your active IDE, terminal, notes, and browser simultaneously.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Global Hotkey (Cmd+K / Ctrl+K):</strong> Summon SynapseOS anywhere, even with no browser open.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Private SQLite Memory:</strong> Long-term memory graph encrypted locally on your hard drive.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Autonomous Morning Briefing:</strong> Pre-computes your daily focus and priorities before you wake up.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onOpenDownload('mac')}
            className="w-full py-3.5 px-6 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10"
          >
            <Download className="w-4 h-4" />
            <span>Download Desktop App (.dmg / .exe)</span>
          </button>
        </motion.div>

        {/* Option 2: Browser Extension */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-3xl border border-zinc-800 bg-[#131318] p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-zinc-800/80 border-b border-l border-zinc-700/60 rounded-bl-xl text-[11px] font-mono text-cyan-300 font-semibold">
            ZERO INSTALLATION OVERHEAD
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center mb-6">
              <Chrome className="w-6 h-6 text-cyan-400" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Browser Extension
            </h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              For users who only want assistance inside their browser. Inspects current tabs, reads documentation, and fact-checks live.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 mb-8">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Active Tab Comprehension:</strong> Instantly summarizes long articles, research papers, or GitHub pull requests.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Tavily Fact-Checking on the Fly:</strong> Verifies web claims in real-time while you read.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Zero System Footprint:</strong> Runs entirely within Chrome, Arc, Brave, or Edge without OS permissions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Quick In-Page Assistant:</strong> Press Alt+S to summarize any paragraph or draft a web response.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onOpenExtension}
            className="w-full py-3.5 px-6 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 active:scale-95 font-bold text-sm transition-all border border-zinc-700 flex items-center justify-center gap-2"
          >
            <Chrome className="w-4 h-4 text-cyan-400" />
            <span>Add Browser Extension</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
