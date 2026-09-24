'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { TechnicalDocumentItem } from '../../../types/designer';
import {
  FolderOpen,
  Plus,
  Search,
  Download,
  FileText,
  User,
  X,
  FileCode,
  Filter,
} from 'lucide-react';

export default function TechnicalDocumentsPage() {
  const { technicalDocuments, addTechnicalDocument, designJobs, currentUser } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedDesignJobId, setSelectedDesignJobId] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState<TechnicalDocumentItem['category']>('Calculation');

  const filteredDocs = technicalDocuments.filter((d) => {
    const matchSearch =
      d.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'all' || d.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const desJob = designJobs.find((j) => j.id === selectedDesignJobId);
    if (!desJob) return;

    addTechnicalDocument({
      documentName,
      category,
      version: 'v1.0',
      revision: 'REV-00',
      projectId: desJob.projectId,
      jobNumber: desJob.jobNumber,
      uploadedBy: `${currentUser.firstName} ${currentUser.lastName}`,
      fileUrl: '#',
      fileSize: '5.2 MB',
      accessPermission: 'public',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-[#070A14] text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
              MODULE 3.13
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <FolderOpen className="w-7 h-7 text-blue-400" />
              Technical Document & Engineering Calculation Vault
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ASME Calculations, FEA Reports, Component Datasheets, Operation Manuals & Safety Certificates
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search Document Name, Category, Job #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All 11 Document Categories</option>
          <option value="Calculation">Engineering Calculation</option>
          <option value="Datasheet">Component Datasheet</option>
          <option value="FEA Report">FEA Simulation Report</option>
          <option value="Operation Manual">Operation & Maintenance Manual</option>
          <option value="Certificate">Material Test Certificate</option>
          <option value="ASME Compliance">ASME Compliance Code</option>
        </select>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition space-y-3 shadow-xl relative"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-blue-400">{doc.id}</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                {doc.category}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-amber-400 font-mono font-bold block">JOB: {doc.jobNumber}</span>
              <h4 className="font-extrabold text-white text-xs truncate">{doc.documentName}</h4>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Version: {doc.version}</span>
                <span>Rev: {doc.revision}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Uploaded By: <strong className="text-slate-200">{doc.uploadedBy}</strong></span>
              <span className="font-mono text-cyan-400 font-bold">{doc.fileSize}</span>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => alert(`Downloading Technical Document ${doc.documentName}...`)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4 text-blue-400" />
                Download PDF ({doc.fileSize})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Upload Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-400" />
                Upload Technical Document
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Select Design Job *</label>
                <select
                  required
                  value={selectedDesignJobId}
                  onChange={(e) => setSelectedDesignJobId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Select Job --</option>
                  {designJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.designJobNumber} ({j.jobNumber}) - {j.productName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Document Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASME_Wall_Thickness_Calculation.pdf"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Document Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Calculation">Calculation</option>
                  <option value="Datasheet">Datasheet</option>
                  <option value="FEA Report">FEA Report</option>
                  <option value="Operation Manual">Operation Manual</option>
                  <option value="Certificate">Certificate</option>
                </select>
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
