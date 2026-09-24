'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useERP } from '../../../context/ERPContext';
import { DataTable, Column } from '../../../components/data/DataTable';
import { StatusBadge } from '../../../components/workflow/StatusBadge';
import { Quotation } from '../../../types/crm';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { FileCheck2, Plus, ArrowUpRight, Sparkles, Layers } from 'lucide-react';

export default function QuotationsListPage() {
  const router = useRouter();
  const { quotations } = useERP();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredQuotations = quotations.filter((q) => {
    if (statusFilter !== 'all' && q.latestSummary.status !== statusFilter) return false;
    return true;
  });

  const columns: Column<Quotation>[] = [
    {
      header: 'Quotation #',
      accessorKey: 'quotationNumber',
      cell: (q) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 text-xs">
          {q.quotationNumber}
        </span>
      ),
    },
    {
      header: 'Active Revision',
      cell: (q) => (
        <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 font-mono text-[10px] font-bold border border-purple-500/20">
          {q.currentRevision} ({q.revisions.length} Revs)
        </span>
      ),
    },
    {
      header: 'Customer & Contact',
      cell: (q) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{q.customerName}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{q.contactPerson}</span>
        </div>
      ),
    },
    {
      header: 'Equipment Scope',
      cell: (q) => (
        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-xs">
          {q.latestSummary.machineProduct}
        </span>
      ),
    },
    {
      header: 'Grand Total (INR)',
      cell: (q) => (
        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs">
          {formatCurrency(q.latestSummary.grandTotal)}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: (q) => <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{formatDate(q.date)}</span>,
    },
    {
      header: 'Status',
      cell: (q) => <StatusBadge status={q.latestSummary.status as any} />,
    },
    {
      header: 'Actions',
      cell: (q) => (
        <Link
          href={`/crm/quotations/${q.id}`}
          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg font-bold text-xs flex items-center gap-1 transition"
        >
          <span>View / Revs</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-5 text-xs pb-10">
      <div className="bg-white dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md shadow-slate-900/5">
        <div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-purple-600" />
            Engineering Quotations & Multi-Revision Master
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Prepare technical & commercial proposals with revision control (Rev-00, Rev-01), BOM pricing, and approval workflows.
          </p>
        </div>

        <Link
          href="/crm/quotations/new"
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-md shadow-purple-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Quotation</span>
        </Link>
      </div>

      <DataTable
        title="Active Quotations Register & Version Audit"
        columns={columns}
        data={filteredQuotations}
        onRowClick={(q) => router.push(`/crm/quotations/${q.id}`)}
        filterComponent={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Quotation Statuses</option>
            <option value="draft">Draft</option>
            <option value="internal_review">Internal Review</option>
            <option value="approved">Approved by Manager</option>
            <option value="sent">Sent to Customer</option>
            <option value="accepted">Customer Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        }
      />
    </div>
  );
}
