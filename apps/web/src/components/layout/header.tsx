'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { SignOutModal } from './sign-out-modal';
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
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const title =
    routeTitleMap[pathname] ||
    Object.entries(routeTitleMap).find(([route]) => pathname.startsWith(route))?.[1] ||
    'Career Clarity';

  // Close menu on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmSignOut = () => {
    clearAuth();
    setShowConfirmModal(false);
    setMenuOpen(false);
    router.push('/dashboard');
  };

  return (
    <>
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
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-secondary/60 border border-transparent hover:border-border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-expanded={menuOpen}
                aria-label="User Profile Menu"
              >
                <div className="h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-semibold text-xs shadow-sm">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 hidden sm:block ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Ultra-Professional Profile Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-card border border-border/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2.5 border-b border-border/50">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {user.name || 'Software Engineer'}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                        {user.yearsExp ? `${user.yearsExp} YOE` : 'Verified Engineer'}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowConfirmModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-destructive hover:bg-destructive/10 transition-colors font-medium text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
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

      {/* Center Screen Confirmation Sign Out Modal */}
      <SignOutModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}
