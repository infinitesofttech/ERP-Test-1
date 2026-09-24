'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { LogOut, Plus, CheckCircle2, Clock, ShieldCheck, FileCheck, X, AlertTriangle } from 'lucide-react';

export default function ResignationExitPage() {
  const { employeeExits, addEmployeeExit, updateEmployeeExitClearance, availableEmployees, departments } = useERP();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: availableEmployees[0]?.id || 'EMP-2026-001',
    resignationDate: new Date().toISOString().split('T')[0],
    lastWorkingDate: '2026-10-15',
    noticePeriodDays: 30,
    reason: 'Personal reasons & career progression opportunity.',
    exitInterviewNotes: 'Overall positive feedback regarding plant operations.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = availableEmployees.find((e) => e.id === formData.employeeId);
    addEmployeeExit({
      employeeId: formData.employeeId,
      employeeName: emp?.name || 'Staff Member',
      department: emp?.department || 'Production',
      designation: emp?.role || 'Senior Operator',
      resignationDate: formData.resignationDate,
      lastWorkingDate: formData.lastWorkingDate,
      noticePeriodDays: Number(formData.noticePeriodDays),
      reason: formData.reason,
      exitInterviewNotes: formData.exitInterviewNotes,
      departmentClearance: false,
      assetReturnClearance: false,
      hrClearance: false,
      accountsClearance: false,
      status: 'Notice Period',
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <LogOut className="w-7 h-7 text-red-400" />
            Resignation & Employee Exit Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Notice Period Tracking, Handover & 4-Department Clearance Workflow (Dept | Asset | HR | Accounts)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Log Resignation Request
        </button>
      </div>

      {/* Exit List */}
      <div className="grid grid-cols-1 gap-6">
        {employeeExits.map((exit) => (
          <div key={exit.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-red-400">{exit.id}</span>
                  <h3 className="text-base font-bold text-white">{exit.employeeName}</h3>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Dept: <span className="text-slate-200 font-semibold">{exit.department}</span> | Designation: {exit.designation}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    exit.status === 'Cleared' || exit.status === 'Settlement Done'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {exit.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-lg border border-slate-700/50 text-xs">
              <div><span className="text-slate-400 block">Resignation Date</span><span className="text-white font-semibold">{exit.resignationDate}</span></div>
              <div><span className="text-slate-400 block">Last Working Date</span><span className="text-amber-400 font-semibold">{exit.lastWorkingDate}</span></div>
              <div><span className="text-slate-400 block">Notice Period</span><span className="text-slate-200">{exit.noticePeriodDays} Days</span></div>
              <div><span className="text-slate-400 block">Resignation Reason</span><span className="text-slate-300 font-medium">&quot;{exit.reason}&quot;</span></div>
            </div>

            {/* 4-Department Clearance Matrix */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inter-Department Clearance Matrix</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">Department Head</div>
                    <div className="text-[11px] text-slate-400">Handover Completed</div>
                  </div>
                  <button
                    onClick={() => updateEmployeeExitClearance(exit.id, 'dept', !exit.departmentClearance)}
                    className={`p-1.5 rounded ${exit.departmentClearance ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">Store / Asset Return</div>
                    <div className="text-[11px] text-slate-400">Tools, Laptop, ID</div>
                  </div>
                  <button
                    onClick={() => updateEmployeeExitClearance(exit.id, 'asset', !exit.assetReturnClearance)}
                    className={`p-1.5 rounded ${exit.assetReturnClearance ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">HR Clearance</div>
                    <div className="text-[11px] text-slate-400">Exit Interview</div>
                  </div>
                  <button
                    onClick={() => updateEmployeeExitClearance(exit.id, 'hr', !exit.hrClearance)}
                    className={`p-1.5 rounded ${exit.hrClearance ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">Accounts Clearance</div>
                    <div className="text-[11px] text-slate-400">Loan & Expense Recoveries</div>
                  </div>
                  <button
                    onClick={() => updateEmployeeExitClearance(exit.id, 'accounts', !exit.accountsClearance)}
                    className={`p-1.5 rounded ${exit.accountsClearance ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <LogOut className="w-5 h-5 text-red-400" /> Submit Resignation / Exit Entry
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Employee</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  {availableEmployees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Resignation Date</label>
                  <input
                    type="date"
                    value={formData.resignationDate}
                    onChange={(e) => setFormData({ ...formData, resignationDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Last Working Date</label>
                  <input
                    type="date"
                    value={formData.lastWorkingDate}
                    onChange={(e) => setFormData({ ...formData, lastWorkingDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Resignation Reason</label>
                <textarea
                  rows={2}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg">
                  Submit Resignation Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
