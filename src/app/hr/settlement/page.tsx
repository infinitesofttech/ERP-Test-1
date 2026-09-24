'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Calculator, DollarSign, CheckCircle2, FileText, Plus, Landmark, ShieldCheck, X } from 'lucide-react';

export default function FullAndFinalSettlementPage() {
  const { fullAndFinalSettlements, addFullAndFinalSettlement, updateFinalSettlementStatus, employeeExits } = useERP();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeName: 'Vikram Solanki',
    exitId: 'EXIT-2026-01',
    lastWorkingDate: '2026-10-15',
    pendingSalaryDays: 15,
    pendingSalaryAmount: 32500,
    leaveEncashmentDays: 8,
    leaveEncashmentAmount: 16000,
    bonusIncentive: 5000,
    overtimeAmount: 2400,
    reimbursementsAmount: 1800,
    advanceRecovery: 5000,
    loanRecovery: 0,
    noticePeriodRecovery: 0,
    otherDeductions: 0,
  });

  const netPayable =
    Number(formData.pendingSalaryAmount) +
    Number(formData.leaveEncashmentAmount) +
    Number(formData.bonusIncentive) +
    Number(formData.overtimeAmount) +
    Number(formData.reimbursementsAmount) -
    (Number(formData.advanceRecovery) + Number(formData.loanRecovery) + Number(formData.noticePeriodRecovery) + Number(formData.otherDeductions));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addFullAndFinalSettlement({
      employeeId: 'EMP-TECH-03',
      employeeName: formData.employeeName,
      exitId: formData.exitId,
      lastWorkingDate: formData.lastWorkingDate,
      pendingSalaryDays: Number(formData.pendingSalaryDays),
      pendingSalaryAmount: Number(formData.pendingSalaryAmount),
      leaveEncashmentDays: Number(formData.leaveEncashmentDays),
      leaveEncashmentAmount: Number(formData.leaveEncashmentAmount),
      bonusIncentive: Number(formData.bonusIncentive),
      overtimeAmount: Number(formData.overtimeAmount),
      reimbursementsAmount: Number(formData.reimbursementsAmount),
      advanceRecovery: Number(formData.advanceRecovery),
      loanRecovery: Number(formData.loanRecovery),
      noticePeriodRecovery: Number(formData.noticePeriodRecovery),
      otherDeductions: Number(formData.otherDeductions),
      netFinalPayable: netPayable,
      settlementDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Pending Accounting Clearance',
    });

    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Calculator className="w-7 h-7 text-teal-400" />
            Full & Final (F&F) Settlement Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated Exit Settlement: Unpaid Salary + Encashment + Expenses - Advance/Loan Recoveries -&gt; Accounting Posting
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Create F&F Calculation
        </button>
      </div>

      {/* Accounting Notice */}
      <div className="p-4 bg-teal-950/40 border border-teal-800/60 rounded-xl flex items-center gap-3 text-xs text-teal-200">
        <Landmark className="w-5 h-5 text-teal-400 flex-shrink-0" />
        <div>
          <span className="font-bold">Accounting Source of Truth Integration:</span> HR performs the statutory F&F audit calculation, but final disbursement entries generate a debit voucher in Accounting & Finance. No duplicate financial ledgers are created inside HR.
        </div>
      </div>

      {/* F&F Settlement List */}
      <div className="grid grid-cols-1 gap-6">
        {fullAndFinalSettlements.map((fnf) => (
          <div key={fnf.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-teal-400">{fnf.id}</span>
                  <h3 className="text-lg font-bold text-white">{fnf.employeeName}</h3>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Exit Ref: {fnf.exitId} | Last Working Date: <span className="text-amber-400 font-semibold">{fnf.lastWorkingDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    fnf.paymentStatus === 'Paid'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {fnf.paymentStatus}
                </span>
                {fnf.paymentStatus === 'Pending Accounting Clearance' && (
                  <button
                    onClick={() => updateFinalSettlementStatus(fnf.id, 'Paid', 'JV-2026-FNF-09')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow"
                  >
                    Post to Accounting & Mark Paid
                  </button>
                )}
              </div>
            </div>

            {/* Detailed Component Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Earnings */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-1">
                  <span>Gross Payable Additions</span>
                  <DollarSign className="w-3.5 h-3.5" />
                </h4>
                <div className="flex justify-between text-slate-300">
                  <span>Pending Salary ({fnf.pendingSalaryDays} Days):</span>
                  <span className="font-semibold text-white">₹{fnf.pendingSalaryAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Leave Encashment ({fnf.leaveEncashmentDays} Days):</span>
                  <span className="font-semibold text-white">₹{fnf.leaveEncashmentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Bonus & Incentives:</span>
                  <span className="font-semibold text-white">₹{fnf.bonusIncentive.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Overtime & Reimbursements:</span>
                  <span className="font-semibold text-white">₹{(fnf.overtimeAmount + fnf.reimbursementsAmount).toLocaleString()}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                <h4 className="font-bold text-rose-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-1">
                  <span>Recoveries & Deductions</span>
                  <DollarSign className="w-3.5 h-3.5" />
                </h4>
                <div className="flex justify-between text-slate-300">
                  <span>Advance Outstanding Recovery:</span>
                  <span className="font-semibold text-white">₹{fnf.advanceRecovery.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Loan Recovery:</span>
                  <span className="font-semibold text-white">₹{fnf.loanRecovery.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Notice Period Recovery:</span>
                  <span className="font-semibold text-white">₹{fnf.noticePeriodRecovery.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Other Statutory Deductions:</span>
                  <span className="font-semibold text-white">₹{fnf.otherDeductions.toLocaleString()}</span>
                </div>
              </div>

              {/* Net Summary */}
              <div className="bg-teal-950/30 p-4 rounded-xl border border-teal-800/60 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-teal-400 uppercase tracking-wider border-b border-teal-800/60 pb-1">
                    Net Final Payable Amount
                  </h4>
                  <div className="text-3xl font-black text-white mt-3">₹{fnf.netFinalPayable.toLocaleString()}</div>
                  <span className="text-[11px] text-teal-300 block mt-1">Calculated as per statutory Labour Laws</span>
                </div>
                {fnf.accountingVoucherNo && (
                  <div className="text-[11px] text-slate-400 border-t border-teal-800/60 pt-2">
                    Accounting Voucher Ref: <span className="font-mono text-white">{fnf.accountingVoucherNo}</span>
                  </div>
                )}
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
                <Calculator className="w-5 h-5 text-teal-400" /> New Full & Final Settlement
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Employee Name</label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Pending Salary Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.pendingSalaryAmount}
                    onChange={(e) => setFormData({ ...formData, pendingSalaryAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Leave Encashment (₹)</label>
                  <input
                    type="number"
                    value={formData.leaveEncashmentAmount}
                    onChange={(e) => setFormData({ ...formData, leaveEncashmentAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Advance Recovery (₹)</label>
                  <input
                    type="number"
                    value={formData.advanceRecovery}
                    onChange={(e) => setFormData({ ...formData, advanceRecovery: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Calculated Net Payable (₹)</label>
                  <div className="text-base font-bold text-emerald-400 pt-1">₹{netPayable.toLocaleString()}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg">
                  Save F&F Calculation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
