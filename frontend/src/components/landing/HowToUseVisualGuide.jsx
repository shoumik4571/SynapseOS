import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Sparkles, 
  Clock, 
  Flag, 
  FileText, 
  CheckCircle2, 
  Upload, 
  ArrowRight, 
  Calendar, 
  Target, 
  MessageSquare, 
  X,
  ExternalLink
} from 'lucide-react';

const GUIDE_STEPS = [
  {
    step: '01',
    title: 'Open Morning Planner & Click "Build Your Schedule"',
    buttonLabel: 'Build Your Schedule',
    buttonColor: 'bg-white text-black',
    action: 'Click the white primary button in the Morning Plan tab.',
    whatToInput: 'Enter your fixed meetings or lecture timestamps (e.g. 10:30 AM Standup, 01:00 PM Lunch) and your hard deadline (e.g. 05:00 PM).',
    whatItDoes: 'Synapse locks in your fixed commitments and reserves an automatic 45–60 minute safety buffer ahead of your deadline.',
    uiMockup: (
      <div className="rounded-xl border border-zinc-800 bg-black/90 p-4 space-y-3 font-sans text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <span className="text-zinc-400 font-mono text-[11px]">1. Your Schedule & Deadlines</span>
          <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 font-mono text-[10px] border border-violet-500/20">Step 1</span>
        </div>
        <div className="space-y-1.5">
          <div className="text-[11px] text-zinc-400">Fixed Times:</div>
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-750 text-zinc-200 font-mono text-[11px]">
            10:30 AM Standup, 01:00 PM Lunch
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-[11px] text-rose-300 flex items-center gap-1 font-semibold">
            <Flag className="w-3 h-3 text-rose-400" />
            <span>Target Deadline:</span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900 border border-rose-500/30 text-rose-300 font-mono text-[11px] flex items-center justify-between">
            <span>05:00 PM (Hard Cutoff)</span>
            <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-300 font-bold">LOCKED</span>
          </div>
        </div>
      </div>
    )
  },
  {
    step: '02',
    title: 'Detail Your Work & Attach Files or Screenshots',
    buttonLabel: 'Attach Files / Screenshots',
    buttonColor: 'bg-zinc-800 text-zinc-200 border border-zinc-700',
    action: 'Type your tasks in the text area and click "Attach Files" if you have project specs or screenshots.',
    whatToInput: 'Explain the scope of your work (e.g. "Fix token streaming buffer, finish LaTeX report, record demo video") and attach images/PDFs.',
    whatItDoes: 'The AI extracts context from your task details and attachments to estimate completion time and detect dependencies.',
    uiMockup: (
      <div className="rounded-xl border border-zinc-800 bg-black/90 p-4 space-y-3 font-sans text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <span className="text-zinc-400 font-mono text-[11px]">2. Tasks & Attachments</span>
          <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 font-mono text-[10px] border border-violet-500/20">Step 2</span>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-750 text-zinc-300 text-[11px] leading-relaxed">
          "Need to finish backend token streamer, review PR #142 buffer fix, and export submission PDF."
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="px-2 py-1 rounded-md bg-zinc-850 border border-zinc-700 text-[10px] text-zinc-300 flex items-center gap-1">
            <Upload className="w-3 h-3 text-emerald-400" />
            <span>architecture_diagram.png</span>
          </span>
          <span className="px-2 py-1 rounded-md bg-zinc-850 border border-zinc-700 text-[10px] text-zinc-300 flex items-center gap-1">
            <FileText className="w-3 h-3 text-cyan-400" />
            <span>requirements.md</span>
          </span>
        </div>
      </div>
    )
  },
  {
    step: '03',
    title: 'Click "Structure My Day" to Get Your Timeline',
    buttonLabel: 'Structure My Day with Nemotron-3.5',
    buttonColor: 'bg-white text-black font-bold shadow-md shadow-white/10',
    action: 'Click the primary button to submit your inputs to NVIDIA Nemotron-3.5.',
    whatToInput: 'Nothing more! Nemotron computes the optimal schedule in ~180 milliseconds on Nebius H100 GPU clusters.',
    whatItDoes: 'Produces a full hour-by-hour timeline categorized into Deep Work, Fixed Commitments, and Deadline Sprint with a 60-min safety buffer.',
    uiMockup: (
      <div className="rounded-xl border border-zinc-800 bg-black/90 p-4 space-y-2.5 font-sans text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <span className="text-emerald-400 font-mono text-[11px] font-bold">Generated Timeline (162 tok/s)</span>
          <span className="text-[10px] text-zinc-400 font-mono">60m Safety Buffer</span>
        </div>
        <div className="p-2 rounded-lg bg-zinc-900 border border-violet-500/30 flex items-center justify-between">
          <div>
            <div className="font-bold text-white text-[11px]">09:30 AM - 11:30 AM</div>
            <div className="text-[10px] text-zinc-400">Deep Work: Token Streamer Sprint</div>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold">DEEP WORK</span>
        </div>
        <div className="p-2 rounded-lg bg-zinc-900 border border-cyan-500/30 flex items-center justify-between">
          <div>
            <div className="font-bold text-white text-[11px]">11:30 AM - 12:30 PM</div>
            <div className="text-[10px] text-zinc-400">Fixed Commitment: Team Sync</div>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">COMMITTED</span>
        </div>
        <div className="p-2 rounded-lg bg-zinc-900 border border-rose-500/30 flex items-center justify-between">
          <div>
            <div className="font-bold text-white text-[11px]">01:30 PM - 03:30 PM</div>
            <div className="text-[10px] text-zinc-400">Deadline Sprint: Final Submission</div>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">DEADLINE</span>
        </div>
      </div>
    )
  },
  {
    step: '04',
    title: 'Check Off Completed Tasks & Chat with Copilot',
    buttonLabel: 'Interactive Checkboxes & Copilot Chat',
    buttonColor: 'bg-violet-600 text-white',
    action: 'Click checkboxes on completed tasks or switch to the AI Copilot tab anytime.',
    whatToInput: 'Ask the copilot technical questions, search live web facts via Tavily, or celebrate finished tasks.',
    whatItDoes: 'Provides interactive celebration confetti on task checkoff and real-time Tavily search grounding with clickable URL citations.',
    uiMockup: (
      <div className="rounded-xl border border-zinc-800 bg-black/90 p-4 space-y-2.5 font-sans text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <span className="text-zinc-400 font-mono text-[11px]">Must Do Today (Interactive)</span>
          <span className="text-emerald-400 font-mono text-[10px]">2 / 3 Completed</span>
        </div>
        <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 line-through text-zinc-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-[11px]">Review client architecture agenda ahead of sync</span>
        </div>
        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-zinc-500 flex-shrink-0" />
          <span className="text-[11px]">Approve PR #142 token streamer buffer fix</span>
        </div>
        <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="text-violet-400 font-semibold">🎉 Confetti pops on completion</span>
          <span className="text-cyan-400">Tavily Web Search 🌐</span>
        </div>
      </div>
    )
  }
];

