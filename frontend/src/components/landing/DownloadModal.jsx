import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Apple, Monitor, Download, CheckCircle2, ShieldCheck, Terminal, Copy, Check } from 'lucide-react';

export default function DownloadModal({ isOpen, onClose, defaultPlatform = 'mac' }) {
  const [platform, setPlatform] = useState(defaultPlatform);
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const handleStartDownload = () => {
    setDownloading(true);
    setDownloadComplete(false);

    // Simulate instant download package generation
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);

      // Create a temporary mock file download trigger
      const dummyContent = `SynapseOS Native Desktop Client v1.2.0\nPlatform: ${platform.toUpperCase()}\nInference Engine: Nebius Token Factory H100 SXM5\nModel: nvidia/Nemotron-3_5-Lightning\nSafety: NeMo Guardrails Client-Side PII Shield\nThank you for testing SynapseOS!`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = platform === 'mac' ? 'SynapseOS-v1.2.0-arm64.dmg' : 'SynapseOS-v1.2.0-x64-Setup.exe';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1200);
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const sha256 =
    platform === 'mac'
      ? 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      : '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#131318] p-6 shadow-2xl shadow-black/80 text-white relative overflow-hidden"
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
            <h3 className="text-xl font-bold font-display">Download SynapseOS Desktop</h3>
            <p className="text-xs text-zinc-400 font-mono">v1.2.0 • Release Build for macOS & Windows</p>
          </div>
        </div>

        {/* Platform Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800 mb-6">
          <button
            onClick={() => {
              setPlatform('mac');
              setDownloadComplete(false);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
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
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              platform === 'win'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Windows (.exe)</span>
          </button>
        </div>

        {/* Package Specs */}
        <div className="p-4 rounded-xl bg-black/50 border border-zinc-800/80 mb-6 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-mono">TARGET ARCHITECTURE</span>
            <span className="text-zinc-200 font-medium">
              {platform === 'mac' ? 'Apple Silicon (M1/M2/M3/M4) & Intel' : 'Windows 64-bit (x64 / ARM64)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-mono">BUNDLE SIZE</span>
            <span className="text-zinc-200 font-medium">{platform === 'mac' ? '142.6 MB' : '158.2 MB'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-mono">SECURITY SIGNATURE</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> Code-Signed & Notarized
            </span>
          </div>

          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-500">SHA-256 HASH</span>
            <button
              onClick={() => copyHash(sha256)}
              className="flex items-center gap-1 text-violet-400 hover:text-violet-300"
            >
              <span>{sha256.slice(0, 14)}...</span>
              {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        {downloadComplete ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" /> Download Dispatched!
            </div>
            <p className="text-xs text-zinc-300">
              {platform === 'mac'
                ? 'Open SynapseOS.dmg and drag the application icon to your /Applications folder.'
                : 'Run SynapseOS-Setup.exe to start the system tray daemon.'}
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
                <span>Download {platform === 'mac' ? 'macOS DMG' : 'Windows Installer'}</span>
              </>
            )}
          </button>
        )}

        <div className="mt-4 text-center text-[11px] font-mono text-zinc-500">
          Or test directly without downloading via{' '}
          <span className="text-violet-400 underline cursor-pointer" onClick={onClose}>
            In-Browser Live Workspace
          </span>
        </div>
      </motion.div>
    </div>
  );
}
