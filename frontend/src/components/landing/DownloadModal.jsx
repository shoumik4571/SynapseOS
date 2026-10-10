import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Apple, Monitor, Chrome, Download, CheckCircle2, ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';

export default function DownloadModal({ isOpen, onClose, defaultPlatform = 'mac' }) {
  const [platform, setPlatform] = useState(defaultPlatform);
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const handleStartDownload = () => {
    setDownloading(true);
    setDownloadComplete(false);

    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);

      const dummyContent = `SynapseOS v1.2.0\nType: ${platform === 'ext' ? 'Browser Extension' : 'Desktop Application'}\nPlatform: ${platform.toUpperCase()}\nInference: Nebius Token Factory H100 (nvidia/Nemotron-3_5-Lightning)\nGrounding: Tavily Search API\nPrivacy: NeMo Guardrails\n100% Free & Open-Source. Thank you for testing!`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      if (platform === 'mac') a.download = 'SynapseOS-v1.2.0-arm64.dmg';
      else if (platform === 'win') a.download = 'SynapseOS-v1.2.0-x64-Setup.exe';
      else a.download = 'SynapseOS-Extension-v1.2.0.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#131318] p-6 shadow-2xl text-white relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center">
            <Download className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display">Get SynapseOS</h3>
            <p className="text-xs text-zinc-400 font-mono">100% Free & Open-Source • v1.2.0</p>
          </div>
        </div>

        {/* Form Factor Toggle: Mac / Windows / Extension */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800 mb-6">
          <button
            onClick={() => {
              setPlatform('mac');
              setDownloadComplete(false);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              platform === 'mac'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>macOS (.dmg)</span>
          </button>

          <button
            onClick={() => {
              setPlatform('win');
              setDownloadComplete(false);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              platform === 'win'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Windows (.exe)</span>
          </button>

          <button
            onClick={() => {
              setPlatform('ext');
              setDownloadComplete(false);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              platform === 'ext'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Chrome className="w-4 h-4 text-emerald-400" />
            <span>Extension</span>
          </button>
        </div>

        {/* Specs Box */}
        <div className="p-4 rounded-xl bg-black/60 border border-zinc-800/80 mb-6 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-mono">COMPATIBILITY</span>
            <span className="text-zinc-200 font-medium">
              {platform === 'mac' && 'Apple Silicon (M1-M4) & Intel 64-bit'}
              {platform === 'win' && 'Windows 10 / 11 64-bit'}
              {platform === 'ext' && 'Chrome, Arc, Brave, Edge (Manifest V3)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-mono">PACKAGE TYPE</span>
            <span className="text-zinc-200 font-medium">
              {platform === 'mac' && 'Universal macOS DMG (142 MB)'}
              {platform === 'win' && 'Windows Desktop Installer (158 MB)'}
              {platform === 'ext' && 'Browser Extension Package (2.4 MB)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-mono">CAPABILITY</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              {platform === 'ext' ? 'In-Tab Research & Web Fact-Checking' : 'Cross-App Background Monitoring'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {downloadComplete ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" /> Download Started!
            </div>
            <p className="text-xs text-zinc-300">
              {platform === 'ext'
                ? 'Unzip the package and load unpacked in chrome://extensions.'
                : 'Open the installer to start SynapseOS in your background menu.'}
            </p>
          </div>
        ) : (
          <button
            onClick={handleStartDownload}
            disabled={downloading}
            className="w-full py-3.5 px-6 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Preparing Package...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>
                  {platform === 'mac' && 'Download macOS DMG'}
                  {platform === 'win' && 'Download Windows EXE'}
                  {platform === 'ext' && 'Download Extension Package'}
                </span>
              </>
            )}
          </button>
        )}
      </motion.div>
    </div>
  );
}
