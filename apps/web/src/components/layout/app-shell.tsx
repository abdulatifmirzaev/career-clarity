'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { MobileNav } from './mobile-nav';
import { Sidebar } from './sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isStandalonePage =
    pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/onboarding');

  if (isStandalonePage) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-300">
          {children}
        </main>
      </div>

      {/* Mobile Fixed Bottom Nav */}
      <MobileNav />
    </div>
  );
}
