'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Layers,
  Package,
  Building,
  Factory,
  Receipt,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  UserCheck,
  FileText,
  Truck,
} from 'lucide-react';

export default function ManagementDashboardPage() {
  const { activeRoleView, setActiveRoleView, customers, salesOrders, jobs, employees, centralAlerts } = useERP();
  const [dateRange, setDateRange] = useState<string>('This Month');

  const rolesList = [
    'Super Admin',
    'CRM Manager',
    'Project Manager',
    'Purchase Manager',
    'Store Manager',
    'Production Manager',
    'Accounts Manager',
    'HR Manager',
    'Maintenance Manager',
  ];

  const kpis = [
    { label: 'Total Customers', value: '42', change: '+4 this month', color: 'text-blue-400' },
    { label: 'Active Projects', value: '14', change: '8 On Track', color: 'text-cyan-400' },
    { label: 'Active Jobs', value: '18', change: '3 Urgent', color: 'text-amber-400' },
    { label: 'Pending Quotations', value: '6', change: '₹1.8 Cr value', color: 'text-purple-400' },
    { label: 'Confirmed Orders', value: '12', change: '₹4.2 Cr booked', color: 'text-emerald-400' },
    { label: 'Pending Purchase', value: '5 PRs', change: '₹28 Lakhs', color: 'text-rose-400' },
    { label: 'Material Shortage', value: '0 Items', change: '100% Stock Ready', color: 'text-emerald-400' },
    { label: 'Production Jobs', value: '8 Jobs', change: 'Shopfloor active', color: 'text-orange-400' },
    { label: 'WIP Jobs', value: '5 Jobs', change: 'In Fabrication', color: 'text-yellow-400' },
    { label: 'Completed Jobs', value: '24', change: 'YTD Delivered', color: 'text-green-400' },
    { label: 'Pending Dispatch', value: '2 Units', change: 'Logistics Ready', color: 'text-indigo-400' },
    { label: 'Outstanding Receivables', value: '₹47.56 L', change: '12 Overdue', color: 'text-rose-400' },
    { label: 'Outstanding Payables', value: '₹22.10 L', change: 'Scheduled', color: 'text-blue-400' },
    { label: 'Monthly Revenue', value: '₹1.85 Cr', change: '+18% vs Last Mo', color: 'text-emerald-400' },
    { label: 'Monthly Expenses', value: '₹1.22 Cr', change: 'Within Budget', color: 'text-amber-400' },
    { label: 'Current Month Profit', value: '₹63 Lakhs', change: '34% Net Margin', color: 'text-teal-400' },
    { label: 'Total Employees', value: '128', change: '96.5% Attendance', color: 'text-pink-400' },
    { label: 'Open Service Requests', value: '2 Requests', change: '1 Breakdown', color: 'text-red-400' },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100 font-sans">
      {/* Top Header & Role View Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Executive Management Dashboard</h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Central Strategic & Financial Command Center • Uma Techno Fab Manufacturing ERP
              </p>
            </div>
          </div>
        </div>

        {/* Role Selector & Date Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold">Role Scope:</span>
            <select
              value={activeRoleView}
              onChange={(e) => setActiveRoleView(e.target.value)}
              className="bg-transparent text-indigo-400 font-bold outline-none cursor-pointer"
            >
              {rolesList.map((r) => (
                <option key={r} value={r} className="bg-slate-900 text-slate-200">
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold outline-none cursor-pointer"
            >
              <option value="This Month" className="bg-slate-900">This Month (Sep 2026)</option>
              <option value="Last Quarter" className="bg-slate-900">Q2 FY 2026-27</option>
              <option value="Year to Date" className="bg-slate-900">FY 2026-27 YTD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Role Active Alert Banner */}
      <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl flex items-center justify-between text-xs text-indigo-200">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          <span>Active Persona Scope: <strong className="text-white">{activeRoleView}</strong>. KPIs and analytics panels are tailored for {activeRoleView} visibility level.</span>
        </div>
        <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded font-mono font-bold text-indigo-300">RBAC Enforced</span>
      </div>

      {/* Executive KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">{kpi.label}</span>
            <div className={`text-xl font-black font-mono ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[10px] text-slate-400 font-medium truncate">{kpi.change}</div>
          </div>
        ))}
      </div>

      {/* Departmental Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & Commercial Analytics */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Sales Engine & Quotation Conversion
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Sep 2026</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Total Quotations Issued (Sep):</span>
              <span className="font-mono font-bold text-white">₹2,45,00,000 (14 Quotes)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Orders Won & Sales Orders Booked:</span>
              <span className="font-mono font-bold text-emerald-400">₹1,85,00,000 (10 SOs)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Conversion Win Rate:</span>
              <span className="font-mono font-bold text-cyan-400">71.4% Win Ratio</span>
            </div>
            {/* Visual Bar representation */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Monthly Target (₹2.0 Cr)</span>
                <span>92.5% Achieved</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92.5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Purchase & Procurement Analytics */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-400" /> Purchase & Procurement Outflow
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Sep 2026</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Purchase Orders Issued:</span>
              <span className="font-mono font-bold text-white">₹88,40,000 (18 POs)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Goods Received (GRN):</span>
              <span className="font-mono font-bold text-emerald-400">₹72,10,000 (15 Deliveries)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Top Supplier by Volume:</span>
              <span className="font-bold text-purple-400">Tata Steel Ltd. (₹45.0 L)</span>
            </div>
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>On-Time Supplier Delivery Rate</span>
                <span>95.2% On Time</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95.2%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Production & Shop Floor Efficiency */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Factory className="w-4 h-4 text-orange-400" /> Production Efficiency & Machine OEE
            </h3>
            <span className="text-[10px] font-mono text-slate-400 font-bold text-emerald-400">Overall OEE: 88.4%</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>CNC Plasma & Laser Bay Utilization:</span>
              <span className="font-mono font-bold text-white">92.0% (16 Hrs/Day)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Heavy Fabrication & Welding Bay:</span>
              <span className="font-mono font-bold text-white">86.5% Utilization</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Scrap Generation Ratio:</span>
              <span className="font-mono font-bold text-emerald-400">1.2% (Well within 2.5% Limit)</span>
            </div>
          </div>
        </div>

        {/* Financial Profit & Loss Matrix */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-teal-400" /> Financial Cash Flow & Profitability
            </h3>
            <span className="text-[10px] font-mono text-teal-400 font-bold">34% Net Profit Margin</span>
          </div>
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="font-sans">Gross Billed Revenue:</span>
              <span className="font-bold text-emerald-400">₹1,85,00,000</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="font-sans">Direct Material & Production Cost:</span>
              <span className="text-rose-400">₹98,50,000</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="font-sans">Overheads, HR Payroll & Admin:</span>
              <span className="text-rose-400">₹23,50,000</span>
            </div>
            <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-2 text-sm font-bold">
              <span className="font-sans text-white">Net Operating Profit:</span>
              <span className="text-teal-400">₹63,00,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
