import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownViewer({ content }) {
  if (!content) {
    return (
      <div className="p-8 text-center text-slate-400 italic">
        Tidak ada konten cheat sheet yang tersedia.
      </div>
    );
  }

  return (
    <div className="prose prose-slate max-w-none space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pb-3 border-b border-slate-200 mt-2 mb-4 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-3 pb-1 border-b border-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block"></span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-3 leading-relaxed text-slate-700">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5 mb-4 text-slate-700">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1.5 mb-4 text-slate-700">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/50 p-4 rounded-r-xl my-4 text-slate-800 italic">
              {children}
            </blockquote>
          ),
          code: ({ inline, children }) =>
            inline ? (
              <code className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-xs sm:text-sm font-semibold">
                {children}
              </code>
            ) : (
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-xs sm:text-sm font-mono my-3 shadow-inner">
                <code>{children}</code>
              </pre>
            ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 shadow-2xs">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-50 text-slate-700 font-semibold">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-slate-50/80 transition">{children}</tr>,
          th: ({ children }) => <th className="px-4 py-3 font-semibold text-slate-900">{children}</th>,
          td: ({ children }) => <td className="px-4 py-3 text-slate-700">{children}</td>,
          strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

