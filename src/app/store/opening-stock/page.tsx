'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Sparkles, Plus, Search, Calendar, FileText, CheckCircle, Database } from 'lucide-react';

export default function OpeningStockPage() {
  const { openingStocks, addOpeningStock, itemMasters, warehouses } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [itemId, setItemId] = useState(itemMasters[0]?.id || 'ITEM-001');
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'WH-001');
  const [locationCode, setLocationCode] = useState('W1-ZA-R1-S1-B01');
  const [batchLot, setBatchLot] = useState('HEAT-98421');
  const [quantity, setQuantity] = useState(1000);
  const [rate, setRate] = useState(340);
  const [reference, setReference] = useState('FY26-27 Opening Inventory Audit');
  const [remarks, setRemarks] = useState('Verified physical stock count during annual opening balance audit');

  const selectedItem = itemMasters.find((i) => i.id === itemId) || itemMasters[0];
  const selectedWh = warehouses.find((w) => w.id === warehouseId) || warehouses[0];

  const filtered = openingStocks.filter(
    (op) =>
      op.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !selectedWh) return;

    addOpeningStock({
      entryDate: new Date().toISOString().split('T')[0],
      warehouseId: selectedWh.id,
      warehouseName: selectedWh.warehouseName,
      locationCode,
      itemId: selectedItem.id,
      itemCode: selectedItem.itemCode,
      itemName: selectedItem.itemName,
      batchLot,
      quantity,
      uom: selectedItem.uom,
      rate,
      totalValue: quantity * rate,
      reference,
      remarks,
      createdBy: 'Hitesh Rawal (Store Head)',
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
              OPENING BALANCE AUDIT
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Opening Stock Entry</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Initialize financial year opening stock balances, batch Heat numbers, rates, and baseline stock ledgers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition"
        >
          <Plus className="w-4 h-4" />
          Add Opening Stock Entry
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search opening entries by item, batch, reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Opening Audit Logs: <span className="text-white font-bold">{filtered.length}</span>
        </div>
      </div>

      {/* Opening Stock Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">Entry Date</th>
                <th className="p-3.5">Item Code & Name</th>
                <th className="p-3.5">Warehouse & Location</th>
                <th className="p-3.5">Heat / Batch Lot</th>
                <th className="p-3.5 text-right">Quantity</th>
                <th className="p-3.5 text-right">Unit Rate (₹)</th>
                <th className="p-3.5 text-right">Total Valuation (₹)</th>
                <th className="p-3.5">Reference Audit</th>
                <th className="p-3.5">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((op) => (
                <tr key={op.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-mono text-slate-400">{op.entryDate}</td>
                  <td className="p-3.5 font-medium">
                    <div className="font-bold text-white text-xs">{op.itemCode}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{op.itemName}</div>
                  </td>
                  <td className="p-3.5 text-slate-300">
                    <div className="font-semibold text-white">{op.warehouseName}</div>
                    <div className="text-[10px] font-mono text-teal-400 mt-0.5">{op.locationCode}</div>
                  </td>
                  <td className="p-3.5 font-mono text-purple-400 font-semibold">{op.batchLot || '-'}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                    {op.quantity.toLocaleString('en-IN')} {op.uom}
                  </td>
                  <td className="p-3.5 text-right font-mono text-slate-200">₹{op.rate.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">₹{op.totalValue.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-slate-300">
                    <div>{op.reference}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{op.remarks}</div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-300">{op.createdBy}</td>
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
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Add Opening Stock Entry
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Select Item *</label>
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
                  <label className="block text-slate-400 mb-1">Select Warehouse *</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Location Bin Code</label>
                  <input
                    type="text"
                    value={locationCode}
                    onChange={(e) => setLocationCode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Heat / Batch Lot</label>
                  <input
                    type="text"
                    value={batchLot}
                    onChange={(e) => setBatchLot(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Quantity ({selectedItem?.uom})</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit Purchase Rate (₹)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Audit Reference / Document</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
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
                  Save Opening Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
