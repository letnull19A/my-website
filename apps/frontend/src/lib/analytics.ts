// Каталог аналитических событий портфолио (GTM/GA4).
//
// Механика: sendGTMEvent() пушит событие в window.dataLayer — тот же канал,
// через который GtmGate грузит GTM. Если согласия нет и GTM не загружен,
// события копятся в локальном массиве и никуда не уходят — отдельный гейт не нужен.
//
// Приватность: события НЕ содержат персональных данных — только факт действия,
// канал и slug контента. Текст сообщений чата, email и текст формы не передаются.
//
// Волшебство GA4-события `event` — название в отчётах; параметры (channel,
// content_id и т.д.) видны в exploration. content_id стоит зарегистрировать
// в GA4 как кастомный dimension, чтобы группировать по статье/кейсу.
//
// KPI-события (пометить в GA4 как «ключевые»): contact_form_submit, chat_message_sent.

import { sendGTMEvent } from '@next/third-parties/google';

// --- Конверсии (KPI) ---

/**
 * contact_form_start — посетитель начал заполнять форму (первое касание поля).
 * Отвечает: сколько людей намеревались написать, но не отправили —
 * главный «провал» между намерением и конверсией.
 */
export const trackContactFormStart = (): void => {
  sendGTMEvent({ event: 'contact_form_start' });
};

/**
 * contact_form_submit — валидная форма отправлена (нативная валидация пройдена).
 * Отвечает: главный KPI портфолио — квалифицированный контакт. Содержимое формы не передаётся.
 */
export const trackContactFormSubmit = (): void => {
  sendGTMEvent({ event: 'contact_form_submit' });
};

/**
 * contact_form_success — бэкенд подтвердил приём (mutation.isSuccess).
 * Отвечает: конверсия реально доставлена, а не только «нажали кнопку».
 */
export const trackContactFormSuccess = (): void => {
  sendGTMEvent({ event: 'contact_form_success' });
};

/**
 * contact_form_error — бэкенд отклонил отправку или упал (mutation.isError).
 * Отвечает: узнаём о сломанной форме раньше посетителей.
 */
export const trackContactFormError = (): void => {
  sendGTMEvent({ event: 'contact_form_error' });
};

// --- Прямые контакты (минуя форму) ---

/**
 * contact_channel_click — переход в мессенджер/соцсеть/почту из блоков контактов
 * (шапка, подвал, email-ссылка в секции contact). channel: github/linkedin/telegram/whatsapp/email.
 * Отвечает: каким каналом связи люди пользуются охотнее, минуя форму.
 */
export const trackContactChannelClick = (channel: string): void => {
  sendGTMEvent({ event: 'contact_channel_click', channel });
};

// --- Контент ---

/**
 * share_click — репост статьи в LinkedIn/Telegram (карточка или детальная страница).
 * Отвечает: каким контентом делятся — прокси за его ценность.
 */
export const trackShareClick = (
  channel: 'linkedin' | 'telegram',
  contentId?: string
): void => {
  sendGTMEvent({ event: 'share_click', channel, content_id: contentId });
};

/**
 * article_copy_link — скопирована ссылка на статью (кнопка «COPY LINK»).
 * Отвечает: намерение поделиться без перехода в соцсеть.
 */
export const trackArticleCopyLink = (contentId?: string): void => {
  sendGTMEvent({ event: 'article_copy_link', content_id: contentId });
};

/**
 * article_engaged — статья реально прочитана: 30 сек на странице ИЛИ скролл >50%,
 * что бы ни случилось раньше (событие одного выстрела на просмотр).
 * Отвечает: что читают, а не только открывают; фильтрует «заходил и вышел».
 */
export const trackArticleEngaged = (contentId: string): void => {
  sendGTMEvent({ event: 'article_engaged', content_id: contentId });
};

/**
 * case_action_click — нажата кнопка действия в карточке кейса.
 * Отвечает: какие кейсы ведут к действию; emphasis показывает работу CTA-иерархии.
 */
export const trackCaseActionClick = (params: {
  label: string;
  emphasis?: string;
  contentId?: string;
}): void => {
  sendGTMEvent({
    event: 'case_action_click',
    action_label: params.label,
    emphasis: params.emphasis,
    content_id: params.contentId,
  });
};

// --- AI-чат ---

/**
 * chat_message_sent — отправлено сообщение AI-ассистенту, включая авто-вопрос из ?q= (конверсия).
 * Отвечает: «продуктовая» фича сайта используется. Текст сообщения НЕ передаётся.
 */
export const trackChatMessageSent = (): void => {
  sendGTMEvent({ event: 'chat_message_sent' });
};

/**
 * chat_failed — стрим ответа упал или истёк таймаут.
 * Отвечает: сигнал о сбоях чата/бэкенда, а не о поведении посетителя.
 */
export const trackChatFailed = (): void => {
  sendGTMEvent({ event: 'chat_failed' });
};
