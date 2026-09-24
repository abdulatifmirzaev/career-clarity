'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Filter, HelpCircle, Lightbulb, Save, Search, Sparkles } from 'lucide-react';
import { InterviewQuestionDto } from '@career-clarity/shared-types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

interface QuestionsResponse {
  items: InterviewQuestionDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UserStatsResponse {
  totalQuestions: number;
  solvedCount: number;
  progressPercentage: number;
  levelBreakdown?: Record<number, { total: number; solved: number }>;
}

const CATEGORIES = [
  'All Categories',
  'System Design',
  'Backend Architecture',
  'Frontend Architecture',
  'Data Consistency',
  'Performance & Caching',
  'Distributed Systems',
];

const LEVEL_TABS = [
  { level: 0, label: 'All Levels' },
  { level: 1, label: 'L1 • Junior' },
  { level: 2, label: 'L2 • Mid-Level' },
  { level: 3, label: 'L3 • Senior' },
  { level: 4, label: 'L4 • Staff' },
  { level: 5, label: 'L5 • Principal' },
];

export default function InterviewPrepPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All Categories');
  const [selectedLevel, setSelectedLevel] = React.useState(0);
  const [selectedRole, setSelectedRole] = React.useState<string>('all');
  const [userNotes, setUserNotes] = React.useState<Record<string, string>>({});
  const [solvedIds, setSolvedIds] = React.useState<Set<string>>(new Set());

  // 1. Fetch User Stats
  const { data: stats } = useQuery({
    queryKey: ['interview-stats'],
    queryFn: () => apiClient<UserStatsResponse>('/interview/stats'),
    enabled: isAuthenticated,
  });

  // 2. Fetch Questions
  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['interview-questions', selectedCategory, selectedLevel, selectedRole, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);
      if (selectedLevel > 0) params.append('levelOrder', String(selectedLevel));
      if (selectedRole !== 'all') params.append('role', selectedRole);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('limit', '50');

