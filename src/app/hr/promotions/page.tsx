'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { TrendingUp, Plus, Award, ArrowUpRight, DollarSign, Calendar, X } from 'lucide-react';

export default function PromotionsPage() {
  const { employeePromotions, addEmployeePromotion, availableEmployees } = useERP();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: availableEmployees[0]?.id || 'EMP-2026-001',
    effectiveDate: new Date().toISOString().split('T')[0],
    oldDesignation: 'Junior Engineer',
    newDesignation: 'Senior Machine Engineer',
    oldGrade: 'Level 5',
    newGrade: 'Level 4',
    oldCTC: 450000,
    newCTC: 580000,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = availableEmployees.find((e) => e.id === formData.employeeId);
    const pct = Math.round(((formData.newCTC - formData.oldCTC) / formData.oldCTC) * 100);

    addEmployeePromotion({
      employeeId: formData.employeeId,
      employeeName: emp?.name || 'Staff Member',
      effectiveDate: formData.effectiveDate,
      oldDesignation: formData.oldDesignation,
      newDesignation: formData.newDesignation,
      oldGrade: formData.oldGrade,
      newGrade: formData.newGrade,
      oldCTC: Number(formData.oldCTC),
      newCTC: Number(formData.newCTC),
      incrementPercentage: pct,
      approvedBy: 'General Manager & HR Head',
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
            <TrendingUp className="w-7 h-7 text-rose-400" />
            Promotion & Salary Increment Records
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Designation Upgrades, Cadre Level Reclassifications & CTC Increment Audit History
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Record Promotion Order
        </button>
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employeePromotions.map((prm) => (
          <div key={prm.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-4 shadow-lg hover:border-rose-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-rose-400">{prm.id}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                {prm.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{prm.employeeName}</h3>
              <div className="text-xs text-slate-400">Effective Date: <strong className="text-slate-200">{prm.effectiveDate}</strong></div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Designation Change:</span>
                <span className="text-slate-300">{prm.oldDesignation} -&gt; <strong className="text-rose-400">{prm.newDesignation}</strong></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Grade Level:</span>
                <span className="text-slate-300">{prm.oldGrade} -&gt; <strong className="text-amber-400">{prm.newGrade}</strong></span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">CTC Revision:</span>
                <span className="font-bold text-emerald-400">₹{prm.oldCTC.toLocaleString()} -&gt; ₹{prm.newCTC.toLocaleString()}</span>
              </div>
              <div className="text-right text-xs font-black text-rose-400">
                +{prm.incrementPercentage}% Overall Increment
              </div>
            </div>

            <div className="text-xs text-slate-400 text-right">
              Approved By: <strong className="text-slate-200">{prm.approvedBy}</strong>
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
                <TrendingUp className="w-5 h-5 text-rose-400" /> Record Promotion / Increment Order
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
                  <label className="block text-slate-400 mb-1">Old Designation</label>
                  <input
                    type="text"
                    value={formData.oldDesignation}
                    onChange={(e) => setFormData({ ...formData, oldDesignation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">New Designation</label>
                  <input
                    type="text"
                    value={formData.newDesignation}
                    onChange={(e) => setFormData({ ...formData, newDesignation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Old Annual CTC (₹)</label>
                  <input
                    type="number"
                    value={formData.oldCTC}
                    onChange={(e) => setFormData({ ...formData, oldCTC: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">New Annual CTC (₹)</label>
                  <input
                    type="number"
                    value={formData.newCTC}
                    onChange={(e) => setFormData({ ...formData, newCTC: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg">
                  Save Promotion Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
