import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BriefingView from './components/BriefingView';
import ContextDiffView from './components/ContextDiffView';
import CopilotChat from './components/CopilotChat';
import MemoryInspector from './components/MemoryInspector';
import QuickCaptureModal from './components/QuickCaptureModal';
import { Target, MessageSquare, ArrowLeftRight, Database } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('briefing');
  const [metrics, setMetrics] = useState(null);
  const [stats, setStats] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header with live Nebius Telemetry */}
      <Header
        metrics={metrics}
        stats={stats}
        onOpenCapture={() => setIsCaptureOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'briefing', label: 'Executive Briefing', icon: Target },
              { id: 'chat', label: 'Thought Partner', icon: MessageSquare },
              { id: 'diff', label: 'Context Switch Diff', icon: ArrowLeftRight },
              { id: 'memory', label: 'Memory & Watcher', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-nvidia-green' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Hackathon 2026: Personal AI Track</span>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'briefing' && (
            <BriefingView
              briefing={briefing}
              onRegenerate={regenerateBriefing}
              loading={loadingBriefing}
            />
          )}

          {activeTab === 'chat' && (
            <CopilotChat
              onUpdateMetrics={(newMetrics) => setMetrics(newMetrics)}
            />
          )}

          {activeTab === 'diff' && (
            <ContextDiffView />
          )}

          {activeTab === 'memory' && (
            <MemoryInspector stats={stats} />
          )}
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
    </div>
  );
}
