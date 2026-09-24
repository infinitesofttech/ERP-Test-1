import React from 'react';
import { cn } from '../../lib/utils';
import { JobStatus } from '../../types/erp';

interface StatusBadgeProps {
  status: JobStatus | 'completed' | 'in_progress' | 'pending' | 'delayed' | 'urgent' | 'high' | 'medium' | 'low' | 'approved' | 'rejected' | 'draft' | 'won' | 'lost' | 'new' | 'contacted' | 'converted';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
      case 'approved':
      case 'won':
      case 'converted':
        return {
          label: status === 'won' ? 'WON (ORDER BOOKED)' : status === 'converted' ? 'CONVERTED TO CUSTOMER' : 'COMPLETED / APPROVED',
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500 shadow-sm shadow-emerald-500/50',
        };
      case 'production':
      case 'in_progress':
        return {
          label: 'IN PRODUCTION',
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
          dot: 'bg-blue-500 animate-pulse shadow-sm shadow-blue-500/50',
        };
      case 'qc':
        return {
          label: 'QUALITY INSPECTION (FAT/NDT)',
          bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
          dot: 'bg-purple-500',
        };
      case 'design':
      case 'material_planning':
        return {
          label: status === 'design' ? 'ENGINEERING & BOM' : 'MATERIAL PLANNING',
          bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
          dot: 'bg-indigo-500',
        };
      case 'purchase':
        return {
          label: 'PURCHASE / RM INDENT',
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          dot: 'bg-amber-500',
        };
      case 'ready_for_dispatch':
      case 'dispatched':
        return {
          label: status === 'dispatched' ? 'DISPATCHED' : 'READY FOR DISPATCH',
          bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
          dot: 'bg-cyan-500',
        };
      case 'delayed':
      case 'rejected':
      case 'lost':
        return {
          label: status === 'lost' ? 'LOST' : status === 'rejected' ? 'REJECTED' : 'DELAYED',
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
          dot: 'bg-rose-500',
        };
      case 'urgent':
        return {
          label: 'URGENT PRIORITY',
          bg: 'bg-rose-600 text-white border-rose-600 font-black shadow-md shadow-rose-600/30',
          dot: 'bg-white animate-ping',
        };
      case 'high':
        return {
          label: 'HIGH PRIORITY',
          bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
          dot: 'bg-orange-500',
        };
      case 'new':
      case 'contacted':
        return {
          label: status === 'new' ? 'NEW LEAD' : 'CONTACTED',
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30',
          dot: 'bg-blue-500',
        };
      case 'draft':
      case 'planning':
      case 'pending':
      default:
        return {
          label: String(status).replace('_', ' ').toUpperCase(),
          bg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border uppercase tracking-wider',
        config.bg,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
      <span>{config.label}</span>
    </span>
  );
}
