import { getAuthUserFromRequest, jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id: questionId } = params;

    const user = getAuthUserFromRequest(request);
    const userId = user ? user.id : 'usr_alex_chen_demo';

    const body = await request.json();
    const { solved, notes } = body;

    const attempt = serverStore.recordQuestionAttempt(userId, questionId, Boolean(solved), notes);
    return jsonSuccess(attempt);
  } catch {
    return jsonError('Failed to record question attempt', 500);
  }
}
