'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { FileSpreadsheet, Plus, Search, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function JournalEntriesPage() {
  const { journalEntries, addJournalEntry, chartOfAccounts } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [narration, setNarration] = useState('Adjustment JV for Month End Accruals');
  const [lines, setLines] = useState([
    { accountId: chartOfAccounts[0]?.id || 'ACC-001', debitAmount: 25000, creditAmount: 0 },
    { accountId: chartOfAccounts[1]?.id || 'ACC-002', debitAmount: 0, creditAmount: 25000 },
  ]);

  const totalDebit = lines.reduce((acc, l) => acc + l.debitAmount, 0);
  const totalCredit = lines.reduce((acc, l) => acc + l.creditAmount, 0);
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit;

  const filtered = journalEntries.filter(
    (j) =>
      j.journalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.voucherType || j.vouchertype || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLine = () => {
    setLines((prev) => [...prev, { accountId: chartOfAccounts[0]?.id || 'ACC-001', debitAmount: 0, creditAmount: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    const formattedLines = lines.map((l, idx) => {
      const acc = chartOfAccounts.find((a) => a.id === l.accountId) || chartOfAccounts[0];
      return {
        id: `JLINE-${idx + 1}`,
        accountId: acc.id,
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        debitAmount: l.debitAmount,
        creditAmount: l.creditAmount,
      };
    });

    addJournalEntry({
      journalDate: new Date().toISOString().split('T')[0],
      vouchertype: 'Journal',
      narration,
      lines: formattedLines,
      totalDebit,
      totalCredit,
      isBalanced: true,
      status: 'Posted',
      createdBy: 'Rajesh Patel',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">General Journal Voucher (JV) Register</h1>
            <p className="text-xs text-slate-400 mt-0.5">Double Entry General Ledger • Strict Debit == Credit Validation</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Voucher</span>
        </button>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search JV no, narration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((jv) => (
          <div key={jv.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold text-amber-400">{jv.journalNumber}</span>
                <span className="text-xs text-slate-400 font-sans">{jv.journalDate}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">{jv.vouchertype}</span>
              </div>
              <div className="text-xs font-mono font-bold text-emerald-400">
                Balanced (Total: ₹{jv.totalDebit.toLocaleString()})
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans italic">"{jv.narration}"</p>

            <div className="bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold text-[9px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Account Code & Name</th>
                    <th className="py-2.5 px-4 text-right">Debit (Dr) ₹</th>
                    <th className="py-2.5 px-4 text-right">Credit (Cr) ₹</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono">
                  {jv.lines.map((l) => (
                    <tr key={l.id}>
                      <td className="py-2 px-4 text-slate-200 font-sans font-medium">
                        [{l.accountCode}] {l.accountName}
                      </td>
                      <td className="py-2 px-4 text-right text-blue-400">{l.debitAmount > 0 ? `₹${l.debitAmount.toLocaleString()}` : '-'}</td>
                      <td className="py-2 px-4 text-right text-amber-400">{l.creditAmount > 0 ? `₹${l.creditAmount.toLocaleString()}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Create Journal Voucher (JV)</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Narration / Description</label>
                <input
                  type="text"
                  required
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">JV Line Items</span>
                  <button type="button" onClick={handleAddLine} className="text-emerald-400 hover:underline text-[11px]">
                    + Add Account Line
                  </button>
                </div>

                {lines.map((l, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="col-span-2">
                      <label className="block text-slate-500 text-[9px]">Ledger Account</label>
                      <select
                        value={l.accountId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLines((prev) => prev.map((line, i) => (i === idx ? { ...line, accountId: val } : line)));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                      >
                        {chartOfAccounts.map((a) => (
                          <option key={a.id} value={a.id}>
                            [{a.accountCode}] {a.accountName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[9px]">Debit (Dr) ₹</label>
                      <input
                        type="number"
                        value={l.debitAmount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setLines((prev) => prev.map((line, i) => (i === idx ? { ...line, debitAmount: val, creditAmount: val > 0 ? 0 : line.creditAmount } : line)));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[9px]">Credit (Cr) ₹</label>
                      <input
                        type="number"
                        value={l.creditAmount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setLines((prev) => prev.map((line, i) => (i === idx ? { ...line, creditAmount: val, debitAmount: val > 0 ? 0 : line.debitAmount } : line)));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Balance Status */}
              <div className={`p-3 rounded-xl border flex items-center justify-between font-mono ${isBalanced ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  <span className="font-sans font-semibold text-xs">{isBalanced ? 'Journal Voucher Balanced' : 'Unbalanced Journal Voucher'}</span>
                </div>
                <div>
                  Dr: ₹{totalDebit.toLocaleString()} | Cr: ₹{totalCredit.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced}
                  className={`px-4 py-2 rounded-xl font-semibold ${isBalanced ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                >
                  Post Journal Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
