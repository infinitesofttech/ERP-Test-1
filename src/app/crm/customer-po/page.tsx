'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useERP } from '@/context/ERPContext';
import { DataTable, Column } from '@/components/data/DataTable';
import { CustomerPO } from '@/types/crm';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Briefcase, Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function CustomerPOPage() {
  const router = useRouter();
  const { customerPOs, convertCustomerPOToSalesOrder } = useERP();
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateSalesOrder = (poId: string) => {
    const newSO = convertCustomerPOToSalesOrder(poId);
    setSuccessMsg(`Generated Sales Order ${newSO.salesOrderNumber} from PO.`);
    setTimeout(() => {
      setSuccessMsg('');
      router.push('/crm/sales-orders');
    }, 1500);
  };

  const columns: Column<CustomerPO>[] = [
    {
      header: 'Customer PO #',
      accessorKey: 'poNumber',
      cell: (po) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200">
          {po.poNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      cell: (po) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{po.customerName}</span>
          <span className="text-[10px] text-slate-400 font-mono">Ref Quotation: {po.quotationNumber}</span>
        </div>
      ),
    },
    {
      header: 'PO Value',
      cell: (po) => <span className="font-bold text-emerald-600 font-mono">{formatCurrency(po.poAmount)}</span>,
    },
    {
      header: 'PO Date & Target Delivery',
      cell: (po) => (
        <div className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
          <span className="block">Date: {formatDate(po.poDate)}</span>
          <span className="block text-[10px] text-slate-400">Delivery: {formatDate(po.deliveryDate)}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (po) => (
        <span
          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
            po.status === 'sales_order_created'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {po.status === 'sales_order_created' ? 'Sales Order Created' : 'Received (Ready to Process)'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (po) => (
        <div>
          {po.status === 'sales_order_created' ? (
            <span className="font-mono font-bold text-blue-600 text-xs">
              SO: {po.salesOrderId}
            </span>
          ) : (
            <button
              onClick={() => handleCreateSalesOrder(po.id)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Layers className="w-3 h-3" />
              <span>Create Sales Order</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 text-xs">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Customer Purchase Orders (Inward Verification)
          </h1>
          <p className="text-slate-500 mt-0.5">
            Confirmed customer POs received against accepted quotations. Click &ldquo;Create Sales Order&rdquo; to proceed.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <DataTable
        title="Customer Purchase Orders Register"
        columns={columns}
        data={customerPOs}
      />
    </div>
  );
}
