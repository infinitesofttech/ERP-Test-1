'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useERP } from '../../../../context/ERPContext';
import {
  ArrowLeft,
  ChevronUp,
  Save,
  AlertCircle,
  ArrowUp,
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

  const defaultSalesPerson = allEmployees[0]?.name || (allEmployees[0] as any)?.employeeName || 'Deepbhai Manvar';
  const defaultSalesPersonId = allEmployees[0]?.id || 'EMP-001';

  // Section 2 collapse toggle
  const [basicOpen, setBasicOpen] = useState(true);

  // Form State matching Test-2 screenshot
  const [formData, setFormData] = useState({
    // Section 1: Lead & Company Details
    companyName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    source: 'Direct Inward / Call',
    priority: 'Medium',
    assignedSalesPersonName: defaultSalesPerson,
    assignedSalesPersonId: defaultSalesPersonId,
    productName: '',

    // Section 2: Basic Details (Address & Regional Details)
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    whatsapp: '',
    altMobile: '',
    industry: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    let sanitized = value;
    if (field === 'mobile' || field === 'whatsapp') {
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
    if (!formData.companyName.trim() || formData.companyName.trim().length < 2) {
      errs.companyName = 'Company Name is required.';
    }
    if (!formData.contactPerson.trim() || formData.contactPerson.trim().length < 2) {
      errs.contactPerson = 'Contact Person Name is required.';
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length !== 10) {
      errs.mobile = 'Mobile Number must be 10 digits.';
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
      const priorityMap: Record<string, PriorityLevel> = {
        Low: 'low',
        Medium: 'medium',
        High: 'high',
        Urgent: 'urgent',
      };

      const sourceMap: Record<string, LeadSource> = {
        'Direct Inward / Call': 'phone',
        'Exhibition / Trade Expo': 'exhibition',
        'Website Inquiry': 'website',
        'Referral / Partner': 'referral',
        'Email Campaign': 'email',
        'Tender / GeM Portal': 'other',
      };

      const assignedPerson = allEmployees.find(
        (emp) => (emp.name || (emp as any).employeeName) === formData.assignedSalesPersonName
      );

      const assignedId = assignedPerson?.id || formData.assignedSalesPersonId || 'EMP-001';
      const resolvedPriority = priorityMap[formData.priority] || 'medium';
      const resolvedSource = sourceMap[formData.source] || 'phone';

      addLead({
        companyName: formData.companyName.trim(),
        contactPerson: formData.contactPerson.trim(),
        designation: 'Contact Person / Representative',
        mobile: formData.mobile.trim(),
        whatsapp: (formData.whatsapp || formData.mobile).trim(),
        altMobile: formData.altMobile.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim() || 'Vadodara',
        state: formData.state.trim() || 'Gujarat',
        country: formData.country.trim() || 'India',
        pincode: formData.pincode.trim(),
        industry: formData.industry.trim() || 'Engineering / Fabrication',
        productName: formData.productName.trim() || 'General Inquiry / Equipment Requirement',
        machineType: 'Custom Process Equipment',
        quantity: 1,
        budget: 0,
        expectedDelivery: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        requirementDescription: formData.productName.trim() || 'General Inquiry / Equipment Requirement',
        source: resolvedSource,
        priority: resolvedPriority,
        assignedSalesPersonId: assignedId,
        assignedSalesPersonName: formData.assignedSalesPersonName,
        status: 'new' as LeadStatus,
      });

      router.push(`/crm/leads?tab=leads&created=${encodeURIComponent(formData.companyName.trim())}`);
    } catch (err) {
      console.error('Failed to create lead:', err);
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-6 text-xs pb-16 relative">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between border-b border-[#EBE3DB] pb-3">
        <div className="flex items-center gap-2 text-[11px] text-[#70665F]">
          <Link href="/crm" className="hover:text-[#211B17]">
            DASHBOARD
          </Link>
          <span>/</span>
          <Link href="/crm/leads" className="hover:text-[#211B17]">
            CRM
          </Link>
          <span>/</span>
          <Link href="/crm/leads" className="hover:text-[#211B17]">
            LEADS
          </Link>
          <span>/</span>
          <span className="font-bold text-[#6D28D9]">CREATE</span>
        </div>

        <Link
          href="/crm/leads"
          className="inline-flex items-center gap-1.5 text-xs text-[#544B45] hover:text-[#211B17] font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to List
        </Link>
      </div>

      {/* Validation Error Banner */}
      {submitAttempted && Object.values(errors).some(Boolean) && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
          <div>
            <span className="font-bold block">
              Please correct {Object.values(errors).filter(Boolean).length} validation error(s) before saving:
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
        {/* 1. Lead & Company Details */}
        <div className="bg-white border border-[#EBE3DB] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#211B17] flex items-center gap-2">
            <span>1. Lead & Company Details</span>
            <span className="text-xs font-normal text-[#70665F]">(Primary Prospect Profile)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-[#544B45] mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="e.g. Reliance Industries Ltd."
                className={`w-full px-3.5 py-2.5 bg-white border ${
                  errors.companyName ? 'border-rose-500 bg-rose-50/20' : 'border-[#EBE3DB]'
                } rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition`}
              />
              {errors.companyName && <p className="text-rose-500 text-[10px] mt-1">{errors.companyName}</p>}
            </div>

            {/* Contact Person Name */}
            <div>
              <label className="block text-xs font-semibold text-[#544B45] mb-1">
                Contact Person Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className={`w-full px-3.5 py-2.5 bg-white border ${
                  errors.contactPerson ? 'border-rose-500 bg-rose-50/20' : 'border-[#EBE3DB]'
                } rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition`}
              />
              {errors.contactPerson && <p className="text-rose-500 text-[10px] mt-1">{errors.contactPerson}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-[#544B45] mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="+91 10-digit mobile"
                className={`w-full px-3.5 py-2.5 bg-white border ${
                  errors.mobile ? 'border-rose-500 bg-rose-50/20' : 'border-[#EBE3DB]'
                } rounded-xl text-xs text-[#211B17] font-mono focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition`}
              />
              {errors.mobile && <p className="text-rose-500 text-[10px] mt-1">{errors.mobile}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#544B45] mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="e.g. purchase@company.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
              />
            </div>

            {/* Lead Source */}
            <div>
              <label className="block text-xs font-semibold text-[#544B45] mb-1">Lead Source</label>
              <select
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
              >
                <option value="Direct Inward / Call">Direct Inward / Call</option>
                <option value="Exhibition / Trade Expo">Exhibition / Trade Expo</option>
                <option value="Website Inquiry">Website Inquiry</option>
                <option value="Referral / Partner">Referral / Partner</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Tender / GeM Portal">Tender / GeM Portal</option>
              </select>
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-xs font-semibold text-[#544B45] mb-1">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Assigned Sales Engineer */}
            <div>
              <label className="block text-xs font-semibold text-[#544B45] mb-1">Assigned Sales Engineer</label>
              <select
                value={formData.assignedSalesPersonName}
                onChange={(e) => {
                  const val = e.target.value;
                  const found = allEmployees.find(
                    (emp) => (emp.name || (emp as any).employeeName || emp.id) === val
                  );
                  setFormData((prev) => ({
                    ...prev,
                    assignedSalesPersonName: val,
                    assignedSalesPersonId: found?.id || prev.assignedSalesPersonId,
                  }));
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
              >
                {allEmployees.map((emp) => {
                  const name = emp.name || (emp as any).employeeName || emp.id;
                  return (
                    <option key={emp.id} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Product Requirement */}
            <div>
              <label className="block text-xs font-semibold text-[#544B45] mb-1">Product Requirement</label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="General Inquiry / Equipment Requirement"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* 2. Basic Details (Address & Regional Details) */}
        <div className="bg-white border border-[#EBE3DB] rounded-2xl p-6 shadow-xs space-y-4">
          <div
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setBasicOpen(!basicOpen)}
          >
            <h2 className="text-sm font-bold text-[#211B17] flex items-center gap-2">
              <span>2. Basic Details</span>
              <span className="text-xs font-normal text-[#70665F]">(Address & Regional Details)</span>
            </h2>
            <ChevronUp
              className={`w-4 h-4 text-[#70665F] transition-transform duration-200 ${
                basicOpen ? '' : 'rotate-180'
              }`}
            />
          </div>

          {basicOpen && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Address Line */}
                <div>
                  <label className="block text-xs font-semibold text-[#544B45] mb-1">Address Line</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Plot / Street / GIDC Industrial Area"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-[#544B45] mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="e.g. Vadodara / Ahmedabad"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-semibold text-[#544B45] mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="e.g. Gujarat"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-semibold text-[#544B45] mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="India"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-semibold text-[#544B45] mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="e.g. 390010"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs font-mono text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  />
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-xs font-semibold text-[#544B45] mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="+91 10-digit mobile"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs font-mono text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  />
                </div>

                {/* Alternate Mobile */}
                <div>
                  <label className="block text-xs font-semibold text-[#544B45] mb-1">Alternate Mobile</label>
                  <input
                    type="text"
                    value={formData.altMobile}
                    onChange={(e) => handleInputChange('altMobile', e.target.value)}
                    placeholder="Office landline or alternate contact"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs font-mono text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  />
                </div>

                {/* Industry / Sector */}
                <div>
                  <label className="block text-xs font-semibold text-[#544B45] mb-1">Industry / Sector</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    placeholder="e.g. Pharmaceutical / Chemical / FMCG"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EBE3DB] rounded-xl text-xs text-[#211B17] focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  />
                </div>
              </div>

              {/* Contact Directory & Key Personnel subcard */}
              <div className="border border-[#EBE3DB] rounded-xl p-4 bg-[#FCFAF8]">
                <h4 className="text-xs font-bold text-[#544B45] mb-1">Contact Directory & Key Personnel</h4>
                <p className="text-xs text-[#70665F] py-6 text-center">
                  Initial contact person configured above. Add additional key stakeholders anytime after lead registration.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving Lead...' : 'Save & Register Lead'}
          </button>
        </div>
      </form>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-lg flex items-center justify-center transition cursor-pointer z-30"
        title="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
