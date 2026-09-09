import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AskSection } from "@/sections/ask";
import { ContactSection } from "@/sections/contact";
import { OtherWorkSection } from "@/sections/other-works";
import { getCasesServer } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Cases — Selected Work",
  description:
    "Selected work of Letnull19A — full-stack projects built for visible state, progress transparency and predictable delivery signal.",
  alternates: {
    canonical: "/cases",
  },
};

const navData = {
  brand: { title: 'Letnull19A Portfolio', href: '/' },
  items: [
    { id: 'cases', label: 'Cases', href: '#cases' },
    { id: 'ask', label: 'Ask', href: '#ask' },
  ],
  action: { label: 'Contact me', href: '#contact' },
};

// SSR: страница всегда рендерится на сервере в рантайме,
// билд пропускает её пререндер.
export const dynamic = 'force-dynamic';

export default async function Cases() {
  // SSR: список кейсов рендерится на сервере в рантайме.
  const cases = await getCasesServer();

  return (
   <div className="min-h-screen bg-background text-foreground font-mono">
      <Header {...navData} />
      <main id="main-content" className="divide-y divide-border">
        <OtherWorkSection cases={cases} />
      </main>
      <AskSection/>
      <ContactSection/>
      <Footer/>
    </div>
  );
}