      return apiClient<QuestionsResponse>(`/interview/questions?${params.toString()}`);
    },
  });

  // 3. Mutation to record attempt
  const attemptMutation = useMutation({
    mutationFn: ({
      questionId,
      solved,
      notes,
    }: {
      questionId: string;
      solved: boolean;
      notes?: string;
    }) =>
      apiClient(`/interview/questions/${questionId}/attempt`, {
        method: 'POST',
        body: { solved, notes },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['interview-stats'] });
      queryClient.invalidateQueries({ queryKey: ['interview-questions'] });
      setSolvedIds((prev) => {
        const next = new Set(prev);
        if (variables.solved) next.add(variables.questionId);
        else next.delete(variables.questionId);
        return next;
      });
    },
  });

  const handleToggleSolved = (question: InterviewQuestionDto) => {
    if (!isAuthenticated) return;
    const isCurrentlySolved = solvedIds.has(question.id) || !!question.isSolved;
    const newSolved = !isCurrentlySolved;
    const notes = userNotes[question.id];

    // Optimistic update
    setSolvedIds((prev) => {
      const next = new Set(prev);
      if (newSolved) next.add(question.id);
      else next.delete(question.id);
      return next;
    });

    attemptMutation.mutate({
      questionId: question.id,
      solved: newSolved,
      notes,
    });
  };

  const handleSaveNotes = (questionId: string) => {
    if (!isAuthenticated) return;
    const notes = userNotes[questionId];
    const isCurrentlySolved = solvedIds.has(questionId);

    attemptMutation.mutate({
      questionId,
      solved: isCurrentlySolved,
      notes,
    });
  };

  const questions = questionsData?.items || [];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-card/80 via-card/50 to-primary/5 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Targeted Interview Preparation
            </h1>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary text-[11px] font-mono"
            >
              Role & Level Calibrated
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Master high-frequency Big Tech systems questions, architectural failure domains, and
            staff-level trade-offs.
          </p>
        </div>

        {/* Live Progress Bar */}
        {(() => {
          const levelStats = selectedLevel > 0 ? stats?.levelBreakdown?.[selectedLevel] : null;
          const displayTotal = levelStats
            ? levelStats.total
            : (stats?.totalQuestions ?? questions.length);
          const displaySolved = levelStats ? levelStats.solved : (stats?.solvedCount ?? 0);
          const displayPercent =
            displayTotal > 0 ? Math.round((displaySolved / displayTotal) * 100) : 0;

          return (
            <div className="flex flex-col sm:items-end gap-1.5 shrink-0 min-w-[200px]">
              <div className="flex items-center justify-between w-full text-xs">
                <span className="text-muted-foreground">Preparation Progress</span>
                <span className="font-bold font-mono text-primary">
                  {displaySolved} / {displayTotal} ({displayPercent}%)
                </span>
              </div>
              <Progress value={displayPercent} className="h-2 w-full" />
            </div>
          );
        })()}
      </div>

      {/* Filter and Search Controls */}
      <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search architectural problems (e.g. rate limiter, consensus, caching)..."
                className="pl-9 bg-background/50 text-xs min-h-[40px]"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                aria-label="Filter questions by role"
                className="text-xs bg-background/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[40px] w-full md:w-auto"
              >
                <option value="all">All Disciplines</option>
                <option value="backend">Backend Systems</option>
                <option value="frontend">Frontend Platform</option>
                <option value="fullstack">Fullstack Architecture</option>
                <option value="ai_engineer">AI & LLM Systems</option>
              </select>
            </div>
          </div>

          {/* Level Order Tabs */}
          {/* Level Order Tabs */}
          <div
            role="tablist"
            aria-label="Filter by Engineering Level"
            className="flex items-center gap-1.5 overflow-x-auto pb-1"
          >
            {LEVEL_TABS.map((tab) => (
              <button
                key={tab.level}
                role="tab"
                aria-selected={selectedLevel === tab.level}
                onClick={() => setSelectedLevel(tab.level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selectedLevel === tab.level
                    ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'border-border/50 bg-secondary/20 text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div
            role="group"
            aria-label="Filter by Topic Category"
            className="flex items-center gap-1.5 overflow-x-auto pb-1"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] px-2.5 py-1.5 rounded-md border transition-all whitespace-nowrap min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selectedCategory === cat
                    ? 'border-primary/80 bg-primary/10 text-primary font-semibold'
                    : 'border-border/50 bg-background/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Loading calibrated questions...
          </div>
        ) : questions.length === 0 ? (
          <Card className="p-12 text-center border-border/60">
            <HelpCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No questions matching filter</p>
            <p className="text-xs text-muted-foreground mt-1">
              No calibrated questions match your active level or category filters. Questions are
              managed dynamically via the Admin Panel.
            </p>
          </Card>
        ) : (
          questions.map((q, idx) => {
            const isSolved = solvedIds.has(q.id) || !!q.isSolved;

            return (
              <Card
                key={q.id}
                className={`border transition-all duration-200 backdrop-blur-sm ${
                  isSolved
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-border/60 bg-card/40 hover:border-border'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSolved(q)}
                        disabled={!isAuthenticated}
                        aria-pressed={isSolved}
                        aria-label={
                          isSolved
                            ? `Question ${idx + 1} marked solved. Click to mark unsolved`
                            : `Mark question ${idx + 1} as solved`
                        }
                        className={`h-8 w-8 rounded-lg flex items-center justify-center border transition-all shrink-0 min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isSolved
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : 'border-border/80 bg-background/60 text-muted-foreground hover:border-primary'
                        }`}
                        title={isAuthenticated ? 'Mark as solved' : 'Sign in to save progress'}
                      >
                        {isSolved && <CheckCircle2 className="h-4 w-4" />}
                      </button>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] border-primary/30 bg-primary/5 text-primary"
                        >
                          Level {q.levelOrder}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {q.category}
                        </Badge>
                        {isSolved && (
                          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                            Solved
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-muted-foreground">
                      Question #{idx + 1}
                    </span>
                  </div>

                  <div className="text-sm md:text-base font-semibold text-foreground pt-2 leading-snug">
                    {q.question}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <Accordion type="multiple" className="w-full space-y-2">
                    {/* Hint Accordion */}
                    {q.hint && (
                      <AccordionItem
                        value={`hint-${q.id}`}
                        className="border border-border/40 rounded-xl px-4 bg-secondary/10 overflow-hidden"
                      >
                        <AccordionTrigger className="text-xs font-semibold text-muted-foreground hover:text-foreground py-2.5">
                          <span className="flex items-center gap-1.5">
                            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                            <span>Interview Hint & Thought Process</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-foreground/85 leading-relaxed pt-1">
                          {q.hint}
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Architectural Solution Accordion */}
                    {q.answer && (
                      <AccordionItem
                        value={`answer-${q.id}`}
                        className="border border-border/40 rounded-xl px-4 bg-secondary/20 overflow-hidden"
                      >
                        <AccordionTrigger className="text-xs font-semibold text-primary hover:underline py-2.5">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Architectural Deep-Dive & Solution Invariants</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line pt-1">
                          {q.answer}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>

                  {/* Notes Area */}
                  {isAuthenticated && (
                    <div className="pt-2 border-t border-border/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Personal Architectural Notes
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveNotes(q.id)}
                          className="h-7 text-[11px] px-2"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save Notes
                        </Button>
                      </div>
                      <textarea
                        rows={2}
                        value={userNotes[q.id] ?? ''}
                        onChange={(e) =>
                          setUserNotes((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        placeholder="Document edge cases, trade-offs, or questions you would ask the interviewer..."
                        className="w-full text-xs bg-background/50 border border-border/60 rounded-lg p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
