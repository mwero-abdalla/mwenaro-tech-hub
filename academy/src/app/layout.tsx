import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@mwenaro/ui";
import { FooterWrapper } from "@/components/footer-wrapper";
import { ChatWidget } from "@/components/chat-widget";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mwenaro Tech Academy",
  description: "Empowering the next generation of tech leaders.",
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
