'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useERP } from '../../../../context/ERPContext';
import { formatCurrency, formatDate } from '../../../../lib/utils';
import {
  ArrowLeft,
  Building,
  Phone,
  Mail,
  FileCheck2,
  Briefcase,
  Layers,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';

export default function Customer360Page() {
  const params = useParams();
  const { customers, quotations, salesOrders, projectJobs, leads, siteVisits } = useERP();

  const customerId = String(params.id);
  const customer = customers.find((c) => c.id === customerId);

  const [activeTab, setActiveTab] = useState<'orders' | 'quotations' | 'projects' | 'visits' | 'info'>('orders');

  if (!customer) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        <p>Customer account not found.</p>
        <Link href="/crm/customers" className="text-blue-600 font-bold underline mt-2 block">
          Return to Customer Directory
        </Link>
      </div>
    );
  }

  const relatedQuotations = quotations.filter((q) => q.customerId === customer.id || q.customerName.includes(customer.companyName));
  const relatedSalesOrders = salesOrders.filter((s) => s.customerId === customer.id || s.customerName.includes(customer.companyName));
  const relatedProjects = projectJobs.filter((p) => p.customerId === customer.id || p.customerName.includes(customer.companyName));
  const relatedVisits = siteVisits.filter((v) => v.customerId === customer.id || v.customerName.includes(customer.companyName));

  const totalBusinessValue = relatedSalesOrders.reduce((sum, so) => sum + so.orderValue, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-4 text-xs pb-10">
      <Link href="/crm/customers" className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-semibold">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Customers Master
      </Link>

      {/* Top 360° Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-sm bg-blue-600 text-white px-2.5 py-0.5 rounded-lg shadow-sm">
                {customer.customerCode}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px] font-bold uppercase border border-amber-300">
                {customer.category} Account
              </span>
              <span className="text-slate-400 font-mono">GST: {customer.gstin}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{customer.companyName}</h1>
            <p className="text-slate-500">{customer.industry} • Account Manager: {customer.assignedSalesPerson}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Lifetime Orders</span>
            <span className="text-base font-extrabold text-emerald-600 block">{formatCurrency(totalBusinessValue)}</span>
            <span className="text-[10px] text-slate-500 block">{relatedSalesOrders.length} Confirmed Projects</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-400 block">Primary Contact</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{customer.contactPerson}</span>
            <span className="text-slate-500 block">{customer.designation}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Contact Info</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{customer.mobile}</span>
            <span className="text-slate-500 block">{customer.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Payment Terms</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{customer.paymentTerms}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Credit Limit</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatCurrency(customer.creditLimit)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 font-medium">
        {[
          { id: 'orders', label: `Sales Orders (${relatedSalesOrders.length})`, icon: Layers },
          { id: 'projects', label: `MTO Projects (${relatedProjects.length})`, icon: Briefcase },
          { id: 'quotations', label: `Quotations (${relatedQuotations.length})`, icon: FileCheck2 },
          { id: 'visits', label: `Site Visits (${relatedVisits.length})`, icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 border-b-2 transition ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Customer Sales Orders History</h3>
            {relatedSalesOrders.map((so) => (
              <div key={so.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600">{so.salesOrderNumber}</span>
                    <span className="text-slate-400 font-mono text-[10px]">PO: {so.customerPoNumber}</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white block mt-0.5">{so.items[0]?.productName}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 block">{formatCurrency(so.orderValue)}</span>
                  <span className="font-mono text-[10px] text-blue-600">Job #: {so.jobNumber || 'Assigned'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Active Manufacturing Jobs</h3>
            {relatedProjects.map((p) => (
              <div key={p.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-blue-600 block">{p.projectNumber} • {p.jobNumber}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">{p.productName}</span>
                  <span className="text-[10px] text-slate-500">Lead: {p.projectManager} • Delivery: {formatDate(p.deliveryDate)}</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded uppercase font-mono text-[10px] font-bold bg-blue-100 text-blue-800">
                    {p.status}
                  </span>
                  <span className="block font-bold text-slate-700 dark:text-slate-300 mt-1">{p.progressPercent}% Complete</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quotations' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Historical Quotations & Revisions</h3>
            {relatedQuotations.map((q) => (
              <div key={q.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-blue-600">{q.quotationNumber} ({q.currentRevision})</span>
                  <span className="text-slate-500 text-[11px] block">{q.latestSummary.machineProduct}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 block">{formatCurrency(q.latestSummary.grandTotal)}</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                    {q.latestSummary.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'visits' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Plant & Site Visits Record</h3>
            {relatedVisits.map((v) => (
              <div key={v.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{v.purpose}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{v.visitDate}</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">{v.discussionNotes}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>Location: {v.location}</span>
                  <span className="uppercase font-bold text-emerald-600">Outcome: {v.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
