import React, { useState } from 'react';
import Navbar from './components/landing/Navbar';
import HeroSection from './components/landing/HeroSection';
import ProductMockup from './components/landing/ProductMockup';
import FeaturesGrid from './components/landing/FeaturesGrid';
import ProFeatureTrial from './components/landing/ProFeatureTrial';
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
      {/* Background radial gradient mesh */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none -z-10" />

      {/* Navigation */}
      <Navbar
        onOpenDownload={() => handleOpenDownload('mac')}
        onOpenLiveDemo={() => setLiveWorkspaceOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        onOpenDownload={handleOpenDownload}
        onOpenLiveDemo={() => setLiveWorkspaceOpen(true)}
      />

      {/* Product Showcase Mockup */}
      <ProductMockup />

      {/* Core Features Grid */}
      <FeaturesGrid />

      {/* Winning Pro Feature Trial */}
      <ProFeatureTrial
        onOpenLiveDemo={() => setLiveWorkspaceOpen(true)}
      />

      {/* How It Works Sequential Workflow */}
      <HowItWorks />

      {/* Interactive Persona Use Cases */}
      <UseCasesInteractive />

      {/* Native Compatibility & Specs */}
      <CompatibilitySection
        onOpenDownload={handleOpenDownload}
      />

      {/* Authentic Testimonials */}
      <TestimonialsSection />

      {/* Collapsible FAQ Accordion */}
      <FAQSection />

      {/* Contact & Feedback */}
      <ContactSection />

      {/* Final Call to Action */}
      <FinalCTA
        onOpenDownload={handleOpenDownload}
        onOpenLiveDemo={() => setLiveWorkspaceOpen(true)}
      />

      {/* Comprehensive Footer */}
      <Footer
        onOpenDownload={handleOpenDownload}
        onOpenLiveDemo={() => setLiveWorkspaceOpen(true)}
      />

      {/* Direct Download Modal (macOS DMG & Windows EXE) */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        defaultPlatform={downloadPlatform}
      />

      {/* Full In-Browser Live Workspace Modal for Judges / Instant Trial */}
      <LiveWorkspaceModal
        isOpen={liveWorkspaceOpen}
        onClose={() => setLiveWorkspaceOpen(false)}
      />
    </div>
  );
}
