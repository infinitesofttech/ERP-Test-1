'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Coins, Plus, Search, Landmark, CheckCircle2 } from 'lucide-react';

export default function CustomerReceiptsPage() {
  const { customerReceipts, addCustomerReceipt, customers, salesInvoices, bankAccounts } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState(salesInvoices[0]?.invoiceNumber || 'SINV-2026-0001');
  const [paymentMode, setPaymentMode] = useState<any>('NEFT');
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id || '');
  const [amountPaid, setAmountPaid] = useState(1500000);
  const [referenceNo, setReferenceNo] = useState('UTR99882211');

  const filtered = customerReceipts.filter((r) => {
    const rNo = r.receiptNumber || '';
    const custName = r.customerName || '';
    const refNo = r.referenceNumber || '';
    return (
      rNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId) || customers[0];
    const bank = bankAccounts.find((b) => b.id === bankAccountId) || bankAccounts[0];

    addCustomerReceipt({
      receiptDate: new Date().toISOString().split('T')[0],
      customerId: cust.id,
      customerName: cust.companyName || (cust as any).customerName || (cust as any).name || 'Unknown Customer',
      salesInvoiceNumber: invoiceNumber,
      paymentMode,
      bankAccountId: bank.id,
      bankName: bank.bankName,
      amountPaid,
      referenceNumber: referenceNo,
      status: 'Received',
      remarks: 'Advance against machinery supply order',
      createdBy: 'Rajesh Patel',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Customer Payment Receipts</h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time AR Receipt Entry • Auto Banking & Customer Ledger Settlement</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          <span>Record Customer Receipt</span>
        </button>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search receipt no, customer, UTR..."
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
              <th className="py-3.5 px-4">Receipt No</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Invoice / SO Ref</th>
              <th className="py-3.5 px-4">Mode & Bank Account</th>
              <th className="py-3.5 px-4">UTR / Cheque Ref</th>
              <th className="py-3.5 px-4 text-right">Amount Received</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map((r) => {
              const recDate = r.receiptDate || r.date || '-';
              const bank = r.bankName || r.bankCashAccountName || 'HDFC Bank';
              const amt = r.amountPaid ?? r.amount ?? 0;

              return (
                <tr key={r.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-emerald-400">{r.receiptNumber}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{recDate}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-200">{r.customerName}</td>
                  <td className="py-3 px-4 text-slate-300">{r.salesInvoiceNumber || 'Advance'}</td>
                  <td className="py-3 px-4 font-sans text-slate-300">
                    {r.paymentMode} ({bank})
                  </td>
                  <td className="py-3 px-4 text-slate-400">{r.referenceNumber || 'N/A'}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">₹{amt.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">{r.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Record Customer Payment</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Sales Invoice Ref</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="NEFT">NEFT / RTGS</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Bank Account</label>
                  <select
                    value={bankAccountId}
                    onChange={(e) => setBankAccountId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bankName} ({b.accountNumber.slice(-4)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Amount Received (₹)</label>
                  <input
                    type="number"
                    required
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">UTR / Ref No</label>
                  <input
                    type="text"
                    required
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">
                  Record Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
