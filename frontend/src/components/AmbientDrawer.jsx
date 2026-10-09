import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Target, Send, Pin, CheckCircle2, Circle } from 'lucide-react';

export default function AmbientDrawer({ briefing, metrics, onCapture }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [quickText, setQuickText] = useState('');
  const [tasksDone, setTasksDone] = useState({});

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!quickText.trim()) return;

    try {
      await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Ambient Fleeting Thought',
          content: quickText.trim(),
          item_type: 'thought'
        })
      });
      setQuickText('');
      onCapture?.();
    } catch (err) {
      console.error(err);
    }
  };

  const priorities = briefing?.priorities || briefing?.briefing?.priorities || [
    "Focus on core hackathon deliverables",
    "Validate Nebius Token Factory live streaming",
    "Prepare submission demo"
  ];

  return (
    <>
      {/* Edge Hover Handle with Magnification */}
      {!isOpen && (
        <motion.div
          whileHover={{ scale: 1.12, x: -2 }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          onMouseEnter={() => !isPinned && setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center cursor-pointer group"
        >
          <div className="bg-neutral-900 hover:bg-neutral-800 border-l border-y border-neutral-700 rounded-l-xl py-3 px-2 backdrop-blur-xl flex flex-col items-center gap-1.5 transition-all shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span className="text-[9px] font-mono text-neutral-300 [writing-mode:vertical-rl] tracking-wider uppercase font-semibold">
              HUD
            </span>
          </div>
        </motion.div>
      )}

      {/* Slide-In Clean Glass Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-84 sm:w-96 bg-neutral-950/95 border-l border-neutral-800 backdrop-blur-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              SynapseOS Ambient HUD
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? "Unpin Drawer" : "Pin Drawer Open"}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isPinned ? 'text-black bg-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Live Speedometer Mini */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>Nebius Throughput:</span>
            </div>
            <div className="text-xs font-mono font-bold text-white">
              {metrics?.tokens_per_second || "165.3"} <span className="text-[10px] text-neutral-400">tok/s</span>
            </div>
          </motion.div>

          {/* Today's High-Leverage Tasks with Magnification */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
              <Target className="w-3.5 h-3.5 text-white" />
              <span>Today's Priorities</span>
            </div>

            <div className="space-y-2">
              {priorities.slice(0, 4).map((p, i) => {
                const done = tasksDone[i];
                return (
                  <motion.div
                    key={i}
                    onClick={() => setTasksDone(prev => ({ ...prev, [i]: !prev[i] }))}
                    whileHover={{ scale: 1.025, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 450, damping: 22 }}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      done
                        ? 'bg-black/60 border-neutral-900 text-neutral-500 line-through'
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-200'
                    }`}
                  >
                    <button className="mt-0.5 text-white flex-shrink-0">
                      {done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-neutral-500" />}
                    </button>
                    <span className="leading-relaxed text-[11px]">{p}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Fleeting Quick Thought Bar */}
          <div className="pt-2">
            <form onSubmit={handleQuickSubmit} className="space-y-2">
              <span className="text-[11px] font-semibold text-neutral-400">Ambient Thought Capture</span>
              <div className="relative">
                <input
                  type="text"
                  value={quickText}
                  onChange={(e) => setQuickText(e.target.value)}
                  placeholder="Drop a quick mental thread..."
                  className="w-full bg-black border border-neutral-800 focus:border-neutral-500 rounded-xl pl-3 pr-9 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
                <motion.button
                  type="submit"
                  disabled={!quickText.trim()}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-neutral-300 transition-colors disabled:opacity-30"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-900/40 text-[10px] text-neutral-500 flex justify-between font-mono">
          <span>Toggle: ⌘+Shift+S</span>
          <span className="text-white">Nemotron-3.5-Lightning</span>
        </div>
      </div>
    </>
  );
}
