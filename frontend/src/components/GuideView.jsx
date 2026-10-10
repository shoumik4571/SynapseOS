import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Command,
  ShieldCheck,
  Zap,
  Target,
  Database,
  ArrowRight,
  CheckCircle2,
  Award,
  Sparkles,
  Download,
  Play
} from 'lucide-react';

export default function GuideView({ onSelectTab, onOpenCapture, onOpenDownload }) {
  const [activeStep, setActiveStep] = useState(0);
  const [testPiiInput, setTestPiiInput] = useState('My secret key is sk_live_93817491 and email is alex@company.com');

  const sanitizePii = (text) => {
    return text
      .replace(/sk_[a-zA-Z0-9_-]+/g, '[REDACTED_API_KEY]')
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  };

  const steps = [
    {
      num: '01',
      title: 'Executive Morning Briefing',
      subtitle: 'Proactive Daily Kickoff',
      icon: Target,
      badge: 'Feature 1 of 5',
      color: 'text-violet-400',
      description:
        'SynapseOS synthesizes what you worked on, open loops, and high-leverage priorities before you even start your workday. Click below to experience the live briefing output.',
      actionLabel: 'View Executive Briefing Output',
      onAction: () => onSelectTab('briefing'),
      details: [
        'Interactive priority tasks with instant celebration feedback',
        'Automatic detection of unresolved threads and open loops',
        'One-click regeneration powered by NVIDIA Nemotron-3.5',
      ],
    },
    {
      num: '02',
      title: 'Autonomous Goal Decomposition',
      subtitle: 'From Big Objectives to Actionable Steps',
      icon: Compass,
      badge: 'Feature 2 of 5',
      color: 'text-purple-400',
      description:
        'Type any ambitious goal (e.g. "Prepare product launch" or "Redesign architecture"). SynapseOS instantly outputs a 3-phase strategic roadmap, time estimates, and today\'s tactical checklist.',
      actionLabel: 'Test Goal Engine Output',
      onAction: () => onSelectTab('goals'),
      details: [
        'Multi-phase milestone breakdown with estimated completion dates',
        'Prioritized daily task checklist with time allocations',
        'Automated blocker prediction and risk mitigation',
      ],
    },
    {
      num: '03',
      title: 'Grounded AI Copilot & Research',
      subtitle: 'Live Reasoning with Tavily Citations',
      icon: Sparkles,
      badge: 'Feature 3 of 5',
      color: 'text-cyan-400',
      description:
        'Ask questions, draft emails, and research technical questions. SynapseOS streams answers at 165+ tok/s while verifying factual citations via Tavily live web search.',
      actionLabel: 'Chat with Grounded Copilot',
      onAction: () => onSelectTab('chat'),
      details: [
        'Real-time streaming answers powered by Nebius H100 GPU clusters',
        'Live web search integration with clickable source citations',
        'Context-aware answers referencing your active workspace',
      ],
    },
    {
      num: '04',
      title: 'Client-Side Privacy Shield',
      subtitle: 'NeMo Guardrails On-Device Protection',
      icon: ShieldCheck,
      badge: 'Feature 4 of 5',
      color: 'text-emerald-400',
      description:
        'Watch privacy in action. Try typing any sensitive credential below—NeMo Guardrails strips it locally on your computer before anything is sent.',
      sandbox: true,
      actionLabel: 'Inspect Privacy Memory Logs',
      onAction: () => onSelectTab('memory'),
      details: [
        'On-device regex and Colang 2.0 pattern matching',
        'Zero API keys, passwords, or personal emails sent to cloud',
        'Encrypted local SQLite knowledge store',
      ],
    },
    {
      num: '05',
      title: 'Hardware Speedometer & Benchmarks',
      subtitle: '165+ tok/s Live Telemetry Output',
      icon: Zap,
      badge: 'Feature 5 of 5',
      color: 'text-amber-400',
      description:
        'See the raw power of Nebius Token Factory serving NVIDIA Nemotron-3.5 on H100 SXM5 clusters with live latency and throughput gauges.',
      actionLabel: 'Run Live Benchmark Test',
      onAction: () => onSelectTab('benchmark'),
      details: [
        'Real-time tokens/second streaming gauge',
        'Sub-220ms Time-To-First-Token (TTFT) measurement',
        'Direct latency comparison against standard cloud inference',
      ],
    },
  ];

  const current = steps[activeStep];
  const StepIcon = current.icon;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              INTERACTIVE PRODUCT TOUR
            </span>
            <span className="text-xs text-neutral-400">Step-by-step walkthrough</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            How SynapseOS Works
          </h2>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Explore the core outputs below. Each tab in the dock demonstrates a working output of our ambient desktop AI companion.
          </p>
        </div>

        <button
          onClick={onOpenDownload}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md active:scale-95 flex-shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Native App</span>
        </button>
      </motion.div>

      {/* Step Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isSelected = activeStep === idx;
          return (
            <button
              key={s.num}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-neutral-900 border-white text-white shadow-md'
                  : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-neutral-500">{s.num}</span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-neutral-500'}`} />
              </div>
              <div className="text-xs font-semibold truncate">
                {s.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Step Content Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 space-y-6 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
            <div>
              <div className="text-xs font-mono text-neutral-400 mb-1">
                <span>{current.badge}</span> • <span>{current.subtitle}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                <StepIcon className={`w-5 h-5 ${current.color}`} />
                {current.title}
              </h3>
            </div>

            <button
              onClick={current.onAction}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md active:scale-95"
            >
              <span>{current.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed font-sans max-w-3xl">
            {current.description}
          </p>

          {/* Interactive Privacy Sandbox in Step 4 */}
          {current.sandbox && (
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="text-xs font-mono text-emerald-400 flex items-center justify-between">
                <span>TRY PRIVACY SANITIZATION LIVE:</span>
                <span className="text-neutral-500">On-Device Filter</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-neutral-400 font-mono block mb-1">Raw Input (Contains private keys/email):</label>
                  <input
                    type="text"
                    value={testPiiInput}
                    onChange={(e) => setTestPiiInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-neutral-700 text-white font-mono text-xs outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-emerald-400 font-mono block mb-1">Sanitized Output (What is safely sent):</label>
                  <div className="px-3 py-2 rounded-lg bg-black/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs break-all">
                    {sanitizePii(testPiiInput)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {current.details.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
            <button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              ← Previous
            </button>
            <span className="font-mono text-neutral-500">
              {activeStep + 1} of {steps.length}
            </span>
            <button
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Next →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
