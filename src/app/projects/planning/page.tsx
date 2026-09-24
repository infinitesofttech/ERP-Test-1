'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { formatDate } from '../../../lib/utils';
import { ProjectPlanningStage } from '../../../types/crm';
import { Workflow, CheckCircle2, Clock, AlertTriangle, Layers, Edit, Save, Plus } from 'lucide-react';

export default function ProjectPlanningPage() {
  const { projectPlanningStages, updatePlanningStage, projectJobs } = useERP();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-2026-0001');

  // Active Project Stages
  const activeStages = projectPlanningStages.filter(
    (s) => s.projectId === selectedProjectId || s.jobNumber === projectJobs.find((p) => p.id === selectedProjectId)?.jobNumber
  );

  const activeProject = projectJobs.find((p) => p.id === selectedProjectId) || projectJobs[0];

  const handleStatusChange = (id: string, newStatus: ProjectPlanningStage['status']) => {
    const isComp = newStatus === 'completed';
    updatePlanningStage(id, {
      status: newStatus,
      progressPercent: isComp ? 100 : newStatus === 'in_progress' ? 50 : 0,
      actualEnd: isComp ? new Date().toISOString().split('T')[0] : undefined,
    });
  };

  return (
    <div className="space-y-6 text-xs pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 font-mono text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">
              MTO Stage Governance
            </span>
          </div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Workflow className="w-5 h-5 text-purple-600" />
            16-Stage Project Planning Matrix
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Coordinate every step from Order Confirmation to Commissioning & Handover.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 font-bold">Select Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            {projectJobs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectNumber} ({p.jobNumber}) • {p.customerName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Summary Banner */}
      {activeProject && (
        <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/40 p-4 rounded-xl border border-purple-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
          <div>
            <div className="text-xs font-bold text-purple-300">{activeProject.customerName}</div>
            <div className="text-base font-black">{activeProject.productName}</div>
            <div className="text-[11px] text-slate-300 font-mono">
              Job: {activeProject.jobNumber} | PM: {activeProject.projectManager} | Target: {formatDate(activeProject.deliveryDate)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Overall Progress</span>
            <span className="text-xl font-black text-purple-400 font-mono">{activeProject.progressPercent}%</span>
          </div>
        </div>
      )}

      {/* 16 Planning Stages Grid / Table */}
      <div className="bg-white dark:bg-[#0B1120] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs">Full 16-Stage Execution Plan</h3>
          <span className="text-[11px] text-slate-400 font-mono">Total {activeStages.length} Stages</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 w-12">#</th>
                <th className="p-3">Stage Name</th>
                <th className="p-3">Dept</th>
                <th className="p-3">Responsible</th>
                <th className="p-3">Planned Start / End</th>
                <th className="p-3">Actual Start / End</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {activeStages.map((stage) => {
                const statusColors = {
                  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                  in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                  pending: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                  delayed: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
                };
                return (
                  <tr key={stage.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition">
                    <td className="p-3 font-mono font-bold text-slate-400">{stage.stageNumber}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{stage.stageName}</td>
                    <td className="p-3 uppercase font-mono text-[10px] text-purple-600 dark:text-purple-400 font-bold">{stage.responsibleDepartment}</td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{stage.responsibleEmployee}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {stage.plannedStart} → {stage.plannedEnd}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {stage.actualStart || '-'} → {stage.actualEnd || '-'}
                    </td>
                    <td className="p-3">
                      <div className="w-20">
                        <div className="flex justify-between text-[10px] font-mono mb-0.5">
                          <span className="font-bold text-blue-500">{stage.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-purple-600 h-full rounded-full" style={{ width: `${stage.progressPercent}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${statusColors[stage.status]}`}>
                        {stage.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={stage.status}
                        onChange={(e) => handleStatusChange(stage.id, e.target.value as any)}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="delayed">Delayed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
