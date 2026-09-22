import { getAuthUserFromRequest, jsonSuccess, serverStore } from '@/lib/server-store';

export async function GET(request: Request) {
  const user = getAuthUserFromRequest(request);
  const userId = user ? user.id : 'usr_alex_chen_demo';

  const summary = serverStore.getProgressSummary(userId);
  return jsonSuccess(summary);
}
