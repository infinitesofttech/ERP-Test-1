'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { RotateCcw, Plus, Search, Landmark, Coins } from 'lucide-react';

export default function ContraEntriesPage() {
  const { contraEntries, addContraEntry, bankAccounts } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fromAccountId, setFromAccountId] = useState(bankAccounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(bankAccounts[1]?.id || bankAccounts[0]?.id || '');
  const [amount, setAmount] = useState(500000);
  const [contraType, setContraType] = useState<any>('Bank_to_Bank');
  const [referenceNumber, setReferenceNumber] = useState('TRF-994102');
  const [narration, setNarration] = useState('Inter-bank liquidity transfer');

  const filtered = contraEntries.filter(
    (c) =>
      c.contraNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fromAccountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.toAccountName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fromAcc = bankAccounts.find((b) => b.id === fromAccountId) || bankAccounts[0];
    const toAcc = bankAccounts.find((b) => b.id === toAccountId) || bankAccounts[0];

    addContraEntry({
      contraDate: new Date().toISOString().split('T')[0],
      contraType,
      fromAccountId: fromAcc.id,
      fromAccountName: fromAcc.bankName,
      toAccountId: toAcc.id,
      toAccountName: toAcc.bankName,
      amount,
      referenceNumber,
      narration,
      status: 'Posted',
      createdBy: 'Rajesh Patel',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 rounded-xl text-cyan-400">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Contra Vouchers (Bank & Cash Transfers)</h1>
            <p className="text-xs text-slate-400 mt-0.5">Bank-to-Bank Transfers, Cash Deposits & Cash Withdrawals</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Contra Entry</span>
        </button>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search contra no, account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Contra No</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Source Account (Outflow)</th>
              <th className="py-3.5 px-4">Destination Account (Inflow)</th>
              <th className="py-3.5 px-4">Ref / UTR</th>
              <th className="py-3.5 px-4 text-right">Transfer Amount</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-cyan-400">{c.contraNumber}</td>
                <td className="py-3 px-4 text-slate-400 font-sans">{c.contraDate}</td>
                <td className="py-3 px-4 font-sans text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px]">{c.contraType.replace(/_/g, ' ')}</span>
                </td>
                <td className="py-3 px-4 font-sans text-slate-200">{c.fromAccountName}</td>
                <td className="py-3 px-4 font-sans text-slate-200">{c.toAccountName}</td>
                <td className="py-3 px-4 text-slate-400">{c.referenceNumber}</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-400">₹{c.amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-center font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Create Contra Voucher</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Transfer Type</label>
                <select
                  value={contraType}
                  onChange={(e) => setContraType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Bank_to_Bank">Bank to Bank Transfer</option>
                  <option value="Bank_to_Cash">Bank Cash Withdrawal</option>
                  <option value="Cash_to_Bank">Cash Bank Deposit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">From Account (Source)</label>
                  <select
                    value={fromAccountId}
                    onChange={(e) => setFromAccountId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bankName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">To Account (Destination)</label>
                  <select
                    value={toAccountId}
                    onChange={(e) => setToAccountId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bankName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Ref / Cheque No</label>
                  <input
                    type="text"
                    required
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Narration</label>
                <input
                  type="text"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">
                  Post Contra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
