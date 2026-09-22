import { getAdminUserFromRequest, jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

export async function GET(request: Request) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return jsonError('Unauthorized administrator access', 401);
    }

    const logs = serverStore.getAuditLogs();
    return jsonSuccess({
      total: logs.length,
      logs,
    });
  } catch {
    return jsonError('Failed to fetch audit logs', 500);
  }
}
