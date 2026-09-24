'use client';

import React from 'react';
import { useERP } from '../../../context/ERPContext';
import { Users, Briefcase, UserPlus, PhoneCall, FileCheck, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function RecruitmentDashboardPage() {
  const { jobPositions, candidateProfiles, interviewRecords, offerLetters } = useERP();

  const openPositions = jobPositions.filter((j) => j.status === 'Open').length;
  const totalCandidates = candidateProfiles.length;
  const shortlistedCandidates = candidateProfiles.filter((c) => c.status === 'Shortlisted' || c.status === 'Interview Scheduled').length;
  const offeredCandidates = offerLetters.filter((o) => o.status === 'Sent' || o.status === 'Accepted').length;

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-400" />
            Recruitment & Hiring Pipeline Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manufacturing Talent Acquisition: Vacancies -&gt; Candidate Screening -&gt; Technical Interviews -&gt; Offer Rollout
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/hr/job-positions"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
          >
            <Briefcase className="w-4 h-4" /> Post New Job Position
          </Link>
        </div>
      </div>

      {/* Pipeline KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Open Job Vacancies</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{openPositions} Active Positions</div>
          <span className="text-[11px] text-slate-400">Production & Service Cadres</span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Candidate Pool</span>
            <UserPlus className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-pink-400">{totalCandidates} Applicants</div>
          <span className="text-[11px] text-slate-400">Resumes Submitted</span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Interviews Scheduled / Done</span>
            <PhoneCall className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{interviewRecords.length} Rounds</div>
          <span className="text-[11px] text-amber-400">Technical & Managerial</span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Offer Letters Issued</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{offeredCandidates} Extended</div>
          <span className="text-[11px] text-emerald-400">Ready for Employee Onboarding</span>
        </div>
      </div>

      {/* Recruitment Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/hr/job-positions"
          className="bg-slate-800/80 hover:bg-slate-700/60 border border-slate-700/60 rounded-xl p-5 space-y-3 transition group"
        >
          <Briefcase className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition" />
          <div>
            <h3 className="text-base font-bold text-white">1. Job Positions</h3>
            <p className="text-xs text-slate-400 mt-1">Manage open vacancies, required skills & salary brackets</p>
          </div>
          <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1 pt-2">
            View Openings <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/hr/candidates"
          className="bg-slate-800/80 hover:bg-slate-700/60 border border-slate-700/60 rounded-xl p-5 space-y-3 transition group"
        >
          <UserPlus className="w-6 h-6 text-pink-400 group-hover:scale-110 transition" />
          <div>
            <h3 className="text-base font-bold text-white">2. Candidate Profiles</h3>
            <p className="text-xs text-slate-400 mt-1">Applicant pool, resume links & one-click conversion to employee</p>
          </div>
          <div className="text-xs font-semibold text-pink-400 flex items-center gap-1 pt-2">
            Screen Candidates <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/hr/interviews"
          className="bg-slate-800/80 hover:bg-slate-700/60 border border-slate-700/60 rounded-xl p-5 space-y-3 transition group"
        >
          <PhoneCall className="w-6 h-6 text-amber-400 group-hover:scale-110 transition" />
          <div>
            <h3 className="text-base font-bold text-white">3. Interview Management</h3>
            <p className="text-xs text-slate-400 mt-1">Technical scores, interviewer evaluations & round clearance</p>
          </div>
          <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 pt-2">
            Evaluate Candidates <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/hr/offers"
          className="bg-slate-800/80 hover:bg-slate-700/60 border border-slate-700/60 rounded-xl p-5 space-y-3 transition group"
        >
          <FileCheck className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition" />
          <div>
            <h3 className="text-base font-bold text-white">4. Offer Management</h3>
            <p className="text-xs text-slate-400 mt-1">Generate official offer letters & flow into Employee Onboarding</p>
          </div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 pt-2">
            Issue Offers <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
