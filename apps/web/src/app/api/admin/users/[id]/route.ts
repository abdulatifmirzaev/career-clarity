import { getAdminUserFromRequest, jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return jsonError('Unauthorized administrator access', 401);
    }

    const { id } = await params;
    const body = await request.json();
    const { role, status, name, yearsExp, primaryStack } = body;

    const user = serverStore.findUserById(id);
    if (!user) {
      return jsonError('User not found', 404);
    }

    if (role && (role === 'USER' || role === 'ADMIN' || role === 'SUPERADMIN')) {
      serverStore.updateUserRole(id, role);
    }

    if (status && (status === 'ACTIVE' || status === 'SUSPENDED')) {
      serverStore.updateUserStatus(id, status);
    }

    if (name !== undefined || yearsExp !== undefined || primaryStack !== undefined) {
      serverStore.updateUser(id, {
        ...(name !== undefined && { name }),
        ...(yearsExp !== undefined && { yearsExp: Number(yearsExp) }),
        ...(primaryStack !== undefined && { primaryStack }),
      });
    }

    serverStore.createAuditLog(admin.email, 'USER_UPDATED', 'User', id, {
      changes: body,
    });

    const updatedUser = serverStore.findUserById(id);
    return jsonSuccess({
      id: updatedUser?.id,
      email: updatedUser?.email,
      name: updatedUser?.name,
      role: updatedUser?.role,
      status: updatedUser?.status,
      yearsExp: updatedUser?.yearsExp,
      primaryStack: updatedUser?.primaryStack,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return jsonError('Failed to update user', 500);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return jsonError('Unauthorized administrator access', 401);
    }

    const { id } = await params;
    const targetUser = serverStore.findUserById(id);
    if (!targetUser) {
      return jsonError('User not found', 404);
    }

    if (targetUser.email.toLowerCase() === 'abdulatif.mirzaev2004@gmail.com') {
      return jsonError('Primary administrator cannot be deleted', 403);
    }

    const deleted = serverStore.deleteUser(id);
    if (!deleted) {
      return jsonError('Could not delete user', 400);
    }

    serverStore.createAuditLog(admin.email, 'USER_DELETED', 'User', id, {
      deletedEmail: targetUser.email,
    });

    return jsonSuccess({ message: 'User deleted successfully', id });
  } catch {
    return jsonError('Failed to delete user', 500);
  }
}
