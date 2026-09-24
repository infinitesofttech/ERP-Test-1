'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Briefcase, Plus, CheckCircle2, Building, DollarSign, X } from 'lucide-react';

export default function JobPositionsPage() {
  const { jobPositions, addJobPosition, updateJobPositionStatus, departments } = useERP();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    positionCode: '',
    title: '',
    department: 'Production',
    designation: 'CNC Machinist Operator',
    vacancies: 2,
    experienceRequired: '3-5 Years Shop Floor',
    salaryMin: 25000,
    salaryMax: 35000,
    jobDescription: 'Fanuc & Siemens CNC Turning lathe setup, tool offset calibration and production target execution.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    addJobPosition({
      positionCode: formData.positionCode || `JOB-POS-0${jobPositions.length + 1}`,
      title: formData.title,
      department: formData.department,
      designation: formData.designation,
      vacancies: Number(formData.vacancies),
      experienceRequired: formData.experienceRequired,
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
      jobDescription: formData.jobDescription,
      status: 'Open',
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-cyan-400" />
            Job Positions & Open Vacancies Master
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Plant Requisitions, Experience Criteria, Job Descriptions & Budgeted Salary Ranges
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Create Job Opening
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobPositions.map((pos) => (
          <div key={pos.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-4 shadow-lg hover:border-cyan-500/40 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">{pos.positionCode}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    pos.status === 'Open'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {pos.status} ({pos.vacancies} Vacancies)
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{pos.title}</h3>
                <div className="text-xs text-slate-400 mt-0.5">Dept: <strong className="text-slate-200">{pos.department}</strong></div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 space-y-1.5 text-xs text-slate-300">
                <div><strong className="text-slate-400">Experience:</strong> {pos.experienceRequired}</div>
                <div><strong className="text-slate-400">Budgeted Salary:</strong> <span className="text-emerald-400 font-bold">₹{pos.salaryMin.toLocaleString()} - ₹{pos.salaryMax.toLocaleString()} / mo</span></div>
                <div className="text-slate-300 pt-1 italic line-clamp-2">&quot;{pos.jobDescription}&quot;</div>
              </div>
            </div>

            {pos.status === 'Open' && (
              <div className="pt-2 border-t border-slate-700/50 text-right">
                <button
                  onClick={() => updateJobPositionStatus(pos.id, 'Closed')}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded transition"
                >
                  Close Position
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" /> Create Job Opening Requisition
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Position Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Hydraulic Assembly Technician"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <label className="block text-slate-400 mb-1">No. of Vacancies</label>
                  <input
                    type="number"
                    value={formData.vacancies}
                    onChange={(e) => setFormData({ ...formData, vacancies: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Min Salary (₹)</label>
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({ ...formData, salaryMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Max Salary (₹)</label>
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({ ...formData, salaryMax: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Job Description</label>
                <textarea
                  rows={2}
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg">
                  Publish Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
