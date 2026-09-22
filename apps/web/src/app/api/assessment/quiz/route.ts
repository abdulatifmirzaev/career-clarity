import { jsonSuccess, QUIZ_BANK } from '@/lib/server-store';
import { RoleType } from '@career-clarity/shared-types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = (url.searchParams.get('role') || 'backend') as RoleType;

  const questions = QUIZ_BANK[role] || QUIZ_BANK.backend;

  // Strip correctOption before sending to client
  const safeQuestions = questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    role: q.role,
    levelOrder: q.levelOrder,
  }));

  return jsonSuccess(safeQuestions);
}
