'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { UserPlus, Plus, CheckCircle2, Download, Search, X } from 'lucide-react';

export default function CandidateProfilesPage() {
  const { candidateProfiles, addCandidateProfile, updateCandidateStatus, jobPositions } = useERP();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    mobile: '',
    appliedPosition: jobPositions[0]?.title || 'CNC Machinist Operator',
    department: 'Production',
    experienceYears: 4,
    noticePeriodDays: 30,
    currentCTC: 360000,
    expectedCTC: 450000,
    resumeUrl: '/resumes/resume_candidate.pdf',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.candidateName) return;

    addCandidateProfile({
      candidateName: formData.candidateName,
      email: formData.email,
      mobile: formData.mobile,
      appliedPosition: formData.appliedPosition,
      department: formData.department,
      experienceYears: Number(formData.experienceYears),
      noticePeriodDays: Number(formData.noticePeriodDays),
      currentCTC: Number(formData.currentCTC),
      expectedCTC: Number(formData.expectedCTC),
      resumeUrl: formData.resumeUrl,
      status: 'Applied',
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UserPlus className="w-7 h-7 text-pink-400" />
            Candidate Applications & Pool Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Applicant Resume Database, Screening & Seamless 1-Click Conversion to Active Employee
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Add Candidate Profile
        </button>
      </div>

      {/* Candidates Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Code</th>
                <th className="p-4">Candidate Name</th>
                <th className="p-4">Position & Dept</th>
                <th className="p-4">Experience & Notice</th>
                <th className="p-4">Current vs Expected CTC</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {candidateProfiles.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-700/40 transition">
                  <td className="p-4 font-mono text-xs text-pink-400 font-bold">{cand.candidateCode}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{cand.candidateName}</div>
                    <div className="text-xs text-slate-400">{cand.email} | {cand.mobile}</div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-slate-200">
                    <div>{cand.appliedPosition}</div>
                    <div className="text-pink-400">{cand.department}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div>{cand.experienceYears} Yrs Exp</div>
                    <div className="text-slate-400">Notice: {cand.noticePeriodDays} Days</div>
                  </td>
                  <td className="p-4 text-xs font-mono">
                    <div className="text-slate-400">Cur: ₹{cand.currentCTC.toLocaleString()}</div>
                    <div className="text-emerald-400 font-bold">Exp: ₹{cand.expectedCTC.toLocaleString()}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        cand.status === 'Offered' || cand.status === 'Joined'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : cand.status === 'Shortlisted'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {cand.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {cand.status === 'Applied' && (
                      <button
                        onClick={() => updateCandidateStatus(cand.id, 'Shortlisted')}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded shadow transition"
                      >
                        Shortlist Candidate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-pink-400" /> Add Candidate Application
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pankaj Mehta"
                  value={formData.candidateName}
                  onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile</label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Applied Position</label>
                  <input
                    type="text"
                    value={formData.appliedPosition}
                    onChange={(e) => setFormData({ ...formData, appliedPosition: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-lg">
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
