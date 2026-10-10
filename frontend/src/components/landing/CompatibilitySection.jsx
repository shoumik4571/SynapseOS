import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Monitor, Download, Check, ShieldCheck } from 'lucide-react';

export default function CompatibilitySection({ onOpenDownload }) {
  return (
    <section id="compatibility" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Available on Mac and Windows
        </h2>
        <p className="mt-3 text-base text-zinc-400">
          Fast, lightweight, and native. Lives comfortably in your menu bar or system tray.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* macOS Card */}
        <div className="p-8 rounded-2xl bg-[#131318] border border-zinc-800 hover:border-violet-500/40 transition-all flex flex-col justify-between shadow-xl shadow-black/40">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
                macOS 13.0+
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">SynapseOS for Mac</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
              Native for Apple Silicon (M1, M2, M3, M4) and Intel Macs. Easily summoned with Cmd+K.
            </p>

            <ul className="space-y-2 text-xs text-zinc-300 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Lives in your top Menu Bar</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Encrypted private memory on your Mac</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Fast installation: drag to Applications</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onOpenDownload('mac')}
            className="w-full py-3 px-5 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download for macOS (.dmg)</span>
          </button>
        </div>

        {/* Windows Card */}
        <div className="p-8 rounded-2xl bg-[#131318] border border-zinc-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xl shadow-black/40">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
                Windows 10 / 11
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">SynapseOS for Windows</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
              Full desktop installer with taskbar tray icon and global Ctrl+K quick-search shortcut.
            </p>

            <ul className="space-y-2 text-xs text-zinc-300 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Runs smoothly in your Windows Taskbar Tray</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Protected on-device memory store</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Lightweight footprint (under 500 MB)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onOpenDownload('win')}
            className="w-full py-3 px-5 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 active:scale-95 font-semibold text-sm transition-all border border-zinc-700 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download for Windows (.exe)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
