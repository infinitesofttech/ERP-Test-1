'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useERP } from '../../../../context/ERPContext';
import {
  ArrowLeft,
  UserPlus,
  Building,
  Phone,
  Wrench,
  AlertCircle,
  Calendar,
  Layers,
  Mail,
  User,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { LeadSource, LeadStatus, PriorityLevel, Employee } from '../../../../types/crm';

export default function NewLeadPage() {
  const router = useRouter();
  const { addLead, employees, availableEmployees } = useERP();

  const allEmployees: Employee[] =
    availableEmployees && availableEmployees.length > 0
      ? availableEmployees
      : employees && employees.length > 0
      ? employees
      : [];

  const salesEngineers = allEmployees.filter(
    (e) =>
      (e.departmentName && (e.departmentName.includes('CRM') || e.departmentName.includes('Sales') || e.departmentName.includes('Project'))) ||
      (e.department && (e.department.includes('CRM') || e.department.includes('Sales') || e.department.includes('Project')))
  );

  const defaultSalesPersonId = salesEngineers[0]?.id || allEmployees[0]?.id || '';

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultFollowUp = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultDelivery = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    // 1. Company Profile
    companyName: '',
    industry: 'Speciality Chemicals',
    website: '',
    gstin: '',
    address: '',
    city: 'Vadodara',
    state: 'Gujarat',
    country: 'India',
    pincode: '390010',

    // 2. Key Personnel & Communications
    contactPerson: '',
    designation: 'Project Lead',
    mobile: '',
    altMobile: '',
    email: '',
    whatsapp: '',

    // 3. Technical Requirements
    productName: '',
    machineType: 'Chemical Pressure Vessel / Reactor',
    quantity: 1 as number | string,
    capacity: '',
    application: '',
    requirementDescription: '',
    expectedDelivery: defaultDelivery,
    budget: '' as number | string,

    // 4. Sales Assignment & Timeline
    priority: 'medium' as PriorityLevel,
    source: 'direct_inward' as LeadSource,
    assignedSalesPersonId: defaultSalesPersonId,
    status: 'new' as LeadStatus,
    nextFollowUpDate: defaultFollowUp,
    remarks: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email regex for valid standard emails (e.g. user@domain.com)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // GSTIN 15-character format
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  // Validate single field
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'companyName':
        if (!value || value.trim().length < 2) return 'Company name is required (at least 2 characters).';
        return '';
      case 'contactPerson':
        if (!value || value.trim().length < 2) return 'Contact person name is required (at least 2 characters).';
        return '';
      case 'mobile': {
        if (!value || value.trim() === '') return 'Mobile number is required.';
        const clean = value.replace(/\D/g, '');
        if (clean.length !== 10) return 'Mobile number must be exactly 10 digits.';
        return '';
      }
      case 'email':
        if (value && value.trim() && !emailRegex.test(value.trim())) {
          return 'Invalid email format (Must contain "@" and domain, e.g. name@company.com).';
        }
        return '';
      case 'gstin':
        if (value && value.trim() && !gstinRegex.test(value.trim().toUpperCase())) {
          return 'Invalid GSTIN (Must be 15 chars, e.g. 24AAACX0000X1Z1).';
        }
        return '';
      default:
        return '';
    }
  };

  // Validation strictly on required fields matching Test-2
  const validateAll = () => {
    const requiredFields = ['companyName', 'contactPerson', 'mobile'];
    const errs: Record<string, string> = {};
    requiredFields.forEach((key) => {
      const err = validateField(key, (formData as any)[key]);
      if (err) errs[key] = err;
    });

    // Optional email format check if filled
    if (formData.email && formData.email.trim()) {
      const emailErr = validateField('email', formData.email);
      if (emailErr) errs['email'] = emailErr;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field: string, rawVal: any) => {
    let sanitizedVal = rawVal;

    // Mobile & WhatsApp: strictly allow digits only, max 10 chars
    if (field === 'mobile' || field === 'whatsapp' || field === 'altMobile') {
      sanitizedVal = rawVal.replace(/\D/g, '').slice(0, 10);
    }
    // GSTIN: uppercase alphanumeric only, max 15 chars
    if (field === 'gstin') {
      sanitizedVal = rawVal.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15);
    }

    setFormData((prev) => ({ ...prev, [field]: sanitizedVal }));

    // Instant validation on type if field was touched or submit was attempted
    if (touched[field] || submitAttempted) {
      const err = validateField(field, sanitizedVal);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, (formData as any)[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitAttempted(true);

    if (!validateAll()) {
      const firstErrorField = document.querySelector('[data-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const assignedPerson = allEmployees.find((emp) => emp.id === formData.assignedSalesPersonId);
      const assignedName = assignedPerson
        ? assignedPerson.name ||
          (assignedPerson as any).employeeName ||
          `${assignedPerson.firstName || ''} ${assignedPerson.lastName || ''}`.trim() ||
          'Pravin Patel'
        : 'Pravin Patel';

      const resolvedMobile = (formData.mobile || formData.whatsapp || '').trim();
      addLead({
        ...formData,
        companyName: formData.companyName.trim(),
        contactPerson: formData.contactPerson.trim(),
        mobile: resolvedMobile,
        whatsapp: (formData.whatsapp || resolvedMobile).trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city || 'Vadodara',
        productName: (formData.productName || 'Industrial Process Equipment').trim(),
        quantity: Number(formData.quantity) || 1,
        budget: Number(formData.budget) || 0,
        assignedSalesPersonName: assignedName,
      });

      router.push(`/crm/leads?tab=leads&created=${encodeURIComponent(formData.companyName.trim())}`);
    } catch (err) {
      console.error('Failed to create lead:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-4 text-xs pb-10">
      <Link
        href="/crm/leads"
        className="inline-flex items-center gap-1.5 text-crm-brand-700 hover:text-crm-brand-800 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Leads
      </Link>

      <div className="bg-white border border-[#EBE3DB] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-[#EBE3DB] pb-4">
          <h1 className="text-lg font-bold text-[#211B17] flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-crm-brand-700" />
            New Customer Lead Registration
          </h1>
          <p className="text-[#70665F] mt-0.5">
            Capture prospective customer details, engineering requirements, and commercial assignment.
          </p>
        </div>

        {/* Global Validation Warning Banner */}
        {submitAttempted && Object.values(errors).some(Boolean) && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <div>
              <span className="font-bold block">
                Please correct {Object.values(errors).filter(Boolean).length} validation error(s) before saving the lead:
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

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* SECTION 1: Company Profile */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#544B45] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-crm-brand-50 text-crm-brand-700 flex items-center justify-center text-[10px] font-bold border border-crm-brand-200">
                1
              </span>
              Company Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Company Name */}
              <div className="md:col-span-6" data-invalid={Boolean(errors.companyName && (touched.companyName || submitAttempted))}>
                <label className="block text-[#544B45] font-semibold mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#70665F] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    onBlur={() => handleBlur('companyName')}
                    placeholder="e.g. Reliance Industries / Nayara Energy"
                    className={`w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border ${
                      errors.companyName && (touched.companyName || submitAttempted)
                        ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                        : 'border-[#EBE3DB]'
                    } rounded-xl text-[#211B17] font-bold`}
                  />
                </div>
                {errors.companyName && (touched.companyName || submitAttempted) && (
                  <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.companyName}
                  </p>
                )}
              </div>

              {/* Industry Sector */}
              <div className="md:col-span-6">
                <label className="block text-[#544B45] font-semibold mb-1">Industry Sector</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="e.g. Petrochemical, Oil & Gas / Speciality Chemicals"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
                />
              </div>

              {/* Website URL */}
              <div className="md:col-span-4">
                <label className="block text-[#544B45] font-semibold mb-1">Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
                />
              </div>

              {/* GSTIN Number */}
              <div className="md:col-span-4">
                <label className="block text-[#544B45] font-semibold mb-1">GSTIN Number (15 digits)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={formData.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value)}
                  placeholder="24AAACX0000X1Z1"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl font-mono uppercase text-[#211B17]"
                />
              </div>

              {/* City & State */}
              <div className="md:col-span-4">
                <label className="block text-[#544B45] font-semibold mb-1">City & State</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="e.g. Vadodara, Gujarat"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-8">
                <label className="block text-[#544B45] font-semibold mb-1">Office / Factory Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#70665F] absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="e.g. Plot No. 42, GIDC Industrial Estate, Makarpura, Vadodara, Gujarat - 390010"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
                  />
                </div>
              </div>

              {/* Country & Pincode */}
              <div className="md:col-span-2">
                <label className="block text-[#544B45] font-semibold mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[#544B45] font-semibold mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl font-mono text-[#211B17]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Key Personnel & Communications */}
          <div className="space-y-4 pt-4 border-t border-[#EBE3DB]">
            <h3 className="font-bold text-sm text-[#544B45] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-crm-brand-50 text-crm-brand-700 flex items-center justify-center text-[10px] font-bold border border-crm-brand-200">
                2
              </span>
              Key Personnel & Communications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Person Name */}
              <div className="md:col-span-6" data-invalid={Boolean(errors.contactPerson && (touched.contactPerson || submitAttempted))}>
                <label className="block text-[#544B45] font-semibold mb-1">
                  Person Name (Contact Person) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#70665F] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    onBlur={() => handleBlur('contactPerson')}
                    placeholder="e.g. Harish Trivedi"
                    className={`w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border ${
                      errors.contactPerson && (touched.contactPerson || submitAttempted)
                        ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                        : 'border-[#EBE3DB]'
                    } rounded-xl text-[#211B17] font-semibold`}
                  />
                </div>
                {errors.contactPerson && (touched.contactPerson || submitAttempted) && (
                  <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.contactPerson}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div className="md:col-span-6">
                <label className="block text-[#544B45] font-semibold mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  placeholder="e.g. Project Lead / Purchase Head"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
                />
              </div>

              {/* Mobile Contact */}
              <div className="md:col-span-4" data-invalid={Boolean(errors.mobile && (touched.mobile || submitAttempted))}>
                <label className="block text-[#544B45] font-semibold mb-1">
                  Number (Mobile Contact) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-[#70665F] font-bold">+91</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    onBlur={() => handleBlur('mobile')}
                    placeholder="9825012345"
                    className={`w-full pl-11 pr-3.5 py-2.5 bg-[#FAF7F2] border ${
                      errors.mobile && (touched.mobile || submitAttempted)
                        ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                        : 'border-[#EBE3DB]'
                    } rounded-xl text-[#211B17] font-mono font-semibold tracking-wider`}
                  />
                </div>
                {errors.mobile && (touched.mobile || submitAttempted) && (
                  <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.mobile}
                  </p>
                )}
              </div>

              {/* Alt Mobile */}
              <div className="md:col-span-4">
                <label className="block text-[#544B45] font-semibold mb-1">Alt Mobile / Landline</label>
                <input
                  type="text"
                  maxLength={15}
                  value={formData.altMobile}
                  onChange={(e) => handleInputChange('altMobile', e.target.value)}
                  placeholder="0265-264XXXX"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl font-mono text-[#211B17]"
                />
              </div>

              {/* Email Address */}
              <div className="md:col-span-4" data-invalid={Boolean(errors.email)}>
                <label className="block text-[#544B45] font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#70665F] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="name@company.com"
                    className={`w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border ${
                      errors.email ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30' : 'border-[#EBE3DB]'
                    } rounded-xl text-[#211B17] font-medium`}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.email}
                  </p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div className="md:col-span-4">
                <label className="block text-[#544B45] font-semibold mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="9825012345"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Technical Requirements */}
          <div className="space-y-4 pt-4 border-t border-[#EBE3DB]">
            <h3 className="font-bold text-sm text-[#544B45] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-crm-brand-50 text-crm-brand-700 flex items-center justify-center text-[10px] font-bold border border-crm-brand-200">
                3
              </span>
              Machine & Equipment Technical Requirement
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Product / Machine Title */}
              <div className="md:col-span-8">
                <label className="block text-[#544B45] font-semibold mb-1">Target Machine / Equipment Title</label>
                <div className="relative">
                  <Wrench className="w-4 h-4 text-[#70665F] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => handleInputChange('productName', e.target.value)}
                    placeholder="e.g. 10 KL SS 316L Chemical Reactor Vessel with Limpet Jacket"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl font-bold text-[#211B17]"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="md:col-span-4">
                <label className="block text-[#544B45] font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  placeholder="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl font-mono text-[#211B17]"
                />
              </div>

              {/* Machine Type */}
              <div className="md:col-span-4">
                <label className="block text-[#544B45] font-semibold mb-1">Machine / Equipment Category</label>
                <select
                  value={formData.machineType}
                  onChange={(e) => handleInputChange('machineType', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-semibold"
                >
                  <option value="Chemical Pressure Vessel / Reactor">Chemical Pressure Vessel / Reactor</option>
                  <option value="Shell & Tube Heat Exchanger">Shell & Tube Heat Exchanger</option>
                  <option value="Storage Tank / Silo">Storage Tank / Silo</option>
                  <option value="Heavy Industrial Structure">Heavy Industrial Structure</option>
                  <option value="Distillation Column / Tower">Distillation Column / Tower</option>
                  <option value="Custom Process Skid">Custom Process Skid</option>
                </select>
              </div>

              {/* Capacity / Dimensions */}
              <div className="md:col-span-4">
                <label className="block text-[#544B45] font-semibold mb-1">Capacity / Dimensions</label>
                <input
                  type="text"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder="e.g. 10,000 Litres / 150 Kg / 2000 mm Dia"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
                />
              </div>

              {/* Target Delivery Date */}
              <div className="md:col-span-4">
                <label className="block text-[#544B45] font-semibold mb-1">Target Delivery Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={formData.expectedDelivery}
                  onChange={(e) => handleInputChange('expectedDelivery', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-mono"
                />
              </div>

              {/* Estimated Budget */}
              <div className="md:col-span-4">
                <label className="block text-[#544B45] font-semibold mb-1">Estimated Budget (₹)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl font-bold text-emerald-600 font-mono"
                />
              </div>

              {/* Technical Scope & Description */}
              <div className="md:col-span-8">
                <label className="block text-[#544B45] font-semibold mb-1">Technical Scope & Description</label>
                <textarea
                  rows={2}
                  value={formData.requirementDescription}
                  onChange={(e) => handleInputChange('requirementDescription', e.target.value)}
                  placeholder="Pressure ratings, material of construction (SS304/SS316/Carbon Steel), operating parameters..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Sales Assignment & Timeline */}
          <div className="space-y-4 pt-4 border-t border-[#EBE3DB]">
            <h3 className="font-bold text-sm text-[#544B45] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-crm-brand-50 text-crm-brand-700 flex items-center justify-center text-[10px] font-bold border border-crm-brand-200">
                4
              </span>
              Sales Assignment & Timeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Priority */}
              <div className="md:col-span-3">
                <label className="block text-[#544B45] font-semibold mb-1">Priority Level</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-bold"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">URGENT Fast-Track</option>
                </select>
              </div>

              {/* Lead Source */}
              <div className="md:col-span-3">
                <label className="block text-[#544B45] font-semibold mb-1">Lead Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-semibold"
                >
                  <option value="direct_inward">Direct Inward / Call</option>
                  <option value="exhibition">Exhibition / Trade Expo</option>
                  <option value="website">Website / Digital</option>
                  <option value="referral">Reference / Referral</option>
                  <option value="email">Email Campaign</option>
                  <option value="tender">Tender / GeM Portal</option>
                </select>
              </div>

              {/* Assigned Sales Engineer */}
              <div className="md:col-span-3">
                <label className="block text-[#544B45] font-semibold mb-1">Assigned Sales Engineer</label>
                <select
                  value={formData.assignedSalesPersonId}
                  onChange={(e) => handleInputChange('assignedSalesPersonId', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-medium"
                >
                  {allEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name || (emp as any).employeeName || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Next Follow-up Date */}
              <div className="md:col-span-3">
                <label className="block text-[#544B45] font-semibold mb-1">Next Follow-up Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={formData.nextFollowUpDate}
                  onChange={(e) => handleInputChange('nextFollowUpDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17] font-mono"
                />
              </div>

              {/* Remarks */}
              <div className="md:col-span-12">
                <label className="block text-[#544B45] font-semibold mb-1">Special Instructions / Remarks</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder="Key customer expectations, decision makers, project urgency..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE3DB] rounded-xl text-[#211B17]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#EBE3DB]">
            <Link
              href="/crm/leads"
              className="px-4 py-2 border border-[#EBE3DB] rounded-lg hover:bg-slate-50 font-semibold text-[#544B45] transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-crm-brand-700 hover:bg-crm-brand-800 text-white rounded-xl font-bold shadow-md transition transform active:scale-95 flex items-center gap-2 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Lead...
                </>
              ) : (
                'Save & Register Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
