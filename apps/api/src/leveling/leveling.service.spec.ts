import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { LevelingService } from './leveling.service';

describe('LevelingService', () => {
  let service: LevelingService;

  const mockPrismaService = {
    company: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'comp-1',
          name: 'Google',
          levels: [
            { id: 'l3', levelOrder: 1, levelName: 'L3', description: 'Entry' },
            { id: 'l4', levelOrder: 2, levelName: 'L4', description: 'Mid' },
            { id: 'l5', levelOrder: 3, levelName: 'L5', description: 'Senior' },
            { id: 'l6', levelOrder: 4, levelName: 'L6', description: 'Staff' },
            { id: 'l7', levelOrder: 5, levelName: 'L7', description: 'Principal' },
          ],
        },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LevelingService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<LevelingService>(LevelingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('compareLevel', () => {
    it('should map 1 year of exp to Level 1 (Entry / L3)', async () => {
      const result = await service.compareLevel({ yearsExp: 1 });
      expect(result.estimatedLevelOrder).toBe(1);
      expect(result.estimatedTitle).toContain('Junior / Entry-Level');
      expect(result.companyBreakdown[0]?.matchedLevel).toBe('L3');
    });

    it('should map 5 years of exp to Level 3 (Senior / L5)', async () => {
      const result = await service.compareLevel({ yearsExp: 5 });
      expect(result.estimatedLevelOrder).toBe(3);
      expect(result.estimatedTitle).toContain('Senior');
      expect(result.companyBreakdown[0]?.matchedLevel).toBe('L5');
    });

    it('should boost level if high architecture and leadership proficiency demonstrated', async () => {
      const result = await service.compareLevel({
        yearsExp: 3,
        systemDesignScore: 5,
        leadershipScore: 5,
      });
      // 3 yrs normally Level 2, with high scores boosted to Level 3
      expect(result.estimatedLevelOrder).toBe(3);
      expect(result.companyBreakdown[0]?.matchedLevel).toBe('L5');
    });
  });
});
