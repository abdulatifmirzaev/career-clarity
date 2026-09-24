'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  FileCheck2,
  HelpCircle,
  TrendingUp,
  Server,
  ShieldAlert,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Cpu,
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalAssessments: number;
  totalQuestions: number;
  totalRoadmapNodes: number;
  totalAttempts: number;
  solvedAttempts: number;
  successRate: number;
  levelDistribution: Record<number, number>;
  roleDistribution: {
    users: number;
    admins: number;
  };
  systemHealth: {
    status: string;
    database: string;
    nodeVersion: string;
    uptimeSeconds: number;
    memoryUsageMb: number;
  };
  currentAdmin?: {
    email: string;
    name: string;
    role: string;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load telemetry statistics.');
      }
      setStats(data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error fetching telemetry data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Executive Analytics & Overview Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time platform metrics, database telemetry, and engineering leveling distribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/users"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-600/30 transition-all"
          >
            <span>Manage Users</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Registered Users</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {stats?.totalUsers ?? '...'}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">Active Accounts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {stats?.roleDistribution?.admins ?? 0} Admins &bull;{' '}
            {stats?.roleDistribution?.users ?? 0} Standard Engineers
          </p>
        </div>

        {/* Total Assessments */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Completed Reports</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {stats?.totalAssessments ?? '...'}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">Diagnostic Reports</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Algorithmic level calibration and gap diagnostics
          </p>
        </div>

        {/* Total Questions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Question Bank</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {stats?.totalQuestions ?? '...'}
            </span>
            <span className="text-[11px] text-amber-400 font-medium">Interview Questions</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">System Design, DSA, AI Architecture</p>
        </div>

        {/* Success Rate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Interview Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              %{stats?.successRate ?? '0'}
            </span>
            <span className="text-[11px] text-cyan-400 font-medium">
              {stats?.solvedAttempts ?? 0}/{stats?.totalAttempts ?? 0} Solved
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Platform-wide candidate success accuracy
          </p>
        </div>
      </div>

      {/* Analytics & System Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level Distribution Card */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Engineering Level Distribution</h2>
              <p className="text-xs text-slate-400">
                Calibrated levels across completed diagnostic evaluations
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-mono">L1 - L5 Scale</span>
          </div>

          <div className="space-y-4 pt-2">
            {[
              {
                level: 1,
                name: 'L3 / Junior Engineer',
                count: stats?.levelDistribution?.[1] || 0,
                color: 'bg-blue-500',
              },
              {
                level: 2,
                name: 'L4 / Mid-Level Engineer',
                count: stats?.levelDistribution?.[2] || 0,
                color: 'bg-emerald-500',
              },
              {
                level: 3,
                name: 'L5 / Senior Engineer',
                count: stats?.levelDistribution?.[3] || 0,
                color: 'bg-cyan-500',
              },
              {
                level: 4,
                name: 'L6 / Staff Engineer / Lead',
                count: stats?.levelDistribution?.[4] || 0,
                color: 'bg-purple-500',
              },
              {
                level: 5,
                name: 'L7 / Principal Architect',
                count: stats?.levelDistribution?.[5] || 0,
                color: 'bg-amber-500',
              },
            ].map((lvl) => {
              const total = stats?.totalAssessments || 1;
              const percentage = Math.round((lvl.count / total) * 100);

              return (
                <div key={lvl.level} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{lvl.name}</span>
                    <span className="text-slate-400 font-mono">
                      {lvl.count} engineers ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${lvl.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.max(percentage, lvl.count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System & DB Status Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">System & Database Health</h2>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Healthy
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  Database Engine
                </span>
                <span className="font-mono text-emerald-400 font-medium">Prisma / PostgreSQL</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  Node Runtime
                </span>
                <span className="font-mono text-slate-200">
                  {stats?.systemHealth?.nodeVersion || 'v20+'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Server Uptime
                </span>
                <span className="font-mono text-slate-200">
                  {stats ? formatUptime(stats.systemHealth.uptimeSeconds) : '...'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  Active Memory Usage
                </span>
                <span className="font-mono text-slate-200">
                  {stats?.systemHealth?.memoryUsageMb ?? 0} MB
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Connected Session:</span>
              <span className="text-cyan-400 font-medium">
                {stats?.currentAdmin?.email || 'abdulatif.mirzaev2004@gmail.com'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
