'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { ChartOfAccount } from '../../../types/accounting';
import {
  GitBranch,
  Search,
  Plus,
  Filter,
  Folder,
  ChevronRight,
  ChevronDown,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Scale,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react';

export default function ChartOfAccountsPage() {
  const { chartOfAccounts, addChartOfAccount } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [accountCode, setAccountCode] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<ChartOfAccount['accountType']>('Asset');
  const [parentGroupId, setParentGroupId] = useState('AGRP-001');
  const [openingBalance, setOpeningBalance] = useState<number>(0);

  const filteredAccounts = chartOfAccounts.filter((acc) => {
    const matchesSearch =
      acc.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.parentGroupName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || acc.accountType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountCode || !accountName) return;

    addChartOfAccount({
      accountCode,
      accountName,
      accountType,
      parentGroupId,
      parentGroupName: parentGroupId === 'AGRP-001' ? 'Current Assets' : 'Direct Expenses',
      openingBalance,
      normalBalance: accountType === 'Asset' || accountType === 'Expense' ? 'Debit' : 'Credit',
      isActive: true,
    });

    setIsAddModalOpen(false);
    setAccountCode('');
    setAccountName('');
    setOpeningBalance(0);
  };

  const accountTypes: ChartOfAccount['accountType'][] = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/20 rounded-xl text-teal-400">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Hierarchical Chart of Accounts (COA)</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Standard Indian Accounting Structure • Assets, Liabilities, Income, Expenses & Equity Ledgers
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Ledger Account</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search account code, name or group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['All', 'Asset', 'Liability', 'Equity', 'Income', 'Expense'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedType === type
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Account Code</th>
              <th className="py-3.5 px-4">Account Name</th>
              <th className="py-3.5 px-4">Account Type</th>
              <th className="py-3.5 px-4">Parent Group</th>
              <th className="py-3.5 px-4 text-right">Opening Balance</th>
              <th className="py-3.5 px-4 text-right">Current Balance</th>
              <th className="py-3.5 px-4">Normal Balance</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredAccounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-white">{acc.accountCode}</td>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">{acc.accountName}</td>
                <td className="py-3 px-4 font-sans">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      acc.accountType === 'Asset'
                        ? 'bg-blue-500/20 text-blue-400'
                        : acc.accountType === 'Liability'
                        ? 'bg-purple-500/20 text-purple-400'
                        : acc.accountType === 'Income'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : acc.accountType === 'Expense'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {acc.accountType}
                  </span>
                </td>
                <td className="py-3 px-4 font-sans text-slate-400">{acc.parentGroupName}</td>
                <td className="py-3 px-4 text-right text-slate-400">₹{acc.openingBalance.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-400">₹{acc.currentBalance.toLocaleString()}</td>
                <td className="py-3 px-4 font-sans">
                  <span className={`text-[10px] ${acc.normalBalance === 'Debit' ? 'text-blue-400' : 'text-amber-400'}`}>
                    {acc.normalBalance} (Dr/Cr)
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-sans">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create New Ledger Account</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Account Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1005"
                    value={accountCode}
                    onChange={(e) => setAccountCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Account Type</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {accountTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Account Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Machine Spares Inventory"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Opening Balance (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500">
                  Save Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
