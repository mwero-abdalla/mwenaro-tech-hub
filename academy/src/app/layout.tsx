import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@mwenaro/ui";
import { FooterWrapper } from "@/components/footer-wrapper";
import { ChatWidget } from "@/components/chat-widget";
import { Toaster } from "@/components/ui/sonner"
import { ecosystem } from "@mwenaro/config/ecosystem";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(ecosystem.academy),
  title: {
    default: "Mwenaro Academy | Software Engineering Bootcamp Africa",
    template: "%s | Mwenaro Academy",
  },
  description: "Learn coding in Kenya and across Africa. Mwenaro Academy offers project-based tech education, coding bootcamps, and career mentorship in software engineering and data science.",
  keywords: [
    "Learn coding in Kenya",
    "software engineering bootcamp Africa",
    "project-based tech education",
    "Mwenaro Academy",
    "coding classes Mombasa",
    "data science course Kenya",
    "web development bootcamp Africa",
  ],
  authors: [{ name: "Mwenaro Hub" }],
  creator: "Mwenaro Hub",
  publisher: "Mwenaro Hub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Mwenaro Academy | Master Tech Skills",
    description: "Launch your career with our software engineering and data science bootcamps in Africa.",
    url: ecosystem.academy,
    siteName: "Mwenaro Academy",
    images: [
      {
        url: "/logo-full.svg",
        width: 1200,
        height: 630,
        alt: "Mwenaro Academy - Coding Bootcamp Africa",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mwenaro Academy",
    description: "Project-based tech education and coding bootcamps in Africa.",
    images: ["/logo-full.svg"],
    creator: "@mwenaro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <NavBar currentApp="academy" />
          <main className="flex-1">{children}</main>
          <ChatWidget />
          <FooterWrapper />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
