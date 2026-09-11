import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export const dynamic = 'force-dynamic';

function getBackendUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL || '').trim();
  const base = raw || 'http://localhost:4000';
  return base.replace(/\/$/, '');
}

export async function POST(req: Request) {
  // messages are not used for mock, but parse to keep protocol valid
  try {
    await req.json();
  } catch {
    // ignore parse errors
  }

  const backendUrl = getBackendUrl();

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const textId = 'ai-text';
      writer.write({ type: 'text-start', id: textId });

      try {
        // Proxy to mock SSE backend GET /ai-chat (random 40-120 words)
        const res = await fetch(`${backendUrl}/ai-chat`, {
          headers: { Accept: 'text/event-stream' },
          // no cache
          cache: 'no-store',
        });

        if (!res.ok || !res.body) {
          throw new Error(`Backend ${res.status} ${res.statusText}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Split by double newline (SSE event boundary)
          let boundary: number;
          while ((boundary = buffer.indexOf('\n\n')) !== -1) {
            const event = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);

            // Extract data: lines
            const dataLines = event
              .split('\n')
              .filter((l) => l.startsWith('data: '))
              .map((l) => l.slice(6).trim());

            if (dataLines.length === 0) continue;

            const dataStr = dataLines.join('\n');
            if (!dataStr) continue;

            try {
              const parsed: { token?: string; done?: boolean } = JSON.parse(dataStr);
              if (parsed.done) {
                // end
                break;
              }
              if (parsed.token) {
                writer.write({
                  type: 'text-delta',
                  id: textId,
                  delta: parsed.token,
                });
              }
            } catch {
              // if not JSON, treat raw as token
              writer.write({
                type: 'text-delta',
                id: textId,
                delta: dataStr,
              });
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        writer.write({
          type: 'text-delta',
          id: textId,
          delta: `[backend error: ${msg}]`,
        });
      }

      writer.write({ type: 'text-end', id: textId });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
