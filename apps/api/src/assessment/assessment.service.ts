import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AssessmentDto,
  AssessmentQuizQuestion,
  CareerClarityReport,
  RoleType,
} from '@career-clarity/shared-types';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';

interface QuestionBankItem extends AssessmentQuizQuestion {
  correctOption: number;
}

@Injectable()
export class AssessmentService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly quizBank: Record<RoleType, QuestionBankItem[]> = {
    backend: [
      {
        id: 'be-q1',
        question:
          'What is the most effective mitigation against Cache Stampede (Thundering Herd) under high traffic spikes?',
        options: [
          'Increasing cache expiration TTL to 24 hours',
          'Using singleflight mutual exclusion locking or probabilistic early recomputation',
          'Adding more replica read databases without caching',
          'Disabling caching entirely during peak loads',
        ],
        correctOption: 1,
        role: 'backend',
        levelOrder: 3,
      },
      {
        id: 'be-q2',
        question:
          'When performing a schema migration on a 100M-row table in PostgreSQL, how do you prevent blocking write locks?',
        options: [
          'Run ALTER TABLE with table exclusive lock during off-peak hours',
          'Use the Expand and Contract pattern with CREATE INDEX CONCURRENTLY and background dual-writes',
          'Restart the PostgreSQL daemon before applying the DDL',
          'Drop the primary key constraint temporarily',
        ],
        correctOption: 1,
        role: 'backend',
        levelOrder: 3,
      },
      {
        id: 'be-q3',
        question:
          'How does Raft maintain linearizability during a network partition where the leader is in the minority partition?',
        options: [
          'The minority leader continues accepting writes without quorum',
          'Writes require acknowledgment from a majority quorum (N/2 + 1); hence minority writes fail',
          'The minority partition deletes all previous uncommitted logs immediately',
          'The cluster automatically switches to eventually consistent gossip protocol',
        ],
        correctOption: 1,
        role: 'backend',
        levelOrder: 4,
      },
      {
        id: 'be-q4',
        question:
          'In the era of AI code generation (Copilot/Claude), which backend engineering capability yields the highest long-term leverage?',
        options: [
          'Speed of typing boilerplate CRUD controller code',
          'System decomposition, failure domains, and distributed consistency trade-off judgment',
          'Memorizing raw regex syntax flags',
          'Writing repetitive manual mock setups for unit tests',
        ],
        correctOption: 1,
        role: 'backend',
        levelOrder: 3,
      },
    ],
    frontend: [
      {
        id: 'fe-q1',
        question:
          'How do React Server Components (RSC) primarily improve mobile web performance over standard client-side SPAs?',
        options: [
          'By executing all user event listeners on the remote edge server',
          'By reducing client JavaScript bundle size and streaming prerendered UI components directly',
          'By replacing CSS styles with Canvas WebGL rendering',
          'By disabling HTTP caching on all fetch requests',
        ],
        correctOption: 1,
        role: 'frontend',
        levelOrder: 2,
      },
      {
        id: 'fe-q2',
        question:
          'Which metric measures visual responsiveness to user clicks/taps, and what is its Core Web Vitals target threshold?',
        options: [
          'LCP (Largest Contentful Paint) < 2.5 seconds',
          'INP (Interaction to Next Paint) < 200 milliseconds',
          'CLS (Cumulative Layout Shift) < 0.25',
          'TTFB (Time to First Byte) < 800 milliseconds',
        ],
        correctOption: 1,
        role: 'frontend',
        levelOrder: 3,
      },
      {
        id: 'fe-q3',
        question:
          'In modern frontend development with AI copilots, what architectural responsibility remains exclusively high-leverage for human engineers?',
        options: [
          'Generating Tailwind utility classes for responsive grids',
          'Architecting client-server data boundaries, cache invalidation policies, and hydration stability',
          'Writing switch-case actions in boilerplate Redux reducers',
          'Manually writing cross-browser XMLHttpRequest polyfills',
        ],
        correctOption: 1,
        role: 'frontend',
        levelOrder: 3,
      },
    ],
    fullstack: [
      {
        id: 'fs-q1',
        question:
          'How should sensitive authentication JWT refresh tokens be stored on the web client?',
        options: [
          'Stored in browser localStorage for easy access across iframes',
          'Stored in httpOnly, Secure, SameSite cookies to protect against XSS extraction',
          'Encoded in URL query parameters on each request',
          'Stored in client-side IndexedDB without encryption',
        ],
        correctOption: 1,
        role: 'fullstack',
        levelOrder: 2,
      },
      {
        id: 'fs-q2',
        question:
          'What pattern prevents dual-write inconsistency when updating a database and publishing an event to a message broker?',
        options: [
          'Transactional Outbox Pattern with Change Data Capture (CDC)',
          'Two separate try/catch blocks without transaction boundary',
          'Sending the message broker event first, then retrying DB commit in memory',
          'Polling the database every 10 milliseconds with SELECT *',
        ],
        correctOption: 0,
        role: 'fullstack',
        levelOrder: 3,
      },
      {
        id: 'fs-q3',
        question:
          'What is the most sustainable approach to handling tech debt when business demands continuous feature velocity?',
        options: [
          'Halting all feature shipping for a 6-month big-bang rewrite',
          'Incremental refactoring via Strangler Fig pattern with telemetry validation',
          'Ignoring tech debt until production crashes occur',
          'Outsourcing legacy code maintenance to an offshore team',
        ],
        correctOption: 1,
        role: 'fullstack',
        levelOrder: 4,
      },
    ],
    ai_engineer: [
      {
        id: 'ai-q1',
        question:
          'What is the primary vulnerability addressed by input delimiter boundary tags (e.g. XML delimiters) in LLM system prompts?',
        options: [
          'Model quantization memory leaks',
          'Direct and indirect prompt injection attacks',
          'Token rate limit exhaustion',
          'Vector database cosine similarity degradation',
        ],
        correctOption: 1,
        role: 'ai_engineer',
        levelOrder: 3,
      },
      {
        id: 'ai-q2',
        question:
          'In enterprise RAG architectures, why is hybrid search (BM25 lexical + dense vector embeddings) preferred over vector-only search?',
        options: [
          'It eliminates the need for vector databases entirely',
          'Dense embeddings struggle with exact keywords (SKUs, IDs, error codes), which BM25 captures accurately',
          'BM25 is 100x faster than vector dot product in all cases',
          'Hybrid search prevents the LLM from hallucinating entirely',
        ],
        correctOption: 1,
        role: 'ai_engineer',
        levelOrder: 4,
      },
      {
        id: 'ai-q3',
        question:
          'How do production AI teams evaluate LLM output quality without manual human inspection on every query?',
        options: [
          'Relying solely on unit test code coverage metrics',
          'Automated evaluation pipelines with LLM-as-a-judge (Ragas metrics: faithfulness, answer relevance)',
          'Measuring only inference latency and token counts',
          'Checking that the response length matches prompt length',
        ],
        correctOption: 1,
        role: 'ai_engineer',
        levelOrder: 4,
      },
    ],
  };

  getQuizQuestions(role: RoleType): AssessmentQuizQuestion[] {
    const list = this.quizBank[role] || this.quizBank.backend;
    return list.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      role: q.role,
      levelOrder: q.levelOrder,
    }));
  }

  async submitAssessment(userId: string, dto: SubmitAssessmentDto): Promise<AssessmentDto> {
    const { role, yearsExp, answers, primaryStack } = dto;
    const questions = this.quizBank[role] || this.quizBank.backend;

    // Calculate quiz score
    let correctCount = 0;
    for (const ans of answers) {
      const q = questions.find((item) => item.id === ans.questionId);
      if (q && q.correctOption === ans.selectedOption) {
        correctCount += 1;
      }
    }

    const quizScoreRatio = questions.length > 0 ? correctCount / questions.length : 0.5;

    // Level calculation combining experience and diagnostic score
    let calculatedOrder = 1;
    if (yearsExp >= 10) {
      calculatedOrder = quizScoreRatio >= 0.75 ? 5 : 4;
    } else if (yearsExp >= 6) {
      calculatedOrder = quizScoreRatio >= 0.75 ? 4 : 3;
    } else if (yearsExp >= 3) {
      calculatedOrder = quizScoreRatio >= 0.75 ? 3 : 2;
    } else if (yearsExp >= 1.5) {
      calculatedOrder = quizScoreRatio >= 0.5 ? 2 : 1;
    } else {
      calculatedOrder = 1;
    }

    const titleMap: Record<number, string> = {
      1: 'Junior Software Engineer (L3 / E3 Equivalent)',
      2: 'Mid-Level Software Engineer (L4 / E4 Equivalent)',
      3: 'Senior Software Engineer (L5 / E5 Equivalent)',
      4: 'Staff Software Engineer (L6 / E6 Equivalent)',
      5: 'Principal Engineer / Architect (L7 / E7 Equivalent)',
    };

    const overallTitle = titleMap[calculatedOrder] ?? 'Software Engineer';

    // Generate comprehensive report
    const report: CareerClarityReport = {
      overallLevelOrder: calculatedOrder,
      overallTitle,
      role,
      yearsExp,
      summary: `Based on your ${yearsExp} years of experience and diagnostic assessment score (${correctCount}/${questions.length} correct), your engineering level correlates to ${overallTitle}. You demonstrate strong command of core principles with clear growth trajectories for higher organizational impact.`,
      skillAnalysis: {
        criticalSkillsToLearn:
          calculatedOrder >= 3
            ? [
                'Distributed Systems Consensus (Raft / Paxos)',
                'Zero-Downtime Database Migrations (Expand/Contract)',
                'System Architecture Trade-off Modeling under High QPS',
              ]
            : [
                'Database Indexing & Query Execution Plans (EXPLAIN ANALYZE)',
                'API Contract Governance & Backward Compatibility',
                'Fault Tolerance & Resilience Patterns (Circuit Breaker, Idempotency)',
              ],
        aiLeverageOpportunities: [
          'CRUD REST Endpoint Generation (Automate boilerplate with Copilot/Cursor)',
          'Unit Test Suite & Mock Fixture Drafting',
          'Responsive Tailwind Layout Slicing',
        ],
        deprecatedOrDecliningSkills: [
          'Handwritten Redux / State Machine Boilerplate',
          'Manual Memory Management for Web APIs',
          'Legacy SOAP & XML Wrappers',
        ],
      },
      recommendedNextSteps: [
        `Complete the ${role.toUpperCase()} AI-era roadmap milestones for Level ${calculatedOrder}`,
        'Practice 5 target interview questions with detailed architectural answers',
        'Benchmark cross-company leveling expectations to prepare for promotion or lateral transition',
      ],
      benchmarks: [
        {
          companyName: 'Google',
          equivalentLevel:
            calculatedOrder === 1
              ? 'L3'
              : calculatedOrder === 2
                ? 'L4'
                : calculatedOrder === 3
                  ? 'L5'
                  : calculatedOrder === 4
                    ? 'L6'
                    : 'L7',
        },
        {
          companyName: 'Meta',
          equivalentLevel:
            calculatedOrder === 1
              ? 'E3'
              : calculatedOrder === 2
                ? 'E4'
                : calculatedOrder === 3
                  ? 'E5'
                  : calculatedOrder === 4
                    ? 'E6'
                    : 'E7',
        },
        {
          companyName: 'Stripe',
          equivalentLevel:
            calculatedOrder === 1
              ? 'L1'
              : calculatedOrder === 2
                ? 'L2'
                : calculatedOrder === 3
                  ? 'L3'
                  : calculatedOrder === 4
                    ? 'L4'
                    : 'L5',
        },
        {
          companyName: 'Regional Tier-1',
          equivalentLevel:
            calculatedOrder === 1
              ? 'Junior'
              : calculatedOrder === 2
                ? 'Mid-Level'
                : calculatedOrder === 3
                  ? 'Senior'
                  : calculatedOrder === 4
                    ? 'Tech Lead / Staff'
                    : 'Principal Architect',
        },
      ],
    };

    // Update user record with latest profile info
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        yearsExp,
        ...(primaryStack ? { primaryStack } : {}),
      },
    });

    // Save assessment record
    const createdAssessment = await this.prisma.assessment.create({
      data: {
        userId,
        resultLevelOrder: calculatedOrder,
        reportJson: report as unknown as object,
      },
    });

    return {
      id: createdAssessment.id,
      userId: createdAssessment.userId,
      resultLevelOrder: createdAssessment.resultLevelOrder,
      reportJson: createdAssessment.reportJson as unknown as CareerClarityReport,
      createdAt: createdAssessment.createdAt.toISOString(),
    };
  }

  async getLatestAssessment(userId: string): Promise<AssessmentDto | null> {
    const assessment = await this.prisma.assessment.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!assessment) {
      return null;
    }

    return {
      id: assessment.id,
      userId: assessment.userId,
      resultLevelOrder: assessment.resultLevelOrder,
      reportJson: assessment.reportJson as unknown as CareerClarityReport,
      createdAt: assessment.createdAt.toISOString(),
    };
  }

  async getAssessmentHistory(userId: string): Promise<AssessmentDto[]> {
    const assessments = await this.prisma.assessment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return assessments.map((a) => ({
      id: a.id,
      userId: a.userId,
      resultLevelOrder: a.resultLevelOrder,
      reportJson: a.reportJson as unknown as CareerClarityReport,
      createdAt: a.createdAt.toISOString(),
    }));
  }
}
