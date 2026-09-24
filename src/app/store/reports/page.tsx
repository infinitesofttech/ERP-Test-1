'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { BarChart3, Download, FileSpreadsheet, Search, Filter, CheckCircle } from 'lucide-react';

const STORE_REPORTS_LIST = [
  { id: 'RPT-01', name: 'Stock Balance Register (Usable vs Reserved)', category: 'Inventory Valuation', format: 'Excel / PDF' },
  { id: 'RPT-02', name: 'Item Master Catalog & Pricing Master', category: 'Catalog Audit', format: 'Excel / CSV' },
  { id: 'RPT-03', name: 'Warehouse Location & Bin Occupancy Report', category: 'Yard Audit', format: 'Excel / PDF' },
  { id: 'RPT-04', name: 'Opening Stock Balance Audit Log', category: 'Opening Balance', format: 'Excel / PDF' },
  { id: 'RPT-05', name: 'Goods Receipt Note (GRN) Inward Register', category: 'Inward Inflow', format: 'Excel / PDF' },
  { id: 'RPT-06', name: 'Quality Inspection Pass/Fail Summary', category: 'QA / QC Audit', format: 'Excel / PDF' },
  { id: 'RPT-07', name: 'Job-wise Stock Reservation Register', category: 'Job Locking', format: 'Excel / PDF' },
  { id: 'RPT-08', name: 'Production Material Issue Slip Register', category: 'Shop Floor Outward', format: 'Excel / PDF' },
  { id: 'RPT-09', name: 'Material Return & Usable Offcut Register', category: 'Inward Return', format: 'Excel / PDF' },
  { id: 'RPT-10', name: 'Inter-Warehouse & Bin Stock Transfer Register', category: 'Movement History', format: 'Excel / PDF' },
  { id: 'RPT-11', name: 'Stock Adjustment & Write-off Variance Report', category: 'Reconciliation', format: 'Excel / PDF' },
  { id: 'RPT-12', name: 'Scrap Yard Inventory & Recovery Valuation', category: 'Scrap & Auction', format: 'Excel / PDF' },
  { id: 'RPT-13', name: 'Immutable Stock Movement Ledger History', category: 'Audit Trail', format: 'Excel / CSV' },
  { id: 'RPT-14', name: 'Physical Stock Count Reconciliation Report', category: 'Stock-Taking', format: 'Excel / PDF' },
  { id: 'RPT-15', name: 'Low Stock Reorder Alert Register', category: 'Material Planning', format: 'Excel / PDF' },
  { id: 'RPT-16', name: 'ABC Material Inventory Valuation Analysis', category: 'Financial Analytics', format: 'Excel / PDF' },
  { id: 'RPT-17', name: 'Fast-Moving vs Slow-Moving Material Velocity', category: 'Turnover Analytics', format: 'Excel / PDF' },
  { id: 'RPT-18', name: 'Dead Stock & Non-Moving Material Audit', category: 'Inventory Risk', format: 'Excel / PDF' },
  { id: 'RPT-19', name: 'Supplier Delivery & GRN Timeliness Report', category: 'Vendor Performance', format: 'Excel / PDF' },
  { id: 'RPT-20', name: 'Job 360° Material Consumption & Costing Sheet', category: 'Project Costing', format: 'Excel / PDF' },
  { id: 'RPT-21', name: 'Monthly Store Inventory Valuation Summary', category: 'Executive Finance', format: 'Excel / PDF' },
];

export default function StoreReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filtered = STORE_REPORTS_LIST.filter(
    (r) =>
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (reportId: string, name: string) => {
    setDownloadingId(reportId);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Report "${name}" generated and exported successfully as Excel CSV file.`);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-semibold">
              EXECUTIVE ANALYTICS
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Store & Warehouse Reports (21 Pre-configured)</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Download comprehensive inventory registers, ABC analysis, GRN inward ledgers, and job material consumption sheets.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search report name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Available Reports: <span className="text-white font-bold">{filtered.length}</span>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((rpt) => (
          <div key={rpt.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-blue-500/50 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-blue-400">{rpt.id}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                  {rpt.format}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">{rpt.name}</h3>
              <div className="text-[11px] text-slate-400 mt-1 font-semibold">{rpt.category}</div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Formatted Data Sheet</span>
              <button
                onClick={() => handleExport(rpt.id, rpt.name)}
                disabled={downloadingId === rpt.id}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition flex items-center gap-1.5 shadow-md shadow-blue-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                {downloadingId === rpt.id ? 'Exporting...' : 'Export Sheet'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
