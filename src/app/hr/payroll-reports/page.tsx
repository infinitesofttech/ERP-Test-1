'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { FileBarChart, Download, Printer, Filter, Search, FileSpreadsheet, Building, Users, Clock, DollarSign } from 'lucide-react';

export default function PayrollReportsPage() {
  const { availableEmployees, payrollRecords, attendanceRecords, leaveRequests, employeeAdvanceLoans, departments } = useERP();

  const [selectedReport, setSelectedReport] = useState('Salary Register');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const reportList = [
    'Employee Master Report',
    'Department-wise Employees',
    'Attendance Log Report',
    'Late Coming Exception Report',
    'Absenteeism Report',
    'Leave Utilization & Quotas',
    'Leave Balance Statement',
    'Overtime Cost Report',
    'WFH Remote Log Report',
    'Monthly Payroll Summary',
    'Salary Register',
    'Department Salary Cost Breakdown',
    'PF Statutory Monthly Statement',
    'ESI Statutory Statement',
    'Professional Tax (PT) Report',
    'TDS Tax Deduction Statement',
    'Advance & Loan Outstanding Statement',
    'Reimbursements Claim Log',
    'Performance & KPI Scorecard',
    'Employee Joining & Exit Report',
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileBarChart className="w-7 h-7 text-indigo-400" />
            Statutory & HR Analytics Reports (20 Standard Statements)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Download Excel Statements, Statutory PF/ESI Challans & Department Cost Analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`Exporting ${selectedReport} to Excel workbook...`)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Filter & Selection Bar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-400 uppercase">Select Report:</label>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            {reportList.map((r, i) => (
              <option key={i} value={r}>
                {i + 1}. {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
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

      {/* Report Data Preview Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl space-y-4 p-5">
        <h3 className="text-base font-bold text-white flex items-center justify-between">
          <span>{selectedReport} Preview</span>
          <span className="text-xs text-indigo-400 font-mono">Generated Live from HR Database</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-3">Ref ID</th>
                <th className="p-3">Employee Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Gross Earnings</th>
                <th className="p-3">Statutory Deductions (PF/ESI/PT)</th>
                <th className="p-3">Net Disbursement</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200 text-xs">
              {payrollRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-700/40 transition">
                  <td className="p-3 font-mono font-bold text-indigo-400">{rec.payrollNumber}</td>
                  <td className="p-3 font-bold text-white">{rec.employeeName}</td>
                  <td className="p-3 font-semibold text-slate-300">{rec.department}</td>
                  <td className="p-3 font-mono">₹{rec.grossEarnings.toLocaleString()}</td>
                  <td className="p-3 font-mono text-rose-400">₹{rec.totalDeductions.toLocaleString()}</td>
                  <td className="p-3 font-mono font-extrabold text-emerald-400">₹{rec.netSalary.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
