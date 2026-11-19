'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { trackChatFailed, trackChatMessageSent } from '@/lib/analytics';

const navData = {
  brand: { title: 'Letnull19A Portfolio', href: '/' },
  items: [],
  action: { label: 'Contact me', href: '/#contact' },
};

const defaultSuggestions = [
  'Which projects required both frontend and backend ownership? >>',
  'How do clients see risk before delivery slips? >>',
];

const THINKING_DELAY_MS = 900;
const STREAM_TIMEOUT_MS = 30000;
const LIMIT_REMAINING = 4;
const LIMIT_RESET_SECONDS = 12 * 3600 + 34 * 60 + 4;

type ChatAttachment = {
  kind: 'article' | 'case';
  slug: string;
  title: string;
  description: string;
  subtitle?: string;
  category?: string;
  role?: string;
  href: string;
  logo?: string;
};

type ChatMsg = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  attachments: ChatAttachment[];
  at: string;
};

function formatClock(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return `${h}:${mm}:${ss}`;
}

function nowTime(): string {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
}

let msgSeq = 0;
function nextId(): string {
  msgSeq += 1;
  return `msg-${Date.now().toString(36)}-${msgSeq}`;
}

const WritingDots: React.FC = () => (
  <span className="inline-flex items-center gap-2" aria-hidden>
    <span className="chat-dot block w-2.5 h-2.5 rounded-full bg-lime" />
    <span className="chat-dot block w-2.5 h-2.5 rounded-full bg-lime" />
    <span className="chat-dot block w-2.5 h-2.5 rounded-full bg-lime" />
  </span>
);

const AttachmentCard: React.FC<{
  data: ChatAttachment;
  linkedinIconSrc: string;
  telegramIconSrc: string;
}> = ({ data, linkedinIconSrc, telegramIconSrc }) => (
  <div className="border border-lime/40 bg-black/60 p-3 w-full max-w-65">
    <div className="border border-lime/40 h-28 flex items-center justify-center overflow-hidden">
      {data.logo ? (
        <Image
          src={data.logo}
          alt=""
          aria-hidden
          width={240}
          height={112}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-cover pointer-events-none"
        />
      ) : null}
    </div>
    <div className="mt-2 text-sm font-bold uppercase text-lime-light leading-tight">
      {data.title}
    </div>
    <div className="mt-2 flex items-center gap-1.5">
      <a
        href={data.href}
        aria-label="Open linked article or case on LinkedIn"
        className="w-8 h-8 shrink-0 border border-lime/60 flex items-center justify-center hover:bg-lime/10 transition-colors"
      >
        <span
          aria-hidden
          style={{ mask: `url(${linkedinIconSrc}) no-repeat center / contain` }}
          className="block w-4 h-4 bg-lime"
        />
      </a>
      <a
        href={data.href}
        aria-label="Open linked article or case in Telegram"
        className="w-8 h-8 shrink-0 border border-lime/60 flex items-center justify-center hover:bg-lime/10 transition-colors"
      >
        <span
          aria-hidden
          style={{ mask: `url(${telegramIconSrc}) no-repeat center / contain` }}
          className="block w-4 h-4 bg-lime"
        />
      </a>
      <Link
        href={data.href}
        className="h-8 px-4 inline-flex items-center text-xs font-bold uppercase tracking-wider bg-lime text-black hover:bg-lime-light transition-colors"
      >
        Read here
      </Link>
    </div>
  </div>
);

