import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Download, Sparkles, Chrome, ExternalLink } from 'lucide-react';

export default function Navbar({ onOpenDownload, onOpenLiveDemo }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Desktop vs Extension', href: '#form-factors' },
    { label: 'Tavily Search', href: '#tavily' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#09090B]/90 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl shadow-black/60 py-3'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 p-[1px] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
            <div className="w-full h-full bg-[#09090B] rounded-[11px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-violet-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg tracking-tight text-white">
                Synapse<span className="text-violet-400">OS</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                100% Free
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider -mt-0.5">
              NVIDIA x NEBIUS x TAVILY
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#131318]/70 border border-zinc-800/80 rounded-full px-4 py-1.5 backdrop-blur-md shadow-inner">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-zinc-800/60 transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Test Live in Browser */}
          <button
            onClick={onOpenLiveDemo}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-zinc-900/90 text-zinc-200 border border-zinc-700/80 hover:border-violet-500/60 hover:text-white transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Test Live</span>
          </button>

          {/* Primary Get SynapseOS Button */}
          <button
            onClick={() => onOpenDownload('mac')}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-white text-black hover:bg-zinc-200 active:scale-95 transition-all shadow-lg shadow-white/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Get SynapseOS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
