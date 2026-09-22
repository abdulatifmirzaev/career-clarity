import { getAdminUserFromRequest, jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

export async function GET(request: Request) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return jsonError('Unauthorized administrator access', 401);
    }

    const questions = serverStore.getAllInterviewQuestions();
    return jsonSuccess({
      total: questions.length,
      questions,
    });
  } catch {
    return jsonError('Failed to fetch interview questions', 500);
  }
}

export async function POST(request: Request) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return jsonError('Unauthorized administrator access', 401);
    }

    const body = await request.json();
    const { question, answer, hint, category, role, levelOrder } = body;

    if (!question || !category || levelOrder === undefined) {
      return jsonError('Question, category, and levelOrder are required fields', 400);
    }

    const newQuestion = serverStore.createInterviewQuestion({
      question,
      answer: answer || '',
      hint: hint || null,
      category,
      role: role || null,
      levelOrder: Number(levelOrder),
    });

    serverStore.createAuditLog(
      admin.email,
      'QUESTION_CREATED',
      'InterviewQuestion',
      newQuestion.id,
      {
        category,
        role,
      },
    );

    return jsonSuccess(newQuestion, 201);
  } catch {
    return jsonError('Failed to create question', 500);
  }
}
