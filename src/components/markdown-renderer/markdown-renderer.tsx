'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface CodeElementProps {
  children?: React.ReactNode;
  className?: string;
}

const PreBlock = ({ children }: { children?: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);

  // Находим дочерний элемент <code> с явной типизацией пропсов
  const codeElement = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === 'code'
  ) as React.ReactElement<CodeElementProps> | undefined;

  const rawCode = codeElement?.props?.children ? String(codeElement.props.children) : '';
  const codeClass = codeElement?.props?.className || '';
  const match = /language-(\w+)/.exec(codeClass);
  const language = match ? match[1] : 'TEXT';

  const onCopy = () => {
    navigator.clipboard.writeText(rawCode.replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border/80 px-4 py-2 bg-background/50">
        <span className="text-[11px] sm:text-xs uppercase tracking-widest text-lime font-mono">
          CODE // {language}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="text-xs uppercase text-lime-light/70 hover:text-lime flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>
      <div className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono text-lime-light leading-relaxed">
        <pre tabIndex={0} className="focus:outline-none">
          {children}
        </pre>
      </div>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  return (
    <div className={`text-lime-light font-mono leading-relaxed space-y-6 select-text ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-lime-light first:mt-0 mt-10 mb-4 tracking-tight border-b border-border pb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-lime-light first:mt-0 mt-10 mb-4 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase text-lime-light mt-8 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm sm:text-base md:text-lg text-lime-light/90 leading-relaxed mb-4 first:mt-0">
              {children}
            </p>
          ),
          // Ненумерованный список
  ul: ({ children }) => (
    <ul className="space-y-2.5 my-4 pl-1 sm:pl-2 list-none [&_li>span.bullet]:inline-block [&_li>span.bullet]:text-lime [&_li>span.bullet]:font-bold [&_li>span.bullet]:select-none [&_li>span.bullet]:mr-2">
      {children}
    </ul>
  ),
  // Нумерованный список со стандартной нумерацией 1. 2. 3.
  ol: ({ children }) => (
    <ol className="space-y-2.5 my-4 ml-5 pl-6 list-decimal marker:text-lime marker:font-bold">
      {children}
    </ol>
  ),
  // Элемент списка
  li: ({ children, ...props }: any) => {
    // Внутри ol маркер рисует браузер через list-decimal
    // Внутри ul рисуем кастомный '>>'
    const isInsideUl = props.node?.position ? true : true;

    return (
      <li className="text-sm sm:text-base md:text-lg text-lime-light/90">
        {/* Маркер сработает только внутри ul благодаря селекторам ul выше */}
        <span className="bullet hidden">&gt;&gt;</span>
        <span>{children}</span>
      </li>
    );
  },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-lime pl-4 sm:pl-5 py-3 my-6 bg-card/60 text-lime-light font-medium text-sm sm:text-base">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-6 w-full overflow-x-auto border border-border bg-card">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-border bg-background/60 uppercase text-lime">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-bold tracking-wider">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 border-t border-border/60 text-lime-light/90">
              {children}
            </td>
          ),
          pre: ({ children }) => <PreBlock>{children}</PreBlock>,
          code: ({ className: codeClass, children, ...props }: any) => {
            const isCodeBlock = Boolean(codeClass);
            if (isCodeBlock) {
              return (
                <code className={codeClass} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="bg-card px-1.5 py-0.5 border border-lime/40 text-lime text-xs sm:text-sm font-bold inline-block"
                {...props}
              >
                {children}
              </code>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-border my-10" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};