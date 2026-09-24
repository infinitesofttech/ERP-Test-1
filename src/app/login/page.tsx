'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useERP } from '../../context/ERPContext';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Factory,
  Layers,
  FileSpreadsheet,
  Cpu,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, availableEmployees } = useERP();
  const [username, setUsername] = useState('rajesh.admin');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid credentials or inactive account. Choose a quick test account below.');
        setLoading(false);
      }
    }, 350);
  };

  const handleQuickSelect = (u: string) => {
    setUsername(u);
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-[#070B14]">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Main Container Card: Split-Screen Architecture */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900/70 backdrop-blur-2xl shadow-2xl shadow-black/80 grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* LEFT COLUMN: Industrial Brand & Capabilities Showcase */}
        <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-slate-900/90 via-blue-950/40 to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800/80 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

          {/* Top Lockup */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/30 border border-white/20">
                U
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-wider text-white">UMA TECHNO FAB</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold uppercase">
                    MTO ERP
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Make-to-Order Manufacturing & Traceability</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Precision Manufacturing <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                  Enterprise Management System
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed max-w-md">
                End-to-end commercial CRM, Multi-Revision Engineering Quotations, Customer PO processing, and 360° Job Order Shop Floor Traceability.
              </p>
            </div>

            {/* Value Proposition Showcase Cards */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">360° MTO Job Order Traceability</h4>
                  <p className="text-[11px] text-slate-400">Real-time status from Lead → Quotation → PO → Shop Floor Job.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Multi-Revision Commercial Quotations</h4>
                  <p className="text-[11px] text-slate-400">Complete version history (Rev-00, Rev-01) with itemized BOM pricing.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Granular Role-Based Access Control</h4>
                  <p className="text-[11px] text-slate-400">Strict department privilege separation & comprehensive audit logging.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Note */}
          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" /> 256-Bit Encrypted Secure Session
            </span>
            <span className="font-mono text-slate-400">v1.0.0 Enterprise</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication & Persona Switcher */}
        <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-slate-900/60">
          <div>
            {/* Header */}
            <div className="space-y-1 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Secure Workspace Portal
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">Sign In to ERP</h2>
              <p className="text-xs text-slate-400">Enter your employee credentials or select a test role below.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username or Employee Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. rajesh.admin"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  <a href="/forgot-password" className="text-blue-400 hover:text-blue-300 hover:underline text-[11px] font-medium transition">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition shadow-inner font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Remember my session on this terminal</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
              >
                <span>{loading ? 'Authenticating Operator...' : 'Sign In to Manufacturing Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick RBAC Persona Switcher */}
          <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                ⚡ Quick 1-Click Test Personas (RBAC Demo)
              </span>
              <span className="text-[10px] text-blue-400 font-medium">Auto-fill credentials</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Persona 1: Super Admin */}
              <button
                type="button"
                onClick={() => handleQuickSelect('rajesh.admin')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  username === 'rajesh.admin'
                    ? 'bg-blue-600/15 border-blue-500/60 ring-1 ring-blue-500/30'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center justify-center flex-shrink-0 font-mono">
                  RP
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-white text-xs block truncate">Rajesh Patel</span>
                  <span className="text-[9px] font-mono text-amber-400 font-bold block uppercase truncate">Super Admin</span>
                </div>
              </button>

              {/* Persona 2: CRM Manager */}
              <button
                type="button"
                onClick={() => handleQuickSelect('pravin.crm')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  username === 'pravin.crm'
                    ? 'bg-blue-600/15 border-blue-500/60 ring-1 ring-blue-500/30'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center flex-shrink-0 font-mono">
                  PP
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-white text-xs block truncate">Pravin Patel</span>
                  <span className="text-[9px] font-mono text-blue-400 font-bold block uppercase truncate">CRM Manager</span>
                </div>
              </button>

              {/* Persona 3: Admin Family */}
              <button
                type="button"
                onClick={() => handleQuickSelect('ketan.admin')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  username === 'ketan.admin'
                    ? 'bg-blue-600/15 border-blue-500/60 ring-1 ring-blue-500/30'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0 font-mono">
                  KP
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-white text-xs block truncate">Ketan Patel</span>
                  <span className="text-[9px] font-mono text-purple-400 font-bold block uppercase truncate">Admin (Family)</span>
                </div>
              </button>

              {/* Persona 4: Sales Engineer */}
              <button
                type="button"
                onClick={() => handleQuickSelect('amit.sales')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  username === 'amit.sales'
                    ? 'bg-blue-600/15 border-blue-500/60 ring-1 ring-blue-500/30'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 font-mono">
                  AS
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-white text-xs block truncate">Amit Sharma</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold block uppercase truncate">Sales Engineer</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
