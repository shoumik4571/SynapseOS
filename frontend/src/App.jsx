import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Sun, 
  MessageSquare, 
  Compass, 
  Gauge, 
  Award, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Apple, 
  Monitor, 
  Chrome, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

import Header from './components/Header';
import MacDockNav from './components/MacDockNav';
import BriefingView from './components/BriefingView';
import CopilotChat from './components/CopilotChat';
import GoalPlannerView from './components/GoalPlannerView';
import BenchmarkView from './components/BenchmarkView';
import GuideView from './components/GuideView';

import QuickCaptureModal from './components/QuickCaptureModal';
import SettingsModal from './components/SettingsModal';
import FormFactorsSection from './components/landing/FormFactorsSection';
import HowToUseVisualGuide from './components/landing/HowToUseVisualGuide';
import SimpleDownloadSection from './components/landing/SimpleDownloadSection';
import SimpleFAQ from './components/landing/SimpleFAQ';
import SimpleFooter from './components/landing/SimpleFooter';
import DownloadModal from './components/landing/DownloadModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('briefing');
  const [metrics, setMetrics] = useState(null);
  const [stats, setStats] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadPlatform, setDownloadPlatform] = useState('mac');
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('nebius_api_key') || '');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const res = await fetch('/api/briefing/latest');
      if (res.ok) {
        const data = await res.json();
        setBriefing(data);
        if (data.metrics?.tokens_per_second) {
          setMetrics(data.metrics);
        }
      }
    } catch (err) {
      console.error('Failed to fetch briefing:', err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  const regenerateBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const res = await fetch('/api/briefing/generate', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setBriefing(data);
        if (data.metrics?.tokens_per_second) {
          setMetrics(data.metrics);
        }
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to regenerate briefing:', err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBriefing();

    // Global keyboard listener for Cmd+K / Ctrl+K
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCaptureOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenDownload = (platform = 'mac') => {
    setDownloadPlatform(platform);
    setDownloadModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#09090B] text-neutral-100 font-sans selection:bg-violet-500 selection:text-white overflow-x-hidden">
      {/* Background Soft Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.12),rgba(0,0,0,0))] pointer-events-none -z-10" />

      {/* 1. Top Navigation Bar */}
      <Header
        metrics={metrics}
        stats={stats}
        onOpenCapture={() => setIsCaptureOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDownload={() => handleOpenDownload('mac')}
        onSelectTab={setActiveTab}
        isDemoMode={isDemoMode}
      />

      {/* 2. Workspace Welcome & Headline */}
      <section className="pt-8 pb-4 px-4 max-w-5xl mx-auto text-center">
        {/* Track Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-violet-300 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Nebius × NVIDIA Hackathon • Track 2: Personal AI</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
          Your Private Personal AI Companion
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Organize your day, search the live web, and achieve your goals with sub-second{' '}
          <strong className="text-zinc-200 font-semibold">NVIDIA Nemotron-3.5</strong> reasoning streaming at{' '}
          <strong className="text-violet-300 font-semibold">162+ tok/s</strong> on Nebius H100 clusters.
        </p>

        {/* Quick Guide Indicator */}
        <div className="mt-5 flex items-center justify-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Interactive Web Workspace (Try any tab below live)</span>
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <button
            onClick={() => setActiveTab('guide')}
            className="hidden sm:inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 font-medium underline underline-offset-4 transition-colors"
          >
            <span>Take the 2-Minute Tour</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* 3. The Core Interactive Personal AI Workspace */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 pt-2 pb-16 space-y-6">
        {/* Simple Dock Navigation */}
        <MacDockNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isDemoMode={isDemoMode}
        />

        {/* Dynamic Tab Content with Smooth Transitions */}
        <div className="min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.995 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="w-full"
            >
              {activeTab === 'briefing' && (
                <BriefingView
                  briefing={briefing}
                  onRegenerate={regenerateBriefing}
                  loading={loadingBriefing}
                  onUpdateMetrics={(m) => setMetrics(m)}
                />
              )}

              {activeTab === 'chat' && (
                <CopilotChat
                  onUpdateMetrics={(newMetrics) => setMetrics(newMetrics)}
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

              {activeTab === 'benchmark' && (
                <BenchmarkView
                  onUpdateMetrics={(m) => setMetrics(m)}
                />
              )}

              {activeTab === 'guide' && (
                <GuideView
                  onSelectTab={setActiveTab}
                  onOpenCapture={() => setIsCaptureOpen(true)}
                  onOpenDownload={() => handleOpenDownload('mac')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 4. Visual How-To-Use Guide & 3-Minute Demo Video */}
      <HowToUseVisualGuide />

      {/* 5. Form Factors Section (Explains Web Workspace vs Desktop & Extension) */}
      <FormFactorsSection
        onOpenDownload={handleOpenDownload}
        onOpenExtension={() => handleOpenDownload('ext')}
      />

      {/* 5. Simple Download Cards (Mac, Windows, Chrome) */}
      <SimpleDownloadSection onOpenDownload={handleOpenDownload} />

      {/* 6. Simple & Honest FAQ for Evaluators */}
      <SimpleFAQ />

      {/* 7. Simple Footer */}
      <SimpleFooter />

      {/* Modals */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        defaultPlatform={downloadPlatform}
      />

      <QuickCaptureModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onCaptured={() => {
          fetchStats();
        }}
      />

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
    </div>
  );
}
