import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  Sparkles,
  Layers,
  CheckCircle2,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between border-b border-border/40 sticky top-0 z-30 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-500/20">
            CC
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-foreground">
              Career Clarity
            </span>
            <span className="text-[10px] text-purple-400 uppercase tracking-widest font-mono font-medium">
              AI-Era Engineering
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-muted-foreground">
            <Link href="/leveling" className="hover:text-foreground transition-colors">
              Level Comparator
            </Link>
            <Link href="/roadmap" className="hover:text-foreground transition-colors">
              AI Roadmaps
            </Link>
            <Link href="/interview-prep" className="hover:text-foreground transition-colors">
              Interview Bank
            </Link>
          </nav>

          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white transition-all h-9 px-4 shadow-md shadow-purple-600/30 hover:scale-[1.02]"
          >
            <span>Try Free Diagnostic</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/40 px-3.5 py-1 text-xs text-purple-300 mb-8 backdrop-blur-md shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>Calibrated for 2026 AI-Driven Software Engineering</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.1]">
          Know your true level. <br />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            Navigate the AI era with precision.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed">
          Benchmark your engineering level across Silicon Valley Big Tech, Stripe high-bar, and
          regional tech ecosystems. Get instant skill roadmaps and targeted interview preparation —
          100% free, zero signup required.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
          >
            <span>Try Free Diagnostic</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card/60 px-7 py-3.5 text-sm sm:text-base font-medium text-foreground hover:bg-secondary/80 backdrop-blur-md transition-all"
          >
            <span>Explore Live Dashboard</span>
            <BarChart3 className="h-4 w-4 text-purple-400" />
          </Link>
        </div>

        {/* Quick Highlights */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free & Open Access</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Registration Needed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant Calibration Report</span>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guided Workflow Section */}
      <section className="w-full bg-slate-950/70 border-y border-border/40 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest font-mono">
              Step-by-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2">
              How the Career Diagnostic Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Go from quick onboarding survey to a complete engineering level diagnostic in under 2
              minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-card/60 border border-purple-900/30 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-all">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-xs">
                  01
                </div>
                <h3 className="font-semibold text-base text-white">Track & Stack Survey</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Select your engineering discipline (Backend, Frontend, Full-Stack, AI/ML) and
                  primary stack.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-medium text-purple-400 flex items-center gap-1">
                <span>1-Min Survey</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-card/60 border border-purple-900/30 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-all">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-xs">
                  02
                </div>
                <h3 className="font-semibold text-base text-white">AI & System Quiz</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Answer 5 high-bar technical questions on architecture, AI tool autonomy, and
                  concurrency.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-medium text-purple-400 flex items-center gap-1">
                <span>Interactive Assessment</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-card/60 border border-purple-900/30 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-all">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-xs">
                  03
                </div>
                <h3 className="font-semibold text-base text-white">Cross-Company Leveling</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Instantly map your score to Google L3-L7, Meta, Stripe high-bar, and regional
                  compensation tiers.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-medium text-purple-400 flex items-center gap-1">
                <span>Level Comparator</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-card/60 border border-purple-900/30 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-all">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-xs">
                  04
                </div>
                <h3 className="font-semibold text-base text-white">Skill Roadmap & Prep</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Unlock tailored interview questions and a 2026 skill tree (Critical,
                  AI-Accelerated, Obsolete).
                </p>
              </div>
              <div className="pt-2 text-[11px] font-medium text-purple-400 flex items-center gap-1">
                <span>Action Plan</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
            >
              <span>Start Survey & Diagnostic Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Platform Modules */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Built for 2026 Software Engineers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Explore the core engineering intelligence modules available in the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/leveling"
            className="p-6 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md hover:border-purple-500/50 transition-all group"
          >
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2 flex items-center justify-between">
              <span>Cross-Company Leveling</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Compare software engineering levels across Silicon Valley Big Tech (Google L5 / Meta
              E5), Stripe high-bar, and regional ecosystems.
            </p>
          </Link>

          <Link
            href="/roadmap"
            className="p-6 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md hover:border-purple-500/50 transition-all group"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2 flex items-center justify-between">
              <span>AI-Era Skill Roadmaps</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Interactive skill competency trees classifying skills as Critical (High-Leverage),
              AI-Accelerated, or Obsolete.
            </p>
          </Link>

          <Link
            href="/interview-prep"
            className="p-6 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md hover:border-purple-500/50 transition-all group"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2 flex items-center justify-between">
              <span>Targeted Interview Bank</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Curated system design, concurrency, and architecture interview prep tailored
              specifically to your target level.
            </p>
          </Link>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to benchmark your engineering level?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Take the free 2-minute diagnostic and get instant clarity on your technical standing.
            </p>
            <div className="pt-2">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/40 transition-all hover:scale-105"
              >
                <span>Try Free Diagnostic</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-8 bg-slate-950/80 text-xs text-muted-foreground mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Career Clarity</span>
            <span>© 2026. Free Instant Engineering Tool.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Turborepo Monorepo</span>
            <span>•</span>
            <span>Next.js 15</span>
            <span>•</span>
            <span>NestJS</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
