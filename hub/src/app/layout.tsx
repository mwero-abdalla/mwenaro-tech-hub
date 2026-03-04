import type { Metadata } from "next";
import "./globals.css";
import { ecosystem } from "@mwenaro/config/ecosystem";

export const metadata: Metadata = {
    metadataBase: new URL(ecosystem.hub),
    title: {
        default: "Mwenaro Hub | Premier Tech Ecosystem in Africa",
        template: "%s | Mwenaro Hub",
    },
    description: "Mwenaro Hub is Africa's premier technology ecosystem. We drive tech innovation in Kenya, empowering startups, developers, and businesses through our Academy, Talent network, and Labs.",
    keywords: [
        "Mwenaro Hub",
        "tech innovation in Kenya",
        "African tech ecosystem",
        "tech startup builder Africa",
        "technology hub Mombasa",
        "Kenya tech talent",
        "Mwenaro",
    ],
    authors: [{ name: "Mwenaro Hub" }],
    creator: "Mwenaro Hub",
    publisher: "Mwenaro Hub",
    openGraph: {
        title: "Mwenaro Hub | Africa's Premier Tech Ecosystem",
        description: "Connecting innovation, talent, and tech education across the African ecosystem.",
        url: ecosystem.hub,
        siteName: "Mwenaro Hub",
        images: [
            {
                url: "/logo-full.svg",
                width: 1200,
                height: 630,
                alt: "Mwenaro Hub Logo - Technology Ecosystem in Africa",
            },
        ],
        locale: "en_KE",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mwenaro Hub | Tech Ecosystem",
        description: "Driving tech innovation in Kenya and across Africa. Join our ecosystem.",
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
