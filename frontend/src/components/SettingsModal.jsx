import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-obsidian-900/95 border border-purple-500/30 shadow-2xl shadow-purple-950/80 p-7 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-synapse-purple" />
            <h3 className="text-sm font-bold text-white tracking-tight">Settings & Model Providers</h3>
          </div>
          <button onClick={onClose} className="text-purple-400/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-purple-950/40">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-purple-200">Execution Mode</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onToggleDemo(false)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                !isDemoMode
                  ? 'bg-purple-900/40 border-purple-400/50 text-white shadow-lg shadow-purple-950/60'
                  : 'bg-obsidian-950/80 border-purple-500/20 text-purple-400/60 hover:border-purple-400/40'
              }`}
            >
              <div className="text-xs font-bold flex items-center gap-1.5 text-synapse-purple">
                <Cpu className="w-3.5 h-3.5" />
                <span>Nebius Live (BYOK)</span>
              </div>
              <p className="text-[11px] text-purple-300/70 mt-1">Real H100 inference via Token Factory</p>
            </button>

            <button
              type="button"
              onClick={() => onToggleDemo(true)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isDemoMode
                  ? 'bg-purple-900/40 border-purple-400/50 text-white shadow-lg shadow-purple-950/60'
                  : 'bg-obsidian-950/80 border-purple-500/20 text-purple-400/60 hover:border-purple-400/40'
              }`}
            >
              <div className="text-xs font-bold flex items-center gap-1.5 text-nebius-cyan">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Interactive Demo</span>
              </div>
              <p className="text-[11px] text-purple-300/70 mt-1">Free testing with zero API key required</p>
            </button>
          </div>
        </div>

        {/* Bring Your Own Key (BYOK) Section */}
        {!isDemoMode && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-purple-200">Nebius Token Factory API Key</label>
              <a
                href="https://tokenfactory.nebius.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-nebius-cyan hover:underline flex items-center gap-1 font-mono"
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
                className="flex-1 bg-obsidian-950/90 border border-purple-500/30 rounded-2xl px-4 py-2.5 text-xs text-purple-100 placeholder-purple-400/40 focus:outline-none focus:border-purple-400 font-mono shadow-inner"
              />
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testing || !inputKey.trim()}
                className="px-4 py-2.5 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 text-xs font-bold border border-purple-500/30 disabled:opacity-40 transition-colors"
              >
                {testing ? "Testing..." : "Verify"}
              </button>
            </div>

            {testResult && (
              <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                testResult.valid
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}>
                {testResult.valid ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                )}
                <div>
                  <div className="font-bold">
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

            <p className="text-[11px] text-purple-300/60 leading-relaxed">
              🔒 <strong>Privacy Guarantee:</strong> Your key is stored strictly on your local device. It is never transmitted to any third-party server or repository.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2.5 pt-2 border-t border-purple-500/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs text-purple-400/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30 border border-purple-400/40 active:scale-95"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
