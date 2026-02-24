import React from 'react';
import { BrandLogo } from './brand-logo';
import { Button } from './button';
import { cn } from '../lib/utils';

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
  const urls = {
    hub: process.env.NEXT_PUBLIC_HUB_URL || '/',
    academy: process.env.NEXT_PUBLIC_ACADEMY_URL || '/academy',
    talent: process.env.NEXT_PUBLIC_TALENT_URL || '/talent',
    labs: process.env.NEXT_PUBLIC_LABS_URL || '/labs',
  };

  const links = [
    { name: 'Hub', href: urls.hub, active: currentApp === 'hub' },
    { name: 'Academy', href: urls.academy, active: currentApp === 'academy' },
    { name: 'Talent', href: urls.talent, active: currentApp === 'talent' },
    { name: 'Labs', href: urls.labs, active: currentApp === 'labs' },
  ];

  const defaultCTA = {
    label: currentApp === 'academy' ? 'My Courses' : 'Get Started',
    href: ctaHref || (currentApp === 'academy' ? '/login' : urls.hub),
    variant: currentApp === 'academy' ? 'primary' : 'secondary',
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href={urls.hub} className="hover:opacity-80 transition-opacity">
          <BrandLogo />
        </a>

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

        <div className="flex items-center gap-6">
          <Button
            variant={defaultCTA.variant as any}
            size="sm"
            className="rounded-full px-8 shadow-primary/20"
            as={defaultCTA.href ? 'a' : 'button'}
            href={defaultCTA.href}
          >
            {ctaLabel || defaultCTA.label}
          </Button>
        </div>
      </div>
    </nav>
  );
};