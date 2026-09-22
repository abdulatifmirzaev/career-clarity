import { getAdminUserFromRequest, jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

export async function GET(request: Request) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return jsonError('Unauthorized administrator access', 401);
    }

    const users = serverStore.getAllUsers();
    return jsonSuccess({
      total: users.length,
      users,
    });
  } catch {
    return jsonError('Failed to fetch users list', 500);
  }
}

export async function POST(request: Request) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return jsonError('Unauthorized administrator access', 401);
    }

    const body = await request.json();
    const { email, password, name, role, yearsExp, primaryStack } = body;

    if (!email || !password) {
      return jsonError('Email and password are required', 400);
    }

    const existing = serverStore.findUserByEmail(email);
    if (existing) {
      return jsonError('User with this email already exists', 409);
    }

    const newUser = serverStore.createUser({
      email,
      passwordHash: password,
      name,
      role: role || 'USER',
      yearsExp: yearsExp ? Number(yearsExp) : undefined,
      primaryStack,
    });

    serverStore.createAuditLog(admin.email, 'USER_CREATED', 'User', newUser.id, {
      createdEmail: newUser.email,
      role: newUser.role,
    });

    return jsonSuccess(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
        yearsExp: newUser.yearsExp,
        primaryStack: newUser.primaryStack,
        createdAt: newUser.createdAt,
      },
      201,
    );
  } catch {
    return jsonError('Failed to create user', 500);
  }
}
