import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  Lightbulb, 
  RefreshCw, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Flag, 
  ArrowRight, 
  Plus,
  Target,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESETS = [
  {
    label: '🚀 Hackathon 5 PM Sprint',
    schedule: '10:30 AM Team Standup, 01:00 PM Lunch, 03:00 PM Sponsor Mentor Sync',
    deadline: '05:00 PM (Hard Hackathon Portal Deadline)',
    tasks: 'Fix token streaming buffer, complete Devpost submission markdown with architecture diagrams, verify live Nebius H100 benchmarks, record 3-min demo video.',
  },
  {
    label: '🎓 Student Project Due 6 PM',
    schedule: '11:00 AM - 12:30 PM AI Lecture, 02:00 PM Office Hours with TA',
    deadline: '06:00 PM (Canvas Assignment Cutoff)',
    tasks: 'Derive loss function gradient, train PyTorch model on test split, plot convergence metrics, format LaTeX report and export PDF.',
  },
  {
    label: '💼 Founder Product Launch',
    schedule: '09:30 AM Core Engineering Standup, 01:00 PM Investor Catch-up, 04:30 PM Customer Advisory Board',
    deadline: '06:00 PM (Public v1.0 Launch Broadcast)',
    tasks: 'Deploy release build to production, verify payment webhook integration, review announcement email draft, publish documentation changelog.',
  }
];

