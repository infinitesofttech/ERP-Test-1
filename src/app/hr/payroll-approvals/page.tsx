'use client';

import React from 'react';
import { useERP } from '../../../context/ERPContext';
import { CheckCircle2, Lock, ShieldCheck, AlertTriangle, FileCheck2 } from 'lucide-react';

export default function PayrollApprovalPage() {
  const { payrollRecords, updatePayrollStatus, currentUser } = useERP();

  const handleLockPayroll = (id: string) => {
    updatePayrollStatus(id, 'Locked', currentUser?.name);
  };

  const handlePostToAccounting = (id: string) => {
    updatePayrollStatus(id, 'Posted to Accounting', currentUser?.name);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-7 h-7 text-blue-400" />
            Payroll Approval & Freeze/Lock Governance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            3-Tier Governance: Payroll Executive -&gt; HR Manager -&gt; Super Admin Approval & Freeze Lock
          </p>
        </div>
      </div>

      {/* Audit & Locking Strict Rule Notice */}
      <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center gap-3 text-xs text-rose-200">
        <Lock className="w-5 h-5 text-rose-400 flex-shrink-0" />
        <div>
          <span className="font-bold">Immutability Rule:</span> Once payroll is Approved and Locked by Super Admin, direct editing is strictly prohibited. All adjustments must occur via formal payroll reversal/adjustment vouchers with mandatory audit trail.
        </div>
      </div>

      {/* Approval List */}
      <div className="grid grid-cols-1 gap-6">
        {payrollRecords.map((pay) => (
          <div key={pay.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-emerald-400">{pay.payrollNumber}</span>
                  <h3 className="text-base font-bold text-white">{pay.employeeName}</h3>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Period: <span className="text-slate-200 font-semibold">{pay.monthYear}</span> ({pay.financialYear})
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    pay.status === 'Locked' || pay.status === 'Posted to Accounting'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : pay.status === 'Approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {pay.status}
                </span>

                {pay.status !== 'Locked' && pay.status !== 'Posted to Accounting' && (
                  <button
                    onClick={() => handleLockPayroll(pay.id)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Approve & Lock Payroll
                  </button>
                )}

                {pay.status === 'Locked' && (
                  <button
                    onClick={() => handlePostToAccounting(pay.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition"
                  >
                    Post Voucher to Accounting
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-lg border border-slate-700/50 text-xs">
              <div><span className="text-slate-400 block">Gross Earnings</span><span className="text-white font-bold">₹{pay.grossEarnings.toLocaleString()}</span></div>
              <div><span className="text-slate-400 block">Total Deductions</span><span className="text-rose-400 font-bold">₹{pay.totalDeductions.toLocaleString()}</span></div>
              <div><span className="text-slate-400 block">Net Take-Home Pay</span><span className="text-emerald-400 font-extrabold text-sm">₹{pay.netSalary.toLocaleString()}</span></div>
              <div><span className="text-slate-400 block">Employer PF & ESI</span><span className="text-purple-400 font-bold">₹{(pay.employerPF + pay.employerESI).toLocaleString()}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
