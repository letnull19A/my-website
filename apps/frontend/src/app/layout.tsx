import type { Metadata, Viewport } from "next";
import { PT_Mono } from "next/font/google";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_AUTHOR,
} from "@/lib/site";
import "./globals.css";
import "@/styles/main.scss";
import { CookieBanner } from "@/components/cookie-banner";
import { TRPCProvider } from "@/lib/trpc/provider";

const ptMono = PT_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | Letnull19A`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "web developer",
    "full-stack developer",
    "React",
    "Next.js",
    "NestJS",
    "TypeScript",
    "portfolio",
    "Letnull19A",
  ],
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_AUTHOR,
  publisher: SITE_AUTHOR,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0C0D0A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${ptMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-lime focus:text-background focus:font-bold focus:rounded-none focus:outline-none"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: SITE_AUTHOR,
              url: SITE_URL,
              jobTitle: "Full-Stack Developer",
              description: SITE_DESCRIPTION,
              sameAs: [
                "https://github.com/letnull19a",
                "https://www.linkedin.com/in/aleksei-volkov-572ba9401/",
                "https://t.me/alexei_wolkoff",
              ],
            }),
          }}
        />
        <TRPCProvider>{children}</TRPCProvider>
        <CookieBanner />
      </body>
    </html>
  );
}