import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'What does SynapseOS do as my personal AI assistant?',
    a: 'SynapseOS lives right on your computer. With a quick shortcut (Cmd+K on Mac, Ctrl+K on Windows), it helps you draft emails, plan your day, summarize documents, find lost notes, and manage daily to-dos—without ever needing to open a separate browser tab.',
  },
  {
    q: 'How is it different from opening ChatGPT or Claude in a browser?',
    a: 'Web chatbots are isolated inside a browser tab and know nothing about your computer or schedule. SynapseOS is built into your operating system—it can recall past notes from your sessions, organize your morning routine, and stay ready at your fingertips with a single global keystroke.',
  },
  {
    q: 'Is my personal data and notes kept private?',
    a: 'Yes, absolutely. SynapseOS includes built-in privacy protection that shields your passwords, personal identifiers, and private credentials on your device. Your notes and memory are saved locally on your computer in an encrypted format.',
  },
  {
    q: 'Does it work on both macOS and Windows?',
    a: 'Yes! We offer a native DMG installer for macOS (compatible with Apple Silicon M1-M4 and Intel) and a standard installer for Windows 10 and Windows 11.',
  },
  {
    q: 'Can I test it right now in my web browser without downloading?',
    a: 'Yes! Just click the "Try in Browser" button at the top of this page. You can test out the daily briefing, assistant chat, to-do planner, and memory features live without installing anything.',
  },
  {
    q: 'How does the free Pro Trial work?',
    a: 'During our launch evaluation, the flagship Proactive Deep Flow feature (which plans your morning and pre-drafts replies ahead of time) is completely free to test with no credit card required.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-base text-zinc-400">
          Simple answers to common questions about SynapseOS.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-800 bg-[#131318] overflow-hidden"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors"
              >
                <span className="text-base font-semibold text-white">
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
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-1 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/40">
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