export default function BriefingView({ briefing, onRegenerate, loading: externalLoading, onUpdateMetrics }) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [scheduleInput, setScheduleInput] = useState('10:30 AM Team Standup, 01:00 PM Lunch, 03:30 PM Architecture Review');
  const [deadlineInput, setDeadlineInput] = useState('05:00 PM');
  const [tasksInput, setTasksInput] = useState('Review client architecture notes, approve PR #142 token streamer buffer fix, complete technical documentation.');
  const [attachments, setAttachments] = useState([]);
  const [structuring, setStructuring] = useState(false);
  const [customSchedule, setCustomSchedule] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const fileInputRef = useRef(null);

  // Handle preset selection
  const applyPreset = (preset) => {
    setScheduleInput(preset.schedule);
    setDeadlineInput(preset.deadline);
    setTasksInput(preset.tasks);
  };

  // Handle file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newAttachments = files.map(file => {
      const isImg = file.type.startsWith('image/');
      return {
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
        previewUrl: isImg ? URL.createObjectURL(file) : null
      };
    });

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Submit day structurer request
  const handleStructureDay = async (e) => {
    e?.preventDefault();
    if (structuring) return;

    setStructuring(true);
    try {
      const attachmentsSummary = attachments.map(a => `${a.name} (${a.type}, ${a.size})`).join(', ');
      
      const res = await fetch('/api/schedule/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule_input: scheduleInput,
          tasks_detail: tasksInput,
          deadline: deadlineInput,
          attachments_summary: attachmentsSummary || null
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCustomSchedule(data);
        setIsCustomizing(false);
        if (onUpdateMetrics && data.metrics) {
          onUpdateMetrics(data.metrics);
        }
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#38BDF8', '#10B981', '#FFFFFF']
        });
      }
    } catch (err) {
      console.error('Failed to structure day:', err);
    } finally {
      setStructuring(false);
    }
  };

  // Toggle tasks
  const toggleTask = (taskKey) => {
    setCompletedTasks(prev => {
      const isNowDone = !prev[taskKey];
      if (isNowDone) {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#FFFFFF', '#A855F7', '#10B981']
        });
      }
      return { ...prev, [taskKey]: isNowDone };
    });
  };

  // Derive schedule data (custom structured or fallback briefing)
  const scheduleData = customSchedule?.schedule;
  const timeBlocks = scheduleData?.time_blocks || [
    {
      time: "09:30 AM - 11:30 AM",
      title: "Deep Work: Core Deliverable Sprint",
      type: "DEEP_WORK",
      focus: "Review client architecture requirements and execute PR #142 token streamer buffer fix.",
      action_items: [
        "Review client architecture agenda ahead of 11:30 AM review",
        "Approve PR #142 token streamer async buffer fix"
      ]
    },
    {
      time: "11:30 AM - 12:30 PM",
      title: "Fixed Review & Architecture Sync",
      type: "FIXED_COMMITMENT",
      focus: "Attend 11:30 AM review meeting and align cross-functional dependencies.",
      action_items: [
        "Participate in client architecture review",
        "Capture unblocked follow-ups in Synapse tray"
      ]
    },
    {
      time: "01:30 PM - 03:30 PM",
      title: "Deadline Sprint: Technical Documentation",
      type: "DEADLINE_SPRINT",
      focus: "Reserve 90 minutes of quiet focus time for technical documentation.",
      action_items: [
        "Complete technical roadmap document",
        "Confirm Friday 2:00 PM catch-up with David"
      ]
    },
    {
      time: "03:30 PM - 04:30 PM",
      title: "Buffer & Final Verification",
      type: "BUFFER_REVIEW",
      focus: "Safety margin ahead of deadline to verify staging SSL and deployment.",
      action_items: [
        "Verify staging SSL certificate renewal",
        "Final sanity check before end-of-day cutoff"
      ]
    }
  ];

  const mustDoToday = scheduleData?.must_do_today || [
    {
      task: "Review client architecture agenda ahead of 11:30 AM review",
      priority: "CRITICAL_BEFORE_DEADLINE",
      estimated_minutes: 45,
      block_assigned: "09:30 AM - 11:30 AM"
    },
    {
      task: "Approve PR #142 token streamer async buffer fix",
      priority: "HIGH",
      estimated_minutes: 30,
      block_assigned: "09:30 AM - 11:30 AM"
    },
    {
      task: "Reserve 90 minutes of quiet focus time for technical roadmap",
      priority: "HIGH",
      estimated_minutes: 90,
      block_assigned: "01:30 PM - 03:30 PM"
    }
  ];

  const canWait = scheduleData?.can_wait_or_defer || [
    "Confirm Friday 2:00 PM catch-up with David",
    "Verify staging SSL certificate renewal"
  ];

  const deadlineAssessment = scheduleData?.deadline_assessment || {
    deadline: deadlineInput || "05:00 PM",
    feasibility: "COMFORTABLE",
    buffer_minutes: 60,
    strategy: "High-concentration tasks are scheduled before lunch, leaving a 60-minute buffer before the afternoon deadline."
  };

  const summary = scheduleData?.summary || briefing?.summary || "Good morning. Focus today is centered on reviewing customer architecture requirements and finalizing the Q4 deployment rollout.";
  const chiefTip = scheduleData?.chief_of_staff_tip || briefing?.proactive_tip || "Keep Slack / notifications muted during your 09:30 AM deep work window to protect your submission timeline.";

  const getBlockBadgeColor = (type) => {
    switch (type) {
      case 'DEEP_WORK':
        return 'bg-violet-500/10 text-violet-300 border-violet-500/30';
      case 'DEADLINE_SPRINT':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'FIXED_COMMITMENT':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'BUFFER_REVIEW':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner: Overview & Mode Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#131318] border border-zinc-800 shadow-xl"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-violet-400" />
            <span>EXECUTIVE DAY PLANNER • {customSchedule?.date || briefing?.date_str || "TODAY"}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Your Structured Execution Plan</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              NVIDIA Nemotron-3.5
            </span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Action Toggle Button */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setIsCustomizing(!isCustomizing)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-sm ${
              isCustomizing
                ? 'bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {isCustomizing ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isCustomizing ? "View Timeline" : "Custom Schedule & Deadlines"}</span>
          </motion.button>

          {!isCustomizing && (
            <motion.button
              onClick={onRegenerate}
              disabled={externalLoading || structuring}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              title="Regenerate with Nemotron"
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${externalLoading || structuring ? "animate-spin text-violet-400" : ""}`} />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* 2. Interactive Input Drawer: Give your day schedule, task details & attachments */}
      <AnimatePresence>
        {isCustomizing && (
          <motion.form
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            onSubmit={handleStructureDay}
            className="rounded-2xl border border-violet-500/30 bg-[#15131f] p-6 space-y-6 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Structure Your Day According to Deadlines</h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Powered by Nebius Token Factory H100
              </span>
            </div>

            {/* Quick 1-Click Presets for Judges & Users */}
            <div>
              <div className="text-xs text-zinc-400 mb-2 font-medium">Quick 1-Click Sample Scenarios:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-violet-500/40 text-left text-xs font-medium transition-all"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 1: Schedule & Fixed Timestamps */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Fixed Schedule & Timestamps
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Meetings / Classes</span>
                </label>
                <textarea
                  rows={3}
                  value={scheduleInput}
                  onChange={(e) => setScheduleInput(e.target.value)}
                  placeholder="e.g. 10:00 AM - 11:30 AM Team Sync, 1:00 PM Lunch, 4:00 PM Client Call"
                  className="w-full bg-black/80 border border-zinc-800 focus:border-violet-500 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all resize-none shadow-inner"
                />
              </div>

              {/* Field 2: Hard Deadline */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-rose-400" />
                    Target Deadline
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono">Hard Cutoff</span>
                </label>
                <input
                  type="text"
                  value={deadlineInput}
                  onChange={(e) => setDeadlineInput(e.target.value)}
                  placeholder="e.g. 05:00 PM (Submission Cutoff)"
                  className="w-full bg-black/80 border border-zinc-800 focus:border-rose-500 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
                />

                <div className="pt-2 flex flex-wrap gap-1.5 text-[11px]">
                  {['05:00 PM', '06:00 PM', '11:59 PM'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDeadlineInput(d)}
                      className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 3: Detailed Task Explanation */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-violet-400" />
                  Detailed Work & Task Explanation
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Scope & Dependencies</span>
              </label>
              <textarea
                rows={3}
                value={tasksInput}
                onChange={(e) => setTasksInput(e.target.value)}
                placeholder="Explain everything you need to get done today in detail... (e.g. 'Need to fix API endpoints, write documentation, prepare presentation slides, test with 3 users')"
                className="w-full bg-black/80 border border-zinc-800 focus:border-violet-500 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all resize-none shadow-inner"
              />
            </div>

            {/* Field 4: Attach Images & Files */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Attach Images or Documents (Optional)
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">Screenshots, Notes, PDFs, Specs</span>
              </div>

              {/* Upload Drop Zone / Button */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.txt,.md,.json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 text-xs font-medium transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Choose Files / Screenshots</span>
                </button>
                <span className="text-xs text-zinc-500">
                  {attachments.length === 0 ? "No files attached yet" : `${attachments.length} file(s) attached`}
                </span>
              </div>

              {/* Attachment Pills / Thumbnails */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
                    >
                      {att.previewUrl ? (
                        <img src={att.previewUrl} alt="preview" className="w-5 h-5 rounded object-cover" />
                      ) : (
                        <FileText className="w-4 h-4 text-zinc-400" />
                      )}
                      <span className="max-w-[140px] truncate">{att.name}</span>
                      <span className="text-[10px] text-zinc-500">{att.size}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCustomizing(false)}
                className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>

              <motion.button
                type="submit"
                disabled={structuring}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-lg shadow-white/10 disabled:opacity-50 transition-colors"
              >
                <Sparkles className={`w-3.5 h-3.5 ${structuring ? "animate-spin text-violet-600" : ""}`} />
                <span>{structuring ? "Structuring Day on Nebius H100..." : "Structure My Day with Nemotron-3.5"}</span>
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* 3. Deadline Feasibility & Buffer Assessment Banner */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="p-5 rounded-2xl bg-[#131318] border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
            <Flag className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase">Deadline Architecture</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {deadlineAssessment.feasibility}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30">
                {deadlineAssessment.buffer_minutes}m Safety Buffer
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-2xl">
              <strong className="text-zinc-200">Cutoff: {deadlineAssessment.deadline}.</strong> {deadlineAssessment.strategy}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCustomizing(true)}
          className="text-xs font-medium text-violet-400 hover:text-violet-300 underline underline-offset-4 flex-shrink-0"
        >
          Change Deadline
        </button>
      </motion.div>

      {/* 4. The Main Two Columns: Hour-by-Hour Timeline + Today's Prioritized Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Hour-by-Hour Structured Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono px-1">
            <span className="text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Hour-by-Hour Execution Timeline
            </span>
            <span className="text-zinc-500">Timestamps & Focus Windows</span>
          </div>

          <div className="space-y-3">
            {timeBlocks.map((block, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.012, x: 2 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className="p-4 rounded-2xl bg-[#131318] border border-zinc-800 space-y-2.5 shadow-md hover:border-zinc-700 transition-colors"
              >
                {/* Time & Badge */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800">
                      {block.time}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${getBlockBadgeColor(block.type)}`}>
                      {block.type}
                    </span>
                  </div>
                </div>

                {/* Title & Focus */}
                <div>
                  <h4 className="text-sm font-bold text-white">{block.title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{block.focus}</p>
                </div>

                {/* Action Items */}
                {block.action_items && block.action_items.length > 0 && (
                  <div className="pt-1.5 border-t border-zinc-850 space-y-1">
                    {block.action_items.map((item, actIdx) => (
                      <div key={actIdx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                        <span className="text-violet-400 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Must Do Today (Before Deadline) + Can Wait */}
        <div className="lg:col-span-5 space-y-6">
          {/* Priority Checklist */}
          <div className="p-5 rounded-2xl bg-[#131318] border border-zinc-800 space-y-4 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-violet-400" />
                Must Do Today
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {Object.values(completedTasks).filter(Boolean).length} / {mustDoToday.length} Done
              </span>
            </div>

            <div className="space-y-2">
              {mustDoToday.map((item, idx) => {
                const taskKey = `task-${idx}`;
                const isDone = completedTasks[taskKey];
                return (
                  <motion.div
                    key={idx}
                    onClick={() => toggleTask(taskKey)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isDone
                        ? 'bg-black/60 border-zinc-900 opacity-40 line-through text-zinc-500'
                        : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <button type="button" className="mt-0.5 flex-shrink-0 text-white">
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-zinc-500" />
                        )}
                      </button>
                      <div className="flex-1 space-y-1">
                        <div className="text-xs font-medium leading-relaxed">{item.task}</div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                          {item.block_assigned && (
                            <span className="text-cyan-400">{item.block_assigned}</span>
                          )}
                          {item.estimated_minutes && (
                            <span>• {item.estimated_minutes} mins</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Can Wait or Defer Section */}
          <div className="p-5 rounded-2xl bg-[#131318] border border-zinc-800 space-y-3 shadow-md">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Can Wait / Safe to Postpone</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              If unexpected delays occur before your deadline, postpone these first without risk:
            </p>
            <ul className="space-y-1.5 pt-1">
              {canWait.map((waitItem, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/80">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{waitItem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chief of Staff Insight */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-violet-500/20 flex items-start gap-3 shadow-sm">
            <Lightbulb className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-[11px] font-mono font-bold text-white uppercase">Chief of Staff Tip</h5>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                {chiefTip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
