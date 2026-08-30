import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { AskSection } from '@/sections/ask';
import { ContactSection } from '@/sections/contact';
import { ArticleDetailSection } from '@/sections/article-detail';
import { articles } from '@/config/articles';
import { SITE_URL, SITE_TITLE, SITE_OG_IMAGE } from '@/lib/site';

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

  const title = `${currentArticle.title} — Article`;
  const description = currentArticle.description;
  const url = `${SITE_URL}/articles/${currentArticle.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      siteName: SITE_TITLE,
      title,
      description,
      url,
      publishedTime: currentArticle.date,
      images: [{ url: SITE_OG_IMAGE }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SITE_OG_IMAGE],
    },
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
      <main id="main-content" className="divide-y divide-border">
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