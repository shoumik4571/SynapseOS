import React from 'react';
import { Brain } from 'lucide-react';

export default function SimpleFooter() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#09090B] py-12 px-4 text-center text-xs text-zinc-500">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-sm">
          <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs">
            <Brain className="w-3.5 h-3.5" />
          </div>
          <span>Synapse</span>
        </div>
        <p className="text-zinc-400 max-w-md mx-auto">
          Your personal daily AI assistant for Mac and Windows. Powered by NVIDIA Nemotron, Nebius Token Factory, and Tavily Search.
        </p>
        <div className="pt-4 border-t border-zinc-850 flex flex-wrap items-center justify-center gap-6 text-zinc-500">
          <span>© 2026 Synapse</span>
          <span>•</span>
          <span>Nebius × NVIDIA Hackathon 2026</span>
          <span>•</span>
          <span>100% Free & Open-Source</span>
        </div>
      </div>
    </footer>
  );
}
