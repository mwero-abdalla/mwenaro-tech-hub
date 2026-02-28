'use client';

import React, { useState } from 'react';
import { BrandLogo } from './brand-logo';
import { Button } from './button';
import { cn } from '../lib/utils';
import { ecosystem } from '@mwenaro/config/ecosystem';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  currentApp?: 'hub' | 'academy' | 'talent' | 'labs';
  ctaLabel?: string;
  ctaHref?: string;
}

export const NavBar = ({
  currentApp = 'hub',
  ctaLabel,
  ctaHref,
}: NavBarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Hub', href: ecosystem.hub, active: currentApp === 'hub' },
    { name: 'Academy', href: ecosystem.academy, active: currentApp === 'academy' },
    { name: 'Talent', href: ecosystem.talent, active: currentApp === 'talent' },
    { name: 'Labs', href: ecosystem.labs, active: currentApp === 'labs' },
  ];

  const defaultCTA = {
    label: currentApp === 'academy' ? 'My Courses' : 'Get Started',
    href:
      ctaHref ||
      (currentApp === 'academy'
        ? `${ecosystem.academy}/login`
        : ecosystem.hub),
    variant: currentApp === 'academy' ? 'primary' : 'secondary',
  };

  const subtexts = {
    hub: 'Innovation Hub',
    academy: 'Tech Academy',
    talent: 'Talent Network',
    labs: 'Innovation Labs',
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <a href={ecosystem.hub} className="hover:opacity-80 transition-opacity z-50">
            <BrandLogo subtext={subtexts[currentApp]} />
          </a>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={cn(
                    'text-sm font-bold tracking-wide transition-all duration-300 relative group',
                    link.active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.name}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300',
                      link.active ? 'w-full' : 'w-0 group-hover:w-full'
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
              size="sm"
              className="hidden md:flex rounded-full px-8 shadow-primary/20"
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