export default function HowToUseVisualGuide() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section id="how-to-use" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          STEP-BY-STEP VISUAL GUIDE
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          How to Use Synapse
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
          See exactly which buttons to click and what output Synapse produces at each step.
        </p>
      </div>

      {/* 3-Minute Demo Video Showcase Card */}
      <div className="mb-16">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="rounded-3xl border border-violet-500/30 bg-gradient-to-b from-[#181424] to-[#0f0d17] p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glow circle */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>3-MINUTE DEMO VIDEO</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Watch Synapse in Action (Under 3 Minutes)
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Watch how Synapse takes a chaotic schedule, detects hard deadlines, and structures an hour-by-hour timeline with safety buffers and live streaming from Nebius Token Factory.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-sm shadow-xl shadow-white/10 transition-colors"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Watch 3-Min Walkthrough</span>
                </button>

                <span className="text-xs text-zinc-400 font-mono">
                  Recorded for Nebius × NVIDIA Global AI Hackathon
                </span>
              </div>
            </div>

            {/* Video Thumbnail Preview Mockup */}
            <div 
              onClick={() => setVideoModalOpen(true)}
              className="w-full lg:w-96 aspect-video rounded-2xl bg-black/80 border border-zinc-700/80 shadow-2xl relative flex items-center justify-center cursor-pointer group overflow-hidden"
            >
              {/* Fake UI preview in video thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/60 via-black to-zinc-900/80 p-4 opacity-90 group-hover:opacity-75 transition-opacity flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="text-white font-bold">Synapse • Live Demo</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-emerald-400">162 tok/s</span>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white mb-1">Morning Schedule & Deadlines</div>
                  <div className="text-[10px] text-zinc-400 font-mono">09:30 AM Deep Work • 05:00 PM Cutoff</div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>HD 1080p</span>
                  <span>Duration: 02:58</span>
                </div>
              </div>

              {/* Glowing Play Icon */}
              <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform z-10">
                <Play className="w-6 h-6 fill-black ml-0.5" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* The 4 Crisp Visual Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {GUIDE_STEPS.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.1 }}
            className="rounded-3xl border border-zinc-800 bg-[#131318] p-6 sm:p-8 flex flex-col justify-between shadow-xl space-y-6"
          >
            {/* Step Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-sm text-violet-400">
                  {s.step}
                </span>

                {/* Target Button Pill */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  <span className="text-zinc-500">Click:</span>
                  <span className="text-white font-semibold">{s.buttonLabel}</span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                {s.title}
              </h3>

              <div className="space-y-2 text-xs text-zinc-300 leading-relaxed pt-1">
                <div>
                  <strong className="text-white">Action: </strong>
                  {s.action}
                </div>
                <div>
                  <strong className="text-white">What to input: </strong>
                  {s.whatToInput}
                </div>
                <div>
                  <strong className="text-white">What it does: </strong>
                  <span className="text-violet-300">{s.whatItDoes}</span>
                </div>
              </div>
            </div>

            {/* Embedded Visual UI Mockup */}
            <div className="pt-2">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
                UI Output Preview:
              </div>
              {s.uiMockup}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {videoModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <h4 className="text-sm font-bold text-white">Synapse • 3-Minute Demo Video Walkthrough</h4>
                </div>
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Frame */}
              <div className="w-full aspect-video rounded-2xl bg-black border border-zinc-800 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                  <Play className="w-8 h-8 fill-violet-400 ml-1" />
                </div>
                <div className="max-w-md space-y-2">
                  <div className="text-base font-bold text-white">3-Minute Video Showcase Ready</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Insert your recorded YouTube or Loom demonstration URL into this container to showcase your end-to-end user workflow to hackathon evaluators.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 px-3 py-1 rounded bg-zinc-900 border border-zinc-800">
                  Demo Video Slot • Nebius x NVIDIA Global AI Hackathon 2026
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
                >
                  Close Video
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
