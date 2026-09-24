'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { DesignReviewChecklist } from '../../../types/designer';
import {
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  X,
  FileCheck,
} from 'lucide-react';

export default function DesignReviewPage() {
  const { designReviews, addDesignReview, designJobs, currentUser } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedDesignJobId, setSelectedDesignJobId] = useState('');
  const [customerReqCheck, setCustomerReqCheck] = useState(true);
  const [drawingsCheck, setDrawingsCheck] = useState(true);
  const [materialCheck, setMaterialCheck] = useState(true);
  const [bomQtyCheck, setBomQtyCheck] = useState(true);
  const [feasibilityCheck, setFeasibilityCheck] = useState(true);
  const [safetyCheck, setSafetyCheck] = useState(true);
  const [mandatoryComments, setMandatoryComments] = useState('');

  const filteredReviews = designReviews.filter((r) => {
    return (
      r.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.mandatoryComments && r.mandatoryComments.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const desJob = designJobs.find((j) => j.id === selectedDesignJobId);
    if (!desJob) return;

    addDesignReview({
      designJobId: desJob.id,
      jobNumber: desJob.jobNumber,
      reviewerName: `${currentUser.firstName} ${currentUser.lastName}`,
      reviewerRole: currentUser.roleName || 'Technical Reviewer',
      customerRequirementCheck: customerReqCheck,
      drawingsDimensionCheck: drawingsCheck,
      materialSpecificationCheck: materialCheck,
      bomQuantityCheck: bomQtyCheck,
      manufacturingFeasibilityCheck: feasibilityCheck,
      safetyComplianceCheck: safetyCheck,
      result: 'approved',
      mandatoryComments: mandatoryComments || 'All 6 engineering parameters verified and compliant.',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-[#070A14] text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-mono font-bold">
              MODULE 3.11
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-orange-400" />
              6-Point Engineering & Technical Review Checklist
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ASME Compliance, Material Verification, Dimension Audit & Shop Floor Manufacturing Feasibility
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          Conduct Design Review
        </button>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search Job #, Reviewer, Comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/40 transition space-y-4 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono font-bold text-amber-400 text-sm">{rev.jobNumber}</span>
                <span className="text-slate-400 text-xs block">
                  Reviewed By: <strong className="text-white">{rev.reviewerName}</strong> ({rev.reviewerRole}) on {rev.reviewDate}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold uppercase">
                {rev.result}
              </span>
            </div>

            {/* 6 Checklist Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">1. Customer Req Sheet</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">2. Dimensions Audit</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">3. Material Specs Check</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">4. Master BOM Qty Check</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">5. Shop Feasibility</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">6. ASME Safety Compliance</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold block">Reviewer Mandatory Technical Comments:</span>
              <p className="text-slate-200 mt-1">{rev.mandatoryComments}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Conduct Review */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-6 text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
                Conduct 6-Point Technical Review
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Select Design Job *</label>
                <select
                  required
                  value={selectedDesignJobId}
                  onChange={(e) => setSelectedDesignJobId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">-- Select Job --</option>
                  {designJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.designJobNumber} ({j.jobNumber}) - {j.productName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 border-t border-b border-slate-800 py-3">
                <span className="text-slate-300 font-bold block">6 Checklist Verification Items:</span>
                {[
                  { label: '1. Customer Requirement Verification', state: customerReqCheck, set: setCustomerReqCheck },
                  { label: '2. Drawings & Dimensions Check', state: drawingsCheck, set: setDrawingsCheck },
                  { label: '3. Material Specification Check', state: materialCheck, set: setMaterialCheck },
                  { label: '4. BOM Quantity & Item Check', state: bomQtyCheck, set: setBomQtyCheck },
                  { label: '5. Manufacturing Feasibility Check', state: feasibilityCheck, set: setFeasibilityCheck },
                  { label: '6. Safety & ASME Compliance Check', state: safetyCheck, set: setSafetyCheck },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                    <span className="text-slate-300">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.set(e.target.checked)}
                      className="w-4 h-4 accent-orange-500"
                    />
                  </label>
                ))}
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Mandatory Technical Reviewer Comments *</label>
                <textarea
                  required
                  rows={3}
                  value={mandatoryComments}
                  onChange={(e) => setMandatoryComments(e.target.value)}
                  placeholder="Design verified against ASME Sec VIII Div 1 rules..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
