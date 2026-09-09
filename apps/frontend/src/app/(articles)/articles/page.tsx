import type { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { AskSection } from '@/sections/ask';
import { ContactSection } from '@/sections/contact';
import { OtherArticles } from '@/sections/other-articles';
import { getArticlesServer } from '@/lib/server-api';

export const metadata: Metadata = {
  title: 'Articles — Technical Insights',
  description:
    'Technical articles by Letnull19A about NestJS request lifecycle, engineering decisions and building web products with visible state.',
  alternates: {
    canonical: '/articles',
  },
};

const navData = {
  brand: { title: 'Letnull19A Portfolio', href: '/' },
  items: [
    { id: 'articles', label: 'Articles', href: '/articles' },
    { id: 'ask', label: 'Ask', href: '#ask' },
  ],
  action: { label: 'Contact me', href: '#contact' },
};

// SSR: страница всегда рендерится на сервере в рантайме,
// билд пропускает её пререндер.
export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  // SSR: список статей рендерится на сервере в рантайме.
  const articles = await getArticlesServer();

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Header {...navData} />
      <main id="main-content" className="divide-y divide-border">
        <OtherArticles articles={articles} />
      </main>
      <AskSection />
      <ContactSection />
      <Footer />
    </div>
  );
}