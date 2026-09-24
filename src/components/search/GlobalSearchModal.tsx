'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useERP } from '../../context/ERPContext';
import { Search, X, Briefcase, FileText, Building, ArrowRight, CornerDownLeft } from 'lucide-react';
import { StatusBadge } from '../workflow/StatusBadge';
import { formatCurrency } from '../../lib/utils';

export function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, jobs, openJobModal, setActiveDepartment } = useERP();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredJobs = jobs.filter(
    (j) =>
      j.jobNumber.toLowerCase().includes(query.toLowerCase()) ||
      j.customerName.toLowerCase().includes(query.toLowerCase()) ||
      j.productName.toLowerCase().includes(query.toLowerCase()) ||
      j.quotationId.toLowerCase().includes(query.toLowerCase()) ||
      j.customerPoNumber.toLowerCase().includes(query.toLowerCase()) ||
      j.salesOrderId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Job # (e.g. JOB-2026-001), Customer, Quotation, PO, Product..."
            className="w-full text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {filteredJobs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredJobs.map((job) => (
              <button
                key={job.jobNumber}
                onClick={() => {
                  setIsSearchOpen(false);
                  openJobModal(job.jobNumber);
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-blue-50/60 dark:hover:bg-blue-950/30 flex items-center justify-between group transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                      {job.jobNumber}
                    </span>
                    <StatusBadge status={job.currentStatus} />
                    <span className="text-slate-400 font-mono text-[11px]">{job.customerPoNumber}</span>
                  </div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{job.productName}</div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" /> {job.customerName}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600">{formatCurrency(job.orderValue)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span className="text-[10px] hidden sm:inline font-medium">View 360°</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Modal Footer Keybind Info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Esc</kbd> to close
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Ctrl</kbd> +{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">K</kbd> to search anytime
            </span>
          </div>
          <span className="font-medium text-slate-600 dark:text-slate-400">Uma Techno Fab Search Engine</span>
        </div>
      </div>
    </div>
  );
}
