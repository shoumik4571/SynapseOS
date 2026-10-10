import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Monitor, Download, ShieldCheck, Check, HardDrive, Cpu, Wifi } from 'lucide-react';

export default function CompatibilitySection({ onOpenDownload }) {
  return (
    <section id="compatibility" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono mb-4">
          NATIVE PLATFORMS & DOWNLOADS
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Runs Seamlessly on macOS & Windows
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          Built as a fast native application with system-level tray, hotkey listeners, and zero browser memory bloat.
        </p>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* macOS Card */}
        <div className="p-8 rounded-3xl bg-[#131318]/90 border border-zinc-800/80 hover:border-violet-500/40 transition-all shadow-xl shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                v1.2.0 • 142 MB
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">macOS Universal (.dmg)</h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Native Apple Silicon (M1, M2, M3, M4) and Intel 64-bit binary. Supports macOS Ventura 13.0+ and macOS Sequoia.
            </p>

            <ul className="space-y-2.5 text-xs text-zinc-300 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Global Menu Bar quick-access & Cmd+K hotkey daemon</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Apple Keychain encrypted SQLite memory storage</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Universal binary with automatic delta updates</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onOpenDownload('mac')}
            className="w-full py-3.5 px-6 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10"
          >
            <Download className="w-4 h-4" />
            <span>Download for macOS</span>
          </button>
        </div>

        {/* Windows Card */}
        <div className="p-8 rounded-3xl bg-[#131318]/90 border border-zinc-800/80 hover:border-cyan-500/40 transition-all shadow-xl shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                v1.2.0 • 158 MB
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Windows 64-bit (.exe)</h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Standard Windows Installer for Windows 10 (21H2+) and Windows 11. Includes system tray daemon and hotkey hooks.
            </p>

            <ul className="space-y-2.5 text-xs text-zinc-300 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Windows Taskbar Tray integration & Ctrl+K overlay</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Windows DPAPI protected local vector database</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Silent MSI enterprise installer package available</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onOpenDownload('win')}
            className="w-full py-3.5 px-6 rounded-xl bg-[#1d1d26] text-white hover:bg-zinc-800 active:scale-95 font-semibold text-sm transition-all border border-zinc-700/80 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download for Windows</span>
          </button>
        </div>
      </div>

      {/* System Requirements Table */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0c10] border border-zinc-800/80">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Minimum & Recommended Specifications
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center gap-2 text-zinc-400 mb-1 font-mono">
              <Cpu className="w-3.5 h-3.5 text-violet-400" /> PROCESSOR
            </div>
            <div className="font-semibold text-white">Apple M1+ or Intel Core i5+</div>
            <div className="text-zinc-500 mt-1">x86_64 or ARM64 compatible</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center gap-2 text-zinc-400 mb-1 font-mono">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> MEMORY & DISK
            </div>
            <div className="font-semibold text-white">8 GB RAM • 500 MB Free Disk</div>
            <div className="text-zinc-500 mt-1">Lightweight local footprint</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center gap-2 text-zinc-400 mb-1 font-mono">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" /> CONNECTIVITY
            </div>
            <div className="font-semibold text-white">Broadband Internet</div>
            <div className="text-zinc-500 mt-1">For Nebius Token Factory API</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center gap-2 text-zinc-400 mb-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> GPU REQUIREMENTS
            </div>
            <div className="font-semibold text-white">None (Runs on Nebius H100)</div>
            <div className="text-zinc-500 mt-1">Zero local fan noise or heat</div>
          </div>
        </div>
      </div>
    </section>
  );
}
