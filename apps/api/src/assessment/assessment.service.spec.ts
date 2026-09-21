import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AssessmentService } from './assessment.service';

describe('AssessmentService', () => {
  let service: AssessmentService;

  const mockPrismaService = {
    user: {
      update: jest.fn().mockResolvedValue({ id: 'user-123' }),
    },
    assessment: {
      create: jest.fn().mockImplementation(({ data }) =>
        Promise.resolve({
          id: 'assess-123',
          userId: data.userId,
          resultLevelOrder: data.resultLevelOrder,
          reportJson: data.reportJson,
          createdAt: new Date(),
        }),
      ),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<AssessmentService>(AssessmentService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return role-calibrated quiz questions', () => {
    const backendQuiz = service.getQuizQuestions('backend');
    expect(backendQuiz.length).toBeGreaterThan(0);
    expect(backendQuiz[0]?.role).toBe('backend');
  });

  it('should calculate assessment report accurately on submission', async () => {
    const result = await service.submitAssessment('user-123', {
      role: 'backend',
      yearsExp: 4,
      answers: [
        { questionId: 'be-q1', selectedOption: 1 },
        { questionId: 'be-q2', selectedOption: 1 },
        { questionId: 'be-q3', selectedOption: 1 },
        { questionId: 'be-q4', selectedOption: 1 },
      ],
      primaryStack: 'Node.js, PostgreSQL',
    });

    expect(result.resultLevelOrder).toBe(3);
    expect(result.reportJson.overallTitle).toContain('Senior');
    expect(result.reportJson.benchmarks.length).toBe(4);
    expect(result.reportJson.skillAnalysis.criticalSkillsToLearn.length).toBeGreaterThan(0);
    expect(mockPrismaService.assessment.create).toHaveBeenCalled();
  });
});
