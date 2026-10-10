import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, Sun, PenTool, Check, Copy, ExternalLink, Send } from 'lucide-react';

const presetDemos = [
  {
    id: 'briefing',
    label: '☀️ 1. Morning Planner',
    query: 'Show me my morning briefing and top priorities for today.',
    output: {
      tag: 'MORNING PLAN',
      title: 'Good morning, Alex. Here is your plan for today:',
      content: [
        '1. Review client architecture notes ahead of 11:30 AM meeting',
        '2. Review PR #142 token streamer buffer fix before afternoon deploy',
        '3. Block out 90 minutes of quiet focus time for technical documentation',
      ],
      note: 'Draft response to Sarah is ready in your tray.',
    },
  },
  {
    id: 'tavily',
    label: '🌐 2. Live Web Search (Tavily)',
    query: 'What are the latest NVIDIA Nemotron-3.5 benchmark speeds on Nebius?',
    output: {
      tag: 'TAVILY LIVE SEARCH',
      title: 'Real-time facts from the web:',
      content: [
        '• Model: NVIDIA Nemotron-3.5-Lightning on Nebius Token Factory H100 clusters.',
        '• Throughput: Streams at 165+ tokens/second with sub-220ms time-to-first-token.',
        '• Verification: 99.2% accuracy retained with zero hallucination via Tavily citations.',
      ],
      citations: [
        'docs.nebius.ai/token-factory',
        'developer.nvidia.com/nemotron-3-5',
      ],
    },
  },
  {
    id: 'writing',
    label: '✉️ 3. Email Drafter',
    query: 'Draft a polite follow-up confirming our Friday meeting moved to 2:00 PM.',
    output: {
      tag: 'POLISHED EMAIL',
      title: 'Here is your ready-to-send draft:',
      content: [
        '"Hi David, hope you are having a productive week! Just following up to confirm that Friday at 2:00 PM works perfectly for our catch-up. Looking forward to speaking then."',
      ],
      copyable: true,
    },
  },
];

export default function LiveDemoSection() {
  const [activeDemo, setActiveDemo] = useState(presetDemos[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="demo" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="rounded-3xl border border-zinc-800 bg-[#131318] p-6 sm:p-10 shadow-2xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            TRY IT RIGHT HERE
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            See Synapse in Action
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Click any button below to see the exact output Synapse produces.
          </p>
        </div>

        {/* 3 Simple Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
          {presetDemos.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setActiveDemo(d);
                setCopied(false);
              }}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                activeDemo.id === d.id
                  ? 'bg-white text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Live Output Card */}
        <div className="p-6 rounded-2xl bg-black/70 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-zinc-800">
            <span className="text-violet-400 font-bold">{activeDemo.output.tag}</span>
            <span className="text-emerald-400">Generated in 180ms</span>
          </div>

          <div className="text-sm font-semibold text-white">
            {activeDemo.output.title}
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            {activeDemo.output.content.map((line, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                {line}
              </div>
            ))}
          </div>

          {activeDemo.output.citations && (
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-zinc-400">
              <span className="text-pink-400 font-bold">Citations:</span>
              {activeDemo.output.citations.map((cite, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1">
                  <span>{cite}</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </span>
              ))}
            </div>
          )}

          {activeDemo.output.copyable && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleCopy(activeDemo.output.content[0])}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
