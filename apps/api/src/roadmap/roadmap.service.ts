import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RoadmapNodeDto,
  RoleType,
  SkillDto,
  SkillProgressStatus,
  UserSkillProgressDto,
} from '@career-clarity/shared-types';

@Injectable()
export class RoadmapService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSkills(): Promise<SkillDto[]> {
    const skills = await this.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    return skills.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      aiRelevance: s.aiRelevance as SkillDto['aiRelevance'],
    }));
  }

  async getRoadmapByRole(role: RoleType, userId?: string): Promise<RoadmapNodeDto[]> {
    const nodes = await this.prisma.roadmapNode.findMany({
      where: { role },
      include: {
        skill: true,
      },
      orderBy: [{ levelOrder: 'asc' }, { id: 'asc' }],
    });

    let userProgressMap = new Map<string, SkillProgressStatus>();
    if (userId) {
      const progressList = await this.prisma.userSkillProgress.findMany({
        where: { userId },
      });
      userProgressMap = new Map(
        progressList.map((p) => [p.skillId, p.status as SkillProgressStatus]),
      );
    }

    return nodes.map((node) => ({
      id: node.id,
      skillId: node.skillId,
      role: node.role as RoleType,
      levelOrder: node.levelOrder,
      parentNodeId: node.parentNodeId,
      status: userProgressMap.get(node.skillId) || 'not_started',
      skill: {
        id: node.skill.id,
        name: node.skill.name,
        category: node.skill.category,
        aiRelevance: node.skill.aiRelevance as SkillDto['aiRelevance'],
      },
    }));
  }

  async updateSkillProgress(
    userId: string,
    skillId: string,
    status: SkillProgressStatus,
  ): Promise<UserSkillProgressDto> {
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID "${skillId}" does not exist`);
    }

    const progress = await this.prisma.userSkillProgress.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      update: {
        status,
      },
      create: {
        userId,
        skillId,
        status,
      },
    });

    return {
      id: progress.id,
      userId: progress.userId,
      skillId: progress.skillId,
      status: progress.status as SkillProgressStatus,
      updatedAt: progress.updatedAt.toISOString(),
    };
  }

  async getUserProgressSummary(userId: string) {
    const [totalSkills, userProgress] = await Promise.all([
      this.prisma.skill.count(),
      this.prisma.userSkillProgress.findMany({
        where: { userId },
        include: { skill: true },
      }),
    ]);

    const mastered = userProgress.filter((p) => p.status === 'mastered').length;
    const inProgress = userProgress.filter((p) => p.status === 'in_progress').length;
    const notStarted = Math.max(0, totalSkills - (mastered + inProgress));
    const completionPercentage = totalSkills > 0 ? Math.round((mastered / totalSkills) * 100) : 0;

    return {
      totalSkills,
      mastered,
      inProgress,
      notStarted,
      completionPercentage,
      recentUpdates: userProgress.slice(0, 5).map((p) => ({
        skillName: p.skill.name,
        category: p.skill.category,
        aiRelevance: p.skill.aiRelevance,
        status: p.status,
        updatedAt: p.updatedAt,
      })),
    };
  }
}
