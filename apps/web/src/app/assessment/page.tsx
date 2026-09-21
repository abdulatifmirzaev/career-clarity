'use client';

import * as React from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  Flame,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  AssessmentDto,
  AssessmentQuizQuestion,
  CareerClarityReport,
  RoleType,
  SubmitAssessmentRequest,
} from '@career-clarity/shared-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

const ROLES: { id: RoleType; label: string }[] = [
  { id: 'backend', label: 'Backend Architecture' },
  { id: 'frontend', label: 'Frontend & Web Platform' },
  { id: 'fullstack', label: 'Fullstack Engineering' },
  { id: 'ai_engineer', label: 'AI Systems Engineer' },
];

export default function AssessmentPage() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  const [selectedRole, setSelectedRole] = React.useState<RoleType>('backend');
  const [yearsExp, setYearsExp] = React.useState<number>(user?.yearsExp ?? 4);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = React.useState<'quiz' | 'report'>('quiz');

  // 1. Fetch Latest Assessment
  const { data: latestAssessment } = useQuery({
    queryKey: ['latest-assessment'],
    queryFn: () => apiClient<AssessmentDto | null>('/assessment/latest'),
    enabled: isAuthenticated,
  });

  // 2. Fetch Quiz Questions for selected role
  const { data: quizQuestions, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ['assessment-quiz', selectedRole],
    queryFn: () => apiClient<AssessmentQuizQuestion[]>(`/assessment/quiz?role=${selectedRole}`),
  });

  // Switch to report tab if assessment exists and user hasn't toggled quiz
  React.useEffect(() => {
    if (latestAssessment) {
      setActiveTab('report');
    }
  }, [latestAssessment]);

  // Submit assessment mutation
  const submitMutation = useMutation({
    mutationFn: (payload: SubmitAssessmentRequest) =>
      apiClient<AssessmentDto>('/assessment/submit', {
        method: 'POST',
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latest-assessment'] });
      queryClient.invalidateQueries({ queryKey: ['assessment-history'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap-user-progress'] });
      setActiveTab('report');
    },
  });

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizQuestions || quizQuestions.length === 0) return;

    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    submitMutation.mutate({
      role: selectedRole,
      yearsExp,
      answers: formattedAnswers,
      primaryStack: user?.primaryStack || 'TypeScript, Node.js, PostgreSQL',
    });
  };

  const questions = quizQuestions || [];
  const answeredCount = Object.keys(answers).length;
  const progressPercent =
    questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;
  const isComplete = questions.length > 0 && answeredCount === questions.length;

  const report: CareerClarityReport | null = latestAssessment?.reportJson || null;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-card/80 via-card/50 to-primary/5 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Diagnostic Assessment & Career Clarity Report
            </h1>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary text-[11px] font-mono"
            >
              2026 Calibrated
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Evaluate your architectural readiness, failure domain handling, and cross-company
            leveling benchmarks.
          </p>
        </div>

        {/* Tab switcher if report exists */}
        {latestAssessment && (
          <div className="flex items-center bg-secondary/50 p-1 rounded-lg border border-border/60 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'report'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Clarity Report</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'quiz'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Diagnostic Quiz</span>
            </button>
          </div>
        )}
      </div>

      {/* QUIZ TAB */}
      {activeTab === 'quiz' && (
        <form onSubmit={handleSubmitQuiz} className="space-y-6">
          {/* Controls: Role Selector & Experience */}
          <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Assessment Parameters</CardTitle>
              <CardDescription>
                Select your engineering discipline to load domain-calibrated architectural
                questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role Tabs */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Target Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((r) => (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => {
                          setSelectedRole(r.id);
                          setAnswers({});
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                          selectedRole === r.id
                            ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30'
                            : 'border-border/50 bg-secondary/20 hover:bg-secondary/40 text-muted-foreground'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Years of Experience
                    </label>
                    <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {yearsExp} {yearsExp === 1 ? 'Year' : 'Years'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={yearsExp}
                    onChange={(e) => setYearsExp(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer h-2 bg-secondary rounded-lg appearance-none mt-2"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Used to compare your current technical scope with typical industry tenure.
                  </p>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Completed: <strong className="text-foreground">{answeredCount}</strong> of{' '}
                  {questions.length} questions
                </span>
                <span className="font-mono text-primary font-bold">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </CardContent>
          </Card>

          {/* Question Cards */}
          <div className="space-y-4">
            {isLoadingQuiz ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Loading calibrated quiz questions...
              </div>
            ) : questions.length === 0 ? (
              <Card className="p-8 text-center border-border/60">
                <p className="text-sm text-muted-foreground">No questions found for this role.</p>
              </Card>
            ) : (
              questions.map((q, qIndex) => {
                const selectedOpt = answers[q.id];

                return (
                  <Card
                    key={q.id}
                    className={`border transition-all duration-200 backdrop-blur-sm ${
                      selectedOpt !== undefined
                        ? 'border-primary/40 bg-card/60'
                        : 'border-border/60 bg-card/30'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] border-primary/30 text-primary"
                        >
                          Question {qIndex + 1} of {questions.length} • Level {q.levelOrder} Scope
                        </Badge>
                        {selectedOpt !== undefined && (
                          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Answered
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-sm md:text-base font-semibold text-foreground pt-1 leading-snug">
                        {q.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      {q.options.map((option, optIdx) => {
                        const isSelected = selectedOpt === optIdx;
                        return (
                          <button
                            type="button"
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-3 min-h-[44px] ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-foreground font-medium ring-1 ring-primary/40'
                                : 'border-border/50 bg-secondary/15 hover:bg-secondary/35 text-muted-foreground'
                            }`}
                          >
                            <span
                              className={`h-5 w-5 rounded-full flex items-center justify-center font-mono text-[11px] shrink-0 font-bold ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'border border-border/70 text-muted-foreground'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-relaxed mt-0.5">{option}</span>
                          </button>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Submit Action Banner */}
          <div className="sticky bottom-4 z-20 p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              {isComplete ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> All questions completed. Ready to generate
                  Career Clarity Report.
                </span>
              ) : (
                <span>
                  Please answer all {questions.length} questions before generating your report.
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isComplete || submitMutation.isPending || !isAuthenticated}
              className="w-full sm:w-auto min-h-[44px] px-6 text-xs font-semibold"
            >
              {submitMutation.isPending ? 'Generating Report...' : 'Generate Career Clarity Report'}
              <Sparkles className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </form>
      )}

      {/* REPORT TAB */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <Card className="border-border/60 bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl font-bold">
                      Personal Career Clarity Report
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Calibrated from your diagnostic answers, architecture invariants, and 2026 AI
                    industry standards.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className="text-xs font-mono border-primary/40 bg-primary/10 text-primary"
                  >
                    Level {report?.overallLevelOrder ?? 3} Benchmark
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('quiz')}
                    className="text-xs min-h-[36px]"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Retake
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Level & Title Highlight */}
              <div className="p-5 rounded-2xl border border-border/60 bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Assessed Technical Level
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mt-0.5">
                    {report?.overallTitle ?? 'Senior Software Engineer'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Normalized Level Order:{' '}
                    <strong className="text-foreground">
                      Level {report?.overallLevelOrder ?? 3}
                    </strong>{' '}
                    • Role: <strong className="text-foreground">{report?.role ?? 'backend'}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link href="/dashboard">
                    <Button variant="default" size="sm" className="text-xs min-h-[40px]">
                      <span>View on Dashboard</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Narrative Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Architectural Scope Diagnostic
                </h3>
                <p className="text-sm text-foreground/90 leading-relaxed bg-card/50 p-4 rounded-xl border border-border/50">
                  {report?.summary ||
                    'You possess solid autonomous engineering foundations with strong core execution. In the AI era, high-leverage software career progression requires shifting focus from boilerplate endpoint creation to distributed system failure domains, zero-downtime data migrations, and architectural consensus.'}
                </p>
              </div>

              {/* Recommended Next Steps */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  High-Leverage Career Progression Steps
                </h3>
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

          {/* AI Skill Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Critical Skills */}
            <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-400" />
                  <CardTitle className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                    Critical Skills (Irreplaceable)
                  </CardTitle>
                </div>
                <CardDescription className="text-[11px]">
                  High human leverage in the age of AI:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-foreground/90">
                  {(
                    report?.skillAnalysis.criticalSkillsToLearn || [
                      'Distributed Systems & Consensus',
                      'Database Execution Plans',
                      'System Architecture Trade-offs',
                    ]
                  ).map((skill, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* AI Accelerated */}
            <Card className="border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <CardTitle className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    AI Accelerated
                  </CardTitle>
                </div>
                <CardDescription className="text-[11px]">
                  Automate and accelerate 10x with AI tools:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-foreground/90">
                  {(
                    report?.skillAnalysis.aiLeverageOpportunities || [
                      'CRUD REST Boilerplate',
                      'Unit Test Fixtures',
                      'Tailwind CSS Slicing',
                    ]
                  ).map((skill, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Declining Value */}
            <Card className="border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <CardTitle className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Declining Focus
                  </CardTitle>
                </div>
                <CardDescription className="text-[11px]">
                  Commoditized by intelligent models:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-foreground/90">
                  {(
                    report?.skillAnalysis.deprecatedOrDecliningSkills || [
                      'Handwritten Redux Boilerplate',
                      'Manual Web Memory Management',
                      'Legacy SOAP XML Wrappers',
                    ]
                  ).map((skill, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span className="leading-snug text-muted-foreground">{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Cross-Company Benchmarks Card */}
          <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">
                  Standardized Benchmark Mapping
                </CardTitle>
              </div>
              <CardDescription>
                How your diagnostic performance correlates with Big Tech and regional ladders:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    className="p-3.5 rounded-xl border border-border/50 bg-secondary/25 space-y-1"
                  >
                    <div className="text-xs font-bold text-foreground">{bench.companyName}</div>
                    <div className="text-sm font-bold font-mono text-primary">
                      {bench.equivalentLevel}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
