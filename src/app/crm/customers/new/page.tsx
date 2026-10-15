'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useERP } from '../../../../context/ERPContext';
import {
  ArrowLeft,
  Building,
  Phone,
  Mail,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  User,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { Customer } from '../../../../types/crm';

interface ExtraAddress {
  id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface ExtraContact {
  id: string;
  name: string;
  designation: string;
  mobile: string;
  email: string;
}

export default function NewCustomerPage() {
  const router = useRouter();
  const { addCustomer, availableEmployees, employees } = useERP();

  const allEmployees =
    availableEmployees && availableEmployees.length > 0
      ? availableEmployees
      : employees && employees.length > 0
      ? employees
      : [];

  const defaultSalesPerson = allEmployees[0]?.name || (allEmployees[0] as any)?.employeeName || 'hemant bhai';

  // Auto-generate customer code
  const [customerCode] = useState(() => `CUST-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  // Main Form State
  const [formData, setFormData] = useState({
    customerType: 'Company / Corporate Enterprise',
    industrySector: 'Heavy Engineering & Fabrication',
    currency: '₹ Indian rupee',
    tierCategory: 'Standard Client',
    companyName: '',
    contactPerson: '',
    designation: 'Managing Director',
    mobile: '',
    email: '',
    panNumber: '',
    gstin: '',
    paymentTerms: '30 Days Credit',
    creditLimit: 500000,
    assignedSalesEngineer: defaultSalesPerson,
    city: 'Vadodara',
    state: 'Gujarat',
    country: 'India',
  });

  const [addresses, setAddresses] = useState<ExtraAddress[]>([]);
  const [contacts, setContacts] = useState<ExtraContact[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.companyName.trim() || formData.companyName.trim().length < 2) {
      errs.companyName = 'Company / Client name is required.';
    }
    if (!formData.contactPerson.trim() || formData.contactPerson.trim().length < 2) {
      errs.contactPerson = 'Contact person name is required.';
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length !== 10) {
      errs.mobile = 'Valid 10-digit mobile number is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      {
        id: `addr-${Date.now()}`,
        type: 'Factory / Works',
        address: 'Plot No. 42, GIDC Industrial Estate, Makarpura',
        city: 'Vadodara',
        state: 'Gujarat',
        pincode: '390010',
      },
    ]);
  };

  const handleAddContact = () => {
    setContacts([
      ...contacts,
      {
        id: `cnt-${Date.now()}`,
        name: '',
        designation: 'Technical Head',
        mobile: '',
        email: '',
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitAttempted(true);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      addCustomer({
        customerType: 'company',
        companyName: formData.companyName.trim(),
        contactPerson: formData.contactPerson.trim(),
        designation: formData.designation || 'Managing Director',
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        gstin: formData.gstin.trim(),
        pan: formData.panNumber.trim(),
        billingAddress: addresses[0]?.address || 'Plot No. 42, GIDC Industrial Estate, Makarpura',
        shippingAddress: addresses[0]?.address || 'Plot No. 42, GIDC Industrial Estate, Makarpura',
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: '390010',
        industry: formData.industrySector,
        paymentTerms: formData.paymentTerms,
        creditLimit: Number(formData.creditLimit) || 500000,
        currency: 'INR (₹)',
        category: 'standard',
        assignedSalesPerson: formData.assignedSalesEngineer || 'Pravin Patel',
      });

      router.push('/crm/leads?tab=customers');
    } catch (err) {
      console.error('Failed to create customer:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-5 text-xs pb-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-[#EBE3DB] pb-3">
        <div className="flex items-center gap-2 text-[11px] text-[#70665F]">
          <Link href="/crm" className="hover:text-[#211B17]">
            DASHBOARD
          </Link>
          <span>/</span>
          <Link href="/crm/leads?tab=customers" className="hover:text-[#211B17]">
            CRM
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#544B45]">CUSTOMER MASTER</span>
          <span>/</span>
          <span className="font-bold text-crm-brand-700">CREATE</span>
        </div>

        <Link
          href="/crm/leads?tab=customers"
          className="inline-flex items-center gap-1.5 text-crm-brand-700 hover:text-crm-brand-800 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to List
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* SECTION 1: Customer Details */}
        <div className="bg-white border border-[#EBE3DB] rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-[#211B17] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-crm-brand-50 text-crm-brand-700 flex items-center justify-center text-[10px] font-bold border border-crm-brand-200">
              1
            </span>
            Customer Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Customer Type */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">
                Customer Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.customerType}
                onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-medium"
              >
                <option value="Company / Corporate Enterprise">Company / Corporate Enterprise</option>
                <option value="Proprietary Firm">Proprietary Firm</option>
                <option value="Partnership Enterprise">Partnership Enterprise</option>
                <option value="PSU / Government Entity">PSU / Government Entity</option>
              </select>
            </div>

            {/* Industry Sector */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">
                Industry Sector <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.industrySector}
                onChange={(e) => setFormData({ ...formData, industrySector: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-medium"
              >
                <option value="Heavy Engineering & Fabrication">Heavy Engineering & Fabrication</option>
                <option value="Petrochemical & Refining">Petrochemical & Refining</option>
                <option value="Chemical & Agrochemical">Chemical & Agrochemical</option>
                <option value="Pharmaceuticals & Biotech">Pharmaceuticals & Biotech</option>
                <option value="Food & Beverages Processing">Food & Beverages Processing</option>
                <option value="Power & Energy Sector">Power & Energy Sector</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">
                Currency <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-medium"
              >
                <option value="₹ Indian rupee">₹ Indian rupee</option>
                <option value="$ US Dollar">$ US Dollar</option>
                <option value="€ Euro">€ Euro</option>
              </select>
            </div>

            {/* Tier Category */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">
                Tier Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.tierCategory}
                onChange={(e) => setFormData({ ...formData, tierCategory: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-medium"
              >
                <option value="Standard Client">Standard Client</option>
                <option value="Tier-1 Strategic Enterprise">Tier-1 Strategic Enterprise</option>
                <option value="Government / PSU">Government / PSU</option>
                <option value="EPC Contractor Partner">EPC Contractor Partner</option>
              </select>
            </div>

            {/* Customer Code */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">Customer Code</label>
              <input
                type="text"
                disabled
                value={customerCode}
                className="w-full px-3.5 py-2.5 bg-[#F0EBE5] border border-[#EBE3DB] rounded-xl font-mono font-bold text-[#70665F] cursor-not-allowed"
              >
              </input>
            </div>

            {/* Company / Client Name */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">
                Company / Client Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter Company Name"
                className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border ${
                  errors.companyName ? 'border-rose-500 bg-rose-50/20' : 'border-[#EBE3DB]'
                } rounded-xl font-bold text-[#211B17]`}
              />
              {errors.companyName && <p className="text-rose-500 text-[10px] mt-1">{errors.companyName}</p>}
            </div>

            {/* Contact Person Name */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">
                Contact Person Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Enter Contact Person"
                className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border ${
                  errors.contactPerson ? 'border-rose-500 bg-rose-50/20' : 'border-[#EBE3DB]'
                } rounded-xl text-[#211B17] font-semibold`}
              />
              {errors.contactPerson && <p className="text-rose-500 text-[10px] mt-1">{errors.contactPerson}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="Managing Director"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                placeholder="10-digit mobile"
                className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border ${
                  errors.mobile ? 'border-rose-500 bg-rose-50/20' : 'border-[#EBE3DB]'
                } rounded-xl font-mono text-[#211B17]`}
              />
              {errors.mobile && <p className="text-rose-500 text-[10px] mt-1">{errors.mobile}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="client@company.com"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
              />
            </div>

            {/* PAN Number */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">PAN Number</label>
              <input
                type="text"
                maxLength={10}
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                placeholder="Enter PAN"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl font-mono uppercase text-[#211B17]"
              />
            </div>

            {/* GSTIN Number */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">GSTIN Number</label>
              <input
                type="text"
                maxLength={15}
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                placeholder="Enter 15-digit GSTIN"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl font-mono uppercase text-[#211B17]"
              />
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">Payment Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-medium"
              >
                <option value="30 Days Credit">30 Days Credit</option>
                <option value="45 Days Credit">45 Days Credit</option>
                <option value="100% Advance Payment">100% Advance Payment</option>
                <option value="LC at Sight">LC at Sight</option>
                <option value="30% Advance, 70% ag. PI">30% Advance, 70% ag. PI</option>
              </select>
            </div>

            {/* Credit Limit */}
            <div>
              <label className="block text-[#544B45] font-semibold mb-1">Credit Limit (₹)</label>
              <input
                type="number"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl font-mono font-bold text-emerald-700"
              />
            </div>

            {/* Assigned Sales Engineer */}
            <div className="sm:col-span-2">
              <label className="block text-[#544B45] font-semibold mb-1">Assigned Sales Engineer</label>
              <input
                type="text"
                value={formData.assignedSalesEngineer}
                onChange={(e) => setFormData({ ...formData, assignedSalesEngineer: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Basic Details (Address & Contacts) */}
        <div className="bg-white border border-[#EBE3DB] rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-[#211B17] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-crm-brand-50 text-crm-brand-700 flex items-center justify-center text-[10px] font-bold border border-crm-brand-200">
              2
            </span>
            Basic Details <span className="text-[11px] font-normal text-[#70665F]">(Address & Contacts)</span>
          </h2>

          {/* Address Details Sub-table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#544B45]">Address Details</span>
              <button
                type="button"
                onClick={handleAddAddress}
                className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F0EBE5] text-[#3E2723] border border-[#EBE3DB] rounded-lg font-bold text-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5 text-crm-brand-700" /> + Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="p-6 border border-dashed border-[#EBE3DB] rounded-xl text-center text-[#8D827A] bg-[#FCFAF8]">
                No Records Found
              </div>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr, idx) => (
                  <div
                    key={addr.id}
                    className="p-3.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={addr.type}
                        onChange={(e) => {
                          const copy = [...addresses];
                          copy[idx].type = e.target.value;
                          setAddresses(copy);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-[#EBE3DB] rounded-lg font-semibold"
                        placeholder="Type"
                      />
                      <input
                        type="text"
                        value={addr.address}
                        onChange={(e) => {
                          const copy = [...addresses];
                          copy[idx].address = e.target.value;
                          setAddresses(copy);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-[#EBE3DB] rounded-lg col-span-2"
                        placeholder="Address Line"
                      />
                      <input
                        type="text"
                        value={addr.city}
                        onChange={(e) => {
                          const copy = [...addresses];
                          copy[idx].city = e.target.value;
                          setAddresses(copy);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-[#EBE3DB] rounded-lg"
                        placeholder="City"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setAddresses(addresses.filter((_, i) => i !== idx))}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Persons Sub-table */}
          <div className="space-y-3 pt-3 border-t border-[#EBE3DB]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#544B45]">Contact Persons</span>
              <button
                type="button"
                onClick={handleAddContact}
                className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F0EBE5] text-[#3E2723] border border-[#EBE3DB] rounded-lg font-bold text-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5 text-crm-brand-700" /> + Add Contact
              </button>
            </div>

            {contacts.length === 0 ? (
              <div className="p-6 border border-dashed border-[#EBE3DB] rounded-xl text-center text-[#8D827A] bg-[#FCFAF8]">
                No Records Found
              </div>
            ) : (
              <div className="space-y-2">
                {contacts.map((cnt, idx) => (
                  <div
                    key={cnt.id}
                    className="p-3.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={cnt.name}
                        onChange={(e) => {
                          const copy = [...contacts];
                          copy[idx].name = e.target.value;
                          setContacts(copy);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-[#EBE3DB] rounded-lg font-semibold"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={cnt.designation}
                        onChange={(e) => {
                          const copy = [...contacts];
                          copy[idx].designation = e.target.value;
                          setContacts(copy);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-[#EBE3DB] rounded-lg"
                        placeholder="Designation"
                      />
                      <input
                        type="text"
                        value={cnt.mobile}
                        onChange={(e) => {
                          const copy = [...contacts];
                          copy[idx].mobile = e.target.value;
                          setContacts(copy);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-[#EBE3DB] rounded-lg font-mono"
                        placeholder="Mobile"
                      />
                      <input
                        type="email"
                        value={cnt.email}
                        onChange={(e) => {
                          const copy = [...contacts];
                          copy[idx].email = e.target.value;
                          setContacts(copy);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-[#EBE3DB] rounded-lg"
                        placeholder="Email"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setContacts(contacts.filter((_, i) => i !== idx))}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between p-4 bg-white border border-[#EBE3DB] rounded-2xl shadow-sm">
          <Link
            href="/crm/leads?tab=customers"
            className="px-4 py-2 text-[#70665F] hover:text-[#211B17] font-semibold transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white rounded-xl font-bold shadow-md transition flex items-center gap-2 ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving Customer...' : 'Save Customer Master'}
          </button>
        </div>
      </form>
    </div>
  );
}
