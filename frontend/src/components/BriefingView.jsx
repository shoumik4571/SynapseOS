import React, { useState, useRef, useEffect } from 'react';
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
  Flag, 
  Plus, 
  Target, 
  Edit3, 
  RotateCcw,
  MessageSquare,
  ListFilter
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Format helper
const getTodayStr = () => new Date().toISOString().split('T')[0];
const getTomorrowStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};
const getDay3Str = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split('T')[0];
};

export default function BriefingView({ onUpdateMetrics }) {
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [activeInputMode, setActiveInputMode] = useState('prompt'); // 'prompt' | 'structured'
  const [naturalPrompt, setNaturalPrompt] = useState('');
  const [scheduleInput, setScheduleInput] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');
  const [tasksInput, setTasksInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [structuring, setStructuring] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const fileInputRef = useRef(null);

  // Load custom schedule for the selected date from localStorage
  const [customSchedule, setCustomSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem(`synapse_schedule_${getTodayStr()}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Switch date
  const handleSelectDate = (dateStr) => {
    setSelectedDate(dateStr);
    try {
      const saved = localStorage.getItem(`synapse_schedule_${dateStr}`);
      setCustomSchedule(saved ? JSON.parse(saved) : null);
    } catch {
      setCustomSchedule(null);
    }
    setCompletedTasks({});
    setIsBuilderOpen(false);
  };

  // Save custom schedule whenever updated for the active date
  const saveScheduleForDate = (data, dateStr) => {
    setCustomSchedule(data);
    try {
      localStorage.setItem(`synapse_schedule_${dateStr}`, JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleStructureDay = async (e) => {
    e?.preventDefault();
    if (activeInputMode === 'prompt' && !naturalPrompt.trim()) return;
    if (activeInputMode === 'structured' && !tasksInput.trim() && !scheduleInput.trim()) return;
    if (structuring) return;

    setStructuring(true);
    try {
      const attachmentsSummary = attachments.map(a => `${a.name} (${a.type}, ${a.size})`).join(', ');

      const payload = {
        target_date: selectedDate,
        attachments_summary: attachmentsSummary || null
      };

      if (activeInputMode === 'prompt') {
        payload.prompt = naturalPrompt;
      } else {
        payload.schedule_input = scheduleInput;
        payload.tasks_detail = tasksInput;
        payload.deadline = deadlineInput || null;
      }

      const res = await fetch('/api/schedule/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        saveScheduleForDate(data, selectedDate);
        setIsBuilderOpen(false);
        setCompletedTasks({});
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

  const handleStartFresh = () => {
    setCustomSchedule(null);
    localStorage.removeItem(`synapse_schedule_${selectedDate}`);
    setNaturalPrompt('');
    setScheduleInput('');
    setDeadlineInput('');
    setTasksInput('');
    setAttachments([]);
    setCompletedTasks({});
    setIsBuilderOpen(true);
  };

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

  // 1. Initial State: Clean Welcome Card if no schedule for this date
  if (!customSchedule && !isBuilderOpen) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
        {/* Date Selector Tabs (Today, Tomorrow, Day 3) */}
        <div className="flex items-center justify-center gap-2">
          {[
            { label: 'Today', value: getTodayStr() },
            { label: 'Tomorrow', value: getTomorrowStr() },
            { label: 'Day 3', value: getDay3Str() },
          ].map(d => (
            <button
              key={d.value}
              onClick={() => handleSelectDate(d.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                selectedDate === d.value
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {d.label} ({d.value.slice(5)})
            </button>
          ))}
        </div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-zinc-800 bg-[#131318] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Calendar className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            MORNING PLANNER • {selectedDate}
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Structure Your Day with Synapse
          </h2>

          <p className="mt-3 text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Give Synapse a quick prompt describing your day, or enter your fixed times & deadlines. It will calculate an hour-by-hour timeline and prioritize what to focus on.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              onClick={() => setIsBuilderOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-sm shadow-xl shadow-white/10 transition-colors w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Build Your Schedule</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Builder Mode: Allows Natural Language Prompt OR Structured Fields!
  if (isBuilderOpen) {
    return (
      <div className="max-w-3xl mx-auto py-4 px-4 space-y-4">
        {/* Date Selector */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {[
            { label: 'Today', value: getTodayStr() },
            { label: 'Tomorrow', value: getTomorrowStr() },
            { label: 'Day 3', value: getDay3Str() },
          ].map(d => (
            <button
              key={d.value}
              onClick={() => handleSelectDate(d.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                selectedDate === d.value
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {d.label} ({d.value.slice(5)})
            </button>
          ))}
        </div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleStructureDay}
          className="rounded-3xl border border-zinc-800 bg-[#131318] p-6 sm:p-8 space-y-6 shadow-2xl"
        >
          {/* Form Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">Plan Schedule for {selectedDate}</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Powered by NVIDIA Nemotron-3.5 on Nebius Token Factory
              </p>
            </div>

            {customSchedule && (
              <button
                type="button"
                onClick={() => setIsBuilderOpen(false)}
                className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg border border-zinc-800 hover:border-zinc-700"
              >
                Back to Timeline
              </button>
            )}
          </div>

          {/* Mode Selector: Natural Language Prompt vs Structured Fields */}
          <div className="flex items-center justify-center p-1 bg-black rounded-xl border border-zinc-800 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => setActiveInputMode('prompt')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeInputMode === 'prompt'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Prompt the AI (Natural)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInputMode('structured')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeInputMode === 'structured'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Structured Fields</span>
            </button>
          </div>

          {/* Mode 1: Natural Language Prompt */}
          {activeInputMode === 'prompt' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
                <span>Describe your day naturally in one prompt:</span>
                <span className="text-[10px] text-violet-400 font-mono">Nemotron AI Extraction</span>
              </label>
              <textarea
                rows={5}
                value={naturalPrompt}
                onChange={(e) => setNaturalPrompt(e.target.value)}
                placeholder="e.g. Tomorrow I have a 10:30 AM standup and a 2:00 PM mentor sync. I have a hard deadline at 5:00 PM to submit my project. I need to fix the backend token streaming bug, finish the documentation, and record a 3-minute video. Please structure my day with safety buffer."
                className="w-full bg-black/80 border border-zinc-800 focus:border-violet-500 rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all resize-none shadow-inner leading-relaxed"
              />
              <p className="text-[11px] text-zinc-500">
                Tip: You can mention meetings, deadlines, and tasks in any order. The AI extracts timestamps and balances your time automatically.
              </p>
            </div>
          )}

          {/* Mode 2: Structured Fields */}
          {activeInputMode === 'structured' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Fixed Times & Schedule
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">e.g. 10:30 AM Standup</span>
                </label>
                <input
                  type="text"
                  value={scheduleInput}
                  onChange={(e) => setScheduleInput(e.target.value)}
                  placeholder="e.g. 10:30 AM Standup, 01:00 PM Lunch"
                  className="w-full bg-black/80 border border-zinc-800 focus:border-violet-500 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-rose-400" />
                    Hard Deadline
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono">Target cutoff</span>
                </label>
                <input
                  type="text"
                  value={deadlineInput}
                  onChange={(e) => setDeadlineInput(e.target.value)}
                  placeholder="e.g. 05:00 PM"
                  className="w-full bg-black/80 border border-zinc-800 focus:border-rose-500 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-violet-400" />
                    What do you need to get done?
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Detailed tasks</span>
                </label>
                <textarea
                  rows={3}
                  value={tasksInput}
                  onChange={(e) => setTasksInput(e.target.value)}
                  placeholder="e.g. Finish API integration, write lab report, prepare presentation..."
                  className="w-full bg-black/80 border border-zinc-800 focus:border-violet-500 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all resize-none shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Attachments Section */}
          <div className="space-y-2 pt-2 border-t border-zinc-850">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                Attach Images or Files (Optional)
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Screenshots, Notes, PDFs</span>
            </div>

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
                <span>Attach Files / Screenshots</span>
              </button>
              <span className="text-xs text-zinc-500">
                {attachments.length === 0 ? "No attachments" : `${attachments.length} attached`}
              </span>
            </div>

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

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-850">
            {customSchedule && (
              <button
                type="button"
                onClick={() => setIsBuilderOpen(false)}
                className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
            )}

            <motion.button
              type="submit"
              disabled={
                structuring || 
                (activeInputMode === 'prompt' && !naturalPrompt.trim()) ||
                (activeInputMode === 'structured' && !tasksInput.trim() && !scheduleInput.trim())
              }
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-lg shadow-white/10 disabled:opacity-40 transition-colors"
            >
              <Sparkles className={`w-3.5 h-3.5 ${structuring ? "animate-spin text-violet-600" : ""}`} />
              <span>{structuring ? "Structuring on Nebius H100..." : "Structure My Day"}</span>
            </motion.button>
          </div>
        </motion.form>
      </div>
    );
  }

  // 3. Active Output View: Displays Real Output for the selected date!
  const scheduleData = customSchedule.schedule;
  const timeBlocks = scheduleData?.time_blocks || [];
  const mustDoToday = scheduleData?.must_do_today || [];
  const canWait = scheduleData?.can_wait_or_defer || [];
  const deadlineAssessment = scheduleData?.deadline_assessment;
  const summary = scheduleData?.summary || "Your schedule is structured with built-in focus blocks and deadline safety margins.";
  const chiefTip = scheduleData?.chief_of_staff_tip;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Date Switcher */}
      <div className="flex items-center justify-center gap-2">
        {[
          { label: 'Today', value: getTodayStr() },
          { label: 'Tomorrow', value: getTomorrowStr() },
          { label: 'Day 3', value: getDay3Str() },
        ].map(d => (
          <button
            key={d.value}
            onClick={() => handleSelectDate(d.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
              selectedDate === d.value
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {d.label} ({d.value.slice(5)})
          </button>
        ))}
      </div>

      {/* Top Banner with Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#131318] border border-zinc-800 shadow-xl"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-violet-400" />
            <span>SCHEDULE FOR {selectedDate}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Execution Timeline</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              NVIDIA Nemotron-3.5
            </span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Action Buttons: Edit or Start Fresh */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            onClick={() => setIsBuilderOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs transition-colors shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Schedule</span>
          </motion.button>

          <motion.button
            onClick={handleStartFresh}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            title="Start fresh with a new plan"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Deadline Assessment Banner */}
      {deadlineAssessment && (
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
                <span className="text-xs font-mono font-bold text-white uppercase">Deadline Protection</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {deadlineAssessment.feasibility}
                </span>
                {deadlineAssessment.buffer_minutes && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30">
                    {deadlineAssessment.buffer_minutes}m Safety Buffer
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-2xl">
                <strong className="text-zinc-200">Cutoff: {deadlineAssessment.deadline}.</strong> {deadlineAssessment.strategy}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Two Columns: Timeline & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono px-1">
            <span className="text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Hour-by-Hour Execution Timeline
            </span>
            <span className="text-zinc-500">{timeBlocks.length} Time Blocks</span>
          </div>

          <div className="space-y-3">
            {timeBlocks.map((block, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.012, x: 2 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className="p-4 rounded-2xl bg-[#131318] border border-zinc-800 space-y-2.5 shadow-md hover:border-zinc-700 transition-colors"
              >
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

                <div>
                  <h4 className="text-sm font-bold text-white">{block.title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{block.focus}</p>
                </div>

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

        {/* Priority Checklist */}
        <div className="lg:col-span-5 space-y-6">
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

          {/* Can Wait Section */}
          {canWait && canWait.length > 0 && (
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
          )}

          {/* Chief of Staff Insight */}
          {chiefTip && (
            <div className="p-4 rounded-2xl bg-zinc-950 border border-violet-500/20 flex items-start gap-3 shadow-sm">
              <Lightbulb className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[11px] font-mono font-bold text-white uppercase">Chief of Staff Tip</h5>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  {chiefTip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
