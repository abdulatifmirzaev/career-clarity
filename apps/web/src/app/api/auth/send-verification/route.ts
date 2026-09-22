import { jsonError, jsonSuccess, serverStore } from '@/lib/server-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return jsonError('Lütfen geçerli bir e-posta adresi girin.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if account already exists
    const existing = serverStore.findUserByEmail(normalizedEmail);
    if (existing) {
      return jsonError('Bu e-posta adresi ile zaten kayıtlı bir hesap bulunmaktadır.', 409);
    }

    // Generate 6-digit OTP
    const code = serverStore.createVerificationCode(normalizedEmail);

    return jsonSuccess({
      message: 'Doğrulama kodu e-posta adresinize gönderildi.',
      email: normalizedEmail,
      // In production/cloud simulation, return code for seamless user feedback if needed
      code,
      expiresInMinutes: 10,
    });
  } catch {
    return jsonError('Doğrulama kodu gönderilemedi. Lütfen tekrar deneyin.', 500);
  }
}
