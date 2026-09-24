'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Calculator, Plus, Search, FileText, Download, CheckCircle2 } from 'lucide-react';

export default function TDSCompliancePage() {
  const { tdsMasters, purchaseInvoices } = useERP();
  const [searchTerm, setSearchTerm] = useState('');

  const totalTDSDeducted = purchaseInvoices.reduce((acc, inv) => acc + (inv.tdsAmount ?? inv.tdsDeducted ?? 0), 0);

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-500/20 rounded-xl text-violet-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">TDS Compliance & Form 26Q Register</h1>
            <p className="text-xs text-slate-400 mt-0.5">Tax Deducted at Source • Section 194C (Subcontracting), 194J (Professional), 194Q (Goods)</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total TDS Payable to Govt</div>
          <div className="text-lg font-bold text-violet-400 font-mono">₹{totalTDSDeducted.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tdsMasters.map((t) => (
          <div key={t.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-violet-400">Section {t.sectionCode}</span>
              <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px] font-bold font-mono">{t.rate}% Rate</span>
            </div>
            <h3 className="text-sm font-bold text-white">{t.description}</h3>
            <div className="text-xs text-slate-400">Exemption Limit: ₹{t.thresholdLimit.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-white text-sm">TDS Deductions in Vendor Bills</div>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">ERP Invoice No</th>
              <th className="py-3.5 px-4">Vendor Bill No</th>
              <th className="py-3.5 px-4">Supplier Name</th>
              <th className="py-3.5 px-4">TDS Section</th>
              <th className="py-3.5 px-4 text-right">Bill Taxable Base</th>
              <th className="py-3.5 px-4 text-right">TDS Rate</th>
              <th className="py-3.5 px-4 text-right">TDS Deducted ₹</th>
              <th className="py-3.5 px-4 text-center">Form 26Q Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {purchaseInvoices.map((inv) => (
              <tr key={inv.id}>
                <td className="py-3 px-4 font-bold text-purple-400">{inv.invoiceNumber}</td>
                <td className="py-3 px-4 text-slate-200">{inv.vendorInvoiceNumber}</td>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">{inv.supplierName}</td>
                <td className="py-3 px-4 text-violet-400 font-sans">Sec {inv.tdsSection || '194C'}</td>
                <td className="py-3 px-4 text-right text-slate-300">₹{(inv.subTotal ?? inv.subtotal ?? inv.taxableAmount ?? 0).toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-slate-400">{inv.tdsRate ?? 2}%</td>
                <td className="py-3 px-4 text-right font-bold text-violet-400">₹{(inv.tdsAmount ?? inv.tdsDeducted ?? 0).toLocaleString()}</td>
                <td className="py-3 px-4 text-center font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">Included in 26Q</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
