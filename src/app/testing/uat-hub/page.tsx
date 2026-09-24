'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Play,
  Filter,
  Search,
  Download,
  RefreshCw,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { TestCaseItem } from '../../../types/testing';

export default function UATHubPage() {
  const { testCases, updateTestCaseStatus } = useERP();

  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSimulatingWorkflow, setIsSimulatingWorkflow] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [workflowLog, setWorkflowLog] = useState<string[]>([]);
  const [editingTestCase, setEditingTestCase] = useState<TestCaseItem | null>(null);
  const [editStatus, setEditStatus] = useState<TestCaseItem['status']>('Pass');
  const [editRemarks, setEditRemarks] = useState<string>('');

  // Stats calculation
  const totalCases = testCases.length;
  const passedCases = testCases.filter((tc) => tc.status === 'Pass').length;
  const failedCases = testCases.filter((tc) => tc.status === 'Fail').length;
  const blockedCases = testCases.filter((tc) => tc.status === 'Blocked').length;
  const pendingCases = testCases.filter((tc) => tc.status === 'Pending').length;
  const passPercentage = totalCases > 0 ? Math.round((passedCases / totalCases) * 100) : 0;

  // Filtered test cases
  const filteredCases = testCases.filter((tc) => {
    const matchesModule = selectedModule === 'All' || tc.module === selectedModule;
    const matchesStatus = selectedStatus === 'All' || tc.status === selectedStatus;
    const matchesSearch =
      tc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesStatus && matchesSearch;
  });

  const mtoSteps = [
    { title: '1. CRM Lead & Enquiry', status: 'Passed', log: 'Lead LEAD-2026-001 created for Torrent Power Ltd.' },
    { title: '2. Commercial Quotation', status: 'Passed', log: 'Quotation QT-2026-0089 generated with ₹42.00 Lakhs value.' },
    { title: '3. Customer PO & Sales Order', status: 'Passed', log: 'SO-2026-0001 verified against PO-TOP-99182.' },
    { title: '4. Project & Job 360° Master', status: 'Passed', log: 'Job Master JOB-2026-001 created & linked.' },
    { title: '5. Design BOM Release', status: 'Passed', log: 'BOM REV-02 released to Manufacturing by Engineering.' },
    { title: '6. MRP Calculation & Requisition', status: 'Passed', log: 'PR-2026-0012 generated for 8500 kg SS Plates.' },
    { title: '7. Supplier RFQ & Purchase Order', status: 'Passed', log: 'PO-2026-0045 issued to Jindal Stainless.' },
    { title: '8. Store GRN & QC Verification', status: 'Passed', log: 'GRN-2026-001 logged, stock credited to Store.' },
    { title: '9. Shopfloor Material Issue', status: 'Passed', log: 'Stock issued for WO-2026-0001 Plasma cutting.' },
    { title: '10. Production Operations Progress', status: 'Passed', log: 'Operations completed across Plasma, Bending & Welding.' },
    { title: '11. Accounting Sales Invoice', status: 'Passed', log: 'Invoice INV-2026-001 posted with ₹49.56 Lakhs total.' },
    { title: '12. HR Payroll & Labor Costing', status: 'Passed', log: 'Direct labor cost allocated to JOB-2026-001.' },
    { title: '13. Equipment Maintenance Service', status: 'Passed', log: 'Service report SR-2026-0089 linked to Machine Master.' },
  ];

  const handleRunWorkflowSimulation = () => {
    setIsSimulatingWorkflow(true);
    setSimulationStep(0);
    setWorkflowLog([]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < mtoSteps.length) {
        setSimulationStep(step + 1);
        setWorkflowLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ✓ ${mtoSteps[step].log}`]);
        step++;
      } else {
        clearInterval(interval);
        setIsSimulatingWorkflow(false);
      }
    }, 400);
  };

  const handleSaveStatus = () => {
    if (editingTestCase) {
      updateTestCaseStatus(editingTestCase.id, editStatus, editRemarks);
      setEditingTestCase(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                ERP Testing & UAT Master Hub
              </h1>
              <p className="text-xs text-slate-400">
                Uma Techno Fab Manufacturing ERP — Module 11 Quality Assurance & System Verification Matrix
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunWorkflowSimulation}
            disabled={isSimulatingWorkflow}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-emerald-600/20"
          >
            <Play className={cn('w-4 h-4', isSimulatingWorkflow && 'animate-spin')} />
            {isSimulatingWorkflow ? `Testing Step ${simulationStep}/13...` : 'Run MTO Workflow Verification'}
          </button>
          <button
            onClick={() => alert('Exporting full UAT Execution Report (PDF/Excel)...')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition border border-slate-700"
          >
            <Download className="w-4 h-4" />
            Export UAT Report
          </button>
        </div>
      </div>

      {/* Workflow Simulation Modal / Status Box */}
      {workflowLog.length > 0 && (
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              Automated MTO Business Workflow Verification
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Progress: {simulationStep} / 13 Steps
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${(simulationStep / 13) * 100}%` }}
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-40 overflow-y-auto space-y-1">
            {workflowLog.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold">{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-xs text-slate-400 font-medium">Total Test Cases</div>
          <div className="text-2xl font-bold text-white font-mono">{totalCases}</div>
          <div className="text-[10px] text-slate-500">11 ERP Modules Covered</div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/20 p-4 rounded-xl space-y-1">
          <div className="text-xs text-emerald-400 font-medium flex items-center justify-between">
            <span>Passed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{passedCases}</div>
          <div className="text-[10px] text-emerald-500/80 font-semibold">{passPercentage}% Pass Rate</div>
        </div>

        <div className="bg-slate-900 border border-red-500/20 p-4 rounded-xl space-y-1">
          <div className="text-xs text-red-400 font-medium flex items-center justify-between">
            <span>Failed</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 font-mono">{failedCases}</div>
          <div className="text-[10px] text-red-500/80">Action Required</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/20 p-4 rounded-xl space-y-1">
          <div className="text-xs text-amber-400 font-medium flex items-center justify-between">
            <span>Blocked</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{blockedCases}</div>
          <div className="text-[10px] text-amber-500/80">Dependency On hold</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Pending</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-300 font-mono">{pendingCases}</div>
          <div className="text-[10px] text-slate-500">Scheduled Execution</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-300 font-semibold">Module:</span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Modules (11)</option>
              <option value="Foundation" className="bg-slate-900">Foundation</option>
              <option value="CRM" className="bg-slate-900">CRM</option>
              <option value="Project" className="bg-slate-900">Project & Job</option>
              <option value="Design" className="bg-slate-900">Design & BOM</option>
              <option value="Purchase" className="bg-slate-900">Purchase</option>
              <option value="Store" className="bg-slate-900">Store & Warehouse</option>
              <option value="Production" className="bg-slate-900">Production / MRP</option>
              <option value="Accounting" className="bg-slate-900">Accounting & Finance</option>
              <option value="HR" className="bg-slate-900">HR & Payroll</option>
              <option value="Maintenance" className="bg-slate-900">Maintenance</option>
              <option value="Integration" className="bg-slate-900">360° Integration</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-300 font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Statuses</option>
              <option value="Pass" className="bg-slate-900">Pass</option>
              <option value="Fail" className="bg-slate-900">Fail</option>
              <option value="Blocked" className="bg-slate-900">Blocked</option>
              <option value="Pending" className="bg-slate-900">Pending</option>
            </select>
          </div>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search test title, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 text-xs text-white pl-9 pr-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Test Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Layers className="w-4 h-4 text-blue-400" />
            UAT Execution Matrix ({filteredCases.length} Test Scenarios)
          </div>
          <span className="text-xs text-slate-400">Click any row status to update test outcome</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Test ID</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Test Case Title & Details</th>
                <th className="py-3 px-4">Expected Result</th>
                <th className="py-3 px-4">Executed By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filteredCases.map((tc) => (
                <tr key={tc.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono text-blue-400 font-bold">{tc.id}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {tc.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-medium">{tc.category}</td>
                  <td className="py-3 px-4 space-y-0.5">
                    <div className="font-semibold text-white">{tc.title}</div>
                    <div className="text-[11px] text-slate-400 leading-tight">{tc.description}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-[11px] max-w-xs">{tc.expectedResult}</td>
                  <td className="py-3 px-4 text-slate-400">
                    <div>{tc.executedBy || '—'}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{tc.executedDate || ''}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      onClick={() => {
                        setEditingTestCase(tc);
                        setEditStatus(tc.status);
                        setEditRemarks(tc.remarks || '');
                      }}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition flex items-center gap-1 w-fit',
                        tc.status === 'Pass' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20',
                        tc.status === 'Fail' && 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
                        tc.status === 'Blocked' && 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20',
                        tc.status === 'Pending' && 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                      )}
                    >
                      {tc.status === 'Pass' && <CheckCircle2 className="w-3 h-3" />}
                      {tc.status === 'Fail' && <XCircle className="w-3 h-3" />}
                      {tc.status === 'Blocked' && <AlertTriangle className="w-3 h-3" />}
                      {tc.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {tc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditingTestCase(tc);
                        setEditStatus(tc.status);
                        setEditRemarks(tc.remarks || '');
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-semibold transition border border-slate-700"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Test Status Modal */}
      {editingTestCase && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-400" />
                Update Test Outcome: {editingTestCase.id}
              </div>
              <button
                onClick={() => setEditingTestCase(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold">Test Title:</label>
                <div className="text-white font-semibold mt-0.5">{editingTestCase.title}</div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Execution Status:</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {(['Pass', 'Fail', 'Blocked', 'Pending'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={cn(
                        'py-2 rounded-xl font-bold text-xs border transition',
                        editStatus === st
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Remarks / Bug Linkage:</label>
                <textarea
                  rows={3}
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="Enter remarks, log output or bug ticket ID..."
                  className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setEditingTestCase(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20"
              >
                Save Outcome
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
