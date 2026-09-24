'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Workflow, Plus, ArrowRight, CheckCircle2, Building, Calendar, X } from 'lucide-react';

export default function EmployeeTransfersPage() {
  const { employeeTransfers, addEmployeeTransfer, availableEmployees, departments } = useERP();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: availableEmployees[0]?.id || 'EMP-2026-001',
    effectiveDate: new Date().toISOString().split('T')[0],
    fromDepartment: 'Production',
    toDepartment: 'Maintenance & Services',
    fromDesignation: 'Technician',
    toDesignation: 'Senior Service Technician',
    fromLocation: 'Plant 1',
    toLocation: 'Customer Service Hub',
    reason: 'Strategic reassignment for customer site support.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = availableEmployees.find((e) => e.id === formData.employeeId);
    addEmployeeTransfer({
      employeeId: formData.employeeId,
      employeeName: emp?.name || 'Staff Member',
      effectiveDate: formData.effectiveDate,
      fromDepartment: formData.fromDepartment,
      toDepartment: formData.toDepartment,
      fromDesignation: formData.fromDesignation,
      toDesignation: formData.toDesignation,
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      reason: formData.reason,
      approvedBy: 'Sanjay Shah (HR Manager)',
      status: 'Approved',
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Workflow className="w-7 h-7 text-amber-400" />
            Employee Transfers & Internal Mobility
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Department, Plant Location & Role Reassignments with Historical Audit Log
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Issue Transfer Order
        </button>
      </div>

      {/* Transfers List */}
      <div className="grid grid-cols-1 gap-4">
        {employeeTransfers.map((trn) => (
          <div key={trn.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-3 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">{trn.id}</span>
                <h3 className="text-base font-bold text-white">{trn.employeeName}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 w-fit">
                {trn.status} (Effective: {trn.effectiveDate})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-lg border border-slate-700/50 text-xs">
              <div className="space-y-1 border-r border-slate-800 pr-4">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Previous Position</span>
                <div>Dept: <strong className="text-white">{trn.fromDepartment}</strong></div>
                <div>Designation: <span className="text-slate-300">{trn.fromDesignation}</span></div>
                <div>Location: <span className="text-slate-300">{trn.fromLocation}</span></div>
              </div>
              <div className="space-y-1">
                <span className="text-amber-400 font-bold uppercase tracking-wider block">Transferred Position</span>
                <div>Dept: <strong className="text-amber-400">{trn.toDepartment}</strong></div>
                <div>Designation: <span className="text-slate-200">{trn.toDesignation}</span></div>
                <div>Location: <span className="text-slate-200">{trn.toLocation}</span></div>
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-700/40 pt-2">
              <span>Reason: &quot;{trn.reason}&quot;</span>
              <span>Approved By: <strong className="text-slate-300">{trn.approvedBy}</strong></span>
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
                <Workflow className="w-5 h-5 text-amber-400" /> Issue Employee Transfer Order
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
                  <label className="block text-slate-400 mb-1">New Department</label>
                  <select
                    value={formData.toDepartment}
                    onChange={(e) => setFormData({ ...formData, toDepartment: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.departmentName}>
                        {d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Transfer Reason</label>
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
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg">
                  Submit Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
