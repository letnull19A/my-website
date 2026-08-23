import { Header } from "@/components/header";
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
        <ArticlesSection/>
        <ContactSection/>
      </main>
    </div>
  );
}
