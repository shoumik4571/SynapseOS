import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is Synapse?',
    a: 'Synapse is a fast personal AI assistant that lives on your computer. It helps you organize your daily tasks, search the web with live verified facts via Tavily, and draft messages in seconds.',
  },
  {
    q: 'How do I open it?',
    a: 'Press Cmd + K on macOS or Ctrl + K on Windows anytime. A clean assistant window will float over your screen immediately.',
  },
  {
    q: 'Is it completely free?',
    a: 'Yes, 100% free with no credit card required. Built for the Nebius x NVIDIA Hackathon 2026.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Your personal notes, past memory, and tasks are stored privately on your computer with built-in privacy protection.',
  },
];

export default function SimpleFAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          Questions & Answers
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="rounded-2xl border border-zinc-800 bg-[#131318] overflow-hidden">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-white hover:bg-zinc-800/40 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 border-t border-zinc-800/60 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