function ChatPageInner() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [query, setQuery] = useState('');
  const [thinking, setThinking] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resetIn, setResetIn] = useState(LIMIT_RESET_SECONDS);
  const inputRef = useRef<HTMLInputElement>(null);
  // Синхронный guard от дабл-сенда. Трогается только из send/runStream,
  // в эффектах не используется — строго под линтер react-hooks/refs.
  const busyRef = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  // Какой ?q= уже отправлен. Читается и пишется только внутри ?q=-эффекта.
  const sentQRef = useRef<string | null>(null);

  const isActive = msgs.length > 0 || thinking;
  const isStreaming = streamingId !== null;

  // Плавное появление страницы (переход с AI hero)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Стартовый вопрос из ?q= (переход с AI hero / ask-секции).
  // Без cleanup: в dev StrictMode второй прогон видит sentQRef и пропускает,
  // таймер первого прогона доживает и отправляет ровно один раз.
  useEffect(() => {
    const q = searchParams.get('q')?.trim();
    if (!q || sentQRef.current === q) return;
    sentQRef.current = q;
    // Убираем вопрос из URL, чтобы перезагрузка не отправляла его заново
    router.replace('/chat', { scroll: false });
    send(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Скролл страницы вниз, если читатель уже внизу треда
  useEffect(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >
      document.documentElement.scrollHeight - 300;
    if (nearBottom) {
      window.scrollTo({ top: document.documentElement.scrollHeight });
    }
  }, [msgs, streamingId, thinking]);

  // Заглушка лимита до появления серверных данных
  useEffect(() => {
    const t = setInterval(() => {
      setResetIn((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const runStream = async (assistantId: string) => {
    const ctrl = new AbortController();
    const guard = window.setTimeout(() => ctrl.abort(), STREAM_TIMEOUT_MS);
    setStreamingId(assistantId);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) throw new Error(`Chat ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finished = false;
      while (!finished) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let boundary: number;
        while ((boundary = buffer.indexOf('\n\n')) !== -1) {
          const event = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          const dataLines = event
            .split('\n')
            .filter((l) => l.startsWith('data: '))
            .map((l) => l.slice(6).trim());
          if (dataLines.length === 0) continue;
          const dataStr = dataLines.join('\n');
          if (!dataStr || dataStr === '[DONE]') {
            if (dataStr === '[DONE]') finished = true;
            continue;
          }
          try {
            const chunk = JSON.parse(dataStr) as {
              type?: string;
              delta?: string;
              data?: ChatAttachment;
            };
            if (chunk.type === 'text-delta' && typeof chunk.delta === 'string') {
              const delta = chunk.delta;
              setMsgs((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, text: m.text + delta } : m))
              );
            } else if (chunk.type === 'data-attachment' && chunk.data) {
              const att = chunk.data;
              setMsgs((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, attachments: [...m.attachments, att] } : m
                )
              );
            } else if (chunk.type === 'text-end') {
              finished = true;
            }
          } catch {
            // ignore malformed chunk
          }
        }
      }
      setFailed(false);
    } catch {
      // chat_failed — сбой стрима/таймаут: сигнал о проблемах чат-бэкенда.
      trackChatFailed();
      if (!ctrl.signal.aborted) setFailed(true);
      else setFailed(true);
    } finally {
      window.clearTimeout(guard);
      setStreamingId(null);
    }
  };

  function send(text: string) {
    const clean = text.trim();
    if (!clean || busyRef.current) return;
    busyRef.current = true;
    // chat_message_sent — конверсия: сообщение ушло ассистенту.
    // Текст сообщения НЕ трекаем (приватность) — только факт отправки.
    trackChatMessageSent();
    setFailed(false);
    setQuery('');
    setMsgs((prev) => [
      ...prev,
      { id: nextId(), role: 'user', text: clean, attachments: [], at: nowTime() },
    ]);
    setThinking(true);
    window.setTimeout(() => {
      const assistantId = nextId();
      setMsgs((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', text: '', attachments: [], at: nowTime() },
      ]);
      setThinking(false);
      void runStream(assistantId).finally(() => {
        busyRef.current = false;
      });
    }, THINKING_DELAY_MS);
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    send(query);
  };

  return (
    <div
      className="min-h-svh bg-background text-foreground font-mono flex flex-col"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(154, 208, 0, 0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(154, 208, 0, 0.06) 1px, transparent 1px)
        `,
        backgroundSize: '16px 16px',
      }}
    >
      <Header {...navData} />
      <main
        id="main-content"
        className={`flex-1 flex flex-col transition-opacity duration-300 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {!isActive && (
          <div className="mx-auto w-full max-w-3xl px-6 py-14 flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase text-lime-light leading-none">
              AI ASSISTANT
            </h1>
            <p className="mt-4 text-sm sm:text-base text-lime-light max-w-xl">
              Ask about product fit, engineering decisions, or the stack behind a specific case.
            </p>
            <div className="mt-6 w-full flex flex-col gap-2 text-left text-xs sm:text-sm text-lime">
              {defaultSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => send(item.replace(/\s*>>$/, ''))}
                  className="text-left bg-transparent border-none p-0 cursor-pointer text-lime hover:text-lime-light hover:underline tracking-wide transition-colors font-mono"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {isActive && (
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8">
            <div className="flex flex-col gap-8">
              {msgs.map((m) => {
                const isUser = m.role === 'user';
                const isThisStreaming = isStreaming && streamingId === m.id;
                return (
                  <div key={m.id} className="grid grid-cols-[132px_1fr] sm:grid-cols-[180px_1fr] gap-3 sm:gap-4">
                    {/* Мета */}
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-row items-center gap-2 sm:gap-3">
                        <Image
                          src={isUser ? '/icons/chat_user.svg' : '/icons/chat_ai.svg'}
                          alt={isUser ? 'Client' : 'AI agent'}
                          width={136}
                          height={90}
                          loading="lazy"
                          draggable={false}
                          className="w-10 sm:w-12 h-auto shrink-0 pointer-events-none"
                        />
                        <div className="flex flex-col gap-0.5">
                          <div
                            className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                              isUser ? 'text-lime' : 'text-lime-light'
                            }`}
                          >
                            {isUser ? 'Client' : 'AI agent'}
                          </div>
                          <div
                            className={`text-[10px] sm:text-xs ${
                              isUser ? 'text-lime/70' : 'text-lime-light'
                            }`}
                          >
                            {isThisStreaming ? 'WRITING' : m.at}
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-neutral-600">
                        {isThisStreaming ? null : 'Msg rcvd ✓✓'}
                      </div>
                    </div>
                    {/* Тело */}
                    <div
                      className={`min-w-0 text-sm sm:text-base leading-relaxed ${
                        isUser ? 'text-lime' : 'text-lime-light'
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {m.text}
                        {isThisStreaming && !m.text && (
                          <span className="inline-flex align-middle">
                            <WritingDots />
                          </span>
                        )}
                      </div>
                      {m.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {m.attachments.map((a, i) => (
                            <AttachmentCard
                              key={`${m.id}-att-${i}`}
                              data={a}
                              linkedinIconSrc="/icons/linkedin.svg"
                              telegramIconSrc="/icons/telegram.svg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {thinking && (
                <div className="grid grid-cols-[132px_1fr] sm:grid-cols-[180px_1fr] gap-3 sm:gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-2 sm:gap-3">
                      <Image
                        src="/icons/chat_ai.svg"
                        alt="AI agent"
                        width={136}
                        height={90}
                        loading="lazy"
                        draggable={false}
                        className="w-10 sm:w-12 h-auto shrink-0 pointer-events-none"
                      />
                      <div className="flex flex-col gap-0.5">
                        <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-lime-light">
                          AI agent
                        </div>
                        <div className="text-[10px] sm:text-xs text-lime-light">WRITING</div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 text-sm sm:text-base leading-relaxed">
                    <WritingDots />
                  </div>
                </div>
              )}
              {failed && (
                <div className="grid grid-cols-[132px_1fr] sm:grid-cols-[180px_1fr] gap-3 sm:gap-4">
                  <div className="flex flex-row items-center gap-2 sm:gap-3">
                    <Image
                      src="/icons/chat_error.svg"
                      alt="Error"
                      width={64}
                      height={64}
                      loading="lazy"
                      draggable={false}
                      className="w-8 h-auto shrink-0 pointer-events-none"
                    />
                    <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-lime-light">
                      AI agent
                    </div>
                  </div>
                  <div className="text-sm sm:text-base text-lime">
                    The answer could not be retrieved. Please try again.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Ввод + дисклеймер: плавают у низа */}
      <div className="sticky bottom-0 z-20 mt-auto w-full bg-gradient-to-t from-background via-background/85 to-transparent">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 pt-4 pb-4">
          {isActive && (
            <p className="mx-auto mb-2 w-fit bg-neutral-800 px-2 py-1 text-center text-[11px] sm:text-xs text-neutral-600">
              {LIMIT_REMAINING} messages remaining. Your limit will reset in{' '}
              {formatClock(resetIn)}.
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <label className="sr-only" htmlFor="chat-query">
                What would you like to know?
              </label>
              <input
                ref={inputRef}
                type="text"
                id="chat-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What would you like to know?"
                disabled={isStreaming || thinking}
                className="w-full h-11 sm:h-13 bg-black border border-neutral-600 pl-4 pr-14 text-sm sm:text-lg text-lime-light placeholder:text-neutral-600 outline-none focus:border-lime focus:ring-1 focus:ring-lime tracking-wide disabled:opacity-60"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <button
                  type="submit"
                  aria-label="Ask"
                  title="Ask"
                  disabled={isStreaming || thinking || !query.trim()}
                  className="p-1 bg-transparent border-none cursor-pointer transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
                >
                  <Image
                    src="/icons/enter_question.svg"
                    alt=""
                    aria-hidden
                    width={48}
                    height={48}
                    draggable={false}
                    className="block w-6 h-6 pointer-events-none"
                  />
                </button>
              </div>
            </div>
          </form>
        </div>
        <p className="shrink-0 border-t border-border bg-black px-6 py-2 text-center text-[10px] leading-snug text-neutral-600">
          AI can make mistakes. Please verify important information. Not an offer or legally
          binding agreement.
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-svh bg-background text-foreground font-mono flex items-center justify-center text-sm">
          Loading chat…
        </div>
      }
    >
      <ChatPageInner />
    </Suspense>
  );
}
