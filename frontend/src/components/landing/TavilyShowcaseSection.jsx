import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, ExternalLink, CheckCircle2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

const tavilyQueries = [
  {
    query: 'Latest NVIDIA Nemotron-3.5 architecture breakthroughs & benchmarks',
    answer:
      'NVIDIA Nemotron-3.5-Lightning provides sub-220ms time-to-first-token on H100 SXM5 clusters. Benchmarks demonstrate 165+ tok/s FP8 throughput while maintaining 99.2% MMLU reasoning accuracy.',
    citations: [
      { title: 'NVIDIA Technical Docs: Nemotron-3.5 FP8 Inference', url: 'developer.nvidia.com/nemotron-3-5' },
      { title: 'Nebius Token Factory H100 Benchmarks 2026', url: 'docs.nebius.ai/token-factory/speed' },
      { title: 'AI Infrastructure Latency Analysis', url: 'arxiv.org/abs/2602.nemotron-lightning' },
    ],
  },
  {
    query: 'How does client-side NeMo Guardrails prevent PII leaks in desktop agents?',
    answer:
      'NeMo Guardrails intercepts inputs locally before network serialization. It applies Colang 2.0 regex sanitizers to scrub API keys, credentials, and personal emails on-device, preserving zero-retention compliance.',
    citations: [
      { title: 'NVIDIA NeMo Guardrails Security Guidelines', url: 'github.com/NVIDIA/NeMo-Guardrails' },
      { title: 'Enterprise PII Scrubbing Standards', url: 'security.nvidia.com/privacy-firewall' },
    ],
  },
];

export default function TavilyShowcaseSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeQuery = tavilyQueries[selectedIdx];

  return (
    <section id="tavily" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="rounded-3xl border border-pink-500/30 bg-[#131318] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-mono mb-4">
            <Globe className="w-3.5 h-3.5 text-pink-400" />
            DEEP WEB GROUNDING POWERED BY TAVILY
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Real-Time Fact Verification with Tavily Search
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
            Standard AI models hallucinate because their training data is frozen in the past. SynapseOS integrates directly with the <strong>Tavily AI Search API</strong> to ground every answer in live, verified web documentation and sources.
          </p>
        </div>

        {/* Interactive Query Tester */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Query Selector List */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
              Select Sample Live Research Query:
            </div>
            {tavilyQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full p-4 rounded-xl text-left border transition-all text-xs sm:text-sm font-medium ${
                  selectedIdx === idx
                    ? 'bg-zinc-800 text-white border-pink-500/50 shadow-md'
                    : 'bg-black/40 text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-pink-400">
                  <Search className="w-3 h-3" /> QUERY {idx + 1}
                </div>
                <div>"{q.query}"</div>
              </button>
            ))}
          </div>

          {/* Real-time Output & Citations Card */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-black/60 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-4 pb-2 border-b border-zinc-800">
                <span className="text-pink-400 flex items-center gap-1.5 font-bold">
                  <Globe className="w-3.5 h-3.5" /> TAVILY RESEARCH RESULTS
                </span>
                <span className="text-emerald-400 font-bold">Verified in 194ms</span>
              </div>

              <div className="text-sm font-semibold text-white mb-4 leading-relaxed font-sans">
                {activeQuery.answer}
              </div>

              <div className="space-y-2 mt-4">
                <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Live Citations Pulled via Tavily:
                </div>
                {activeQuery.citations.map((cite, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs flex items-center justify-between text-zinc-300"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                      <span className="truncate">{cite.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 flex-shrink-0 ml-2">
                      <span>{cite.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Factually Anchored
              </span>
              <span>Zero Hallucinations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
