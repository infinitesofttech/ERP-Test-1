'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useERP } from '../../context/ERPContext';
import {
  Search,
  Bell,
  UserCheck,
  ShieldCheck,
  ChevronDown,
  Clock,
  History,
  CheckCircle2,
  AlertTriangle,
  Menu,
  Sparkles,
  LogOut,
  User,
  Plus,
  Compass,
  Cpu,
  Layers,
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export function Topbar() {
  const {
    currentUser,
    setCurrentUser,
    availableEmployees,
    setIsSearchOpen,
    openJobModal,
    salesOrders,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    sidebarCollapsed,
    setSidebarCollapsed,
    logout,
  } = useERP();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleOpenSampleTraceability = () => {
    if (salesOrders.length > 0 && salesOrders[0].jobNumber) {
      openJobModal(salesOrders[0].jobNumber);
    } else {
      openJobModal('JOB-2026-0001');
    }
  };

  return (
    <header className="h-16 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 z-20 sticky top-0 flex-shrink-0 transition-all">
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 sm:hidden transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button Trigger (Ctrl+K) */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 w-full bg-slate-100/90 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-500 dark:text-slate-400 transition-all text-left group shadow-xs cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <span className="flex-1 truncate">Search Job #, Customers, Invoices, Quotations...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Quick Actions + Role Switcher + Notifications + User */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Action: 360° MTO Traceability Dialog */}
        <button
          onClick={handleOpenSampleTraceability}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition shadow-xs cursor-pointer"
          title="Open 360° MTO Manufacturing Lifecycle Stepper"
        >
          <Cpu className="w-3.5 h-3.5 text-amber-500" />
          <span>360° Job Tracker</span>
        </button>

        {/* Quick Action: + Lead */}
        <Link
          href="/crm/leads/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm shadow-blue-600/30"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Lead</span>
        </Link>

        {/* Live RBAC Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotificationMenu(false);
              setShowUserMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-500/20 transition shadow-xs cursor-pointer"
            title="Switch User Role to test Live RBAC & Permissions"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline font-mono uppercase text-[11px]">{currentUser.roleName}</span>
            <ChevronDown className="w-3 h-3 text-blue-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  Live RBAC Persona Simulation
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {availableEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setCurrentUser(emp);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex flex-col hover:bg-slate-50 dark:hover:bg-slate-800/80 transition cursor-pointer ${
                      currentUser.id === emp.id
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{emp.firstName} {emp.lastName}</span>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {emp.roleName}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5">{emp.designation} • {emp.departmentName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationMenu(!showNotificationMenu);
              setShowRoleMenu(false);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 relative border border-slate-200/80 dark:border-slate-700/80 transition cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-black rounded-full text-[9px] flex items-center justify-center animate-pulse shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">System Notifications ({unreadCount})</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  <Link
                    href="/notifications"
                    onClick={() => setShowNotificationMenu(false)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    View All
                  </Link>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition flex items-start gap-3 ${
                      !notif.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      {notif.type === 'alert' || notif.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      ) : notif.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Bell className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{notif.title}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{notif.message}</div>
                      <div className="text-[10px] text-slate-400 font-mono pt-0.5">{formatDateTime(notif.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowRoleMenu(false);
              setShowNotificationMenu(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
              {currentUser.firstName.slice(0, 1)}{currentUser.lastName.slice(0, 1)}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white">{currentUser.firstName} {currentUser.lastName}</div>
                <div className="text-slate-500 text-[11px] truncate">{currentUser.email}</div>
                <div className="text-blue-500 font-bold font-mono text-[10px] mt-0.5 uppercase">{currentUser.roleName}</div>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/settings/company"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Company Settings</span>
                </Link>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <Link
                  href="/login"
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Switch Terminal</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
