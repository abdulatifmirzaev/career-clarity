import { generateAuthTokens, jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

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

    // Check password (supports demo12345 or plain hash match)
    if (user.passwordHash !== password && !user.passwordHash.includes(password)) {
      return jsonError('Invalid email or password credentials', 401);
    }

    const tokens = generateAuthTokens(user.id, user.email);

    return jsonSuccess({
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        yearsExp: user.yearsExp,
        primaryStack: user.primaryStack,
        createdAt: user.createdAt,
      },
    });
  } catch {
    return jsonError('Internal server error processing login', 500);
  }
}
