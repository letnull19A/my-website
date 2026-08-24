import type { ArticleCardProps } from '@/components/article-card';
import { socialLinks } from '@/config/social';

export const articles: ArticleCardProps[] = [
  {
    slug: 'ui-syntax-and-styleguide',
    title: 'UI DESIGN SYSTEM & MARKDOWN SYNTAX DEMO',
    description:
      'Complete showcase of all typography, lists, code blocks, tables, and blockquotes supported by the markdown parser.',
    coverImage: undefined,
    linkedinHref: socialLinks[1]?.href,
    telegramHref: socialLinks[2]?.href,
    readHref: '/articles/ui-syntax-and-styleguide',
    subtitle:
      'A reference specification demonstrating headers, list markers, code copy actions, and responsive tables.',
    date: '2026-08',
    readTime: '4 MIN READ',
    category: 'DESIGN SYSTEM // SPEC',
    content: `
# 1. Main Section Heading (H1)

This is a standard text paragraph (\`p\`) illustrating text rhythm and line spacing. It demonstrates inline elements like **bold emphasis**, *italicized terms*, and an external link to [Next.js Documentation](https://nextjs.org).

---

## 2. Subsystem Heading with Hash Decorator (H2)

Headers of level two automatically prepend a green hash tag indicator.

### 3. Nested Feature Header (H3)

Below is an unordered bullet list demonstrating custom \`>>\` list item decorators:

* **State Determinism**: Every interaction yields a predictable render output.
* **Stream Processing**: Data pipelines handle real-time event updates without UI blocking.
* **Zero Overhead**: Minimal layout shifts and targeted component updates.

---

## 4. Numbered Execution Pipeline (OL / LI)

1. Initialize execution context and hydrate incoming parameters.
2. Validate incoming request schema using strict type guards.
3. Commit validated payloads to the persistence storage layer.

---

## 5. Blockquote / System Note

> "Visible progress beats hidden effort every single time. Clear state boundaries keep client architectures simple and maintainable."

---

## 6. Inline Code and Code Block with Copy Action

To run the local development server, execute \`npm run dev\` inside your terminal.

\`\`\`typescript
interface SystemSignal<T> {
  readonly id: string;
  readonly payload: T;
  readonly timestamp: number;
  status: 'IDLE' | 'PROCESSING' | 'RESOLVED';
}

export function dispatchSignal<T>(signal: SystemSignal<T>): void {
  console.log(\`[SIGNAL_DISPATCH]: \${signal.id} - \${signal.status}\`);
}
\`\`\`

---

## 7. Comparative Data Matrix (TABLE)

| Architecture Layer | Core Duty | Runtime Target | Status |
| :--- | :--- | :--- | :--- |
| **API Gateway** | Request parsing & security guards | Node.js Runtime | Active |
| **State Store** | Client cache & sync reconciliation | Web Browser | Active |
| **3D Engine** | Mesh configuration & rendering | WebGL / Canvas | Standby |

---

## 8. Final Boundary Summary

Here is the concluding paragraph summarizing the complete design spec. All styles align with the retro-terminal palette, monospace hierarchy, and responsive grid layouts.
    `,
  },
];