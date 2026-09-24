'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { AlertTriangle, Bell, Mail, PhoneCall, CheckCircle2, Search, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function OutstandingRemindersPage() {
  const { salesInvoices, sendNotification } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [sentReminders, setSentReminders] = useState<string[]>([]);

  const overdueInvoices = salesInvoices.filter((inv) => inv.paymentStatus !== 'Paid');

  const filtered = overdueInvoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReminder = (invNumber: string, customerName: string) => {
    sendNotification({
      title: `Payment Overdue Reminder: ${invNumber}`,
      message: `Automated payment collection reminder sent to ${customerName} for overdue invoice ${invNumber}.`,
      type: 'warning',
      department: 'accounting',
      linkUrl: `/accounting/sales-invoices`,
      priority: 'high',
    });

    setSentReminders((prev) => [...prev, invNumber]);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Outstanding Payment Reminders & Collection Portal</h1>
            <p className="text-xs text-slate-400 mt-0.5">Automated Customer Follow-Up • Overdue Invoice Tracking & Multi-Channel Alerts</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total Overdue Amount</div>
          <div className="text-lg font-bold text-amber-400 font-mono">
            ₹{overdueInvoices.reduce((acc, i) => acc + i.grandTotal, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search invoice or customer..."
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
              <th className="py-3.5 px-4">Invoice Number</th>
              <th className="py-3.5 px-4">Customer Name</th>
              <th className="py-3.5 px-4">Invoice Date</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4 text-right">Overdue Amount</th>
              <th className="py-3.5 px-4 text-center">Collection Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map((inv) => {
              const isReminded = sentReminders.includes(inv.invoiceNumber);

              return (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-amber-400">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-sans font-semibold text-slate-200">{inv.customerName}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-400">{inv.invoiceDate}</td>
                  <td className="py-3.5 px-4 text-rose-400 font-sans font-semibold">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-white">₹{inv.grandTotal.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-center font-sans">
                    <button
                      onClick={() => handleSendReminder(inv.invoiceNumber, inv.customerName)}
                      disabled={isReminded}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5 ${
                        isReminded ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{isReminded ? 'Reminder Dispatched' : 'Send Payment Reminder'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
