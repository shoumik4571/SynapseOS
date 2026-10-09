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
import MacDockNav from './components/MacDockNav';
import StudioMarquee from './components/StudioMarquee';
import StudioHero from './components/StudioHero';
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
    <div className="relative min-h-screen bg-black text-neutral-100 flex flex-col font-sans overflow-x-hidden selection:bg-white selection:text-black">
      {/* Top Header with live Nebius Telemetry */}
      <Header
        metrics={metrics}
        stats={stats}
        onOpenCapture={() => setIsCaptureOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDemoMode={isDemoMode}
      />

      {/* Studio-Inspired Infinite Discipline Marquee */}
      <StudioMarquee />

      {/* Main Container */}
      <main className="flex-1 flex flex-col p-6 max-w-6xl w-full mx-auto space-y-8">
        {/* Studio-Inspired Editorial Hero & Stats Matrix */}
        <StudioHero
          metrics={metrics}
          onExploreTab={(tab) => setActiveTab(tab)}
        />

        {/* Authentic macOS Dock Navigation */}
        <MacDockNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isDemoMode={isDemoMode}
        />

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
