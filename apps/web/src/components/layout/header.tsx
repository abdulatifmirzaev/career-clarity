'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const { user, isAuthenticated } = useAuthStore();

  const title =
    routeTitleMap[pathname] ||
    Object.entries(routeTitleMap).find(([route]) => pathname.startsWith(route))?.[1] ||
    'Career Clarity';

  return (
    <header className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Mobile Brand / Desktop Title */}
      <div className="flex items-center gap-3">
        <Link href="/" className="md:hidden flex items-center gap-2">
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
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs text-muted-foreground font-mono">
              {user.yearsExp ? `${user.yearsExp} YOE` : 'Engineer'}
            </span>
            <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-semibold text-xs">
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
            </div>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1 transition-colors min-h-[44px] flex items-center"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
