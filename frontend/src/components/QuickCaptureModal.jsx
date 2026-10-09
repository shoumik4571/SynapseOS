import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        className="w-full max-w-lg rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl p-6 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white tracking-tight">Quick Capture (Cmd+K)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {['thought', 'task', 'note', 'snippet'].map((type) => (
              <motion.button
                key={type}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setItemType(type)}
                className={`text-xs capitalize px-3.5 py-1.5 rounded-lg border transition-all ${
                  itemType === type
                    ? 'bg-white text-black font-semibold border-white shadow-sm'
                    : 'bg-black text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title or context tag (optional)..."
            className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
          />

          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What fleeting insight, design constraint, or mental thread are you tracking?"
            required
            className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 resize-none font-mono"
          />

          {redactionNotice && (
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{redactionNotice}</span>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            {/* Crisp White Action Button */}
            <motion.button
              type="submit"
              disabled={loading || !content.trim()}
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="px-5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 disabled:opacity-50 active:scale-95"
            >
              {loading ? "Capturing..." : "Store in Second Brain"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
