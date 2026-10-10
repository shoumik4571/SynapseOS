import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Globe, ShieldCheck, Zap, Sparkles, FileText, Mail, GitPullRequest, ArrowRight, CheckCircle2 } from 'lucide-react';

const simulatedActivities = [
  {
    id: 'docs',
    icon: FileText,
    name: 'Reading Tech Documentation',
    tabTitle: 'docs.nvidia.com — Nemotron-3.5 Architecture',
    contentPreview: 'Nemotron-3.5 leverages hybrid FP8 tensor cores to achieve sub-220ms time-to-first-token with 165+ tok/s streaming throughput on H100 SXM5 clusters.',
    watcherDetection: {
      action: 'Detected Active Tab: NVIDIA Documentation',
      privacyStatus: 'NeMo Guardrails: Scanned 120 words • 0 PII leaks',
      tavilyGrounding: 'Tavily Search: Auto-cross-referenced 3 benchmark papers',
      assistantOutput: 'Proactive Briefing: Summarized 3 key takeaways. FP8 retains 99.2% accuracy while doubling throughput over FP16.',
    },
  },
  {
    id: 'email',
    icon: Mail,
    name: 'Reviewing Client Email',
    tabTitle: 'mail.google.com — Subject: Q4 Enterprise Deployment',
    contentPreview: 'Hi team, could you please confirm if our deployment meets SOC2 privacy requirements and when we can schedule the architecture review?',
    watcherDetection: {
      action: 'Detected Active Tab: Client Email Draft',
      privacyStatus: 'NeMo Guardrails: Sanitized sender email & client company name',
      tavilyGrounding: 'Tavily Search: Pulled internal security checklist & calendar',
      assistantOutput: 'Proactive Action: Pre-drafted reply confirming SOC2 compliance and suggesting Friday 2 PM for the architecture review.',
    },
  },
  {
    id: 'pr',
    icon: GitPullRequest,
    name: 'Reviewing GitHub Pull Request',
    tabTitle: 'github.com/org/repo — PR #142: Fix Token Stream Buffer Contention',
    contentPreview: 'Resolves race condition in async SSE streamer channel buffer during high concurrency bursts on Nebius Token Factory gateway.',
    watcherDetection: {
      action: 'Detected Active Tab: GitHub Pull Request #142',
      privacyStatus: 'NeMo Guardrails: Masked test API keys in git diff',
      tavilyGrounding: 'Tavily Search: Verified concurrency benchmark on Go 1.24 channels',
      assistantOutput: 'Proactive Action: Verified mutex buffer fix. Auto-generated PR review approval comment and test execution commands.',
    },
  },
];

export default function ActivityMonitorSimulator() {
  const [activeTab, setActiveTab] = useState(simulatedActivities[0]);

  return (
    <section id="activity-simulator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="rounded-3xl border border-violet-500/30 bg-[#131318] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-mono mb-4">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            LIVE ACTIVITY WATCHER SIMULATOR
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            See How SynapseOS Monitors & Anticipates Your Activity
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
            Standard websites cannot see what other tabs or apps you have open due to browser sandboxing. 
            <strong> Click the simulated activities below</strong> to experience how our <strong>Browser Extension</strong> and <strong>Desktop App</strong> passively understand your context in real time:
          </p>
        </div>

        {/* Interactive Activity Switcher */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {simulatedActivities.map((act) => {
            const Icon = act.icon;
            const isSelected = activeTab.id === act.id;
            return (
              <button
                key={act.id}
                onClick={() => setActiveTab(act)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-zinc-800 text-white border-violet-500/60 shadow-lg shadow-violet-950/30'
                    : 'bg-black/40 text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isSelected ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40' : 'bg-zinc-900 text-zinc-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">{act.name}</div>
                  <div className="text-[11px] font-mono text-zinc-500 truncate max-w-[200px]">{act.tabTitle.split('—')[0]}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Simulation Display */}
        <div className="rounded-2xl border border-zinc-800 bg-black/60 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left: What the user is doing (The Browser Tab) */}
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-3 pb-2 border-b border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-zinc-300 truncate">ACTIVE BROWSER TAB: {activeTab.tabTitle}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-black/70 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed font-sans italic">
                  "{activeTab.contentPreview}"
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Passively read by Extension / App</span>
                <span className="text-violet-400">Zero Copy-Pasting Required</span>
              </div>
            </div>

            {/* Right: What SynapseOS outputs in real time */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-xl bg-zinc-900/90 border border-violet-500/40 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-zinc-800">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> SYNAPSEOS AMBIENT REACTION
                    </span>
                    <span className="text-emerald-400 font-bold">148ms</span>
                  </div>

                  {/* 3 Step Telemetry Outputs */}
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800/80 flex items-start gap-2 text-zinc-300">
                      <Eye className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{activeTab.watcherDetection.action}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800/80 flex items-start gap-2 text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{activeTab.watcherDetection.privacyStatus}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800/80 flex items-start gap-2 text-pink-300">
                      <Globe className="w-3.5 h-3.5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>{activeTab.watcherDetection.tavilyGrounding}</span>
                    </div>
                  </div>

                  {/* The Proactive Output */}
                  <div className="p-3.5 rounded-lg bg-violet-950/30 border border-violet-500/40 text-xs text-white leading-relaxed font-sans font-medium">
                    {activeTab.watcherDetection.assistantOutput}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Context Synced
                  </span>
                  <span>Press Cmd+K to expand</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
