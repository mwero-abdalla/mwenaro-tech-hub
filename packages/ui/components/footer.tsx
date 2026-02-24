import React from 'react';
import { BrandLogo } from './brand-logo';
import { cn } from '../lib/utils';

export const Footer = () => {
  const urls = {
    hub: process.env.NEXT_PUBLIC_HUB_URL || '/',
    academy: process.env.NEXT_PUBLIC_ACADEMY_URL || '/academy',
    talent: process.env.NEXT_PUBLIC_TALENT_URL || '/talent',
    labs: process.env.NEXT_PUBLIC_LABS_URL || '/labs',
  };

  return (
    <footer className="bg-secondary text-white mt-40 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-6">
            <a href={urls.hub} className="block hover:opacity-80 transition-opacity">
              <BrandLogo className="brightness-200 contrast-200" />
            </a>
            <p className="text-secondary-foreground opacity-70 leading-relaxed text-sm">
              Mwenaro Tech Hub is Africa’s premier ecosystem for tech talent and innovation. We bridge the gap between learning and industry excellence.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Ecosystem</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href={urls.academy} className="text-secondary-foreground opacity-70 hover:opacity-100 hover:text-primary transition-all">Mwenaro Academy</a></li>
              <li><a href={urls.talent} className="text-secondary-foreground opacity-70 hover:opacity-100 hover:text-primary transition-all">Talent Platform</a></li>
              <li><a href={urls.labs} className="text-secondary-foreground opacity-70 hover:opacity-100 hover:text-primary transition-all">Mwenaro Labs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact</h4>
            <ul className="space-y-4 text-sm font-medium text-secondary-foreground opacity-70">
              <li><a href="mailto:hello@mwenarotech.com" className="hover:text-primary hover:opacity-100 transition-all">hello@mwenarotech.com</a></li>
              <li>Nairobi, Kenya</li>
              <li>+254 700 123 456</li>
            </ul>
          </div>

          <div className="glass-card !bg-white/5 p-8 rounded-3xl border-white/10">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4">Newsletter</h4>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-newsletter" className="sr-only">Email address</label>
              <input
                id="footer-newsletter"
                type="email"
                placeholder="Your email"
                className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
              <button
                type="submit"
                className="bg-primary text-white py-3 rounded-xl text-sm font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
              >
                Join Now
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 text-xs font-bold tracking-widest uppercase">
          <p>© {new Date().getFullYear()} Mwenaro Tech Hub. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};