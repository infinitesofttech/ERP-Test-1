'use client';

import React, { useState, useMemo } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  BarChart3,
  Download,
  Filter,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  Layers,
  Search,
} from 'lucide-react';

export default function DesignerReportsPage() {
  const { designJobs, boms, designRevisions, drawings2D, designs3D } = useERP();

  const [selectedReportId, setSelectedReportId] = useState('report-1');
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-12-31');

  const reportOptions = [
    { id: 'report-1', title: '1. Design Jobs Progress & Status Report', desc: 'Overall status tracking across all active machine projects' },
    { id: 'report-2', title: '2. Master BOM Cost Rollup Summary Report', desc: 'Financial cost allocation for Raw Materials, Bought-Outs & Assemblies' },
    { id: 'report-3', title: '3. CAD Drawing Vault Audit Report', desc: 'Registry of all 2D blueprints & 3D CAD models' },
    { id: 'report-4', title: '4. 2D & 3D Drawing Completion Matrix', desc: 'Drafting progress vs release deadlines' },
    { id: 'report-5', title: '5. ECN / ECO Design Revision History Log', desc: 'Historical change requests, cost & timeline impacts' },
    { id: 'report-6', title: '6. Designer Workload & Utilization Report', desc: 'Workload distribution between Sr. Engineers & Managers' },
    { id: 'report-7', title: '7. Technical Review Checklist Audit Report', desc: 'ASME compliance & safety review pass rate' },
    { id: 'report-8', title: '8. Material Specification Compliance Report', desc: 'SS316L, SS304, MS material grade breakdown' },
    { id: 'report-9', title: '9. Bought-Out & Component Schedule', desc: 'Purchased parts list (Motors, Mechanical Seals, Valves)' },
    { id: 'report-10', title: '10. Shop Floor Release Handover Summary', desc: 'Approved designs released for Manufacturing' },
    { id: 'report-11', title: '11. Design Cycle Time & Lead Days Analytics', desc: 'Engineering duration across requirement analysis to release' },
  ];

  const activeReportInfo = reportOptions.find((r) => r.id === selectedReportId);

  const handleExportCSV = () => {
    alert(`Exporting ${activeReportInfo?.title} to CSV spreadsheet...`);
  };

  return (
    <div className="p-6 space-y-6 bg-[#070A14] text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
              MODULE 3.14
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-cyan-400" />
              Designer & Engineering Reports Hub
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            11 Specialized Analytical & Executive Engineering Reports with Multi-Format Export Options
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition"
        >
          <Download className="w-4 h-4" />
          Export Report Data (CSV / Excel)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report Navigator */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            11 Engineering Reports List
          </h3>

          <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {reportOptions.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedReportId(r.id)}
                className={`w-full text-left p-3 rounded-xl border transition text-xs ${
                  selectedReportId === r.id
                    ? 'bg-cyan-600/20 border-cyan-500/50 text-white font-bold'
                    : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-extrabold text-xs">{r.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Report Viewer */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Report Header & Date Filters */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-white">{activeReportInfo?.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{activeReportInfo?.desc}</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-cyan-500"
                />
                <span className="text-slate-500">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Simulated Data Summary Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <th className="p-3">Design Job ID</th>
                    <th className="p-3">Project / Job</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Designer</th>
                    <th className="p-3">Revision</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {designJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-mono font-bold text-cyan-400">{j.designJobNumber}</td>
                      <td className="p-3 font-mono text-amber-400 font-bold">{j.projectId} [{j.jobNumber}]</td>
                      <td className="p-3 font-bold text-white">{j.productName}</td>
                      <td className="p-3 text-slate-300">{j.assignedDesigner}</td>
                      <td className="p-3 font-mono text-cyan-300 font-bold">{j.activeRevision}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {j.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
