'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useERP } from '../../../context/ERPContext';
import { DataTable, Column } from '../../../components/data/DataTable';
import { Customer } from '../../../types/crm';
import { formatCurrency } from '../../../lib/utils';
import { Building, Plus, ArrowUpRight, Mail, Phone } from 'lucide-react';

export default function CustomersListPage() {
  const router = useRouter();
  const { customers, addCustomer } = useERP();
  const [showModal, setShowModal] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Speciality Chemicals');
  const [contactPerson, setContactPerson] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [city, setCity] = useState('Vadodara');
  const [state, setState] = useState('Gujarat');
  const [address, setAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState(10000000);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      customerType: 'company',
      companyName,
      industry,
      gstin: gstin.toUpperCase(),
      pan: gstin.slice(2, 12) || 'AAACX0000X',
      contactPerson,
      designation: 'General Manager',
      mobile,
      email,
      billingAddress: address,
      shippingAddress: address,
      city,
      state,
      country: 'India',
      pincode: '390010',
      paymentTerms: '30% Advance, 70% against Dispatch',
      creditLimit,
      currency: 'INR (₹)',
      category: 'gold',
      assignedSalesPerson: 'Pravin Patel',
    });

    setCompanyName('');
    setContactPerson('');
    setMobile('');
    setEmail('');
    setShowModal(false);
  };

  const columns: Column<Customer>[] = [
    {
      header: 'Customer Code',
      accessorKey: 'customerCode',
      cell: (c) => <span className="font-mono font-bold text-blue-600">{c.customerCode}</span>,
    },
    {
      header: 'Company Name & GSTIN',
      cell: (c) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{c.companyName}</span>
          <span className="text-[10px] text-slate-400 font-mono">GST: {c.gstin}</span>
        </div>
      ),
    },
    {
      header: 'Industry Sector',
      accessorKey: 'industry',
    },
    {
      header: 'Key Contact Person',
      cell: (c) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{c.contactPerson}</span>
          <span className="text-[11px] text-slate-500">{c.mobile}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (c) => (
        <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
          {c.category}
        </span>
      ),
    },
    {
      header: 'Credit Limit',
      cell: (c) => <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{formatCurrency(c.creditLimit)}</span>,
    },
    {
      header: 'Location',
      cell: (c) => <span className="text-slate-600 dark:text-slate-400">{c.city}, {c.state}</span>,
    },
    {
      header: 'Actions',
      cell: (c) => (
        <Link
          href={`/crm/customers/${c.id}`}
          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-bold text-[11px] flex items-center gap-1"
        >
          <span>360° Profile</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-4 text-xs">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Customer Directory & Accounts Master
          </h1>
          <p className="text-slate-500 mt-0.5">
            Central repository of corporate manufacturing clients with linked orders, GST, and historical ledgers.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Customer</span>
        </button>
      </div>

      <DataTable
        title="Enterprise Customer Accounts"
        columns={columns}
        data={customers}
        onRowClick={(c) => router.push(`/crm/customers/${c.id}`)}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Customer Account</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Aarti Industries Ltd."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="24AAACX0000X1Z1"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Rajeev Singhal"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98250 XXXXX"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
