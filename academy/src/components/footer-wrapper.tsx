"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@mwenaro/ui";

export function FooterWrapper() {
    const pathname = usePathname();

    // List of paths where the footer should be hidden
    const hiddenPaths = ["/dashboard", "/instructor", "/admin", "/learn", "/courses"];

    // Check if current path starts with any of the hidden paths
    const shouldHideFooter = hiddenPaths.some((path) => pathname?.startsWith(path));

    if (shouldHideFooter) {
        return null;
    }

    return <Footer />;
}
