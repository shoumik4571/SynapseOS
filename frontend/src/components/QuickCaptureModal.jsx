import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck } from 'lucide-react';

export default function QuickCaptureModal({ isOpen, onClose, onCaptured }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [itemType, setItemType] = useState('thought');
  const [loading, setLoading] = useState(false);
  const [redactionNotice, setRedactionNotice] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setRedactionNotice(null);

    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'Fleeting Thought',
          content: content.trim(),
          item_type: itemType,
        }),
      });

      const data = await res.json();
      if (data.redactions > 0) {
        setRedactionNotice(`Protected: ${data.redactions} sensitive credential(s) sanitized.`);
      }

      onCaptured?.();
      setTimeout(() => {
        setTitle('');
        setContent('');
        setRedactionNotice(null);
        onClose();
      }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-obsidian-900/95 border border-purple-500/30 shadow-2xl shadow-purple-950/80 p-7 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-synapse-purple animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-tight">Quick Capture (Cmd+K)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-purple-400/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-purple-950/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {['thought', 'task', 'note', 'snippet'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setItemType(type)}
                className={`text-xs capitalize px-3.5 py-1.5 rounded-xl border transition-all duration-200 ${
                  itemType === type
                    ? 'bg-purple-600/30 text-purple-200 border-purple-400/50 font-bold shadow-sm shadow-purple-600/30'
                    : 'bg-obsidian-950/80 text-purple-400/60 border-purple-500/20 hover:text-purple-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title or context tag (optional)..."
            className="w-full bg-obsidian-950/90 border border-purple-500/30 rounded-2xl px-4 py-2.5 text-xs text-purple-100 placeholder-purple-400/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
          />

          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What fleeting insight, design constraint, or mental thread are you tracking?"
            required
            className="w-full bg-obsidian-950/90 border border-purple-500/30 rounded-2xl p-4 text-xs text-purple-100 placeholder-purple-400/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 resize-none font-mono"
          />

          {redactionNotice && (
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/15 p-3 rounded-2xl border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{redactionNotice}</span>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs text-purple-400/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30 border border-purple-400/40 disabled:opacity-50 active:scale-95"
            >
              {loading ? "Capturing..." : "Store in Second Brain"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
