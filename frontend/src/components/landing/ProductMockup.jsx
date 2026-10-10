import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  MessageSquare,
  CheckCircle2,
  Bookmark,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  Send,
  Search
} from 'lucide-react';

export default function ProductMockup() {
  const [activeTab, setActiveTab] = useState('briefing');

  const tabs = [
    { id: 'briefing', label: 'Morning Briefing', icon: Sun },
    { id: 'chat', label: 'Ask & Draft', icon: MessageSquare },
    { id: 'goals', label: 'To-Do & Goals', icon: CheckCircle2 },
    { id: 'memory', label: 'Memory & Notes', icon: Bookmark },
  ];

  return (
    <section className="relative -mt-4 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Desktop App Window */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl border border-zinc-800 bg-[#131318] shadow-2xl shadow-black/80 overflow-hidden"
      >
        {/* macOS Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0c0c10] border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 text-xs text-zinc-400 font-medium hidden sm:inline">
              SynapseOS • Personal Workspace
            </span>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-1 bg-[#181820] p-1 rounded-lg border border-zinc-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400' : 'text-zinc-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-zinc-400 font-mono hidden md:block">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">Cmd + K</kbd>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 min-h-[380px] bg-gradient-to-b from-[#131318] to-[#0c0c10]">
          <AnimatePresence mode="wait">
            {/* 1. Morning Briefing */}
            {activeTab === 'briefing' && (
              <motion.div
                key="briefing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-violet-400 font-medium mb-1">
                    <Sun className="w-4 h-4" /> Today's Focus
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Good morning, Alex. Here is your plan for today.
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    You have 2 meetings this afternoon and 3 priority goals ready to tackle.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <div className="text-xs text-zinc-400 flex items-center gap-1.5 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-violet-400" /> 11:30 AM
                    </div>
                    <div className="text-sm font-semibold text-white">Design Review with Team</div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Meeting notes and last week's decisions prepared in your draft tray.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <div className="text-xs text-zinc-400 flex items-center gap-1.5 mb-2">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> Focus Time
                    </div>
                    <div className="text-sm font-semibold text-white">Finalize Product Launch</div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Blocked out 90 minutes of quiet time with notifications paused.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <div className="text-xs text-zinc-400 flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Suggestion
                    </div>
                    <div className="text-sm font-semibold text-white">Follow up with Sarah</div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Draft response ready: "Thank you for the proposal, approved for Friday."
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/30 flex items-center justify-between">
                  <span className="text-xs text-zinc-300">
                    Want SynapseOS to prepare quick bullet points for your 11:30 meeting?
                  </span>
                  <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors">
                    Yes, prepare now
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. Ask & Draft */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex justify-end">
                  <div className="max-w-md p-3.5 rounded-2xl rounded-tr-sm bg-violet-600/30 border border-violet-500/40 text-sm text-zinc-100">
                    Draft a polite email to David confirming our meeting moved to Friday at 2 PM.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="max-w-lg p-4 rounded-2xl rounded-tl-sm bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-200 space-y-2">
                    <p className="font-semibold text-white">Here is your draft:</p>
                    <p className="text-zinc-300 text-xs italic bg-black/40 p-3 rounded-lg border border-zinc-800 leading-relaxed">
                      "Hi David, hope you're having a great week! Just following up to confirm that Friday at 2:00 PM works perfectly for our catch-up. Looking forward to speaking then."
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors">
                        Copy to Clipboard
                      </button>
                      <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                        Make it shorter
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. To-Do & Goals */}
            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                  <span className="text-sm font-bold text-white">Today's Priorities</span>
                  <span className="text-xs text-emerald-400 font-medium">2 of 4 Completed</span>
                </div>

                {[
                  { text: 'Review quarterly slide deck for executive team', done: true },
                  { text: 'Reply to client feedback on the new onboarding flow', done: true },
                  { text: 'Write product announcement draft for website', done: false, active: true },
                  { text: 'Schedule 15-minute catch-up with marketing lead', done: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${
                      item.done
                        ? 'bg-zinc-900/30 border-zinc-800 text-zinc-500 line-through'
                        : item.active
                        ? 'bg-violet-950/20 border-violet-500/40 text-white font-medium'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          item.done ? 'text-emerald-400' : item.active ? 'text-violet-400' : 'text-zinc-600'
                        }`}
                      />
                      <span>{item.text}</span>
                    </div>
                    {item.active && (
                      <span className="text-[11px] font-mono text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded">
                        IN PROGRESS
                      </span>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* 4. Memory & Notes */}
            {activeTab === 'memory' && (
              <motion.div
                key="memory"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    readOnly
                    value="pricing notes from yesterday's meeting"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                  />
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-semibold text-white">Found in: Zoom Meeting Notes (Yesterday, 3:15 PM)</span>
                    <span>100% Match</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    "Agreed to offer the Proactive Deep Flow tier for free during launch, then transition to $19/month for team plans. Alex will announce on Friday."
                  </p>
                  <div className="text-[11px] text-violet-400 font-mono pt-1">
                    Stored securely in your private local memory
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
