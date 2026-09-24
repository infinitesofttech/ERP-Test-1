'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { PackageCheck, ShieldCheck, Truck, Building, Search, ChevronRight } from 'lucide-react';

export default function FinishedGoodsPage() {
  const { finishedGoods, openJobModal } = useERP();

  return (
    <div className="p-6 space-y-6 bg-[#090D1A] min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Finished Goods Warehouse Master
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30">
                Ready for Dispatch
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Completed Customer Machine Assembly Units Stored in Dispatch Warehouse Bays
            </p>
          </div>
        </div>
      </div>

      {/* Finished Goods Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3">FG Number</th>
                <th className="p-3">Job & WO #</th>
                <th className="p-3">Machine / Product Name</th>
                <th className="p-3">Warehouse & Bin Location</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3">Completion Date</th>
                <th className="p-3">QC Clearance</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {finishedGoods.map((fg) => (
                <tr key={fg.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-sky-400">{fg.finishedGoodsNumber}</td>
                  <td className="p-3">
                    <div className="font-mono font-bold text-emerald-400">{fg.jobNumber}</div>
                    <div className="font-mono text-indigo-300 text-[11px]">{fg.workOrderNumber}</div>
                  </td>
                  <td className="p-3 font-semibold text-white max-w-xs">{fg.productName}</td>
                  <td className="p-3 text-slate-300">
                    <div className="font-bold text-slate-100">{fg.warehouseName}</div>
                    <div className="text-[11px] font-mono text-purple-300">{fg.locationBin}</div>
                  </td>
                  <td className="p-3 text-right font-bold text-white">
                    {fg.quantity} {fg.uom}
                  </td>
                  <td className="p-3 text-slate-400">{fg.completionDate}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                      <ShieldCheck className="w-3 h-3" /> {fg.qcStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => openJobModal(fg.jobNumber)}
                      className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 text-[11px] font-bold transition"
                    >
                      360° Trace
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
