import Link from 'next/link';
import { ArrowRight, Compass, Sparkles, Layers, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 bg-gradient-to-b from-background via-background/90 to-background/50">
      {/* Navigation Header */}
      <header className="w-full max-w-6xl flex items-center justify-between py-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            CC
          </div>
          <span className="font-semibold text-lg tracking-tight">Career Clarity</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
          >
            Get Clarity
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center max-w-4xl my-auto py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground mb-6 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Calibrated for 2026 AI-Driven Software Engineering</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground max-w-3xl">
          Know your true level. <br />
          <span className="bg-gradient-to-r from-primary via-muted-foreground to-primary bg-clip-text text-transparent">
            Navigate the AI era.
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed">
          Benchmark your engineering level across global tech tiers, master irreplaceable skills,
          and unlock structured interview prep tailored precisely to where you stand.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Start Free Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/leveling"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-base font-medium text-foreground hover:bg-secondary/60 transition-colors"
          >
            Compare Tech Levels
          </Link>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-t border-border/40">
        <div className="p-6 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
          <Layers className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-semibold text-lg text-foreground mb-2">Cross-Company Leveling</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Standardize your title across Google, Meta, high-growth startups, and local tech
            ecosystems.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
          <Compass className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-semibold text-lg text-foreground mb-2">AI-Era Skill Roadmaps</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Interactive skill trees categorizing competencies as critical, AI-accelerated, or
            obsolete.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
          <ShieldCheck className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-semibold text-lg text-foreground mb-2">Targeted Interview Bank</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Curated system design, algorithm, and behavioral questions calibrated to your target
            tier.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl py-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
        <span>© 2026 Career Clarity. Crafted for engineering excellence.</span>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span>Turborepo Monorepo</span>
          <span>•</span>
          <span>Next.js 15</span>
          <span>•</span>
          <span>NestJS</span>
        </div>
      </footer>
    </main>
  );
}
