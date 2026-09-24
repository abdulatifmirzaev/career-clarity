'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { useAuthStore } from '@/stores/auth-store';

const routeTitleMap: Record<string, string> = {
  '/dashboard': 'Career Clarity Dashboard',
  '/leveling': 'Cross-Company Level Comparator',
  '/roadmap': 'AI-Era Engineering Roadmap',
  '/interview-prep': 'Targeted Interview Question Bank',
  '/assessment': 'Self-Assessment & Career Diagnostic',
  '/onboarding': 'Career Onboarding Survey',
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [isResetting, setIsResetting] = React.useState(false);

  const title =
    routeTitleMap[pathname] ||
    Object.entries(routeTitleMap).find(([route]) => pathname.startsWith(route))?.[1] ||
    'Career Clarity';

  const handleResetSession = () => {
    setIsResetting(true);
    clearAuth();
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    setTimeout(() => {
      setIsResetting(false);
      router.push('/dashboard');
      router.refresh();
    }, 400);
  };

  return (
    <header className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Mobile Brand / Desktop Title */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="md:hidden flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
            CC
          </div>
        </Link>
        <h1 className="text-sm md:text-base font-semibold tracking-tight text-foreground truncate max-w-[200px] sm:max-w-md">
          {title}
        </h1>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />

        {/* Global Reset & Restart Button */}
        <button
          onClick={handleResetSession}
          disabled={isResetting}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          title="Reset session and restart diagnostic from scratch"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-cyan-400 ${isResetting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Reset & Restart</span>
          <span className="sm:hidden">Reset</span>
        </button>
      </div>
    </header>
  );
}
