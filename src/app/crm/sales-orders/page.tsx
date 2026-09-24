'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useERP } from '@/context/ERPContext';
import { DataTable, Column } from '@/components/data/DataTable';
import { SalesOrder } from '@/types/crm';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Layers, Briefcase, CheckCircle2, ArrowRight, Sparkles, Zap } from 'lucide-react';

export default function SalesOrdersPage() {
  const router = useRouter();
  const { salesOrders, createProjectFromSalesOrder } = useERP();
  const [successInfo, setSuccessInfo] = useState<{ prj: string; job: string } | null>(null);

  const handleCreateProject = (soId: string) => {
    const newPrj = createProjectFromSalesOrder(soId);
    setSuccessInfo({ prj: newPrj.projectNumber, job: newPrj.jobNumber });
    setTimeout(() => {
      router.push('/projects');
    }, 1800);
  };

  const columns: Column<SalesOrder>[] = [
    {
      header: 'Sales Order #',
      accessorKey: 'salesOrderNumber',
      cell: (so) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 text-xs">
          {so.salesOrderNumber}
        </span>
      ),
    },
    {
      header: 'Customer & PO Reference',
      cell: (so) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{so.customerName}</span>
          <span className="text-[11px] text-slate-400 font-mono">PO: {so.customerPoNumber}</span>
        </div>
      ),
    },
    {
      header: 'Equipment Scope',
      cell: (so) => (
        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-xs">
          {so.items[0]?.productName || 'Custom Manufacturing Machine'}
        </span>
      ),
    },
    {
      header: 'Total Order Value',
      cell: (so) => <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">{formatCurrency(so.orderValue)}</span>,
    },
    {
      header: 'Delivery Target',
      cell: (so) => <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{formatDate(so.deliveryDate)}</span>,
    },
    {
      header: 'MTO Integration Status',
      cell: (so) => (
        <div>
          {so.jobNumber ? (
            <span className="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              Linked Job: {so.jobNumber}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
              Awaiting Job Creation
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions (CRM → Project)',
      cell: (so) => (
        <div>
          {so.jobNumber ? (
            <span className="font-mono font-bold text-slate-600 dark:text-slate-400 text-xs flex items-center gap-1">
              <span>{so.projectId}</span>
            </span>
          ) : (
            <button
              onClick={() => handleCreateProject(so.id)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Create Project / Job</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 text-xs pb-10">
      <div className="bg-white dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md shadow-slate-900/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
              CRM → Project Handover Hub
            </span>
          </div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Confirmed Sales Orders Master
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Click &ldquo;Create Project / Job&rdquo; to instantly generate linked Project (`PRJ-2026-XXXX`) and Shop Floor Job Number (`JOB-2026-XXXX`).
          </p>
        </div>
      </div>

      {successInfo && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl font-bold flex items-center justify-between shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-white text-sm">CRM → Project Integration Triggered Successfully!</span>
              <p className="text-[11px] font-normal text-emerald-300 mt-0.5">
                Created Project: <strong>{successInfo.prj}</strong> | Master Job Number: <strong>{successInfo.job}</strong>. Redirecting to Shop Floor Projects...
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>
      )}

      <DataTable
        title="Active Sales Orders Register"
        subtitle="Make-to-Order contracts ready for Shop Floor Engineering and Fabrication"
        columns={columns}
        data={salesOrders}
      />
    </div>
  );
}
