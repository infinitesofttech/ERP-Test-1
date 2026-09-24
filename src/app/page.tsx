'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useERP } from '../context/ERPContext';
import {
  FileText,
  Cpu,
  AlertTriangle,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Layers,
  Settings,
  User,
  Share2,
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function DashboardPage() {
  const { openJobModal } = useERP();
  const [stageFilter, setStageFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const jobsData = [
    {
      id: 'J-2026-001',
      customer: 'Gujarat Alkalies & Chemicals',
      poRef: 'PO: BA/GL06/108',
      equipment: 'Heavy SS 316L Chemical Reactor Vessel (10 KL)',
      value: '₹ 48,50,000',
      dispatch: '15 Oct 2026',
      progress: 72,
      stage: 'PRODUCTION',
      stageColor: 'bg-info-bg text-info-text border-info-bg',
    },
    {
      id: 'J-2026-002',
      customer: 'Torrent Pharmaceuticals Ltd.',
      poRef: 'PO: RFT/08678/79-892',
      equipment: 'Automobile Fluid Bed Dryer Machine (FBD-150)',
      value: '₹ 62,80,388',
      dispatch: '30 Sept 2026',
      progress: 90,
      stage: 'QUALITY INSPECTION',
      stageColor: 'bg-purple-bg text-purple-text border-purple-bg',
    },
    {
      id: 'J-2026-003',
      customer: 'Tata Chemicals Ltd.',
      poRef: 'PO: TCL/2026/0491',
      equipment: 'High Pressure Heat Exchanger Unit (500 Sq.m)',
      value: '₹ 38,20,000',
      dispatch: '22 Nov 2026',
      progress: 45,
      stage: 'DESIGN RELEASE',
      stageColor: 'bg-accent-bg text-primary border-accent-bg',
    },
    {
      id: 'J-2026-004',
      customer: 'Adani Wilmar Refinery',
      poRef: 'PO: AW/PO/88219',
      equipment: 'Continuous Deodorizer Column Structure (120 TPD)',
      value: '₹ 74,49,612',
      dispatch: '05 Dec 2026',
      progress: 25,
      stage: 'PURCHASE & STORE',
      stageColor: 'bg-success-bg text-success-text border-success-bg',
    },
  ];

  const filteredJobs = jobsData.filter((job) => {
    const matchesStage = stageFilter === 'All' || job.stage === stageFilter;
    const matchesSearch =
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* 1. Hero Banner Matching Screenshot */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f7e8da] via-[#fbf3ea] to-[#f4e2ce] border border-border p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-bold text-text-muted tracking-widest uppercase font-mono">
              MANUFACTURING ERP
            </span>
            <h1 className="text-2xl font-black text-text-primary tracking-tight leading-tight">
              Commercial Operations & 360° Job Traceability
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
              Unified control center for Customer Enquiries, Multi-Revision Quotations, Approved Customer POs, and Shop Floor Job Orders.
            </p>
          </div>

          {/* Right Visual Image Overlay Card */}
          <div className="w-full md:w-80 h-28 rounded-xl bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800')] bg-cover bg-center border border-border relative overflow-hidden flex items-end p-3 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative z-10 text-white">
              <div className="text-xs font-bold leading-tight">Precision Manufacturing</div>
              <div className="text-[10px] text-amber-200">Real Business Impact</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards Matching Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Order Backlog */}
        <div className="bg-bg-surface border border-border rounded-2xl p-4.5 space-y-2 shadow-xs hover-card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-bg flex items-center justify-center text-primary flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-text-muted font-medium">Active Order Backlog</div>
              <div className="text-xl font-bold text-text-primary font-mono tracking-tight">₹ 2,24,00,000</div>
            </div>
          </div>
          <div className="text-[11px] text-success font-semibold flex items-center gap-1">
            <span>↑ 12%</span>
            <span className="text-text-muted font-normal">vs last month</span>
          </div>
        </div>

        {/* Card 2: Shop Floor Machines */}
        <div className="bg-bg-surface border border-border rounded-2xl p-4.5 space-y-2 shadow-xs hover-card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-text-muted font-medium">Shop Floor Machines</div>
              <div className="text-xl font-bold text-text-primary font-mono tracking-tight">3 Equipment</div>
            </div>
          </div>
          <div className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
            <span>⚙️ 1 in Fabrication</span>
          </div>
        </div>

        {/* Card 3: Critical Expedite */}
        <div className="bg-bg-surface border border-border rounded-2xl p-4.5 space-y-2 shadow-xs hover-card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger-bg flex items-center justify-center text-danger flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-text-muted font-medium">Critical Expedite</div>
              <div className="text-xl font-bold text-danger font-mono tracking-tight">3 High Priority</div>
            </div>
          </div>
          <div className="text-[11px] text-danger font-medium flex items-center gap-2">
            <span>⚠️ 2 At-Risk</span>
            <span>🚨 1 Delayed</span>
          </div>
        </div>

        {/* Card 4: Quality & ISO Compliance */}
        <div className="bg-bg-surface border border-border rounded-2xl p-4.5 space-y-2 shadow-xs hover-card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-bg flex items-center justify-center text-success flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-text-muted font-medium">Quality & ISO Compliance</div>
              <div className="text-xl font-bold text-success font-mono tracking-tight">100% Passed</div>
            </div>
          </div>
          <div className="text-[11px] text-success font-medium flex items-center gap-1">
            <span>🛡️ ISO 9001:2015</span>
          </div>
        </div>
      </div>

      {/* 3. Job Tracking Table Matching Screenshot */}
      <div className="bg-bg-surface border border-border rounded-2xl shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-bg-surface">
          <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
            <Layers className="w-4 h-4 text-primary" />
            Job Tracking
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job, customer, equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-app text-xs text-text-primary pl-8 pr-3 py-1.5 rounded-xl border border-border focus:outline-none focus:border-primary"
              />
            </div>

            {/* Stage Filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-bg-app text-xs text-text-primary px-3 py-1.5 rounded-xl border border-border focus:outline-none cursor-pointer"
            >
              <option value="All">All Stages</option>
              <option value="PRODUCTION">PRODUCTION</option>
              <option value="QUALITY INSPECTION">QUALITY INSPECTION</option>
              <option value="DESIGN RELEASE">DESIGN RELEASE</option>
              <option value="PURCHASE & STORE">PURCHASE & STORE</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-bg-app text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border">
                <th className="py-3 px-4">JOB # (MTO)</th>
                <th className="py-3 px-4">CUSTOMER & PO REFERENCE</th>
                <th className="py-3 px-4">EQUIPMENT SPECS & SPECIFICATION</th>
                <th className="py-3 px-4">ORDER VALUE (INR)</th>
                <th className="py-3 px-4">TARGET DISPATCH</th>
                <th className="py-3 px-4">SHOP FLOOR PROGRESS</th>
                <th className="py-3 px-4 text-right">CURRENT STAGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-primary">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-primary-light/40 transition">
                  {/* Job ID Button Clickable */}
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <button
                      onClick={() => openJobModal(job.id)}
                      className="text-info hover:underline focus:outline-none cursor-pointer"
                    >
                      {job.id}
                    </button>
                  </td>

                  {/* Customer & PO */}
                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="font-bold text-text-primary">{job.customer}</div>
                    <div className="text-[11px] text-text-muted font-mono">{job.poRef}</div>
                  </td>

                  {/* Equipment Spec */}
                  <td className="py-3.5 px-4 text-text-secondary font-medium max-w-xs">
                    {job.equipment}
                  </td>

                  {/* Order Value */}
                  <td className="py-3.5 px-4 font-mono font-bold text-text-primary">
                    {job.value}
                  </td>

                  {/* Target Dispatch */}
                  <td className="py-3.5 px-4 text-text-secondary font-medium">
                    {job.dispatch}
                  </td>

                  {/* Progress Bar */}
                  <td className="py-3.5 px-4 min-w-[140px]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-text-muted mb-1">
                      <span>Progress</span>
                      <span className="font-bold text-primary">{job.progress}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-progress-gradient h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </td>

                  {/* Stage Pill */}
                  <td className="py-3.5 px-4 text-right">
                    <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold tracking-wider inline-block border', job.stageColor)}>
                      {job.stage}
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
