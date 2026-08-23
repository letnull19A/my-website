import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AskSection } from "@/sections/ask";
import { ContactSection } from "@/sections/contact";
import { OtherWorkSection } from "@/sections/other-works";

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
