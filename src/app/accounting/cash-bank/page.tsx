'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Landmark, Plus, Search, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

export default function CashBankPage() {
  const { bankAccounts, addBankAccount } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [accountNumber, setAccountNumber] = useState('99210058821');
  const [accountType, setAccountType] = useState<any>('Current');
  const [ifscCode, setIfscCode] = useState('HDFC0000124');
  const [branchName, setBranchName] = useState('Makarpura GIDC, Vadodara');
  const [openingBalance, setOpeningBalance] = useState(2500000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBankAccount({
      bankName,
      accountNumber,
      accountType,
      ifscCode,
      branchName,
      glAccountCode: '1001',
      openingBalance,
      isActive: true,
    });
    setIsModalOpen(false);
  };

  const totalLiquidity = bankAccounts.reduce((acc, b) => acc + b.currentBalance, 0);

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Cash & Bank Accounts Master</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage Bank Accounts, Petty Cash & Live General Ledger Cash Balances</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Treasury Liquidity</div>
            <div className="text-lg font-bold text-blue-400 font-mono">₹{totalLiquidity.toLocaleString()}</div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bank Account</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bankAccounts.map((b) => (
          <div key={b.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-blue-500/40 transition shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-400">GL Acc: {b.glAccountCode}</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-semibold">{b.accountType}</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{b.bankName}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Acc: {b.accountNumber}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                IFSC: {b.ifscCode} • Branch: {b.branchName}
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Current Ledger Balance</span>
              <span className="text-base font-bold text-emerald-400 font-mono">₹{b.currentBalance.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              <span>Opening Balance: ₹{b.openingBalance.toLocaleString()}</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Register Bank Account</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Account Type</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="Current">Current Account</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Cash_Credit">Cash Credit (CC)</option>
                    <option value="Overdraft">Overdraft (OD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    required
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Opening Balance (₹)</label>
                  <input
                    type="number"
                    required
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Branch Name</label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
