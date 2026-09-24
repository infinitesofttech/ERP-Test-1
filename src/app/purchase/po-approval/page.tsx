'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  FileCheck2,
  UserCheck,
  Building,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { PurchaseOrder, PORevision } from '../../../types/purchase';

export default function POApprovalPage() {
  const { purchaseOrders, poRevisions, approvePurchaseOrder, currentUser } = useERP();
  const [activeTab, setActiveTab] = useState<'pending' | 'revisions'>('pending');

  const pendingPOs = purchaseOrders.filter(po => po.status === 'Submitted' || po.status === 'Pending Approval');
  const approvedPOs = purchaseOrders.filter(po => po.status === 'Approved' || po.status === 'Ordered' || po.status === 'Partially Received' || po.status === 'Completed');

  const handleApprovePO = (poId: string) => {
    approvePurchaseOrder(poId, `${currentUser.firstName} ${currentUser.lastName}`);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-mono font-bold border border-purple-500/30">
              APPROVAL & REVISIONS
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">PO Approval Workflow & Immutable Revision History</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            3-Tier Approval Control Matrix (<code className="text-purple-300 font-mono">Executive → Manager → Super Admin</code>) & Version Log.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'pending' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Approvals ({pendingPOs.length})
          </button>
          <button
            onClick={() => setActiveTab('revisions')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'revisions' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Revision Audit Logs ({poRevisions.length})
          </button>
        </div>
      </div>

      {activeTab === 'pending' ? (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Purchase Orders Awaiting Approval
          </h2>

          {pendingPOs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPOs.map(po => (
                <div key={po.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {po.poNumber} (Rev-{po.revisionNumber})
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{po.supplierName}</h3>
                      <p className="text-xs text-amber-400 font-mono font-semibold">Job Reference: {po.jobId}</p>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                        {po.approvalTier || 'Tier 2 - Manager'}
                      </span>
                      <div className="text-lg font-extrabold text-white mt-2 font-mono">
                        ₹{po.grandTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Created By:</span>
                      <span className="font-semibold text-white">{po.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expected Delivery:</span>
                      <span className="font-mono text-amber-300">{po.expectedDeliveryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Line Items:</span>
                      <span className="font-mono text-white">{po.items.length} items</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleApprovePO(po.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve & Release PO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              No purchase orders currently pending approval. All POs are up to date!
            </div>
          )}
        </div>
      ) : (
        /* Revisions History Log */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              Immutable PO Revision Audit Trail
            </h3>
            <span className="text-xs text-slate-400">Total Revision Logs: {poRevisions.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">PO Number</th>
                  <th className="p-3">Revision</th>
                  <th className="p-3">Revision Date</th>
                  <th className="p-3">Reason for Revision</th>
                  <th className="p-3">Modified By</th>
                  <th className="p-3 text-right">Revised Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {poRevisions.map(rev => (
                  <tr key={rev.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-emerald-400">{rev.poNumber}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30">
                        Rev-{rev.revisionNumber}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-300 text-[11px]">{rev.revisionDate}</td>
                    <td className="p-3 text-slate-300">{rev.reasonForRevision}</td>
                    <td className="p-3 font-semibold text-white">{rev.revisedBy}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                      ₹{rev.revisedGrandTotal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
