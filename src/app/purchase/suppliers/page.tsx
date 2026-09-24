'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  Building,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  X,
} from 'lucide-react';
import { Supplier } from '../../../types/purchase';

export default function SupplierMasterPage() {
  const { suppliers, addSupplier } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Supplier Form State
  const [newVendorCode, setNewVendorCode] = useState(`VEN-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Raw Material' | 'Bought-out Items' | 'Subcontractor' | 'Standard Components' | 'Services'>('Raw Material');
  const [newGstin, setNewGstin] = useState('');
  const [newPan, setNewPan] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Gujarat');
  const [newPaymentTerms, setNewPaymentTerms] = useState('30 Days Credit');

  const filteredSuppliers = suppliers.filter(s => {
    if (categoryFilter !== 'ALL' && s.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.vendorCode.toLowerCase().includes(q) ||
        s.gstin.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupp: Supplier = {
      id: `SUP-${Date.now()}`,
      vendorCode: newVendorCode,
      name: newName,
      category: newCategory,
      gstin: newGstin,
      panNumber: newPan,
      msmeRegistered: true,
      msmeNumber: 'UDYAM-GJ-01-0098765',
      address: 'Industrial GIDC Area',
      city: newCity || 'Ahmedabad',
      state: newState,
      pinCode: '380015',
      country: 'India',
      contactPerson: newContactPerson,
      phone: newPhone,
      email: newEmail,
      paymentTerms: newPaymentTerms,
      creditPeriodDays: 30,
      bankName: 'HDFC Bank',
      bankAccountNumber: '50200098765432',
      ifscCode: 'HDFC0000123',
      performanceRating: 85,
      status: 'Approved',
      documents: [
        { id: 'DOC-1', documentType: 'GST Certificate', documentName: 'GST_Reg.pdf', fileUrl: '#', uploadDate: '2026-04-01' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addSupplier(newSupp);
    setShowAddModal(false);
    setNewName('');
    setNewGstin('');
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/30">
              SUPPLIER MASTER
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Supplier & Vendor Master Registry</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Verified vendor profiles with GSTIN, MSME registration, payment terms & performance ratings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          Add Supplier Master
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Vendor Name, Code, GSTIN, City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 w-64"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Raw Material">Raw Material</option>
              <option value="Bought-out Items">Bought-out Items</option>
              <option value="Standard Components">Standard Components</option>
              <option value="Subcontractor">Subcontractor</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filteredSuppliers.length}</span> active vendors
        </div>
      </div>

      {/* Grid of Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map(supplier => (
          <div
            key={supplier.id}
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 space-y-3 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {supplier.vendorCode}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">{supplier.name}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  supplier.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  supplier.status === 'Pending Verification' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {supplier.status}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">Category:</span>
                  <span className="font-semibold text-white">{supplier.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">GSTIN:</span>
                  <span className="font-mono text-emerald-400">{supplier.gstin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-300">{supplier.city}, {supplier.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">Contact:</span>
                  <span className="text-slate-300">{supplier.contactPerson} ({supplier.phone})</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-mono text-xs font-bold text-amber-400">{supplier.performanceRating}%</span>
                <span className="text-[10px] text-slate-500">Rating</span>
              </div>

              <button
                onClick={() => setSelectedSupplier(supplier)}
                className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                <Eye className="w-3.5 h-3.5" />
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW SUPPLIER MODAL */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-bold">
                  {selectedSupplier.vendorCode}
                </span>
                <h2 className="text-lg font-black text-white mt-1">{selectedSupplier.name}</h2>
              </div>
              <button onClick={() => setSelectedSupplier(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                <div>
                  <div className="text-slate-500">GSTIN Number:</div>
                  <div className="font-mono font-bold text-emerald-400">{selectedSupplier.gstin}</div>
                </div>
                <div>
                  <div className="text-slate-500">PAN Number:</div>
                  <div className="font-mono font-bold text-white">{selectedSupplier.panNumber}</div>
                </div>
                <div>
                  <div className="text-slate-500">Payment Terms:</div>
                  <div className="font-semibold text-white">{selectedSupplier.paymentTerms}</div>
                </div>
                <div>
                  <div className="text-slate-500">MSME Registered:</div>
                  <div className="font-semibold text-blue-400">{selectedSupplier.msmeRegistered ? `Yes (${selectedSupplier.msmeNumber})` : 'No'}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Banking Information</h4>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between font-mono">
                  <span>Bank: {selectedSupplier.bankName}</span>
                  <span>A/C: {selectedSupplier.bankAccountNumber}</span>
                  <span>IFSC: {selectedSupplier.ifscCode}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedSupplier(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SUPPLIER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Add New Supplier Master</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Vendor Code</label>
                  <input
                    type="text"
                    value={newVendorCode}
                    onChange={(e) => setNewVendorCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white"
                  >
                    <option value="Raw Material">Raw Material</option>
                    <option value="Bought-out Items">Bought-out Items</option>
                    <option value="Standard Components">Standard Components</option>
                    <option value="Subcontractor">Subcontractor</option>
                    <option value="Services">Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Supplier Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Tata Steel Ltd"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="24AAAAA0000A1Z5"
                    value={newGstin}
                    onChange={(e) => setNewGstin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">PAN Number</label>
                  <input
                    type="text"
                    placeholder="AAAAA0000A"
                    value={newPan}
                    onChange={(e) => setNewPan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-800 text-white rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl">
                  Save Supplier Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
