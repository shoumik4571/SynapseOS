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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-nebius-cyan" />
            <h3 className="text-sm font-bold text-white">Settings & Model Providers</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Execution Mode</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onToggleDemo(false)}
              className={`p-3 rounded-xl border text-left transition-all ${
                !isDemoMode
                  ? 'bg-nvidia-green/10 border-nvidia-green/40 text-slate-100'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold flex items-center gap-1.5 text-nvidia-green">
                <Cpu className="w-3.5 h-3.5" />
                <span>Nebius Live (BYOK)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Real H100 inference via Token Factory</p>
            </button>

            <button
              type="button"
              onClick={() => onToggleDemo(true)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isDemoMode
                  ? 'bg-nebius-cyan/10 border-nebius-cyan/40 text-slate-100'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold flex items-center gap-1.5 text-nebius-cyan">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Interactive Demo</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Free testing with zero API key required</p>
            </button>
          </div>
        </div>

        {/* Bring Your Own Key (BYOK) Section */}
        {!isDemoMode && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Nebius Token Factory API Key</label>
              <a
                href="https://tokenfactory.nebius.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-nebius-cyan hover:underline flex items-center gap-1"
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
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-nebius-cyan font-mono"
              />
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testing || !inputKey.trim()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 disabled:opacity-40 transition-colors"
              >
                {testing ? "Testing..." : "Verify"}
              </button>
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
                  <div className="text-[11px] opacity-80 mt-0.5">
                    {testResult.valid
                      ? `Connected to Nebius Token Factory. Active models: ${testResult.nemotron_models?.join(', ') || 'Nemotron'}`
                      : testResult.error}
                  </div>
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-500 leading-relaxed">
              🔒 <strong>Privacy Guarantee:</strong> Your key is stored strictly on your local device. It is never transmitted to any third-party server or repository.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-nvidia-green hover:bg-nvidia-dark text-slate-950 font-semibold text-xs transition-all"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
