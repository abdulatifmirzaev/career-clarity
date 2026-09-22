'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  FileCheck2,
  HelpCircle,
  LayoutDashboard,
  Layers,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { SignOutModal } from './sign-out-modal';

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
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [showSignOut, setShowSignOut] = React.useState(false);

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
      <nav aria-label="Main Navigation" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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

      {/* User Footer Section */}
      <div className="p-4 border-t border-border/40 bg-card/20">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-semibold text-xs shrink-0">
                {user.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold truncate text-foreground">
                  {user.name || 'Yazılım Mühendisi'}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 min-h-[36px] min-w-[36px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => setShowSignOut(true)}
              title="Oturumu Kapat"
              aria-label="Oturumu Kapat"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground py-2 border border-border/60 rounded-md min-h-[44px]"
            >
              <UserIcon className="h-3.5 w-3.5" />
              Sign In
            </Link>
            <Link
              href="/onboarding"
              className="w-full flex items-center justify-center text-xs font-medium bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 min-h-[44px]"
            >
              Start Assessment
            </Link>
          </div>
        )}
      </div>

      <SignOutModal
        isOpen={showSignOut}
        onClose={() => setShowSignOut(false)}
        onConfirm={() => {
          clearAuth();
          setShowSignOut(false);
          router.push('/auth/login');
        }}
      />
    </aside>
  );
}
