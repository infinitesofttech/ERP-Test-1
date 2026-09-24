'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useERP } from '../../../context/ERPContext';
import { DataTable, Column } from '../../../components/data/DataTable';
import { StatusBadge } from '../../../components/workflow/StatusBadge';
import { Enquiry } from '../../../types/crm';
import { formatDate } from '../../../lib/utils';
import { FileText, Plus, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function EnquiriesPage() {
  const { enquiries, addEnquiry, customers, employees } = useERP();
  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [machineProduct, setMachineProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [specification, setSpecification] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('2026-11-15');
  const [assignedPersonId, setAssignedPersonId] = useState(employees[0]?.id || '');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);
    const emp = employees.find((e) => e.id === assignedPersonId);

    addEnquiry({
      customerId,
      customerName: cust?.companyName || 'Valued Customer',
      requirement: specification,
      machineProduct,
      quantity,
      specification,
      expectedDelivery,
      assignedPersonId,
      assignedPersonName: emp ? `${emp.firstName} ${emp.lastName}` : 'Sales Engineer',
      status: 'technical_review',
    });

    setMachineProduct('');
    setSpecification('');
    setShowModal(false);
  };

  const columns: Column<Enquiry>[] = [
    {
      header: 'Enquiry No.',
      accessorKey: 'enquiryNo',
      cell: (enq) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200">
          {enq.enquiryNo}
        </span>
      ),
    },
    {
      header: 'Customer',
      cell: (enq) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{enq.customerName}</span>
          <span className="text-[10px] text-slate-400 font-mono">ID: {enq.customerId}</span>
        </div>
      ),
    },
    {
      header: 'Machine / Equipment Requirement',
      cell: (enq) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{enq.machineProduct}</span>
          <span className="text-[10px] text-slate-500 block truncate max-w-xs">{enq.specification}</span>
        </div>
      ),
    },
    {
      header: 'Qty',
      accessorKey: 'quantity',
      cell: (enq) => <span className="font-mono font-bold">{enq.quantity}</span>,
    },
    {
      header: 'Assigned Engineer',
      accessorKey: 'assignedPersonName',
    },
    {
      header: 'Status',
      cell: (enq) => <StatusBadge status={enq.status as any} />,
    },
    {
      header: 'Actions',
      cell: (enq) => (
        <div className="flex items-center gap-2">
          {enq.quotationId ? (
            <span className="font-mono text-xs font-bold text-emerald-600">
              Quotation: {enq.quotationId}
            </span>
          ) : (
            <Link
              href={`/crm/quotations/new?customerId=${enq.customerId}&enquiryId=${enq.id}`}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold"
            >
              Generate Quotation
            </Link>
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
            <FileText className="w-5 h-5 text-blue-600" />
            Technical Enquiries & Requirement Review
          </h1>
          <p className="text-slate-500 mt-0.5">
            Technical feasibility checks and estimation before raising formal Quotations.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Technical Enquiry</span>
        </button>
      </div>

      <DataTable
        title="Technical Enquiries Master"
        columns={columns}
        data={enquiries}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Technical Enquiry</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Customer *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Machine / Equipment Name *</label>
                <input
                  type="text"
                  required
                  value={machineProduct}
                  onChange={(e) => setMachineProduct(e.target.value)}
                  placeholder="e.g. 5000L Limpet Jacketed SS Reactor"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Expected Delivery</label>
                  <input
                    type="date"
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assigned Estimation Engineer</label>
                <select
                  value={assignedPersonId}
                  onChange={(e) => setAssignedPersonId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Technical Specifications</label>
                <textarea
                  rows={3}
                  value={specification}
                  onChange={(e) => setSpecification(e.target.value)}
                  placeholder="Material specs, pressure, temperature ratings..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
