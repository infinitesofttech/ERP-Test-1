'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Drawing2D } from '../../../types/designer';
import {
  FileCheck,
  Plus,
  Search,
  Eye,
  Download,
  FileCode,
  CheckCircle2,
  Clock,
  User,
  X,
  Layers,
  Filter,
} from 'lucide-react';

export default function Drawings2DPage() {
  const { drawings2D, addDrawing2D, designJobs, currentUser } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing2D | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Upload Form
  const [selectedDesignJobId, setSelectedDesignJobId] = useState('');
  const [drawingNumber, setDrawingNumber] = useState('');
  const [drawingTitle, setDrawingTitle] = useState('');
  const [category, setCategory] = useState<Drawing2D['category']>('GA');
  const [fileFormat, setFileFormat] = useState<Drawing2D['fileFormat']>('DWG');
  const [sheetSize, setSheetSize] = useState<Drawing2D['sheetSize']>('A1');
  const [scale, setScale] = useState('1:20');

  const filteredDrawings = drawings2D.filter((d) => {
    const matchSearch =
      d.drawingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.drawingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.jobNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'all' || d.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const desJob = designJobs.find((j) => j.id === selectedDesignJobId);
    if (!desJob) return;

    addDrawing2D({
      designJobId: desJob.id,
      projectId: desJob.projectId,
      jobNumber: desJob.jobNumber,
      drawingNumber: drawingNumber || `GA-${desJob.jobNumber}-01`,
      drawingTitle,
      category,
      revisionNumber: 'REV-00',
      fileFormat,
      fileSize: '4.5 MB',
      fileUrl: '#',
      drawnBy: `${currentUser.firstName} ${currentUser.lastName}`,
      checkedBy: 'Rajesh Patel',
      approvedBy: 'Rajesh Patel',
      approvalStatus: 'approved',
      sheetSize,
      scale,
      isLatest: true,
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
              MODULE 3.4
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <FileCheck className="w-7 h-7 text-blue-400" />
              2D CAD Drawings Vault (DWG / DXF / PDF)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            General Arrangement (GA), Fabrication Layouts, Nozzle Orientation & Electrical Schematics
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          Upload 2D Drawing
        </button>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search Drawing #, Title, Job #..."
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
          <option value="all">All Drawing Types</option>
          <option value="GA">General Arrangement (GA)</option>
          <option value="Fabrication">Fabrication Drawing</option>
          <option value="P&ID">P&ID Diagram</option>
          <option value="Electrical">Electrical Schematic</option>
          <option value="Layout">Plant Layout</option>
        </select>
      </div>

      {/* Drawings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrawings.map((drw) => (
          <div
            key={drw.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition space-y-3 shadow-xl relative group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-blue-400">{drw.drawingNumber}</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                {drw.revisionNumber}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>JOB REF: <strong className="text-amber-400">{drw.jobNumber}</strong></span>
                <span>FMT: <strong className="text-cyan-300">{drw.fileFormat}</strong></span>
              </div>
              <h4 className="font-extrabold text-white text-sm">{drw.drawingTitle}</h4>
              <p className="text-[11px] text-slate-400">Category: {drw.category} | Scale: {drw.scale}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Drawn By: <strong className="text-slate-200">{drw.drawnBy}</strong></span>
              <span className="font-mono text-emerald-400 font-bold">Size: {drw.fileSize}</span>
            </div>

            {/* Action buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDrawing(drw)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Eye className="w-4 h-4 text-blue-400" />
                CAD Blueprint Viewer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CAD Viewer Simulation Modal */}
      {selectedDrawing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl space-y-4 p-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono font-bold text-blue-400 text-sm">{selectedDrawing.drawingNumber} ({selectedDrawing.revisionNumber})</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">{selectedDrawing.drawingTitle}</h3>
              </div>
              <button onClick={() => setSelectedDrawing(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Technical CAD Viewer Canvas */}
            <div className="w-full h-80 bg-[#060A14] border-2 border-blue-500/30 rounded-xl relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
              <FileCode className="w-16 h-16 text-blue-400/60 mb-3 animate-pulse" />
              <div className="relative z-10 space-y-1">
                <h4 className="font-mono font-bold text-white text-sm">AUTOCAD 2D VECTOR BLUEPRINT PREVIEW</h4>
                <p className="text-slate-400 text-xs font-mono">Drawing No: {selectedDrawing.drawingNumber} | Format: {selectedDrawing.fileFormat} | Sheet: {selectedDrawing.sheetSize}</p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[10px]">
                  <span>Checked & Verified for ASME Sec VIII Compliance</span>
                </div>
              </div>

              {/* Title Block Box Bottom Right */}
              <div className="absolute bottom-2 right-2 bg-slate-950/90 border border-slate-700 p-2 rounded text-left font-mono text-[9px] text-slate-300">
                <div>UMA TECHNO FAB MFG ERP</div>
                <div className="text-cyan-400 font-bold">DRW: {selectedDrawing.drawingNumber}</div>
                <div>SCALE: {selectedDrawing.scale} | REV: {selectedDrawing.revisionNumber}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 font-mono">Job Ref: {selectedDrawing.jobNumber}</span>
              <button
                onClick={() => alert(`Downloading CAD Vector Blueprint ${selectedDrawing.drawingNumber}.${selectedDrawing.fileFormat.toLowerCase()}...`)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download {selectedDrawing.fileFormat} File ({selectedDrawing.fileSize})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload 2D Drawing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-400" />
                Upload 2D CAD Blueprint
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
                <label className="text-slate-300 font-bold block mb-1">Drawing Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GA Drawing - 10,000L Reaction Vessel"
                  value={drawingTitle}
                  onChange={(e) => setDrawingTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="GA">GA Drawing</option>
                    <option value="Fabrication">Fabrication</option>
                    <option value="P&ID">P&ID</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Layout">Plant Layout</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">File Format</label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  >
                    <option value="DWG">DWG (AutoCAD)</option>
                    <option value="DXF">DXF Vector</option>
                    <option value="PDF">PDF Print</option>
                  </select>
                </div>
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
                  Upload Drawing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
