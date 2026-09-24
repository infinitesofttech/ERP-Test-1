'use client';

import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { StatusBadge } from '../components/workflow/StatusBadge';
import { DataTable, Column } from '../components/data/DataTable';
import { AuditLogViewer } from '../components/audit/AuditLogViewer';
import { JobTraceabilityRecord } from '../types/erp';
import { formatCurrency, formatDate } from '../lib/utils';
import {
  TrendingUp,
  Briefcase,
  Factory,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  FileCheck2,
  ChevronRight,
  Layers,
  Sparkles,
  Zap,
  Activity,
  Cpu,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    currentUser,
    activeDepartment,
    jobs,
    openJobModal,
    leads,
    quotations,
    salesOrders,
  } = useERP();

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredJobs = jobs.filter((job) => {
    if (statusFilter !== 'all' && job.currentStatus !== statusFilter) return false;
    return true;
  });

  const totalOrderValue = jobs.reduce((acc, curr) => acc + curr.orderValue, 0);
  const activeJobsCount = jobs.filter((j) => j.currentStatus !== 'completed' && j.currentStatus !== 'cancelled').length;
  const inProductionCount = jobs.filter((j) => j.currentStatus === 'production').length;
  const urgentCount = jobs.filter((j) => j.priority === 'urgent' || j.priority === 'high').length;

  const columns: Column<JobTraceabilityRecord>[] = [
    {
      header: 'Job # (MTO)',
      accessorKey: 'jobNumber',
      cell: (job) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 text-xs">
          {job.jobNumber}
        </span>
      ),
    },
    {
      header: 'Customer & PO Reference',
      cell: (job) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">{job.customerName}</span>
          <span className="text-[11px] text-slate-400 font-mono">PO: {job.customerPoNumber}</span>
        </div>
      ),
    },
    {
      header: 'Equipment Scope & Specification',
      cell: (job) => (
        <div className="max-w-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{job.productName}</span>
          <span className="text-[11px] text-slate-400 block truncate">{job.specification}</span>
        </div>
      ),
    },
    {
      header: 'Order Value (INR)',
      cell: (job) => (
        <span className="font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(job.orderValue)}</span>
      ),
    },
    {
      header: 'Target Dispatch',
      cell: (job) => (
        <span className="text-slate-600 dark:text-slate-300 font-medium">{formatDate(job.targetDeliveryDate)}</span>
      ),
    },
    {
      header: 'Shop Floor Progress',
      cell: (job) => (
        <div className="w-32">
          <div className="flex justify-between items-center text-[10px] mb-1 font-mono">
            <span className="text-slate-400 font-semibold">Progress</span>
            <span className="font-bold text-blue-500">{job.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${job.progressPercent}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Current Stage',
      cell: (job) => <StatusBadge status={job.currentStatus} />,
    },
    {
      header: 'Traceability',
      cell: (job) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openJobModal(job.jobNumber);
          }}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm shadow-blue-600/30 cursor-pointer"
        >
          <span>360° View</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Ambient Command Center Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B1120] via-slate-900 to-blue-950 p-6 sm:p-8 text-white border border-slate-800/80 shadow-2xl shadow-black/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Live MTO Manufacturing ERP
              </span>
              <span className="text-slate-400 text-xs">• Uma Techno Fab Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Commercial Operations & 360° Job Traceability
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unified control center connecting Customer Enquiries, Multi-Revision Quotations, Approved Customer POs, and Shop Floor Job Orders.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {currentUser.firstName.slice(0, 1)}{currentUser.lastName.slice(0, 1)}
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Active Terminal Operator</span>
              <span className="text-xs font-bold text-white block">{currentUser.firstName} {currentUser.lastName}</span>
              <span className="text-[10px] uppercase font-mono text-amber-400 font-bold">{currentUser.roleName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-900/5 flex items-center justify-between hover-card-glow">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Order Backlog</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 block font-mono">
              {formatCurrency(totalOrderValue)}
            </span>
            <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 4 Active Production Jobs
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-900/5 flex items-center justify-between hover-card-glow">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Shop Floor Machines</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 block font-mono">
              {activeJobsCount} Equipment
            </span>
            <span className="text-[11px] text-blue-500 font-bold flex items-center gap-1 mt-1">
              <Factory className="w-3.5 h-3.5" /> {inProductionCount} In Fabrication
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-900/5 flex items-center justify-between hover-card-glow">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Critical Expedited</span>
            <span className="text-xl sm:text-2xl font-black text-rose-500 mt-1 block font-mono">
              {urgentCount} High Priority
            </span>
            <span className="text-[11px] text-rose-500 font-bold flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Fast-Track Schedule
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-900/5 flex items-center justify-between hover-card-glow">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Quality & ISO Compliance</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-500 mt-1 block font-mono">
              100% Passed
            </span>
            <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> ISO 9001:2015 & IBR
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Master Jobs Table */}
      <DataTable
        title="Make-to-Order Manufacturing Job Master & 360° Traceability"
        subtitle="Every transaction is tied to a unique Job ID with full cross-department lifecycle history"
        columns={columns}
        data={filteredJobs}
        onRowClick={(job) => openJobModal(job.jobNumber)}
        searchPlaceholder="Search Job #, Customer, Equipment, PO Number..."
        filterComponent={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 font-bold focus:outline-none"
          >
            <option value="all">All Stages</option>
            <option value="production">In Production</option>
            <option value="design">Design & BOM</option>
            <option value="qc">QC / Inspection</option>
            <option value="completed">Completed</option>
          </select>
        }
      />

      {/* Audit Log Stream */}
      <AuditLogViewer />
    </div>
  );
}
