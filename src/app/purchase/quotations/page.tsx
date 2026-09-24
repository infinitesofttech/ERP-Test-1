'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  FileCheck2,
  Plus,
  Search,
  Eye,
  CheckCircle2,
  DollarSign,
  Building,
  Calendar,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { SupplierQuotation, SupplierQuotationItem } from '../../../types/purchase';

export default function SupplierQuotationsPage() {
  const { supplierQuotations, addSupplierQuotation, rfqs, suppliers, currentUser } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [rfqFilter, setRfqFilter] = useState('ALL');

  // Modals
  const [viewQuote, setViewQuote] = useState<SupplierQuotation | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Form State
  const [newRfqId, setNewRfqId] = useState(rfqs[0]?.id || 'RFQ-001');
  const [newSupplierId, setNewSupplierId] = useState(suppliers[0]?.id || 'SUP-001');
  const [newRefNumber, setNewRefNumber] = useState(`SQ-REF-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newQuoteDate, setNewQuoteDate] = useState('2026-10-02');
  const [newValidUntil, setNewValidUntil] = useState('2026-11-02');
  const [newFreightCharges, setNewFreightCharges] = useState(5000);
  const [newGstPercentage, setNewGstPercentage] = useState(18);

  const [quoteItems, setQuoteItems] = useState<Partial<SupplierQuotationItem>[]>([
    {
      itemCode: 'RM-MS-12MM',
      itemName: 'IS 2062 Grade E250 MS Plate 12mm',
      specification: 'Size 2500x6000mm',
      category: 'Raw Material',
      unitOfMeasure: 'KG',
      quotedQuantity: 2500,
      unitPrice: 65,
      totalPrice: 162500,
      discountPercentage: 0,
      gstPercentage: 18,
      netPrice: 191750,
      leadTimeDays: 7,
      technicalCompliant: true,
    },
  ]);

  const filteredQuotes = supplierQuotations.filter(q => {
    if (rfqFilter !== 'ALL' && q.rfqId !== rfqFilter) return false;
    if (searchQuery) {
      const queryStr = searchQuery.toLowerCase();
      return (
        q.quotationNumber.toLowerCase().includes(queryStr) ||
        q.supplierName.toLowerCase().includes(queryStr) ||
        q.supplierQuotationRef.toLowerCase().includes(queryStr)
      );
    }
    return true;
  });

  const handleRecordQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rfqObj = rfqs.find(r => r.id === newRfqId);
    const suppObj = suppliers.find(s => s.id === newSupplierId);
    if (!rfqObj || !suppObj) return;

    const formattedItems: SupplierQuotationItem[] = quoteItems.map((qi, idx) => ({
      id: `SQI-${Date.now()}-${idx}`,
      quotationId: '',
      itemCode: qi.itemCode || 'ITEM-001',
      itemName: qi.itemName || 'Quoted Item',
      specification: qi.specification || '',
      category: (qi.category as any) || 'Raw Material',
      unitOfMeasure: qi.unitOfMeasure || 'NOS',
      quotedQuantity: Number(qi.quotedQuantity || 1),
      unitPrice: Number(qi.unitPrice || 0),
      totalPrice: Number(qi.quotedQuantity || 1) * Number(qi.unitPrice || 0),
      discountPercentage: 0,
      gstPercentage: newGstPercentage,
      netPrice: (Number(qi.quotedQuantity || 1) * Number(qi.unitPrice || 0)) * (1 + newGstPercentage / 100),
      leadTimeDays: Number(qi.leadTimeDays || 7),
      technicalCompliant: true,
      remarks: 'Comply with spec',
    }));

    const subTotal = formattedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxTotal = (subTotal * newGstPercentage) / 100;
    const grandTotal = subTotal + taxTotal + newFreightCharges;

    const newQuotation: SupplierQuotation = {
      id: `SQ-${Date.now()}`,
      quotationNumber: `SQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      rfqId: rfqObj.id,
      rfqNumber: rfqObj.rfqNumber,
      supplierId: suppObj.id,
      supplierName: suppObj.name,
      supplierQuotationRef: newRefNumber,
      quotationDate: newQuoteDate,
      validityDate: newValidUntil,
      paymentTerms: suppObj.paymentTerms,
      deliveryTerms: 'FOR Destination',
      leadTimeDays: 7,
      currency: 'INR',
      subTotal: subTotal,
      taxTotal: taxTotal,
      freightCharges: newFreightCharges,
      grandTotal: grandTotal,
      technicalStatus: 'Compliant',
      items: formattedItems,
      recordedBy: `${currentUser.firstName} ${currentUser.lastName}`,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addSupplierQuotation(newQuotation);
    setShowRecordModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold border border-amber-500/30">
              SUPPLIER QUOTATIONS
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Supplier Quotations Register</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Recorded vendor price bids, lead times & technical compliance for evaluation.
          </p>
        </div>

        <button
          onClick={() => setShowRecordModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          Record Supplier Quotation
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Quotation No, Supplier, Ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">RFQ:</span>
            <select
              value={rfqFilter}
              onChange={(e) => setRfqFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All RFQs</option>
              {rfqs.map(r => (
                <option key={r.id} value={r.id}>{r.rfqNumber} ({r.jobId})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filteredQuotes.length}</span> received quotations
        </div>
      </div>

      {/* Quotations List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Quotation ID & Ref</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">RFQ Reference</th>
                <th className="p-3">Quote Date</th>
                <th className="p-3">Lead Time</th>
                <th className="p-3 text-right">Grand Total (Inc Tax)</th>
                <th className="p-3">Tech Compliance</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredQuotes.map(q => (
                <tr key={q.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-amber-400">
                    {q.quotationNumber}
                    <div className="text-[10px] text-slate-500">{q.supplierQuotationRef}</div>
                  </td>
                  <td className="p-3 font-semibold text-white">{q.supplierName}</td>
                  <td className="p-3 font-mono text-cyan-400">{q.rfqNumber}</td>
                  <td className="p-3 font-mono text-slate-300 text-[11px]">{q.quotationDate}</td>
                  <td className="p-3 font-mono text-slate-300">{q.leadTimeDays} Days</td>
                  <td className="p-3 text-right font-mono font-extrabold text-emerald-400">
                    ₹{q.grandTotal.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> {q.technicalStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setViewQuote(q)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW QUOTE MODAL */}
      {viewQuote && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  SUPPLIER QUOTATION
                </span>
                <h2 className="text-xl font-black text-white mt-1">{viewQuote.quotationNumber}</h2>
              </div>
              <button onClick={() => setViewQuote(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <div className="text-slate-500">Supplier:</div>
                  <div className="font-bold text-white">{viewQuote.supplierName}</div>
                </div>
                <div>
                  <div className="text-slate-500">Subtotal:</div>
                  <div className="font-mono text-slate-300">₹{viewQuote.subTotal.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-slate-500">Tax (GST):</div>
                  <div className="font-mono text-slate-300">₹{viewQuote.taxTotal.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-slate-500">Grand Total:</div>
                  <div className="font-mono font-extrabold text-emerald-400">₹{viewQuote.grandTotal.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2">Quoted Line Items</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400">
                      <tr>
                        <th className="p-2.5">Item Name</th>
                        <th className="p-2.5 text-right">Quoted Qty</th>
                        <th className="p-2.5 text-right">Unit Rate</th>
                        <th className="p-2.5 text-right">Total Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {viewQuote.items.map(it => (
                        <tr key={it.id}>
                          <td className="p-2.5 font-semibold text-white">{it.itemName}</td>
                          <td className="p-2.5 text-right font-mono">{it.quotedQuantity} {it.unitOfMeasure}</td>
                          <td className="p-2.5 text-right font-mono">₹{it.unitPrice}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-emerald-400">₹{it.totalPrice.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button onClick={() => setViewQuote(null)} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD QUOTATION MODAL */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Record Received Supplier Quotation</h2>
              <button onClick={() => setShowRecordModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordQuoteSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Select RFQ</label>
                  <select
                    value={newRfqId}
                    onChange={(e) => setNewRfqId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white"
                  >
                    {rfqs.map(r => (
                      <option key={r.id} value={r.id}>{r.rfqNumber} ({r.jobId})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Select Bidding Supplier</label>
                  <select
                    value={newSupplierId}
                    onChange={(e) => setNewSupplierId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Vendor Quotation Ref No</label>
                  <input
                    type="text"
                    value={newRefNumber}
                    onChange={(e) => setNewRefNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quotation Date</label>
                  <input
                    type="date"
                    value={newQuoteDate}
                    onChange={(e) => setNewQuoteDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Validity Date</label>
                  <input
                    type="date"
                    value={newValidUntil}
                    onChange={(e) => setNewValidUntil(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowRecordModal(false)} className="px-4 py-2 bg-slate-800 text-white rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl">
                  Save Received Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
