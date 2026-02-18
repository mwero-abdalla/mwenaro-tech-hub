import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://talent.mwenaro.com"), // Verify domain
    title: {
        default: "Mwenaro Talent | Hire Top Tech Talent",
        template: "%s | Mwenaro Talent",
    },
    description: "Connect with top-tier technology talent from Mwenaro Tech Academy. Skilled developers, data scientists, and engineers ready to innovate.",
    keywords: ["Tech Talent", "Hire Developers", "Remote Engineers", "Mwenaro", "Recruitment", "Kenya Tech Talent"],
    authors: [{ name: "Mwenaro Tech Hub" }],
    creator: "Mwenaro Tech Hub",
    publisher: "Mwenaro Tech Hub",
    openGraph: {
        title: "Mwenaro Talent | Hire Top Tech Talent",
        description: "Find and hire the best tech talent trained at Mwenaro Tech Academy.",
        url: "https://talent.mwenaro.com",
        siteName: "Mwenaro Talent",
        images: [
            {
                url: "/logo-full.svg",
                width: 800,
                height: 600,
                alt: "Mwenaro Talent Logo",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mwenaro Talent",
        description: "Connect with top-tier technology talent.",
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
