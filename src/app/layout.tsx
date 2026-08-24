import type { Metadata, Viewport } from "next";
import { PT_Mono } from "next/font/google";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_AUTHOR,
  SITE_OG_IMAGE,
} from "@/lib/site";
import "./globals.css";
import "@/styles/main.scss";
import { CookieBanner } from "@/components/cookie-banner";

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
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 436,
        height: 487,
        alt: "Letnull19A — Web Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
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
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0C0D0A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${ptMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
