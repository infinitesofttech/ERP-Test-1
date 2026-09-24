'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Layers, Plus, Clock, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export default function ShiftManagementPage() {
  const { shiftMasters, addShiftMaster, updateShiftMaster } = useERP();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    shiftName: '',
    startTime: '09:00',
    endTime: '18:00',
    gracePeriodMinutes: 15,
    breakDurationMinutes: 60,
    lateRule: '3 Late Check-ins = 0.5 Day Leave Deduction',
    earlyCheckoutRule: 'Requires Manager Pre-approval',
    overtimeRule: 'Beyond 8 Working Hours (1.5x Multiplier)',
    weeklyOff: 'Sunday' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shiftName) return;

    addShiftMaster({
      shiftName: formData.shiftName,
      startTime: formData.startTime,
      endTime: formData.endTime,
      gracePeriodMinutes: Number(formData.gracePeriodMinutes),
      breakDurationMinutes: Number(formData.breakDurationMinutes),
      lateRule: formData.lateRule,
      earlyCheckoutRule: formData.earlyCheckoutRule,
      overtimeRule: formData.overtimeRule,
      weeklyOff: formData.weeklyOff,
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
            <Layers className="w-7 h-7 text-sky-400" />
            Shift Master Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manufacturing Plant Shift Timings, Grace Period Rules, Overtime Multipliers & Weekly Off Configuration
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Define New Shift
        </button>
      </div>

      {/* Shift Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shiftMasters.map((shift) => (
          <div key={shift.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-4 shadow-lg hover:border-sky-500/50 transition">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-400">{shift.id}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                {shift.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{shift.shiftName}</h3>
              <div className="text-lg font-extrabold text-sky-400 mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> {shift.startTime} — {shift.endTime}
              </div>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Grace Period:</span>
                <span className="font-bold text-amber-400">{shift.gracePeriodMinutes} Mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lunch / Tea Break:</span>
                <span className="font-bold text-slate-200">{shift.breakDurationMinutes} Mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Weekly Off:</span>
                <span className="font-bold text-purple-400">{shift.weeklyOff}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div><strong className="text-slate-400">Late Rule:</strong> {shift.lateRule}</div>
              <div><strong className="text-slate-400">Overtime Rule:</strong> {shift.overtimeRule}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-400" /> Configure Shift Master
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Shift Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CNC Night Shift (20:00 - 05:00)"
                  value={formData.shiftName}
                  onChange={(e) => setFormData({ ...formData, shiftName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Grace Period (Mins)</label>
                  <input
                    type="number"
                    value={formData.gracePeriodMinutes}
                    onChange={(e) => setFormData({ ...formData, gracePeriodMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Break Duration (Mins)</label>
                  <input
                    type="number"
                    value={formData.breakDurationMinutes}
                    onChange={(e) => setFormData({ ...formData, breakDurationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg">
                  Save Shift Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
