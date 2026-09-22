import { getAdminUserFromRequest, jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return jsonError('Unauthorized administrator access', 401);
    }

    const { id } = await params;
    const deleted = serverStore.deleteInterviewQuestion(id);

    serverStore.createAuditLog(admin.email, 'QUESTION_DELETED', 'InterviewQuestion', id);

    return jsonSuccess({ message: 'Question removed', id, success: deleted });
  } catch {
    return jsonError('Failed to delete question', 500);
  }
}
