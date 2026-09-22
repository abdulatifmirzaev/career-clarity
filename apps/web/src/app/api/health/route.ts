import { jsonSuccess } from '@/lib/server-store';

export async function GET() {
  return jsonSuccess({
    status: 'ok',
    uptime: process.uptime(),
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    service: 'Career Clarity Platform API',
  });
}
