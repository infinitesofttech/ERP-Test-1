'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Wallet, Plus, CheckCircle2, DollarSign, Clock, ShieldCheck, X } from 'lucide-react';

export default function EmployeeAdvancesPage() {
  const { employeeAdvanceLoans, addEmployeeAdvanceLoan, availableEmployees } = useERP();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: availableEmployees[0]?.id || 'EMP-2026-001',
    loanType: 'Emergency Loan' as const,
    sanctionedAmount: 50000,
    disbursementDate: new Date().toISOString().split('T')[0],
    reason: 'Medical emergency in family.',
    totalInstallments: 10,
    recoveryStartMonth: 'October 2026',
  });

  const emiAmount = Math.round(Number(formData.sanctionedAmount) / Number(formData.totalInstallments || 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = availableEmployees.find((e) => e.id === formData.employeeId);

    addEmployeeAdvanceLoan({
      employeeId: formData.employeeId,
      employeeName: emp?.name || 'Staff Member',
      department: emp?.department || 'Production',
      loanType: formData.loanType,
      sanctionedAmount: Number(formData.sanctionedAmount),
      disbursementDate: formData.disbursementDate,
      reason: formData.reason,
      emiAmount,
      totalInstallments: Number(formData.totalInstallments),
      paidInstallments: 0,
      outstandingBalance: Number(formData.sanctionedAmount),
      recoveryStartMonth: formData.recoveryStartMonth,
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-7 h-7 text-amber-400" />
            Employee Advances & Loan EMI Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Short-Term Advances, Emergency Loans, Installment Calculations & Automated Payroll EMI Deductions
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Sanction New Advance / Loan
        </button>
      </div>

      {/* Advance Loans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employeeAdvanceLoans.map((loan) => (
          <div key={loan.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-4 shadow-lg hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400">{loan.loanNumber}</span>
                <h3 className="text-base font-bold text-white">{loan.employeeName}</h3>
                <div className="text-xs text-slate-400">Dept: {loan.department} | Type: {loan.loanType}</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                {loan.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/50">
              <div>
                <span className="text-slate-400 block">Sanctioned Amount</span>
                <span className="text-lg font-bold text-white">₹{loan.sanctionedAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Monthly Payroll EMI</span>
                <span className="text-lg font-bold text-amber-400">₹{loan.emiAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Installment Progress</span>
                <span className="text-slate-200 font-semibold">{loan.paidInstallments} / {loan.totalInstallments} Paid</span>
              </div>
              <div>
                <span className="text-slate-400 block">Outstanding Balance</span>
                <span className="text-rose-400 font-bold">₹{loan.outstandingBalance.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 italic">
              Reason: &quot;{loan.reason}&quot; | Recovery Start: <strong className="text-slate-200">{loan.recoveryStartMonth}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" /> Sanction Employee Advance / Loan
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

              <div>
                <label className="block text-slate-400 mb-1">Advance Type</label>
                <select
                  value={formData.loanType}
                  onChange={(e) => setFormData({ ...formData, loanType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Short Term Advance">Short Term Salary Advance</option>
                  <option value="Emergency Loan">Emergency Loan</option>
                  <option value="Festival Advance">Festival Advance</option>
                  <option value="Vehicle Loan">Vehicle Loan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Sanctioned Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.sanctionedAmount}
                    onChange={(e) => setFormData({ ...formData, sanctionedAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">No. of Installments</label>
                  <input
                    type="number"
                    value={formData.totalInstallments}
                    onChange={(e) => setFormData({ ...formData, totalInstallments: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 text-xs">
                <div className="flex justify-between"><span>Calculated Monthly EMI:</span> <strong className="text-amber-400">₹{emiAmount.toLocaleString()}</strong></div>
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
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg">
                  Sanction & Activate EMI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
