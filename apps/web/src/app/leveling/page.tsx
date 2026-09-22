'use client';

import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Award, Building2, CheckCircle2, Compass, Layers, TrendingUp } from 'lucide-react';
import { LevelComparisonRequest, LevelComparisonResult } from '@career-clarity/shared-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

const SYSTEM_DESIGN_LEVELS = [
  {
    value: 1,
    title: 'Single-node APIs & CRUD',
    desc: 'Basic relational schemas and endpoint routing',
  },
  {
    value: 2,
    title: 'Caching & Read Replicas',
    desc: 'Redis caching, indexing, background workers',
  },
  {
    value: 3,
    title: 'Distributed Queues & Partitions',
    desc: 'Kafka/RabbitMQ, sharding, event-driven data flows',
  },
  {
    value: 4,
    title: 'Consensus & Failure Domains',
    desc: 'Raft/Paxos, circuit breakers, zero-loss idempotency',
  },
  {
    value: 5,
    title: 'Planetary Multi-Region Scale',
    desc: 'Active-active multi-region, global consensus, cell architecture',
  },
];

const LEADERSHIP_LEVELS = [
  {
    value: 1,
    title: 'Task Execution',
    desc: 'Works on well-defined tickets with direct senior guidance',
  },
  {
    value: 2,
    title: 'Feature Ownership',
    desc: 'Independently executes full features from specs to deployment',
  },
  {
    value: 3,
    title: 'Multi-Engineer Tech Lead',
    desc: 'Leads sprint architectures, unblocks peers, leads code reviews',
  },
  {
    value: 4,
    title: 'Cross-Team & Domain Scope',
    desc: 'Defines multi-quarter architectural strategy across multiple squads',
  },
  {
    value: 5,
    title: 'Org-Wide Technical Strategy',
    desc: 'Sets engineering standards, platform vision, and industry influence',
  },
];

const QUICK_TITLES = [
  'Junior Software Engineer',
  'Software Engineer II',
  'Senior Software Engineer',
  'Lead / Staff Engineer',
  'Principal Architect',
];

