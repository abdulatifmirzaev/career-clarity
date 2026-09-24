import { generateAuthTokens, jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, yearsExp, primaryStack, verificationCode } = body;

    if (!email || !password) {
      return jsonError('Email and password are required', 400);
    }

    if (!verificationCode) {
      return jsonError('6-digit email verification code is required.', 400);
    }

    const isCodeValid = serverStore.verifyCode(email, verificationCode);
    if (!isCodeValid) {
      return jsonError('Invalid or expired verification code.', 400);
    }

    const existingUser = serverStore.findUserByEmail(email);
    if (existingUser) {
      return jsonError('An account with this email address already exists', 409);
    }

    const newUser = serverStore.createUser({
      email,
      passwordHash: password,
      name,
      yearsExp: yearsExp ? Number(yearsExp) : undefined,
      primaryStack,
    });

    const tokens = generateAuthTokens(newUser.id, newUser.email, newUser.role);

    return jsonSuccess(
      {
        ...tokens,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          yearsExp: newUser.yearsExp,
          primaryStack: newUser.primaryStack,
          createdAt: newUser.createdAt,
        },
      },
      201,
    );
  } catch {
    return jsonError('Failed to process registration request', 500);
  }
}
