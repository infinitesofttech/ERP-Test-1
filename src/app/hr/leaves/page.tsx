'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { FileCheck2, Plus, Calendar, CheckCircle2, Clock, Filter, X } from 'lucide-react';

export default function LeaveManagementPage() {
  const { leaveTypes, leaveRequests, leaveBalances, addLeaveRequest, availableEmployees } = useERP();
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: availableEmployees[0]?.id || 'EMP-2026-001',
    leaveTypeId: leaveTypes[0]?.id || 'LT-01',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    numberOfDays: 1,
    isHalfDay: false,
    reason: 'Family function in hometown.',
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = availableEmployees.find((e) => e.id === formData.employeeId);
    const lt = leaveTypes.find((l) => l.id === formData.leaveTypeId);

    addLeaveRequest({
      employeeId: formData.employeeId,
      employeeName: emp?.name || 'Staff Member',
      department: emp?.department || 'Production',
      leaveTypeId: formData.leaveTypeId,
      leaveName: lt?.leaveName || 'Casual Leave',
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      numberOfDays: Number(formData.numberOfDays),
      isHalfDay: formData.isHalfDay,
      reason: formData.reason,
      reportingManager: 'Rajesh Patel (Department Head)',
    });
    setShowApplyModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-emerald-400" />
            Leave Type Master & Application Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configurable Leave Rules (Casual, Sick, Earned, Comp-Off), Monthly Accrual & Leave Balance Tracking
          </p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {/* Leave Type Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveTypes.map((lt) => (
          <div key={lt.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-emerald-400">{lt.leaveCode}</span>
              <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px]">Quota: {lt.annualQuota} Days/Yr</span>
            </div>
            <h3 className="text-sm font-bold text-white">{lt.leaveName}</h3>
            <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-700/50">
              <div>Accrual: <strong className="text-slate-200">{lt.monthlyAccrual} / month</strong></div>
              <div>Carry Forward: {lt.carryForwardAllowed ? <span className="text-emerald-400 font-semibold">Allowed</span> : 'No'}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Requests Log */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-bold text-sm text-white flex items-center justify-between">
          <span>Employee Leave Applications</span>
          <span className="text-xs text-slate-400">Total Requests: {leaveRequests.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Leave No.</th>
                <th className="p-4">Employee</th>
                <th className="p-4">Leave Type</th>
                <th className="p-4">Dates & Duration</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-700/40 transition">
                  <td className="p-4 font-mono text-xs text-emerald-400 font-bold">{req.leaveNumber}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{req.employeeName}</div>
                    <div className="text-xs text-slate-400">{req.department}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-200">{req.leaveName}</td>
                  <td className="p-4 text-xs">
                    <div className="text-slate-300 font-mono">{req.fromDate} to {req.toDate}</div>
                    <div className="text-emerald-400 font-bold">{req.numberOfDays} Day(s) {req.isHalfDay && '(Half Day)'}</div>
                  </td>
                  <td className="p-4 text-xs text-slate-400 max-w-xs truncate">&quot;{req.reason}&quot;</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        req.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : req.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" /> Apply for Leave
              </h2>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
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

              <div>
                <label className="block text-slate-400 mb-1">Leave Type</label>
                <select
                  value={formData.leaveTypeId}
                  onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  {leaveTypes.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.leaveName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">From Date</label>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">To Date</label>
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reason</label>
                <textarea
                  rows={2}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowApplyModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg">
                  Submit Leave Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
