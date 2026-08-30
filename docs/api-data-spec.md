# API Data Spec — Articles & Cases

> **DEPRECATED** — контракт теперь в коде: `packages/schemas` (zod-схемы + `z.infer` типы) и `packages/api` (tRPC `AppRouter`). Этот документ — исторический референс для `data/db.json`.

Данные приходят с бэка в JSON. Фронт рендерит карточки (листинги) и детальные страницы.

Все slug — только `a-z`, `0-9`, `-`. Уникальны глобально.

---

## Article

```
GET /articles
GET /articles/{slug}
```

### TypeScript

```ts
interface Article {
  /** Уникальный slug, часть URL: /articles/{slug} */
  slug: string;
  /** Заголовок карточки */
  title: string;
  /** Короткое описание для карточки (2–3 строки) */
  description: string;
  /** Заголовок детальной страницы (H1) */
  subtitle: string;
  /** ISO 8601: "YYYY-MM-DD" */
  date: string;
  /** Человекочитаемое время чтения: "4 MIN READ" */
  readTime: string;
  /** Категория, через "//": "BACKEND // ARCHITECTURE" */
  category: string;
  /** Markdown-контент статьи */
  content: string;
  /** Обложка. Путь или абсолютный URL */
  coverImage: string | null;
  /** Ссылки для шаринга (если нет — скрыть блок) */
  linkedinHref?: string | null;
  telegramHref?: string | null;
}
```

### Обязательность

| Поле          | Карточка | Детальная страница |
| ------------- | -------- | ------------------ |
| `slug`        | +        | +                  |
| `title`       | +        | +                  |
| `description` | +        | –                  |
| `subtitle`    | –        | +                  |
| `date`        | +        | +                  |
| `readTime`    | +        | +                  |
| `category`    | +        | +                  |
| `content`     | –        | +                  |
| `coverImage`  | опц.     | опц.               |
| social links  | опц.     | опц.               |

Если `coverImage` = `null` — на месте картинки рендерится placeholder, карточка не ломается.

---

## Case

```
GET /cases
GET /cases/{slug}
```

### TypeScript

```ts
type CaseActionVariant = 'default' | 'lime-light' | 'outline' | 'secondary' | 'ghost';

interface CaseAction {
  id: string;
  label: string;
  href: string;
  variant?: CaseActionVariant;
}

interface CaseMeta {
  role: string;
  duration: string;
  status: string;
  stack: string;
}

interface Case {
  /** Уникальный slug, часть URL: /cases/{slug} */
  slug: string;
  /** Короткое имя кейса (в карточке и лого) */
  title: string;
  /** Роль, однострочная: "FULLSTACK" */
  role: string;
  /** Описание в карточке (2–3 строки) */
  description: string;
  /** Заголовок детальной страницы (H1) */
  fullTitle: string;
  /** Подзаголовок на детальной странице */
  subtitle: string;
  /** Кнопки действий в карточке */
  actions: CaseAction[];
  /** Мета-параметры для блока ABOUT на детальной странице */
  meta: CaseMeta;
  /** Текст блока PROBLEM */
  problem: string;
  /** Текст блока SOLUTION */
  solution: string;
  /** Текст блока RESULTS */
  results: string;
  /** Логотип в карточке — путь или абсолютный URL */
  logo: string;
  /** Превью-изображение на детальной странице (опционально) */
  previewImage?: string | null;
  /** Подпись под превью: "FIGMA/DEV-001 // ..." */
  previewCaption?: string | null;
}
```

### Обязательность

| Поле             | Карточка | Детальная страница |
| ---------------- | -------- | ------------------ |
| `slug`           | +        | +                  |
| `title`          | +        | +                  |
| `role`           | +        | –                  |
| `description`    | +        | –                  |
| `fullTitle`      | –        | +                  |
| `subtitle`       | –        | +                  |
| `actions`        | +        | –                  |
| `meta`           | –        | +                  |
| `problem`        | –        | +                  |
| `solution`       | –        | +                  |
| `results`        | –        | +                  |
| `logo`           | +        | –                  |
| `previewImage`   | –        | опц.               |
| `previewCaption` | –        | опц.               |

---

## Правила для изображений

- Поддерживаются: путь внутри статики фронта (`/images/...`) или абсолютный URL.
- Обложка статьи и превью кейса: широкие изображения, соотношение ~16:10 (рендерятся в `object-cover`).
- Лого кейса: изображение на прозрачном фоне (рендерится в `object-contain`).

## Правила для `content` (Markdown)

Поддерживается GFM:

### Поддерживаемые теги

| Тег                | Markdown-синтаксис                | Рендер                    |
| ------------------ | --------------------------------- | ------------------------- |
| Заголовок H1       | `# текст`                         | Большой, uppercase, с бордером снизу |
| Заголовок H2       | `## текст`                        | Средний, uppercase        |
| Заголовок H3       | `### текст`                       | Меньше H2, uppercase      |
| Абзац              | обычный текст                     | Текст                     |
| Bold               | `**text**`                        | Жирный                    |
| Italic             | `*text*`                          | Курсив                    |
| Ссылка             | `[text](url)`                     | Ссылка                    |
| Несорт. список     | `* item` или `- item`             | Маркер `>>`               |
| Сорт. список       | `1. item`                         | Нумерованный (1. 2. 3.)   |
| Цитата             | `> text`                          | Блок с левой lime-границей |
| Инлайн-код         | `` `code` ``                      | Подсвеченный inline-code  |
| Блок кода          | ```` ```lang ````                 | Панель с заголовком и кнопкой COPY |
| Таблица            | GFM-таблица                       | Таблица                   |
| Разделитель        | `---`                             | Горизонтальная линия      |

### Пример `content`

```md
# Main Section Heading (H1)

This is a standard text paragraph (`p`) illustrating text rhythm. It demonstrates
inline elements like **bold emphasis**, *italicized terms*, and an external link
to [Next.js Documentation](https://nextjs.org).

## 2. Subsystem Heading (H2)

Below is an unordered bullet list with custom `>>` markers:

* **State Determinism**: Every interaction yields a predictable render output.
* **Stream Processing**: Data pipelines handle real-time event updates.

## 3. Numbered Execution Pipeline (OL / LI)

1. Initialize execution context and hydrate incoming parameters.
2. Validate incoming request schema using strict type guards.
3. Commit validated payloads to the persistence storage layer.

---

## 4. Blockquote / System Note

> "Visible progress beats hidden effort every single time."

---

## 5. Inline Code and Code Block with Copy Action

To run the local development server, execute `npm run dev` inside your terminal.

```typescript
interface SystemSignal<T> {
  readonly id: string;
  readonly payload: T;
  status: 'IDLE' | 'PROCESSING' | 'RESOLVED';
}
```

---

## 6. Comparative Data Matrix (TABLE)

| Architecture Layer | Core Duty       | Runtime Target | Status |
| :---               | :---            | :---           | :---   |
| API Gateway        | Request parsing | Node.js        | Active |
| State Store        | Client cache    | Web Browser    | Active |
```

## Эндпоинты (предложение)

| Метод | Путь               | Ответ                        |
| ----- | ------------------ | ---------------------------- |
| GET   | `/articles`        | `{ items: Article[] }`       |
| GET   | `/articles/{slug}` | `{ item: Article }`          |
| GET   | `/cases`           | `{ items: Case[] }`          |
| GET   | `/cases/{slug}`    | `{ item: Case }`             |

404 на несуществующий slug — обязателен.