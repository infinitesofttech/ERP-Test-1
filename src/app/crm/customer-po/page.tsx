'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useERP } from '@/context/ERPContext';
import { DataTable, Column } from '@/components/data/DataTable';
import { CustomerPO } from '@/types/crm';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Briefcase,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Pencil,
  Trash2,
  X,
  Save,
  AlertTriangle,
  Plus,
} from 'lucide-react';

export default function CustomerPOPage() {
  const router = useRouter();
  const {
    customerPOs,
    convertCustomerPOToSalesOrder,
    updateCustomerPO,
    deleteCustomerPO,
    addCustomerPO,
    quotations,
    customers,
  } = useERP();

  const [successMsg, setSuccessMsg] = useState('');
  const [editingPO, setEditingPO] = useState<CustomerPO | null>(null);
  const [deletingPO, setDeletingPO] = useState<CustomerPO | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPoNumber, setNewPoNumber] = useState('');
  const [newQuotationId, setNewQuotationId] = useState('');
  const [newPoAmount, setNewPoAmount] = useState<number | string>('');
  const [newPoDate, setNewPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDeliveryDate, setNewDeliveryDate] = useState('');
  const [newPaymentTerms, setNewPaymentTerms] = useState('30 Days Credit');
  const [newRemarks, setNewRemarks] = useState('');

  // Edit form state
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editPoNumber, setEditPoNumber] = useState('');
  const [editPoAmount, setEditPoAmount] = useState<number | string>(0);
  const [editPoDate, setEditPoDate] = useState('');
  const [editDeliveryDate, setEditDeliveryDate] = useState('');
  const [editRemarks, setEditRemarks] = useState('');

  const resetAddForm = () => {
    setNewCustomerName('');
    setNewPoNumber('');
    setNewQuotationId('');
    setNewPoAmount('');
    setNewPoDate(new Date().toISOString().split('T')[0]);
    setNewDeliveryDate('');
    setNewPaymentTerms('30 Days Credit');
    setNewRemarks('');
  };

  const handleQuotationChange = (quoId: string) => {
    setNewQuotationId(quoId);
    if (!quoId) return;

    const matchedQuo = quotations.find((q) => q.id === quoId || q.quotationNumber === quoId);
    if (matchedQuo) {
      if (matchedQuo.customerName && matchedQuo.customerName !== 'Customer') {
        setNewCustomerName(matchedQuo.customerName);
      }
      const revs = matchedQuo.revisions || [];
      const latestRev = revs[revs.length - 1];
      const grandTotal = matchedQuo.latestSummary?.grandTotal || latestRev?.grandTotal || 0;
      if (grandTotal) {
        setNewPoAmount(grandTotal);
      }
      if (latestRev?.paymentTerms) {
        setNewPaymentTerms(latestRev.paymentTerms);
      }
      if (!newPoNumber) {
        const cleanName = (matchedQuo.customerName || 'CUST').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
        setNewPoNumber(`PO/${cleanName}/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
      }
    }
  };

  const handleCustomerChange = (custName: string) => {
    setNewCustomerName(custName);
    if (!newPoNumber && custName.trim()) {
      const cleanName = custName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'CUST';
      setNewPoNumber(`PO/${cleanName}/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const handleAddCustomerPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newPoNumber.trim()) return;

    const matchedQuo = quotations.find((q) => q.id === newQuotationId || q.quotationNumber === newQuotationId);
    const matchedCust = customers?.find((c) => c.companyName?.toLowerCase() === newCustomerName.trim().toLowerCase());

    const created = addCustomerPO({
      poNumber: newPoNumber.trim(),
      poDate: newPoDate || new Date().toISOString().split('T')[0],
      customerId: matchedQuo?.customerId || matchedCust?.id || `CUST-${Date.now().toString().slice(-4)}`,
      customerName: newCustomerName.trim(),
      quotationId: matchedQuo ? matchedQuo.id : (newQuotationId || ''),
      quotationNumber: matchedQuo
        ? `${matchedQuo.quotationNumber} (${matchedQuo.revisions?.slice(-1)[0]?.revisionNumber || 'Rev-00'})`
        : (newQuotationId ? newQuotationId : 'Direct PO'),
      poAmount: Number(newPoAmount) || 0,
      paymentTerms: newPaymentTerms.trim() || '30 Days Credit',
      deliveryDate: newDeliveryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'received',
      remarks: newRemarks.trim() || 'Direct Customer PO received and verified.',
    });

    setShowAddModal(false);
    resetAddForm();
    setSuccessMsg(`Customer PO "${created.poNumber}" added successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCreateSalesOrder = (poId: string) => {
    const newSO = convertCustomerPOToSalesOrder(poId);
    setSuccessMsg(`Generated Sales Order ${newSO.salesOrderNumber} from PO.`);
    setTimeout(() => {
      setSuccessMsg('');
      router.push('/crm/sales-orders');
    }, 1500);
  };

  const openEditModal = (po: CustomerPO) => {
    setEditingPO(po);
    setEditCustomerName(po.customerName || '');
    setEditPoNumber(po.poNumber || '');
    setEditPoAmount(Number(po.poAmount || 0));
    setEditPoDate(po.poDate || '');
    setEditDeliveryDate(po.deliveryDate || '');
    setEditRemarks(po.remarks || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPO) return;

    updateCustomerPO(editingPO.id, {
      customerName: editCustomerName.trim() || editingPO.customerName,
      poNumber: editPoNumber.trim() || editingPO.poNumber,
      poAmount: Number(editPoAmount) || 0,
      poDate: editPoDate || editingPO.poDate,
      deliveryDate: editDeliveryDate || editingPO.deliveryDate,
      remarks: editRemarks,
    });

    setEditingPO(null);
    setSuccessMsg(`Customer PO "${editPoNumber.trim() || editingPO.poNumber}" updated successfully.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleConfirmDelete = () => {
    if (!deletingPO) return;
    deleteCustomerPO(deletingPO.id);
    setSuccessMsg(`Customer PO "${deletingPO.poNumber}" removed.`);
    setDeletingPO(null);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const columns: Column<CustomerPO>[] = [
    {
      header: 'CUSTOMER PO #',
      accessorKey: 'poNumber',
      cell: (po) => (
        <span className="font-mono font-bold text-[#0E91B2] bg-[#E0F2FE] px-2.5 py-1 rounded-lg border border-[#BAE6FD] text-xs">
          {po.poNumber}
        </span>
      ),
    },
    {
      header: 'CUSTOMER',
      cell: (po) => {
        // Resolve customer name with fallback to quotation if needed
        const matchedQuo = quotations.find(
          (q) =>
            q.id === po.quotationId ||
            q.quotationNumber === po.quotationNumber ||
            (po.quotationNumber && q.quotationNumber && po.quotationNumber.includes(q.quotationNumber))
        );
        const resolvedCustomer =
          po.customerName && po.customerName !== 'Audit Petrochem Ltd'
            ? po.customerName
            : matchedQuo?.customerName && matchedQuo.customerName !== 'Customer'
            ? matchedQuo.customerName
            : po.customerName;

        return (
          <div>
            <span className="font-bold text-slate-900 dark:text-[#211B17] block">
              {resolvedCustomer}
            </span>
            {po.quotationId ? (
              <Link
                href={`/crm/quotations/${po.quotationId}`}
                className="text-[11px] text-[#70665F] hover:text-[#0E91B2] hover:underline font-mono inline-flex items-center gap-0.5"
              >
                <span>Ref Quotation: {po.quotationNumber || po.quotationId}</span>
              </Link>
            ) : (
              <span className="text-[11px] text-[#70665F] font-mono">
                Ref Quotation: {po.quotationNumber || 'Direct PO'}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'PO VALUE',
      cell: (po) => (
        <span className="font-bold text-emerald-600 font-mono text-xs">
          {formatCurrency(Number(po.poAmount || (po as any).po_value || (po as any).poValue || 0))}
        </span>
      ),
    },
    {
      header: 'PO DATE & TARGET DELIVERY',
      cell: (po) => (
        <div className="font-mono text-slate-600 dark:text-[#70665F] text-[11px]">
          <span className="block">Date: {formatDate(po.poDate)}</span>
          <span className="block text-[10px] text-[#70665F]">Delivery: {formatDate(po.deliveryDate)}</span>
        </div>
      ),
    },
    {
      header: 'STATUS',
      cell: (po) => {
        const isConverted = po.status === 'sales_order_created' || po.status === 'converted_to_so';
        return (
          <span
            className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider inline-block ${
              isConverted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            {isConverted ? 'Sales Order Created' : 'Received (Ready to Process)'}
          </span>
        );
      },
    },
    {
      header: 'ACTIONS',
      cell: (po) => {
        const isConverted = po.status === 'sales_order_created' || po.status === 'converted_to_so';
        const soNumber = po.salesOrderId || (po as any).convertedSoId || (po as any).converted_so_id;
        return (
          <div className="flex items-center gap-2">
            {isConverted ? (
              <Link
                href="/crm/sales-orders"
                className="font-mono font-bold text-crm-brand-700 hover:underline text-xs inline-flex items-center gap-1 bg-[#FAF0E6] px-2.5 py-1 rounded-lg border border-[#E7DED5]"
              >
                <span>SO: {soNumber || 'View SO'}</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            ) : (
              <button
                onClick={() => handleCreateSalesOrder(po.id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Create Sales Order</span>
              </button>
            )}

            {/* Quick Edit button */}
            <button
              onClick={() => openEditModal(po)}
              title="Edit PO & Customer Details"
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            {/* Delete button */}
            <button
              onClick={() => setDeletingPO(po)}
              title="Delete Customer PO"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 text-xs pb-10">
      <div className="bg-white dark:bg-white p-4 rounded-xl border border-slate-200 dark:border-[#EBE3DB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-[#211B17] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-crm-brand-700" />
            Customer Purchase Orders (Inward Verification)
          </h1>
          <p className="text-[#70665F] mt-0.5">
            Confirmed customer POs received against accepted quotations. Click &ldquo;Create Sales Order&rdquo; to proceed.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetAddForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 bg-[#3E2723] hover:bg-[#2C1810] text-white rounded-xl font-bold transition flex items-center gap-2 shadow-xs cursor-pointer whitespace-nowrap text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer PO</span>
        </button>
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

      {/* Edit Customer PO Modal */}
      {editingPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E7DED5] rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DED5]">
              <h3 className="text-base font-bold text-[#211B17] flex items-center gap-2">
                <Pencil className="w-4 h-4 text-crm-brand-700" />
                Edit Customer PO Information
              </h3>
              <button
                onClick={() => setEditingPO(null)}
                className="text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#544B45] font-semibold mb-1">
                  Customer / Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  placeholder="e.g. abc@123"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl font-bold text-[#211B17] outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#544B45] font-semibold mb-1">
                    Customer PO Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editPoNumber}
                    onChange={(e) => setEditPoNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl font-mono font-bold text-[#211B17] outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[#544B45] font-semibold mb-1">
                    PO Value (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editPoAmount}
                    onChange={(e) => setEditPoAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl font-mono font-bold text-emerald-700 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#544B45] font-semibold mb-1">PO Date</label>
                  <input
                    type="date"
                    value={editPoDate}
                    onChange={(e) => setEditPoDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl font-mono text-[#211B17]"
                  />
                </div>
                <div>
                  <label className="block text-[#544B45] font-semibold mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    value={editDeliveryDate}
                    onChange={(e) => setEditDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl font-mono text-[#211B17]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#544B45] font-semibold mb-1">Remarks / Scope Notes</label>
                <textarea
                  rows={2}
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="Additional customer instructions..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl text-xs text-[#211B17] outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E7DED5]">
                <button
                  type="button"
                  onClick={() => setEditingPO(null)}
                  className="px-4 py-2 border border-[#E7DED5] rounded-xl text-[#544B45] hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E7DED5] rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#211B17]">Delete Customer PO</h3>
                <p className="text-xs text-[#70665F]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#544B45]">
              Are you sure you want to remove Customer PO{' '}
              <span className="font-bold font-mono text-[#211B17]">{deletingPO.poNumber}</span> (
              <span className="font-semibold">{deletingPO.customerName}</span>)?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPO(null)}
                className="px-4 py-2 border border-[#E7DED5] rounded-xl text-[#544B45] hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer PO Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E7DED5] rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DED5]">
              <h3 className="text-base font-bold text-[#211B17] flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-crm-brand-700" />
                Add Customer Purchase Order
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomerPO} className="space-y-3.5 text-xs">
              {/* Optional Quotation Link */}
              <div>
                <label className="block text-[#544B45] font-semibold mb-1">
                  Link with Quotation (Optional)
                </label>
                <select
                  value={newQuotationId}
                  onChange={(e) => handleQuotationChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl font-semibold text-[#211B17] outline-none focus:bg-white focus:border-blue-600"
                >
                  <option value="">-- Direct PO (No Quotation) --</option>
                  {quotations.map((q) => {
                    const rev = q.revisions?.[q.revisions.length - 1];
                    const amount = q.latestSummary?.grandTotal || rev?.grandTotal || 0;
                    return (
                      <option key={q.id} value={q.id}>
                        {q.quotationNumber} — {q.customerName || 'Customer'} (₹{amount ? Number(amount).toLocaleString('en-IN') : '0'})
                      </option>
                    );
                  })}
                </select>
                <span className="text-[10px] text-[#70665F] mt-0.5 block">
                  Selecting an accepted quotation auto-fills customer details and PO value.
                </span>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-[#544B45] font-semibold mb-1">
                  Customer / Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  list="customer-suggestions"
                  value={newCustomerName}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  placeholder="e.g. Acme Corporation or Audit Petrochem"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl font-bold text-[#211B17] outline-none focus:bg-white focus:border-blue-600"
                />
                <datalist id="customer-suggestions">
                  {customers?.map((c) => (
                    <option key={c.id} value={c.companyName} />
                  ))}
                </datalist>
              </div>

              {/* PO Number & PO Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#544B45] font-semibold mb-1">
                    Customer PO Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPoNumber}
                    onChange={(e) => setNewPoNumber(e.target.value)}
                    placeholder="e.g. PO/ABC/2026/001"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl font-mono font-bold text-[#211B17] outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[#544B45] font-semibold mb-1">
                    PO Value (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newPoAmount}
                    onChange={(e) => setNewPoAmount(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl font-mono font-bold text-emerald-700 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
              </div>

              {/* PO Date & Delivery Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#544B45] font-semibold mb-1">
                    PO Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newPoDate}
                    onChange={(e) => setNewPoDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl font-mono text-[#211B17]"
                  />
                </div>
                <div>
                  <label className="block text-[#544B45] font-semibold mb-1">
                    Target Delivery Date
                  </label>
                  <input
                    type="date"
                    value={newDeliveryDate}
                    onChange={(e) => setNewDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl font-mono text-[#211B17]"
                  />
                </div>
              </div>

              {/* Payment Terms */}
              <div>
                <label className="block text-[#544B45] font-semibold mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={newPaymentTerms}
                  onChange={(e) => setNewPaymentTerms(e.target.value)}
                  placeholder="e.g. 30 Days Credit / 50% Advance"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl text-xs text-[#211B17] outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[#544B45] font-semibold mb-1">Remarks / Scope Notes</label>
                <textarea
                  rows={2}
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  placeholder="Additional customer instructions or PO details..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E7DED5] rounded-xl text-xs text-[#211B17] outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E7DED5]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#E7DED5] rounded-xl text-[#544B45] hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3E2723] hover:bg-[#2C1810] text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Customer PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
