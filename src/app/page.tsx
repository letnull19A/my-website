import { Header } from "@/components/header";
import { AboutStackSection } from "@/sections/about";
import { AskSection } from "@/sections/ask";
import { CasesSection } from "@/sections/cases";
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

export default function Home() {
  return (
   <div className="min-h-screen bg-background text-foreground font-mono">
      <Header {...navData} />
      <main className="divide-y divide-border">
        <HeroSection/>
        <CasesSection/>
        <AboutStackSection/>
        <WorkProcessSection/>
        <AskSection/>
        <section id="ask" className="min-h-[90vh] p-8 md:p-16">
          <h2 className="text-3xl font-bold">Ask</h2>
        </section>
        <section id="articles" className="min-h-[90vh] p-8 md:p-16">
          <h2 className="text-3xl font-bold">Articles</h2>
        </section>
        <section id="contact" className="min-h-[70vh] p-8 md:p-16 bg-surface">
          <h2 className="text-3xl font-bold">Contact me</h2>
        </section>
      </main>
    </div>
  );
}
