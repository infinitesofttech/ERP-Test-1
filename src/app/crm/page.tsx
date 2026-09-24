'use client';

import React from 'react';
import Link from 'next/link';
import { useERP } from '../../context/ERPContext';
import { formatCurrency } from '../../lib/utils';
import {
  Users,
  UserPlus,
  FileCheck2,
  Briefcase,
  TrendingUp,
  PhoneCall,
  Clock,
  ArrowRight,
  PlusCircle,
  Award,
  DollarSign,
  Building,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

export default function CRMDashboardPage() {
  const { leads, quotations, customerPOs, salesOrders, followUps, opportunities } = useERP();

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const activeLeads = leads.filter((l) => l.status !== 'won' && l.status !== 'lost').length;
  const wonLeads = leads.filter((l) => l.status === 'won').length;
  const lostLeads = leads.filter((l) => l.status === 'lost').length;

  const todayFollowUps = followUps.filter((f) => f.date === '2026-09-23' && f.status === 'pending');
  const overdueFollowUps = followUps.filter((f) => f.date < '2026-09-23' && f.status === 'pending');

  const totalPipelineValue = opportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);
  const totalWonValue = salesOrders.reduce((sum, so) => sum + so.orderValue, 0);

  // Pipeline Data for Recharts
  const pipelineData = [
    { stage: 'Qualification', count: opportunities.filter((o) => o.stage === 'qualification').length, value: 38 },
    { stage: 'Requirement', count: opportunities.filter((o) => o.stage === 'requirement').length, value: 92 },
    { stage: 'Technical', count: opportunities.filter((o) => o.stage === 'technical_discussion').length, value: 65 },
    { stage: 'Quotation', count: opportunities.filter((o) => o.stage === 'quotation').length, value: 145 },
    { stage: 'Negotiation', count: opportunities.filter((o) => o.stage === 'negotiation').length, value: 138 },
    { stage: 'Won Orders', count: salesOrders.length, value: Math.round(totalWonValue / 100000) },
  ];

  // Lead Source Distribution
  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });
  const sourcePieData = Object.entries(sourceCounts).map(([key, value]) => ({
    name: key.replace('_', ' ').toUpperCase(),
    value,
  }));
  const PIE_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

  return (
    <div className="space-y-5 text-xs pb-10">
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 font-mono text-[10px] font-bold uppercase">
              Module 1: CRM & Sales Engine
            </span>
          </div>
          <h1 className="text-xl font-black text-white">Commercial & Sales Command Dashboard</h1>
          <p className="text-slate-300 text-xs mt-0.5 max-w-xl">
            Real-time pipeline analytics, lead conversion rate, active quotations, and customer PO tracking for Uma Techno Fab.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/crm/leads/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Lead</span>
          </Link>
          <Link
            href="/crm/quotations/new"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-bold transition flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>+ New Quotation</span>
          </Link>
        </div>
      </div>

      {/* KPI Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Leads</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">{totalLeads}</span>
          <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1 mt-1">
            <UserPlus className="w-3 h-3" /> {newLeads} New Uncontacted
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Follow-ups Today</span>
          <span className="text-xl font-extrabold text-amber-600 mt-1 block">{todayFollowUps.length}</span>
          <span className="text-[10px] text-rose-600 font-medium flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> {overdueFollowUps.length} Overdue
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Quotations Sent</span>
          <span className="text-xl font-extrabold text-purple-600 mt-1 block">{quotations.length}</span>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">
            Multi-Revision Supported
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Active Pipeline</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            {formatCurrency(totalPipelineValue)}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium block mt-1">
            {opportunities.length} Open Deals
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Confirmed Orders Won</span>
          <span className="text-xl font-extrabold text-emerald-600 mt-1 block">
            {formatCurrency(totalWonValue)}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">
            {salesOrders.length} Sales Orders (In Mfg)
          </span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Pipeline Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Sales Opportunity Pipeline by Value (₹ in Lakhs)
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Weighted Probability</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`₹ ${val} Lakhs`, 'Pipeline Value']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Lead Sources */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Lead Acquisition Channels
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourcePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} labelLine={false}>
                  {sourcePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
            {sourcePieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links / Operations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Today's Action Items */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-amber-500" /> Follow-ups Due Today
            </span>
            <Link href="/crm/follow-ups" className="text-blue-600 hover:underline text-[11px] font-semibold">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {todayFollowUps.slice(0, 3).map((f) => (
              <div key={f.id} className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{f.leadOrCustomerName}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{f.purpose}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[9px] font-bold">
                  {f.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Recent Quotations */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-purple-500" /> Recent Quotations
            </span>
            <Link href="/crm/quotations" className="text-blue-600 hover:underline text-[11px] font-semibold">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {quotations.slice(0, 3).map((q) => (
              <div key={q.id} className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-blue-600 block">{q.quotationNumber} ({q.currentRevision})</span>
                  <span className="text-[10px] text-slate-500 block truncate">{q.customerName}</span>
                </div>
                <span className="font-bold text-emerald-600 text-[11px]">{formatCurrency(q.latestSummary.grandTotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Ready for Shop Floor Transition */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" /> CRM → Project Handover
            </span>
            <Link href="/crm/sales-orders" className="text-blue-600 hover:underline text-[11px] font-semibold">
              Sales Orders
            </Link>
          </div>
          <p className="text-slate-500 text-[11px]">
            Confirmed sales orders can immediately initiate an Engineering Project and Job Number (`JOB-2026-XXX`) with 1-click.
          </p>
          <Link
            href="/crm/sales-orders"
            className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold flex items-center justify-center gap-1.5 transition"
          >
            <span>Open Sales Orders to Convert</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
