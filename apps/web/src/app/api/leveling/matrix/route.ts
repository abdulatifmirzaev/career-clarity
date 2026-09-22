import { COMPANIES_DATA, jsonSuccess } from '@/lib/server-store';

export async function GET() {
  return jsonSuccess(COMPANIES_DATA);
}
