import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Hackathon Feedback',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="rounded-3xl border border-zinc-800/80 bg-[#131318]/90 p-8 sm:p-12 shadow-2xl shadow-black/60 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-mono mb-4">
            <Mail className="w-3.5 h-3.5 text-violet-400" />
            GET IN TOUCH
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Connect With the SynapseOS Team
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Have questions about our Nebius integration, NVIDIA Nemotron architecture, or want early enterprise access? Send us a message.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl bg-zinc-900/60 border border-emerald-500/30 text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Message Transmitted!</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Thank you for testing SynapseOS. Our team will review your inquiry and get back to you promptly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', type: 'Hackathon Feedback', message: '' });
              }}
              className="mt-4 text-xs font-mono text-violet-400 hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">YOUR NAME</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Chen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 focus:border-violet-500 text-white placeholder-zinc-600 text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">WORK EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 focus:border-violet-500 text-white placeholder-zinc-600 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">INQUIRY TYPE</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 focus:border-violet-500 text-white text-sm outline-none transition-colors"
              >
                <option value="Hackathon Feedback">Hackathon Feedback / Evaluation</option>
                <option value="Feature Request">Feature Request or Bug Report</option>
                <option value="Enterprise Pilot">Enterprise Team Pilot</option>
                <option value="Partnership">Infrastructure & Cloud Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">MESSAGE</label>
              <textarea
                rows={4}
                required
                placeholder="Share your thoughts on the autonomous copilot, inference latency, or suggestions..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 focus:border-violet-500 text-white placeholder-zinc-600 text-sm outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
