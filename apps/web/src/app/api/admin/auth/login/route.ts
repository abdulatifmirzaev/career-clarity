import {
  generateAuthTokens,
  jsonError,
  jsonSuccess,
  serverStore,
  verifyPassword,
} from '@/lib/server-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return jsonError('Admin email and password are required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = serverStore.findUserByEmail(normalizedEmail);

    if (!user) {
      return jsonError('Invalid admin credentials', 401);
    }

    // Must be admin or superadmin, or the specific requested email
    const isOwner = normalizedEmail === 'abdulatif.mirzaev2004@gmail.com';
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN';

    if (!isOwner && !isAdmin) {
      return jsonError('Access denied: You do not have administrator privileges', 403);
    }

    if (user.status === 'SUSPENDED') {
      return jsonError('Administrator account is suspended', 403);
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return jsonError('Invalid admin credentials', 401);
    }

    // Ensure superadmin status for designated owner
    if (isOwner && user.role !== 'SUPERADMIN') {
      serverStore.updateUserRole(user.id, 'SUPERADMIN');
      user.role = 'SUPERADMIN';
    }

    serverStore.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
    serverStore.createAuditLog(user.email, 'ADMIN_LOGIN', 'User', user.id, {
      ip: request.headers.get('x-forwarded-for') || 'local',
    });

    const tokens = generateAuthTokens(user.id, user.email, user.role);

    // Create response and set secure cookie
    const response = jsonSuccess({
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.headers.append(
      'Set-Cookie',
      `career_admin_token=${tokens.accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
    );

    return response;
  } catch {
    return jsonError('Failed to process admin login', 500);
  }
}
