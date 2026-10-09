import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Target, Send, Pin, CheckCircle2, Circle } from 'lucide-react';

export default function AmbientDrawer({ briefing, metrics, onCapture }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [quickText, setQuickText] = useState('');
  const [tasksDone, setTasksDone] = useState({});

  // Keyboard shortcut Cmd + Shift + S to toggle
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
      {/* Edge Hover Handle */}
      {!isOpen && (
        <div
          onMouseEnter={() => !isPinned && setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center cursor-pointer group"
        >
          <div className="bg-slate-900/90 hover:bg-slate-850 border-l border-y border-slate-700/80 rounded-l-xl p-2.5 shadow-2xl backdrop-blur-md flex flex-col items-center gap-2 group-hover:border-nvidia-green/60 transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nvidia-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-nvidia-green"></span>
            </span>
            <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-nvidia-green transition-colors" />
            <span className="text-[10px] font-mono font-bold text-slate-400 [writing-mode:vertical-rl] tracking-widest uppercase">
              HUD
            </span>
          </div>
        </div>
      )}

      {/* Slide-In Glassmorphic Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-84 sm:w-96 bg-slate-950/90 border-l border-slate-800/80 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-nvidia-green animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              SynapseOS Ambient HUD
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? "Unpin Drawer" : "Pin Drawer Open"}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isPinned ? 'text-nvidia-green bg-nvidia-green/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Live Speedometer Mini */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Nebius Throughput:</span>
            </div>
            <div className="text-xs font-mono font-bold text-nvidia-green">
              {metrics?.tokens_per_second || "100+"} <span className="text-[10px] text-slate-500">tok/s</span>
            </div>
          </div>

          {/* Today's High-Leverage Tasks */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Target className="w-3.5 h-3.5 text-nvidia-green" />
              <span>Today's Priorities</span>
            </div>

            <div className="space-y-2">
              {priorities.slice(0, 4).map((p, i) => {
                const done = tasksDone[i];
                return (
                  <div
                    key={i}
                    onClick={() => setTasksDone(prev => ({ ...prev, [i]: !prev[i] }))}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      done
                        ? 'bg-slate-950/40 border-slate-800/40 text-slate-500 line-through'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <button className="mt-0.5 text-nvidia-green flex-shrink-0">
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5 text-slate-600" />}
                    </button>
                    <span className="leading-relaxed text-[11px]">{p}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fleeting Quick Thought Bar */}
          <div className="pt-2">
            <form onSubmit={handleQuickSubmit} className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400">Ambient Thought Capture</span>
              <div className="relative">
                <input
                  type="text"
                  value={quickText}
                  onChange={(e) => setQuickText(e.target.value)}
                  placeholder="Drop a quick mental thread..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-nvidia-green rounded-xl pl-3 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!quickText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-nvidia-green transition-colors disabled:opacity-30"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/30 text-[10px] text-slate-500 flex justify-between font-mono">
          <span>Toggle: ⌘+Shift+S</span>
          <span className="text-nvidia-green">Nemotron-3.5-Lightning</span>
        </div>
      </div>
    </>
  );
}
