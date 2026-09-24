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

    // Generate 6-digit OTP passcode securely on the server
    const code = serverStore.createVerificationCode(normalizedEmail);

    // Send real email via Resend API if API key configured, otherwise log to server stdout
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Career Clarity <noreply@career-clarity.dev>',
            to: [normalizedEmail],
            subject: 'Your 6-Digit Email Verification Code',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h2 style="color: #0f172a; margin: 0; font-size: 20px;">Verify Your Email Address</h2>
                  <p style="color: #64748b; font-size: 13px; margin-top: 6px;">Career Clarity Engineering Platform</p>
                </div>
                <p style="color: #334155; font-size: 14px; line-height: 1.5;">Thank you for registering! Please use the following 6-digit passcode to verify your account:</p>
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 18px; border-radius: 12px; text-align: center; margin: 24px 0;">
                  <span style="font-family: monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0284c7;">${code}</span>
                </div>
                <p style="color: #94a3b8; font-size: 12px; line-height: 1.4;">This passcode expires in 10 minutes. If you did not initiate this request, please disregard this message.</p>
              </div>
            `,
          }),
        });
      } catch (err) {
        console.error('[EMAIL-DISPATCH-ERROR]', err);
      }
    } else {
      console.log(
        `[MAIL-SERVICE] 📧 Verification OTP Email dispatched to ${normalizedEmail} | Secret Code: ${code}`,
      );
    }

    return jsonSuccess({
      message: 'Verification passcode sent to your email inbox.',
      email: normalizedEmail,
      expiresInMinutes: 10,
    });
  } catch {
    return jsonError('Failed to send verification code. Please try again.', 500);
  }
}
