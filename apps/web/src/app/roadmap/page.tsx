'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  Position,
  ReactFlow,
} from '@xyflow/react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Filter,
  Flame,
  LayoutGrid,
  Network,
  RotateCw,
  Zap,
} from 'lucide-react';
import {
  AIRelevance,
  RoadmapNodeDto,
  RoleType,
  SkillProgressStatus,
} from '@career-clarity/shared-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

const ROLES: { id: RoleType; label: string }[] = [
  { id: 'backend', label: 'Backend Architecture' },
  { id: 'frontend', label: 'Frontend & Web Platform' },
  { id: 'fullstack', label: 'Fullstack Engineering' },
  { id: 'ai_engineer', label: 'AI Systems Engineer' },
];

const STATUS_CONFIG: Record<
  SkillProgressStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  not_started: {
    label: 'Not Started',
    bg: 'bg-muted/40',
    text: 'text-muted-foreground',
    border: 'border-border/60',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  mastered: {
    label: 'Mastered',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
};

interface CustomNodeData extends Record<string, unknown> {
  skillId: string;
  name: string;
  category: string;
  aiRelevance: AIRelevance;
  levelOrder: number;
  status: SkillProgressStatus;
  onStatusChange: (skillId: string, status: SkillProgressStatus) => void;
}

// Custom Node for React Flow
function CustomSkillNode({ data }: NodeProps<Node<CustomNodeData>>) {
  const { skillId, name, category, aiRelevance, levelOrder, status, onStatusChange } = data;

  const relevanceIcon =
    aiRelevance === 'critical' ? (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
        <Flame className="h-3 w-3" /> Critical
      </span>
    ) : aiRelevance === 'eased_by_ai' ? (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
        <Zap className="h-3 w-3" /> AI Eased
      </span>
    ) : (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
        <AlertTriangle className="h-3 w-3" /> Declining
      </span>
    );

  const statusStyle = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;

  const cycleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: Record<SkillProgressStatus, SkillProgressStatus> = {
      not_started: 'in_progress',
      in_progress: 'mastered',
      mastered: 'not_started',
    };
    onStatusChange(skillId, nextStatus[status]);
  };

  return (
    <div className="group relative rounded-xl border border-border/80 bg-card/95 p-3.5 shadow-xl backdrop-blur-md transition-all hover:border-primary/60 hover:shadow-primary/5 w-[240px] text-left">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background"
      />

      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
          {category}
        </span>
        <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
          L{levelOrder}
        </Badge>
      </div>

      <div className="font-semibold text-xs text-foreground mb-2 leading-snug line-clamp-2">
        {name}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
        {relevanceIcon}
        <button
          type="button"
          onClick={cycleStatus}
          className={`text-[10px] font-medium px-2 py-1 rounded-md border transition-all flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} hover:opacity-80`}
        >
          {status === 'mastered' && <CheckCircle2 className="h-2.5 w-2.5" />}
          {status === 'in_progress' && <RotateCw className="h-2.5 w-2.5" />}
          {statusStyle.label}
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background"
      />
    </div>
  );
}

