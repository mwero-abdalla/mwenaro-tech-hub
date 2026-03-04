import type { Metadata } from "next";
import "./globals.css";
import { ecosystem } from "@mwenaro/config/ecosystem";

export const metadata: Metadata = {
    metadataBase: new URL(ecosystem.talent),
    title: {
        default: "Mwenaro Talent | Hire Vetted Tech Talent in Africa",
        template: "%s | Mwenaro Talent",
    },
    description: "Hire top-tier, vetted software engineers and data scientists in Kenya and across Africa. Mwenaro Talent connects global companies with project-ready remote tech talent.",
    keywords: [
        "hire developers in Kenya",
        "vetted African tech talent",
        "hire software engineers Africa",
        "remote tech talent Kenya",
        "outsource software development Africa",
        "Mwenaro Talent",
        "tech recruitment Africa",
    ],
    authors: [{ name: "Mwenaro Hub" }],
    creator: "Mwenaro Hub",
    publisher: "Mwenaro Hub",
    openGraph: {
        title: "Mwenaro Talent | Hire Top African Tech Talent",
        description: "Connect with vetted, project-ready software engineers and data scientists.",
        url: ecosystem.talent,
        siteName: "Mwenaro Talent",
        images: [
            {
                url: "/logo-full.svg",
                width: 1200,
                height: 630,
                alt: "Mwenaro Talent - Hire Remote Developers in Africa",
            },
        ],
        locale: "en_KE",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mwenaro Talent | Hire Developers",
        description: "Scale your team with elite tech talent from Africa. Hire vetted engineers today.",
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
