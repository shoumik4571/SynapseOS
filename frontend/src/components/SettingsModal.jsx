import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Key, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, Cpu } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, apiKey, onSaveKey, isDemoMode, onToggleDemo }) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!inputKey.trim()) return;
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/settings/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: inputKey.trim() })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ valid: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveKey(inputKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        className="w-full max-w-lg rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white tracking-tight">Settings & Model Providers</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector with Magnifications */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">Execution Mode</label>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleDemo(false)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                !isDemoMode
                  ? 'bg-neutral-900 border-white text-white shadow-md'
                  : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="text-xs font-bold flex items-center gap-1.5 text-white">
                <Cpu className="w-3.5 h-3.5" />
                <span>Nebius Live (BYOK)</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">Real H100 inference via Token Factory</p>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleDemo(true)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isDemoMode
                  ? 'bg-neutral-900 border-white text-white shadow-md'
                  : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="text-xs font-bold flex items-center gap-1.5 text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Interactive Demo</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">Free testing with zero API key required</p>
            </motion.button>
          </div>
        </div>

        {/* Bring Your Own Key (BYOK) Section */}
        {!isDemoMode && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300">Nebius Token Factory API Key</label>
              <a
                href="https://tokenfactory.nebius.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>Get Key from Nebius</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex gap-2">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="v1.CmMKHH..."
                className="flex-1 bg-black border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 font-mono shadow-inner"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTestKey}
                disabled={testing || !inputKey.trim()}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold border border-neutral-700 disabled:opacity-40 transition-colors"
              >
                {testing ? "Testing..." : "Verify"}
              </motion.button>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                testResult.valid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {testResult.valid ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                )}
                <div>
                  <div className="font-semibold">
                    {testResult.valid ? "Key Verified & Active!" : "Verification Failed"}
                  </div>
                  <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                    {testResult.valid
                      ? `Connected to Nebius Token Factory. Active models: ${testResult.nemotron_models?.join(', ') || 'Nemotron'}`
                      : testResult.error}
                  </div>
                </div>
              </div>
            )}

            <p className="text-[11px] text-neutral-500 leading-relaxed">
              🔒 <strong>Privacy Guarantee:</strong> Your key is stored strictly on your local device. It is never transmitted to any third-party server.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          {/* Crisp White Save Button */}
          <motion.button
            type="button"
            onClick={handleSave}
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 active:scale-95"
          >
            Save Preferences
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
