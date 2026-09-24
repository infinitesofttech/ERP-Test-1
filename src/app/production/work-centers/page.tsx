'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Wrench, Plus, Activity, Clock, ShieldCheck, AlertTriangle, CheckCircle2, UserCheck, Edit3 } from 'lucide-react';
import { WorkCenter, WorkCenterMachineStatus } from '../../../types/production';

export default function WorkCentersPage() {
  const { workCenters, addWorkCenter, updateWorkCenter } = useERP();
  const [showModal, setShowModal] = useState(false);
  const [editingWc, setEditingWc] = useState<WorkCenter | null>(null);

  const [wcCode, setWcCode] = useState('');
  const [wcName, setWcName] = useState('');
  const [dept, setDept] = useState('Production');
  const [machineName, setMachineName] = useState('');
  const [capacityHours, setCapacityHours] = useState(16);
  const [availableHours, setAvailableHours] = useState(14);
  const [efficiency, setEfficiency] = useState(90);
  const [supervisor, setSupervisor] = useState('Jayesh Parmar');
  const [status, setStatus] = useState<WorkCenterMachineStatus>('Running');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWc) {
      updateWorkCenter(editingWc.id, {
        workCenterCode: wcCode,
        workCenterName: wcName,
        machineName,
        capacityPerDayHours: capacityHours,
        availableHours,
        efficiencyPercent: efficiency,
        supervisorName: supervisor,
        status,
      });
      alert('Work Center updated successfully!');
    } else {
      addWorkCenter({
        workCenterCode: wcCode || `WC-00${workCenters.length + 1}`,
        workCenterName: wcName,
        department: dept,
        machineName,
        machineNumber: `M/C-${Date.now().toString().slice(-4)}`,
        location: 'Bay Area',
        capacityPerDayHours: capacityHours,
        availableHours,
        efficiencyPercent: efficiency,
        supervisorName: supervisor,
        status,
      });
      alert('Work Center created successfully!');
    }

    setShowModal(false);
    setEditingWc(null);
  };

  const openEdit = (wc: WorkCenter) => {
    setEditingWc(wc);
    setWcCode(wc.workCenterCode);
    setWcName(wc.workCenterName);
    setMachineName(wc.machineName);
    setCapacityHours(wc.capacityPerDayHours);
    setAvailableHours(wc.availableHours);
    setEfficiency(wc.efficiencyPercent);
    setSupervisor(wc.supervisorName);
    setStatus(wc.status);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6 bg-[#090D1A] min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Work Centers & Machines Master
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                Shop Floor Bays
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Machinery Capacity, Daily Hours Available & OEE Efficiency Metrics
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingWc(null);
            setWcCode('');
            setWcName('');
            setMachineName('');
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white text-xs shadow-lg hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" /> Add Work Center Bay
        </button>
      </div>

      {/* Work Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workCenters.map((wc) => (
          <div
            key={wc.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition space-y-4 shadow-xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono font-bold text-purple-400 text-sm">{wc.workCenterCode}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{wc.workCenterName}</h3>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{wc.machineName}</div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  wc.status === 'Running'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : wc.status === 'Maintenance'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {wc.status}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs text-center">
              <div>
                <span className="text-slate-400 block text-[10px]">Daily Capacity</span>
                <span className="font-bold text-slate-200">{wc.capacityPerDayHours} hrs</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Available</span>
                <span className="font-bold text-emerald-400">{wc.availableHours} hrs</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Efficiency</span>
                <span className="font-bold text-amber-400">{wc.efficiencyPercent}%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Sup: {wc.supervisorName}</span>
              </div>
              <button
                onClick={() => openEdit(wc)}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition border border-slate-700 text-[11px] flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3 text-purple-400" /> Edit Bay
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{editingWc ? 'Edit Work Center' : 'Add Work Center Bay'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white font-bold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Work Center Code</label>
                  <input
                    type="text"
                    required
                    placeholder="WC-WELD"
                    value={wcCode}
                    onChange={(e) => setWcCode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Supervisor</label>
                  <input
                    type="text"
                    required
                    value={supervisor}
                    onChange={(e) => setSupervisor(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Work Center Name</label>
                <input
                  type="text"
                  required
                  placeholder="Heavy SAW Welding & Fabrication Bay"
                  value={wcName}
                  onChange={(e) => setWcName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Machine Name & Specs</label>
                <input
                  type="text"
                  required
                  placeholder="SAW Column & Boom Welding Manipulator"
                  value={machineName}
                  onChange={(e) => setMachineName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Capacity (Hrs/Day)</label>
                  <input
                    type="number"
                    value={capacityHours}
                    onChange={(e) => setCapacityHours(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Available Hrs</label>
                  <input
                    type="number"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Efficiency %</label>
                  <input
                    type="number"
                    value={efficiency}
                    onChange={(e) => setEfficiency(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="Running">Running</option>
                  <option value="Idle">Idle</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Breakdown">Breakdown</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-500 shadow-lg"
                >
                  {editingWc ? 'Update Work Center' : 'Save Work Center'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
