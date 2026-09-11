import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { MessageEvent } from '@nestjs/common';

const LOREM_WORDS = [
  'Lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'Ut',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'ut',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'Duis',
  'aute',
  'irure',
  'dolor',
  'in',
  'reprehenderit',
  'in',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'dolore',
  'eu',
  'fugiat',
  'nulla',
  'pariatur',
  'Excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'in',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
  'curabitur',
  'pretium',
  'tincidunt',
  'lacus',
  'nulla',
  'gravida',
  'orci',
  'a',
  'odio',
  'nullam',
  'varius',
  'turpis',
  'et',
  'commodo',
  'pharetra',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLoremWords(count: number): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)]);
  }
  // Capitalize first word
  if (words.length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  return words;
}

function chunkWords(words: string[], chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    const slice = words.slice(i, i + chunkSize).join(' ') + ' ';
    chunks.push(slice);
  }
  return chunks;
}

@Injectable()
export class AiChatService {
  /**
   * Generate full Lorem ipsum text of arbitrary length (stateless, no storage).
   */
  generateFullText(wordCount?: number): string {
    const count = wordCount ?? randomInt(40, 120);
    const words = generateLoremWords(count);
    // Add simple sentence punctuation
    let text = words.join(' ');
    if (!text.endsWith('.')) text += '.';
    return text;
  }

  /**
   * Create SSE Observable that streams Lorem ipsum tokens with random delays.
   * Each emitted MessageEvent.data is JSON-stringified { token, done? }.
   * Final event has done:true and no token. Stateless — длина рандомная 40-120 слов.
   */
  streamLoremIpsum(options?: { signal?: AbortSignal }): Observable<MessageEvent> {
    const wordCount = randomInt(40, 120);
    const words = generateLoremWords(wordCount);
    const chunkSize = randomInt(2, 6);
    const chunks = chunkWords(words, chunkSize);

    return new Observable<MessageEvent>((subscriber) => {
      let index = 0;
      let timer: NodeJS.Timeout | null = null;

      const scheduleNext = () => {
        if (options?.signal?.aborted) {
          if (timer) clearTimeout(timer);
          subscriber.complete();
          return;
        }

        if (index >= chunks.length) {
          // Final event
          subscriber.next({
            data: JSON.stringify({ token: '', done: true }),
          } as MessageEvent);
          subscriber.complete();
          return;
        }

        const token = chunks[index++];
        subscriber.next({
          data: JSON.stringify({ token, done: false }),
          // optional: type, id, retry
        } as MessageEvent);

        const delay = randomInt(30, 90);
        timer = setTimeout(scheduleNext, delay);
      };

      // Start with small initial delay to allow headers commit
      timer = setTimeout(scheduleNext, 25);

      // Handle abort signal
      const onAbort = () => {
        if (timer) clearTimeout(timer);
        subscriber.complete();
      };
      options?.signal?.addEventListener('abort', onAbort, { once: true });

      return () => {
        if (timer) clearTimeout(timer);
        options?.signal?.removeEventListener('abort', onAbort);
      };
    });
  }
}
