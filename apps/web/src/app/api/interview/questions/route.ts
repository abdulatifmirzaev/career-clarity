import {
  getAuthUserFromRequest,
  INTERVIEW_QUESTIONS,
  jsonSuccess,
  serverStore,
} from '@/lib/server-store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const role = url.searchParams.get('role');
  const levelOrder = url.searchParams.get('levelOrder');
  const search = url.searchParams.get('search')?.toLowerCase();
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);

  const user = getAuthUserFromRequest(request);
  const userId = user ? user.id : 'usr_alex_chen_demo';

  let filtered = [...INTERVIEW_QUESTIONS];

  if (category) {
    filtered = filtered.filter((q) => q.category.toLowerCase() === category.toLowerCase());
  }

  if (role) {
    filtered = filtered.filter((q) => !q.role || q.role === role);
  }

  if (levelOrder) {
    filtered = filtered.filter((q) => q.levelOrder === parseInt(levelOrder, 10));
  }

  if (search) {
    filtered = filtered.filter(
      (q) =>
        q.question.toLowerCase().includes(search) ||
        (q.answer && q.answer.toLowerCase().includes(search)),
    );
  }

  const total = filtered.length;
  const skip = (page - 1) * limit;
  const paginated = filtered.slice(skip, skip + limit);

  const items = paginated.map((q) => {
    const attempt = serverStore.getQuestionAttempt(userId, q.id);
    return {
      id: q.id,
      question: q.question,
      answer: q.answer,
      hint: q.hint,
      category: q.category,
      role: q.role,
      levelOrder: q.levelOrder,
      isSolved: attempt ? attempt.solved : false,
      userNotes: attempt?.notes || null,
    };
  });

  return jsonSuccess({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
