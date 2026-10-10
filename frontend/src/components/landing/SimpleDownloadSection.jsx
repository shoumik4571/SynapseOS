import React from 'react';
import { Apple, Monitor, Chrome, Download, Check } from 'lucide-react';

export default function SimpleDownloadSection({ onOpenDownload }) {
  return (
    <section id="download" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
          Download Synapse Free
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Choose the native desktop app or add the browser extension.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Mac */}
        <div className="p-6 rounded-2xl bg-[#131318] border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">macOS App</h3>
            <p className="text-xs text-zinc-400 mb-4">Apple Silicon (M1-M4) & Intel</p>
            <ul className="space-y-1.5 text-xs text-zinc-300 mb-6">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Lives in Menu Bar</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Cmd + K shortcut</li>
            </ul>
          </div>
          <button
            onClick={() => onOpenDownload('mac')}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .dmg</span>
          </button>
        </div>

        {/* Windows */}
        <div className="p-6 rounded-2xl bg-[#131318] border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
              <Monitor className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Windows App</h3>
            <p className="text-xs text-zinc-400 mb-4">Windows 10 & 11 (64-bit)</p>
            <ul className="space-y-1.5 text-xs text-zinc-300 mb-6">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Lives in System Tray</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Ctrl + K shortcut</li>
            </ul>
          </div>
          <button
            onClick={() => onOpenDownload('win')}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 text-white font-semibold text-xs hover:bg-zinc-700 transition-colors border border-zinc-700 flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download .exe</span>
          </button>
        </div>

        {/* Extension */}
        <div className="p-6 rounded-2xl bg-[#131318] border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
              <Chrome className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Browser Extension</h3>
            <p className="text-xs text-zinc-400 mb-4">Chrome, Arc, Brave, Edge</p>
            <ul className="space-y-1.5 text-xs text-zinc-300 mb-6">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> In-tab live research</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Instant article summary</li>
            </ul>
          </div>
          <button
            onClick={() => onOpenDownload('ext')}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 text-white font-semibold text-xs hover:bg-zinc-700 transition-colors border border-zinc-700 flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Get Extension</span>
          </button>
        </div>
      </div>
    </section>
  );
}
