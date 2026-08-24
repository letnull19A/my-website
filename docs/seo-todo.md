# SEO / Качество — TODO

> Чек-лист по итогам web-quality аудита. Отмечай галочками по мере выполнения.
> Уровни: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

## 🟠 Высокий приоритет

- [x] Добавить `<label>` (или `aria-label`) для всех полей контактной формы — сейчас только `placeholder`
  - файл: `src/components/contact-form/contact-form.tsx`
- [x] Добавить `<label>` (или `aria-label`) для поля в секции "Ask"
  - файл: `src/sections/ask/ask.tsx`
- [x] Исправить семантику cookie-баннера: `aria-modal="true"`, управление фокусом, убрать `aria-live`
  - файл: `src/components/cookie-banner/cookie-banner.tsx`
- [x] Добавить структурированные данные (JSON-LD): `Person`, `WebSite`, `Article`
  - файл: `src/app/layout.tsx`
- [ ] Заменить мёртвую ссылку `https://speka.example.com` на реальный URL или убрать кнопку "TRY OUT" — **отложено по указанию**
  - файл: `src/config/cases.tsx`
- [ ] Заменить Lorem ipsum на реальный контент на страницах кейсов — **отложено по указанию**
  - файлы: `src/config/cases.tsx`, `src/sections/case-detail/case-detail.tsx`

## 🟡 Средний приоритет

- [ ] Конвертировать крупные PNG в WebP/AVIF и сжать
  - каталог: `public/images/*.png`
- [x] Добавить `loading="lazy"` нижесгибающим изображениям
  - файлы: `src/sections/process/process.tsx`, `about.tsx`, `contact.tsx`
- [x] Оптимизировать перетаскивание floating-карточек (не вызывать `setState` каждый кадр — снизить влияние на INP/CLS)
  - файл: `src/components/floating-card/floating-card.tsx`
- [x] Повысить контраст placeholder'ов
  - файлы: `src/components/contact-form/contact-form.tsx`, `src/sections/ask/ask.tsx`
- [ ] Сгенерировать OG-изображение 1200×630 (сейчас 436×487) — **отложено по указанию**
  - файл: `src/lib/site.ts`

## 🟢 Низкий приоритет

- [x] Добавить skip-link "Перейти к содержимому"
  - файл: `src/app/layout.tsx`

---

## ✅ Уже проверено и в порядке

- [x] `<html lang="en">`
- [x] `robots.txt` и `sitemap.xml`
- [x] Canonical URL на всех страницах
- [x] По одному `<h1>` на страницу
- [x] Тёмная тема, без светлой
- [x] `focus-visible` кольца на интерактивных элементах
- [x] Шрифт PT Mono самохостится и предзагружается (next/font)
