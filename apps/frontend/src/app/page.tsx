import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getArticlesServer, getCasesServer } from "@/lib/server-api";
import { AboutStackSection } from "@/sections/about";
import { ArticlesSection } from "@/sections/articles";
import { AskSection } from "@/sections/ask";
import { CasesSection } from "@/sections/cases";
import { ContactSection } from "@/sections/contact";
import { HeroSection } from "@/sections/hero";
import { WorkProcessSection } from "@/sections/process";

const navData = {
  brand: { title: 'Letnull19A Portfolio', href: '#portfolio' },
  items: [
    { id: 'cases', label: 'Cases', href: '#cases' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'process', label: 'Process', href: '#process' },
    { id: 'ask', label: 'Ask', href: '#ask' },
    { id: 'articles', label: 'Articles', href: '#articles' },
  ],
  action: { label: 'Contact me', href: '#contact' },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  // SSR: данные подтягиваются на сервере в рантайме, клиентские секции
  // получают их через props и не делают повторный запрос.
  const [cases, articles] = await Promise.all([
    getCasesServer(),
    getArticlesServer(),
  ]);

  return (
   <div className="min-h-screen bg-background text-foreground font-mono">
      <Header {...navData} />
      <main id="main-content" className="divide-y divide-border">
        <HeroSection/>
        <CasesSection cases={cases}/>
        <AboutStackSection/>
        <WorkProcessSection/>
        <AskSection/>
        <ArticlesSection articles={articles}/>
        <ContactSection/>
      </main>
      <Footer/>
    </div>
  );
}
