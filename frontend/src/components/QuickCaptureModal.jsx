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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-nvidia-green" />
            <h3 className="text-sm font-bold text-white">Quick Capture (Cmd+K)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
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
                className={`text-xs capitalize px-3 py-1.5 rounded-lg border transition-all ${
                  itemType === type
                    ? 'bg-nvidia-green/20 text-nvidia-green border-nvidia-green/40 font-medium'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
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
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-nvidia-green"
          />

          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What fleeting insight, design constraint, or mental thread are you tracking?"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-nvidia-green resize-none font-mono"
          />

          {redactionNotice && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>{redactionNotice}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-5 py-2 rounded-xl bg-nvidia-green hover:bg-nvidia-dark text-slate-950 font-semibold text-xs transition-all disabled:opacity-50"
            >
              {loading ? "Capturing..." : "Store in Second Brain"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
