'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useERP } from '../../../context/ERPContext';
import { DataTable, Column } from '../../../components/data/DataTable';
import { StatusBadge } from '../../../components/workflow/StatusBadge';
import { JobTraceabilityRecord } from '../../../types/erp';
import { formatDate } from '../../../lib/utils';
import { Cpu, Search, Briefcase, Eye, Layers, Wrench, ShieldCheck, Truck, DollarSign } from 'lucide-react';

export default function JobManagementPage() {
  const { jobs, openJobModal, projectJobs } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredJobs = jobs.filter((j) => {
    if (statusFilter !== 'all' && j.currentStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        j.jobNumber.toLowerCase().includes(q) ||
        j.customerName.toLowerCase().includes(q) ||
        j.productName.toLowerCase().includes(q) ||
        j.salesOrderId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: Column<JobTraceabilityRecord>[] = [
    {
      header: 'Job Number (MTO Key)',
      accessorKey: 'jobNumber',
      cell: (j) => (
        <button
          onClick={() => openJobModal(j.jobNumber)}
          className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 text-xs hover:bg-blue-500/20 transition cursor-pointer"
        >
          {j.jobNumber}
        </button>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      cell: (j) => <span className="font-bold text-slate-900 dark:text-white">{j.customerName}</span>,
    },
    {
      header: 'Machine / Equipment',
      cell: (j) => (
        <div className="max-w-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{j.productName}</span>
          <span className="text-[10px] text-slate-400 block truncate">{j.specification}</span>
        </div>
      ),
    },
    {
      header: 'Target Delivery',
      cell: (j) => <span className="font-mono text-slate-600 dark:text-slate-300 text-[11px]">{formatDate(j.targetDeliveryDate)}</span>,
    },
    {
      header: 'Connected Traceability',
      cell: (j) => (
        <div className="text-[10px] font-mono space-y-0.5">
          <div className="text-slate-400">SO: {j.salesOrderId} | PO: {j.customerPoNumber}</div>
          <div className="text-blue-500 font-bold">BOM: {j.linkedRecords.bomId}</div>
        </div>
      ),
    },
    {
      header: 'Progress',
      cell: (j) => (
        <div className="w-24">
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400">Progress</span>
            <span className="font-bold text-blue-500">{j.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${j.progressPercent}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (j) => <StatusBadge status={j.currentStatus} />,
    },
    {
      header: 'Actions',
      cell: (j) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openJobModal(j.jobNumber)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>360° View</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 text-xs pb-10">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
              Manufacturing Job Registry
            </span>
          </div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            Make-to-Order (MTO) Job Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            The Job Number is the single common identifier across CRM, Design, Purchase, Store, Production, QC, Dispatch, and Service.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0B1120] p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Job #, Customer, Machine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold focus:outline-none"
        >
          <option value="all">All Job Statuses</option>
          <option value="planning">Planning</option>
          <option value="design">Design</option>
          <option value="production">Production</option>
          <option value="qc">QC</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Jobs Table */}
      <DataTable
        title="360° Connected MTO Manufacturing Jobs"
        subtitle={`Total ${filteredJobs.length} Jobs active`}
        columns={columns}
        data={filteredJobs}
        onRowClick={(j) => openJobModal(j.jobNumber)}
      />
    </div>
  );
}
