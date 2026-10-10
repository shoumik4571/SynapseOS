import React from 'react';
import { motion } from 'framer-motion';
import { Command, ShieldAlert, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Zero-Friction Desktop Capture',
    subtitle: 'Ambient & Hotkey Ingestion',
    description:
      'Hit Cmd+K (Mac) or Ctrl+K (Windows) from any application. SynapseOS passively reads clipboard context, window metadata, and active tasks with zero friction.',
    icon: Command,
    tag: 'LOCAL BUFFER',
    color: 'text-violet-400',
    border: 'border-violet-500/30',
  },
  {
    step: '02',
    title: 'NeMo Privacy Firewall',
    subtitle: 'Client-Side Sanitization',
    description:
      'Before a single byte leaves your computer, NeMo Guardrails inspects the text locally—scrubbing passwords, access tokens, and sensitive PII on-device.',
    icon: ShieldAlert,
    tag: 'PRIVACY SHIELD',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  {
    step: '03',
    title: 'Nebius Token Factory H100',
    subtitle: '165+ tok/s Inference',
    description:
      'Sanitized context streams directly to NVIDIA Nemotron-3.5-Lightning running on Nebius H100 SXM5 clusters, producing reasoning outputs in milliseconds.',
    icon: Cpu,
    tag: 'ULTRA-LOW LATENCY',
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  {
    step: '04',
    title: 'Proactive Execution & Memory',
    subtitle: 'SQLite Vector Graph',
    description:
      'Results are executed into verified subtasks, drafted responses, and logged to your local SQLite memory store for persistent cross-session recall.',
    icon: CheckCircle2,
    tag: 'PERSISTENT SYNC',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono mb-4">
          SYSTEM WORKFLOW
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          How SynapseOS Operates
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          A four-tier pipeline combining on-device security with cloud supercomputing throughput.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className={`p-6 sm:p-7 rounded-2xl bg-[#131318]/90 border ${item.border} flex flex-col justify-between relative overflow-hidden shadow-xl shadow-black/40`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display font-black text-3xl sm:text-4xl text-zinc-700">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                </div>

                <div className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider mb-1">
                  {item.subtitle}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>{item.tag}</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
