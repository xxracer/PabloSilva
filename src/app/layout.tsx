import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { GlobalStyles } from "@/components/global-styles";
import { getMeta, getNavLinks } from "@/lib/queries";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pablo Silva BJJ — Brazilian Jiu-Jitsu, Bellaire, Texas",
  description:
    "A modern Brazilian Jiu-Jitsu academy in Bellaire, Texas. Train with 2010 IBJJF Black Belt World Champion Pablo Silva. Programs for kids, teens, and adults.",
  keywords: [
    "Brazilian Jiu-Jitsu",
    "BJJ Bellaire",
    "BJJ Houston",
    "Pablo Silva BJJ",
    "BJJ kids",
    "adults BJJ",
    "IBJJF World Champion",
    "self defense Bellaire TX",
    "martial arts Houston",
  ],
  authors: [{ name: "Pablo Silva BJJ" }],
  metadataBase: new URL("https://pablosilvabjj.com"),
  alternates: {
    canonical: "/",
    types: {
      "text/plain": [{ url: "/llm.txt", title: "LLM-readable summary of Pablo Silva BJJ" }],
    },
  },
  openGraph: {
    title: "Pablo Silva BJJ",
    description: "Where champions are made. A modern jiu-jitsu academy in Bellaire, Texas.",
    type: "website",
    locale: "en_US",
    siteName: "Pablo Silva BJJ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pablo Silva BJJ",
    description: "Where champions are made. Bellaire, Texas.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const meta = getMeta();
  const navLinks = getNavLinks();
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav links={navLinks} />
        <main id="main" className="flex-1">{children}</main>
        <Footer meta={meta} />
        <RevealOnScroll />
        <GlobalStyles />
      </body>
    </html>
  );
}
