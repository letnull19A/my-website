import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { AskSection } from '@/sections/ask';
import { ContactSection } from '@/sections/contact';
import { ArticleDetailSection } from '@/sections/article-detail';
import { articles } from '@/config/articles';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles
    .filter((a) => Boolean(a.slug))
    .map((a) => ({
      slug: String(a.slug),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const currentArticle = articles.find((a) => a.slug === slug);
  if (!currentArticle) return {};

  return {
    title: `${currentArticle.title} — Article`,
    description: currentArticle.description,
  };
}

const navData = {
  brand: { title: 'Letnull19A Portfolio', href: '/' },
  items: [
    { id: 'article', label: 'Article', href: '#article' },
    { id: 'ask', label: 'Ask', href: '#ask' },
  ],
  action: { label: 'Contact me', href: '#contact' },
};

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const currentArticle = articles.find((a) => a.slug === slug);

  if (!currentArticle) {
    notFound();
  }

  // Фильтруем остальные статьи для блока "MORE ARTICLES"
  const otherArticles = articles.filter((a) => a.slug !== slug);

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Header {...navData} />
      <main className="divide-y divide-border">
        <ArticleDetailSection
          title={currentArticle.title}
          subtitle={currentArticle.subtitle || currentArticle.description}
          date={currentArticle.date}
          readTime={currentArticle.readTime}
          category={currentArticle.category}
          content={currentArticle.content || ''}
          coverImage={currentArticle.coverImage}
          linkedinHref={currentArticle.linkedinHref}
          telegramHref={currentArticle.telegramHref}
          otherArticles={otherArticles}
        />
      </main>
      <AskSection />
      <ContactSection />
      <Footer />
    </div>
  );
}