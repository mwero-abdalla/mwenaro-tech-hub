import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://labs.mwenaro.com"), // Verify domain
    title: {
        default: "Mwenaro Labs | Digital Innovation & R&D",
        template: "%s | Mwenaro Labs",
    },
    description: "Mwenaro Labs is the R&D arm of Mwenaro Tech Hub, building futuristic digital solutions and pioneering new technologies.",
    keywords: ["Innovation Labs", "R&D", "Software Development", "Digital Solutions", "Mwenaro", "Future Tech"],
    authors: [{ name: "Mwenaro Tech Hub" }],
    creator: "Mwenaro Tech Hub",
    publisher: "Mwenaro Tech Hub",
    openGraph: {
        title: "Mwenaro Labs | Digital Innovation & R&D",
        description: "Building the future with cutting-edge technology and research.",
        url: "https://labs.mwenaro.com",
        siteName: "Mwenaro Labs",
        images: [
            {
                url: "/logo-full.svg",
                width: 800,
                height: 600,
                alt: "Mwenaro Labs Logo",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mwenaro Labs",
        description: "Pioneering digital innovation and research.",
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
