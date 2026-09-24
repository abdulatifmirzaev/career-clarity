'use client';

import React, { useEffect, useState } from 'react';
import { Activity, RefreshCw, AlertCircle, Shield, Clock } from 'lucide-react';

interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch security audit logs');
      }
      setLogs(data.data.logs || []);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-400" />
            System & Security Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Audit trial of administrator actions, data modifications, and security events
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Administrator</th>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5">Target Scope</th>
                <th className="px-5 py-3.5">Details Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-500" />
                    Fetching security audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    No security audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(log.createdAt).toLocaleString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="px-4 py-3.5 font-medium text-white flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      {log.adminEmail}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-400">
                      {log.targetType} {log.targetId ? `(${log.targetId})` : ''}
                    </td>

                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
