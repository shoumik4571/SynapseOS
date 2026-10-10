import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Sun, MessageSquare, Compass, Gauge, Award } from 'lucide-react';

const TABS = [
  { id: 'briefing', label: 'Morning Plan', icon: Sun },
  { id: 'chat', label: 'AI Copilot', icon: MessageSquare },
  { id: 'goals', label: 'Goal Planner', icon: Compass },
  { id: 'benchmark', label: 'Speed Test', icon: Gauge },
  { id: 'guide', label: "Judges' Tour", icon: Award },
];

function DockItem({ mouseX, tab, isActive, onClick }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Compute distance from cursor to center of this dock item
  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return Infinity;
    return val - (rect.x + rect.width / 2);
  });

  // macOS Dock wave curve physics
  const sizeSync = useTransform(distance, [-160, -80, 0, 80, 160], [48, 62, 78, 62, 48]);
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 260, damping: 17 });

  const ySync = useTransform(distance, [-160, -80, 0, 80, 160], [0, -5, -16, -5, 0]);
  const y = useSpring(ySync, { mass: 0.1, stiffness: 260, damping: 17 });

  const iconScaleSync = useTransform(distance, [-160, -80, 0, 80, 160], [1, 1.25, 1.6, 1.25, 1]);
  const iconScale = useSpring(iconScaleSync, { mass: 0.1, stiffness: 260, damping: 17 });

  const Icon = tab.icon;

  return (
    <div className="relative flex flex-col items-center">
      {/* macOS Floating Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-9 px-2.5 py-1 rounded-lg bg-neutral-900/95 border border-neutral-700/80 text-white text-[11px] font-medium tracking-tight shadow-xl pointer-events-none whitespace-nowrap z-50 backdrop-blur-md"
          >
            {tab.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock Magnifying Icon Button */}
      <motion.button
        ref={ref}
        style={{ width: size, height: size, y }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileTap={{ scale: 0.88 }}
        className={`relative flex items-center justify-center rounded-2xl transition-colors ${
          isActive
            ? 'bg-white text-black shadow-lg shadow-white/20'
            : 'bg-neutral-900/80 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700'
        }`}
      >
        <motion.div style={{ scale: iconScale }} className="flex items-center justify-center">
          <Icon className={`w-5 h-5 ${isActive ? 'text-black stroke-[2.2]' : 'text-neutral-300 stroke-[1.8]'}`} />
        </motion.div>
      </motion.button>

      {/* macOS Active App Indicator Dot */}
      <div className="h-1.5 flex items-center justify-center mt-1">
        {isActive ? (
          <motion.div
            layoutId="macDockActiveDot"
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="w-1.5 h-1.5 rounded-full bg-white shadow-sm shadow-white"
          />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
        )}
      </div>
    </div>
  );
}

export default function MacDockNav({ activeTab, onSelectTab, isDemoMode }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="sticky top-[58px] bg-black/90 backdrop-blur-2xl z-30 pt-1 pb-3 flex items-center justify-between border-b border-neutral-800/80">
      {/* Authentic macOS Dock Container */}
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-2.5 px-3 py-1.5 rounded-3xl bg-neutral-950/90 border border-neutral-800/90 shadow-2xl backdrop-blur-xl"
      >
        {TABS.map((tab) => (
          <DockItem
            key={tab.id}
            mouseX={mouseX}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => onSelectTab(tab.id)}
          />
        ))}
      </motion.div>

      {/* Telemetry Status Chip */}
      <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300"
        >
          <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-cyan-400' : 'bg-emerald-400 animate-pulse'}`} />
          <span>{isDemoMode ? "Interactive Demo" : "Nebius H100 Live"}</span>
        </motion.span>
        <span className="hidden md:inline text-neutral-500">Track 2: Personal AI</span>
      </div>
    </div>
  );
}
