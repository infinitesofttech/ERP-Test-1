'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Folder, Plus, Search, Layers, GitBranch, CheckCircle2 } from 'lucide-react';

export default function AccountGroupsPage() {
  const { accountGroups, addAccountGroup } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupCode, setGroupCode] = useState('');
  const [groupName, setGroupName] = useState('');
  const [nature, setNature] = useState<'Asset' | 'Liability' | 'Income' | 'Expense' | 'Equity'>('Asset');

  const filtered = accountGroups.filter(
    (g) =>
      g.groupCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupCode || !groupName) return;

    addAccountGroup({
      groupCode,
      groupName,
      nature,
      parentGroupId: null,
      affectsGrossProfit: nature === 'Income' || nature === 'Expense',
    });

    setIsModalOpen(false);
    setGroupCode('');
    setGroupName('');
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 rounded-xl text-cyan-400">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Account Groups Master</h1>
            <p className="text-xs text-slate-400 mt-0.5">Categorize Chart of Accounts into Primary and Sub-Groups for Balance Sheet & P&L</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Account Group</span>
        </button>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search group code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((g) => (
          <div key={g.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">{g.groupCode}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{g.nature}</span>
            </div>
            <h3 className="text-sm font-bold text-white">{g.groupName}</h3>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
              <span>Affects Gross Profit:</span>
              <span className={g.affectsGrossProfit ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {g.affectsGrossProfit ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Create Account Group</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Group Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AGRP-007"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subcontracting Expenses"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nature</label>
                <select
                  value={nature}
                  onChange={(e) => setNature(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                  <option value="Equity">Equity</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
