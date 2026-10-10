import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code, Briefcase, Search, ArrowRight, CheckCircle, Globe, Shield, Sparkles } from 'lucide-react';

const cases = [
  {
    id: 'engineers',
    label: 'Software Engineers',
    icon: Code,
    role: 'Full-Stack & Systems Engineers',
    input: 'Review git diff on branch fix/token-streamer, check for concurrency bottlenecks, and propose unit tests.',
    output: {
      tag: 'ARCHITECTURE & CODE SYNTHESIS',
      time: '182ms • 170.4 tok/s',
      summary: 'Detected 1 mutex lock contention at line 42. Formulated async channel buffer fix.',
      codeBlock: `// Auto-generated atomic buffer fix\nconst bufferChan = make(chan TokenPayload, 256);\ngo func() {\n  for token := range bufferChan {\n    streamer.WriteToken(token)\n  }\n}()`,
      nextActions: [
        'Run test suite: `go test -race ./streamer/...`',
        'Draft GitHub PR with Nebius benchmark metrics',
      ],
    },
  },
  {
    id: 'founders',
    label: 'Founders & Tech Leads',
    icon: Briefcase,
    role: 'Startups & Engineering Leaders',
    input: 'Synthesize overnight user feedback reports and draft my morning executive standup priorities.',
    output: {
      tag: 'EXECUTIVE BRIEFING & ACTION MATRIX',
      time: '240ms • 168.1 tok/s',
      summary: '14 user signals grouped into 3 themes: latency wins (88%), BYOK request (8%), pricing clarity (4%).',
      codeBlock: `[PRIORITY 1]: Ship BYOK Nebius key entry modal (Blocks 3 enterprise trials)\n[PRIORITY 2]: Update landing page benchmark telemetry to reflect 165+ tok/s\n[PRIORITY 3]: Schedule demo recording for Hackathon submission video`,
      nextActions: [
        'Export action items to Linear / Notion',
        'Pre-compose email update to angel investors',
      ],
    },
  },
  {
    id: 'researchers',
    label: 'Deep Researchers',
    icon: Search,
    role: 'AI Researchers & Analysts',
    input: 'Compare FP8 vs INT4 quantization tradeoffs on NVIDIA Nemotron-3.5 with live web citations.',
    output: {
      tag: 'TAVILY GROUNDED RESEARCH REPORT',
      time: '310ms • 165.9 tok/s',
      summary: 'Queried 5 web sources via Tavily API. Nemotron retains 99.2% MMLU accuracy under FP8 on H100.',
      codeBlock: `// Citations verified via Tavily:\n[1] docs.nebius.ai/token-factory/benchmarks-2026\n[2] developer.nvidia.com/nemotron-3-5-lightning\n=> Recommendation: Keep FP8 enabled for 2.4x speedup with zero logic degradation.`,
      nextActions: [
        'Add reference links to research bibliography',
        'Cache findings to local SQLite vector store',
      ],
    },
  },
];

export default function UseCasesInteractive() {
  const [activeCase, setActiveCase] = useState(cases[0]);

  return (
    <section id="use-cases" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono mb-4">
          REAL-WORLD WORKFLOWS
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Built for High-Leverage Builders
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          See how SynapseOS transforms natural desktop input into concrete results in under a second.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {cases.map((c) => {
          const Icon = c.icon;
          const isSelected = activeCase.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCase(c)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-[#131318] text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Transformation Card */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#131318]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Input Panel */}
          <div className="flex flex-col justify-between p-6 rounded-xl bg-black/60 border border-zinc-800/80">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-4 pb-2 border-b border-zinc-800/60">
                <span className="text-violet-400 font-bold">DESKTOP INPUT (CMD+K)</span>
                <span>{activeCase.role}</span>
              </div>
              <div className="text-base sm:text-lg font-medium text-zinc-200 leading-relaxed font-sans">
                "{activeCase.input}"
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Shield className="w-3.5 h-3.5" /> NeMo Guardrails Sanitized
              </span>
              <span className="text-zinc-400">Press ↵ to Execute</span>
            </div>
          </div>

          {/* Output Panel with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCase.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col justify-between p-6 rounded-xl bg-zinc-900/80 border border-violet-500/30"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-4 pb-2 border-b border-zinc-800/60">
                  <span className="text-cyan-400 font-bold">{activeCase.output.tag}</span>
                  <span className="text-emerald-400 font-bold">{activeCase.output.time}</span>
                </div>

                <div className="text-sm font-semibold text-white mb-3">
                  {activeCase.output.summary}
                </div>

                <div className="p-3.5 rounded-lg bg-black/70 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre">
                  {activeCase.output.codeBlock}
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Next Automated Actions:
                  </div>
                  {activeCase.output.nextActions.map((action, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-violet-300">
                  <Sparkles className="w-3.5 h-3.5" /> Nebius H100 Stream
                </span>
                <span className="text-zinc-500">Auto-saved to Memory</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
