import { jsonSuccess } from '@/lib/server-store';

export async function POST() {
  const response = jsonSuccess({ message: 'Logged out successfully' });
  response.headers.append(
    'Set-Cookie',
    'career_admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
  );
  return response;
}
