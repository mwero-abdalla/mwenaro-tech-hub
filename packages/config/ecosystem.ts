export interface NavLink {
  name: string;
  href: string;
  active?: string | boolean;
}

export const ecosystem = {
  hub: "https://mwenaro.co.ke",
  academy: "https://academy.mwenaro.co.ke",
  talent: "https://talent.mwenaro.co.ke",
  labs: "https://labs.mwenaro.co.ke",
};

export const SITE_LINKS: Record<string, NavLink[]> = {
  hub: [
    { name: "Home", href: "/", active: "hub" },
    { name: "Academy", href: ecosystem.academy },
    { name: "Talent", href: ecosystem.talent },
    { name: "Labs", href: ecosystem.labs },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ],
  talent: [
    { name: "Home", href: "/", active: "talent" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  labs: [
    { name: "Home", href: "/", active: "labs" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  academy: [
    { name: "Home", href: "/", active: "academy" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
}