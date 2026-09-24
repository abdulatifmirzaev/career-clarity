'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { MobileNav } from './mobile-nav';
import { Sidebar } from './sidebar';
import { useAuthStore } from '@/stores/auth-store';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hydrateAuth } = useAuthStore();

  // Hydrate auth store on client mount
  React.useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  // Completely isolate Admin console from standard web shell
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  const isStandalonePage =
    pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/onboarding');

  if (isStandalonePage) {
    return (
      <div className="min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:m-2"
      >
        Skip to main content
      </a>

      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-300 outline-none"
        >
          {children}
        </main>
      </div>

      {/* Mobile Fixed Bottom Nav */}
      <MobileNav />
    </div>
  );
}
