'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Sparkles, Plus, Calendar, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export default function HolidayCalendarPage() {
  const { holidays, addHoliday, departments } = useERP();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    holidayName: '',
    date: new Date().toISOString().split('T')[0],
    holidayType: 'Public Holiday' as const,
    location: 'All Plants (Ahmedabad GIDC)',
    isOptional: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.holidayName) return;

    addHoliday({
      holidayName: formData.holidayName,
      date: formData.date,
      holidayType: formData.holidayType,
      location: formData.location,
      applicableDepartments: ['All Departments'],
      isOptional: formData.isOptional,
      status: 'Active',
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-amber-400" />
            Company & Financial Year Holiday Calendar (FY 2026-27)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Official Public Holidays, Plant Maintenance Shutdowns, Festival Breaks & Optional Holiday Roster
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Add Holiday Entry
        </button>
      </div>

      {/* Holiday List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {holidays.map((hol) => (
          <div key={hol.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-3 shadow-lg hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400">{hol.id}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                {hol.holidayType}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{hol.holidayName}</h3>
              <div className="text-sm font-extrabold text-amber-400 mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" /> {hol.date}
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 space-y-1 text-xs text-slate-300">
              <div><strong className="text-slate-400">Location:</strong> {hol.location}</div>
              <div><strong className="text-slate-400">Applicable:</strong> {hol.applicableDepartments.join(', ')}</div>
              {hol.isOptional && <div className="text-purple-400 font-bold">* Optional Holiday Choice</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Add Holiday Entry
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Holiday Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Plant Holiday"
                  value={formData.holidayName}
                  onChange={(e) => setFormData({ ...formData, holidayName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Holiday Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Holiday Type</label>
                  <select
                    value={formData.holidayType}
                    onChange={(e) => setFormData({ ...formData, holidayType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Public Holiday">Public Holiday</option>
                    <option value="Company Holiday">Company Holiday</option>
                    <option value="Festival">Festival</option>
                    <option value="Optional Holiday">Optional Holiday</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg">
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
