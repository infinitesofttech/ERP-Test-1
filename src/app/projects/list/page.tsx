'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useERP } from '../../../context/ERPContext';
import { DataTable, Column } from '../../../components/data/DataTable';
import { StatusBadge } from '../../../components/workflow/StatusBadge';
import { ProjectJobMaster } from '../../../types/crm';
import { formatCurrency, formatDate } from '../../../lib/utils';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Cpu,
  CheckSquare,
  Users,
  Folder,
  Clock,
  X,
  FileCheck2,
  Building,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function ProjectListPage() {
  const router = useRouter();
  const { projectJobs, salesOrders, createProjectFromSalesOrder, openJobModal, can, currentUser } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [managerFilter, setManagerFilter] = useState('all');

  // Modal State for Create Project from Sales Order
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSOId, setSelectedSOId] = useState('');
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Confirmed Sales Orders available for Project creation
  const confirmedSalesOrders = salesOrders.filter((s) => s.status === 'confirmed');

  const filteredProjects = projectJobs.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && p.priority !== priorityFilter) return false;
    if (managerFilter !== 'all' && p.projectManager !== managerFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.projectNumber.toLowerCase().includes(q) ||
        p.jobNumber.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.productName.toLowerCase().includes(q) ||
        p.salesOrderNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateProject = () => {
    if (!selectedSOId) {
      setErrorMsg('Please select a confirmed Sales Order.');
      return;
    }
    try {
      setCreating(true);
      setErrorMsg('');
      const newPrj = createProjectFromSalesOrder(selectedSOId);
      setIsCreateModalOpen(false);
      setSelectedSOId('');
      router.push(`/projects/${newPrj.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const columns: Column<ProjectJobMaster>[] = [
    {
      header: 'Project No',
      accessorKey: 'projectNumber',
      cell: (p) => (
        <div>
          <Link href={`/projects/${p.id}`} className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline block">
            {p.projectNumber}
          </Link>
          <span className="text-[10px] text-slate-400">Created: {formatDate(p.startDate)}</span>
        </div>
      ),
    },
    {
      header: 'Job No (MTO)',
      accessorKey: 'jobNumber',
      cell: (p) => (
        <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-xs">
          {p.jobNumber}
        </span>
      ),
    },
    {
      header: 'Customer & References',
      cell: (p) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block truncate max-w-xs">{p.customerName}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            SO: {p.salesOrderNumber} | PO: {p.customerPoNumber}
          </span>
        </div>
      ),
    },
    {
      header: 'Machine / Scope',
      cell: (p) => (
        <div className="max-w-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{p.productName}</span>
          <span className="text-[11px] text-slate-500 block truncate">{p.specification}</span>
        </div>
      ),
    },
    {
      header: 'Project Manager',
      accessorKey: 'projectManager',
      cell: (p) => <span className="font-semibold text-slate-700 dark:text-slate-300">{p.projectManager}</span>,
    },
    {
      header: 'Delivery Target',
      cell: (p) => (
        <div>
          <span className="text-slate-600 dark:text-slate-300 font-mono text-[11px] block">{formatDate(p.deliveryDate)}</span>
          {p.expectedDeliveryDate && new Date(p.expectedDeliveryDate) > new Date(p.deliveryDate) && (
            <span className="text-[10px] text-rose-500 font-semibold block">Rev Est: {formatDate(p.expectedDeliveryDate)}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Progress %',
      cell: (p) => (
        <div className="w-24">
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400 font-semibold">{p.currentStage || p.status}</span>
            <span className="font-bold text-blue-500">{p.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${p.progressPercent}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Priority',
      cell: (p) => {
        const colors = {
          urgent: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
          high: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        };
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${colors[p.priority] || colors.medium}`}>
            {p.priority}
          </span>
        );
      },
    },
    {
      header: 'Status',
      cell: (p) => <StatusBadge status={p.status as any} />,
    },
    {
      header: 'Actions',
      cell: (p) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            href={`/projects/${p.id}`}
            title="View Project 360° Detail"
            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => openJobModal(p.jobNumber)}
            title="Launch 360° Traceability Modal"
            className="p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition"
          >
            <Cpu className="w-3.5 h-3.5" />
          </button>
          <Link
            href={`/projects/tasks?projectId=${p.id}`}
            title="Add/View Tasks"
            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/projects/department-assignments?projectId=${p.id}`}
            title="Assign Department"
            className="p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition"
          >
            <Users className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/projects/timeline?projectId=${p.id}`}
            title="Project Timeline"
            className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"
          >
            <Clock className="w-3.5 h-3.5" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 text-xs pb-10">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
              Project Master Directory
            </span>
          </div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Active Make-to-Order Projects & Jobs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Every project listed here originates from a Confirmed Sales Order and maintains complete shop floor traceability.
          </p>
        </div>

        {can('project', 'projects', 'create') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project (From SO)</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0B1120] p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Project #, Job #, Customer, Machine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="design">Design</option>
            <option value="material_planning">Material Planning</option>
            <option value="purchase">Purchase</option>
            <option value="production">Production</option>
            <option value="qc">QC</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <DataTable
        title="Project & Job Repository"
        subtitle={`Total ${filteredProjects.length} Projects found`}
        columns={columns}
        data={filteredProjects}
        onRowClick={(p) => router.push(`/projects/${p.id}`)}
      />

      {/* CREATE PROJECT FROM SALES ORDER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Create New Project & Job
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                A Project can only be created from a <strong>Confirmed Sales Order</strong>. All customer, PO, equipment specs, and delivery dates will be automatically fetched.
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Confirmed Sales Order *
                </label>
                {confirmedSalesOrders.length === 0 ? (
                  <div className="p-4 border border-dashed border-amber-300 dark:border-amber-800 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs">
                    No pending confirmed Sales Orders available. Please confirm a Sales Order in CRM first.
                  </div>
                ) : (
                  <select
                    value={selectedSOId}
                    onChange={(e) => setSelectedSOId(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Sales Order --</option>
                    {confirmedSalesOrders.map((so) => (
                      <option key={so.id} value={so.id}>
                        {so.salesOrderNumber} • {so.customerName} • {so.items[0]?.productName || 'Equipment'} ({formatCurrency(so.orderValue)})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedSOId && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  {(() => {
                    const so = salesOrders.find((s) => s.id === selectedSOId);
                    if (!so) return null;
                    return (
                      <>
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-500">Customer:</span>
                          <span className="text-slate-900 dark:text-white font-bold">{so.customerName}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-500">Customer PO:</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400">{so.customerPoNumber}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-500">Equipment Scope:</span>
                          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{so.items[0]?.productName}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-500">Order Value:</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(so.orderValue)}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-500">Delivery Date:</span>
                          <span className="font-mono text-slate-700 dark:text-slate-300">{formatDate(so.deliveryDate)}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-[11px] font-mono font-bold text-amber-500">
                          <span>Auto Project Number: PRJ-2026-xxx</span>
                          <span>Auto Job Number: JOB-2026-xxx</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!selectedSOId || creating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center gap-2"
              >
                {creating ? 'Generating Project...' : 'Initialize Project & Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
