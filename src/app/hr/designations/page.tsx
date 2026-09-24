'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  Briefcase,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Building,
  Layers,
  Award,
  Edit2,
  X,
} from 'lucide-react';
import { Designation } from '../../../types/hr';

export default function DesignationsPage() {
  const { designations, addDesignation, updateDesignation, departments } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    designationCode: '',
    designationName: '',
    department: 'Production',
    level: 4,
    reportingDesignation: 'General Manager',
    jobDescription: '',
    responsibilities: '',
  });

  const filteredDesignations = designations.filter(
    (d) =>
      d.designationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.designationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.designationName) return;

    addDesignation({
      designationCode: formData.designationCode || `DESG-0${designations.length + 1}`,
      designationName: formData.designationName,
      department: formData.department,
      level: Number(formData.level),
      reportingDesignation: formData.reportingDesignation,
      jobDescription: formData.jobDescription || 'Standard manufacturing role responsibilities.',
      responsibilities: formData.responsibilities.split(',').map((r) => r.trim()),
      status: 'Active',
    });

    setShowAddModal(false);
    setFormData({
      designationCode: '',
      designationName: '',
      department: 'Production',
      level: 4,
      reportingDesignation: 'General Manager',
      jobDescription: '',
      responsibilities: '',
    });
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-indigo-400" />
            Designation Master
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manufacturing Role Cadres, Hierarchy Levels, Responsibilities & Job Descriptions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
          >
            <Plus className="w-4 h-4" /> Add Designation
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search designations, code, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Total Designations Defined: <span className="text-indigo-400 font-bold">{designations.length}</span>
        </div>
      </div>

      {/* Designation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDesignations.map((desg) => (
          <div key={desg.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-4 shadow-lg hover:border-indigo-500/50 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20">
                  {desg.designationCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                  Level {desg.level} Cadre
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{desg.designationName}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>Department: {desg.department}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 space-y-1">
                <div className="font-semibold text-slate-400">Reporting Head:</div>
                <div className="text-slate-200">{desg.reportingDesignation || 'Direct to MD'}</div>
                <div className="font-semibold text-slate-400 pt-2">Role Summary:</div>
                <div className="text-slate-300 line-clamp-2">{desg.jobDescription}</div>
              </div>

              {desg.responsibilities && desg.responsibilities.length > 0 && (
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-400">Key Responsibilities:</div>
                  <div className="flex flex-wrap gap-1">
                    {desg.responsibilities.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[11px]">
                        • {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Status
              </span>
              <button
                onClick={() => alert(`Editing designation ${desg.designationName}`)}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Role
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Designation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" /> Define New Designation
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Designation Code</label>
                <input
                  type="text"
                  placeholder="e.g. DESG-CNC-SUP"
                  value={formData.designationCode}
                  onChange={(e) => setFormData({ ...formData, designationCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Designation Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CNC Machine Shop Supervisor"
                  value={formData.designationName}
                  onChange={(e) => setFormData({ ...formData, designationName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.departmentName}>
                        {d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cadre Level (1-7)</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reporting Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Production Manager"
                  value={formData.reportingDesignation}
                  onChange={(e) => setFormData({ ...formData, reportingDesignation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Job Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief role summary and shop floor expectations..."
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Key Responsibilities (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. CNC Program Loading, Safety Audit, Tooling Inspection"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">
                  Save Designation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
