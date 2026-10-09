import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert, ChevronDown, ChevronRight, Zap, Sparkles, Globe, ExternalLink } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export default function CopilotChat({ onUpdateMetrics }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'I am SynapseOS, your personal ambient cognitive partner. Grounded in your active workspace files with real-time Tavily Web Grounding and powered by NVIDIA Nemotron-3.5-Lightning on Nebius Token Factory. What are we strategizing or building today?',
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
    <div className="flex flex-col h-[680px] rounded-3xl bg-obsidian-900/80 border border-purple-500/25 overflow-hidden shadow-2xl shadow-purple-950/50 backdrop-blur-2xl">
      {/* Top Header Bar */}
      <div className="px-6 py-4 border-b border-purple-500/20 bg-obsidian-950/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-synapse-purple shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Thought Partner Copilot</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Nemotron-3.5
              </span>
            </h3>
            <p className="text-[11px] text-purple-300/60">Local Memory Grounding + Live Tavily Search</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-synapse-purple animate-pulse" />
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
            <div
              key={msg.id}
              className={`flex gap-3.5 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs shadow-md ${
                isAssistant
                  ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30'
                  : 'bg-indigo-900/40 text-indigo-200 border border-indigo-500/30'
              }`}>
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Payload */}
              <div className={`space-y-2 max-w-2xl ${isAssistant ? 'w-full' : ''}`}>
                {/* NeMo Privacy Guardrail Warning */}
                {msg.guardrailAlert && msg.guardrailAlert.length > 0 && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/40 text-purple-200 text-xs">
                    <ShieldAlert className="w-4 h-4 text-synapse-purple flex-shrink-0" />
                    <span>NeMo Privacy Guardrail redacted sensitive secrets before cloud transmission: <strong>{msg.guardrailAlert.join(', ')}</strong></span>
                  </div>
                )}

                {/* Reasoning Process Drawer */}
                {msg.reasoning && (
                  <div className="text-left mb-2 rounded-2xl bg-obsidian-950/70 border border-purple-500/25 overflow-hidden text-xs shadow-sm">
                    <button
                      onClick={() => toggleReasoning(msg.id)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-purple-300/80 hover:text-white bg-purple-950/40 hover:bg-purple-950/60 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-mono text-[11px] text-synapse-purple font-semibold">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>Nemotron Reasoning Process ({msg.reasoning.length} chars)</span>
                      </span>
                      {isReasoningOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {isReasoningOpen && (
                      <div className="p-4 text-[11px] text-purple-200/80 leading-relaxed font-mono whitespace-pre-wrap max-h-60 overflow-y-auto bg-obsidian-950/90 border-t border-purple-500/20">
                        {msg.reasoning}
                      </div>
                    )}
                  </div>
                )}

                {/* Tavily Web Sources Drawer */}
                {msg.tavilySources && msg.tavilySources.length > 0 && (
                  <div className="text-left mb-2 rounded-2xl bg-obsidian-950/70 border border-purple-500/25 overflow-hidden text-xs shadow-sm">
                    <button
                      onClick={() => toggleSources(msg.id)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-purple-300/80 hover:text-white bg-purple-950/40 hover:bg-purple-950/60 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-mono text-[11px] text-nebius-cyan font-semibold">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Tavily Web Sources ({msg.tavilySources.length} verified)</span>
                      </span>
                      {openSources[msg.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {openSources[msg.id] && (
                      <div className="p-3.5 space-y-2 bg-obsidian-950/90 border-t border-purple-500/20 text-[11px]">
                        {msg.tavilySources.map((s, sIdx) => (
                          <a
                            key={sIdx}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block p-2.5 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 transition-colors group"
                          >
                            <div className="flex items-center justify-between text-purple-200 font-semibold group-hover:text-nebius-cyan">
                              <span className="truncate">{s.title}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-60 ml-2" />
                            </div>
                            <p className="text-[10px] text-purple-300/60 line-clamp-2 mt-1">{s.content}</p>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Content Box */}
                <div className={`p-4 rounded-2xl text-xs leading-relaxed text-left ${
                  isAssistant
                    ? 'bg-obsidian-950/90 text-purple-100 border border-purple-500/20 shadow-md shadow-purple-950/40'
                    : 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 text-white border border-purple-400/40 shadow-lg shadow-purple-950/50 whitespace-pre-wrap'
                }`}>
                  {msg.content ? (
                    isAssistant ? (
                      <MarkdownRenderer content={msg.content} />
                    ) : (
                      msg.content
                    )
                  ) : streaming && isAssistant ? (
                    <span className="inline-flex gap-2 items-center text-purple-300 animate-pulse">
                      <span className="w-2 h-2 bg-synapse-purple rounded-full animate-ping"></span>
                      <span>
                        {searchingWeb 
                          ? "Researching live web via Tavily Search..." 
                          : msg.reasoning 
                          ? "Nemotron is synthesizing verified answer..." 
                          : "Connecting to Nebius Token Factory..."}
                      </span>
                    </span>
                  ) : (
                    <span className="text-purple-400/50 italic">Thinking completed. Check reasoning process above.</span>
                  )}
                </div>

                {/* Telemetry Badge */}
                {msg.metrics && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-purple-400/60 pt-1">
                    <span className="flex items-center gap-1 text-purple-300">
                      <Zap className="w-3 h-3 text-synapse-purple" />
                      <span>{msg.metrics.tokens_per_second} tok/s</span>
                    </span>
                    <span>•</span>
                    <span>TTFT {msg.metrics.ttft_ms}ms</span>
                    <span>•</span>
                    <span>{msg.metrics.tokens_generated} tokens</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar & Controls */}
      <div className="p-4 bg-obsidian-950/80 border-t border-purple-500/20 space-y-2.5">
        <div className="flex items-center justify-between text-xs px-1">
          <button
            type="button"
            onClick={() => setWebSearchEnabled(!webSearchEnabled)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              webSearchEnabled
                ? 'bg-purple-900/40 text-purple-200 border border-purple-400/40 shadow-sm'
                : 'bg-obsidian-900 text-purple-400/50 border border-purple-500/20'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-nebius-cyan" />
            <span>Live Web Grounding: {webSearchEnabled ? "Active" : "Off"}</span>
            {webSearchEnabled && <span className="text-[10px] bg-nebius-cyan/20 text-nebius-cyan px-1.5 py-0.2 rounded font-mono">Tavily</span>}
          </button>

          {searchingWeb && (
            <span className="flex items-center gap-1.5 text-xs text-nebius-cyan animate-pulse">
              <span className="w-1.5 h-1.5 bg-nebius-cyan rounded-full animate-ping" />
              <span>Browsing live web via Tavily...</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your second brain, explore documentation, or verify live facts..."
            disabled={streaming}
            className="flex-1 bg-obsidian-950/90 border border-purple-500/30 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 rounded-2xl px-5 py-3 text-xs text-purple-100 placeholder-purple-400/40 focus:outline-none transition-all disabled:opacity-50 shadow-inner"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30 disabled:opacity-40 flex items-center justify-center active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
