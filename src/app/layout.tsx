import type { Metadata } from "next";
import { PT_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/main.scss";

const ptMono = PT_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Letnull19A — Web Developer Portfolio",
  description:
    "Portfolio of Letnull19A — building web products where technical state stays visible to both operators and decision-makers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${ptMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
