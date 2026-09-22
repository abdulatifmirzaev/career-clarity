import { getAuthUserFromRequest, jsonError, jsonSuccess, serverStore } from '@/lib/server-store';
import { SkillProgressStatus } from '@career-clarity/shared-types';

export async function POST(request: Request, props: { params: Promise<{ skillId: string }> }) {
  try {
    const params = await props.params;
    const { skillId } = params;

    const user = getAuthUserFromRequest(request);
    const userId = user ? user.id : 'usr_alex_chen_demo';

    const body = await request.json();
    const status = body.status as SkillProgressStatus;

    if (!status || !['not_started', 'in_progress', 'mastered'].includes(status)) {
      return jsonError('Invalid status value', 400);
    }

    const updated = serverStore.updateSkillProgress(userId, skillId, status);
    return jsonSuccess(updated);
  } catch {
    return jsonError('Failed to update skill progress', 500);
  }
}
