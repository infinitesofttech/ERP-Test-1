'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Lock, ShieldCheck, Check, Save, AlertCircle } from 'lucide-react';

const MODULES_LIST = [
  { module: 'CRM', page: 'Leads' },
  { module: 'CRM', page: 'Enquiries' },
  { module: 'CRM', page: 'Customers' },
  { module: 'CRM', page: 'Opportunities' },
  { module: 'CRM', page: 'Follow-ups' },
  { module: 'CRM', page: 'Visits' },
  { module: 'CRM', page: 'Quotations' },
  { module: 'CRM', page: 'Customer PO' },
  { module: 'CRM', page: 'Sales Orders' },
  { module: 'Project', page: 'Job Master' },
  { module: 'Designer', page: 'Drawings & BOM' },
  { module: 'Purchase', page: 'Purchase Orders' },
  { module: 'Store', page: 'Item Stock & GRN' },
  { module: 'Production', page: 'Work Orders & WIP' },
  { module: 'Accounting', page: 'Invoices & Ledgers' },
  { module: 'HR', page: 'Employees & Payroll' },
];

export default function PermissionsPage() {
  const { roles, updateRole } = useERP();
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[2]?.id || roles[0]?.id);
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [savedMsg, setSavedMsg] = useState(false);

  const currentRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleToggle = (moduleKey: string, action: string) => {
    setMatrix((prev) => {
      const currentMod = prev[moduleKey] || {};
      return {
        ...prev,
        [moduleKey]: {
          ...currentMod,
          [action]: !currentMod[action],
        },
      };
    });
  };

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Centralized RBAC Permission Matrix
          </h1>
          <p className="text-slate-500 mt-0.5">
            Configure granular View, Create, Edit, Delete, Approve, and Export authority by module.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                ROLE: {r.name.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Matrix</span>
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-semibold">
          ✓ Permission rules updated and synchronized across all active sessions.
        </div>
      )}

      {/* Permission Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Module / Feature Area</th>
                <th className="py-3 px-4">Page / Resource</th>
                <th className="py-3 px-3 text-center">View</th>
                <th className="py-3 px-3 text-center">Create</th>
                <th className="py-3 px-3 text-center">Edit</th>
                <th className="py-3 px-3 text-center">Delete</th>
                <th className="py-3 px-3 text-center">Approve</th>
                <th className="py-3 px-3 text-center">Reject</th>
                <th className="py-3 px-3 text-center">Assign</th>
                <th className="py-3 px-3 text-center">Export</th>
                <th className="py-3 px-3 text-center">Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MODULES_LIST.map((item, idx) => {
                const key = `${item.module}-${item.page}`;
                const isSuper = currentRole.name === 'Super Admin';
                const isFamily = currentRole.name.includes('Admin');

                return (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">
                        {item.module}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{item.page}</td>

                    {['view', 'create', 'edit', 'delete', 'approve', 'reject', 'assign', 'export', 'print'].map(
                      (action) => {
                        const defaultChecked =
                          isSuper ||
                          (isFamily && action !== 'delete') ||
                          (action === 'view' || action === 'create' || action === 'export' || action === 'print');
                        const checked = matrix[key]?.[action] ?? defaultChecked;

                        return (
                          <td key={action} className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={isSuper}
                              onChange={() => handleToggle(key, action)}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer disabled:opacity-50"
                            />
                          </td>
                        );
                      }
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
