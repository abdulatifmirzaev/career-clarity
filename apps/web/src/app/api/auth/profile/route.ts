import { getAuthUserFromRequest, jsonError, jsonSuccess } from '@/lib/server-store';

export async function GET(request: Request) {
  const user = getAuthUserFromRequest(request);
  if (!user) {
    return jsonError('Unauthorized access', 401);
  }

  return jsonSuccess(user);
}
