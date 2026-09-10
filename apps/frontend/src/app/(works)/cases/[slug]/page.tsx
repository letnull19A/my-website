import type { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { DataUnavailable } from '@/components/data-unavailable';
import { AskSection } from '@/sections/ask';
import { ContactSection } from '@/sections/contact';
import { CaseDetailSection } from '@/sections/case-detail';
import { getCaseBySlugServer, getCasesServer } from '@/lib/server-api';
import { SITE_URL, SITE_TITLE, SITE_OG_IMAGE } from '@/lib/site';

interface Props {
  params: Promise<{ slug: string }>;
}

// SSR: детальный кейс рендерится на сервере в рантайме,
// данные всегда свежие из бэкенда с фолбэком на локальные моки.
export const dynamic = 'force-dynamic';

// 2. Генерация метатегов для конкретного кейса
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const currentCase = await getCaseBySlugServer(slug);
  if (!currentCase) return {};

  const title = `${currentCase.title} — Case Study`;
  const description = currentCase.description;
  const url = `${SITE_URL}/cases/${currentCase.slug}`;
  const ogImage =
    (typeof currentCase.previewImageSrc === 'string' && currentCase.previewImageSrc) ||
    (typeof currentCase.logo === 'string' && currentCase.logo) ||
    SITE_OG_IMAGE;

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
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
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
  const currentCase = await getCaseBySlugServer(slug);

  if (!currentCase) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono">
        <Header {...navData} />
        <main id="main-content" className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <DataUnavailable
            message="This case could not be loaded. Please try again later."
            backHref="/cases"
            backLabel="BACK TO CASES"
          />
        </main>
        <Footer />
      </div>
    );
  }

  const allCases = await getCasesServer();
  const otherCases = allCases.filter((c) => c.slug !== slug);

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