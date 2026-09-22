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
      return jsonError('Email and password are required', 400);
    }

    const user = serverStore.findUserByEmail(email);
    if (!user) {
      return jsonError('Invalid email or password credentials', 401);
    }

    if (user.status === 'SUSPENDED') {
      return jsonError('This account has been suspended. Please contact admin.', 403);
    }

    const isMatch = verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return jsonError('Invalid email or password credentials', 401);
    }

    // Update last login
    serverStore.updateUser(user.id, { lastLoginAt: new Date().toISOString() });

    const tokens = generateAuthTokens(user.id, user.email, user.role);

    return jsonSuccess({
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        yearsExp: user.yearsExp,
        primaryStack: user.primaryStack,
        createdAt: user.createdAt,
      },
    });
  } catch {
    return jsonError('Internal server error processing login', 500);
  }
}
