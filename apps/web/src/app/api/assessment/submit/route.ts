import {
  getAuthUserFromRequest,
  jsonError,
  jsonSuccess,
  QUIZ_BANK,
  serverStore,
} from '@/lib/server-store';
import { AssessmentDto, CareerClarityReport, RoleType } from '@career-clarity/shared-types';

export async function POST(request: Request) {
  try {
    const user = getAuthUserFromRequest(request);
    const userId = user ? user.id : 'usr_alex_chen_demo';

    const body = await request.json();
    const { role = 'backend', yearsExp = 3, answers = [], primaryStack } = body;
    const currentRole = role as RoleType;

    const questions = QUIZ_BANK[currentRole] || QUIZ_BANK.backend;

    // Calculate score
    let correctCount = 0;
    for (const ans of answers) {
      const q = questions.find((item) => item.id === ans.questionId);
      if (q && q.correctOption === ans.selectedOption) {
        correctCount += 1;
      }
    }

    const quizScoreRatio = questions.length > 0 ? correctCount / questions.length : 0.5;

    let calculatedOrder = 1;
    const expNum = Number(yearsExp);
    if (expNum >= 10) {
      calculatedOrder = quizScoreRatio >= 0.75 ? 5 : 4;
    } else if (expNum >= 6) {
      calculatedOrder = quizScoreRatio >= 0.75 ? 4 : 3;
    } else if (expNum >= 3) {
      calculatedOrder = quizScoreRatio >= 0.75 ? 3 : 2;
    } else if (expNum >= 1.5) {
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

    const report: CareerClarityReport = {
      overallLevelOrder: calculatedOrder,
      overallTitle,
      role: currentRole,
      yearsExp: expNum,
      summary: `Based on your ${expNum} years of experience and diagnostic assessment score (${correctCount}/${questions.length} correct), your engineering level correlates to ${overallTitle}. You demonstrate strong command of core principles with clear growth trajectories for higher organizational impact.`,
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
        `Complete the ${currentRole.toUpperCase()} AI-era roadmap milestones for Level ${calculatedOrder}`,
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

    // Update user profile if authenticated
    if (user) {
      serverStore.updateUser(user.id, {
        yearsExp: expNum,
        ...(primaryStack ? { primaryStack } : {}),
      });
    }

    const createdAssessment: AssessmentDto = {
      id: `asm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      resultLevelOrder: calculatedOrder,
      reportJson: report,
      createdAt: new Date().toISOString(),
    };

    serverStore.saveAssessment(userId, createdAssessment);

    return jsonSuccess(createdAssessment);
  } catch {
    return jsonError('Failed to submit assessment', 500);
  }
}
