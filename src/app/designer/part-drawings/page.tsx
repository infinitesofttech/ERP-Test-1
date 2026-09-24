'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { PartDrawing } from '../../../types/designer';
import {
  CheckSquare,
  Plus,
  Search,
  Eye,
  Download,
  Filter,
  X,
  FileCode,
} from 'lucide-react';

export default function PartDrawingsPage() {
  const { partDrawings, addPartDrawing, designJobs, currentUser } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('all');
  const [selectedPart, setSelectedPart] = useState<PartDrawing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedDesignJobId, setSelectedDesignJobId] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [partName, setPartName] = useState('');
  const [classification, setClassification] = useState<PartDrawing['classification']>('manufactured');
  const [materialGrade, setMaterialGrade] = useState('SS 316L');
  const [rawMaterialSpec, setRawMaterialSpec] = useState('75mm Solid Round Bar');
  const [finishRequirement, setFinishRequirement] = useState('Electro-polished Ra 0.4 µm');

  const filteredParts = partDrawings.filter((p) => {
    const matchSearch =
      p.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.jobNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = classificationFilter === 'all' || p.classification === classificationFilter;
    return matchSearch && matchClass;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const desJob = designJobs.find((j) => j.id === selectedDesignJobId);
    if (!desJob) return;

    addPartDrawing({
      designJobId: desJob.id,
      projectId: desJob.projectId,
      jobNumber: desJob.jobNumber,
      partNumber: partNumber || `PRT-${desJob.jobNumber}-01`,
      partName,
      classification,
      materialGrade,
      rawMaterialSpec,
      finishRequirement,
      tolerances: '± 0.05 mm ISO 2768-m',
      heatTreatment: 'Solution Annealed',
      revisionNumber: 'REV-00',
      fileFormat: 'DWG',
      fileSize: '3.2 MB',
      fileUrl: '#',
      drawnBy: `${currentUser.firstName} ${currentUser.lastName}`,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-[#070A14] text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-mono font-bold">
              MODULE 3.7
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <CheckSquare className="w-7 h-7 text-teal-400" />
              Machine Component Part Drawings Vault
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manufacturing Component Drawings, Material Grades, Tolerances, Heat Treatment & Surface Finish Specs
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          Add Part Drawing
        </button>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search Part #, Part Name, Job #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <select
          value={classificationFilter}
          onChange={(e) => setClassificationFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
        >
          <option value="all">All Classifications</option>
          <option value="manufactured">In-House Manufactured</option>
          <option value="fabricated">Fabricated Component</option>
          <option value="purchased">Bought-Out / Purchased</option>
          <option value="standard">Standard Hardware</option>
        </select>
      </div>

      {/* Part Drawings Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <th className="p-3">Part Number</th>
              <th className="p-3">Job Reference</th>
              <th className="p-3">Part Name</th>
              <th className="p-3">Classification</th>
              <th className="p-3">Material Grade</th>
              <th className="p-3">Raw Spec</th>
              <th className="p-3">Finish / Ra</th>
              <th className="p-3">Revision</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredParts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/40 transition">
                <td className="p-3 font-mono font-bold text-teal-400">{p.partNumber}</td>
                <td className="p-3 font-mono text-amber-400 font-bold">{p.jobNumber}</td>
                <td className="p-3 font-bold text-white">{p.partName}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      p.classification === 'manufactured'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : p.classification === 'fabricated'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {p.classification}
                  </span>
                </td>
                <td className="p-3 text-slate-300 font-mono">{p.materialGrade}</td>
                <td className="p-3 text-slate-400">{p.rawMaterialSpec || '-'}</td>
                <td className="p-3 text-cyan-300 font-mono text-[11px]">{p.finishRequirement || '-'}</td>
                <td className="p-3 font-mono font-bold text-cyan-400">{p.revisionNumber}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedPart(p)}
                    className="px-2.5 py-1 rounded-lg bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white font-semibold transition"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Part Details Modal */}
      {selectedPart && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-4 p-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono font-bold text-teal-400 text-sm">{selectedPart.partNumber}</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">{selectedPart.partName}</h3>
              </div>
              <button onClick={() => setSelectedPart(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-slate-300">
              <div>Job Ref: <strong className="text-amber-400">{selectedPart.jobNumber}</strong></div>
              <div>Classification: <strong className="text-teal-300 uppercase">{selectedPart.classification}</strong></div>
              <div>Material Grade: <strong className="text-white">{selectedPart.materialGrade}</strong></div>
              <div>Tolerances: <strong className="text-cyan-300">{selectedPart.tolerances || 'Standard'}</strong></div>
              <div>Surface Finish: <strong className="text-emerald-300">{selectedPart.finishRequirement || 'Standard'}</strong></div>
              <div>Heat Treatment: <strong className="text-slate-200">{selectedPart.heatTreatment || 'N/A'}</strong></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedPart(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Part */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-teal-400" />
                Add Machine Part Drawing
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
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
                <label className="text-slate-300 font-bold block mb-1">Part Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agitator Solid Shaft 75mm"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Classification</label>
                  <select
                    value={classification}
                    onChange={(e) => setClassification(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="manufactured">Manufactured</option>
                    <option value="fabricated">Fabricated</option>
                    <option value="purchased">Purchased</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Material Grade</label>
                  <input
                    type="text"
                    value={materialGrade}
                    onChange={(e) => setMaterialGrade(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
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
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Save Part Drawing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