export default function RoadmapPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const [selectedRole, setSelectedRole] = React.useState<RoleType>('backend');
  const [viewMode, setViewMode] = React.useState<'graph' | 'list'>('graph');
  const [filterRelevance, setFilterRelevance] = React.useState<string>('all');

  // Fetch roadmap nodes for role
  const { data: roadmapNodes } = useQuery({
    queryKey: ['roadmap', selectedRole],
    queryFn: () => apiClient<RoadmapNodeDto[]>(`/roadmap/${selectedRole}`),
  });

  // Mutation to update skill progress
  const progressMutation = useMutation({
    mutationFn: ({ skillId, status }: { skillId: string; status: SkillProgressStatus }) =>
      apiClient(`/roadmap/skills/${skillId}/progress`, {
        method: 'PATCH',
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', selectedRole] });
      queryClient.invalidateQueries({ queryKey: ['roadmap-user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['latest-assessment'] });
    },
  });

  const handleStatusChange = (skillId: string, status: SkillProgressStatus) => {
    if (!isAuthenticated) return;
    progressMutation.mutate({ skillId, status });
  };

  const nodeTypes = React.useMemo(() => ({ customSkill: CustomSkillNode }), []);

  // Compute graph nodes and edges
  const { flowNodes, flowEdges } = React.useMemo(() => {
    if (!roadmapNodes || roadmapNodes.length === 0) {
      return { flowNodes: [], flowEdges: [] };
    }

    // Filter if needed
    const filtered = roadmapNodes.filter((node) => {
      if (filterRelevance === 'all') return true;
      return node.skill.aiRelevance === filterRelevance;
    });

    // Group nodes by level for layout calculation
    const levelsMap = new Map<number, RoadmapNodeDto[]>();
    filtered.forEach((node) => {
      const lvl = node.levelOrder || 1;
      const list = levelsMap.get(lvl) || [];
      list.push(node);
      levelsMap.set(lvl, list);
    });

    const calculatedNodes: Node<CustomNodeData>[] = [];
    const calculatedEdges: {
      id: string;
      source: string;
      target: string;
      animated: boolean;
      style: { stroke: string; strokeWidth: number };
      markerEnd: { type: MarkerType; color: string };
    }[] = [];

    const LEVEL_SPACING_Y = 160;
    const NODE_WIDTH = 270;

    levelsMap.forEach((nodesInLevel, level) => {
      const totalWidth = (nodesInLevel.length - 1) * NODE_WIDTH;
      const startX = -totalWidth / 2;

      nodesInLevel.forEach((node, idx) => {
        const posX = startX + idx * NODE_WIDTH;
        const posY = (level - 1) * LEVEL_SPACING_Y;

        calculatedNodes.push({
          id: node.id,
          type: 'customSkill',
          position: { x: posX + 350, y: posY + 40 },
          data: {
            skillId: node.skillId,
            name: node.skill.name,
            category: node.skill.category,
            aiRelevance: node.skill.aiRelevance,
            levelOrder: node.levelOrder,
            status: node.status || 'not_started',
            onStatusChange: handleStatusChange,
          },
        });

        // Add edge if node has parentNodeId
        if (node.parentNodeId) {
          calculatedEdges.push({
            id: `e-${node.parentNodeId}-${node.id}`,
            source: node.parentNodeId,
            target: node.id,
            animated: node.status === 'in_progress',
            style: {
              stroke:
                node.status === 'mastered'
                  ? 'rgba(16, 185, 129, 0.6)'
                  : node.status === 'in_progress'
                    ? 'rgba(59, 130, 246, 0.6)'
                    : 'rgba(156, 163, 175, 0.3)',
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color:
                node.status === 'mastered' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(156, 163, 175, 0.5)',
            },
          });
        }
      });
    });

    return { flowNodes: calculatedNodes, flowEdges: calculatedEdges };
  }, [roadmapNodes, filterRelevance, handleStatusChange]);

  // Group roadmap nodes by Level for List View
  const nodesByLevel = React.useMemo(() => {
    if (!roadmapNodes) return {};
    const grouped: Record<number, RoadmapNodeDto[]> = {};
    roadmapNodes.forEach((node) => {
      const lvl = node.levelOrder;
      if (!grouped[lvl]) grouped[lvl] = [];
      grouped[lvl].push(node);
    });
    return grouped;
  }, [roadmapNodes]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-card/80 via-card/50 to-primary/5 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Engineering Skill Roadmap
            </h1>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary text-[11px] font-mono"
            >
              AI-Era Calibrated
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Navigate the interactive technical dependency graph. Highlight critical systems
            invariants vs AI-eased tasks.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-secondary/50 p-1 rounded-lg border border-border/60">
            <button
              type="button"
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'graph'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              <span>Interactive Graph</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Timeline View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Selector & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border min-h-[40px] ${
                selectedRole === role.id
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border/60 bg-card/40 text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>

        {/* AI Relevance Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={filterRelevance}
            onChange={(e) => setFilterRelevance(e.target.value)}
            aria-label="Filter skills by AI relevance"
            className="text-xs bg-card/60 border border-border/60 rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[38px]"
          >
            <option value="all">All AI Tags</option>
            <option value="critical">Critical (Irreplaceable)</option>
            <option value="eased_by_ai">Eased by AI (Accelerated)</option>
            <option value="declining">Declining (Legacy)</option>
          </select>
        </div>
      </div>

      {/* Main Roadmap Area */}
      {viewMode === 'graph' ? (
        <Card className="border-border/60 bg-card/30 backdrop-blur-sm overflow-hidden h-[640px] relative">
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
            className="bg-dot-pattern"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="rgba(150, 150, 150, 0.2)"
            />
            <Controls className="!bg-card !border-border !rounded-lg !shadow-lg" />
            <MiniMap
              nodeColor={(n) => {
                const nodeData = n.data as unknown as CustomNodeData;
                if (nodeData.status === 'mastered') return '#10b981';
                if (nodeData.status === 'in_progress') return '#3b82f6';
                return '#64748b';
              }}
              className="!bg-card/90 !border-border !rounded-lg"
            />
          </ReactFlow>

          {/* Quick Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-card/90 backdrop-blur-md border border-border/60 px-3 py-2 rounded-xl text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">Legend:</span>
            <span className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-red-400" /> Critical
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-blue-400" /> AI Accelerated
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-400" /> Declining
            </span>
            <span className="text-border">|</span>
            <span>Click status tag to toggle progress</span>
          </div>
        </Card>
      ) : (
        /* Timeline / List View */
        <div className="space-y-6">
          {Object.keys(nodesByLevel).length === 0 ? (
            <Card className="p-8 text-center border-border/60">
              <p className="text-sm text-muted-foreground">
                No roadmap skills available for this role.
              </p>
            </Card>
          ) : (
            Object.entries(nodesByLevel)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([lvl, nodes]) => (
                <Card key={lvl} className="border-border/60 bg-card/40 backdrop-blur-sm">
                  <CardHeader className="pb-3 border-b border-border/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-bold">Level {lvl} Progression</CardTitle>
                      </div>
                      <Badge variant="secondary" className="font-mono text-[11px]">
                        {nodes.length} {nodes.length === 1 ? 'Competency' : 'Competencies'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {nodes.map((node) => {
                        const statusStyle = STATUS_CONFIG[node.status || 'not_started'];
                        return (
                          <div
                            key={node.id}
                            className="p-3.5 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/30 transition-all flex flex-col justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono uppercase text-muted-foreground">
                                  {node.skill.category}
                                </span>
                                {node.skill.aiRelevance === 'critical' && (
                                  <span className="text-[10px] font-semibold text-red-400 flex items-center gap-1">
                                    <Flame className="h-3 w-3" /> Critical
                                  </span>
                                )}
                                {node.skill.aiRelevance === 'eased_by_ai' && (
                                  <span className="text-[10px] font-semibold text-blue-400 flex items-center gap-1">
                                    <Zap className="h-3 w-3" /> AI Eased
                                  </span>
                                )}
                                {node.skill.aiRelevance === 'declining' && (
                                  <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" /> Declining
                                  </span>
                                )}
                              </div>
                              <div className="font-semibold text-xs text-foreground">
                                {node.skill.name}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                              <span className="text-[11px] text-muted-foreground">Status</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextStatus: Record<
                                    SkillProgressStatus,
                                    SkillProgressStatus
                                  > = {
                                    not_started: 'in_progress',
                                    in_progress: 'mastered',
                                    mastered: 'not_started',
                                  };
                                  handleStatusChange(
                                    node.skillId,
                                    nextStatus[node.status || 'not_started'],
                                  );
                                }}
                                className={`text-[11px] font-medium px-2.5 py-1 rounded-md border min-h-[32px] flex items-center gap-1.5 transition-all ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                              >
                                {node.status === 'mastered' && <CheckCircle2 className="h-3 w-3" />}
                                {node.status === 'in_progress' && <RotateCw className="h-3 w-3" />}
                                {statusStyle.label}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}
    </div>
  );
}
