'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useERP } from '../../../context/ERPContext';
import { DataTable, Column } from '../../../components/data/DataTable';
import { StatusBadge } from '../../../components/workflow/StatusBadge';
import { Lead } from '../../../types/crm';
import { formatCurrency, formatDate } from '../../../lib/utils';
import {
  UserPlus,
  ArrowUpRight,
  Filter,
  Phone,
  Mail,
  Building,
  Calendar,
  Sparkles,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export default function LeadsListPage() {
  const router = useRouter();
  const { leads, convertLeadToCustomer } = useERP();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [successMsg, setSuccessMsg] = useState('');

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
    return true;
  });

  const handleConvert = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = convertLeadToCustomer(leadId);
    setSuccessMsg(`Converted to Customer "${res.customer.companyName}" & Enquiry "${res.enquiry?.enquiryNo}"`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const columns: Column<Lead>[] = [
    {
      header: 'Lead No.',
      accessorKey: 'leadNo',
      cell: (lead) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 text-xs">
          {lead.leadNo}
        </span>
      ),
    },
    {
      header: 'Company & Contact',
      cell: (lead) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{lead.companyName}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            {lead.contactPerson} ({lead.designation})
          </span>
        </div>
      ),
    },
    {
      header: 'Equipment / Machine Requirement',
      cell: (lead) => (
        <div className="max-w-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{lead.productName}</span>
          <span className="text-[11px] text-slate-400 block truncate font-mono">Qty: {lead.quantity} • {lead.capacity || 'Custom Spec'}</span>
        </div>
      ),
    },
    {
      header: 'Est. Budget',
      cell: (lead) => (
        <span className="font-bold text-slate-900 dark:text-white font-mono">
          {lead.budget ? formatCurrency(lead.budget) : 'TBD'}
        </span>
      ),
    },
    {
      header: 'Assigned Sales Person',
      cell: (lead) => (
        <span className="font-bold text-slate-700 dark:text-slate-300">{lead.assignedSalesPersonName}</span>
      ),
    },
    {
      header: 'Lead Source',
      cell: (lead) => (
        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px] font-bold uppercase">
          {lead.source.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Lead Status',
      cell: (lead) => <StatusBadge status={lead.status as any} />,
    },
    {
      header: 'Next Follow-up',
      cell: (lead) => (
        <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
          {lead.nextFollowUpDate ? formatDate(lead.nextFollowUpDate) : '-'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (lead) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/crm/leads/${lead.id}`}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg font-bold text-xs flex items-center gap-1 transition"
          >
            <span>360° View</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
          {!lead.convertedCustomerId && (
            <button
              onClick={(e) => handleConvert(lead.id, e)}
              title="Convert to Customer Master"
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold text-xs transition cursor-pointer"
            >
              Convert
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 text-xs pb-10">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md shadow-slate-900/5">
        <div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Leads & Enquiry Acquisition Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Capture and qualify commercial enquiries from Exhibitions, Inbound calls, WhatsApp, and Website.
          </p>
        </div>

        <Link
          href="/crm/leads/new"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-md shadow-blue-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Register New Lead</span>
        </Link>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Leads Data Table */}
      <DataTable
        title="Active CRM Leads Master Register"
        subtitle={`Total ${filteredLeads.length} Registered Commercial Enquiries`}
        columns={columns}
        data={filteredLeads}
        onRowClick={(lead) => router.push(`/crm/leads/${lead.id}`)}
        searchPlaceholder="Search Company, Contact, Product requirement, Lead #..."
        filterComponent={
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Lead Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="requirement_received">Requirement Received</option>
              <option value="quotation_sent">Quotation Sent</option>
              <option value="won">Won Orders</option>
              <option value="lost">Lost</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="exhibition">Exhibition / Expo</option>
              <option value="referral">Referral</option>
              <option value="existing_customer">Existing Customer</option>
              <option value="whatsapp">WhatsApp / Phone</option>
            </select>
          </div>
        }
      />
    </div>
  );
}
