import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="markdown-body space-y-3 leading-relaxed text-slate-200 text-xs">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-base font-bold text-white mt-3 mb-1.5 flex items-center gap-2 border-b border-slate-800 pb-1" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-sm font-bold text-white mt-3 mb-1 flex items-center gap-1.5 text-nvidia-green" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xs font-bold text-slate-100 mt-2.5 mb-1 flex items-center gap-1.5" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-xs font-semibold text-nebius-cyan mt-2 mb-0.5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2 leading-relaxed text-slate-300" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-4 space-y-1 mb-2 text-slate-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-4 space-y-1 mb-2 text-slate-300" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-slate-800 bg-slate-950/70">
              <table className="w-full text-left text-xs border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-200 font-semibold" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-slate-800/60" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-slate-900/40 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-3.5 py-2 font-semibold text-slate-200 text-[11px]" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3.5 py-2 text-slate-300 text-[11px] leading-snug" {...props} />
          ),
          code: ({ node, inline, ...props }) => (
            inline ? (
              <code className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-nvidia-green" {...props} />
            ) : (
              <div className="my-2 rounded-xl bg-slate-950 p-3 border border-slate-800 overflow-x-auto">
                <code className="font-mono text-[11px] text-slate-300" {...props} />
              </div>
            )
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-nvidia-green pl-3 py-1 my-2 text-slate-400 italic bg-slate-900/30 rounded-r-lg" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-nebius-cyan hover:underline font-medium" target="_blank" rel="noreferrer" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
