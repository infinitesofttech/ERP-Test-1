'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Briefcase, Search, DollarSign, TrendingUp, Layers } from 'lucide-react';

export default function ProjectCostingPage() {
  const { projectJobs } = useERP();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = projectJobs.filter(
    (p) =>
      (p.projectCode || p.projectNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.projectName || p.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.customerName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 rounded-xl text-sky-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Project Financial Costing & Budget Control</h1>
            <p className="text-xs text-slate-400 mt-0.5">Project-level Revenue vs Incurred Expenses & Variance Analysis</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search project code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((proj) => {
          const contractVal = proj.totalOrderValue || 4500000;
          const budgetCost = Math.round(contractVal * 0.7);
          const actualCost = Math.round(contractVal * 0.68);
          const projectMargin = contractVal - actualCost;

          return (
            <div key={proj.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-sky-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400">{proj.projectCode || proj.projectNumber}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase">{proj.status}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{proj.projectName || proj.productName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Customer: {proj.customerName}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 font-sans">Contract Value</div>
                  <div className="font-bold text-white mt-0.5">₹{contractVal.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-sans">Actual Cost Incurred</div>
                  <div className="font-bold text-amber-400 mt-0.5">₹{actualCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-sans">Project Profit</div>
                  <div className="font-bold text-emerald-400 mt-0.5">₹{projectMargin.toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
