'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { SalesInvoice } from '../../../types/accounting';
import { Receipt, Search, Plus, Filter, CheckCircle2, Clock, Eye, Download, FileSpreadsheet, Building, Users } from 'lucide-react';

export default function SalesInvoicesPage() {
  const { salesInvoices, addSalesInvoice, approveSalesInvoice, customers, salesOrders } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [salesOrderNumber, setSalesOrderNumber] = useState(salesOrders[0]?.salesOrderNumber || (salesOrders[0] as any)?.salesOrderNo || 'SO-2026-0001');
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [placeOfSupply, setPlaceOfSupply] = useState('Gujarat (24)');

  // Form line items
  const [items, setItems] = useState<Array<{ description: string; hsnSac: string; qty: number; unitPrice: number; taxRate: number }>>([
    { description: 'Automated Hydraulic Scrap Baling Press 100-Ton', hsnSac: '8462', qty: 1, unitPrice: 3800000, taxRate: 18 },
  ]);

  const filteredInvoices = salesInvoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.salesOrderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || inv.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddItem = () => {
    setItems((prev) => [...prev, { description: 'Installation & Calibration Services', hsnSac: '9987', qty: 1, unitPrice: 150000, taxRate: 18 }]);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId) || customers[0];

    let subTotal = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    const formattedItems = items.map((item, idx) => {
      const lineTotal = item.qty * item.unitPrice;
      subTotal += lineTotal;
      const taxVal = (lineTotal * item.taxRate) / 100;
      if (placeOfSupply.includes('Gujarat')) {
        cgstAmount += taxVal / 2;
        sgstAmount += taxVal / 2;
      } else {
        igstAmount += taxVal;
      }
      return {
        id: `SITEM-${idx + 1}`,
        description: item.description,
        hsnSac: item.hsnSac,
        quantity: item.qty,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        taxAmount: taxVal,
        totalAmount: lineTotal + taxVal,
      };
    });

    const taxTotal = cgstAmount + sgstAmount + igstAmount;
    const grandTotal = subTotal + taxTotal;

    addSalesInvoice({
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate,
      customerId: cust.id,
      customerName: cust.companyName || (cust as any).customerName || (cust as any).name || 'Unknown Customer',
      customerGstin: cust.gstin || '24AAACX0000X1Z1',
      salesOrderNumber,
      jobNumber: 'JOB-2026-001',
      projectId: 'PROJ-2026-001',
      placeOfSupply,
      items: formattedItems,
      subTotal,
      cgstAmount,
      sgstAmount,
      igstAmount,
      taxTotal,
      grandTotal,
      status: 'Draft',
      paymentStatus: 'Unpaid',
      termsAndConditions: '1. Subject to Vadodara Jurisdiction. 2. Payment due within 30 days.',
      createdBy: 'Rajesh Patel',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Sales Invoices & GST Output Register</h1>
            <p className="text-xs text-slate-400 mt-0.5">Automated GST Invoicing • Linked to Sales Order & Job Traceability</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Sales Invoice</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search invoice no, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Draft', 'Approved', 'Posted'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedStatus === st ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Invoice No</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Sales Order / Job</th>
              <th className="py-3.5 px-4 text-right">Taxable SubTotal</th>
              <th className="py-3.5 px-4 text-right">GST Total</th>
              <th className="py-3.5 px-4 text-right">Grand Total</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-emerald-400">{inv.invoiceNumber}</td>
                <td className="py-3 px-4 text-slate-400 font-sans">{inv.invoiceDate}</td>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">{inv.customerName}</td>
                <td className="py-3 px-4 font-sans text-slate-400">
                  {inv.salesOrderNumber} {inv.jobNumber && `(${inv.jobNumber})`}
                </td>
                <td className="py-3 px-4 text-right text-slate-300">₹{(inv.subTotal ?? inv.subtotal ?? 0).toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-yellow-400">₹{(inv.taxTotal ?? 0).toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-bold text-white">₹{(inv.grandTotal ?? 0).toLocaleString()}</td>
                <td className="py-3 px-4 text-center font-sans">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      inv.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-sans">
                  {inv.status === 'Draft' ? (
                    <button
                      onClick={() => approveSalesInvoice(inv.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold rounded-lg transition"
                    >
                      Approve Invoice
                    </button>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Posted</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Generate GST Sales Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer</label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.gstin})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Place of Supply</label>
                  <select
                    value={placeOfSupply}
                    onChange={(e) => setPlaceOfSupply(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="Gujarat (24)">Gujarat (Intrastate CGST+SGST)</option>
                    <option value="Maharashtra (27)">Maharashtra (Interstate IGST)</option>
                    <option value="Rajasthan (08)">Rajasthan (Interstate IGST)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Sales Order Reference</label>
                  <input
                    type="text"
                    value={salesOrderNumber}
                    onChange={(e) => setSalesOrderNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Invoice Line Items</span>
                  <button type="button" onClick={handleAddItem} className="text-emerald-400 hover:underline text-[11px]">
                    + Add Line Item
                  </button>
                </div>

                {items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="col-span-2">
                      <label className="block text-slate-500 text-[10px]">Description</label>
                      <input
                        type="text"
                        value={it.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, description: val } : item)));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px]">HSN/SAC</label>
                      <input
                        type="text"
                        value={it.hsnSac}
                        onChange={(e) => {
                          const val = e.target.value;
                          setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, hsnSac: val } : item)));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px]">Qty</label>
                      <input
                        type="number"
                        value={it.qty}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, qty: val } : item)));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px]">Unit Rate (₹)</label>
                      <input
                        type="number"
                        value={it.unitPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, unitPrice: val } : item)));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
