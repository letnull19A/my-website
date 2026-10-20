import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AiHeroSection } from "@/sections/ai-hero";
import { ContactSection } from "@/sections/contact";

export const metadata: Metadata = {
  title: "AI Assistant — Ask About My Work",
  description:
    "Ask Letnull19A's personal AI about product fit, engineering decisions and the stack behind each case.",
  alternates: {
    canonical: "/ai",
  },
};

const navData = {
  brand: { title: 'Letnull19A Portfolio', href: '/' },
  items: [],
  action: { label: 'Contact me', href: '#contact' },
};

// SSR: страница всегда рендерится на сервере в рантайме,
// билд пропускает её пререндер.
export const dynamic = "force-dynamic";

export default async function AiPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Header {...navData} />
      <main id="main-content">
        <AiHeroSection />
      </main>
      <ContactSection className="mt-0" />
      <Footer />
    </div>
  );
}
