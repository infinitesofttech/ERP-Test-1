'use client';

import React from 'react';
import { useERP } from '../../context/ERPContext';
import { Shield, Clock, ArrowRight, User } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export function AuditLogViewer() {
  const { auditLogs } = useERP();

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'APPROVE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'REJECT':
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'CREATE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'UPDATE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'LOGIN':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Enterprise Audit Log</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">Immutable Trail</span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto text-xs">
        {auditLogs.map((log) => (
          <div key={log.id} className="p-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getActionBadge(log.action)}`}>
                  {log.action}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{log.module} • {log.page}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatDateTime(log.timestamp)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3 text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{log.userName}</span>
                <span className="text-[10px] text-slate-400">({log.role.replace('_', ' ')})</span>
              </div>
              <span className="font-mono text-blue-600 dark:text-blue-400">{log.recordId}</span>
            </div>

            {log.notes && (
              <div className="mt-1 text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
                {log.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
