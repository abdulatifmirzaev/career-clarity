import { getAdminUserFromRequest, jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

export async function GET(request: Request) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return jsonError('Unauthorized administrator access', 401);
    }

    const stats = serverStore.getAdminStats();
    return jsonSuccess({
      ...stats,
      currentAdmin: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch {
    return jsonError('Failed to fetch administrator statistics', 500);
  }
}
