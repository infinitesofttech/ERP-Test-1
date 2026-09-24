'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import {
  FileText,
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Download,
  Filter,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function EmployeeDocumentsPage() {
  const { employeeDocuments, addEmployeeDocument, updateEmployeeDocumentStatus, availableEmployees } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: availableEmployees[0]?.id || 'EMP-2026-001',
    documentType: 'Aadhaar' as const,
    documentNumber: '',
    issueDate: '',
    expiryDate: '',
    fileUrl: '/docs/document_upload.pdf',
    remarks: '',
  });

  const filteredDocs = employeeDocuments.filter((doc) => {
    const matchesSearch =
      doc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || doc.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = availableEmployees.find((e) => e.id === formData.employeeId);
    addEmployeeDocument({
      employeeId: formData.employeeId,
      employeeName: emp?.name || 'Staff Employee',
      documentType: formData.documentType,
      documentNumber: formData.documentNumber || 'DOC-REG-9912',
      issueDate: formData.issueDate || '2022-01-01',
      expiryDate: formData.expiryDate || '2032-01-01',
      fileUrl: formData.fileUrl,
      verificationStatus: 'Pending',
      remarks: formData.remarks || 'Initial document submission',
    });
    setShowUploadModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-emerald-400" />
            Centralized Employee Document Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Verification Repository for Aadhaar, PAN, Degrees, Experience Letters & Expiry Alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      {/* Expiry Reminder Banner */}
      <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-center gap-3 text-xs text-amber-200">
        <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <div>
          <span className="font-bold">Document Expiry Reminder Alert:</span> 2 Employee passports & medical certificates are due for renewal within 30 days. Reminders sent via automated HR email.
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by employee, doc number or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Employee</th>
                <th className="p-4">Document Type</th>
                <th className="p-4">Document No.</th>
                <th className="p-4">Issue & Expiry Date</th>
                <th className="p-4">Status & Verifier</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-700/40 transition">
                  <td className="p-4">
                    <div className="font-bold text-white">{doc.employeeName}</div>
                    <div className="text-xs text-slate-400">ID: {doc.employeeId}</div>
                  </td>
                  <td className="p-4 font-semibold text-emerald-400">{doc.documentType}</td>
                  <td className="p-4 font-mono text-xs text-slate-300">{doc.documentNumber}</td>
                  <td className="p-4 text-xs text-slate-400">
                    <div>Issue: {doc.issueDate || 'N/A'}</div>
                    <div>Expiry: {doc.expiryDate || 'No Expiry'}</div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          doc.verificationStatus === 'Verified'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : doc.verificationStatus === 'Pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {doc.verificationStatus === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {doc.verificationStatus}
                      </span>
                      {doc.verifiedBy && <div className="text-[11px] text-slate-400">By: {doc.verifiedBy}</div>}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {doc.verificationStatus === 'Pending' && (
                        <button
                          onClick={() => updateEmployeeDocumentStatus(doc.id, 'Verified', 'Sanjay Shah (HR Manager)')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded transition"
                        >
                          Verify
                        </button>
                      )}
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition"
                      >
                        <Download className="w-4 h-4 text-emerald-400" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" /> Upload Employee Document
              </h2>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Employee *</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  {availableEmployees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Document Type *</label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Aadhaar">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="Resume">Resume / CV</option>
                  <option value="Educational Degree">Educational Degree</option>
                  <option value="Previous Experience Certificate">Experience Certificate</option>
                  <option value="Joining Letter">Joining Letter</option>
                  <option value="Appointment Letter">Appointment Letter</option>
                  <option value="Bank Passbook">Bank Passbook / Cheque</option>
                  <option value="Medical Fitness">Medical Fitness Certificate</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Document Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 9988-7766-5544"
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Expiry Date (If applicable)</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">File Upload Attachment</label>
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 transition">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-slate-300 font-medium">Click to select PDF or Image file</span>
                  <p className="text-[10px] text-slate-500 mt-1">Supported: PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg">
                  Upload & Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
