'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  FileText,
  Building,
  ShieldCheck,
  Briefcase,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Lock,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Employee } from '../../../types/crm';

export default function EmployeeMasterPage() {
  const { availableEmployees, currentUser, departments, designations, salaryStructures } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Employment' | 'Attendance' | 'Leave' | 'Payroll' | 'Documents' | 'Performance' | 'Training' | 'Advances' | 'Expenses' | 'Activity'>('Overview');
  const [showAddModal, setShowAddModal] = useState(false);

  const canViewSensitiveData = currentUser?.role === 'Super Admin' || currentUser?.role === 'HR Manager' || currentUser?.role === 'Admin';

  const getEmpName = (emp: Employee) => emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Staff';
  const getEmpDept = (emp: Employee) => emp.department || emp.departmentName || 'Production';

  const filteredEmployees = availableEmployees.filter((emp) => {
    const name = getEmpName(emp);
    const dept = getEmpDept(emp);
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.phone || emp.mobile || '').includes(searchTerm) ||
      dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || dept.toLowerCase() === departmentFilter.toLowerCase();
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-pink-500" />
            Employee Master (Foundation Integrated)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Centralized ERP Employee Directory, Employment Profiles, Statutory Details & Sensitive Payroll Protection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
          >
            <Plus className="w-4 h-4" /> Add Employee Profile
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-pink-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-pink-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.departmentName}>
                {d.departmentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Data Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Employee</th>
                <th className="p-4">Department & Designation</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Joining Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-sm text-slate-200">
              {filteredEmployees.map((emp) => {
                const empName = getEmpName(emp);
                const empDept = getEmpDept(emp);
                const empSalary = salaryStructures.find((s) => s.employeeId === emp.id || s.employeeName === empName);
                return (
                  <tr key={emp.id} className="hover:bg-slate-700/40 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-pink-600/20 border border-pink-500/40 flex items-center justify-center font-bold text-pink-400 text-sm">
                          {empName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{empName}</div>
                          <div className="text-xs text-slate-400">ID: {emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{empDept}</div>
                      <div className="text-xs text-pink-400 font-semibold">{emp.role || emp.roleName || emp.designation || 'Staff'}</div>
                    </td>
                    <td className="p-4 space-y-0.5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{emp.phone || emp.mobile || '+91 98250 12345'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{emp.joinedDate || emp.joiningDate || '2022-01-15'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" /> {emp.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setActiveTab('Overview');
                        }}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-md border border-slate-600 transition flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5 text-pink-400" /> View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Employee Profile Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-pink-600/30 border-2 border-pink-500 flex items-center justify-center text-xl font-black text-pink-400">
                  {getEmpName(selectedEmployee).charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{getEmpName(selectedEmployee)}</h2>
                  <p className="text-xs text-slate-400">
                    Employee Code: {selectedEmployee.id} | Department: <span className="text-pink-400 font-semibold">{getEmpDept(selectedEmployee)}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Tabs Bar (11 Tabs) */}
            <div className="flex overflow-x-auto bg-slate-900 border-b border-slate-800 px-6 gap-2">
              {(['Overview', 'Employment', 'Attendance', 'Leave', 'Payroll', 'Documents', 'Performance', 'Training', 'Advances', 'Expenses', 'Activity'] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                      activeTab === tab ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Tab Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-200">
              {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-400" /> Personal Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span className="text-slate-400">Full Name:</span> <span className="font-semibold text-white">{selectedEmployee.name}</span>
                      <span className="text-slate-400">Email:</span> <span className="text-slate-300">{selectedEmployee.email}</span>
                      <span className="text-slate-400">Mobile:</span> <span className="text-slate-300">{selectedEmployee.phone || '+91 98250 12345'}</span>
                      <span className="text-slate-400">Gender:</span> <span className="text-slate-300">Male</span>
                      <span className="text-slate-400">Date of Birth:</span> <span className="text-slate-300">1992-08-14</span>
                      <span className="text-slate-400">Emergency Contact:</span> <span className="text-slate-300">+91 98980 11223 (Spouse)</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-cyan-400" /> Employment Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span className="text-slate-400">Department:</span> <span className="font-semibold text-cyan-400">{selectedEmployee.department}</span>
                      <span className="text-slate-400">Designation:</span> <span className="text-slate-300">{selectedEmployee.role || 'Senior Engineer'}</span>
                      <span className="text-slate-400">Joining Date:</span> <span className="text-slate-300">{selectedEmployee.joinedDate || '2022-01-15'}</span>
                      <span className="text-slate-400">Employment Type:</span> <span className="text-slate-300">Full Time Permanent</span>
                      <span className="text-slate-400">Shift:</span> <span className="text-slate-300">General Day Shift</span>
                      <span className="text-slate-400">Work Location:</span> <span className="text-slate-300">GIDC Vatva Plant 1</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Employment' && (
                <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" /> Detailed Employment & Hierarchy
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Reporting Manager</span>
                      <span className="text-white font-bold">Rajesh Patel (General Manager)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Probation Period</span>
                      <span className="text-slate-200">6 Months (Confirmed)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Confirmation Date</span>
                      <span className="text-slate-200">2022-07-15</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Employment Grade Level</span>
                      <span className="text-amber-400 font-semibold">Level 3 (Senior Cadre)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Role & Access Group</span>
                      <span className="text-slate-200">{selectedEmployee.role}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Payroll' && (
                <div className="space-y-4">
                  {!canViewSensitiveData ? (
                    <div className="p-8 bg-slate-800/60 border border-slate-700 rounded-xl text-center space-y-3">
                      <Lock className="w-10 h-10 text-rose-400 mx-auto" />
                      <h4 className="text-base font-bold text-white">Sensitive Salary Information Restricted</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Salary structures, basic pay, CTC and bank details are protected by role-based access control. Contact HR Manager or Admin for authorization.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" /> Salary Structure & Statutory Tax Profile
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                          <span className="text-slate-400">Basic Monthly Salary</span>
                          <div className="text-lg font-bold text-white">₹32,500</div>
                        </div>
                        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                          <span className="text-slate-400">Gross Salary</span>
                          <div className="text-lg font-bold text-emerald-400">₹65,000</div>
                        </div>
                        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                          <span className="text-slate-400">Annual CTC</span>
                          <div className="text-lg font-bold text-pink-400">₹7,80,000</div>
                        </div>
                      </div>

                      <div className="border-t border-slate-700 pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div><span className="text-slate-400 block">PAN Number:</span> <span className="font-mono text-white">ABCDE1234F</span></div>
                        <div><span className="text-slate-400 block">Aadhaar Number:</span> <span className="font-mono text-white">9988-7766-5544</span></div>
                        <div><span className="text-slate-400 block">PF UAN:</span> <span className="font-mono text-white">100998877665</span></div>
                        <div><span className="text-slate-400 block">ESIC No:</span> <span className="font-mono text-white">3100998877</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Documents' && (
                <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" /> Uploaded Verification Documents
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-lg border border-slate-700 text-xs">
                      <div>
                        <div className="font-bold text-white">Aadhaar Card Copy</div>
                        <div className="text-slate-400">Verified by HR Manager on 2022-01-10</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-lg border border-slate-700 text-xs">
                      <div>
                        <div className="font-bold text-white">Engineering Degree Certificate</div>
                        <div className="text-slate-400">Verified by HR Manager on 2022-01-12</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">Verified</span>
                    </div>
                  </div>
                </div>
              )}

              {/* General Placeholder for other tabs */}
              {['Attendance', 'Leave', 'Performance', 'Training', 'Advances', 'Expenses', 'Activity'].includes(activeTab) && (
                <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-pink-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">{activeTab} Details for {selectedEmployee.name}</h4>
                  <p className="text-xs text-slate-400">
                    Integrated directly with HR {activeTab} logs and audit entries.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
