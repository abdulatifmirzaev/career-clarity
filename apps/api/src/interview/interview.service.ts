import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttemptQuestionDto } from './dto/attempt-question.dto';
import { QueryQuestionsDto } from './dto/query-questions.dto';

@Injectable()
export class InterviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getQuestions(query: QueryQuestionsDto, userId?: string) {
    const { category, role, levelOrder, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (category) {
      where['category'] = category;
    }

    if (role) {
      where['OR'] = [{ role }, { role: null }];
    }

    if (levelOrder) {
      where['levelOrder'] = levelOrder;
    }

    if (search) {
      where['OR'] = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, questions] = await Promise.all([
      this.prisma.interviewQuestion.count({ where }),
      this.prisma.interviewQuestion.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ levelOrder: 'asc' }, { id: 'asc' }],
      }),
    ]);

    let solvedSet = new Set<string>();
    if (userId) {
      const attempts = await this.prisma.userQuestionAttempt.findMany({
        where: {
          userId,
          questionId: { in: questions.map((q) => q.id) },
          solved: true,
        },
        select: { questionId: true },
      });
      solvedSet = new Set(attempts.map((a) => a.questionId));
    }

    const items = questions.map((q) => ({
      id: q.id,
      question: q.question,
      answer: q.answer,
      hint: q.hint,
      category: q.category,
      role: q.role,
      levelOrder: q.levelOrder,
      isSolved: solvedSet.has(q.id),
    }));

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getQuestionById(id: string, userId?: string) {
    const question = await this.prisma.interviewQuestion.findUnique({
      where: { id },
      include: {
        attempts: userId ? { where: { userId } } : false,
      },
    });

    if (!question) {
      throw new NotFoundException(`Interview question with ID "${id}" not found`);
    }

    const userAttempt = question.attempts?.[0];

    return {
      id: question.id,
      question: question.question,
      answer: question.answer,
      hint: question.hint,
      category: question.category,
      role: question.role,
      levelOrder: question.levelOrder,
      isSolved: userAttempt?.solved ?? false,
      userNotes: userAttempt?.notes ?? null,
    };
  }

  async recordAttempt(userId: string, questionId: string, dto: AttemptQuestionDto) {
    const question = await this.prisma.interviewQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException(`Interview question with ID "${questionId}" not found`);
    }

    return this.prisma.userQuestionAttempt.upsert({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
      update: {
        solved: dto.solved,
        notes: dto.notes ?? null,
      },
      create: {
        userId,
        questionId,
        solved: dto.solved,
        notes: dto.notes ?? null,
      },
    });
  }

  async getUserStats(userId: string) {
    const [totalQuestions, attempts] = await Promise.all([
      this.prisma.interviewQuestion.count(),
      this.prisma.userQuestionAttempt.findMany({
        where: { userId },
        include: { question: true },
      }),
    ]);

    const solvedAttempts = attempts.filter((a) => a.solved);
    const solvedCount = solvedAttempts.length;

    // Breakdown by level
    const levelCounts: Record<number, { total: number; solved: number }> = {
      1: { total: 0, solved: 0 },
      2: { total: 0, solved: 0 },
      3: { total: 0, solved: 0 },
      4: { total: 0, solved: 0 },
      5: { total: 0, solved: 0 },
    };

    const allQuestions = await this.prisma.interviewQuestion.findMany({
      select: { id: true, levelOrder: true, category: true },
    });

    for (const q of allQuestions) {
      const entry = levelCounts[q.levelOrder] || { total: 0, solved: 0 };
      entry.total += 1;
      levelCounts[q.levelOrder] = entry;
    }

    for (const a of solvedAttempts) {
      const entry = levelCounts[a.question.levelOrder];
      if (entry) {
        entry.solved += 1;
      }
    }

    return {
      totalQuestions,
      solvedCount,
      progressPercentage: totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0,
      levelBreakdown: levelCounts,
    };
  }
}
