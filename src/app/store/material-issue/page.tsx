'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { MaterialIssue, IssueStatus } from '../../../types/store';
import { Truck, Plus, Search, Cpu, FileText, CheckCircle, ShieldCheck } from 'lucide-react';

export default function MaterialIssuePage() {
  const { materialIssues, addMaterialIssue, projectJobs, itemMasters, warehouses } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [jobId, setJobId] = useState('JOB-2026-001');
  const [woNo, setWoNo] = useState('WO-2026-001-A');
  const [bomNo, setBomNo] = useState('BOM-2026-001');
  const [stage, setStage] = useState('Shell & Dish End Cutting / Rolling');
  const [itemId, setItemId] = useState(itemMasters[0]?.id || 'ITEM-001');
  const [issueQty, setIssueQty] = useState(3200);
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'WH-001');
  const [requestedBy, setRequestedBy] = useState('Bhavin Shah (Production Head)');
  const [remarks, setRemarks] = useState('Issued 3200 Kg SS 316L 10mm plates for JOB-2026-001 main shell rolling.');

  const selectedItem = itemMasters.find((i) => i.id === itemId) || itemMasters[0];
  const selectedWh = warehouses.find((w) => w.id === warehouseId) || warehouses[0];
  const selectedJob = projectJobs.find((j) => j.jobNumber === jobId) || projectJobs[0];

  const filtered = materialIssues.filter(
    (i) =>
      i.issueNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !selectedWh) return;

    addMaterialIssue({
      issueDate: new Date().toISOString().split('T')[0],
      projectId: selectedJob?.id || 'PRJ-2026-0001',
      jobId,
      workOrderNumber: woNo,
      bomNumber: bomNo,
      bomRevision: 'Rev-01',
      productionStage: stage,
      requestedBy,
      issuedBy: 'Hitesh Rawal (Store Head)',
      warehouseId: selectedWh.id,
      warehouseName: selectedWh.warehouseName,
      status: 'Fully Issued',
      totalIssueValue: issueQty * selectedItem.standardCost,
      remarks,
      items: [
        {
          id: `iss-item-${Date.now().toString().slice(-4)}`,
          issueId: '',
          itemId: selectedItem.id,
          itemCode: selectedItem.itemCode,
          itemName: selectedItem.itemName,
          requiredQuantity: issueQty,
          reservedQuantity: issueQty,
          issuedQuantity: issueQty,
          uom: selectedItem.uom,
          unitPrice: selectedItem.standardCost,
          totalCost: issueQty * selectedItem.standardCost,
          batchLot: 'HEAT-98421',
          locationCode: 'W1-ZA-R1-S1-B01',
          remarks: 'Cut into shell courses as per CAD layout DWG-CRV-10K-001.',
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
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
              SHOP FLOOR DISPATCH
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Material Issue to Production</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Store issue slips reducing usable inventory upon issuing raw materials & bought-out components to shop floor.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition"
        >
          <Plus className="w-4 h-4" />
          Issue Material Slip
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search issue slip no, job no, requester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Material Issues: <span className="text-white font-bold">{filtered.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">Issue Slip No & Date</th>
                <th className="p-3.5">Job No & Work Order</th>
                <th className="p-3.5">BOM & Production Stage</th>
                <th className="p-3.5">Requested By</th>
                <th className="p-3.5 text-right">Issued Value (₹)</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Store Issuer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((i) => (
                <tr key={i.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-medium">
                    <div className="font-bold text-emerald-400 text-xs font-mono">{i.issueNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{i.issueDate}</div>
                  </td>
                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-amber-400 text-xs flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-amber-500" />
                      {i.jobId}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">WO: {i.workOrderNumber}</div>
                  </td>
                  <td className="p-3.5 text-slate-300">
                    <div className="font-semibold text-white">{i.bomNumber} ({i.bomRevision})</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{i.productionStage}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-white">{i.requestedBy}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                    ₹{i.totalIssueValue.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {i.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-300">{i.issuedBy}</td>
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
                <Truck className="w-5 h-5 text-emerald-400" />
                Issue Material Slip to Production
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Job Number *</label>
                  <select
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    {projectJobs.map((j) => (
                      <option key={j.id} value={j.jobNumber}>
                        {j.jobNumber} - {j.productName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Work Order No.</label>
                  <input
                    type="text"
                    value={woNo}
                    onChange={(e) => setWoNo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Production Stage</label>
                  <input
                    type="text"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Requested By</label>
                  <input
                    type="text"
                    value={requestedBy}
                    onChange={(e) => setRequestedBy(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Item to Issue *</label>
                  <select
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {itemMasters.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.itemCode} - {i.itemName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Issue Quantity ({selectedItem?.uom})</label>
                  <input
                    type="number"
                    value={issueQty}
                    onChange={(e) => setIssueQty(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">From Warehouse</label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.warehouseName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Issue Slip Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold shadow-lg shadow-emerald-600/30"
                >
                  Confirm Material Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
