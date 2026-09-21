import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyDto, LevelComparisonResult } from '@career-clarity/shared-types';
import { CompareLevelDto } from './dto/compare-level.dto';

@Injectable()
export class LevelingService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCompanies(): Promise<CompanyDto[]> {
    const companies = await this.prisma.company.findMany({
      include: {
        levels: {
          orderBy: {
            levelOrder: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      levels: company.levels.map((level) => ({
        id: level.id,
        companyId: level.companyId,
        companyName: company.name,
        levelName: level.levelName,
        levelOrder: level.levelOrder,
        yearsExpMin: level.yearsExpMin,
        yearsExpMax: level.yearsExpMax,
        description: level.description,
      })),
    }));
  }

  async compareLevel(dto: CompareLevelDto): Promise<LevelComparisonResult> {
    const { yearsExp, systemDesignScore = 3, leadershipScore = 3 } = dto;

    // 1. Calculate Base Level Order from Years of Experience
    let calculatedOrder = 1;
    if (yearsExp >= 11) {
      calculatedOrder = 5;
    } else if (yearsExp >= 7) {
      calculatedOrder = 4;
    } else if (yearsExp >= 4) {
      calculatedOrder = 3;
    } else if (yearsExp >= 2) {
      calculatedOrder = 2;
    } else {
      calculatedOrder = 1;
    }

    // 2. Adjust with competency signals
    const competencyAvg = (systemDesignScore + leadershipScore) / 2;
    if (competencyAvg >= 4.5 && yearsExp >= 3 && calculatedOrder < 5) {
      calculatedOrder += 1;
    } else if (competencyAvg <= 1.5 && calculatedOrder > 1) {
      calculatedOrder -= 1;
    }

    // Ensure within bounded normalized scale (1 - 5)
    calculatedOrder = Math.max(1, Math.min(5, calculatedOrder));

    // Map order to descriptive industry title
    const titleMap: Record<number, string> = {
      1: 'Junior / Entry-Level Software Engineer (L3 / E3 Equivalent)',
      2: 'Mid-Level Software Engineer (L4 / E4 Equivalent)',
      3: 'Senior Software Engineer (L5 / E5 Equivalent)',
      4: 'Staff Software Engineer / Tech Lead (L6 / E6 Equivalent)',
      5: 'Principal Engineer / Architect (L7 / E7 Equivalent)',
    };

    // 3. Fetch all companies and their levels
    const companies = await this.prisma.company.findMany({
      include: {
        levels: true,
      },
    });

    const companyBreakdown = companies.map((company) => {
      // Find closest level matching calculatedOrder
      const matched =
        company.levels.find((l) => l.levelOrder === calculatedOrder) ||
        company.levels.reduce((prev, curr) =>
          Math.abs(curr.levelOrder - calculatedOrder) < Math.abs(prev.levelOrder - calculatedOrder)
            ? curr
            : prev,
        );

      return {
        companyId: company.id,
        companyName: company.name,
        matchedLevel: matched.levelName,
        levelOrder: matched.levelOrder,
        difference: matched.levelOrder - calculatedOrder,
        description: matched.description || '',
      };
    });

    return {
      estimatedLevelOrder: calculatedOrder,
      estimatedTitle: titleMap[calculatedOrder] ?? 'Software Engineer',
      companyBreakdown,
    };
  }
}
