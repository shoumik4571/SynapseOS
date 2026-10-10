import React from 'react';
import { Brain, Download } from 'lucide-react';

export default function Navbar({ onOpenDownload }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090B]/90 backdrop-blur-md border-b border-zinc-800/80 py-3.5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold shadow-md">
            <Brain className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            Synapse
          </span>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">• Personal AI</span>
        </a>

        {/* Simple Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Try It Live</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#download" className="hover:text-white transition-colors">Download</a>
        </nav>

        {/* Download Button */}
        <button
          onClick={() => onOpenDownload('mac')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Get Free App</span>
        </button>
      </div>
    </header>
  );
}
