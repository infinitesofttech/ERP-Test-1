'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Building, Search, DollarSign, FileText, ArrowUpRight, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function SupplierLedgersPage() {
  const { suppliers, purchaseInvoices, supplierPayments } = useERP();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers.filter(
    (s) =>
      (s.supplierName || (s as any).name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.supplierCode || (s as any).code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Supplier Financial Ledgers (AP)</h1>
            <p className="text-xs text-slate-400 mt-0.5">Integrated with Purchase Master • Live Purchase Invoices & Payment Ledger</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total Supplier Payables</div>
          <div className="text-lg font-bold text-indigo-400 font-mono">
            ₹
            {purchaseInvoices
              .reduce((acc, inv) => acc + (inv.paymentStatus !== 'Paid' ? inv.grandTotal : 0), 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search supplier, code or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supp) => {
          const suppInvoices = purchaseInvoices.filter((i) => i.supplierId === supp.id || i.supplierName === supp.supplierName);
          const totalBilled = suppInvoices.reduce((a, b) => a + (b.grandTotal || 0), 0);
          const suppPays = supplierPayments.filter((p) => p.supplierId === supp.id || p.supplierName === supp.supplierName);
          const totalPaid = suppPays.reduce((a, b) => a + (b.amountPaid ?? b.amount ?? 0), 0);
          const outstanding = Math.max(0, totalBilled - totalPaid);

          return (
            <div key={supp.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-indigo-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400">{supp.supplierCode || (supp as any).code}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">{(supp.category || (supp as any).supplierType || 'Supplier').toUpperCase()}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{supp.supplierName || (supp as any).name}</h3>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                  <span>GSTIN: {supp.gstin || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">Total Invoiced</div>
                  <div className="text-slate-200 font-bold">₹{totalBilled.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Payable Balance</div>
                  <div className={`font-bold ${outstanding > 0 ? 'text-indigo-400' : 'text-emerald-400'}`}>
                    ₹{outstanding.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
                <div className="text-slate-400">Terms: {supp.paymentTerms || '30 Days'}</div>
                <Link href="/accounting/payments" className="text-indigo-400 hover:underline font-semibold flex items-center gap-1">
                  <span>Pay Vendor</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
