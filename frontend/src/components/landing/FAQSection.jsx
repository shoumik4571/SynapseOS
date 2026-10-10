import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'What makes SynapseOS different from web chatbots like ChatGPT or Claude?',
    a: 'SynapseOS is not a static web page or isolated browser tab. It is a native desktop operating system companion that lives in your menu bar / taskbar. It passively understands your active workspace, captures clipboard items via Cmd+K, runs at 165+ tok/s using Nebius Token Factory, and maintains a private local SQLite memory graph across your sessions.',
  },
  {
    q: 'How does SynapseOS achieve 165+ tokens/second inference speed?',
    a: 'We leverage Nebius Token Factory SXM5 GPU infrastructure serving NVIDIA Nemotron-3.5-Lightning. By utilizing dedicated high-bandwidth memory (HBM3) and FP8 precision inference, responses stream almost instantaneously with sub-220ms time-to-first-token.',
  },
  {
    q: 'Is my sensitive desktop data and code sent to the cloud?',
    a: 'No. SynapseOS runs a local NeMo Guardrails privacy firewall directly on your machine. Any clipboard buffers or prompted code are inspected locally on-device to redact API keys, credentials, PII, and company secrets before tokens leave your computer.',
  },
  {
    q: 'Can I bring my own API keys (BYOK)?',
    a: 'Yes, fully supported! You can enter your own Nebius Token Factory key, NVIDIA NIM credentials, or Tavily Search API key in the Settings modal. Your keys are saved directly into your local OS keychain or browser storage and never routed through any intermediary servers.',
  },
  {
    q: 'How does the free Pro Feature trial work?',
    a: 'For our Hackathon 2026 launch, the entire Proactive Deep Flow Copilot & Neural Sync suite (normally $19/mo) is unlocked completely free of charge. You can activate it with one click with zero credit card or billing details required.',
  },
  {
    q: 'Does SynapseOS work on both Mac and Windows?',
    a: 'Yes. We provide native Universal DMG packages for macOS (Apple Silicon M1-M4 and Intel) as well as 64-bit EXE/MSI installers for Windows 10 and 11.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-mono mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
          FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="mt-4 text-base text-zinc-400">
          Clear answers regarding privacy, architecture, hardware requirements, and compatibility.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-800/80 bg-[#131318]/90 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors"
              >
                <span className="text-base sm:text-lg font-bold text-white font-sans">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-violet-400' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/40">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
