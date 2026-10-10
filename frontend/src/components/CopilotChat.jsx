import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, ShieldAlert, ChevronDown, ChevronRight, Zap, Globe, ExternalLink } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export default function CopilotChat({ onUpdateMetrics }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'I am Synapse, your personal AI copilot. Grounded with real-time Tavily Web Search and powered by NVIDIA Nemotron-3.5-Lightning on Nebius Token Factory. What are we building or problem-solving right now?',
      metrics: null,
      reasoning: null,
      guardrailAlert: null,
      tavilySources: null,
    }
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [searchingWeb, setSearchingWeb] = useState(false);
  const [openReasoning, setOpenReasoning] = useState({});
  const [openSources, setOpenSources] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleReasoning = (msgId) => {
    setOpenReasoning(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const toggleSources = (msgId) => {
    setOpenSources(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || streaming) return;

    const userText = input.trim();
    setInput('');

    const userMsgId = Date.now();
    const assistantMsgId = userMsgId + 1;

    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', content: userText },
      { id: assistantMsgId, role: 'assistant', content: '', reasoning: '', metrics: null, guardrailAlert: null, tavilySources: null }
    ]);

    setStreaming(true);
    setSearchingWeb(webSearchEnabled);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'default-session',
          message: userText,
          web_search: webSearchEnabled,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;
              const chunk = JSON.parse(jsonStr);

              if (chunk.type === 'tavily_status') {
                setSearchingWeb(chunk.status === 'searching');
              } else if (chunk.type === 'tavily_sources') {
                setMessages(prev =>
                  prev.map(m => m.id === assistantMsgId ? { ...m, tavilySources: chunk.sources } : m)
                );
              } else if (chunk.type === 'guardrail_alert') {
                setMessages(prev =>
                  prev.map(m => m.id === assistantMsgId ? { ...m, guardrailAlert: chunk.redactions } : m)
                );
              } else if (chunk.type === 'reasoning') {
                setMessages(prev =>
                  prev.map(m => m.id === assistantMsgId ? { ...m, reasoning: (m.reasoning || '') + chunk.text } : m)
                );
                setOpenReasoning(prev => ({ ...prev, [assistantMsgId]: true }));
              } else if (chunk.type === 'token') {
                setMessages(prev =>
                  prev.map(m => m.id === assistantMsgId ? { ...m, content: (m.content || '') + chunk.text } : m)
                );
              } else if (chunk.type === 'metrics') {
                setMessages(prev =>
                  prev.map(m => m.id === assistantMsgId ? { ...m, metrics: chunk.data } : m)
                );
                if (onUpdateMetrics) {
                  onUpdateMetrics(chunk.data);
                }
              }
            } catch (err) {
              console.error("Error parsing SSE JSON:", err);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: "Error communicating with Nebius Token Factory. Please verify your connection." }
            : m
        )
      );
    } finally {
      setStreaming(false);
      setSearchingWeb(false);
    }
  };

  return (
    <div className="flex flex-col h-[680px] rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="px-6 py-3.5 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Thought Partner Copilot</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                Nemotron-3.5
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400">Local Memory Grounding + Live Tavily Search</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Nebius Token Factory</span>
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const isReasoningOpen = openReasoning[msg.id];

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3.5 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs shadow-sm ${
                isAssistant
                  ? 'bg-neutral-900 text-neutral-200 border border-neutral-800'
                  : 'bg-white text-black font-semibold'
              }`}>
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Payload */}
              <div className={`space-y-2 max-w-2xl ${isAssistant ? 'w-full' : ''}`}>
                {/* NeMo Privacy Guardrail Warning */}
                {msg.guardrailAlert && msg.guardrailAlert.length > 0 && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>NeMo Guardrail redacted sensitive secrets: <strong>{msg.guardrailAlert.join(', ')}</strong></span>
                  </div>
                )}

                {/* Reasoning Process Drawer */}
                {msg.reasoning && (
                  <div className="text-left mb-2 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden text-xs">
                    <button
                      onClick={() => toggleReasoning(msg.id)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-850 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-mono text-[11px] text-neutral-300 font-medium">
                        <span>Nemotron Reasoning Process ({msg.reasoning.length} chars)</span>
                      </span>
                      {isReasoningOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {isReasoningOpen && (
                      <div className="p-4 text-[11px] text-neutral-400 leading-relaxed font-mono whitespace-pre-wrap max-h-60 overflow-y-auto bg-black border-t border-neutral-800">
                        {msg.reasoning}
                      </div>
                    )}
                  </div>
                )}

                {/* Tavily Web Sources Drawer */}
                {msg.tavilySources && msg.tavilySources.length > 0 && (
                  <div className="text-left mb-2 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden text-xs">
                    <button
                      onClick={() => toggleSources(msg.id)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-850 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-mono text-[11px] text-cyan-400 font-medium">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Tavily Sources ({msg.tavilySources.length} verified)</span>
                      </span>
                      {openSources[msg.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {openSources[msg.id] && (
                      <div className="p-3.5 space-y-2 bg-black border-t border-neutral-800 text-[11px]">
                        {msg.tavilySources.map((s, sIdx) => (
                          <a
                            key={sIdx}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 transition-colors group"
                          >
                            <div className="flex items-center justify-between text-neutral-200 font-medium group-hover:text-white">
                              <span className="truncate">{s.title}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-60 ml-2" />
                            </div>
                            <p className="text-[10px] text-neutral-500 line-clamp-2 mt-1">{s.content}</p>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Content Box with Hover Magnification */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className={`p-4 rounded-2xl text-xs leading-relaxed text-left shadow-sm ${
                    isAssistant
                      ? 'bg-neutral-900 border border-neutral-800 text-neutral-200'
                      : 'bg-white text-black font-medium border border-neutral-200 whitespace-pre-wrap'
                  }`}
                >
                  {msg.content ? (
                    isAssistant ? (
                      <MarkdownRenderer content={msg.content} />
                    ) : (
                      msg.content
                    )
                  ) : streaming && isAssistant ? (
                    <span className="inline-flex gap-2 items-center text-neutral-400 animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                      <span>
                        {searchingWeb 
                          ? "Researching live web via Tavily Search..." 
                          : msg.reasoning 
                          ? "Nemotron is synthesizing verified answer..." 
                          : "Connecting to Nebius Token Factory..."}
                      </span>
                    </span>
                  ) : (
                    <span className="text-neutral-500 italic">Thinking completed. Check reasoning process above.</span>
                  )}
                </motion.div>

                {/* Telemetry Badge */}
                {msg.metrics && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 pt-1">
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Zap className="w-3 h-3 text-white" />
                      <span>{msg.metrics.tokens_per_second} tok/s</span>
                    </span>
                    <span>•</span>
                    <span>TTFT {msg.metrics.ttft_ms}ms</span>
                    <span>•</span>
                    <span>{msg.metrics.tokens_generated} tokens</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 1-Click Test Prompts for Evaluators & Judges */}
      <div className="px-4 pt-3 pb-1 bg-neutral-900/40 border-t border-neutral-800/80 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Quick Tests:</span>
        <button
          type="button"
          disabled={streaming}
          onClick={() => {
            setInput("Search latest NVIDIA Nemotron benchmarks and Nebius Token Factory docs via Tavily");
            setTimeout(() => {
              const form = document.getElementById("chat-form");
              if (form) form.requestSubmit();
            }, 50);
          }}
          className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-[11px] text-cyan-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Globe className="w-3 h-3 text-cyan-400" />
          <span>Test Tavily Live Search</span>
        </button>

        <button
          type="button"
          disabled={streaming}
          onClick={() => {
            setInput("Explain in 3 concise points how 165+ tok/s streaming latency from Nebius H100 transforms desktop productivity");
            setTimeout(() => {
              const form = document.getElementById("chat-form");
              if (form) form.requestSubmit();
            }, 50);
          }}
          className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-[11px] text-violet-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Zap className="w-3 h-3 text-violet-400" />
          <span>Test 165+ tok/s Inference</span>
        </button>

        <button
          type="button"
          disabled={streaming}
          onClick={() => {
            setInput("Verify privacy firewall: Here is an API key sk-live-9382173921 and email test@company.com - verify that NeMo Guardrails redacts them");
            setTimeout(() => {
              const form = document.getElementById("chat-form");
              if (form) form.requestSubmit();
            }, 50);
          }}
          className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-[11px] text-emerald-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <ShieldAlert className="w-3 h-3 text-emerald-400" />
          <span>Test NeMo Privacy Shield</span>
        </button>
      </div>

      {/* Input Bar & Controls */}
      <div className="p-4 bg-neutral-900/60 border-t border-neutral-800/60 space-y-2.5">
        <div className="flex items-center justify-between text-xs px-1">
          <button
            type="button"
            onClick={() => setWebSearchEnabled(!webSearchEnabled)}
            className={`px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              webSearchEnabled
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'bg-black text-neutral-500 border border-neutral-850'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Web Search: {webSearchEnabled ? "Active" : "Off"}</span>
            {webSearchEnabled && <span className="text-[10px] bg-neutral-700 text-neutral-300 px-1.5 py-0.2 rounded font-mono">Tavily</span>}
          </button>

          {searchingWeb && (
            <span className="flex items-center gap-1.5 text-xs text-cyan-400 animate-pulse">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              <span>Browsing live web via Tavily...</span>
            </span>
          )}
        </div>

        <form id="chat-form" onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your second brain, explore documentation, or verify live facts..."
            disabled={streaming}
            className="flex-1 bg-black border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all disabled:opacity-50 shadow-inner"
          />

          {/* Crisp White Send Button */}
          <motion.button
            type="submit"
            disabled={streaming || !input.trim()}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-md shadow-white/10 disabled:opacity-30 flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
