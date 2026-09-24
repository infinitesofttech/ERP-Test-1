'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Users, Search, DollarSign, FileText, ArrowUpRight, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CustomerLedgersPage() {
  const { customers, salesInvoices, customerReceipts } = useERP();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Customer Financial Ledgers (AR)</h1>
            <p className="text-xs text-slate-400 mt-0.5">Integrated with CRM Master • Live Invoiced Revenue & Collection Status</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total Customer Receivables</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">
            ₹
            {salesInvoices
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
            placeholder="Search customer, code or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const custInvoices = salesInvoices.filter((i) => i.customerId === cust.id || i.customerName === cust.companyName);
          const totalInvoiced = custInvoices.reduce((a, b) => a + (b.grandTotal || 0), 0);
          const custReceipts = customerReceipts.filter((r) => r.customerId === cust.id || r.customerName === cust.companyName);
          const totalPaid = custReceipts.reduce((a, b) => a + (b.amountPaid ?? b.amount ?? 0), 0);
          const outstanding = Math.max(0, totalInvoiced - totalPaid);

          return (
            <div key={cust.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-blue-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">{cust.customerCode}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">{cust.category?.toUpperCase()}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{cust.companyName}</h3>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                  <span>GSTIN: {cust.gstin || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">Total Billed</div>
                  <div className="text-slate-200 font-bold">₹{totalInvoiced.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Outstanding</div>
                  <div className={`font-bold ${outstanding > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    ₹{outstanding.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
                <div className="text-slate-400">Credit Limit: ₹{(cust.creditLimit || 0).toLocaleString()}</div>
                <Link href="/accounting/receipts" className="text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                  <span>Record Payment</span>
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
