'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Award,
  Building,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { QuotationComparison } from '../../../types/purchase';

export default function QuotationComparisonPage() {
  const { quotationComparisons, approveQuotationComparison, rfqs, currentUser } = useERP();
  const [selectedRfqId, setSelectedRfqId] = useState<string>(rfqs[0]?.id || 'RFQ-001');

  const currentCS = quotationComparisons.find(qc => qc.rfqId === selectedRfqId) || quotationComparisons[0];

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-mono font-bold border border-pink-500/30">
              COMPARATIVE STATEMENT (CS)
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Supplier Quotation Comparison Matrix</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Side-by-side technical & commercial evaluation, L1 pricing identification & buyer rationale log.
          </p>
        </div>

        {/* RFQ Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs">
          <span className="text-slate-400 font-semibold">Select RFQ Statement:</span>
          <select
            value={selectedRfqId}
            onChange={(e) => setSelectedRfqId(e.target.value)}
            className="bg-transparent text-white font-bold cursor-pointer focus:outline-none"
          >
            {rfqs.map(r => (
              <option key={r.id} value={r.id} className="bg-slate-900">
                {r.rfqNumber} ({r.jobId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentCS ? (
        <div className="space-y-6">
          {/* Header Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                  {currentCS.comparisonNumber}
                </span>
                <span className="text-xs text-slate-400">Job: <span className="text-amber-400 font-bold">{currentCS.jobId}</span></span>
              </div>
              <h2 className="text-lg font-bold text-white">Commercial Statement Evaluation Matrix</h2>
              <div className="text-xs text-slate-400 flex items-center gap-4">
                <span>Evaluated By: <strong className="text-white">{currentCS.preparedBy}</strong></span>
                <span>Date: <strong className="text-white">{currentCS.comparisonDate}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                currentCS.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                CS Status: {currentCS.status}
              </span>

              {currentCS.status !== 'Approved' && (
                <button
                  onClick={() => approveQuotationComparison(currentCS.id, `${currentUser.firstName} ${currentUser.lastName}`)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Approve CS Matrix & Authorize PO
                </button>
              )}
            </div>
          </div>

          {/* Comparative Matrix Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-pink-400" />
                Line Item Side-by-Side Rate Matrix
              </h3>
              <span className="text-xs text-emerald-400 font-semibold">
                L1 (Lowest Bid) highlighted in Emerald Green
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3 w-64">Item Description</th>
                    <th className="p-3 text-right">Required Qty</th>
                    {currentCS.suppliersEvaluated.map((sup, idx) => (
                      <th key={idx} className="p-3 text-center border-l border-slate-800">
                        <div className="font-bold text-white">{sup.supplierName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Total: ₹{sup.grandTotal.toLocaleString('en-IN')}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentCS.items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3">
                        <div className="font-bold text-white">{item.itemName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{item.itemCode}</div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-white">
                        {item.requiredQuantity} {item.unitOfMeasure}
                      </td>

                      {currentCS.suppliersEvaluated.map((sup, sIdx) => {
                        const isL1 = sup.supplierId === item.lowestSupplierId;
                        const isRecommended = sup.supplierId === currentCS.recommendedSupplierId;

                        return (
                          <td
                            key={sIdx}
                            className={`p-3 text-center border-l border-slate-800 ${
                              isL1 ? 'bg-emerald-950/30 text-emerald-300 font-bold' : 'text-slate-300'
                            }`}
                          >
                            <div className="font-mono text-xs">
                              ₹{item.supplierRates[sup.supplierId] || 'N/A'} / {item.unitOfMeasure}
                            </div>

                            {isL1 && (
                              <span className="mt-1 px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold block w-fit mx-auto">
                                L1 RATE
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendation & Commercial Rationale Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Buyer Recommendation & Purchase Rationale</h3>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white">
                <span className="text-slate-400">Recommended Vendor:</span>
                <span className="font-bold text-amber-400 text-sm">{currentCS.recommendedSupplierName}</span>
              </div>
              <div className="text-slate-300">
                <span className="text-slate-500 font-semibold">Justification / Reason:</span>
                <p className="mt-1 text-slate-300 italic">{currentCS.buyerReason}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
          No Quotation Comparison matrix found for this RFQ.
        </div>
      )}
    </div>
  );
}
