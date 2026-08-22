import { Header } from "@/components/header";
import { CasesSection } from "@/sections/cases";
import { HeroSection } from "@/sections/hero/hero";

const navData = {
  brand: { title: 'Letnull19A Portfolio', href: '#cases' },
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
        <section id="about" className="min-h-[90vh] p-8 md:p-16">
          <h2 className="text-3xl font-bold">About</h2>
        </section>
        <section id="process" className="min-h-[90vh] p-8 md:p-16">
          <h2 className="text-3xl font-bold">Process</h2>
        </section>
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
