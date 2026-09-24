'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  FileCheck,
  Building,
  Calendar,
  Layers,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { PurchaseRequisition, PRItem } from '../../../types/purchase';

export default function PurchaseRequisitionPage() {
  const { purchaseRequisitions, addPurchaseRequisition, approvePurchaseRequisition, projectJobs, currentUser } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');

  // Modals
  const [viewPR, setViewPR] = useState<PurchaseRequisition | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for Create PR Modal
  const [newJobId, setNewJobId] = useState(projectJobs[0]?.id || 'JOB-2026-001');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('High');
  const [newRequiredDate, setNewRequiredDate] = useState('2026-10-15');
  const [newRemarks, setNewRemarks] = useState('');

  const [itemsList, setItemsList] = useState<Partial<PRItem>[]>([
    {
      itemCode: 'RM-MS-12MM',
      itemName: 'IS 2062 Grade E250 MS Plate 12mm',
      specification: 'Size 2500x6000mm, Standard Make (TATA/SAIL)',
      category: 'Raw Material',
      unitOfMeasure: 'KG',
      requiredQuantity: 2500,
      estimatedUnitPrice: 68,
      estimatedTotalPrice: 170000,
      requiredByDate: '2026-10-15',
    },
  ]);

  const filteredPRs = purchaseRequisitions.filter(pr => {
    if (statusFilter !== 'ALL' && pr.status !== statusFilter) return false;
    if (projectFilter !== 'ALL' && pr.projectId !== projectFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        pr.prNumber.toLowerCase().includes(q) ||
        pr.jobId.toLowerCase().includes(q) ||
        pr.requestedBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddItemRow = () => {
    setItemsList(prev => [
      ...prev,
      {
        itemCode: '',
        itemName: '',
        specification: '',
        category: 'Raw Material',
        unitOfMeasure: 'NOS',
        requiredQuantity: 1,
        estimatedUnitPrice: 100,
        estimatedTotalPrice: 100,
        requiredByDate: newRequiredDate,
      },
    ]);
  };

  const handleRemoveItemRow = (idx: number) => {
    setItemsList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: keyof PRItem, val: any) => {
    setItemsList(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      if (field === 'requiredQuantity' || field === 'estimatedUnitPrice') {
        const qty = Number(updated[idx].requiredQuantity || 0);
        const price = Number(updated[idx].estimatedUnitPrice || 0);
        updated[idx].estimatedTotalPrice = qty * price;
      }
      return updated;
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedJobObj = projectJobs.find(j => j.id === newJobId);
    const projectId = selectedJobObj ? selectedJobObj.projectNumber : 'PRJ-2026-0001';

    const formattedItems: PRItem[] = itemsList.map((it, idx) => ({
      id: `PRI-MAN-${Date.now()}-${idx}`,
      prId: '',
      itemCode: it.itemCode || 'ITEM-NEW',
      itemName: it.itemName || 'New Item',
      specification: it.specification || '',
      category: (it.category as any) || 'Raw Material',
      unitOfMeasure: it.unitOfMeasure || 'NOS',
      requiredQuantity: Number(it.requiredQuantity || 1),
      estimatedUnitPrice: Number(it.estimatedUnitPrice || 0),
      estimatedTotalPrice: Number(it.estimatedTotalPrice || 0),
      requiredByDate: it.requiredByDate || newRequiredDate,
    }));

    const totalEstCost = formattedItems.reduce((sum, item) => sum + item.estimatedTotalPrice, 0);

    const newPR: PurchaseRequisition = {
      id: `PR-${Date.now()}`,
      prNumber: `PR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      projectId: projectId,
      jobId: newJobId,
      bomId: `BOM-${newJobId}`,
      bomRevision: 'REV-01',
      requisitionDate: new Date().toISOString().split('T')[0],
      requiredByDate: newRequiredDate,
      priority: newPriority,
      requestedBy: `${currentUser.firstName} ${currentUser.lastName}`,
      department: 'Purchase / Planning',
      status: 'Submitted',
      items: formattedItems,
      totalItems: formattedItems.length,
      estimatedCost: totalEstCost,
      remarks: newRemarks || 'Manual Requisition',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addPurchaseRequisition(newPR);
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-mono font-bold border border-blue-500/30">
              REQUISITIONS
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Purchase Requisition (PR) Register</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Internal material requests mapped to <code className="text-amber-300 font-mono">Project ID + Job Number</code> before RFQ issuance.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          Create Manual PR
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search PR No, Job ID, User..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 w-60"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Converted to RFQ">Converted to RFQ</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filteredPRs.length}</span> Purchase Requisitions
        </div>
      </div>

      {/* PR Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">PR Number</th>
                <th className="p-3">Project & Job Reference</th>
                <th className="p-3">Requisition Date</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Requested By</th>
                <th className="p-3 text-center">Items Count</th>
                <th className="p-3 text-right">Estimated Cost</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPRs.map(pr => (
                <tr key={pr.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-blue-400">{pr.prNumber}</td>
                  <td className="p-3">
                    <div className="font-bold text-amber-400">{pr.jobId}</div>
                    <div className="text-[10px] text-slate-400">{pr.projectId}</div>
                  </td>
                  <td className="p-3 text-slate-300 font-mono text-[11px]">{pr.requisitionDate}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pr.priority === 'Urgent' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      pr.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {pr.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-white">{pr.requestedBy}</div>
                    <div className="text-[10px] text-slate-400">{pr.department}</div>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-white">{pr.totalItems}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">
                    ₹{pr.estimatedCost.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                      pr.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                      pr.status === 'Submitted' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      pr.status === 'Converted to RFQ' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {pr.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewPR(pr)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="View PR Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {pr.status === 'Submitted' && (
                        <button
                          onClick={() => approvePurchaseRequisition(pr.id, `${currentUser.firstName} ${currentUser.lastName}`)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PR DETAIL MODAL */}
      {viewPR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-bold">
                  PURCHASE REQUISITION DETAILS
                </span>
                <h2 className="text-xl font-black text-white mt-1">{viewPR.prNumber}</h2>
              </div>
              <button
                onClick={() => setViewPR(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                <div>
                  <div className="text-slate-500">Project / Job Reference:</div>
                  <div className="font-bold text-amber-400">{viewPR.jobId} ({viewPR.projectId})</div>
                </div>
                <div>
                  <div className="text-slate-500">Requisition Date:</div>
                  <div className="font-semibold text-white">{viewPR.requisitionDate}</div>
                </div>
                <div>
                  <div className="text-slate-500">Required By:</div>
                  <div className="font-semibold text-white">{viewPR.requiredByDate}</div>
                </div>
                <div>
                  <div className="text-slate-500">Requested By:</div>
                  <div className="font-semibold text-white">{viewPR.requestedBy}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Requisitioned Line Items</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-950 text-slate-400">
                      <tr>
                        <th className="p-2.5">Item Code</th>
                        <th className="p-2.5">Item Name & Spec</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">Qty Required</th>
                        <th className="p-2.5 text-right">Est Unit Price</th>
                        <th className="p-2.5 text-right">Total Est</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {viewPR.items.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2.5 font-mono text-blue-400">{item.itemCode}</td>
                          <td className="p-2.5">
                            <div className="font-bold text-white">{item.itemName}</div>
                            <div className="text-[10px] text-slate-400">{item.specification}</div>
                          </td>
                          <td className="p-2.5">{item.category}</td>
                          <td className="p-2.5 text-right font-mono text-white">{item.requiredQuantity} {item.unitOfMeasure}</td>
                          <td className="p-2.5 text-right font-mono text-slate-300">₹{item.estimatedUnitPrice}</td>
                          <td className="p-2.5 text-right font-mono text-emerald-400 font-bold">₹{item.estimatedTotalPrice.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setViewPR(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MANUAL PR MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Create Manual Purchase Requisition</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Select Job</label>
                  <select
                    value={newJobId}
                    onChange={(e) => setNewJobId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  >
                    {projectJobs.map(job => (
                      <option key={job.id} value={job.id}>{job.jobNumber} - {job.productName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Required By Date</label>
                  <input
                    type="date"
                    value={newRequiredDate}
                    onChange={(e) => setNewRequiredDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white">Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-xs"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {itemsList.map((it, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Item Code"
                          value={it.itemCode}
                          onChange={(e) => handleItemChange(idx, 'itemCode', e.target.value)}
                          className="bg-slate-900 border border-slate-800 p-1.5 rounded text-white"
                        />
                        <input
                          type="text"
                          placeholder="Item Name"
                          value={it.itemName}
                          onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                          className="bg-slate-900 border border-slate-800 p-1.5 rounded text-white"
                        />
                        <input
                          type="text"
                          placeholder="Specification"
                          value={it.specification}
                          onChange={(e) => handleItemChange(idx, 'specification', e.target.value)}
                          className="bg-slate-900 border border-slate-800 p-1.5 rounded text-white"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={it.requiredQuantity}
                          onChange={(e) => handleItemChange(idx, 'requiredQuantity', Number(e.target.value))}
                          className="bg-slate-900 border border-slate-800 p-1.5 rounded text-white font-mono"
                        />
                        <input
                          type="text"
                          placeholder="UOM (e.g. KG, NOS)"
                          value={it.unitOfMeasure}
                          onChange={(e) => handleItemChange(idx, 'unitOfMeasure', e.target.value)}
                          className="bg-slate-900 border border-slate-800 p-1.5 rounded text-white"
                        />
                        <input
                          type="number"
                          placeholder="Est Unit Price"
                          value={it.estimatedUnitPrice}
                          onChange={(e) => handleItemChange(idx, 'estimatedUnitPrice', Number(e.target.value))}
                          className="bg-slate-900 border border-slate-800 p-1.5 rounded text-white font-mono"
                        />
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-emerald-400 font-bold">
                            ₹{((it.requiredQuantity || 0) * (it.estimatedUnitPrice || 0)).toLocaleString('en-IN')}
                          </span>
                          {itemsList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(idx)}
                              className="text-red-400 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Remarks</label>
                <textarea
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white h-16"
                  placeholder="Reason for requisition..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  Save Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
