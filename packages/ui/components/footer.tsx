'use client';

import React from 'react';
import { BrandLogo } from './brand-logo';
import { Button } from './button';
import { cn } from '../lib/utils';
import { ecosystem } from '@mwenaro/config/ecosystem';

interface FooterProps {
  currentApp?: 'hub' | 'academy' | 'talent' | 'labs';
}

export const Footer: React.FC<FooterProps> = ({ currentApp = 'hub' }) => {
  // Dynamic description based on page
  const pageDescription: Record<string, string> = {
    hub: "Mwenaro Tech Hub is Africa's premier ecosystem for tech talent and innovation. We bridge the gap between learning and industry excellence.",
    academy: 'Mwenaro Academy empowers learners with structured, project-based programs to build real-world tech skills.',
    talent: 'Mwenaro Talent connects you with developers trained through structured, project-based learning and real projects.',
    labs: 'Mwenaro Labs designs, builds, and maintains scalable digital solutions for startups and growing organizations.',
  };

  // Ecosystem CTAs per page
  const ecosystemLinks: { text: string; href: string }[] = [
    { text: 'Mwenaro Academy', href: ecosystem.academy },
    { text: 'Talent Platform', href: ecosystem.talent },
    { text: 'Mwenaro Labs', href: ecosystem.labs },
  ];

  return (
    <footer className="bg-secondary text-white mt-40 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Logo & Description */}
          <div className="space-y-6">
            <a href={ecosystem.hub} className="block hover:opacity-80 transition-opacity">
              <BrandLogo className="brightness-200 contrast-200" />
            </a>
            <p className="text-secondary-foreground opacity-70 leading-relaxed text-sm">
              {pageDescription[currentApp]}
            </p>
          </div>

          {/* Ecosystem Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Ecosystem</h4>
            <ul className="space-y-4 text-sm font-medium">
              {ecosystemLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-secondary-foreground opacity-70 hover:opacity-100 hover:text-primary transition-all"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact</h4>
            <ul className="space-y-4 text-sm font-medium text-secondary-foreground opacity-70">
              <li>
                <a
                  href="mailto:hello@mwenaro.co.ke"
                  className="hover:text-primary hover:opacity-100 transition-all"
                >
                  hello@mwenaro.co.ke
                </a>
              </li>
              <li>Mombasa, Kenya</li>
              <li>+254116477282</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="glass-card !bg-white/5 p-8 rounded-3xl border-white/10">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4">Newsletter</h4>
            <p className="text-xs text-secondary-foreground opacity-70 mb-3">
              Get updates on courses, talent, and digital projects across the ecosystem.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter"
                type="email"
                placeholder="Your email"
                className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
              <Button
                type="submit"
                className="bg-primary text-white py-3 rounded-xl text-sm font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
              >
                Join Now
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 text-xs font-bold tracking-widest uppercase">
          <p>© {new Date().getFullYear()} Mwenaro Tech Hub. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};