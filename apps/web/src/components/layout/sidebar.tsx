'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, FileCheck2, HelpCircle, LayoutDashboard, Layers, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Level Comparator',
    href: '/leveling',
    icon: Layers,
  },
  {
    title: 'AI-Era Roadmap',
    href: '/roadmap',
    icon: Compass,
  },
  {
    title: 'Interview Bank',
    href: '/interview-prep',
    icon: HelpCircle,
  },
  {
    title: 'Self-Assessment',
    href: '/assessment',
    icon: FileCheck2,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border/40 bg-card/40 backdrop-blur-xl h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/40 gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
          CC
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-tight text-foreground">
            Career Clarity
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
            AI-Era Platform
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-secondary text-foreground font-semibold shadow-sm border border-border/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40',
              )}
            >
              <Icon
                className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Live Tool Status Badge */}
      <div className="p-4 border-t border-border/40 bg-card/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-medium text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Instant Engineering Tool
          </span>
        </div>
      </div>
    </aside>
  );
}
