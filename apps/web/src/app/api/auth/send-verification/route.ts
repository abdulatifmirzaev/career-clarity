import { jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return jsonError('Please enter a valid email address.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if account already exists
    const existing = serverStore.findUserByEmail(normalizedEmail);
    if (existing) {
      return jsonError('An account with this email address already exists.', 409);
    }

    // Generate 6-digit OTP
    const code = serverStore.createVerificationCode(normalizedEmail);

    return jsonSuccess({
      message: 'Verification code sent to your email address.',
      email: normalizedEmail,
      // In production/cloud simulation, return code for seamless user feedback if needed
      code,
      expiresInMinutes: 10,
    });
  } catch {
    return jsonError('Failed to send verification code. Please try again.', 500);
  }
}
