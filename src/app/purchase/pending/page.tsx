'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  Clock,
  AlertTriangle,
  Send,
  Building,
  Calendar,
  PhoneCall,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export default function PendingOverduePurchasesPage() {
  const { purchaseOrders, purchaseRequisitions, materialRequirements } = useERP();

  // Find overdue POs (expected date past today)
  const today = new Date();
  const overduePOs = purchaseOrders.filter(po => {
    const deliveryDate = new Date(po.expectedDeliveryDate);
    return deliveryDate < today && (po.status === 'Approved' || po.status === 'Ordered' || po.status === 'Partially Received');
  });

  const pendingPRs = purchaseRequisitions.filter(pr => pr.status === 'Submitted' || pr.status === 'Pending Approval');
  const criticalMRPShortages = materialRequirements.filter(mr => mr.shortageQuantity > 0);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-mono font-bold border border-rose-500/30">
            PENDING & OVERDUE
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">Pending & Overdue Purchases Tracker</h1>
        </div>
        <p className="text-slate-400 text-xs mt-1">
          Escalation dashboard for overdue deliveries, unapproved PRs & critical stock shortages.
        </p>
      </div>

      {/* KPI Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-red-400">{overduePOs.length}</div>
            <div className="text-xs text-slate-400">Overdue Vendor Deliveries</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-400">{pendingPRs.length}</div>
            <div className="text-xs text-slate-400">Unapproved Purchase Requisitions</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-rose-300">{criticalMRPShortages.length}</div>
            <div className="text-xs text-slate-400">MRP Raw Material Shortages</div>
          </div>
        </div>
      </div>

      {/* Overdue Deliveries Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Overdue Vendor Purchase Orders (Delayed Delivery)
          </h2>
          <span className="text-xs text-red-400 font-bold">Action Required: Immediate Vendor Escalation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">PO Number</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Project & Job</th>
                <th className="p-3">Expected Date</th>
                <th className="p-3 text-center">Overdue Days</th>
                <th className="p-3 text-right">PO Total Value</th>
                <th className="p-3 text-right">Escalation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {overduePOs.length > 0 ? (
                overduePOs.map(po => {
                  const delDate = new Date(po.expectedDeliveryDate);
                  const diffTime = Math.abs(today.getTime() - delDate.getTime());
                  const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={po.id} className="hover:bg-slate-800/40 transition bg-red-950/10">
                      <td className="p-3 font-mono font-bold text-red-400">{po.poNumber}</td>
                      <td className="p-3 font-semibold text-white">{po.supplierName}</td>
                      <td className="p-3">
                        <div className="font-bold text-amber-400">{po.jobId}</div>
                        <div className="text-[10px] text-slate-400">{po.projectId}</div>
                      </td>
                      <td className="p-3 font-mono text-red-300 text-[11px] font-bold">{po.expectedDeliveryDate}</td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 font-mono font-extrabold border border-red-500/30">
                          +{overdueDays} Days
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-white">₹{po.grandTotal.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right">
                        <a
                          href={`/purchase/followup`}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] rounded-lg shadow-md transition inline-flex items-center gap-1"
                        >
                          <PhoneCall className="w-3 h-3" /> Expedite & Escalate
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No overdue vendor deliveries! All orders are arriving on schedule.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
