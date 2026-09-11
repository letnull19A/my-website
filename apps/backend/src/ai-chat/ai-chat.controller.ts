import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Sse,
} from '@nestjs/common';
import { SseSignal } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { MessageEvent } from '@nestjs/common';
import { AiChatInputSchema } from '@my-website/schemas';
import { AiChatService } from './ai-chat.service';
import { randomUUID } from 'crypto';

@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  /**
   * POST /ai-chat — отправка и приём сообщения от пользователя.
   * Stateless mock: валидирует { message }, возвращает echo + сгенерированный Lorem ipsum ответ.
   */
  @Post()
  async create(@Body() body: unknown) {
    const parsed = AiChatInputSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        issues: parsed.error.issues,
      });
    }

    const reply = this.aiChatService.generateFullText();

    return {
      id: randomUUID(),
      role: 'assistant' as const,
      content: reply,
      echo: parsed.data.message,
    };
  }

  /**
   * GET /ai-chat — стримминг сообщений от ИИ агента по SSE.
   * Возвращает Observable<MessageEvent>, каждый chunk — data: JSON.stringify({ token, done }).
   * Произвольная длина (40-120 слов), stateless, без хранения, рандом на каждый запрос.
   */
  @Sse()
  stream(@SseSignal() signal?: AbortSignal): Observable<MessageEvent> {
    return this.aiChatService.streamLoremIpsum({ signal });
  }
}
