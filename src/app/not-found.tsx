'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070A14] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-4 shadow-xl">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-white tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mt-2">
        The requested page could not be located on the Uma Techno Fab ERP system.
      </p>
      <div className="flex items-center gap-3 mt-6">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition"
        >
          <Home className="w-4 h-4" />
          Executive Command Center
        </Link>
        <Link
          href="/designer/dashboard"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs border border-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Designer Portal
        </Link>
      </div>
    </div>
  );
}
