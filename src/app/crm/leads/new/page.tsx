'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useERP } from '../../../../context/ERPContext';
import {
  ArrowLeft,
  UserPlus,
  Building2,
  User,
  Mail,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { LeadStatus } from '../../../../types/crm';

export default function NewLeadPage() {
  const router = useRouter();
  const { addLead, employees, availableEmployees } = useERP();

  const allEmployees =
    availableEmployees && availableEmployees.length > 0
      ? availableEmployees
      : employees && employees.length > 0
      ? employees
      : [];

  const defaultSalesPerson =
    allEmployees[0]?.name || (allEmployees[0] as any)?.employeeName || 'Deepbhai Manvar';
  const defaultSalesPersonId = allEmployees[0]?.id || 'EMP-001';

  // Form state strictly matching the user's screenshot
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    let sanitized = value;
    if (field === 'mobile') {
      sanitized = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, [field]: sanitized }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.companyName.trim()) {
      errs.companyName = 'Company Name is required.';
    }
    if (!formData.contactPerson.trim()) {
      errs.contactPerson = 'Person Name (Contact Person) is required.';
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length !== 10) {
      errs.mobile = '10-digit mobile number is required.';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email address is required.';
    }
    if (!formData.address.trim()) {
      errs.address = 'Address is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
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
      // Extract city, state, pincode if possible from address
      const pincodeMatch = formData.address.match(/\b\d{6}\b/);
      const pincode = pincodeMatch ? pincodeMatch[0] : '390010';

      let city = 'Vadodara';
      if (formData.address.toLowerCase().includes('ahmedabad')) city = 'Ahmedabad';
      else if (formData.address.toLowerCase().includes('surat')) city = 'Surat';
      else if (formData.address.toLowerCase().includes('rajkot')) city = 'Rajkot';
      else if (formData.address.toLowerCase().includes('makarpura')) city = 'Vadodara';

      addLead({
        companyName: formData.companyName.trim(),
        contactPerson: formData.contactPerson.trim(),
        designation: 'Contact Person / Representative',
        mobile: formData.mobile.trim(),
        whatsapp: formData.mobile.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city,
        state: 'Gujarat',
        country: 'India',
        pincode,
        industry: 'Manufacturing / Engineering',
        productName: 'General Inquiry / Process Equipment',
        machineType: 'Custom Process Equipment',
        quantity: 1,
        budget: 0,
        expectedDelivery: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        requirementDescription: `New lead registered for ${formData.companyName.trim()} by ${formData.contactPerson.trim()}`,
        source: 'phone',
        priority: 'medium',
        assignedSalesPersonId: defaultSalesPersonId,
        assignedSalesPersonName: defaultSalesPerson,
        status: 'new' as LeadStatus,
      });

      router.push(`/crm/leads?tab=leads&created=${encodeURIComponent(formData.companyName.trim())}`);
    } catch (err) {
      console.error('Failed to create lead:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pb-16 space-y-4">
      {/* Back to Leads Link */}
      <div>
        <Link
          href="/crm/leads"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#544B45] hover:text-[#211B17] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Leads
        </Link>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white border border-[#E7DED5] rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Card Header */}
        <div className="flex items-start gap-3 pb-6 border-b border-[#F0EBE4]">
          <div className="mt-0.5 text-[#211B17]">
            <UserPlus className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#211B17] tracking-tight">
              New Customer Lead Registration
            </h1>
            <p className="text-xs text-[#70665F] mt-1">
              Capture prospective customer details (Company Name, Person Name, Mobile Number, Email, and Address).
            </p>
          </div>
        </div>

        {/* Validation Error Banner */}
        {submitAttempted && Object.values(errors).some(Boolean) && (
          <div className="mt-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <div>
              <span className="font-bold block">
                Please fill in all required fields marked with * before saving:
              </span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-rose-600 font-medium">
                {Object.entries(errors)
                  .filter(([_, msg]) => Boolean(msg))
                  .map(([key, err], i) => (
                    <li key={i}>{err}</li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
          {/* Section 1 Header */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full border border-[#C99C70] text-[#8F5228] flex items-center justify-center text-[11px] font-semibold">
              1
            </span>
            <h2 className="text-sm font-semibold text-[#211B17]">
              Customer Lead Information
            </h2>
          </div>

          {/* Form Fields Grid */}
          <div className="space-y-4">
            {/* Row 1: Company Name & Person Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-semibold text-[#211B17] mb-1.5">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8D827A]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g. Industrial Enterprises Ltd."
                    className={`w-full pl-10 pr-3.5 py-3 bg-[#FAF7F2] border ${
                      errors.companyName ? 'border-rose-500 bg-rose-50/20' : 'border-[#E7DED5]'
                    } rounded-xl text-xs text-[#211B17] placeholder:text-[#A89F97] focus:bg-white focus:border-[#75401F] focus:ring-1 focus:ring-[#75401F] outline-none transition`}
                  />
                </div>
                {errors.companyName && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.companyName}</p>
                )}
              </div>

              {/* Person Name (Contact Person) */}
              <div>
                <label className="block text-xs font-semibold text-[#211B17] mb-1.5">
                  Person Name (Contact Person) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8D827A]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="e.g. Harish Trivedi"
                    className={`w-full pl-10 pr-3.5 py-3 bg-[#FAF7F2] border ${
                      errors.contactPerson ? 'border-rose-500 bg-rose-50/20' : 'border-[#E7DED5]'
                    } rounded-xl text-xs text-[#211B17] placeholder:text-[#A89F97] focus:bg-white focus:border-[#75401F] focus:ring-1 focus:ring-[#75401F] outline-none transition`}
                  />
                </div>
                {errors.contactPerson && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.contactPerson}</p>
                )}
              </div>
            </div>

            {/* Row 2: Number (Mobile Contact) & Email Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number (Mobile Contact) */}
              <div>
                <label className="block text-xs font-semibold text-[#211B17] mb-1.5">
                  Number (Mobile Contact) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-semibold text-[#544B45] select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="9825012345"
                    className={`w-full pl-12 pr-3.5 py-3 bg-[#FAF7F2] border ${
                      errors.mobile ? 'border-rose-500 bg-rose-50/20' : 'border-[#E7DED5]'
                    } rounded-xl text-xs text-[#211B17] font-mono placeholder:text-[#A89F97] focus:bg-white focus:border-[#75401F] focus:ring-1 focus:ring-[#75401F] outline-none transition`}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.mobile}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#211B17] mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8D827A]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="name@company.com"
                    className={`w-full pl-10 pr-3.5 py-3 bg-[#FAF7F2] border ${
                      errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-[#E7DED5]'
                    } rounded-xl text-xs text-[#211B17] placeholder:text-[#A89F97] focus:bg-white focus:border-[#75401F] focus:ring-1 focus:ring-[#75401F] outline-none transition`}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Row 3: Address */}
            <div>
              <label className="block text-xs font-semibold text-[#211B17] mb-1.5">
                Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 flex items-start pointer-events-none text-[#8D827A]">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  rows={3}
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="e.g. Plot No. 42, GIDC Industrial Estate, Makarpura, Vadodara, Gujarat - 390010"
                  className={`w-full pl-10 pr-3.5 py-3 bg-[#FAF7F2] border ${
                    errors.address ? 'border-rose-500 bg-rose-50/20' : 'border-[#E7DED5]'
                  } rounded-xl text-xs text-[#211B17] placeholder:text-[#A89F97] focus:bg-white focus:border-[#75401F] focus:ring-1 focus:ring-[#75401F] outline-none transition resize-y`}
                />
              </div>
              {errors.address && (
                <p className="text-rose-500 text-[11px] mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#F0EBE4]">
            <button
              type="button"
              onClick={() => router.push('/crm/leads')}
              className="px-6 py-2.5 bg-white border border-[#D5CAC0] hover:bg-[#FAF7F2] text-[#544B45] rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-[#6B2D18] hover:bg-[#582313] text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer flex items-center gap-2 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Registering Lead...' : 'Register & Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
