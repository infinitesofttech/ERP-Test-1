'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { BarChart3, Download, Filter, FileText, Briefcase, Cpu, CheckCircle2, Clock, DollarSign, RotateCcw } from 'lucide-react';

export default function ProjectReportsPage() {
  const { projectJobs, jobs, projectTasks, projectMilestones, projectDelays, changeRequests, projectCosts } = useERP();

  const [activeReport, setActiveReport] = useState<string>('project_status');
  const [managerFilter, setManagerFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');

  const reportTypes = [
    { id: 'project_status', label: '1. Project Status Report', icon: Briefcase },
    { id: 'job_status', label: '2. Job Status Report', icon: Cpu },
    { id: 'project_progress', label: '3. Project Progress Report', icon: CheckCircle2 },
    { id: 'project_delay', label: '4. Project Delay Report', icon: Clock },
    { id: 'department_progress', label: '5. Department Progress Report', icon: FileText },
    { id: 'task_report', label: '6. Task Report', icon: CheckCircle2 },
    { id: 'milestone_report', label: '7. Milestone Report', icon: FileText },
    { id: 'cost_report', label: '8. Project Cost Report', icon: DollarSign },
    { id: 'delivery_performance', label: '9. Delivery Performance Report', icon: Clock },
    { id: 'employee_task', label: '10. Employee Task Report', icon: FileText },
    { id: 'change_report', label: '11. Project Change Report', icon: RotateCcw },
  ];

  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Project Number,Job Number,Customer,Product,Status,Progress,Delivery Date\n';
    projectJobs.forEach((p) => {
      csvContent += `"${p.projectNumber}","${p.jobNumber}","${p.customerName}","${p.productName}","${p.status}","${p.progressPercent}%","${p.deliveryDate}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UMA_Project_Report_${activeReport}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-xs pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
              Executive Analytics & Exports
            </span>
          </div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            11 Core Project & Manufacturing Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Multi-filtered operational, financial, delay, and delivery performance reports with instant CSV / Excel export.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500 transition cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export CSV / Excel
        </button>
      </div>

      {/* Report Selector Tabs */}
      <div className="bg-white dark:bg-[#0B1120] rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-md overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1.5 min-w-max">
          {reportTypes.map((rep) => {
            const Icon = rep.icon;
            const isActive = activeReport === rep.id;
            return (
              <button
                key={rep.id}
                onClick={() => setActiveReport(rep.id)}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold transition text-xs ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{rep.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Report Table Display */}
      <div className="bg-white dark:bg-[#0B1120] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {reportTypes.find((r) => r.id === activeReport)?.label}
          </h3>
          <span className="text-slate-400 font-mono text-xs" suppressHydrationWarning>
            Generated on: {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Project #</th>
                <th className="p-3">Job #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Product / Equipment</th>
                <th className="p-3">Manager</th>
                <th className="p-3">Delivery Target</th>
                <th className="p-3">Progress %</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {projectJobs.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition">
                  <td className="p-3 font-mono font-bold text-blue-500">{p.projectNumber}</td>
                  <td className="p-3 font-mono font-bold text-amber-500">{p.jobNumber}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{p.customerName}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{p.productName}</td>
                  <td className="p-3">{p.projectManager}</td>
                  <td className="p-3 font-mono text-slate-500">{formatDate(p.deliveryDate)}</td>
                  <td className="p-3 font-mono font-bold text-blue-500">{p.progressPercent}%</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 font-bold uppercase text-[10px]">
                      {p.status}
                    </span>
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
