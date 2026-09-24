'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { CreditCard, Plus, Search, FileText } from 'lucide-react';

export default function DebitNotesPage() {
  const { debitNotes, addDebitNote, suppliers, purchaseInvoices } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState(purchaseInvoices[0]?.invoiceNumber || 'PINV-2026-0001');
  const [reason, setReason] = useState('Material Rejection / Return');
  const [taxableAmount, setTaxableAmount] = useState(120000);
  const [taxAmount, setTaxAmount] = useState(21600);

  const filtered = debitNotes.filter(
    (d) =>
      d.debitNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.originalInvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supp = suppliers.find((s) => s.id === supplierId) || suppliers[0];

    addDebitNote({
      debitNoteDate: new Date().toISOString().split('T')[0],
      supplierId: supp.id,
      supplierName: supp.supplierName || (supp as any).name || 'Unknown Supplier',
      originalInvoiceNumber: invoiceNumber,
      reason,
      taxableAmount,
      taxAmount,
      totalAmount: taxableAmount + taxAmount,
      status: 'Approved',
      createdBy: 'Rajesh Patel',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Debit Notes (Supplier Rejections / Returns)</h1>
            <p className="text-xs text-slate-400 mt-0.5">GST Input Adjustment Vouchers for Purchase Returns & QC Defect Debits</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Debit Note</span>
        </button>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search DN no, supplier, invoice..."
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
              <th className="py-3.5 px-4">DN Number</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Supplier</th>
              <th className="py-3.5 px-4">Original Purchase Invoice</th>
              <th className="py-3.5 px-4">Reason</th>
              <th className="py-3.5 px-4 text-right">Taxable Amount</th>
              <th className="py-3.5 px-4 text-right">ITC Reversal</th>
              <th className="py-3.5 px-4 text-right">Total Debit</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map((dn) => (
              <tr key={dn.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-rose-400">{dn.debitNoteNumber}</td>
                <td className="py-3 px-4 text-slate-400 font-sans">{dn.debitNoteDate}</td>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">{dn.supplierName}</td>
                <td className="py-3 px-4 text-slate-300">{dn.originalInvoiceNumber}</td>
                <td className="py-3 px-4 font-sans text-slate-400">{dn.reason}</td>
                <td className="py-3 px-4 text-right text-slate-300">₹{(dn.taxableAmount || 0).toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-cyan-400">₹{(dn.taxAmount || 0).toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-bold text-white">₹{dn.totalAmount.toLocaleString()}</td>
                <td className="py-3 px-4 text-center font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">{dn.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Issue Debit Note</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Supplier</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.supplierName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Original Invoice Number</label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Reason</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Taxable Amount (₹)</label>
                  <input
                    type="number"
                    value={taxableAmount}
                    onChange={(e) => setTaxableAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GST Tax (₹)</label>
                  <input
                    type="number"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">
                  Issue Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
