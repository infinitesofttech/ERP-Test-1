'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { JobTraceabilityModal } from '../traceability/JobTraceabilityModal';
import { GlobalSearchModal } from '../search/GlobalSearchModal';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/forgot-password';

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 scrollbar-thin">
          {children}
        </main>
      </div>

      {/* 360° Job Traceability Modal Dialog */}
      <JobTraceabilityModal />

      {/* Global Search Dialog (Ctrl+K) */}
      <GlobalSearchModal />
    </div>
  );
}
