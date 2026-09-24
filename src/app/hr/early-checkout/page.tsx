'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { History, Plus, CheckCircle2, Clock, X } from 'lucide-react';

export default function EarlyCheckoutPage() {
  const { earlyCheckoutRequests, addEarlyCheckoutRequest, updateEarlyCheckoutStatus, availableEmployees } = useERP();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: availableEmployees[0]?.id || 'EMP-2026-001',
    date: new Date().toISOString().split('T')[0],
    shiftName: 'General Day Shift (09:00 - 18:00)',
    expectedCheckout: '18:00',
    requestedCheckout: '16:30',
    reason: 'Medical appointment with family physician.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = availableEmployees.find((e) => e.id === formData.employeeId);
    addEarlyCheckoutRequest({
      employeeId: formData.employeeId,
      employeeName: emp?.name || 'Staff Member',
      date: formData.date,
      shiftName: formData.shiftName,
      expectedCheckout: formData.expectedCheckout,
      requestedCheckout: formData.requestedCheckout,
      reason: formData.reason,
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-slate-400" />
            Early Checkout Permission Requests
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Pre-Approval Gate Passes for Early Shift Checkout & Half-Day Deduction Penalties
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Request Early Checkout
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Req No.</th>
                <th className="p-4">Employee</th>
                <th className="p-4">Date & Shift</th>
                <th className="p-4">Expected vs Requested Checkout</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {earlyCheckoutRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-700/40 transition">
                  <td className="p-4 font-mono text-xs text-slate-400 font-bold">{req.requestNumber}</td>
                  <td className="p-4 font-bold text-white">{req.employeeName}</td>
                  <td className="p-4 text-xs text-slate-300">
                    <div>{req.date}</div>
                    <div className="text-slate-400">{req.shiftName}</div>
                  </td>
                  <td className="p-4 text-xs font-mono">
                    <div className="text-slate-400">Shift End: {req.expectedCheckout}</div>
                    <div className="text-amber-400 font-bold">Early Exit: {req.requestedCheckout}</div>
                  </td>
                  <td className="p-4 text-xs text-slate-300 max-w-xs truncate">&quot;{req.reason}&quot;</td>
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
                  <td className="p-4 text-right">
                    {req.status === 'Pending' && (
                      <button
                        onClick={() => updateEarlyCheckoutStatus(req.id, 'Approved')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded shadow transition"
                      >
                        Approve Gate Pass
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" /> Early Checkout Request
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
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Requested Checkout</label>
                  <input
                    type="text"
                    placeholder="16:30"
                    value={formData.requestedCheckout}
                    onChange={(e) => setFormData({ ...formData, requestedCheckout: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
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
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg">
                  Submit Gate Pass Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
