import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, PenTool, BookOpen, CheckCircle, Sparkles, Copy, Check } from 'lucide-react';

const cases = [
  {
    id: 'professionals',
    label: 'Daily Work & Planning',
    icon: Briefcase,
    persona: 'For busy professionals & founders',
    input: 'Look at my schedule for today, summarize what matters most, and draft a quick update for the team.',
    output: {
      tag: 'DAILY SUMMARY & DRAFT',
      preview: 'Good morning! Here is your plan:',
      content: `• 11:30 AM: Client design review (Proposal attached)\n• 2:00 PM: Focus block for product release\n• Action item: Follow up with Sarah regarding Q4 budget`,
      draft: `Team Update Draft:\n"Morning everyone! Focusing on the product release today after our 11:30 design review. Let me know if anyone needs quick feedback before then."`,
    },
  },
  {
    id: 'writing',
    label: 'Writing & Polishing',
    icon: PenTool,
    persona: 'For clear communication',
    input: 'Rewrite my blunt email to sound warm, professional, and appreciative.',
    output: {
      tag: 'POLISHED EMAIL DRAFT',
      preview: 'Here is a warm, polite revision:',
      content: `Before: "I need this report by 3pm today or we will miss the deadline."`,
      draft: `"Hi team, thank you for all your hard work on this! Could we please finalize the report by 3:00 PM today so we stay on schedule for our review? Let me know if there are any blockers."`,
    },
  },
  {
    id: 'research',
    label: 'Instant Research & Summaries',
    icon: BookOpen,
    persona: 'For students, analysts & researchers',
    input: 'Summarize the key takeaways from this article and explain the main conclusion in simple words.',
    output: {
      tag: 'EXECUTIVE SUMMARY',
      preview: 'Key insights from 12-page document:',
      content: `1. Productivity increases by 34% when using ambient desktop AI.\n2. Users save an average of 42 minutes per day on email drafting.\n3. Privacy-first local filtering eliminates data breach risks.`,
      draft: `In short: Desktop AI assistants save significant daily time by handling small repetitive tasks while keeping sensitive data private on your computer.`,
    },
  },
];

export default function UseCasesInteractive() {
  const [activeCase, setActiveCase] = useState(cases[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Everyday Scenarios
        </h2>
        <p className="mt-3 text-base text-zinc-400">
          See how SynapseOS saves you time throughout your day with simple, natural requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {cases.map((c) => {
          const Icon = c.icon;
          const isSelected = activeCase.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setActiveCase(c);
                setCopied(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#131318] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Card */}
      <div className="rounded-2xl border border-zinc-800 bg-[#131318] p-6 sm:p-8 shadow-2xl shadow-black/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* User Prompt */}
          <div className="flex flex-col justify-between p-6 rounded-xl bg-black/60 border border-zinc-800/80">
            <div>
              <div className="text-xs font-mono text-violet-400 font-semibold mb-3">
                WHAT YOU ASK (CMD + K)
              </div>
              <div className="text-base sm:text-lg text-zinc-200 font-medium leading-relaxed">
                "{activeCase.input}"
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 text-xs text-zinc-500">
              {activeCase.persona}
            </div>
          </div>

          {/* Assistant Response */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCase.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col justify-between p-6 rounded-xl bg-zinc-900/80 border border-violet-500/30"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-cyan-400 font-bold">{activeCase.output.tag}</span>
                  <span className="text-emerald-400 font-bold">Generated instantly</span>
                </div>

                <div className="text-xs text-zinc-400 mb-2">
                  {activeCase.output.preview}
                </div>

                <div className="p-3 rounded-lg bg-black/60 border border-zinc-800/80 text-xs text-zinc-300 whitespace-pre-line leading-relaxed mb-3">
                  {activeCase.output.content}
                </div>

                <div className="p-3 rounded-lg bg-violet-950/20 border border-violet-500/30 text-xs text-zinc-200 whitespace-pre-line leading-relaxed font-sans">
                  {activeCase.output.draft}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Ready to use</span>
                <button
                  onClick={() => handleCopy(activeCase.output.draft)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
