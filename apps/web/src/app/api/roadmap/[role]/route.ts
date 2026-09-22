import {
  getAuthUserFromRequest,
  jsonSuccess,
  ROADMAP_NODES,
  serverStore,
} from '@/lib/server-store';
import { RoleType } from '@career-clarity/shared-types';

export async function GET(request: Request, props: { params: Promise<{ role: string }> }) {
  const params = await props.params;
  const role = (params.role || 'backend') as RoleType;

  const nodes = ROADMAP_NODES[role] || ROADMAP_NODES.backend;
  const user = getAuthUserFromRequest(request);

  const progressMap = user ? serverStore.getUserSkillProgress(user.id) : new Map();

  const enrichedNodes = nodes.map((node) => ({
    ...node,
    status: progressMap.get(node.skillId) || 'not_started',
  }));

  return jsonSuccess(enrichedNodes);
}
