'use client';

import React, { useState, useEffect } from 'react';
import { BrandLogo } from './brand-logo';
import { Button } from './button';
import { cn } from '../lib/utils';
import { ecosystem, SITE_LINKS, type NavLink } from '@mwenaro/config/ecosystem';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  currentApp?: 'hub' | 'academy' | 'talent' | 'labs';
  ctaLabel?: string;
  ctaHref?: string;
  links?: NavLink[];
}

export const NavBar = ({
  currentApp = 'hub',
  ctaLabel,
  ctaHref,
  links: customLinks,
}: NavBarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    // Client-side only
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  const getLinks = () => {
    if (customLinks) return customLinks;

    const baseLinks = SITE_LINKS[currentApp] || [];

    return baseLinks.map(link => {
      const isHome = link.href === '/' || link.href === '';
      const isCurrentApp = link.active === currentApp;
      const isExactMatch = pathname === link.href;

      let isActive = false;
      if (isHome) {
        isActive = isExactMatch && (isCurrentApp || link.active === true);
      } else {
        isActive = isExactMatch || link.active === true;
      }

      return {
        ...link,
        active: isActive
      };
    });
  };

  const links = getLinks();

  const defaultCTA = {
    label: currentApp === 'academy' ? 'My Courses' : 'Get Started',
    href:
      ctaHref ||
      (currentApp === 'academy'
        ? `${ecosystem.academy}/login`
        : ecosystem.hub),
    variant: currentApp === 'academy' ? 'primary' : 'secondary',
  };

  const getAppSubtext = () => {
    switch (currentApp) {
      case 'academy': return 'Academy';
      case 'talent': return 'Talent';
      case 'labs': return 'Labs';
      default: return 'Hub';
    }
  };

  const subtext = getAppSubtext();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <a href={ecosystem.hub} className="hover:opacity-80 transition-opacity z-50">
            <BrandLogo subtext={subtext} />
          </a>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={cn(
                    'text-sm font-bold tracking-wide transition-all duration-300 relative group py-2',
                    link.active
                      ? 'text-primary'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  )}
                >
                  {link.name}
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 rounded-full',
                      link.active ? 'w-full' : 'w-0 group-hover:w-full opacity-50'
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-4 z-50">
            <Button
              variant={defaultCTA.variant as any}
              size="md"
              className="hidden md:flex rounded-full shadow-[0_4px_14px_0_hsl(var(--primary)/30%)] hover:shadow-[0_6px_20px_hsl(var(--primary)/40%)] hover:-translate-y-0.5 transition-all"
              as="a"
              href={defaultCTA.href}
            >
              {ctaLabel || defaultCTA.label}
            </Button>

            <button
              className="md:hidden p-2 text-foreground focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "fixed inset-0 top-20 z-40 bg-background backdrop-blur-2xl border-t border-border/50 transition-all duration-300 ease-in-out md:hidden flex flex-col items-center p-6 pt-12 overflow-y-auto",
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <ul className="flex flex-col items-center gap-8 w-full">
          {links.map((link) => (
            <li key={link.name} className="w-full text-center">
              <a
                href={link.href}
                className={cn(
                  'block text-2xl font-black tracking-tight transition-colors',
                  link.active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 w-full max-w-xs mb-10">
          <Button
            variant={defaultCTA.variant as any}
            size="lg"
            className="w-full rounded-full shadow-xl shadow-primary/20 text-lg font-bold h-14"
            as="a"
            href={defaultCTA.href}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {ctaLabel || defaultCTA.label}
          </Button>
        </div>
      </div>
    </>
  );
};