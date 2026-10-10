import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Target,
  MessageSquare,
  Gauge,
  Sparkles,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  Globe,
  Terminal,
  Cpu,
  Layers,
  Search
} from 'lucide-react';

export default function ProductMockup() {
  const [activeTab, setActiveTab] = useState('briefing');

  const tabs = [
    { id: 'briefing', label: 'Morning Briefing', icon: Compass },
    { id: 'goals', label: 'Autonomous Goals', icon: Target },
    { id: 'chat', label: 'Grounded Copilot', icon: MessageSquare },
    { id: 'telemetry', label: 'H100 Speedometer', icon: Gauge },
  ];

  return (
    <section className="relative -mt-6 sm:-mt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Glow surround */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Desktop Window Frame */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="rounded-2xl border border-zinc-800/90 bg-[#131318]/95 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden"
      >
        {/* macOS Window Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0c0c10] border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
            <span className="ml-3 text-xs font-mono text-zinc-400 hidden sm:inline">
              SynapseOS Desktop • <span className="text-zinc-300">workspace_main</span>
            </span>
          </div>

          {/* Interactive Navigation Tabs inside Mockup */}
          <div className="flex items-center gap-1 bg-[#181820] p-1 rounded-lg border border-zinc-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400' : 'text-zinc-500'}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Live Speed Badge in Chrome */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              168.4 tok/s
            </span>
          </div>
        </div>

        {/* Window Content Display */}
        <div className="p-6 md:p-8 min-h-[420px] bg-gradient-to-b from-[#131318] to-[#0d0d12]">
          <AnimatePresence mode="wait">
            {/* 1. Briefing Tab */}
            {activeTab === 'briefing' && (
              <motion.div
                key="briefing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        DAILY AUTONOMOUS BRIEFING
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">08:00 AM • Synthesized in 420ms</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-display font-bold text-white mt-1">
                      Good morning, Alex. 3 high-leverage priorities flagged.
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      Nemotron-3.5-Lightning (Nebius H100)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-violet-500/40 transition-colors">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                      <span className="flex items-center gap-1 font-mono text-violet-400">
                        <Zap className="w-3.5 h-3.5" /> CRITICAL TASK
                      </span>
                      <span className="text-emerald-400 font-semibold">Priority 1</span>
                    </div>
                    <div className="font-medium text-sm text-zinc-200">
                      Deploy v1.2 API Gateways to Nebius Token Factory
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      Clipboard context detected 2 pending branch reviews and token auth rotation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/40 transition-colors">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                      <span className="flex items-center gap-1 font-mono text-cyan-400">
                        <Globe className="w-3.5 h-3.5" /> WEB GROUNDING
                      </span>
                      <span className="text-cyan-400 font-semibold">Tavily Live</span>
                    </div>
                    <div className="font-medium text-sm text-zinc-200">
                      Sync NVIDIA Nemotron Architecture Updates
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      Automated background web search pulled latest benchmarks and FP8 inference docs.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                      <span className="flex items-center gap-1 font-mono text-emerald-400">
                        <Shield className="w-3.5 h-3.5" /> PRIVACY AUDIT
                      </span>
                      <span className="text-emerald-400 font-semibold">Clean</span>
                    </div>
                    <div className="font-medium text-sm text-zinc-200">
                      NeMo Guardrails: 0 Leaks Redacted
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      All local clipboard items sanitized on-device before prompt vectorization.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#161622] border border-violet-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
                    <span className="text-xs text-zinc-300">
                      Proactive suggestion: Would you like SynapseOS to prepare the pull request description now?
                    </span>
                  </div>
                  <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors">
                    Execute (Tab)
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. Goals Tab */}
            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-violet-400" /> Autonomous Goal Planner & Execution
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Nemotron breaks multi-hour ambitions into verified, sequential micro-steps.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded">
                    Active: Launch Hackathon Submission
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: 'Benchmark Token Latency on Nebius H100 (165+ tok/s target)', done: true, time: '2 mins ago' },
                    { title: 'Integrate NeMo Guardrails Client-Side PII Firewall', done: true, time: '15 mins ago' },
                    { title: 'Ground Live Citations with Tavily Search API', done: true, time: '30 mins ago' },
                    { title: 'Package macOS .dmg & Windows .exe Native Installers', done: false, active: true },
                    { title: 'Verify SQLite Context Memory Synchronization', done: false },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                        step.done
                          ? 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400'
                          : step.active
                          ? 'bg-violet-950/20 border-violet-500/40 text-white'
                          : 'bg-zinc-900/20 border-zinc-800/40 text-zinc-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            step.done ? 'text-emerald-400' : step.active ? 'text-violet-400 animate-spin' : 'text-zinc-600'
                          }`}
                        />
                        <span className="text-sm font-medium">{step.title}</span>
                      </div>
                      <span className="text-xs font-mono text-zinc-500">
                        {step.done ? 'COMPLETED' : step.active ? 'IN PROGRESS' : 'QUEUED'}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. Chat Tab */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" /> Tavily Web Grounding Enabled
                  </span>
                  <span className="font-mono text-zinc-500">Model: nvidia/Nemotron-3_5-Lightning</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 justify-end">
                    <div className="max-w-lg p-3.5 rounded-2xl rounded-tr-sm bg-violet-600/30 border border-violet-500/40 text-sm text-zinc-100">
                      How does SynapseOS achieve 165+ tokens/second inference speed while maintaining privacy?
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <div className="max-w-xl p-4 rounded-2xl rounded-tl-sm bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-200 space-y-2">
                      <p>
                        SynapseOS pairs two architectural breakthroughs:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-300">
                        <li>
                          <strong className="text-white">Nebius Token Factory SXM5 Clusters:</strong> Serves NVIDIA Nemotron-3.5-Lightning on dedicated H100s with sub-220ms time-to-first-token.
                        </li>
                        <li>
                          <strong className="text-white">NeMo Local Guardrails:</strong> Evaluates prompt boundaries and strips private credentials locally before transmitting payload tokens.
                        </li>
                      </ul>
                      <div className="pt-2 flex items-center gap-4 text-[11px] font-mono text-zinc-400 border-t border-zinc-800">
                        <span className="text-emerald-400">⚡ 171.2 tok/s</span>
                        <span>TTFT: 204ms</span>
                        <span>Grounding: 3 citations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. Telemetry Tab */}
            {activeTab === 'telemetry' && (
              <motion.div
                key="telemetry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                    <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">168.4</div>
                    <div className="text-xs font-mono text-zinc-400 mt-1">TOKENS / SECOND</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Nebius H100 SXM5</div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                    <div className="text-2xl sm:text-3xl font-display font-extrabold text-cyan-400">208ms</div>
                    <div className="text-xs font-mono text-zinc-400 mt-1">TIME TO FIRST TOKEN</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Ultra-low latency</div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                    <div className="text-2xl sm:text-3xl font-display font-extrabold text-violet-400">0.0%</div>
                    <div className="text-xs font-mono text-zinc-400 mt-1">HALLUCINATION RATE</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">NeMo Verified</div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                    <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">100%</div>
                    <div className="text-xs font-mono text-zinc-400 mt-1">LOCAL MEMORY PRIVACY</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">SQLite Vector Store</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800/80 font-mono text-xs text-zinc-400 space-y-1.5">
                  <div className="text-zinc-500">// Real-time hardware telemetry stream</div>
                  <div className="text-emerald-400">CONNECTED: Nebius Token Factory api.nebius.ai/v1</div>
                  <div className="text-zinc-300">GPU_CLUSTER: NVIDIA H100 80GB HBM3 | PCI Gen5 128GB/s</div>
                  <div className="text-violet-400">GUARDRAIL_STATUS: NeMo Colang 2.0 active (PII Filter ON)</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