export default function LevelingPage() {
  const { user } = useAuthStore();

  const [yearsExp, setYearsExp] = React.useState<number>(user?.yearsExp ?? 4);
  const [currentTitle, setCurrentTitle] = React.useState<string>('Senior Software Engineer');
  const [systemDesignScore, setSystemDesignScore] = React.useState<number>(3);
  const [leadershipScore, setLeadershipScore] = React.useState<number>(3);

  // Level comparison mutation
  const compareMutation = useMutation({
    mutationFn: (payload: LevelComparisonRequest) =>
      apiClient<LevelComparisonResult>('/leveling/compare', {
        method: 'POST',
        body: payload,
      }),
  });

  // Initial trigger
  React.useEffect(() => {
    compareMutation.mutate({
      yearsExp,
      currentTitle,
      systemDesignScore,
      leadershipScore,
    });
  }, []);

  const handleRunBenchmark = (e: React.FormEvent) => {
    e.preventDefault();
    compareMutation.mutate({
      yearsExp,
      currentTitle,
      systemDesignScore,
      leadershipScore,
    });
  };

  const result = compareMutation.data;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-card/80 via-card/50 to-primary/5 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Cross-Company Leveling Engine
            </h1>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary text-[11px] font-mono"
            >
              Algorithmic Benchmark
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Normalize your scope, systems depth, and leadership against standardized ladders across
            Google, Meta, Stripe, and Regional Tech.
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Real-time Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calibration Parameters (5 cols) */}
        <form onSubmit={handleRunBenchmark} className="lg:col-span-5 space-y-6">
          <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">Profile Calibration</CardTitle>
              </div>
              <CardDescription>
                Adjust parameters to calculate your equivalent leveling benchmark.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Years of Experience */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="yearsExp"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Years of Experience (YOE)
                  </Label>
                  <span className="text-sm font-bold font-mono text-primary px-2 py-0.5 rounded bg-primary/10">
                    {yearsExp} {yearsExp === 1 ? 'Year' : 'Years'}
                  </span>
                </div>
                <input
                  id="yearsExp"
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={yearsExp}
                  aria-label="Years of professional experience"
                  aria-valuemin={0}
                  aria-valuemax={20}
                  aria-valuenow={yearsExp}
                  onChange={(e) => setYearsExp(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-2 bg-secondary rounded-lg appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* Current Job Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Current Official Title
                </Label>
                <Input
                  id="title"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="bg-background/50 text-sm"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_TITLES.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setCurrentTitle(t)}
                      aria-pressed={currentTitle === t}
                      className={`text-[11px] px-2.5 py-1.5 rounded-md border transition-all min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        currentTitle === t
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* System Design Score (1-5) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    System Design Scope
                  </Label>
                  <span className="text-xs font-bold font-mono text-primary">
                    Score {systemDesignScore}/5
                  </span>
                </div>
                <div className="space-y-1.5">
                  {SYSTEM_DESIGN_LEVELS.map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => setSystemDesignScore(item.value)}
                      aria-pressed={systemDesignScore === item.value}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        systemDesignScore === item.value
                          ? 'border-primary/80 bg-primary/10 text-foreground ring-1 ring-primary/30'
                          : 'border-border/50 bg-secondary/20 hover:bg-secondary/40 text-muted-foreground'
                      }`}
                    >
                      <div className="font-semibold text-foreground flex items-center justify-between">
                        <span>
                          Level {item.value}: {item.title}
                        </span>
                        {systemDesignScore === item.value && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Leadership Score (1-5) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Leadership & Scope Depth
                  </Label>
                  <span className="text-xs font-bold font-mono text-primary">
                    Score {leadershipScore}/5
                  </span>
                </div>
                <div className="space-y-1.5">
                  {LEADERSHIP_LEVELS.map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => setLeadershipScore(item.value)}
                      aria-pressed={leadershipScore === item.value}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        leadershipScore === item.value
                          ? 'border-primary/80 bg-primary/10 text-foreground ring-1 ring-primary/30'
                          : 'border-border/50 bg-secondary/20 hover:bg-secondary/40 text-muted-foreground'
                      }`}
                    >
                      <div className="font-semibold text-foreground flex items-center justify-between">
                        <span>
                          Level {item.value}: {item.title}
                        </span>
                        {leadershipScore === item.value && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={compareMutation.isPending}
                className="w-full min-h-[44px] text-xs font-semibold"
              >
                {compareMutation.isPending ? 'Calculating Benchmark...' : 'Recalculate Benchmarks'}
              </Button>
            </CardContent>
          </Card>
        </form>

        {/* Right Column: Comparative Calibration Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Calibrated Result Card */}
          <Card className="border-border/60 bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-bold">
                    Estimated Normalized Benchmark
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-primary/40 bg-primary/10 text-primary"
                >
                  L{result?.estimatedLevelOrder ?? 3} Standard
                </Badge>
              </div>
              <CardDescription>
                Calibrated against Silicon Valley Big Tech, Stripe high-bar, and regional
                engineering expectations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Target Calibrated Title
                  </span>
                  <div className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                    {result?.estimatedTitle ?? 'Senior Software Engineer'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Normalized Level Order:{' '}
                    <span className="font-bold text-foreground">
                      {result?.estimatedLevelOrder ?? 3}
                    </span>{' '}
                    / 5
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Scope Confidence</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono">
                      94% Calibrated
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Breakdown Cards */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5" />
                  Target Company Equivalence Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    result?.companyBreakdown || [
                      {
                        companyName: 'Google',
                        matchedLevel: 'L5 (Senior)',
                        levelOrder: 3,
                        difference: 0,
                      },
                      {
                        companyName: 'Meta',
                        matchedLevel: 'E5 (Senior)',
                        levelOrder: 3,
                        difference: 0,
                      },
                      {
                        companyName: 'Stripe',
                        matchedLevel: 'L3 (Senior SE)',
                        levelOrder: 3,
                        difference: 0,
                      },
                      {
                        companyName: 'Regional Tier-1',
                        matchedLevel: 'Senior Engineer',
                        levelOrder: 3,
                        difference: 0,
                      },
                    ]
                  ).map((item, idx) => {
                    const diff = item.difference;
                    const diffBadge =
                      diff === 0 ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        >
                          On Level
                        </Badge>
                      ) : diff > 0 ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono border-blue-500/30 bg-blue-500/10 text-blue-400"
                        >
                          +{diff} Stretch
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono border-amber-500/30 bg-amber-500/10 text-amber-400"
                        >
                          {diff} Gap
                        </Badge>
                      );

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/30 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            {item.companyName}
                          </span>
                          {diffBadge}
                        </div>
                        <div className="text-sm font-bold text-primary font-mono">
                          {item.matchedLevel}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {item.companyName === 'Google' &&
                            'Autonomous execution across complex distributed service ownership.'}
                          {item.companyName === 'Meta' &&
                            'High velocity engineering impact, metrics-driven bottom-up leadership.'}
                          {item.companyName === 'Stripe' &&
                            'Craftsmanship, API ergonomics, ultra-high reliability and zero-downtime.'}
                          {item.companyName === 'Regional Tier-1' &&
                            'Core architectural anchor, mentor, technical lead for key revenue lines.'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Insights for Next Promotion */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <span>Promotion Velocity Driver</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  To advance from <span className="font-semibold">{result?.estimatedTitle}</span> to
                  the next tier (Staff / Principal), focus less on coding speed and prioritize{' '}
                  <span className="font-semibold text-primary">
                    unambiguous technical specifications
                  </span>
                  , defining cross-system failure domains, and mentoring multiple engineers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Ladder Comparison */}
          <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">
                  Standard Cross-Company Matrix
                </CardTitle>
              </div>
              <CardDescription>
                Direct mapping across standardized industry leveling tiers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="py-2.5 px-3 font-semibold">Level Order</th>
                      <th className="py-2.5 px-3 font-semibold">Google</th>
                      <th className="py-2.5 px-3 font-semibold">Meta</th>
                      <th className="py-2.5 px-3 font-semibold">Stripe</th>
                      <th className="py-2.5 px-3 font-semibold">Regional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {[
                      {
                        order: 'Level 1',
                        role: 'Entry / Junior',
                        g: 'L3 (SWE II)',
                        m: 'E3 (Rotational/Junior)',
                        s: 'L1 (SE I)',
                        r: 'Junior Developer',
                      },
                      {
                        order: 'Level 2',
                        role: 'Mid-Level',
                        g: 'L4 (SWE III)',
                        m: 'E4 (SWE)',
                        s: 'L2 (SE II)',
                        r: 'Mid Software Engineer',
                      },
                      {
                        order: 'Level 3',
                        role: 'Senior',
                        g: 'L5 (Senior SWE)',
                        m: 'E5 (Senior SWE)',
                        s: 'L3 (Senior SE)',
                        r: 'Senior Software Engineer',
                      },
                      {
                        order: 'Level 4',
                        role: 'Staff',
                        g: 'L6 (Staff SWE)',
                        m: 'E6 (Staff SWE)',
                        s: 'L4 (Staff SE)',
                        r: 'Staff Engineer / Lead',
                      },
                      {
                        order: 'Level 5',
                        role: 'Principal',
                        g: 'L7 (Senior Staff)',
                        m: 'E7 (Senior Staff)',
                        s: 'L5 (Principal)',
                        r: 'Principal Architect',
                      },
                    ].map((row, i) => {
                      const isCurrent = result?.estimatedLevelOrder === i + 1;
                      return (
                        <tr
                          key={i}
                          className={`transition-colors ${
                            isCurrent
                              ? 'bg-primary/10 font-medium text-foreground'
                              : 'hover:bg-secondary/20 text-muted-foreground'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono text-[11px] text-foreground flex items-center gap-1.5">
                            {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                            {row.order}
                          </td>
                          <td className="py-2.5 px-3">{row.g}</td>
                          <td className="py-2.5 px-3">{row.m}</td>
                          <td className="py-2.5 px-3">{row.s}</td>
                          <td className="py-2.5 px-3">{row.r}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
