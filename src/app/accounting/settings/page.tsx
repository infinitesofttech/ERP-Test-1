'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Settings, Lock, CheckCircle2, ShieldCheck, AlertCircle, Calendar } from 'lucide-react';

export default function AccountingSettingsPage() {
  const { financialYears, closeFinancialYear } = useERP();
  const [lockDate, setLockDate] = useState('2026-03-31');

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-500/20 rounded-xl text-slate-300">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Accounting Settings & Financial Year Close</h1>
            <p className="text-xs text-slate-400 mt-0.5">Financial Year Management, Posting Lock Dates & Statutory System Controls</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Year Close Control */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Indian Financial Years (01-Apr to 31-Mar)
          </h3>

          <div className="space-y-3">
            {financialYears.map((fy) => (
              <div key={fy.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white font-mono">{fy.fyCode}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {fy.startDate} to {fy.endDate}
                  </div>
                </div>

                <div>
                  {fy.status === 'Active' ? (
                    <button
                      onClick={() => closeFinancialYear(fy.id, 'Super Admin')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
                    >
                      Close Year
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded bg-slate-800 text-slate-400 text-xs font-semibold">Closed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lock Date Controls */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-amber-400" />
            Posting Lock Date Controls
          </h3>

          <div className="space-y-3 text-xs">
            <p className="text-slate-400">
              Prevent back-dated voucher creation or edits prior to the specified lock date to comply with GST and Tax Audit rules.
            </p>

            <div>
              <label className="block text-slate-400 mb-1">Accounting Lock Date</label>
              <input
                type="date"
                value={lockDate}
                onChange={(e) => setLockDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>

            <button className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold transition">
              Save Lock Date Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
