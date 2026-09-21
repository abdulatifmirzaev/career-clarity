'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Database,
  Layers,
  Layout,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { AssessmentQuizQuestion, RoleType } from '@career-clarity/shared-types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

const ROLES: {
  id: RoleType;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'backend',
    title: 'Backend Engineer',
    desc: 'APIs, databases, distributed systems, and performance tuning',
    icon: Database,
  },
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    desc: 'React, Next.js, web performance, UI architecture, and UX',
    icon: Layout,
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Engineer',
    desc: 'End-to-end product delivery across frontend and cloud services',
    icon: Layers,
  },
  {
    id: 'ai_engineer',
    title: 'AI / ML Engineer',
    desc: 'LLMs, RAG systems, model evaluation, and intelligent agents',
    icon: Bot,
  },
];

const STACK_PRESETS = [
  'TypeScript',
  'Node.js',
  'React',
  'Next.js',
  'PostgreSQL',
  'Python',
  'Go',
  'Docker',
  'AWS',
  'GraphQL',
  'Redis',
  'Tailwind CSS',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth } = useAuthStore();

  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [role, setRole] = React.useState<RoleType>('backend');
  const [yearsExp, setYearsExp] = React.useState<number>(user?.yearsExp ?? 3);
  const [currentTitle, setCurrentTitle] = React.useState('Software Engineer');
  const [selectedStack, setSelectedStack] = React.useState<string[]>([
    'TypeScript',
    'React',
    'PostgreSQL',
  ]);
  const [targetCompany, setTargetCompany] = React.useState('Google');

  // Diagnostic Quiz Questions
  const [questions, setQuestions] = React.useState<AssessmentQuizQuestion[]>([]);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [isLoadingQuiz, setIsLoadingQuiz] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Auto-login demo user if user opens onboarding without logging in
  React.useEffect(() => {
    async function ensureGuestOrAuth() {
      if (!isAuthenticated) {
        try {
          const res = await apiClient<{
            accessToken: string;
            refreshToken: string;
            user: {
              id: string;
              email: string;
              name: string | null;
              yearsExp: number | null;
              primaryStack: string | null;
              createdAt: string;
            };
          }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
              email: 'alex.chen@careerclarity.dev',
              password: 'demo12345',
            }),
          });
          setAuth(res.user, res.accessToken, res.refreshToken);
        } catch {
          // Keep as is
        }
      }
    }
    ensureGuestOrAuth();
  }, [isAuthenticated, setAuth]);

  // Load quiz questions when role changes or step 3 entered
  const loadQuiz = React.useCallback(async (selectedRole: RoleType) => {
    setIsLoadingQuiz(true);
    try {
      const q = await apiClient<AssessmentQuizQuestion[]>(`/assessment/quiz?role=${selectedRole}`);
      setQuestions(q);
      const initialAns: Record<string, number> = {};
      q.forEach((item) => {
        initialAns[item.id] = 1; // default to first/second choice
      });
      setAnswers(initialAns);
    } catch {
      // fallback questions if network issue
    } finally {
      setIsLoadingQuiz(false);
    }
  }, []);

  const toggleStack = (tech: string) => {
    setSelectedStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech],
    );
  };

  const handleNext = async () => {
    setErrorMsg(null);
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      await loadQuiz(role);
      setStep(3);
    } else if (step === 3) {
      setStep(4);
      await handleSubmitAssessment();
    }
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      await apiClient('/assessment/submit', {
        method: 'POST',
        body: JSON.stringify({
          role,
          yearsExp: Number(yearsExp),
          answers: formattedAnswers,
          primaryStack: selectedStack.join(', '),
        }),
      });

      // Brief delay for delightful UX sensation
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to generate report');
      setIsSubmitting(false);
    }
  };

  const progressValue = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-background via-background/90 to-background/50">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>STEP {step} OF 4</span>
            <span>
              {step === 1
                ? 'Engineering Discipline'
                : step === 2
                  ? 'Tech Stack & Goals'
                  : step === 3
                    ? 'AI-Era Diagnostic'
                    : 'Report Generation'}
            </span>
          </div>
          <Progress value={progressValue} className="h-1.5" />
        </div>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl">
          {/* STEP 1: Discipline & Experience */}
          {step === 1 && (
            <>
              <CardHeader>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground w-fit mb-2">
                  <Code2 className="h-3.5 w-3.5 text-primary" />
                  <span>Phase 1 • Foundations</span>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  What is your primary engineering track?
                </CardTitle>
                <CardDescription>
                  Select your primary discipline to calibrate your benchmark models and skill
                  roadmap.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={cn(
                          'flex flex-col items-start p-4 rounded-xl border text-left transition-all min-h-[96px]',
                          isSelected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
                            : 'border-border/70 hover:border-border hover:bg-secondary/40',
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            className={cn(
                              'h-5 w-5',
                              isSelected ? 'text-primary' : 'text-muted-foreground',
                            )}
                          />
                          <span className="font-semibold text-sm text-foreground">{r.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="yearsExp">Years of Professional Experience</Label>
                    <span className="font-mono text-sm font-semibold text-primary">
                      {yearsExp} {yearsExp === 1 ? 'Year' : 'Years'}
                    </span>
                  </div>
                  <Input
                    id="yearsExp"
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={yearsExp}
                    onChange={(e) => setYearsExp(Number(e.target.value))}
                    className="h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                    <span>0 (Junior/Entry)</span>
                    <span>5 (Senior)</span>
                    <span>10+ (Staff/Principal)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentTitle">Current Job Title (Optional)</Label>
                  <Input
                    id="currentTitle"
                    value={currentTitle}
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    placeholder="e.g. Mid Software Engineer"
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* STEP 2: Stack & Target Company */}
          {step === 2 && (
            <>
              <CardHeader>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground w-fit mb-2">
                  <BrainCircuit className="h-3.5 w-3.5 text-primary" />
                  <span>Phase 2 • Tech Ecosystem</span>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  What technologies do you command daily?
                </CardTitle>
                <CardDescription>
                  Select your core technologies and your target company benchmark model.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Primary Technologies (Select all that apply)</Label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {STACK_PRESETS.map((tech) => {
                      const isSelected = selectedStack.includes(tech);
                      return (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => toggleStack(tech)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all min-h-[36px]',
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                              : 'border-border/70 bg-secondary/40 text-muted-foreground hover:text-foreground',
                          )}
                        >
                          {tech}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label>Primary Benchmark Company Target</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Google', 'Meta', 'Stripe', 'Regional Tier-1'].map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => setTargetCompany(comp)}
                        className={cn(
                          'p-3 rounded-lg border text-center text-xs font-semibold transition-all min-h-[44px]',
                          targetCompany === comp
                            ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                            : 'border-border/60 hover:bg-secondary/40 text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* STEP 3: Diagnostic Assessment */}
          {step === 3 && (
            <>
              <CardHeader>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground w-fit mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Phase 3 • Diagnostic Questions</span>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Architecture & AI Leverage Assessment
                </CardTitle>
                <CardDescription>
                  A few quick conceptual questions to evaluate where you stand on system trade-offs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingQuiz ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">
                      Calibrating questions for {role}...
                    </span>
                  </div>
                ) : (
                  questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="space-y-3 p-4 rounded-xl border border-border/50 bg-secondary/20"
                    >
                      <div className="flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-sm font-medium text-foreground">{q.question}</p>
                      </div>

                      <div className="space-y-2 pl-7">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = answers[q.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                              className={cn(
                                'w-full text-left p-3 rounded-lg border text-xs leading-relaxed transition-all min-h-[44px]',
                                isSelected
                                  ? 'border-primary bg-primary/10 text-foreground font-medium ring-1 ring-primary'
                                  : 'border-border/60 hover:bg-secondary/50 text-muted-foreground hover:text-foreground',
                              )}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </>
          )}

          {/* STEP 4: Report Generation Loader */}
          {step === 4 && (
            <CardContent className="py-16 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary animate-pulse">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">
                  Synthesizing Your Career Clarity Report
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Benchmarking against Big Tech levels, cross-referencing your skill tree, and
                  structuring next steps...
                </p>
              </div>
              <Loader2 className="h-6 w-6 animate-spin text-primary mt-4" />
              {errorMsg && (
                <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs mt-4">
                  {errorMsg}
                </div>
              )}
            </CardContent>
          )}

          {/* Footer Controls */}
          {step < 4 && (
            <CardFooter className="flex items-center justify-between border-t border-border/40 pt-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                  className="min-h-[44px]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoadingQuiz || isSubmitting}
                className="min-h-[44px]"
              >
                <span>{step === 3 ? 'Generate Clarity Report' : 'Continue'}</span>
                {step === 3 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
