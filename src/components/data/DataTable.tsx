'use client';

import React, { useState } from 'react';
import { Search, Download, Printer, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  searchPlaceholder?: string;
  filterComponent?: React.ReactNode;
  actions?: React.ReactNode;
  pageSizeDefault?: number;
}

export function DataTable<T extends Record<string, any>>({
  title,
  subtitle,
  columns,
  data,
  onRowClick,
  searchPlaceholder = 'Search records...',
  filterComponent,
  actions,
  pageSizeDefault = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  // Filter rows based on search query
  const filteredData = data.filter((row) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(row).some((val) => {
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(query);
    });
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = filteredData.map((row) =>
      columns
        .map((c) => {
          const val = c.accessorKey ? row[c.accessorKey] : '';
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(title || 'export').toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-[#0B1120] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-900/5 dark:shadow-black/30 overflow-hidden flex flex-col transition-all">
      {/* Header & Controls Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 bg-slate-50/70 dark:bg-[#080D18]/90">
        <div>
          {title && <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition shadow-inner"
            />
          </div>

          {filterComponent}

          {/* Quick Toolbar buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={exportCSV}
              title="Export to CSV"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handlePrint}
              title="Print Table"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>

          {actions}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[240px]">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider sticky top-0 z-10 text-[11px]">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={cn('py-3 px-4 font-bold whitespace-nowrap', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-slate-400 dark:text-slate-500">
                  <p className="font-semibold text-xs">No matching records found.</p>
                  <p className="text-[11px] mt-1 text-slate-400">Try adjusting your search criteria or filters.</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    'transition-all duration-150',
                    onRowClick
                      ? 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                      : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                  )}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={cn('py-3 px-4 text-slate-700 dark:text-slate-300 font-medium', col.className)}>
                      {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '-') : '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#080D18]/90">
        <div>
          Showing <span className="font-bold text-slate-900 dark:text-white">{filteredData.length > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-bold text-slate-900 dark:text-white">{Math.min(startIndex + pageSize, filteredData.length)}</span> of{' '}
          <span className="font-bold text-slate-900 dark:text-white">{filteredData.length}</span> records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-700 dark:text-slate-200 px-2 font-mono">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
