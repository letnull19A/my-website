import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { MessageEvent } from '@nestjs/common';
import type { AiChatAttachment } from '@my-website/schemas';
import { DbService } from '../db/db.service';

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
  constructor(private readonly db: DbService) {}

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
   * Randomly pick an article or case attachment (or null).
   * ~50% no attachment, ~25% article, ~25% case. Uses real db data if available.
   */
  generateRandomAttachment(): AiChatAttachment | null {
    const roll = Math.random();
    if (roll < 0.5) return null;

    const isArticle = Math.random() < 0.5;
    if (isArticle) {
      const articles = this.db.findAll();
      if (articles.length === 0) return null;
      const a = articles[randomInt(0, articles.length - 1)];
      return {
        kind: 'article' as const,
        slug: a.slug,
        title: a.title,
        description: a.description,
        subtitle: a.subtitle,
        category: a.category,
        href: `/articles/${a.slug}`,
      };
    } else {
      const cases = this.db.findAllCases();
      if (cases.length === 0) return null;
      const c = cases[randomInt(0, cases.length - 1)];
      return {
        kind: 'case' as const,
        slug: c.slug,
        title: c.title,
        description: c.description,
        role: c.role,
        href: `/cases/${c.slug}`,
        logo: c.logo,
      };
    }
  }

  /**
   * Create SSE Observable that streams Lorem ipsum tokens with random delays.
   * Each emitted MessageEvent.data is JSON-stringified { token, attachment?, done? }.
   * Final event has done:true and no token. Randomly (50%) attaches article/case card.
   * Stateless — длина рандомная 40-120 слов.
   */
  streamLoremIpsum(options?: { signal?: AbortSignal }): Observable<MessageEvent> {
    const wordCount = randomInt(40, 120);
    const attachment = this.generateRandomAttachment();
    const words = generateLoremWords(wordCount);
    const chunkSize = randomInt(2, 6);
    const chunks = chunkWords(words, chunkSize);

    return new Observable<MessageEvent>((subscriber) => {
      let index = 0;
      let timer: NodeJS.Timeout | null = null;
      let attachmentSent = false;

      const scheduleNext = () => {
        if (options?.signal?.aborted) {
          if (timer) clearTimeout(timer);
          subscriber.complete();
          return;
        }

        if (index >= chunks.length) {
          if (attachment && !attachmentSent) {
            attachmentSent = true;
            subscriber.next({
              data: JSON.stringify({ attachment, done: false }),
            } as MessageEvent);
            timer = setTimeout(scheduleNext, 30);
            return;
          }
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
