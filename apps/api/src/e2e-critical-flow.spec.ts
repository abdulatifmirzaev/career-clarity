import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentService } from './assessment/assessment.service';
import { AuthService } from './auth/auth.service';
import { InterviewService } from './interview/interview.service';
import { LevelingService } from './leveling/leveling.service';
import { PrismaService } from './prisma/prisma.service';
import { RoadmapService } from './roadmap/roadmap.service';

describe('E2E Critical User Journey: Full Lifecycle Flow', () => {
  let authService: AuthService;
  let assessmentService: AssessmentService;
  let roadmapService: RoadmapService;
  let interviewService: InterviewService;
  let levelingService: LevelingService;

  interface TestUserRecord {
    id: string;
    email: string;
    passwordHash: string;
    name?: string | null;
    yearsExp?: number | null;
    primaryStack?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  interface TestAssessmentRecord {
    id: string;
    userId: string;
    resultLevelOrder: number;
    reportJson: unknown;
    createdAt: Date;
  }

  interface TestSkillRecord {
    id: string;
    name: string;
    category: string;
    aiRelevance: string;
  }

  interface TestUserSkillProgressRecord {
    id: string;
    userId: string;
    skillId: string;
    status: string;
    skill?: TestSkillRecord;
    updatedAt: Date;
  }

  interface TestInterviewQuestionRecord {
    id: string;
    question: string;
    answer: string;
    hint: string;
    category: string;
    role: string;
    levelOrder: number;
  }

  interface TestUserQuestionAttemptRecord {
    id: string;
    userId: string;
    questionId: string;
    solved: boolean;
    notes?: string | null;
    question?: TestInterviewQuestionRecord;
    attemptedAt: Date;
  }

  // In-memory test store simulating PostgreSQL Prisma state across modules
  const inMemoryDb = {
    users: new Map<string, TestUserRecord>(),
    assessments: new Map<string, TestAssessmentRecord>(),
    skills: new Map<string, TestSkillRecord>([
      [
        'skill-consensus',
        {
          id: 'skill-consensus',
          name: 'Distributed Consensus',
          category: 'Distributed Systems',
          aiRelevance: 'critical',
        },
      ],
      [
        'skill-crud',
        {
          id: 'skill-crud',
          name: 'CRUD REST APIs',
          category: 'Backend',
          aiRelevance: 'eased_by_ai',
        },
      ],
    ]),
    roadmapNodes: [
      {
        id: 'node-1',
        skillId: 'skill-consensus',
        role: 'backend',
        levelOrder: 3,
        parentNodeId: null,
        skill: {
          id: 'skill-consensus',
          name: 'Distributed Consensus',
          category: 'Distributed Systems',
          aiRelevance: 'critical',
        },
      },
    ],
    userSkillProgress: new Map<string, TestUserSkillProgressRecord>(),
    interviewQuestions: new Map<string, TestInterviewQuestionRecord>([
      [
        'q-rate-limiter',
        {
          id: 'q-rate-limiter',
          question: 'Design a distributed rate limiter with sliding window counters.',
          answer:
            'Use Redis sorted sets with ZADD and ZREMRANGEBYSCORE within an atomic Lua script.',
          hint: 'Consider race conditions between multi-region replicas.',
          category: 'System Design',
          role: 'backend',
          levelOrder: 3,
        },
      ],
    ]),
    userQuestionAttempts: new Map<string, TestUserQuestionAttemptRecord>(),
    companies: [
      {
        id: 'comp-google',
        name: 'Google',
        levels: [
          { id: 'l3', levelOrder: 1, levelName: 'L3', description: 'Junior SWE' },
          { id: 'l4', levelOrder: 2, levelName: 'L4', description: 'SWE II' },
          { id: 'l5', levelOrder: 3, levelName: 'L5', description: 'Senior SWE' },
          { id: 'l6', levelOrder: 4, levelName: 'L6', description: 'Staff SWE' },
        ],
      },
      {
        id: 'comp-meta',
        name: 'Meta',
        levels: [
          { id: 'e3', levelOrder: 1, levelName: 'E3', description: 'Rotational/Junior' },
          { id: 'e4', levelOrder: 2, levelName: 'E4', description: 'SWE' },
          { id: 'e5', levelOrder: 3, levelName: 'E5', description: 'Senior SWE' },
        ],
      },
      {
        id: 'comp-stripe',
        name: 'Stripe',
        levels: [
          { id: 'l1', levelOrder: 1, levelName: 'L1', description: 'Software Engineer I' },
          { id: 'l2', levelOrder: 2, levelName: 'L2', description: 'Software Engineer II' },
          { id: 'l3', levelOrder: 3, levelName: 'L3', description: 'Senior Software Engineer' },
        ],
      },
      {
        id: 'comp-regional',
        name: 'Regional Tier-1',
        levels: [
          { id: 'r1', levelOrder: 1, levelName: 'Junior', description: 'Junior Developer' },
          { id: 'r2', levelOrder: 2, levelName: 'Mid', description: 'Mid Software Engineer' },
          { id: 'r3', levelOrder: 3, levelName: 'Senior', description: 'Senior Software Engineer' },
        ],
      },
    ],
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id) return Promise.resolve(inMemoryDb.users.get(where.id) || null);
        if (where.email) {
          for (const u of inMemoryDb.users.values()) {
            if (u.email === where.email) return Promise.resolve(u);
          }
        }
        return Promise.resolve(null);
      }),
      create: jest.fn().mockImplementation(({ data }) => {
        const user = {
          id: `usr-${Date.now()}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        inMemoryDb.users.set(user.id, user);
        return Promise.resolve(user);
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        const existing = inMemoryDb.users.get(where.id);
        if (!existing) return Promise.reject(new Error('User not found'));
        const updated = { ...existing, ...data };
        inMemoryDb.users.set(where.id, updated);
        return Promise.resolve(updated);
      }),
    },
    assessment: {
      create: jest.fn().mockImplementation(({ data }) => {
        const assess = {
          id: `assess-${Date.now()}`,
          userId: data.userId,
          resultLevelOrder: data.resultLevelOrder,
          reportJson: data.reportJson,
          createdAt: new Date(),
        };
        inMemoryDb.assessments.set(assess.id, assess);
        return Promise.resolve(assess);
      }),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        for (const a of inMemoryDb.assessments.values()) {
          if (a.userId === where.userId) return Promise.resolve(a);
        }
        return Promise.resolve(null);
      }),
      findMany: jest.fn().mockImplementation(({ where }) => {
        const list = [];
        for (const a of inMemoryDb.assessments.values()) {
          if (a.userId === where.userId) list.push(a);
        }
        return Promise.resolve(list);
      }),
    },
    skill: {
      findMany: jest.fn().mockResolvedValue(Array.from(inMemoryDb.skills.values())),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(inMemoryDb.skills.get(where.id) || null);
      }),
      count: jest.fn().mockResolvedValue(inMemoryDb.skills.size),
    },
    roadmapNode: {
      findMany: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(
          inMemoryDb.roadmapNodes.filter((n) => !where?.role || n.role === where.role),
        );
      }),
    },
    userSkillProgress: {
      findMany: jest.fn().mockImplementation(({ where }) => {
        const results = [];
        for (const p of inMemoryDb.userSkillProgress.values()) {
          if (p.userId === where.userId) results.push(p);
        }
        return Promise.resolve(results);
      }),
      upsert: jest.fn().mockImplementation(({ where, create, update }) => {
        const key = `${where.userId_skillId.userId}:${where.userId_skillId.skillId}`;
        const existing = inMemoryDb.userSkillProgress.get(key);
        const skill = inMemoryDb.skills.get(where.userId_skillId.skillId);
        const record = existing
          ? { ...existing, ...update, updatedAt: new Date() }
          : {
              id: `usp-${Date.now()}`,
              ...create,
              skill,
              updatedAt: new Date(),
            };
        inMemoryDb.userSkillProgress.set(key, record);
        return Promise.resolve(record);
      }),
    },
    interviewQuestion: {
      findMany: jest.fn().mockImplementation(() => {
        return Promise.resolve(Array.from(inMemoryDb.interviewQuestions.values()));
      }),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(inMemoryDb.interviewQuestions.get(where.id) || null);
      }),
      count: jest.fn().mockResolvedValue(inMemoryDb.interviewQuestions.size),
    },
    userQuestionAttempt: {
      findMany: jest.fn().mockImplementation(({ where }) => {
        const results = [];
        for (const a of inMemoryDb.userQuestionAttempts.values()) {
          if (a.userId === where.userId) results.push(a);
        }
        return Promise.resolve(results);
      }),
      upsert: jest.fn().mockImplementation(({ where, create, update }) => {
        const key = `${where.userId_questionId.userId}:${where.userId_questionId.questionId}`;
        const existing = inMemoryDb.userQuestionAttempts.get(key);
        const question = inMemoryDb.interviewQuestions.get(where.userId_questionId.questionId);
        const record = existing
          ? { ...existing, ...update, attemptedAt: new Date() }
          : {
              id: `uqa-${Date.now()}`,
              ...create,
              question,
              attemptedAt: new Date(),
            };
        inMemoryDb.userQuestionAttempts.set(key, record);
        return Promise.resolve(record);
      }),
    },
    company: {
      findMany: jest.fn().mockResolvedValue(inMemoryDb.companies),
    },
  };

  let tokenCounter = 0;
  const mockJwtService = {
    signAsync: jest.fn().mockImplementation((payload) => {
      tokenCounter++;
      return Promise.resolve(
        Buffer.from(JSON.stringify({ ...payload, _nonce: tokenCounter })).toString('base64'),
      );
    }),
    verifyAsync: jest.fn().mockImplementation((token) => {
      try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
        return Promise.resolve(decoded);
      } catch {
        return Promise.reject(new Error('Invalid token'));
      }
    }),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_ACCESS_SECRET') return 'test_access_secret';
      if (key === 'JWT_REFRESH_SECRET') return 'test_refresh_secret';
      if (key === 'JWT_ACCESS_EXPIRES_IN') return '15m';
      if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
      return null;
    }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        AssessmentService,
        RoadmapService,
        InterviewService,
        LevelingService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    assessmentService = module.get<AssessmentService>(AssessmentService);
    roadmapService = module.get<RoadmapService>(RoadmapService);
    interviewService = module.get<InterviewService>(InterviewService);
    levelingService = module.get<LevelingService>(LevelingService);
  });

  describe('Full Critical Journey Execution', () => {
    let testUserId: string;
    let initialRefreshToken: string;

    it('Step 1: User registers account with email and experience credentials', async () => {
      const registerResult = await authService.register({
        email: 'alex@careerclarity.dev',
        password: 'SecurePassword123!',
        name: 'Alex Chen',
        yearsExp: 4,
        primaryStack: 'TypeScript, Node.js, PostgreSQL',
      });

      expect(registerResult).toBeDefined();
      expect(registerResult.accessToken).toBeDefined();
      expect(registerResult.refreshToken).toBeDefined();
      expect(registerResult.user.email).toBe('alex@careerclarity.dev');
      expect(registerResult.user.name).toBe('Alex Chen');

      testUserId = registerResult.user.id;
      initialRefreshToken = registerResult.refreshToken;
    });

    it('Step 2: User completes onboarding diagnostic assessment and receives Career Clarity Report', async () => {
      const quiz = assessmentService.getQuizQuestions('backend');
      expect(quiz.length).toBeGreaterThan(0);

      // Submit assessment answers calibrated for Senior level (L3 normalized)
      const assessmentResult = await assessmentService.submitAssessment(testUserId, {
        role: 'backend',
        yearsExp: 4,
        answers: [
          { questionId: 'be-q1', selectedOption: 1 },
          { questionId: 'be-q2', selectedOption: 1 },
          { questionId: 'be-q3', selectedOption: 1 },
          { questionId: 'be-q4', selectedOption: 1 },
        ],
        primaryStack: 'TypeScript, Node.js, PostgreSQL',
      });

      expect(assessmentResult.resultLevelOrder).toBe(3);
      expect(assessmentResult.reportJson).toBeDefined();
      expect(assessmentResult.reportJson.overallTitle).toContain('Senior');
      expect(assessmentResult.reportJson.benchmarks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ companyName: 'Google', equivalentLevel: 'L5' }),
          expect.objectContaining({ companyName: 'Meta', equivalentLevel: 'E5' }),
          expect.objectContaining({ companyName: 'Stripe', equivalentLevel: 'L3' }),
        ]),
      );
      expect(
        assessmentResult.reportJson.skillAnalysis.criticalSkillsToLearn.length,
      ).toBeGreaterThan(0);

      // Verify retrieval on dashboard via getLatestAssessment
      const latest = await assessmentService.getLatestAssessment(testUserId);
      expect(latest).toBeDefined();
      expect(latest?.resultLevelOrder).toBe(3);
    });

    it('Step 3: User inspects Roadmap skill tree and marks a critical skill as Mastered', async () => {
      const roadmapNodes = await roadmapService.getRoadmapByRole('backend', testUserId);
      expect(roadmapNodes.length).toBeGreaterThan(0);

      const targetSkillId = 'skill-consensus';
      const updatedProgress = await roadmapService.updateSkillProgress(
        testUserId,
        targetSkillId,
        'mastered',
      );

      expect(updatedProgress.skillId).toBe(targetSkillId);
      expect(updatedProgress.status).toBe('mastered');

      // Verify summary reflects mastery
      const summary = await roadmapService.getUserProgressSummary(testUserId);
      expect(summary.totalSkills).toBe(2);
      expect(summary.mastered).toBe(1);
      expect(summary.completionPercentage).toBe(50);
    });

    it('Step 4: User prepares for interviews, solves an architectural problem, and records notes', async () => {
      const questionsResult = await interviewService.getQuestions(
        { role: 'backend', limit: 10 },
        testUserId,
      );
      expect(questionsResult.items.length).toBeGreaterThan(0);

      const targetQuestion = questionsResult.items[0];
      const attempt = await interviewService.recordAttempt(testUserId, targetQuestion.id, {
        solved: true,
        notes:
          'Handled with Redis sorted sets, sliding window counter with Lua script atomic rollback.',
      });

      expect(attempt.solved).toBe(true);
      expect(attempt.notes).toContain('Redis sorted sets');

      // Verify user interview statistics update
      const stats = await interviewService.getUserStats(testUserId);
      expect(stats.totalQuestions).toBe(1);
      expect(stats.solvedCount).toBe(1);
      expect(stats.progressPercentage).toBe(100);
    });

    it('Step 5: User calibrates leveling comparison against Big Tech benchmarks', async () => {
      const comparison = await levelingService.compareLevel({
        yearsExp: 4,
        systemDesignScore: 4,
        leadershipScore: 3,
        currentTitle: 'Senior Software Engineer',
      });

      expect(comparison.estimatedLevelOrder).toBe(3);
      expect(comparison.estimatedTitle).toContain('Senior');
      expect(comparison.companyBreakdown.length).toBe(4);

      const googleBreakdown = comparison.companyBreakdown.find((b) => b.companyName === 'Google');
      expect(googleBreakdown).toBeDefined();
      expect(googleBreakdown?.matchedLevel).toBe('L5');
      expect(googleBreakdown?.difference).toBe(0); // Exact match on Senior
    });

    it('Step 6: User refreshes access token seamlessly via refresh token rotation', async () => {
      const refreshed = await authService.refreshToken(initialRefreshToken);

      expect(refreshed.accessToken).toBeDefined();
      expect(refreshed.refreshToken).toBeDefined();
      expect(refreshed.accessToken).not.toBe(initialRefreshToken);
    });
  });
});
