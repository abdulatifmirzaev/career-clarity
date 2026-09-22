/**
 * Core Domain Enums & Literals
 */
export type RoleType = 'backend' | 'frontend' | 'fullstack' | 'ai_engineer';

export type AIRelevance = 'critical' | 'eased_by_ai' | 'declining';

export type SkillProgressStatus = 'not_started' | 'in_progress' | 'mastered';

/**
 * User & Profile
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  yearsExp: number | null;
  primaryStack: string | null;
  createdAt: string;
}

/**
 * Leveling Benchmark Models
 */
export interface CompanyLevelDto {
  id: string;
  companyId: string;
  companyName?: string;
  levelName: string;
  levelOrder: number; // 1 - 10 normalized
  yearsExpMin: number;
  yearsExpMax: number;
  description: string | null;
}

export interface CompanyDto {
  id: string;
  name: string;
  levels: CompanyLevelDto[];
}

export interface LevelComparisonResult {
  estimatedLevelOrder: number;
  estimatedTitle: string;
  companyBreakdown: {
    companyId: string;
    companyName: string;
    matchedLevel: string;
    levelOrder: number;
    difference: number; // relative delta
  }[];
}

/**
 * Skill & Roadmap Models
 */
export interface SkillDto {
  id: string;
  name: string;
  category: string;
  aiRelevance: AIRelevance;
}

export interface RoadmapNodeDto {
  id: string;
  skillId: string;
  skill: SkillDto;
  role: RoleType;
  levelOrder: number;
  parentNodeId: string | null;
  status?: SkillProgressStatus;
}

export interface UserSkillProgressDto {
  id: string;
  userId: string;
  skillId: string;
  status: SkillProgressStatus;
  updatedAt: string;
}

/**
 * Interview Question Models
 */
export interface InterviewQuestionDto {
  id: string;
  question: string;
  answer?: string | null;
  hint?: string | null;
  category: string;
  role?: string | null;
  levelOrder: number;
  isSolved?: boolean;
  createdAt?: string;
}

export interface UserQuestionAttemptDto {
  id: string;
  userId: string;
  questionId: string;
  solved: boolean;
  attemptedAt: string;
}

/**
 * Assessment & Career Clarity Report
 */
export interface AssessmentQuizQuestion {
  id: string;
  question: string;
  options: string[];
  role: RoleType;
  levelOrder: number;
}

export interface CareerClarityReport {
  overallLevelOrder: number;
  overallTitle: string;
  role: RoleType;
  yearsExp: number;
  summary: string;
  skillAnalysis: {
    criticalSkillsToLearn: string[];
    aiLeverageOpportunities: string[];
    deprecatedOrDecliningSkills: string[];
  };
  recommendedNextSteps: string[];
  benchmarks: {
    companyName: string;
    equivalentLevel: string;
  }[];
}

export interface AssessmentDto {
  id: string;
  userId: string;
  resultLevelOrder: number;
  reportJson: CareerClarityReport;
  createdAt: string;
}

export interface LevelComparisonRequest {
  yearsExp: number;
  currentTitle?: string;
  systemDesignScore?: number; // 1 - 5
  leadershipScore?: number; // 1 - 5
}

export interface UpdateSkillProgressRequest {
  status: SkillProgressStatus;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
}

export interface SubmitAssessmentRequest {
  role: RoleType;
  yearsExp: number;
  answers: QuizAnswer[];
  primaryStack?: string;
}

/**
 * API Standard Response Envelope
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
