import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AskSection } from "@/sections/ask";
import { ContactSection } from "@/sections/contact";
import { OtherArticles } from "@/sections/other-articles/other-articles";

const navData = {
  brand: { title: 'Letnull19A Portfolio', href: '/' },
  items: [
    { id: 'articles', label: 'Articles', href: '#articles' },
    { id: 'ask', label: 'Ask', href: '#ask' },
  ],
  action: { label: 'Contact me', href: '#contact' },
};

export default function Cases() {
  return (
   <div className="min-h-screen bg-background text-foreground font-mono">
      <Header {...navData} />
      <main className="divide-y divide-border">
        <OtherArticles/>
      </main>
      <AskSection/>
      <ContactSection/>
      <Footer/>
    </div>
  );
}
