import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert, ChevronDown, ChevronRight, Zap, Sparkles } from 'lucide-react';

export default function CopilotChat({ onUpdateMetrics }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'I am SynapseOS, your personal cognitive copilot. I am ambiently grounded in your workspace files and notes via Nebius Token Factory. What are we building or problem-solving right now?',
      metrics: null,
      reasoning: null,
      guardrailAlert: null,
    }
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [openReasoning, setOpenReasoning] = useState({});
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

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || streaming) return;

    const userText = input.trim();
    setInput('');

    const userMsgId = Date.now();
    const assistantMsgId = userMsgId + 1;

    // Add user message & empty assistant placeholder
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', content: userText },
      { id: assistantMsgId, role: 'assistant', content: '', reasoning: '', metrics: null, guardrailAlert: null }
    ]);

    setStreaming(true);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'default-session',
          message: userText
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const chunk = JSON.parse(line.slice(6));

              setMessages(prev => prev.map(msg => {
                if (msg.id !== assistantMsgId) return msg;

                if (chunk.type === 'token') {
                  return { ...msg, content: msg.content + chunk.text };
                } else if (chunk.type === 'reasoning') {
                  return { ...msg, reasoning: (msg.reasoning || '') + chunk.text };
                } else if (chunk.type === 'guardrail_alert') {
                  return { ...msg, guardrailAlert: chunk.message };
                } else if (chunk.type === 'metrics') {
                  onUpdateMetrics(chunk.data);
                  return { ...msg, metrics: chunk.data };
                }
                return msg;
              }));
            } catch (err) {
              console.error('Error parsing SSE data:', err);
            }
          }
        }
      }
    } catch (err) {
      console.error('Streaming request failed:', err);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
      {/* Chat Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const isReasoningOpen = openReasoning[msg.id] ?? false;

          return (
            <div key={msg.id} className={`flex gap-3.5 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                isAssistant 
                  ? 'bg-slate-800 text-nvidia-green border border-slate-700 shadow-sm' 
                  : 'bg-nebius-cyan/20 text-nebius-cyan border border-nebius-cyan/30'
              }`}>
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] space-y-2 ${isAssistant ? '' : 'text-right'}`}>
                {/* Guardrail Alert Pill */}
                {msg.guardrailAlert && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{msg.guardrailAlert}</span>
                  </div>
                )}

                {/* Reasoning Drawer (for NVIDIA Nemotron reasoning tokens) */}
                {msg.reasoning && (
                  <div className="text-left mb-2 rounded-xl bg-slate-950/60 border border-slate-800/80 overflow-hidden text-xs">
                    <button
                      onClick={() => toggleReasoning(msg.id)}
                      className="w-full px-3 py-2 flex items-center justify-between text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-900 transition-colors"
                    >
                      <span className="flex items-center gap-1.5 font-mono text-[11px] text-nvidia-green">
                        <Sparkles className="w-3 h-3" />
                        <span>Nemotron Reasoning Process</span>
                      </span>
                      {isReasoningOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {isReasoningOpen && (
                      <div className="p-3 text-[11px] text-slate-400 leading-relaxed font-mono whitespace-pre-wrap max-h-60 overflow-y-auto bg-slate-950">
                        {msg.reasoning}
                      </div>
                    )}
                  </div>
                )}

                {/* Content Box */}
                <div className={`p-4 rounded-2xl text-xs leading-relaxed text-left whitespace-pre-wrap ${
                  isAssistant
                    ? 'bg-slate-950/80 text-slate-200 border border-slate-800'
                    : 'bg-nvidia-green/10 text-nvidia-green border border-nvidia-green/30'
                }`}>
                  {msg.content || (streaming && isAssistant ? (
                    <span className="inline-flex gap-1 items-center text-slate-500 animate-pulse">
                      <span>Reasoning on Nebius Token Factory</span>
                      <span className="w-1.5 h-1.5 bg-nebius-cyan rounded-full animate-bounce"></span>
                    </span>
                  ) : '')}
                </div>

                {/* Telemetry Badge */}
                {msg.metrics && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Zap className="w-3 h-3 text-yellow-400" />
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

      {/* Input Bar */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your second brain, explore ideas, or challenge an architectural pattern..."
            disabled={streaming}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-nvidia-green rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-nvidia-green hover:bg-nvidia-dark text-slate-950 font-semibold text-xs transition-all disabled:opacity-40 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
