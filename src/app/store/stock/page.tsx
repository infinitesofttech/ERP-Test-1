'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Box, Search, Filter, Lock, CheckCircle, MapPin, Building, AlertTriangle } from 'lucide-react';

export default function StockMatrixPage() {
  const { stockBalances, itemMasters, warehouses } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  const filtered = stockBalances.filter((s) => {
    const matchesSearch =
      s.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.locationCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWh = selectedWarehouse === 'all' || s.warehouseId === selectedWarehouse;
    return matchesSearch && matchesWh;
  });

  const totalValuation = filtered.reduce((acc, s) => acc + s.stockValue, 0);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono font-semibold">
              INVENTORY MATRIX
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Real-Time Usable Stock Matrix</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Exact formula: <code className="font-mono text-sky-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded">Usable Stock = Available Stock - Reserved Stock</code>. Prevents double-booking material for multiple jobs.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, item name, bin location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.warehouseName}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-mono text-right">
          <span className="text-slate-400">Total Filtered Stock Valuation: </span>
          <span className="text-emerald-400 font-extrabold text-sm">₹{totalValuation.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Stock Matrix Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">Item Code & Name</th>
                <th className="p-3.5">Warehouse & Bin Location</th>
                <th className="p-3.5">Heat / Batch Lot</th>
                <th className="p-3.5 text-right">Available Qty</th>
                <th className="p-3.5 text-right text-rose-400">Reserved Qty</th>
                <th className="p-3.5 text-right text-sky-400">Usable Qty</th>
                <th className="p-3.5 text-right">Avg Rate (₹)</th>
                <th className="p-3.5 text-right">Usable Valuation (₹)</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((s) => {
                const usableQty = s.availableQty - s.reservedQty;
                const valuation = usableQty * s.averageRate;
                const isLow = usableQty < 500;

                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-medium">
                      <div className="font-bold text-white text-xs">{s.itemCode}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.itemName}</div>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <div className="font-semibold text-white">{s.warehouseName}</div>
                      <div className="text-[10px] font-mono text-teal-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teal-500" />
                        {s.locationCode}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-purple-400 font-semibold">{s.batchLot || '-'}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-200">
                      {s.availableQty.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-rose-400">
                      {s.reservedQty.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-sky-400 text-sm">
                      {usableQty.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right font-mono text-slate-300">₹{s.averageRate.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                      ₹{valuation.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isLow
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {isLow ? 'Low Usable' : 'Optimal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
