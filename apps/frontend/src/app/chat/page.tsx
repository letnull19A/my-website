'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function ChatPage() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const isStreaming = status === 'streaming' || status === 'submitted';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = input.trim();
    if (!value || isStreaming) return;
    sendMessage({ text: value });
    setInput('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col">
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-sm font-bold tracking-widest">AI-CHAT // MOCK SSE TEST</h1>
        <a
          href="/"
          className="text-xs border border-border px-2 py-1 hover:bg-muted transition-colors"
        >
          ← Home
        </a>
      </header>

      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto p-4 gap-4">
        <div className="text-xs text-muted-foreground border border-dashed border-border p-2">
          <div>Backend: GET /ai-chat (SSE) → Next /api/chat → useChat (ai-sdk). POST /ai-chat также доступен.</div>
          <div>Длина ответа — рандом 40-120 слов Lorem ipsum. Stateless, без БД.</div>
        </div>

        <div className="flex-1 border border-border bg-card min-h-[50vh] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-xs text-muted-foreground">Сообщений пока нет — напишите что-нибудь.</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className="border border-border p-2 text-sm">
                <div className="text-xs opacity-60 mb-1">
                  {m.role === 'user' ? 'USER' : 'ASSISTANT'} // {m.id.slice(0, 8)}
                </div>
                <div className="whitespace-pre-wrap break-words">
                  {m.parts.map((part, i) => {
                    if (part.type === 'text') {
                      return <span key={i}>{part.text}</span>;
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="text-xs text-lime animate-pulse">● streaming...</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-border p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1 bg-background border border-input px-3 py-2 text-sm outline-none focus:border-lime placeholder:text-muted-foreground"
              disabled={isStreaming}
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="px-4 py-2 text-sm font-bold bg-lime text-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-light transition-colors"
            >
              Send
            </button>
          </form>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>Статус: {status}</div>
          <div>
            Прямой тест SSE (без ai-sdk):{' '}
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/ai-chat`}
              target="_blank"
              className="underline hover:text-lime"
            >
              GET /ai-chat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
