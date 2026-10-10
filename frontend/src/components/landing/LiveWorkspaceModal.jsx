import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Sparkles, Monitor, Cpu } from 'lucide-react';
import Header from '../Header';
import BriefingView from '../BriefingView';
import ContextDiffView from '../ContextDiffView';
import CopilotChat from '../CopilotChat';
import MemoryInspector from '../MemoryInspector';
import QuickCaptureModal from '../QuickCaptureModal';
import GoalPlannerView from '../GoalPlannerView';
import SettingsModal from '../SettingsModal';
import AmbientDrawer from '../AmbientDrawer';
import MacDockNav from '../MacDockNav';
import BenchmarkView from '../BenchmarkView';

export default function LiveWorkspaceModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('briefing');
  const [metrics, setMetrics] = useState(null);
  const [stats, setStats] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('nebius_api_key') || '');

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
    if (isOpen) {
      fetchStats();
      fetchBriefing();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black text-neutral-100 flex flex-col font-sans overflow-y-auto selection:bg-white selection:text-black">
      {/* Top Banner Alert indicating this is the live Cloud Sandbox */}
      <div className="bg-gradient-to-r from-violet-950 via-purple-900 to-zinc-900 px-4 py-2 border-b border-violet-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-zinc-300">
            <strong className="text-white">LIVE CLOUD EVALUATION WORKSPACE:</strong> Connected to Nebius Token Factory H100
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-black hover:bg-zinc-200 font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Landing Page</span>
        </button>
      </div>

      {/* Top Header with live Nebius Telemetry */}
      <Header
        metrics={metrics}
        stats={stats}
        onOpenCapture={() => setIsCaptureOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDemoMode={isDemoMode}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col p-6 max-w-6xl w-full mx-auto space-y-8">
        {/* Authentic macOS Dock Navigation */}
        <MacDockNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isDemoMode={isDemoMode}
        />

        {/* Tab Content with Fluid Motion Transitions */}
        <div className="flex-1 pb-16">
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

      {/* Ambient Slide-In Edge HUD */}
      <AmbientDrawer
        briefing={briefing}
        metrics={metrics}
        onCapture={fetchStats}
      />
    </div>
  );
}
