import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://devtimmy.vercel.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Timmy — AI Web & Mobile Developer",
    template: "%s | Timmy",
  },
  description:
    "Full-stack AI developer building practical web and mobile products from concept to production. React, Next.js, React Native, TypeScript, AI integrations.",
  keywords: [
    "full-stack developer",
    "AI developer",
    "React Native developer",
    "Next.js developer",
    "web developer Nigeria",
    "AI-powered web and mobile applications",
    "FilmSort",
    "devTimmy",
    "_devTimmy",
  ],
  authors: [{ name: "Timmy", url: "https://x.com/_devTimmy" }],
  creator: "Timmy",
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "Timmy — AI Web & Mobile Developer",
    description:
      "Full-stack AI developer building practical web and mobile products from concept to production.",
    siteName: "Timmy Portfolio",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Timmy — AI Web & Mobile Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@_devTimmy",
    creator: "@_devTimmy",
    title: "Timmy — AI Web & Mobile Developer",
    description:
      "Full-stack AI developer building practical web and mobile products from concept to production.",
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-screen flex-col bg-[#000000] text-[#ffffff] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
