'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useERP } from '../../../context/ERPContext';
import { api } from '../../../lib/apiClient';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  X,
  FileCheck,
  Building,
  Calendar,
  Layers,
  ChevronRight,
  ArrowRight,
  Trash2,
  CopySlash,
  Sparkles,
  RefreshCw,
  Package,
} from 'lucide-react';
import { PurchaseRequisition, PRItem } from '../../../types/purchase';

export default function PurchaseRequisitionPage() {
  const {
    purchaseRequisitions,
    addPurchaseRequisition,
    deletePurchaseRequisition,
    approvePurchaseRequisition,
    projectJobs,
    stockBalances,
    currentUser,
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [hideDuplicates, setHideDuplicates] = useState(true);

  // Modals
  const [viewPR, setViewPR] = useState<PurchaseRequisition | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [approvedPrModal, setApprovedPrModal] = useState<PurchaseRequisition | null>(null);

  // Loading & Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCleaningDuplicates, setIsCleaningDuplicates] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedbackToast({ type, message });
    setTimeout(() => setFeedbackToast(null), 6000);
  };

  // Form State for Create PR Modal
  const defaultRequiredDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }, []);

  const [newJobId, setNewJobId] = useState(projectJobs[0]?.id || 'JOB-2026-001');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('High');
  const [newRequiredDate, setNewRequiredDate] = useState(defaultRequiredDate);
  const [newRemarks, setNewRemarks] = useState('');

  const createInitialItem = (): Partial<PRItem> => ({
    itemCode: '',
    itemName: '',
    specification: '',
    category: 'Raw Material',
    unitOfMeasure: 'NOS',
    requiredQuantity: 1,
    estimatedUnitPrice: 0,
    estimatedTotalPrice: 0,
    requiredByDate: defaultRequiredDate,
  });

  const [itemsList, setItemsList] = useState<Partial<PRItem>[]>([createInitialItem()]);

  const openCreateModal = () => {
    setNewJobId(projectJobs[0]?.id || 'JOB-2026-001');
    setNewPriority('High');
    setNewRequiredDate(defaultRequiredDate);
    setNewRemarks('');
    setItemsList([createInitialItem()]);
    setShowCreateModal(true);
  };

  // Close modals on ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCreateModal) setShowCreateModal(false);
        if (viewPR) setViewPR(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCreateModal, viewPR]);

  // Base filtered list
  const filteredPRs = useMemo(() => {
    return (purchaseRequisitions || []).filter((pr) => {
      const prStatus = pr.status || (pr as any).approval_status || 'Submitted';
      const prProjId = pr.projectId || (pr as any).project_id || '';
      const prNum = pr.prNumber || (pr as any).pr_number || pr.id || '';
      const prJob = pr.jobId || (pr as any).job_code || (pr as any).jobNumber || '';
      const prReqBy = pr.requestedBy || (pr as any).requested_by || '';

      if (statusFilter !== 'ALL' && prStatus.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (projectFilter !== 'ALL' && prProjId !== projectFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          prNum.toLowerCase().includes(q) ||
          prJob.toLowerCase().includes(q) ||
          prReqBy.toLowerCase().includes(q) ||
          prProjId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [purchaseRequisitions, statusFilter, projectFilter, searchQuery]);

  // Duplicate analysis & deduplicated display list
  const { displayedPRs, duplicateCount, duplicateIds } = useMemo(() => {
    const seenFingerprints = new Map<string, string>(); // fingerprint -> primary PR id
    const dupIds = new Set<string>();

    (purchaseRequisitions || []).forEach((pr) => {
      const fp = `${pr.jobId || pr.projectId || 'JOB'}|${pr.requisitionDate || ''}|${pr.totalItems || pr.items?.length || 0}|${pr.estimatedCost || 0}`;
      if (seenFingerprints.has(fp)) {
        dupIds.add(pr.id);
      } else {
        seenFingerprints.set(fp, pr.id);
      }
    });

    let result = filteredPRs;
    if (hideDuplicates) {
      result = filteredPRs.filter((pr) => !dupIds.has(pr.id));
    }

    return {
      displayedPRs: result,
      duplicateCount: dupIds.size,
      duplicateIds: Array.from(dupIds),
    };
  }, [filteredPRs, purchaseRequisitions, hideDuplicates]);

  // Add Item Row
  const handleAddItemRow = () => {
    setItemsList((prev) => [
      ...prev,
      {
        itemCode: '',
        itemName: '',
        specification: '',
        category: 'Raw Material',
        unitOfMeasure: 'NOS',
        requiredQuantity: 1,
        estimatedUnitPrice: 0,
        estimatedTotalPrice: 0,
        requiredByDate: newRequiredDate,
      },
    ]);
  };

  // Remove Item Row
  const handleRemoveItemRow = (idx: number) => {
    setItemsList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Change Field
  const handleItemChange = (idx: number, field: keyof PRItem, val: any) => {
    setItemsList((prev) => {
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

  // Pick Item from Store Catalog to auto-fill
  const handleSelectStoreItem = (idx: number, itemCode: string) => {
    const found = (stockBalances || []).find((s) => s.itemCode === itemCode);
    if (!found) return;

    setItemsList((prev) => {
      const updated = [...prev];
      const qty = Number(updated[idx]?.requiredQuantity || 1);
      const price = Number(found.averageRate || found.averageUnitCost || 100);
      updated[idx] = {
        ...updated[idx],
        itemCode: found.itemCode,
        itemName: found.itemName,
        category: (found.category as any) || 'Raw Material',
        unitOfMeasure: found.uom || 'NOS',
        estimatedUnitPrice: price,
        estimatedTotalPrice: qty * price,
      };
      return updated;
    });
  };

  // Create Manual PR Submit handler
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one item has a code or name
    const validItems = itemsList.filter(
      (it) => (it.itemName?.trim() || it.itemCode?.trim()) && Number(it.requiredQuantity || 0) > 0
    );

    if (validItems.length === 0) {
      alert('Please provide at least one valid line item with an Item Name/Code and Quantity > 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedJobObj = projectJobs.find((j) => j.id === newJobId);
      const projectId = selectedJobObj ? selectedJobObj.projectNumber : 'PRJ-2026-0001';
      const jobNumber = selectedJobObj?.jobNumber || newJobId;

      const prId = `PR-${Date.now()}`;
      const prNumber = `PR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const formattedItems: PRItem[] = validItems.map((it, idx) => {
        const qty = Number(it.requiredQuantity || 1);
        const unitPrice = Number(it.estimatedUnitPrice || 0);
        return {
          id: `PRI-MAN-${Date.now()}-${idx + 1}`,
          prId: prId,
          itemCode: it.itemCode?.trim() || `ITEM-${String(idx + 1).padStart(3, '0')}`,
          itemName: it.itemName?.trim() || `Requisition Item ${idx + 1}`,
          specification: it.specification?.trim() || '',
          category: (it.category as any) || 'Raw Material',
          unitOfMeasure: it.unitOfMeasure?.trim() || 'NOS',
          requiredQuantity: qty,
          estimatedUnitPrice: unitPrice,
          estimatedTotalPrice: qty * unitPrice,
          requiredByDate: it.requiredByDate || newRequiredDate,
        };
      });

      const totalEstCost = formattedItems.reduce((sum, item) => sum + item.estimatedTotalPrice, 0);
      const reqBy = currentUser
        ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Purchase Officer'
        : 'Purchase / Planning';

      const newPR: PurchaseRequisition = {
        id: prId,
        prNumber: prNumber,
        projectId: projectId,
        jobId: newJobId,
        jobNumber: jobNumber,
        bomId: `BOM-${newJobId}`,
        bomRevision: 'REV-01',
        requisitionDate: new Date().toISOString().split('T')[0],
        requiredByDate: newRequiredDate,
        priority: newPriority,
        requestedBy: reqBy,
        department: 'Purchase / Planning',
        status: 'Submitted',
        items: formattedItems,
        totalItems: formattedItems.length,
        estimatedCost: totalEstCost,
        remarks: newRemarks?.trim() || 'Manual Requisition',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 1. Direct Backend API Call via apiClient to guarantee insertion into Django database table
      await api.purchase.requisitions.create(newPR);

      // 2. Add into Context & localStorage for reactive UI update
      addPurchaseRequisition(newPR);

      showToast(
        `Purchase Requisition ${newPR.prNumber} created and saved to database successfully! (${formattedItems.length} items, ₹ ${totalEstCost.toLocaleString('en-IN')})`,
        'success'
      );

      setShowCreateModal(false);
      setItemsList([createInitialItem()]);
      setNewRemarks('');
    } catch (err: any) {
      console.error('Failed to create PR:', err);
      showToast(`Error creating PR in database: ${err?.message || 'Network error'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Individual PR Row
  const handleDeletePR = async (prId: string, prNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete Purchase Requisition "${prNumber}" from the database?`)) {
      return;
    }
    setDeletingId(prId);
    try {
      await deletePurchaseRequisition(prId);
      showToast(`Purchase Requisition "${prNumber}" deleted from database.`, 'success');
    } catch (err: any) {
      console.error('Delete failed:', err);
      showToast(`Failed to delete PR: ${err?.message || 'Error'}`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // One-Click Clean Up Duplicate PRs from Database
  const handleCleanDuplicates = async () => {
    if (duplicateIds.length === 0) return;
    if (
      !window.confirm(
        `Found ${duplicateIds.length} duplicate Purchase Requisitions in the database. Are you sure you want to permanently remove all duplicate copies?`
      )
    ) {
      return;
    }

    setIsCleaningDuplicates(true);
    let successCount = 0;
    try {
      for (const dupId of duplicateIds) {
        try {
          await deletePurchaseRequisition(dupId);
          successCount++;
        } catch (_) {}
      }
      showToast(`Successfully removed ${successCount} duplicate Purchase Requisitions from database!`, 'success');
    } finally {
      setIsCleaningDuplicates(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#FAF7F2] text-[#544B45]">
      {/* Toast Notification */}
      {feedbackToast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold animate-in slide-in-from-top-3 ${
            feedbackToast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-red-50 text-red-900 border-red-300'
          }`}
        >
          {feedbackToast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedbackToast.message}</span>
          <button onClick={() => setFeedbackToast(null)} className="ml-2 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBE3DB]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-crm-brand-600/20 text-crm-brand-500 text-xs font-mono font-bold border border-crm-brand-600/30">
              REQUISITIONS
            </span>
            <h1 className="text-2xl font-black text-[#211B17] tracking-tight">Purchase Requisition (PR) Register</h1>
          </div>
          <p className="text-[#70665F] text-xs mt-1">
            Internal material requests mapped to <code className="text-amber-700 font-mono font-bold">Project ID + Job Number</code> before RFQ issuance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {duplicateCount > 0 && (
            <button
              onClick={handleCleanDuplicates}
              disabled={isCleaningDuplicates}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-500/30 font-bold text-xs rounded-xl transition"
              title="Clean up duplicate PR entries in the database"
            >
              {isCleaningDuplicates ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CopySlash className="w-3.5 h-3.5" />
              )}
              <span>Clean Duplicates ({duplicateCount})</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-crm-brand-700 hover:bg-crm-brand-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-crm-brand-700/30 transition"
          >
            <Plus className="w-4 h-4" />
            Create Manual PR
          </button>
        </div>
      </div>

      {/* Filter & Deduplication Controls */}
      <div className="bg-white border border-[#EBE3DB] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#70665F]" />
            <input
              type="text"
              placeholder="Search PR No, Job ID, User..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#211B17] focus:outline-none focus:border-crm-brand-600 w-60"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#70665F]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl px-3 py-1.5 text-xs text-[#211B17] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Converted to RFQ">Converted to RFQ</option>
            </select>
          </div>

          {/* Deduplication Toggle */}
          <button
            onClick={() => setHideDuplicates(!hideDuplicates)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              hideDuplicates
                ? 'bg-crm-brand-600/10 border-crm-brand-600/40 text-crm-brand-700 font-bold'
                : 'bg-[#FAF7F2] border-[#EBE3DB] text-[#70665F] hover:text-[#211B17]'
            }`}
            title="Toggle between hiding and showing duplicate requisitions"
          >
            <CopySlash className="w-3.5 h-3.5" />
            <span>{hideDuplicates ? 'Duplicates Hidden' : 'Show All Duplicates'}</span>
            {duplicateCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-800 font-mono">
                {duplicateCount}
              </span>
            )}
          </button>
        </div>

        <div className="text-xs text-[#70665F]">
          Showing <span className="text-[#211B17] font-bold">{displayedPRs.length}</span> Purchase Requisitions
          {hideDuplicates && duplicateCount > 0 && (
            <span className="text-amber-700 ml-1.5">({duplicateCount} duplicates filtered)</span>
          )}
        </div>
      </div>

      {/* PR Table */}
      <div className="bg-white border border-[#EBE3DB] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#544B45]">
            <thead className="bg-[#FAF7F2] text-[#70665F] font-semibold border-b border-[#EBE3DB]">
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
            <tbody className="divide-y divide-[#EBE3DB]">
              {displayedPRs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#70665F]">
                    No Purchase Requisitions match the selected filters.
                  </td>
                </tr>
              ) : (
                displayedPRs.map((pr) => {
                  const isRowDeleting = deletingId === pr.id;
                  return (
                    <tr key={pr.id} className="hover:bg-[#FAF7F2]/40 transition">
                      <td className="p-3 font-mono font-bold text-crm-brand-600">
                        <div className="flex items-center gap-1.5">
                          <span>{pr.prNumber}</span>
                          {duplicateIds.includes(pr.id) && !hideDuplicates && (
                            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-800 text-[10px] rounded font-mono font-semibold" title="Duplicate copy of another requisition">
                              DUP
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-amber-700">{pr.jobId}</div>
                        <div className="text-[10px] text-[#70665F]">{pr.projectId}</div>
                      </td>
                      <td className="p-3 text-[#544B45] font-mono text-[11px]">{pr.requisitionDate}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            pr.priority === 'Urgent'
                              ? 'bg-red-500/20 text-red-700 border border-red-500/30'
                              : pr.priority === 'High'
                              ? 'bg-amber-500/20 text-amber-800 border border-amber-500/30'
                              : 'bg-[#FAF7F2] text-[#544B45]'
                          }`}
                        >
                          {pr.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#211B17]">{pr.requestedBy || 'Purchase Officer'}</div>
                        <div className="text-[10px] text-[#70665F]">{pr.department || 'Purchase / Planning'}</div>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-[#211B17]">{pr.totalItems || pr.items?.length || 1}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        ₹{(pr.estimatedCost || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            pr.status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30'
                              : pr.status === 'Submitted'
                              ? 'bg-amber-500/20 text-amber-800 border-amber-500/30'
                              : pr.status === 'Converted to RFQ'
                              ? 'bg-crm-brand-600/20 text-crm-brand-800 border-crm-brand-600/30'
                              : 'bg-[#FAF7F2] text-[#70665F] border-[#EBE3DB]'
                          }`}
                        >
                          {pr.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View PR Details */}
                          <button
                            onClick={() => setViewPR(pr)}
                            className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EBE3DB] text-[#544B45] hover:text-[#211B17] transition"
                            title="View PR Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Approve PR */}
                          {pr.status === 'Submitted' && (
                            <button
                              onClick={() => {
                                const adminName = currentUser
                                  ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Super Admin'
                                  : 'Super Admin';
                                approvePurchaseRequisition(pr.id, adminName);
                                setApprovedPrModal(pr);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition"
                            >
                              Approve & Send RFQ
                            </button>
                          )}

                          {/* Verify Quotes link */}
                          {(pr.status === 'Approved' || pr.status === 'Converted to RFQ' || pr.status === 'Submitted') && (
                            <Link
                              href={`/purchase/quotation-verify?prNumber=${pr.prNumber}`}
                              className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 font-bold text-[10px] border border-amber-500/30 transition flex items-center gap-1"
                              title="Verify Vendor Quotations & Compare L1"
                            >
                              <span>Verify Quotes</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}

                          {/* Delete Requisition */}
                          <button
                            onClick={() => handleDeletePR(pr.id, pr.prNumber)}
                            disabled={isRowDeleting}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                            title={`Delete ${pr.prNumber} from database`}
                          >
                            {isRowDeleting ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVE & RFQ DISPATCHED MODAL */}
      {approvedPrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EBE3DB] rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBE3DB] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-base font-black text-[#211B17]">
                    PR Approved & RFQ Dispatched to 4 Vendors!
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">
                    {approvedPrModal.prNumber} • {approvedPrModal.jobId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setApprovedPrModal(null)}
                className="p-1 rounded-lg text-[#70665F] hover:text-[#211B17] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EBE3DB] space-y-2 text-xs">
              <div className="text-[#70665F]">
                RFQ enquiry emails have been dispatched to 4 approved vendors for <strong className="text-[#211B17]">{approvedPrModal.items?.length || 2} shortage line items</strong>:
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-[#211B17]">
                <div className="p-2 bg-white rounded-lg border border-[#EBE3DB]">1. Tata Steel BSL Ltd.</div>
                <div className="p-2 bg-white rounded-lg border border-[#EBE3DB]">2. Jindal Stainless Ltd.</div>
                <div className="p-2 bg-white rounded-lg border border-[#EBE3DB]">3. Apex Fasteners & Flanges</div>
                <div className="p-2 bg-white rounded-lg border border-[#EBE3DB]">4. Steel Authority of India (SAIL)</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
              Quotes from all 4 vendors are available for verification. Review their bids, select the L1 lowest rate, and issue the PO.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBE3DB]">
              <button
                onClick={() => setApprovedPrModal(null)}
                className="px-4 py-2 bg-white border border-[#EBE3DB] text-[#211B17] font-bold text-xs rounded-xl hover:bg-[#FAF7F2]"
              >
                Close
              </button>
              <Link
                href={`/purchase/quotation-verify?prNumber=${approvedPrModal.prNumber}`}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>Go to Vendor Quotation Verify</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PR DETAIL MODAL */}
      {viewPR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#EBE3DB] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-[#FAF7F2] border-b border-[#EBE3DB] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono bg-crm-brand-600/20 text-crm-brand-700 px-2 py-0.5 rounded border border-crm-brand-600/30 font-bold">
                  PURCHASE REQUISITION DETAILS
                </span>
                <h2 className="text-xl font-black text-[#211B17] mt-1">{viewPR.prNumber}</h2>
              </div>
              <button
                onClick={() => setViewPR(null)}
                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EBE3DB] text-[#70665F] hover:text-[#211B17] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#FAF7F2] rounded-xl border border-[#EBE3DB] text-xs">
                <div>
                  <div className="text-[#70665F]">Project / Job Reference:</div>
                  <div className="font-bold text-amber-700">{viewPR.jobId} ({viewPR.projectId})</div>
                </div>
                <div>
                  <div className="text-[#70665F]">Requisition Date:</div>
                  <div className="font-semibold text-[#211B17]">{viewPR.requisitionDate}</div>
                </div>
                <div>
                  <div className="text-[#70665F]">Required By:</div>
                  <div className="font-semibold text-[#211B17]">{viewPR.requiredByDate}</div>
                </div>
                <div>
                  <div className="text-[#70665F]">Requested By:</div>
                  <div className="font-semibold text-[#211B17]">{viewPR.requestedBy || 'Purchase Officer'}</div>
                </div>
              </div>

              {viewPR.remarks && (
                <div className="p-3 bg-white border border-[#EBE3DB] rounded-xl text-xs">
                  <span className="font-bold text-[#70665F]">Remarks: </span>
                  <span className="text-[#211B17]">{viewPR.remarks}</span>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-[#211B17] uppercase tracking-wider mb-2">Requisitioned Line Items</h4>
                <div className="border border-[#EBE3DB] rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left text-[#544B45]">
                    <thead className="bg-[#FAF7F2] text-[#70665F]">
                      <tr>
                        <th className="p-2.5">Item Code</th>
                        <th className="p-2.5">Item Name & Spec</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">Qty Required</th>
                        <th className="p-2.5 text-right">Est Unit Price</th>
                        <th className="p-2.5 text-right">Total Est</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE3DB]">
                      {(viewPR.items || []).map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="p-2.5 font-mono text-crm-brand-600 font-bold">{item.itemCode}</td>
                          <td className="p-2.5">
                            <div className="font-bold text-[#211B17]">{item.itemName}</div>
                            {item.specification && (
                              <div className="text-[10px] text-[#70665F]">{item.specification}</div>
                            )}
                          </td>
                          <td className="p-2.5">{item.category || 'Raw Material'}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-[#211B17]">
                            {item.requiredQuantity} {item.unitOfMeasure}
                          </td>
                          <td className="p-2.5 text-right font-mono text-[#544B45]">₹{(item.estimatedUnitPrice || 0).toLocaleString('en-IN')}</td>
                          <td className="p-2.5 text-right font-mono text-emerald-700 font-bold">
                            ₹{((item.estimatedTotalPrice || (item.requiredQuantity * item.estimatedUnitPrice)) || 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#FAF7F2] font-bold border-t border-[#EBE3DB]">
                      <tr>
                        <td colSpan={5} className="p-2.5 text-right text-[#211B17]">
                          Total Estimated Value:
                        </td>
                        <td className="p-2.5 text-right text-emerald-700 font-mono text-sm">
                          ₹{(viewPR.estimatedCost || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] border-t border-[#EBE3DB] flex justify-end gap-2">
              <button
                onClick={() => setViewPR(null)}
                className="px-4 py-2 bg-white border border-[#EBE3DB] hover:bg-[#EBE3DB] text-[#211B17] font-bold text-xs rounded-xl transition"
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
          <div className="bg-white border border-[#EBE3DB] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-[#FAF7F2] border-b border-[#EBE3DB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-crm-brand-600" />
                <h2 className="text-lg font-black text-[#211B17]">Create Manual Purchase Requisition</h2>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-[#70665F] hover:text-[#211B17]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#70665F] font-semibold mb-1">Select Job</label>
                  <select
                    value={newJobId}
                    onChange={(e) => setNewJobId(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl p-2 text-[#211B17] focus:outline-none focus:border-crm-brand-600"
                  >
                    {projectJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.jobNumber} — {job.customerName ? `[${job.customerName}] ` : ''}
                        {job.productName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#70665F] font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl p-2 text-[#211B17] focus:outline-none focus:border-crm-brand-600"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#70665F] font-semibold mb-1">Required By Date</label>
                  <input
                    type="date"
                    value={newRequiredDate}
                    onChange={(e) => setNewRequiredDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl p-2 text-[#211B17] focus:outline-none focus:border-crm-brand-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#211B17]">Line Items ({itemsList.length})</span>
                    <span className="text-[11px] text-[#70665F]">
                      (Add multiple items manually or quick-fill from store inventory)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="flex items-center gap-1 px-3 py-1 bg-crm-brand-600/10 hover:bg-crm-brand-600/20 text-crm-brand-700 rounded-lg text-xs font-bold border border-crm-brand-600/30 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item Row</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {itemsList.map((it, idx) => (
                    <div key={idx} className="p-3 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-[#EBE3DB]/60">
                        <span className="font-bold text-[#70665F]">Item #{idx + 1}</span>
                        {/* Quick pick from Store stockBalances */}
                        {stockBalances && stockBalances.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[#70665F]">Quick Pick:</span>
                            <select
                              onChange={(e) => handleSelectStoreItem(idx, e.target.value)}
                              defaultValue=""
                              className="bg-white border border-[#EBE3DB] rounded-lg px-2 py-0.5 text-[11px] text-[#211B17] focus:outline-none focus:border-crm-brand-600 cursor-pointer"
                            >
                              <option value="">-- Select from Store Inventory --</option>
                              {stockBalances.slice(0, 30).map((s) => (
                                <option key={s.id} value={s.itemCode}>
                                  {s.itemCode} • {s.itemName} ({s.usableQty} {s.uom})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#70665F] mb-0.5">Item Code</label>
                          <input
                            type="text"
                            placeholder="e.g. RAW-MS-12MM"
                            value={it.itemCode}
                            onChange={(e) => handleItemChange(idx, 'itemCode', e.target.value)}
                            className="w-full bg-white border border-[#EBE3DB] p-1.5 rounded-lg text-[#211B17] font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#70665F] mb-0.5">Item Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Mild Steel Plate 12mm"
                            value={it.itemName}
                            onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                            required
                            className="w-full bg-white border border-[#EBE3DB] p-1.5 rounded-lg text-[#211B17]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#70665F] mb-0.5">Specification / Grade</label>
                          <input
                            type="text"
                            placeholder="e.g. Grade E250 / IS 2062"
                            value={it.specification}
                            onChange={(e) => handleItemChange(idx, 'specification', e.target.value)}
                            className="w-full bg-white border border-[#EBE3DB] p-1.5 rounded-lg text-[#211B17]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                        <div>
                          <label className="block text-[10px] text-[#70665F] mb-0.5">Quantity *</label>
                          <input
                            type="number"
                            min="1"
                            step="any"
                            placeholder="Quantity"
                            value={it.requiredQuantity}
                            onChange={(e) =>
                              handleItemChange(
                                idx,
                                'requiredQuantity',
                                e.target.value === '' ? '' : Number(e.target.value)
                              )
                            }
                            required
                            className="w-full bg-white border border-[#EBE3DB] p-1.5 rounded-lg text-[#211B17] font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#70665F] mb-0.5">UOM (Unit)</label>
                          <input
                            type="text"
                            placeholder="NOS, KG, MTR"
                            value={it.unitOfMeasure}
                            onChange={(e) => handleItemChange(idx, 'unitOfMeasure', e.target.value)}
                            className="w-full bg-white border border-[#EBE3DB] p-1.5 rounded-lg text-[#211B17]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#70665F] mb-0.5">Est Rate (₹)</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="Price per unit"
                            value={it.estimatedUnitPrice}
                            onChange={(e) =>
                              handleItemChange(
                                idx,
                                'estimatedUnitPrice',
                                e.target.value === '' ? '' : Number(e.target.value)
                              )
                            }
                            className="w-full bg-white border border-[#EBE3DB] p-1.5 rounded-lg text-[#211B17] font-mono"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-3">
                          <div>
                            <span className="block text-[10px] text-[#70665F]">Row Total:</span>
                            <span className="font-mono text-emerald-700 font-bold text-xs">
                              ₹
                              {(
                                Number(it.requiredQuantity || 0) * Number(it.estimatedUnitPrice || 0)
                              ).toLocaleString('en-IN')}
                            </span>
                          </div>
                          {itemsList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(idx)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal Banner */}
                <div className="mt-3 p-3 bg-white border border-[#EBE3DB] rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-[#70665F]">
                    Total Items: <strong className="text-[#211B17]">{itemsList.length}</strong>
                  </span>
                  <span className="font-bold text-xs">
                    Total Estimated Cost:{' '}
                    <strong className="text-emerald-700 font-mono text-sm ml-1">
                      ₹
                      {itemsList
                        .reduce(
                          (sum, it) =>
                            sum + Number(it.requiredQuantity || 0) * Number(it.estimatedUnitPrice || 0),
                          0
                        )
                        .toLocaleString('en-IN')}
                    </strong>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#70665F] font-semibold mb-1">Remarks</label>
                <textarea
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl p-2 text-[#211B17] h-16 focus:outline-none focus:border-crm-brand-600"
                  placeholder="Reason for requisition, technical specs, urgency..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[#EBE3DB]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#EBE3DB] text-[#211B17] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 bg-crm-brand-700 hover:bg-crm-brand-600 text-white font-bold rounded-xl shadow-lg shadow-crm-brand-700/20 disabled:opacity-50 transition"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Requisition</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
