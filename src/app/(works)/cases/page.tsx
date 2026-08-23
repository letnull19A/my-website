import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AskSection } from "@/sections/ask";
import { ContactSection } from "@/sections/contact";
import { OtherWorkSection } from "@/sections/other-works/other-works";

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

export default function Cases() {
  return (
   <div className="min-h-screen bg-background text-foreground font-mono">
      <Header {...navData} />
      <main className="divide-y divide-border">
        <OtherWorkSection/>
      </main>
      <AskSection/>
      <ContactSection/>
      <Footer/>
    </div>
  );
}
