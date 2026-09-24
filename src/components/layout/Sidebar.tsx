'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useERP } from '../../context/ERPContext';
import {
  Users,
  Briefcase,
  UserCheck,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building,
  Hash,
  History,
  Bell,
  FileText,
  UserPlus,
  PhoneCall,
  Calendar,
  Layers,
  MapPin,
  TrendingUp,
  FileCheck2,
  Lock,
  Sparkles,
  Zap,
  CheckSquare,
  Flag,
  Clock,
  Folder,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Activity as ActivityIcon,
  BarChart3,
  Cpu,
  Workflow,
  Palette,
  Compass,
  Box,
  FileSpreadsheet,
  GitBranch,
  FolderOpen,
  FileCheck,
  ShoppingCart,
  Truck,
  ClipboardList,
  Package,
  PackageCheck,
  CornerUpLeft,
  Factory,
  Wrench,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  Landmark,
  Receipt,
  CreditCard,
  Coins,
  Scale,
  FileBarChart,
  Calculator,
  Wallet,
  Banknote,
  Database,
  UploadCloud,
  Bug,
  ShieldAlert,
  BookOpen,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const {
    currentUser,
    sidebarCollapsed,
    setSidebarCollapsed,
    leads,
    quotations,
    salesOrders,
    projectJobs,
    designJobs,
    purchaseOrders,
    purchaseRequisitions,
    itemMasters,
    goodsReceipts,
    workOrders,
    productionOrders,
  } = useERP();

  const pathname = usePathname();
  const [crmOpen, setCrmOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [designerOpen, setDesignerOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [productionOpen, setProductionOpen] = useState(false);
  const [accountingOpen, setAccountingOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [hrOpen, setHrOpen] = useState(false);
  const [integrationOpen, setIntegrationOpen] = useState(false);
  const [testingOpen, setTestingOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const navItemClass = (href: string) =>
    cn(
      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative',
      isActive(href)
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
    );

  return (
    <aside
      className={cn(
        'bg-[#090D1A] text-slate-300 border-r border-slate-800/80 flex flex-col transition-all duration-300 select-none z-30 shadow-2xl relative',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-800/80 bg-[#070A14] flex-shrink-0">
        {!sidebarCollapsed ? (
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/30 flex-shrink-0 border border-white/10">
              U
            </div>
            <div className="leading-tight truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white tracking-wide text-xs">UMA TECHNO FAB</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold">
                  MTO
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight block">
                Manufacturing ERP
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/" className="mx-auto w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
            U
          </Link>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 hidden sm:flex transition"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links Scrollable */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1.5 scrollbar-thin">
        {/* Executive Dashboard */}
        <Link href="/" className={navItemClass('/')}>
          <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-blue-400" />
          {!sidebarCollapsed && <span>Executive Command</span>}
        </Link>

        {/* 1. CRM MODULE (MODULE 1 BUSINESS CORE) */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setCrmOpen(!crmOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider hover:text-white transition"
            >
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>CRM & Sales Engine</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !crmOpen && '-rotate-90')} />
            </button>
          )}

          {(crmOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              <Link href="/crm" className={navItemClass('/crm')}>
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>CRM Dashboard</span>}
              </Link>
              <Link href="/crm/leads" className={navItemClass('/crm/leads')}>
                <UserPlus className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Leads (360° View)</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[9px] font-bold">
                      {leads.length}
                    </span>
                  </div>
                )}
              </Link>
              <Link href="/crm/enquiries" className={navItemClass('/crm/enquiries')}>
                <FileText className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Enquiries</span>}
              </Link>
              <Link href="/crm/customers" className={navItemClass('/crm/customers')}>
                <Building className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Customers Master</span>}
              </Link>
              <Link href="/crm/opportunities" className={navItemClass('/crm/opportunities')}>
                <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Opportunities</span>}
              </Link>
              <Link href="/crm/follow-ups" className={navItemClass('/crm/follow-ups')}>
                <PhoneCall className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Follow-ups (Today)</span>}
              </Link>
              <Link href="/crm/visits" className={navItemClass('/crm/visits')}>
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Site Visits</span>}
              </Link>
              <Link href="/crm/exhibitions" className={navItemClass('/crm/exhibitions')}>
                <Calendar className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Exhibitions / Expo</span>}
              </Link>
              <Link href="/crm/quotations" className={navItemClass('/crm/quotations')}>
                <FileCheck2 className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Quotations & Rev</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold">
                      {quotations.length}
                    </span>
                  </div>
                )}
              </Link>
              <Link href="/crm/customer-po" className={navItemClass('/crm/customer-po')}>
                <Briefcase className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Customer POs</span>}
              </Link>
              <Link href="/crm/sales-orders" className={navItemClass('/crm/sales-orders')}>
                <Layers className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Sales Orders</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                      {salesOrders.length}
                    </span>
                  </div>
                )}
              </Link>
              <Link href="/crm/reports" className={navItemClass('/crm/reports')}>
                <TrendingUp className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>Commercial Reports</span>}
              </Link>
            </div>
          )}
        </div>

        {/* 2. PROJECT MANAGEMENT & JOB MANAGEMENT (MODULE 2) */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setProjectOpen(!projectOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider hover:text-white transition"
            >
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Project & Job Mgmt</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !projectOpen && '-rotate-90')} />
            </button>
          )}

          {(projectOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              <Link href="/projects/dashboard" className={navItemClass('/projects/dashboard')}>
                <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </Link>
              <Link href="/projects/list" className={navItemClass('/projects/list')}>
                <Briefcase className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Projects</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">
                      {projectJobs.length}
                    </span>
                  </div>
                )}
              </Link>
              <Link href="/projects/jobs" className={navItemClass('/projects/jobs')}>
                <Cpu className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>Jobs (360° View)</span>}
              </Link>
              <Link href="/projects/planning" className={navItemClass('/projects/planning')}>
                <Workflow className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>Project Planning</span>}
              </Link>
              <Link href="/projects/tasks" className={navItemClass('/projects/tasks')}>
                <CheckSquare className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Tasks & Dependencies</span>}
              </Link>
              <Link href="/projects/milestones" className={navItemClass('/projects/milestones')}>
                <Flag className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>Milestones</span>}
              </Link>
              <Link href="/projects/department-assignments" className={navItemClass('/projects/department-assignments')}>
                <Users className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>Dept Assignments</span>}
              </Link>
              <Link href="/projects/timeline" className={navItemClass('/projects/timeline')}>
                <Clock className="w-4 h-4 flex-shrink-0 text-orange-400" />
                {!sidebarCollapsed && <span>Project Timeline</span>}
              </Link>
              <Link href="/projects/documents" className={navItemClass('/projects/documents')}>
                <Folder className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>Project Documents</span>}
              </Link>
              <Link href="/projects/cost" className={navItemClass('/projects/cost')}>
                <DollarSign className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Project Cost</span>}
              </Link>
              <Link href="/projects/issues" className={navItemClass('/projects/issues')}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                {!sidebarCollapsed && <span>Project Issues</span>}
              </Link>
              <Link href="/projects/delays" className={navItemClass('/projects/delays')}>
                <Clock className="w-4 h-4 flex-shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span>Project Delays</span>}
              </Link>
              <Link href="/projects/change-requests" className={navItemClass('/projects/change-requests')}>
                <RotateCcw className="w-4 h-4 flex-shrink-0 text-pink-400" />
                {!sidebarCollapsed && <span>Change Requests</span>}
              </Link>
              <Link href="/projects/activity" className={navItemClass('/projects/activity')}>
                <ActivityIcon className="w-4 h-4 flex-shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>Project Activity</span>}
              </Link>
              <Link href="/projects/reports" className={navItemClass('/projects/reports')}>
                <BarChart3 className="w-4 h-4 flex-shrink-0 text-blue-500" />
                {!sidebarCollapsed && <span>Project Reports</span>}
              </Link>
            </div>
          )}
        </div>

        {/* 3. DESIGNER / ENGINEERING MANAGEMENT (MODULE 3) */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setDesignerOpen(!designerOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider hover:text-white transition"
            >
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Designer & Engineering</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !designerOpen && '-rotate-90')} />
            </button>
          )}

          {(designerOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              <Link href="/designer/dashboard" className={navItemClass('/designer/dashboard')}>
                <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </Link>
              <Link href="/designer/jobs" className={navItemClass('/designer/jobs')}>
                <Palette className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Design Jobs</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold">
                      {designJobs.length}
                    </span>
                  </div>
                )}
              </Link>
              <Link href="/designer/customer-requirements" className={navItemClass('/designer/customer-requirements')}>
                <FileText className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Customer Requirements</span>}
              </Link>
              <Link href="/designer/planning" className={navItemClass('/designer/planning')}>
                <Compass className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>Design Planning</span>}
              </Link>
              <Link href="/designer/drawings-2d" className={navItemClass('/designer/drawings-2d')}>
                <FileCheck className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>2D Drawings</span>}
              </Link>
              <Link href="/designer/designs-3d" className={navItemClass('/designer/designs-3d')}>
                <Box className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>3D Designs</span>}
              </Link>
              <Link href="/designer/assembly-drawings" className={navItemClass('/designer/assembly-drawings')}>
                <Layers className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Assembly Drawings</span>}
              </Link>
              <Link href="/designer/part-drawings" className={navItemClass('/designer/part-drawings')}>
                <CheckSquare className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>Part Drawings</span>}
              </Link>
              <Link href="/designer/bom" className={navItemClass('/designer/bom')}>
                <FileSpreadsheet className="w-4 h-4 flex-shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span>BOM</span>}
              </Link>
              <Link href="/designer/bom-revisions" className={navItemClass('/designer/bom-revisions')}>
                <GitBranch className="w-4 h-4 flex-shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>BOM Revisions</span>}
              </Link>
              <Link href="/designer/revisions" className={navItemClass('/designer/revisions')}>
                <RotateCcw className="w-4 h-4 flex-shrink-0 text-pink-400" />
                {!sidebarCollapsed && <span>Design Revisions</span>}
              </Link>
              <Link href="/designer/review" className={navItemClass('/designer/review')}>
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-orange-400" />
                {!sidebarCollapsed && <span>Design Review</span>}
              </Link>
              <Link href="/designer/approval" className={navItemClass('/designer/approval')}>
                <Zap className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Approval & Release</span>}
              </Link>
              <Link href="/designer/technical-documents" className={navItemClass('/designer/technical-documents')}>
                <FolderOpen className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>Technical Documents</span>}
              </Link>
              <Link href="/designer/reports" className={navItemClass('/designer/reports')}>
                <BarChart3 className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>Designer Reports</span>}
              </Link>
            </div>
          )}
        </div>

        {/* 4. PURCHASE MANAGEMENT (MODULE 4) */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setPurchaseOpen(!purchaseOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider hover:text-white transition"
            >
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Purchase Management</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !purchaseOpen && '-rotate-90')} />
            </button>
          )}

          {(purchaseOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              <Link href="/purchase/dashboard" className={navItemClass('/purchase/dashboard')}>
                <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Purchase Dashboard</span>}
              </Link>
              <Link href="/purchase/mrp" className={navItemClass('/purchase/mrp')}>
                <Cpu className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Material Requirement / MRP</span>}
              </Link>
              <Link href="/purchase/requisition" className={navItemClass('/purchase/requisition')}>
                <FileText className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Purchase Requisition</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[9px] font-mono font-bold">
                      {purchaseRequisitions.length}
                    </span>
                  </div>
                )}
              </Link>
              <Link href="/purchase/suppliers" className={navItemClass('/purchase/suppliers')}>
                <Building className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>Supplier Master</span>}
              </Link>
              <Link href="/purchase/supplier-contacts" className={navItemClass('/purchase/supplier-contacts')}>
                <Users className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>Supplier Contacts</span>}
              </Link>
              <Link href="/purchase/rfq" className={navItemClass('/purchase/rfq')}>
                <ClipboardList className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>RFQ (Request for Quotation)</span>}
              </Link>
              <Link href="/purchase/quotations" className={navItemClass('/purchase/quotations')}>
                <FileCheck2 className="w-4 h-4 flex-shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span>Supplier Quotations</span>}
              </Link>
              <Link href="/purchase/quotation-comparison" className={navItemClass('/purchase/quotation-comparison')}>
                <FileSpreadsheet className="w-4 h-4 flex-shrink-0 text-pink-400" />
                {!sidebarCollapsed && <span>Quotation Comparison</span>}
              </Link>
              <Link href="/purchase/po" className={navItemClass('/purchase/po')}>
                <ShoppingCart className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Purchase Orders</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                      {purchaseOrders.length}
                    </span>
                  </div>
                )}
              </Link>
              <Link href="/purchase/po-approval" className={navItemClass('/purchase/po-approval')}>
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>PO Approval</span>}
              </Link>
              <Link href="/purchase/followup" className={navItemClass('/purchase/followup')}>
                <Truck className="w-4 h-4 flex-shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>Purchase Follow-up</span>}
              </Link>
              <Link href="/purchase/pending" className={navItemClass('/purchase/pending')}>
                <Clock className="w-4 h-4 flex-shrink-0 text-rose-400" />
                {!sidebarCollapsed && <span>Pending / Overdue</span>}
              </Link>
              <Link href="/purchase/returns" className={navItemClass('/purchase/returns')}>
                <CornerUpLeft className="w-4 h-4 flex-shrink-0 text-orange-400" />
                {!sidebarCollapsed && <span>Purchase Returns</span>}
              </Link>
              <Link href="/purchase/reports" className={navItemClass('/purchase/reports')}>
                <BarChart3 className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>Purchase Reports</span>}
              </Link>
            </div>
          )}
        </div>

        {/* 5. STORE & WAREHOUSE MANAGEMENT (MODULE 5) */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setStoreOpen(!storeOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-sky-400 uppercase tracking-wider hover:text-white transition"
            >
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Store & Warehouse</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !storeOpen && '-rotate-90')} />
            </button>
          )}

          {(storeOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              <Link href="/store/dashboard" className={navItemClass('/store/dashboard')}>
                <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>Store Dashboard</span>}
              </Link>
              <Link href="/store/items" className={navItemClass('/store/items')}>
                <Package className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Item / Material Master</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[9px] font-mono font-bold">
                      {itemMasters.length}
                    </span>
                  </div>
                )}
              </Link>
              <Link href="/store/categories" className={navItemClass('/store/categories')}>
                <Layers className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>Item Categories</span>}
              </Link>
              <Link href="/store/uom" className={navItemClass('/store/uom')}>
                <Compass className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Units of Measurement</span>}
              </Link>
              <Link href="/store/warehouses" className={navItemClass('/store/warehouses')}>
                <Building className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>Warehouses Master</span>}
              </Link>
              <Link href="/store/locations" className={navItemClass('/store/locations')}>
                <MapPin className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>Store Locations / Bins</span>}
              </Link>
              <Link href="/store/opening-stock" className={navItemClass('/store/opening-stock')}>
                <Sparkles className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Opening Stock Entry</span>}
              </Link>
              <Link href="/store/grn" className={navItemClass('/store/grn')}>
                <PackageCheck className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Goods Receipt / GRN</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold">
                      {goodsReceipts.length}
                    </span>
                  </div>
                )}
              </Link>
              <Link href="/store/qc-inspection" className={navItemClass('/store/qc-inspection')}>
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-orange-400" />
                {!sidebarCollapsed && <span>Quality Inspection</span>}
              </Link>
              <Link href="/store/stock" className={navItemClass('/store/stock')}>
                <Box className="w-4 h-4 flex-shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>Stock Matrix (Usable)</span>}
              </Link>
              <Link href="/store/reservations" className={navItemClass('/store/reservations')}>
                <Lock className="w-4 h-4 flex-shrink-0 text-rose-400" />
                {!sidebarCollapsed && <span>Stock Reservation</span>}
              </Link>
              <Link href="/store/material-issue" className={navItemClass('/store/material-issue')}>
                <Truck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Material Issue</span>}
              </Link>
              <Link href="/store/material-return" className={navItemClass('/store/material-return')}>
                <CornerUpLeft className="w-4 h-4 flex-shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span>Material Return</span>}
              </Link>
              <Link href="/store/transfers" className={navItemClass('/store/transfers')}>
                <Workflow className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>Stock Transfer</span>}
              </Link>
              <Link href="/store/adjustments" className={navItemClass('/store/adjustments')}>
                <RotateCcw className="w-4 h-4 flex-shrink-0 text-pink-400" />
                {!sidebarCollapsed && <span>Stock Adjustment</span>}
              </Link>
              <Link href="/store/scrap" className={navItemClass('/store/scrap')}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-yellow-500" />
                {!sidebarCollapsed && <span>Scrap & Rejection</span>}
              </Link>
              <Link href="/store/ledger" className={navItemClass('/store/ledger')}>
                <History className="w-4 h-4 flex-shrink-0 text-slate-300" />
                {!sidebarCollapsed && <span>Stock Ledger</span>}
              </Link>
              <Link href="/store/stock-count" className={navItemClass('/store/stock-count')}>
                <CheckSquare className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>Physical Stock Count</span>}
              </Link>
              <Link href="/store/reorder" className={navItemClass('/store/reorder')}>
                <Zap className="w-4 h-4 flex-shrink-0 text-red-400" />
                {!sidebarCollapsed && <span>Low Stock / Reorder</span>}
              </Link>
              <Link href="/store/reports" className={navItemClass('/store/reports')}>
                <BarChart3 className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>Store Reports (21)</span>}
              </Link>
            </div>
          )}
        </div>

        {/* MODULE 6: PRODUCTION / MANUFACTURING / MRP */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setProductionOpen(!productionOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-orange-400 uppercase tracking-wider hover:text-orange-300 transition"
            >
              <div className="flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-orange-400" />
                <span>Production & Shop Floor</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !productionOpen && '-rotate-90')} />
            </button>
          )}

          {(productionOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              <Link href="/production/dashboard" className={navItemClass('/production/dashboard')}>
                <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-orange-400" />
                {!sidebarCollapsed && <span>Production Dashboard</span>}
              </Link>
              <Link href="/production/planning" className={navItemClass('/production/planning')}>
                <Compass className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Production Planning</span>}
              </Link>
              <Link href="/production/jobs" className={navItemClass('/production/jobs')}>
                <Briefcase className="w-4 h-4 flex-shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>Manufacturing Jobs</span>}
              </Link>
              <Link href="/production/work-orders" className={navItemClass('/production/work-orders')}>
                <ClipboardList className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Work Orders</span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono font-bold">
                      {workOrders ? workOrders.length : 0}
                    </span>
                  </div>
                )}
              </Link>
              <Link href="/production/orders" className={navItemClass('/production/orders')}>
                <FileText className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Production Orders</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                      {productionOrders ? productionOrders.length : 0}
                    </span>
                  </div>
                )}
              </Link>
              <Link href="/production/routing" className={navItemClass('/production/routing')}>
                <GitBranch className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>Routing & Operations</span>}
              </Link>
              <Link href="/production/work-centers" className={navItemClass('/production/work-centers')}>
                <Wrench className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>Work Centers & Machines</span>}
              </Link>
              <Link href="/production/schedule" className={navItemClass('/production/schedule')}>
                <Calendar className="w-4 h-4 flex-shrink-0 text-pink-400" />
                {!sidebarCollapsed && <span>Production Schedule</span>}
              </Link>
              <Link href="/production/mrp" className={navItemClass('/production/mrp')}>
                <Cpu className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                {!sidebarCollapsed && <span>Material Requirement / MRP</span>}
              </Link>
              <Link href="/production/material-availability" className={navItemClass('/production/material-availability')}>
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>Material Availability Check</span>}
              </Link>
              <Link href="/production/material-issue" className={navItemClass('/production/material-issue')}>
                <Truck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Material Issue Request</span>}
              </Link>
              <Link href="/production/wip" className={navItemClass('/production/wip')}>
                <Layers className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>WIP Tracking Matrix</span>}
              </Link>
              <Link href="/production/entry" className={navItemClass('/production/entry')}>
                <PlayCircle className="w-4 h-4 flex-shrink-0 text-lime-400" />
                {!sidebarCollapsed && <span>Operator Production Entry</span>}
              </Link>
              <Link href="/production/operation-production" className={navItemClass('/production/operation-production')}>
                <Workflow className="w-4 h-4 flex-shrink-0 text-violet-400" />
                {!sidebarCollapsed && <span>Operation Progress</span>}
              </Link>
              <Link href="/production/rework" className={navItemClass('/production/rework')}>
                <RotateCcw className="w-4 h-4 flex-shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span>Rework Order Manager</span>}
              </Link>
              <Link href="/production/scrap" className={navItemClass('/production/scrap')}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                {!sidebarCollapsed && <span>Production Scrap Tracker</span>}
              </Link>
              <Link href="/production/hold" className={navItemClass('/production/hold')}>
                <PauseCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                {!sidebarCollapsed && <span>Production Hold Manager</span>}
              </Link>
              <Link href="/production/completion" className={navItemClass('/production/completion')}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Completion & QC Clearance</span>}
              </Link>
              <Link href="/production/finished-goods" className={navItemClass('/production/finished-goods')}>
                <PackageCheck className="w-4 h-4 flex-shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>Finished Goods Warehouse</span>}
              </Link>
              <Link href="/production/cost" className={navItemClass('/production/cost')}>
                <DollarSign className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Job Production Costing</span>}
              </Link>
              <Link href="/production/reports" className={navItemClass('/production/reports')}>
                <BarChart3 className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Production Reports (18)</span>}
              </Link>
            </div>
          )}
        </div>

        {/* MODULE 7: ACCOUNTING & FINANCE */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setAccountingOpen(!accountingOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider hover:text-emerald-300 transition"
            >
              <div className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>Accounting & Finance</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !accountingOpen && '-rotate-90')} />
            </button>
          )}

          {(accountingOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              <Link href="/accounting/dashboard" className={navItemClass('/accounting/dashboard')}>
                <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Accounting Dashboard</span>}
              </Link>
              <Link href="/accounting/chart-of-accounts" className={navItemClass('/accounting/chart-of-accounts')}>
                <GitBranch className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>Chart of Accounts</span>}
              </Link>
              <Link href="/accounting/account-groups" className={navItemClass('/accounting/account-groups')}>
                <Folder className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>Account Groups</span>}
              </Link>
              <Link href="/accounting/customers" className={navItemClass('/accounting/customers')}>
                <Users className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>Customer Ledgers</span>}
              </Link>
              <Link href="/accounting/suppliers" className={navItemClass('/accounting/suppliers')}>
                <Building className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>Supplier Ledgers</span>}
              </Link>
              <Link href="/accounting/sales-invoices" className={navItemClass('/accounting/sales-invoices')}>
                <Receipt className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Sales Invoices</span>}
              </Link>
              <Link href="/accounting/purchase-invoices" className={navItemClass('/accounting/purchase-invoices')}>
                <FileText className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>Purchase Invoices</span>}
              </Link>
              <Link href="/accounting/credit-notes" className={navItemClass('/accounting/credit-notes')}>
                <CreditCard className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Credit Notes</span>}
              </Link>
              <Link href="/accounting/debit-notes" className={navItemClass('/accounting/debit-notes')}>
                <CreditCard className="w-4 h-4 flex-shrink-0 text-rose-400" />
                {!sidebarCollapsed && <span>Debit Notes</span>}
              </Link>
              <Link href="/accounting/receipts" className={navItemClass('/accounting/receipts')}>
                <Coins className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Customer Receipts</span>}
              </Link>
              <Link href="/accounting/payments" className={navItemClass('/accounting/payments')}>
                <Banknote className="w-4 h-4 flex-shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>Supplier Payments</span>}
              </Link>
              <Link href="/accounting/journal-entries" className={navItemClass('/accounting/journal-entries')}>
                <FileSpreadsheet className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Journal Entries (JV)</span>}
              </Link>
              <Link href="/accounting/contra-entries" className={navItemClass('/accounting/contra-entries')}>
                <RotateCcw className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>Contra Entries</span>}
              </Link>
              <Link href="/accounting/expenses" className={navItemClass('/accounting/expenses')}>
                <Wallet className="w-4 h-4 flex-shrink-0 text-orange-400" />
                {!sidebarCollapsed && <span>Expense Management</span>}
              </Link>
              <Link href="/accounting/cash-bank" className={navItemClass('/accounting/cash-bank')}>
                <Landmark className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>Cash & Bank Accounts</span>}
              </Link>
              <Link href="/accounting/bank-reconciliation" className={navItemClass('/accounting/bank-reconciliation')}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Bank Reconciliation</span>}
              </Link>
              <Link href="/accounting/gst" className={navItemClass('/accounting/gst')}>
                <Scale className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                {!sidebarCollapsed && <span>GST Management</span>}
              </Link>
              <Link href="/accounting/tds" className={navItemClass('/accounting/tds')}>
                <Calculator className="w-4 h-4 flex-shrink-0 text-violet-400" />
                {!sidebarCollapsed && <span>TDS Compliance</span>}
              </Link>
              <Link href="/accounting/accounts-receivable" className={navItemClass('/accounting/accounts-receivable')}>
                <TrendingUp className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Accounts Receivable (AR)</span>}
              </Link>
              <Link href="/accounting/accounts-payable" className={navItemClass('/accounting/accounts-payable')}>
                <Clock className="w-4 h-4 flex-shrink-0 text-rose-400" />
                {!sidebarCollapsed && <span>Accounts Payable (AP)</span>}
              </Link>
              <Link href="/accounting/outstanding" className={navItemClass('/accounting/outstanding')}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span>Outstanding & Reminders</span>}
              </Link>
              <Link href="/accounting/job-costing" className={navItemClass('/accounting/job-costing')}>
                <DollarSign className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Job-wise Costing</span>}
              </Link>
              <Link href="/accounting/project-costing" className={navItemClass('/accounting/project-costing')}>
                <Briefcase className="w-4 h-4 flex-shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>Project Financial Costing</span>}
              </Link>
              <Link href="/accounting/inventory-valuation" className={navItemClass('/accounting/inventory-valuation')}>
                <Box className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>Inventory Financial Valuation</span>}
              </Link>
              <Link href="/accounting/fixed-assets" className={navItemClass('/accounting/fixed-assets')}>
                <Building className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>Fixed Assets Master</span>}
              </Link>
              <Link href="/accounting/depreciation" className={navItemClass('/accounting/depreciation')}>
                <History className="w-4 h-4 flex-shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>Depreciation Schedule</span>}
              </Link>
              <Link href="/accounting/financial-reports" className={navItemClass('/accounting/financial-reports')}>
                <FileBarChart className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Financial Reports (35)</span>}
              </Link>
              <Link href="/accounting/settings" className={navItemClass('/accounting/settings')}>
                <Settings className="w-4 h-4 flex-shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>Accounting Settings</span>}
              </Link>
            </div>
          )}
        </div>

        {/* MODULE 8: MAINTENANCE & SERVICES */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setMaintenanceOpen(!maintenanceOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition"
            >
              <div className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>Maintenance & Services</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !maintenanceOpen && '-rotate-90')} />
            </button>
          )}

          {(maintenanceOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              <Link href="/maintenance/dashboard" className={navItemClass('/maintenance/dashboard')}>
                <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>Maintenance Dashboard</span>}
              </Link>
              <Link href="/maintenance/assets" className={navItemClass('/maintenance/assets')}>
                <Cpu className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>Asset / Machine Master</span>}
              </Link>
              <Link href="/maintenance/customer-machines" className={navItemClass('/maintenance/customer-machines')}>
                <Building className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>Customer Machines</span>}
              </Link>
              <Link href="/maintenance/service-requests" className={navItemClass('/maintenance/service-requests')}>
                <PhoneCall className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Service Requests</span>}
              </Link>
              <Link href="/maintenance/breakdowns" className={navItemClass('/maintenance/breakdowns')}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                {!sidebarCollapsed && <span>Breakdown Management</span>}
              </Link>
              <Link href="/maintenance/preventive" className={navItemClass('/maintenance/preventive')}>
                <RotateCcw className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>Preventive Maintenance</span>}
              </Link>
              <Link href="/maintenance/schedule" className={navItemClass('/maintenance/schedule')}>
                <Calendar className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>Maintenance Schedule</span>}
              </Link>
              <Link href="/maintenance/service-planning" className={navItemClass('/maintenance/service-planning')}>
                <Workflow className="w-4 h-4 flex-shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>Service Planning</span>}
              </Link>
              <Link href="/maintenance/technicians" className={navItemClass('/maintenance/technicians')}>
                <Users className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Technician Assignment</span>}
              </Link>
              <Link href="/maintenance/service-visits" className={navItemClass('/maintenance/service-visits')}>
                <MapPin className="w-4 h-4 flex-shrink-0 text-orange-400" />
                {!sidebarCollapsed && <span>Service Visits</span>}
              </Link>
              <Link href="/maintenance/work-orders" className={navItemClass('/maintenance/work-orders')}>
                <ClipboardList className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>Service Work Orders</span>}
              </Link>
              <Link href="/maintenance/spare-parts" className={navItemClass('/maintenance/spare-parts')}>
                <Package className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Spare Parts (Store)</span>}
              </Link>
              <Link href="/maintenance/parts-issue" className={navItemClass('/maintenance/parts-issue')}>
                <PackageCheck className="w-4 h-4 flex-shrink-0 text-violet-400" />
                {!sidebarCollapsed && <span>Service Parts Issue</span>}
              </Link>
              <Link href="/maintenance/parts-return" className={navItemClass('/maintenance/parts-return')}>
                <CornerUpLeft className="w-4 h-4 flex-shrink-0 text-rose-400" />
                {!sidebarCollapsed && <span>Service Parts Return</span>}
              </Link>
              <Link href="/maintenance/service-reports" className={navItemClass('/maintenance/service-reports')}>
                <FileCheck2 className="w-4 h-4 flex-shrink-0 text-green-400" />
                {!sidebarCollapsed && <span>Service Reports</span>}
              </Link>
              <Link href="/maintenance/warranty" className={navItemClass('/maintenance/warranty')}>
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>Warranty Management</span>}
              </Link>
              <Link href="/maintenance/amc" className={navItemClass('/maintenance/amc')}>
                <FileCheck className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>AMC Management</span>}
              </Link>
              <Link href="/maintenance/contracts" className={navItemClass('/maintenance/contracts')}>
                <FileSpreadsheet className="w-4 h-4 flex-shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>Service Contracts</span>}
              </Link>
              <Link href="/maintenance/customer-history" className={navItemClass('/maintenance/customer-history')}>
                <History className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>Customer Service History</span>}
              </Link>
              <Link href="/maintenance/internal-maintenance" className={navItemClass('/maintenance/internal-maintenance')}>
                <Factory className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>Internal Maintenance</span>}
              </Link>
              <Link href="/maintenance/downtime" className={navItemClass('/maintenance/downtime')}>
                <Clock className="w-4 h-4 flex-shrink-0 text-red-400" />
                {!sidebarCollapsed && <span>Downtime Tracking</span>}
              </Link>
              <Link href="/maintenance/costs" className={navItemClass('/maintenance/costs')}>
                <DollarSign className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>Maintenance Costs</span>}
              </Link>
              <Link href="/maintenance/reports" className={navItemClass('/maintenance/reports')}>
                <BarChart3 className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                {!sidebarCollapsed && <span>Maintenance Reports (17)</span>}
              </Link>
            </div>
          )}
        </div>

        {/* MODULE 9: HR & PAYROLL */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setHrOpen(!hrOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition"
            >
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-pink-400" />
                <span>HR & Payroll</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !hrOpen && '-rotate-90')} />
            </button>
          )}

          {(hrOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              {/* HR */}
              {!sidebarCollapsed && <div className="px-3 pt-1 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">HR</div>}
              <Link href="/hr/dashboard" className={navItemClass('/hr/dashboard')}>
                <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-pink-400" />
                {!sidebarCollapsed && <span>1. HR Dashboard</span>}
              </Link>
              <Link href="/hr/employees" className={navItemClass('/hr/employees')}>
                <UserCheck className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>2. Employee Master</span>}
              </Link>
              <Link href="/hr/departments" className={navItemClass('/hr/departments')}>
                <Building className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>3. Departments</span>}
              </Link>
              <Link href="/hr/designations" className={navItemClass('/hr/designations')}>
                <Briefcase className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>4. Designations</span>}
              </Link>
              <Link href="/hr/documents" className={navItemClass('/hr/documents')}>
                <FileText className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>5. Employee Documents</span>}
              </Link>
              <Link href="/hr/onboarding" className={navItemClass('/hr/onboarding')}>
                <UserPlus className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>6. Employee Onboarding</span>}
              </Link>
              <Link href="/hr/transfers" className={navItemClass('/hr/transfers')}>
                <Workflow className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>7. Employee Transfers</span>}
              </Link>
              <Link href="/hr/promotions" className={navItemClass('/hr/promotions')}>
                <TrendingUp className="w-4 h-4 flex-shrink-0 text-rose-400" />
                {!sidebarCollapsed && <span>8. Promotion & Increment</span>}
              </Link>
              <Link href="/hr/exits" className={navItemClass('/hr/exits')}>
                <History className="w-4 h-4 flex-shrink-0 text-red-400" />
                {!sidebarCollapsed && <span>9. Resignation / Exit</span>}
              </Link>
              <Link href="/hr/settlement" className={navItemClass('/hr/settlement')}>
                <Calculator className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>10. Full & Final Settlement</span>}
              </Link>

              {/* Attendance */}
              {!sidebarCollapsed && <div className="px-3 pt-2 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Attendance</div>}
              <Link href="/hr/attendance" className={navItemClass('/hr/attendance')}>
                <Clock className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>11. Attendance</span>}
              </Link>
              <Link href="/hr/shifts" className={navItemClass('/hr/shifts')}>
                <Layers className="w-4 h-4 flex-shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>12. Shift Management</span>}
              </Link>
              <Link href="/hr/roster" className={navItemClass('/hr/roster')}>
                <Calendar className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>13. Shift Roster</span>}
              </Link>
              <Link href="/hr/holidays" className={navItemClass('/hr/holidays')}>
                <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>14. Holiday Calendar</span>}
              </Link>
              <Link href="/hr/leaves" className={navItemClass('/hr/leaves')}>
                <FileCheck2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>15. Leave Management</span>}
              </Link>
              <Link href="/hr/leave-approvals" className={navItemClass('/hr/leave-approvals')}>
                <CheckSquare className="w-4 h-4 flex-shrink-0 text-green-400" />
                {!sidebarCollapsed && <span>16. Leave Approvals</span>}
              </Link>
              <Link href="/hr/wfh" className={navItemClass('/hr/wfh')}>
                <Compass className="w-4 h-4 flex-shrink-0 text-violet-400" />
                {!sidebarCollapsed && <span>17. WFH / Remote Work</span>}
              </Link>
              <Link href="/hr/missed-punch" className={navItemClass('/hr/missed-punch')}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-orange-400" />
                {!sidebarCollapsed && <span>18. Missed Punch</span>}
              </Link>
              <Link href="/hr/regularization" className={navItemClass('/hr/regularization')}>
                <RotateCcw className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                {!sidebarCollapsed && <span>19. Attendance Regularization</span>}
              </Link>
              <Link href="/hr/overtime" className={navItemClass('/hr/overtime')}>
                <Zap className="w-4 h-4 flex-shrink-0 text-red-400" />
                {!sidebarCollapsed && <span>20. Overtime</span>}
              </Link>
              <Link href="/hr/early-checkout" className={navItemClass('/hr/early-checkout')}>
                <History className="w-4 h-4 flex-shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>21. Early Checkout</span>}
              </Link>

              {/* Payroll */}
              {!sidebarCollapsed && <div className="px-3 pt-2 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Payroll</div>}
              <Link href="/hr/payroll-dashboard" className={navItemClass('/hr/payroll-dashboard')}>
                <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>22. Payroll Dashboard</span>}
              </Link>
              <Link href="/hr/salary-structures" className={navItemClass('/hr/salary-structures')}>
                <Layers className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>23. Salary Structure</span>}
              </Link>
              <Link href="/hr/salary-components" className={navItemClass('/hr/salary-components')}>
                <Calculator className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>24. Salary Components</span>}
              </Link>
              <Link href="/hr/monthly-payroll" className={navItemClass('/hr/monthly-payroll')}>
                <Banknote className="w-4 h-4 flex-shrink-0 text-green-400" />
                {!sidebarCollapsed && <span>25. Monthly Payroll</span>}
              </Link>
              <Link href="/hr/payroll-approvals" className={navItemClass('/hr/payroll-approvals')}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>26. Payroll Approval</span>}
              </Link>
              <Link href="/hr/advances" className={navItemClass('/hr/advances')}>
                <Wallet className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>27. Employee Advances / Loans</span>}
              </Link>
              <Link href="/hr/reimbursements" className={navItemClass('/hr/reimbursements')}>
                <Receipt className="w-4 h-4 flex-shrink-0 text-rose-400" />
                {!sidebarCollapsed && <span>28. Reimbursements / Expenses</span>}
              </Link>
              <Link href="/hr/payslips" className={navItemClass('/hr/payslips')}>
                <FileText className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>29. Payslips</span>}
              </Link>
              <Link href="/hr/payroll-reports" className={navItemClass('/hr/payroll-reports')}>
                <FileBarChart className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>30. Payroll Reports</span>}
              </Link>

              {/* Performance & Development */}
              {!sidebarCollapsed && <div className="px-3 pt-2 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Performance</div>}
              <Link href="/hr/performance" className={navItemClass('/hr/performance')}>
                <ActivityIcon className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                {!sidebarCollapsed && <span>31. Performance Management</span>}
              </Link>
              <Link href="/hr/kpis" className={navItemClass('/hr/kpis')}>
                <Flag className="w-4 h-4 flex-shrink-0 text-red-400" />
                {!sidebarCollapsed && <span>32. KPI Management</span>}
              </Link>
              <Link href="/hr/appraisals" className={navItemClass('/hr/appraisals')}>
                <TrendingUp className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>33. Appraisal</span>}
              </Link>
              <Link href="/hr/training" className={navItemClass('/hr/training')}>
                <Sparkles className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>34. Training & Development</span>}
              </Link>

              {/* Recruitment */}
              {!sidebarCollapsed && <div className="px-3 pt-2 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Recruitment</div>}
              <Link href="/hr/recruitment" className={navItemClass('/hr/recruitment')}>
                <Users className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>35. Recruitment Dashboard</span>}
              </Link>
              <Link href="/hr/job-positions" className={navItemClass('/hr/job-positions')}>
                <Briefcase className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>36. Job Positions</span>}
              </Link>
              <Link href="/hr/candidates" className={navItemClass('/hr/candidates')}>
                <UserPlus className="w-4 h-4 flex-shrink-0 text-pink-400" />
                {!sidebarCollapsed && <span>37. Candidates</span>}
              </Link>
              <Link href="/hr/interviews" className={navItemClass('/hr/interviews')}>
                <PhoneCall className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>38. Interview Management</span>}
              </Link>
              <Link href="/hr/offers" className={navItemClass('/hr/offers')}>
                <FileCheck className="w-4 h-4 flex-shrink-0 text-green-400" />
                {!sidebarCollapsed && <span>39. Offer Management</span>}
              </Link>
            </div>
          )}
        </div>

        {/* MODULE 10: INTEGRATION & MANAGEMENT 360° */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setIntegrationOpen(!integrationOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-teal-400 uppercase tracking-wider hover:text-white transition"
            >
              <div className="flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5 text-cyan-400" />
                <span>Integration & 360°</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !integrationOpen && '-rotate-90')} />
            </button>
          )}

          {(integrationOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              <Link href="/integration/job-360" className={navItemClass('/integration/job-360')}>
                <Compass className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>1. Job 360° Overview</span>}
              </Link>
              <Link href="/integration/management-dashboard" className={navItemClass('/integration/management-dashboard')}>
                <BarChart3 className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>2. Executive Dashboard</span>}
              </Link>
              <Link href="/integration/alert-center" className={navItemClass('/integration/alert-center')}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>3. Action & Alert Center</span>}
              </Link>
              <Link href="/integration/approval-center" className={navItemClass('/integration/approval-center')}>
                <CheckSquare className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>4. Approval Center</span>}
              </Link>
              <Link href="/integration/customer-360" className={navItemClass('/integration/customer-360')}>
                <UserCheck className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>5. Customer 360°</span>}
              </Link>
              <Link href="/integration/supplier-360" className={navItemClass('/integration/supplier-360')}>
                <Truck className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>6. Supplier 360°</span>}
              </Link>
              <Link href="/integration/item-360" className={navItemClass('/integration/item-360')}>
                <Box className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>7. Item / Material 360°</span>}
              </Link>
              <Link href="/integration/employee-360" className={navItemClass('/integration/employee-360')}>
                <Users className="w-4 h-4 flex-shrink-0 text-pink-400" />
                {!sidebarCollapsed && <span>8. Employee 360°</span>}
              </Link>
              <Link href="/integration/activity-log" className={navItemClass('/integration/activity-log')}>
                <ActivityIcon className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                {!sidebarCollapsed && <span>9. Global Activity Trail</span>}
              </Link>
              <Link href="/reports/center" className={navItemClass('/reports/center')}>
                <FileBarChart className="w-4 h-4 flex-shrink-0 text-rose-400" />
                {!sidebarCollapsed && <span>10. ERP Reports Center</span>}
              </Link>
              <Link href="/reports/job-profitability" className={navItemClass('/reports/job-profitability')}>
                <Calculator className="w-4 h-4 flex-shrink-0 text-teal-400" />
                {!sidebarCollapsed && <span>11. Job Profitability</span>}
              </Link>
            </div>
          )}
        </div>

        {/* MODULE 11: TESTING, SECURITY & PRODUCTION DEPLOYMENT */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setTestingOpen(!testingOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Testing & Security</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !testingOpen && '-rotate-90')} />
            </button>
          )}

          {(testingOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              <Link href="/testing/uat-hub" className={navItemClass('/testing/uat-hub')}>
                <FileCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span>1. ERP UAT & Test Matrix</span>}
              </Link>
              <Link href="/testing/role-matrix" className={navItemClass('/testing/role-matrix')}>
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                {!sidebarCollapsed && <span>2. Role & Scope Tester</span>}
              </Link>
              <Link href="/testing/bug-tracker" className={navItemClass('/testing/bug-tracker')}>
                <Bug className="w-4 h-4 flex-shrink-0 text-red-400" />
                {!sidebarCollapsed && <span>3. Internal Bug Tracker</span>}
              </Link>
              <Link href="/settings/backup-restore" className={navItemClass('/settings/backup-restore')}>
                <Database className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                {!sidebarCollapsed && <span>4. Backup & Recovery</span>}
              </Link>
              <Link href="/settings/data-import" className={navItemClass('/settings/data-import')}>
                <UploadCloud className="w-4 h-4 flex-shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>5. Data Import Wizard</span>}
              </Link>
              <Link href="/settings/security-hub" className={navItemClass('/settings/security-hub')}>
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>6. Security & Audit Hub</span>}
              </Link>
              <Link href="/settings/release-notes" className={navItemClass('/settings/release-notes')}>
                <BookOpen className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>7. Go-Live & Release Notes</span>}
              </Link>
            </div>
          )}
        </div>

        {/* 2. COMMON ERP FOUNDATION & USER/ROLE MANAGEMENT */}
        <div className="pt-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition"
            >
              <div className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" />
                <span>Foundation & Admin</span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', !settingsOpen && '-rotate-90')} />
            </button>
          )}

          {(settingsOpen || sidebarCollapsed) && (
            <div className="space-y-0.5 mt-1">
              <Link href="/users" className={navItemClass('/users')}>
                <UserCheck className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Users & Employees</span>}
              </Link>
              <Link href="/departments" className={navItemClass('/departments')}>
                <Building className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Departments (9 Core)</span>}
              </Link>
              <Link href="/roles" className={navItemClass('/roles')}>
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Role Management</span>}
              </Link>
              <Link href="/permissions" className={navItemClass('/permissions')}>
                <Lock className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Permission Matrix</span>}
              </Link>
              <Link href="/settings/company" className={navItemClass('/settings/company')}>
                <Settings className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Company Profile</span>}
              </Link>
              <Link href="/settings/numbering" className={navItemClass('/settings/numbering')}>
                <Hash className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Numbering Series</span>}
              </Link>
              <Link href="/settings/audit-logs" className={navItemClass('/settings/audit-logs')}>
                <History className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Audit Trail Logs</span>}
              </Link>
              <Link href="/notifications" className={navItemClass('/notifications')}>
                <Bell className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Notifications</span>}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* User Hierarchy & Quick Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#070A14] flex-shrink-0">
        {!sidebarCollapsed ? (
          <Link href="/profile" className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 transition group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md">
              {currentUser.firstName.slice(0, 1)}
              {currentUser.lastName.slice(0, 1)}
            </div>
            <div className="truncate text-xs min-w-0 flex-1">
              <div className="font-bold text-white truncate group-hover:text-blue-400 transition">
                {currentUser.firstName} {currentUser.lastName}
              </div>
              <div className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider truncate">
                {currentUser.roleName}
              </div>
            </div>
          </Link>
        ) : (
          <Link href="/profile" className="w-8 h-8 mx-auto rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold text-xs block text-center shadow-md">
            {currentUser.firstName.slice(0, 1)}
          </Link>
        )}
      </div>
    </aside>
  );
}
