'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { History, Play, CheckCircle2, Calendar } from 'lucide-react';

export default function DepreciationSchedulePage() {
  const { fixedAssets, depreciationEntries, runDepreciation } = useERP();
  const [selectedAssetId, setSelectedAssetId] = useState(fixedAssets[0]?.id || '');
  const [period, setPeriod] = useState('FY 2025-26 Q2');
  const [depAmount, setDepAmount] = useState(162500);

  const handleRunDepreciation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) return;

    runDepreciation(selectedAssetId, period, depAmount);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-500/20 rounded-xl text-slate-300">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Depreciation Calculation Engine & History</h1>
            <p className="text-xs text-slate-400 mt-0.5">Automated Asset Amortization • WDV & SLM Periodical Depreciation Journal Vouchers</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Depreciation Form */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Play className="w-4 h-4 text-emerald-400" />
            Post Periodical Depreciation
          </h3>

          <form onSubmit={handleRunDepreciation} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Select Asset</label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              >
                {fixedAssets.map((a) => (
                  <option key={a.id} value={a.id}>
                    [{a.assetCode}] {a.assetName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Financial Period</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Depreciation Amount (₹)</label>
              <input
                type="number"
                value={depAmount}
                onChange={(e) => setDepAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>

            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition">
              Run Depreciation & Post JV
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="md:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-bold text-white text-sm">Depreciation Audit Logs</div>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Dep Date</th>
                <th className="py-3.5 px-4">Period</th>
                <th className="py-3.5 px-4">Depreciation JV</th>
                <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                <th className="py-3.5 px-4 text-right">Book Value After (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {depreciationEntries.map((d) => (
                <tr key={d.id}>
                  <td className="py-3 px-4 font-sans text-slate-400">{d.depreciationDate}</td>
                  <td className="py-3 px-4 font-sans text-slate-200 font-semibold">{d.period}</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">{d.journalEntryNumber}</td>
                  <td className="py-3 px-4 text-right text-rose-400 font-bold">₹{d.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-bold">₹{d.bookValueAfter.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
