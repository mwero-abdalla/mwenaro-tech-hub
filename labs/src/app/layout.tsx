import type { Metadata } from "next";
import "./globals.css";
import { ecosystem } from "@mwenaro/config/ecosystem";

export const metadata: Metadata = {
    metadataBase: new URL(ecosystem.labs),
    title: {
        default: "Mwenaro Labs | Software Development & Digital Solutions Agency",
        template: "%s | Mwenaro Labs",
    },
    description: "Mwenaro Labs designs, builds, and maintains scalable custom digital solutions for startups and enterprises across Africa. We specialize in software development and R&D.",
    keywords: [
        "Software development agency Kenya",
        "custom digital solutions Africa",
        "enterprise tech R&D",
        "Mwenaro Labs",
        "tech startup builder Africa",
        "software engineering consulting Mombasa",
        "digital innovation agency",
    ],
    authors: [{ name: "Mwenaro Hub" }],
    creator: "Mwenaro Hub",
    publisher: "Mwenaro Hub",
    openGraph: {
        title: "Mwenaro Labs | Digital Innovation & Software Development",
        description: "Building futuristic, scalable software solutions for startups and enterprises in Africa.",
        url: ecosystem.labs,
        siteName: "Mwenaro Labs",
        images: [
            {
                url: "/logo-full.svg",
                width: 1200,
                height: 630,
                alt: "Mwenaro Labs - Custom Digital Solutions Africa",
            },
        ],
        locale: "en_KE",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mwenaro Labs | Digital Solutions",
        description: "Pioneering digital innovation, software development, and enterprise R&D in Africa.",
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
