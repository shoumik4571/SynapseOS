import React, { useState } from 'react';
import Navbar from './components/landing/Navbar';
import HeroSection from './components/landing/HeroSection';
import FeaturesGrid from './components/landing/FeaturesGrid';
import LiveDemoSection from './components/landing/LiveDemoSection';
import HowItWorks from './components/landing/HowItWorks';
import SimpleDownloadSection from './components/landing/SimpleDownloadSection';
import SimpleFAQ from './components/landing/SimpleFAQ';
import SimpleFooter from './components/landing/SimpleFooter';
import DownloadModal from './components/landing/DownloadModal';

export default function App() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadPlatform, setDownloadPlatform] = useState('mac');

  const handleOpenDownload = (platform = 'mac') => {
    setDownloadPlatform(platform);
    setDownloadModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#09090B] text-neutral-100 font-sans selection:bg-violet-500 selection:text-white overflow-x-hidden">
      {/* Background soft glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.1),rgba(0,0,0,0))] pointer-events-none -z-10" />

      {/* 1. Simple Navbar */}
      <Navbar onOpenDownload={handleOpenDownload} />

      {/* 2. Simple Hero Section */}
      <HeroSection onOpenDownload={handleOpenDownload} />

      {/* 3. Four Core Features */}
      <FeaturesGrid />

      {/* 4. Live Interactive Demo Widget (Try it right here on the page!) */}
      <LiveDemoSection />

      {/* 5. How It Works (3 Simple Steps) */}
      <HowItWorks />

      {/* 6. Simple Download Section (Mac, Windows, Chrome) */}
      <SimpleDownloadSection onOpenDownload={handleOpenDownload} />

      {/* 7. Questions & Answers */}
      <SimpleFAQ />

      {/* 8. Footer */}
      <SimpleFooter />

      {/* Direct Download Modal (.dmg, .exe, .zip) */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        defaultPlatform={downloadPlatform}
      />
    </div>
  );
}
