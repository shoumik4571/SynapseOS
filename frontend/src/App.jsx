import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BriefingView from './components/BriefingView';
import ContextDiffView from './components/ContextDiffView';
import CopilotChat from './components/CopilotChat';
import MemoryInspector from './components/MemoryInspector';
import QuickCaptureModal from './components/QuickCaptureModal';
import GoalPlannerView from './components/GoalPlannerView';
import SettingsModal from './components/SettingsModal';
import AmbientDrawer from './components/AmbientDrawer';
import NeuralBackground from './components/NeuralBackground';
import BenchmarkView from './components/BenchmarkView';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, MessageSquare, ArrowLeftRight, Database, Compass, Gauge } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('briefing');
  const [metrics, setMetrics] = useState(null);
  const [stats, setStats] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('nebius_api_key') || '');

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCaptureOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const res = await fetch('/api/briefing/latest');
      const data = await res.json();
      setBriefing(data);
      if (data.metrics?.tokens_per_second) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  const regenerateBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const res = await fetch('/api/briefing/generate', { method: 'POST' });
      const data = await res.json();
      setBriefing(data);
      if (data.metrics?.tokens_per_second) {
        setMetrics(data.metrics);
      }
      fetchStats();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBriefing();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* 60fps Ambient Neural Mesh Canvas */}
      <NeuralBackground />

      {/* Top Header with live Nebius Telemetry */}
      <div className="relative z-10">
        <Header
          metrics={metrics}
          stats={stats}
          onOpenCapture={() => setIsCaptureOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isDemoMode={isDemoMode}
        />
      </div>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Navigation Tabs - Sticky */}
        <div className="sticky top-[60px] bg-slate-950/80 backdrop-blur-md z-30 pt-1 pb-3 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            {[
              { id: 'briefing', label: 'Executive Briefing', icon: Target },
              { id: 'goals', label: 'Goal Engine', icon: Compass },
              { id: 'chat', label: 'Thought Partner', icon: MessageSquare },
              { id: 'benchmark', label: 'H100 Speed Benchmark', icon: Gauge },
              { id: 'diff', label: 'Context Switch Diff', icon: ArrowLeftRight },
              { id: 'memory', label: 'Memory & Watcher', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-800/90 text-white shadow-lg shadow-nvidia-green/5 border border-nvidia-green/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-nvidia-green animate-pulse' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-nebius-cyan animate-pulse' : 'bg-nvidia-green animate-pulse'}`} />
              <span>{isDemoMode ? "Interactive Demo" : "Nebius Live"}</span>
            </span>
            <span className="hidden md:inline">Track 2: Personal AI</span>
          </div>
        </div>

        {/* Tab Content with Fluid Motion Transitions */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.995 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="w-full"
            >
              {activeTab === 'briefing' && (
                <BriefingView
                  briefing={briefing}
                  onRegenerate={regenerateBriefing}
                  loading={loadingBriefing}
                />
              )}

              {activeTab === 'goals' && (
                <GoalPlannerView
                  onGoalCreated={() => {
                    fetchBriefing();
                    fetchStats();
                  }}
                  onUpdateMetrics={(m) => setMetrics(m)}
                />
              )}

              {activeTab === 'chat' && (
                <CopilotChat
                  onUpdateMetrics={(newMetrics) => setMetrics(newMetrics)}
                />
              )}

              {activeTab === 'benchmark' && (
                <BenchmarkView
                  onUpdateMetrics={(newMetrics) => setMetrics(newMetrics)}
                />
              )}

              {activeTab === 'diff' && (
                <ContextDiffView />
              )}

              {activeTab === 'memory' && (
                <MemoryInspector stats={stats} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Quick Capture Modal (Cmd+K) */}
      <QuickCaptureModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onCaptured={() => {
          fetchStats();
        }}
      />

      {/* Settings & BYOK Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveKey={(newKey) => {
          setApiKey(newKey);
          localStorage.setItem('nebius_api_key', newKey);
        }}
        isDemoMode={isDemoMode}
        onToggleDemo={(val) => setIsDemoMode(val)}
      />

      {/* Ambient Slide-In Edge HUD (Hover or Cmd+Shift+S) */}
      <AmbientDrawer
        briefing={briefing}
        metrics={metrics}
        onCapture={fetchStats}
      />
    </div>
  );
}
