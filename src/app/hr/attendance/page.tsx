'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Clock, Plus, Search, CheckCircle2, AlertTriangle, Calendar, Filter, MapPin, Smartphone, Laptop, ShieldCheck, X } from 'lucide-react';
import { AttendanceStatusType } from '../../../types/hr';

export default function AttendancePage() {
  const { attendanceRecords, markAttendance, availableEmployees } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showPunchModal, setShowPunchModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: availableEmployees[0]?.id || 'EMP-2026-001',
    date: new Date().toISOString().split('T')[0],
    shiftName: 'General Day Shift (09:00 - 18:00)',
    checkIn: '09:05',
    checkOut: '18:10',
    status: 'Present' as AttendanceStatusType,
    source: 'Biometric System' as const,
    remarks: 'Regular shop floor punch',
  });

  const filteredRecords = attendanceRecords.filter((a) => {
    const matchesSearch =
      a.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.date.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePunchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = availableEmployees.find((e) => e.id === formData.employeeId);
    markAttendance({
      employeeId: formData.employeeId,
      employeeName: emp?.name || 'Staff Member',
      department: emp?.department || 'Production',
      date: formData.date,
      shiftName: formData.shiftName,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      totalHours: 9.0,
      lateMinutes: 5,
      earlyCheckoutMinutes: 0,
      overtimeHours: 0,
      status: formData.status,
      source: formData.source,
      remarks: formData.remarks,
    });
    setShowPunchModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-blue-400" />
            Daily Attendance Management & Biometric Log
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-Time Punch In/Out Logs, Late Coming Tracking, Overtime & Biometric Integration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPunchModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
          >
            <Plus className="w-4 h-4" /> Manual Punch / Log Entry
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by employee name, department, date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Attendance Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
            <option value="WFH">WFH</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Employee</th>
                <th className="p-4">Date & Shift</th>
                <th className="p-4">Check-In / Out</th>
                <th className="p-4">Work Hours & Late</th>
                <th className="p-4">Status</th>
                <th className="p-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-700/40 transition">
                  <td className="p-4">
                    <div className="font-bold text-white">{rec.employeeName}</div>
                    <div className="text-xs text-slate-400">{rec.department}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-200">{rec.date}</div>
                    <div className="text-xs text-slate-400">{rec.shiftName}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-300">
                    <div className="text-emerald-400 font-bold">In: {rec.checkIn || '--:--'}</div>
                    <div className="text-pink-400 font-bold">Out: {rec.checkOut || '--:--'}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div>Hours: <strong className="text-white">{rec.totalHours} Hrs</strong></div>
                    {rec.lateMinutes > 0 && <div className="text-amber-400 font-semibold">Late: {rec.lateMinutes} Mins</div>}
                    {rec.overtimeHours > 0 && <div className="text-emerald-400 font-semibold">OT: {rec.overtimeHours} Hrs</div>}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        rec.status === 'Present'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : rec.status === 'Late'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : rec.status === 'Absent'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">{rec.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showPunchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" /> Manual Punch / Attendance Log
              </h2>
              <button onClick={() => setShowPunchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePunchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Employee</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  {availableEmployees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                    <option value="Half Day">Half Day</option>
                    <option value="WFH">WFH</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Check-In Time</label>
                  <input
                    type="text"
                    placeholder="09:00"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Check-Out Time</label>
                  <input
                    type="text"
                    placeholder="18:00"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowPunchModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg">
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
