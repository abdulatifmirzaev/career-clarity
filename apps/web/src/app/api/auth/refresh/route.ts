import {
  generateAuthTokens,
  jsonError,
  jsonSuccess,
  serverStore,
  verifyRefreshToken,
} from '@/lib/server-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return jsonError('Refresh token is required', 400);
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return jsonError('Invalid or expired refresh token', 401);
    }

    const user = serverStore.findUserById(payload.sub);
    if (!user) {
      return jsonError('User account not found', 401);
    }

    const tokens = generateAuthTokens(user.id, user.email);
    return jsonSuccess(tokens);
  } catch {
    return jsonError('Failed to refresh authentication token', 500);
  }
}
