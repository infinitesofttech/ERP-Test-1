'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  Bug,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Tag,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { BugTicket } from '../../../types/testing';

export default function BugTrackerPage() {
  const { bugTickets, addBugTicket, updateBugTicketStatus } = useERP();

  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Bug Form State
  const [moduleName, setModuleName] = useState<string>('Accounting');
  const [pageName, setPageName] = useState<string>('General Ledger');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [stepsToReproduce, setStepsToReproduce] = useState<string>('');
  const [expectedResult, setExpectedResult] = useState<string>('');
  const [actualResult, setActualResult] = useState<string>('');
  const [severity, setSeverity] = useState<BugTicket['severity']>('Medium');
  const [priority, setPriority] = useState<BugTicket['priority']>('Normal');
  const [assignedDeveloper, setAssignedDeveloper] = useState<string>('Antigravity AI Agent');

  const filteredBugs = bugTickets.filter((b) => {
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bugNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !stepsToReproduce) {
      alert('Please fill in required fields (Title, Steps to reproduce)');
      return;
    }

    addBugTicket({
      module: moduleName,
      page: pageName,
      title,
      description,
      stepsToReproduce,
      expectedResult,
      actualResult,
      severity,
      priority,
      assignedDeveloper,
      status: 'Open',
    });

    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
    setStepsToReproduce('');
    setExpectedResult('');
    setActualResult('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                Internal ERP Defect & Bug Tracker
              </h1>
              <p className="text-xs text-slate-400">
                Log, prioritize, assign, and track technical issues & regression bugs across all 11 ERP modules
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-red-600/20"
        >
          <Plus className="w-4 h-4" />
          Report New Defect / Bug
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-300 font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Bug Statuses</option>
              <option value="Open" className="bg-slate-900">Open</option>
              <option value="In_Progress" className="bg-slate-900">In Progress</option>
              <option value="Fixed" className="bg-slate-900">Fixed</option>
              <option value="Retest" className="bg-slate-900">Retest</option>
              <option value="Closed" className="bg-slate-900">Closed</option>
            </select>
          </div>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bug ticket or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 text-xs text-white pl-9 pr-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Bug List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            Defect Registry ({filteredBugs.length} Tickets)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Bug Ticket</th>
                <th className="py-3 px-4">Module & Page</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredBugs.map((bug) => (
                <tr key={bug.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-red-400">
                    <div>{bug.bugNo}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{bug.createdDate}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                      {bug.module}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{bug.page}</div>
                  </td>
                  <td className="py-3 px-4 space-y-0.5 max-w-sm">
                    <div className="font-semibold text-white">{bug.title}</div>
                    <div className="text-[11px] text-slate-400 leading-tight line-clamp-2">{bug.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold',
                        bug.severity === 'Critical' && 'bg-red-500/20 text-red-400 border border-red-500/40',
                        bug.severity === 'High' && 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
                        bug.severity === 'Medium' && 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
                        bug.severity === 'Low' && 'bg-slate-800 text-slate-400'
                      )}
                    >
                      {bug.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{bug.priority}</td>
                  <td className="py-3 px-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>{bug.assignedDeveloper}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                        bug.status === 'Closed' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
                        bug.status === 'Fixed' && 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
                        bug.status === 'In_Progress' && 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
                        bug.status === 'Open' && 'bg-red-500/10 text-red-400 border border-red-500/30'
                      )}
                    >
                      {bug.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <select
                      value={bug.status}
                      onChange={(e) => updateBugTicketStatus(bug.id, e.target.value as any)}
                      className="bg-slate-950 text-[11px] text-slate-300 px-2 py-1 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="Open">Open</option>
                      <option value="In_Progress">In Progress</option>
                      <option value="Fixed">Fixed</option>
                      <option value="Retest">Retest</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bug Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateBug} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Bug className="w-4 h-4 text-red-400" />
                Report New Technical Defect
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold">ERP Module *</label>
                <select
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 mt-1"
                >
                  <option value="Foundation">ERP Foundation</option>
                  <option value="CRM">CRM & Sales</option>
                  <option value="Project">Project & Job</option>
                  <option value="Design">Design & Engineering</option>
                  <option value="Purchase">Purchase & RFQ</option>
                  <option value="Store">Store & Warehouse</option>
                  <option value="Production">Production & Work Orders</option>
                  <option value="Accounting">Accounting & Finance</option>
                  <option value="HR">HR & Payroll</option>
                  <option value="Maintenance">Maintenance & Service</option>
                  <option value="Integration">Integration Layer</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Affected Page Name *</label>
                <input
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  placeholder="e.g. Expenses / Job 360"
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 mt-1"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 font-semibold">Bug Summary Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of the issue..."
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 mt-1"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 font-semibold">Steps to Reproduce *</label>
                <textarea
                  rows={2}
                  value={stepsToReproduce}
                  onChange={(e) => setStepsToReproduce(e.target.value)}
                  placeholder="1. Go to page... 2. Click button..."
                  className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800 mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 mt-1"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 mt-1"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20"
              >
                Submit Defect Ticket
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
