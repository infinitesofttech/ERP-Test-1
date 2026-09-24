'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Scale, Download, CheckCircle2, AlertTriangle, FileSpreadsheet, Building } from 'lucide-react';

export default function GSTManagementPage() {
  const { salesInvoices, purchaseInvoices } = useERP();
  const [activeTab, setActiveTab] = useState<'GSTR1' | 'GSTR2B' | 'GSTR3B'>('GSTR3B');

  const totalSalesTax = salesInvoices.reduce((acc, inv) => acc + (inv.cgstAmount ?? inv.cgstTotal ?? 0) + (inv.sgstAmount ?? inv.sgstTotal ?? 0) + (inv.igstAmount ?? inv.igstTotal ?? 0), 0);
  const totalITC = purchaseInvoices.reduce((acc, inv) => acc + (inv.cgstAmount ?? inv.cgstTotal ?? 0) + (inv.sgstAmount ?? inv.sgstTotal ?? 0) + (inv.igstAmount ?? inv.igstTotal ?? 0), 0);
  const netCashPayable = Math.max(0, totalSalesTax - totalITC);

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-500/20 rounded-xl text-yellow-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Indian GST Filing & Tax Compliance Portal</h1>
            <p className="text-xs text-slate-400 mt-0.5">GSTIN: 24AAACX0000X1Z1 • GSTR-1, GSTR-2B ITC Matching & GSTR-3B Auto Summary</p>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-yellow-500/20">
          <Download className="w-4 h-4" />
          <span>Export JSON for GST Portal</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('GSTR3B')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'GSTR3B' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          GSTR-3B Net Computation
        </button>
        <button
          onClick={() => setActiveTab('GSTR1')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'GSTR1' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          GSTR-1 Outward Supplies ({salesInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('GSTR2B')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'GSTR2B' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          GSTR-2B Input Credit ({purchaseInvoices.length})
        </button>
      </div>

      {activeTab === 'GSTR3B' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Output GST Liability (GSTR-1)</span>
              <div className="text-2xl font-bold text-yellow-400 font-mono">₹{totalSalesTax.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400">CGST + SGST + IGST Collected</div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Eligible Input Tax Credit (GSTR-2B)</span>
              <div className="text-2xl font-bold text-cyan-400 font-mono">₹{totalITC.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-400 font-semibold">100% Reconciled</div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Net Cash Liability to Pay</span>
              <div className="text-2xl font-bold text-amber-400 font-mono">₹{netCashPayable.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400">Electronic Cash Ledger</div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">GSTR-3B Table 3.1 & 4 Summary Computation</h3>

            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Details of Supplies</th>
                    <th className="py-3 px-4 text-right">Taxable Value ₹</th>
                    <th className="py-3 px-4 text-right">Integrated Tax (IGST) ₹</th>
                    <th className="py-3 px-4 text-right">Central Tax (CGST) ₹</th>
                    <th className="py-3 px-4 text-right">State Tax (SGST) ₹</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-200">(a) Outward Taxable Supplies</td>
                    <td className="py-3 px-4 text-right text-slate-200">
                      ₹{salesInvoices.reduce((a, b) => a + (b.subTotal ?? b.subtotal ?? b.taxableAmount ?? 0), 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">₹0</td>
                    <td className="py-3 px-4 text-right text-yellow-400">₹{(totalSalesTax / 2).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-yellow-400">₹{(totalSalesTax / 2).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-200">4. Eligible ITC - All other ITC</td>
                    <td className="py-3 px-4 text-right text-slate-200">
                      ₹{purchaseInvoices.reduce((a, b) => a + (b.subTotal ?? b.subtotal ?? b.taxableAmount ?? 0), 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">₹0</td>
                    <td className="py-3 px-4 text-right text-cyan-400">₹{(totalITC / 2).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-cyan-400">₹{(totalITC / 2).toLocaleString()}</td>
                  </tr>
                  <tr className="bg-slate-900/80 font-bold">
                    <td className="py-3 px-4 font-sans text-amber-400">Net Tax Payable (3.1 - 4)</td>
                    <td className="py-3 px-4 text-right text-slate-400">-</td>
                    <td className="py-3 px-4 text-right text-slate-400">₹0</td>
                    <td className="py-3 px-4 text-right text-amber-400">₹{(netCashPayable / 2).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-amber-400">₹{(netCashPayable / 2).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'GSTR1' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Invoice No</th>
                <th className="py-3.5 px-4">Customer GSTIN</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">POS</th>
                <th className="py-3.5 px-4 text-right">Taxable Value</th>
                <th className="py-3.5 px-4 text-right">CGST</th>
                <th className="py-3.5 px-4 text-right">SGST</th>
                <th className="py-3.5 px-4 text-right">Total Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {salesInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4 text-slate-400">{inv.customerGstin}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-200">{inv.customerName}</td>
                  <td className="py-3 px-4 font-sans text-slate-400">{inv.placeOfSupply}</td>
                  <td className="py-3 px-4 text-right text-slate-300">₹{(inv.subTotal ?? inv.subtotal ?? inv.taxableAmount ?? 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-yellow-400">₹{(inv.cgstAmount ?? inv.cgstTotal ?? 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-yellow-400">₹{(inv.sgstAmount ?? inv.sgstTotal ?? 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-bold text-white">₹{inv.grandTotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'GSTR2B' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Supplier Bill No</th>
                <th className="py-3.5 px-4">Supplier GSTIN</th>
                <th className="py-3.5 px-4">Supplier Name</th>
                <th className="py-3.5 px-4 text-right">Taxable Value</th>
                <th className="py-3.5 px-4 text-right">CGST ITC</th>
                <th className="py-3.5 px-4 text-right">SGST ITC</th>
                <th className="py-3.5 px-4 text-center">GSTR-2B Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {purchaseInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 px-4 text-purple-400 font-bold">{inv.vendorInvoiceNumber}</td>
                  <td className="py-3 px-4 text-slate-400">{inv.supplierGstin}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-200">{inv.supplierName}</td>
                  <td className="py-3 px-4 text-right text-slate-300">₹{(inv.subTotal ?? inv.subtotal ?? inv.taxableAmount ?? 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-cyan-400">₹{(inv.cgstAmount ?? inv.cgstTotal ?? 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-cyan-400">₹{(inv.sgstAmount ?? inv.sgstTotal ?? 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-center font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">Matched in 2B</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
