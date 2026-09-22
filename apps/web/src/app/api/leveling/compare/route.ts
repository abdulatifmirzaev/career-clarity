import { jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { yearsExp, systemDesignScore = 3, leadershipScore = 3 } = body;

    if (yearsExp === undefined || yearsExp === null) {
      return jsonError('yearsExp is required', 400);
    }

    const result = serverStore.compareLevel(
      Number(yearsExp),
      Number(systemDesignScore),
      Number(leadershipScore),
    );
    return jsonSuccess(result);
  } catch {
    return jsonError('Failed to calculate leveling comparison', 500);
  }
}
