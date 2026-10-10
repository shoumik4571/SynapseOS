import React, { useState } from 'react';
import Navbar from './components/landing/Navbar';
import HeroSection from './components/landing/HeroSection';
import ProductMockup from './components/landing/ProductMockup';
import FeaturesGrid from './components/landing/FeaturesGrid';
import FormFactorsSection from './components/landing/FormFactorsSection';
import TavilyShowcaseSection from './components/landing/TavilyShowcaseSection';
import HowItWorks from './components/landing/HowItWorks';
import UseCasesInteractive from './components/landing/UseCasesInteractive';
import CompatibilitySection from './components/landing/CompatibilitySection';
import TestimonialsSection from './components/landing/TestimonialsSection';
import FAQSection from './components/landing/FAQSection';
import ContactSection from './components/landing/ContactSection';
import FinalCTA from './components/landing/FinalCTA';
import Footer from './components/landing/Footer';
import DownloadModal from './components/landing/DownloadModal';
import LiveWorkspaceModal from './components/landing/LiveWorkspaceModal';

export default function App() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadPlatform, setDownloadPlatform] = useState('mac');
  const [liveWorkspaceOpen, setLiveWorkspaceOpen] = useState(false);

  const handleOpenDownload = (platform = 'mac') => {
    setDownloadPlatform(platform);
    setDownloadModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#09090B] text-neutral-100 font-sans selection:bg-violet-500 selection:text-white overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.12),rgba(0,0,0,0))] pointer-events-none -z-10" />

      {/* 1. Navigation Bar */}
      <Navbar
        onOpenDownload={handleOpenDownload}
        onOpenLiveDemo={() => setLiveWorkspaceOpen(true)}
      />

      {/* 2. Hero Section: SynapseOS Desktop & Browser Introduction */}
      <HeroSection
        onOpenDownload={handleOpenDownload}
        onOpenLiveDemo={() => setLiveWorkspaceOpen(true)}
      />

      {/* 3. Interactive Desktop Application Preview */}
      <ProductMockup />

      {/* 4. Section 1: Features Showcase (Section by Section) */}
      <FeaturesGrid />

      {/* 5. Section 2: Two Form Factors (Desktop App vs Browser Extension) */}
      <FormFactorsSection
        onOpenDownload={handleOpenDownload}
        onOpenExtension={() => handleOpenDownload('ext')}
      />

      {/* 6. Section 3: Deep Tavily Live Fact-Checking Showcase */}
      <TavilyShowcaseSection />

      {/* 7. Section 4: How It Works Stepwise Guide */}
      <HowItWorks />

      {/* 8. Section 5: Practical Everyday Use Cases */}
      <UseCasesInteractive />

      {/* 9. Section 6: Native Downloads & Browser Compatibility */}
      <CompatibilitySection
        onOpenDownload={handleOpenDownload}
      />

      {/* 10. Social Proof & Testimonials */}
      <TestimonialsSection />

      {/* 11. Frequently Asked Questions */}
      <FAQSection />

      {/* 12. Contact & Feedback */}
      <ContactSection />

      {/* 13. Final Closing Call to Action */}
      <FinalCTA
        onOpenDownload={handleOpenDownload}
        onOpenLiveDemo={() => setLiveWorkspaceOpen(true)}
      />

      {/* 14. Comprehensive Footer */}
      <Footer
        onOpenDownload={handleOpenDownload}
        onOpenLiveDemo={() => setLiveWorkspaceOpen(true)}
      />

      {/* Multi-Platform Download Modal (.dmg, .exe, extension) */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        defaultPlatform={downloadPlatform}
      />

      {/* In-Browser Live Interactive Workspace Modal (Instant Test Drive for Judges) */}
      <LiveWorkspaceModal
        isOpen={liveWorkspaceOpen}
        onClose={() => setLiveWorkspaceOpen(false)}
      />
    </div>
  );
}
