'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, Column } from '../../components/data/DataTable';
import { Department } from '../../types/crm';
import { Building, Plus, CheckCircle2, XCircle, Users, Briefcase } from 'lucide-react';

export default function DepartmentsPage() {
  const { departments, addDepartment, updateDepartment, employees } = useERP();
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [managerId, setManagerId] = useState(employees[0]?.id || '');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const mgr = employees.find((emp) => emp.id === managerId);
    addDepartment({
      code,
      name,
      managerId,
      managerName: mgr ? `${mgr.firstName} ${mgr.lastName}` : 'Unassigned',
      description,
      status: 'active',
    });
    setCode('');
    setName('');
    setDescription('');
    setShowModal(false);
  };

  const columns: Column<Department>[] = [
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (dept) => <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{dept.code}</span>,
    },
    {
      header: 'Department Name',
      cell: (dept) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{dept.name}</span>
          <span className="text-[11px] text-slate-500">{dept.description}</span>
        </div>
      ),
    },
    {
      header: 'Department Head / Manager',
      cell: (dept) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">{dept.managerName}</span>
      ),
    },
    {
      header: 'Active Staff',
      cell: (dept) => (
        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 font-bold text-[11px]">
          {dept.employeeCount} Members
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (dept) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            dept.status === 'active'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dept.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {dept.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (dept) => (
        <button
          onClick={() => updateDepartment(dept.id, { status: dept.status === 'active' ? 'inactive' : 'active' })}
          className="text-[11px] text-blue-600 hover:underline font-semibold"
        >
          Toggle Status
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Departments Management (9 Core Manufacturing Units)
          </h1>
          <p className="text-xs text-slate-500">
            Define structural departments, assign department managers and govern cross-department workflows.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Department</span>
        </button>
      </div>

      {/* Departments Table */}
      <DataTable
        title="Departments Master"
        columns={columns}
        data={departments}
        searchPlaceholder="Filter departments..."
      />

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Department</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. LOG"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono uppercase text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Logistics & Dispatch"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assigned Manager</label>
                <select
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.designation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Responsibilities of this department..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-100 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
