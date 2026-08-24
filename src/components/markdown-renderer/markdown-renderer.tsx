'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  return (
    <div className={`text-lime-light font-mono leading-relaxed space-y-6 ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-lime-light mt-8 mb-4 border-b border-border pb-2 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase text-lime-light mt-8 mb-3 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-bold uppercase text-lime-light mt-6 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm sm:text-base md:text-lg text-lime-light/90 leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-2 pl-2 sm:pl-4 mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 pl-2 sm:pl-4 mb-4 text-lime">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm sm:text-base md:text-lg text-lime-light/90 flex items-start gap-2">
              <span className="text-lime select-none">&gt;</span>
              <span>{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-lime pl-4 py-2 my-4 bg-card/60 text-lime-light italic text-sm sm:text-base">
              {children}
            </blockquote>
          ),
          code: ({ inline, className: codeClass, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="bg-card px-1.5 py-0.5 border border-lime/40 text-lime text-xs sm:text-sm font-bold"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="relative my-4 border border-border bg-card p-4 overflow-x-auto text-xs sm:text-sm font-mono text-lime-light">
                <pre tabIndex={0} className="focus:outline-none">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime underline hover:opacity-80 transition-opacity"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-border my-8" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};