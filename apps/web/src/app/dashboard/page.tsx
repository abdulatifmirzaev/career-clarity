'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileCheck2,
  Flame,
  HelpCircle,
  Layers,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { AssessmentDto, CareerClarityReport } from '@career-clarity/shared-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

interface RoadmapProgressSummary {
  totalSkills: number;
  mastered: number;
  inProgress: number;
  notStarted: number;
  completionPercentage: number;
}

interface InterviewStatsSummary {
  totalQuestions: number;
  solvedCount: number;
  progressPercentage: number;
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();

  // 1. Fetch Latest Assessment
  const { data: assessment } = useQuery({
    queryKey: ['latest-assessment'],
    queryFn: () => apiClient<AssessmentDto | null>('/assessment/latest'),
    enabled: isAuthenticated,
  });

  // 2. Fetch Skill Roadmap Progress
  const { data: skillProgress } = useQuery({
    queryKey: ['roadmap-user-progress'],
    queryFn: () => apiClient<RoadmapProgressSummary>('/roadmap/user/progress'),
    enabled: isAuthenticated,
  });

  // 3. Fetch Interview Question Stats
  const { data: interviewStats } = useQuery({
    queryKey: ['interview-stats'],
    queryFn: () => apiClient<InterviewStatsSummary>('/interview/stats'),
    enabled: isAuthenticated,
  });

  const report: CareerClarityReport | null = assessment?.reportJson || null;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-card/80 via-card/50 to-primary/5 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Engineering Career Diagnostic Report
            </h2>
            <Badge
              variant="outline"
              className="text-[11px] font-mono border-primary/40 bg-primary/10 text-primary"
            >
              {user?.yearsExp ? `${user.yearsExp} YOE` : 'Verified Engineer'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Here is your live Career Clarity Report, cross-company benchmarks, and AI-era skill
            trajectory.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[40px] text-xs">
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Retake Diagnostic</span>
            </Button>
          </Link>
          <Link href="/roadmap" className="w-full sm:w-auto">
            <Button
              size="sm"
              className="w-full sm:w-auto min-h-[40px] text-xs bg-primary text-primary-foreground"
            >
              <span>View Roadmap</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Estimated Level
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              Level {report?.overallLevelOrder ?? (user?.yearsExp && user.yearsExp >= 4 ? 3 : 2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {report?.overallTitle ? report.overallTitle.split('(')[0] : 'Mid-Level Engineer'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Skills Mastered
            </CardTitle>
            <Compass className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {skillProgress?.mastered ?? 2} / {skillProgress?.totalSkills ?? 21}
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                {skillProgress?.completionPercentage ?? 10}%
              </span>
            </div>
            <Progress value={skillProgress?.completionPercentage ?? 10} className="h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Interview Questions
            </CardTitle>
            <HelpCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {interviewStats?.solvedCount ?? 0} / {interviewStats?.totalQuestions ?? 30}
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                {interviewStats?.progressPercentage ?? 0}%
              </span>
            </div>
            <Progress value={interviewStats?.progressPercentage ?? 0} className="h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Big Tech Target
            </CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              Google L{report?.overallLevelOrder ?? 3}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Meta E{report?.overallLevelOrder ?? 3} • Stripe L
              {Math.max(1, (report?.overallLevelOrder ?? 3) - 1)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Report & Skill Insights */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary Card */}
          <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">
                  Career Clarity Executive Summary
                </CardTitle>
              </div>
              <CardDescription>
                Calibrated diagnostic based on your technical scope and the 2026 AI-driven
                engineering landscape.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/90 leading-relaxed">
                {report?.summary ||
                  'You possess solid autonomous engineering foundations with strong core execution. In the AI era, high-leverage software career progression requires shifting focus from boilerplate endpoint creation to distributed system failure domains, zero-downtime data migrations, and architectural consensus.'}
              </p>

              {/* Recommended Next Steps */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Recommended High-Leverage Next Steps
                </h4>
                <div className="space-y-2">
                  {(
                    report?.recommendedNextSteps || [
                      'Master Distributed Consensus invariants (Raft / Paxos / Eventual Consistency)',
                      'Complete 5 Senior System Design questions with atomic distributed locks',
                      'Benchmark level expectations across Google L5 / Meta E5 standards',
                    ]
                  ).map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-secondary/30 text-xs text-foreground"
                    >
                      <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI-Era Skill Breakdown (3 Columns) */}
          <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">
                  AI-Era Skill Relevance Matrix
                </CardTitle>
              </div>
              <CardDescription>
                How your technical skill focus should shift in the age of AI engineering tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Critical */}
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-red-400" />
                    <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                      Critical Skills
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Irreplaceable in the AI era:</p>
                  <ul className="space-y-2 text-xs text-foreground/90">
                    {(
                      report?.skillAnalysis.criticalSkillsToLearn || [
                        'Distributed Systems & Consensus',
                        'Database Execution Plans',
                        'System Architecture Trade-offs',
                      ]
                    ).map((skill, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eased by AI */}
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                      AI Accelerated
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Automate with Copilot/Cursor:</p>
                  <ul className="space-y-2 text-xs text-foreground/90">
                    {(
                      report?.skillAnalysis.aiLeverageOpportunities || [
                        'CRUD REST Boilerplate',
                        'Unit Test Fixtures',
                        'Tailwind CSS Slicing',
                      ]
                    ).map((skill, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Declining */}
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      Declining Value
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Avoid spending months learning:
                  </p>
                  <ul className="space-y-2 text-xs text-foreground/90">
                    {(
                      report?.skillAnalysis.deprecatedOrDecliningSkills || [
                        'Handwritten Redux Boilerplate',
                        'Manual Web Memory Management',
                        'Legacy SOAP XML Wrappers',
                      ]
                    ).map((skill, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span className="leading-snug text-muted-foreground">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Cross-Company Benchmarks & Fast Navigation */}
        <div className="space-y-6">
          <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">Cross-Company Benchmarks</CardTitle>
              </div>
              <CardDescription>
                Where your profile maps across international tech tiers:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(
                report?.benchmarks || [
                  { companyName: 'Google', equivalentLevel: 'L5 (Senior)' },
                  { companyName: 'Meta', equivalentLevel: 'E5 (Senior)' },
                  { companyName: 'Stripe', equivalentLevel: 'L3 (Senior SE)' },
                  { companyName: 'Regional Tier-1', equivalentLevel: 'Senior Engineer' },
                ]
              ).map((bench, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-secondary/30"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-background flex items-center justify-center font-bold text-xs border border-border">
                      {bench.companyName.slice(0, 1)}
                    </div>
                    <span className="font-semibold text-xs text-foreground">
                      {bench.companyName}
                    </span>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs font-semibold">
                    {bench.equivalentLevel}
                  </Badge>
                </div>
              ))}

              <div className="pt-2">
                <Link href="/leveling" className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs min-h-[40px]">
                    <span>Compare Custom Responsibilities</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Action Navigation */}
          <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quick Pathways</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/roadmap"
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-secondary/40 transition-colors group min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    Interactive Skill Tree
                  </span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/interview-prep"
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-secondary/40 transition-colors group min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    Targeted Interview Questions
                  </span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/assessment"
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-secondary/40 transition-colors group min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">Diagnostic Quiz</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
