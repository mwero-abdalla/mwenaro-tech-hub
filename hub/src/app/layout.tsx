import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://hub.mwenaro.com"), // Verify domain
    title: {
        default: "Mwenaro Tech Hub | Innovation Ecosystem",
        template: "%s | Mwenaro Tech Hub",
    },
    description: "The central hub for Mwenaro's technology ecosystem. Discover our labs, talent network, and educational programs.",
    keywords: ["Tech Hub", "Innovation", "Startups", "Mwenaro", "Technology Ecosystem", "Kenya Tech"],
    authors: [{ name: "Mwenaro Tech Hub" }],
    creator: "Mwenaro Tech Hub",
    publisher: "Mwenaro Tech Hub",
    openGraph: {
        title: "Mwenaro Tech Hub | Innovation Ecosystem",
        description: "Connecting innovation, talent, and education in one ecosystem.",
        url: "https://hub.mwenaro.com",
        siteName: "Mwenaro Tech Hub",
        images: [
            {
                url: "/logo-full.svg", // Ensure this asset is available or use a relative path if shared
                width: 800,
                height: 600,
                alt: "Mwenaro Tech Hub Logo",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mwenaro Tech Hub",
        description: "The central hub for Mwenaro's technology ecosystem.",
        images: ["/logo-full.svg"],
        creator: "@mwenarotech",
    },
    icons: {
        icon: "/icon.svg",
        shortcut: "/icon.svg",
        apple: "/icon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
