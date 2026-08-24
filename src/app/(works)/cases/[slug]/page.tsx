import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { AskSection } from '@/sections/ask';
import { ContactSection } from '@/sections/contact';
import { CaseDetailSection } from '@/sections/case-detail';
import { cases } from '@/config/cases';
import { SITE_URL, SITE_TITLE, SITE_OG_IMAGE } from '@/lib/site';

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. Обязательная функция для output: 'export'
export async function generateStaticParams() {
  return cases
    .filter((c) => Boolean(c.slug))
    .map((c) => ({
      slug: c.slug as string,
    }));
}

// 2. Генерация метатегов для конкретного кейса
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const currentCase = cases.find((c) => c.slug === slug);
  if (!currentCase) return {};

  const title = `${currentCase.title} — Case Study`;
  const description = currentCase.description;
  const url = `${SITE_URL}/cases/${currentCase.slug}`;

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
    { id: 'case', label: 'Case', href: '#case' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'problem', label: 'Problem', href: '#problem' },
    { id: 'solution', label: 'Solution', href: '#solution' },
    { id: 'other-cases', label: 'Other', href: '#other-cases' },
    { id: 'ask', label: 'Ask', href: '#ask' },
  ],
  action: { label: 'Contact me', href: '#contact' },
};

// 3. Компонент страницы
export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const currentCase = cases.find((c) => c.slug === slug);

  if (!currentCase) {
    notFound();
  }

  const otherCases = cases.filter((c) => c.slug !== slug);

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Header {...navData} />
      <main id="main-content" className="divide-y divide-border">
        <CaseDetailSection
          title={currentCase.fullTitle || currentCase.title}
          subtitle={currentCase.subtitle || currentCase.description}
          meta={currentCase.meta}
          problem={currentCase.problem}
          previewImageSrc={currentCase.previewImageSrc}
          previewCaption={currentCase.previewCaption}
          solution={currentCase.solution}
          results={currentCase.results}
          otherCases={otherCases}
        />
      </main>
      <AskSection />
      <ContactSection />
      <Footer />
    </div>
  );
}