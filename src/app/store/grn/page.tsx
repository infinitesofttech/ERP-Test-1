'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { GoodsReceiptNote, GRNStatus } from '../../../types/store';
import { PackageCheck, Plus, Search, Truck, FileText, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export default function GoodsReceiptPage() {
  const { goodsReceipts, addGRN, purchaseOrders, suppliers, warehouses, projectJobs } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || 'SUP-2026-001');
  const [poId, setPoId] = useState(purchaseOrders[0]?.id || 'PO-2026-0081');
  const [dcNo, setDcNo] = useState('DC/TATA/90415');
  const [invNo, setInvNo] = useState('INV/TATA/2026/895');
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'WH-001');
  const [vehicleNo, setVehicleNo] = useState('GJ-06-AX-9915');
  const [transporter, setTransporter] = useState('VRL Logistics');
  const [remarks, setRemarks] = useState('Plates received with Mill Test Certificate (MTC) Heat No. HEAT-98425.');

  const selectedSupplier = suppliers.find((s) => s.id === supplierId) || suppliers[0];
  const selectedPo = purchaseOrders.find((p) => p.id === poId) || purchaseOrders[0];
  const selectedWh = warehouses.find((w) => w.id === warehouseId) || warehouses[0];

  const filtered = goodsReceipts.filter(
    (g) =>
      g.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.deliveryChallanNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supp = selectedSupplier || { id: 'SUP-2026-001', supplierName: 'Tata Steel Limited' };
    const wh = selectedWh || { id: 'WH-001', warehouseName: 'Raw Material Yard' };

    addGRN({
      grnDate: new Date().toISOString().split('T')[0],
      supplierId: supp.id,
      supplierName: supp.supplierName || supp.name || 'Tata Steel Limited',
      poId: selectedPo?.id || 'PO-2026-0081',
      poNumber: selectedPo?.poNumber || 'PO-2026-0081',
      projectId: (selectedPo && selectedPo.projectId) ? selectedPo.projectId : 'PRJ-2026-0001',
      jobId: selectedPo?.jobNumber || 'JOB-2026-001',
      deliveryChallanNumber: dcNo,
      invoiceNumber: invNo,
      warehouseId: wh.id,
      warehouseName: wh.warehouseName,
      receivedBy: 'Hitesh Rawal (Store Head)',
      vehicleNumber: vehicleNo,
      transporterName: transporter,
      status: 'Inspection Pending',
      totalReceivedValue: 850000,
      remarks,
      items: [
        {
          id: `grn-item-${Date.now().toString().slice(-4)}`,
          grnId: '',
          itemId: 'ITEM-001',
          itemCode: 'RM-SS316-10MM',
          itemName: 'SS 316L Hot Rolled Plate (10mm Thick)',
          poQuantity: 2500,
          receivedQuantity: 2500,
          acceptedQuantity: 0,
          rejectedQuantity: 0,
          shortQuantity: 0,
          uom: 'Kg',
          unitPrice: 340,
          totalAmount: 850000,
          batchLot: 'HEAT-98425',
          locationCode: 'W1-ZA-R1-S1-B01',
          remarks: 'PMI test & thickness measurement pending',
        },
      ],
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-semibold">
              INWARD MATERIAL RECEIPT
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Goods Receipt Note (GRN)</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Physical gate entry & store inward confirmation for raw materials, bought-outs, and supplier deliveries.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 hover:bg-cyan-500 transition"
        >
          <Plus className="w-4 h-4" />
          Create New GRN
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search GRN no, supplier, PO no, DC no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Total GRNs: <span className="text-white font-bold">{filtered.length}</span>
        </div>
      </div>

      {/* GRN Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">GRN No & Date</th>
                <th className="p-3.5">Supplier Name</th>
                <th className="p-3.5">PO & Job No</th>
                <th className="p-3.5">DC & Invoice No</th>
                <th className="p-3.5">Warehouse</th>
                <th className="p-3.5">Vehicle & Transporter</th>
                <th className="p-3.5 text-right">Inward Value (₹)</th>
                <th className="p-3.5 text-center">QC Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-medium">
                    <div className="font-bold text-cyan-400 text-xs font-mono">{g.grnNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{g.grnDate}</div>
                  </td>
                  <td className="p-3.5 font-bold text-white">{g.supplierName}</td>
                  <td className="p-3.5 font-mono text-slate-300">
                    <div className="text-blue-400 font-semibold">{g.poNumber}</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">{g.jobId || 'General Stock'}</div>
                  </td>
                  <td className="p-3.5 text-slate-300">
                    <div>DC: {g.deliveryChallanNumber}</div>
                    <div className="text-[10px] text-slate-400">Inv: {g.invoiceNumber}</div>
                  </td>
                  <td className="p-3.5 text-slate-300 font-medium">{g.warehouseName}</td>
                  <td className="p-3.5 text-slate-300 text-xs">
                    <div>{g.vehicleNumber}</div>
                    <div className="text-[10px] text-slate-400">{g.transporterName}</div>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">
                    ₹{g.totalReceivedValue.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        g.status === 'Accepted'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : g.status === 'Inspection Pending'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-cyan-400" />
                Inward Goods Receipt Note (GRN)
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Supplier *</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.supplierName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Purchase Order (PO)</label>
                  <select
                    value={poId}
                    onChange={(e) => setPoId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {purchaseOrders.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.poNumber} - {p.supplierName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Delivery Challan (DC) No.</label>
                  <input
                    type="text"
                    value={dcNo}
                    onChange={(e) => setDcNo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Supplier Invoice No.</label>
                  <input
                    type="text"
                    value={invNo}
                    onChange={(e) => setInvNo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Receiving Store Yard</label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.warehouseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Vehicle No.</label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Transporter</label>
                  <input
                    type="text"
                    value={transporter}
                    onChange={(e) => setTransporter(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Inward Physical Inspection Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 text-xs font-semibold shadow-lg shadow-cyan-600/30"
                >
                  Confirm GRN Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
