'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Activity,
  Menu,
  X,
  Database,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are on the login page, don't show the admin sidebar/navigation
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('career_admin_token');
    localStorage.removeItem('career_admin_user');
    router.push('/admin/login');
  };

  const navItems = [
    {
      label: 'Genel Bakış & Metrikler',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      label: 'Kullanıcı Yönetimi',
      href: '/admin/users',
      icon: Users,
      active: pathname.startsWith('/admin/users'),
    },
    {
      label: 'Mülakat & Soru Bankası',
      href: '/admin/questions',
      icon: HelpCircle,
      active: pathname.startsWith('/admin/questions'),
    },
    {
      label: 'Sistem & Güvenlik Günlüğü',
      href: '/admin/audit',
      icon: Activity,
      active: pathname.startsWith('/admin/audit'),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row selection:bg-cyan-500 selection:text-white">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-white">Career Clarity Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex flex-col justify-between transition-transform md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white">Admin Console</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-slate-400">Canlı Sistem</span>
              </div>
            </div>
          </div>

          {/* Subdomain Notice */}
          <div className="px-4 py-3 mx-3 mt-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
              <span>Subdomain</span>
              <Database className="w-3 h-3 text-cyan-400" />
            </div>
            <code className="text-cyan-300 font-mono break-all text-[10px]">
              admin.career-clarity-one.vercel.app
            </code>
          </div>

          {/* Menu Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    item.active
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer & Actions */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-cyan-400">
                Yetkili Yönetici
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                SUPERADMIN
              </span>
            </div>
            <p className="text-xs font-medium text-white truncate">Abdulatif Mirzaev</p>
            <p className="text-[11px] text-slate-400 truncate">abdulatif.mirzaev2004@gmail.com</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors"
            >
              <span>Siteyi Gör</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/30 transition-colors"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-auto">
        {children}
      </main>
    </div>
  );
}
