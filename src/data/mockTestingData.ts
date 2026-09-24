import {
  TestCaseItem,
  BugTicket,
  BackupRecord,
  DataImportLog,
  SecurityAuditCheck,
  GoLiveChecklistItem,
} from '../types/testing';

export const MOCK_TEST_CASES: TestCaseItem[] = [
  // Foundation
  { id: 'TC-01', module: 'Foundation', category: 'Authentication', title: 'User Login & Password Hashing Verification', description: 'Test valid user login with hashed password and session token creation.', steps: ['Enter valid username', 'Enter correct password', 'Click Login'], expectedResult: 'User logged in successfully and redirected to dashboard', status: 'Pass', executedBy: 'Rajesh Patel', executedDate: '2026-09-24' },
  { id: 'TC-02', module: 'Foundation', category: 'RBAC', title: 'Role-Based Access Control Page Restriction', description: 'Verify Production Operator cannot access HR Payroll pages.', steps: ['Log in as Production Operator', 'Attempt navigating to /hr/monthly-payroll'], expectedResult: 'Access denied banner displayed', status: 'Pass', executedBy: 'Rajesh Patel', executedDate: '2026-09-24' },
  // CRM
  { id: 'TC-03', module: 'CRM', category: 'Lead Management', title: 'Lead Creation & Duplicate GST Prevention', description: 'Test lead creation and duplicate GSTIN check.', steps: ['Create new lead', 'Enter existing customer GSTIN'], expectedResult: 'Duplicate GST warning modal shown', status: 'Pass', executedBy: 'Sunil Verma', executedDate: '2026-09-24' },
  { id: 'TC-[04]', module: 'CRM', category: 'Quotation', title: 'Quotation Discount Approval Threshold', description: 'Quotation discount > 10% requires Super Admin sign-off.', steps: ['Create quotation with 12% discount', 'Submit quotation'], expectedResult: 'Quotation status set to Pending Approval', status: 'Pass', executedBy: 'Sunil Verma', executedDate: '2026-09-24' },
  // Project & Job
  { id: 'TC-05', module: 'Project', category: 'Job Creation', title: 'Sales Order Auto Project & Job Generation', description: 'Converting confirmed SO to Project & Job Master.', steps: ['Click Convert SO to Project on SO-2026-0001'], expectedResult: 'Job JOB-2026-001 created with linked SO reference', status: 'Pass', executedBy: 'Vikram Mehta', executedDate: '2026-09-24' },
  // Design & Engineering
  { id: 'TC-06', module: 'Design', category: 'BOM', title: 'BOM Revision Control & Engineering Release', description: 'Verify REV-02 BOM releases components to MRP.', steps: ['Approve BOM REV-02', 'Release to MRP'], expectedResult: 'MRP requirements generated for 38 items', status: 'Pass', executedBy: 'Ramesh Shah', executedDate: '2026-09-24' },
  // Purchase
  { id: 'TC-07', module: 'Purchase', category: 'PO & GRN', title: 'Purchase Order to GRN Stock Receipt Integration', description: 'Store GRN logging updates stock ledger.', steps: ['Log GRN-2026-001 for 8500 kg SS Plates'], expectedResult: 'Available stock updated in Main Store', status: 'Pass', executedBy: 'Prakash Sharma', executedDate: '2026-09-24' },
  // Store
  { id: 'TC-08', module: 'Store', category: 'Material Issue', title: 'Material Reservation & Issue Deduction', description: 'Issue stock for WO-2026-0001 and verify deduction.', steps: ['Create Material Issue Slip for 8500 kg Plates'], expectedResult: 'Reserved stock reduced, issued stock recorded', status: 'Pass', executedBy: 'Manish Patel', executedDate: '2026-09-24' },
  // Production
  { id: 'TC-09', module: 'Production', category: 'Shopfloor', title: 'Work Order Operation Progress & WIP Update', description: 'Complete CNC Plasma cutting operation in WC-PLASMA-01.', steps: ['Log operation completion at 100%'], expectedResult: 'Operation status Completed, WIP updated', status: 'Pass', executedBy: 'Dinesh Parmar', executedDate: '2026-09-24' },
  // Accounting
  { id: 'TC-10', module: 'Accounting', category: 'Invoicing', title: 'Sales Invoice Generation & Journal Ledger Posting', description: 'Post sales invoice INV-2026-001 and verify AR balance.', steps: ['Post invoice INV-2026-001 for ₹49.56 Lakhs'], expectedResult: 'Customer AR outstanding updated to ₹49.56 Lakhs', status: 'Pass', executedBy: 'Rajesh Patel', executedDate: '2026-09-24' },
  // HR & Payroll
  { id: 'TC-11', module: 'HR', category: 'Payroll', title: 'Biometric Attendance Loss-of-Pay Payroll Calc', description: 'Process monthly payroll with 2 LOP days deduction.', steps: ['Run payroll for Sep 2026'], expectedResult: 'Basic & HRA calculated proportionally', status: 'Pass', executedBy: 'Rajesh Patel', executedDate: '2026-09-24' },
  // Maintenance
  { id: 'TC-12', module: 'Maintenance', category: 'Service', title: 'Customer Machine Service History Linkage', description: 'Log service visit for machine UTF-CRV-10KL.', steps: ['Log service report SR-2026-0089'], expectedResult: 'Service report linked to Customer Machine history', status: 'Pass', executedBy: 'Suresh Patel', executedDate: '2026-09-24' },
  // Integration
  { id: 'TC-13', module: 'Integration', category: 'Job 360', title: 'Full MTO Job Traceability in Job 360 Hub', description: 'Open JOB-2026-001 and verify 13 tab data consistency.', steps: ['Navigate to /integration/job-360', 'Inspect all 13 tabs'], expectedResult: 'All 13 tabs display connected job records', status: 'Pass', executedBy: 'Rajesh Patel', executedDate: '2026-09-24' },
];

export const MOCK_BUG_TICKETS: BugTicket[] = [
  {
    id: 'BUG-01',
    bugNo: 'BUG-2026-001',
    module: 'Accounting',
    page: 'Expenses',
    title: 'Optional property access fallback on Expense Entry subTotal',
    description: 'subTotal.toLocaleString() threw TypeError when property was undefined.',
    stepsToReproduce: 'Open Expenses page with mock dataset where subTotal is omitted',
    expectedResult: 'Safe fallback to 0 or totalAmount',
    actualResult: 'Fixed with safe navigation fallback',
    severity: 'High',
    priority: 'High',
    assignedDeveloper: 'Antigravity AI Agent',
    status: 'Closed',
    createdDate: '2026-09-24',
    resolvedDate: '2026-09-24',
  },
  {
    id: 'BUG-02',
    bugNo: 'BUG-2026-002',
    module: 'Sidebar',
    page: 'Layout Sidebar',
    title: 'Sidebar dropdown sections expanded by default on initial page load',
    description: 'Accounting, Maintenance, and HR dropdowns were open initially instead of collapsed.',
    stepsToReproduce: 'Refresh application on homepage',
    expectedResult: 'All sidebar dropdowns collapsed by default',
    actualResult: 'State initializers updated to false and deployed to GitHub',
    severity: 'Medium',
    priority: 'Normal',
    assignedDeveloper: 'Antigravity AI Agent',
    status: 'Closed',
    createdDate: '2026-09-24',
    resolvedDate: '2026-09-24',
  },
];

export const MOCK_BACKUP_RECORDS: BackupRecord[] = [
  {
    id: 'BK-01',
    backupNo: 'BK-20260924-001',
    type: 'Full_System',
    fileName: 'UMA_ERP_FULL_20260924_1530.bak',
    fileSize: '48.5 MB',
    recordCount: 14850,
    createdDate: '2026-09-24 15:30',
    createdBy: 'Rajesh Patel (Super Admin)',
    status: 'Verified_Valid',
    location: 'Encrypted S3 Cloud Storage / AWS Mumbai',
  },
  {
    id: 'BK-02',
    backupNo: 'BK-20260923-002',
    type: 'Daily_Auto',
    fileName: 'UMA_ERP_DB_20260923_2359.bak',
    fileSize: '18.2 MB',
    recordCount: 14200,
    createdDate: '2026-09-23 23:59',
    createdBy: 'System Automated Cron Task',
    status: 'Verified_Valid',
    location: 'Secondary Offsite Server / Gujarat Node',
  },
];

export const MOCK_IMPORT_LOGS: DataImportLog[] = [
  {
    id: 'IMP-01',
    importNo: 'IMP-2026-001',
    entityType: 'Customers',
    fileName: 'Customer_Master_Migration_2026.csv',
    totalRecords: 42,
    importedRecords: 42,
    failedRecords: 0,
    importedDate: '2026-09-20',
    importedBy: 'Rajesh Patel',
    status: 'Success',
  },
  {
    id: 'IMP-02',
    importNo: 'IMP-2026-002',
    entityType: 'Items',
    fileName: 'Raw_Materials_Store_Items_2026.xlsx',
    totalRecords: 120,
    importedRecords: 120,
    failedRecords: 0,
    importedDate: '2026-09-21',
    importedBy: 'Manish Patel',
    status: 'Success',
  },
];

export const MOCK_SECURITY_CHECKS: SecurityAuditCheck[] = [
  { id: 'SEC-01', category: 'Authentication', title: 'Password Hashing & Salt Protection', description: 'Passwords hashed using bcrypt with salt rounds >= 10.', status: 'Passed', riskLevel: 'Low', lastAudited: '2026-09-24' },
  { id: 'SEC-02', category: 'Authorization', title: 'API Scope & RBAC Route Guarding', description: 'Server-side middleware verifies user role on every restricted endpoint.', status: 'Passed', riskLevel: 'Low', lastAudited: '2026-09-24' },
  { id: 'SEC-03', category: 'Data_Privacy', title: 'Sensitive Salary & Bank Details Field Masking', description: 'Aadhaar, PAN, and Bank A/c numbers masked for non-authorized personnel.', status: 'Passed', riskLevel: 'Low', lastAudited: '2026-09-24' },
  { id: 'SEC-04', category: 'Database_Security', title: 'SQL Injection & Parameterized Query Shielding', description: 'All database calls sanitized with parameterized inputs.', status: 'Passed', riskLevel: 'Low', lastAudited: '2026-09-24' },
  { id: 'SEC-05', category: 'API_Protection', title: 'Rate Limiting & Anti-Brute Force Protection', description: 'Maximum 100 requests per minute per IP enforced.', status: 'Passed', riskLevel: 'Low', lastAudited: '2026-09-24' },
];

export const MOCK_GOLIVE_CHECKLIST: GoLiveChecklistItem[] = [
  { id: 'GL-01', module: 'Foundation', criteria: 'Super Admin credentials configured & tested', status: 'Pass', verifiedBy: 'Rajesh Patel' },
  { id: 'GL-02', module: 'CRM', criteria: 'Lead to Sales Order workflow tested with zero loss', status: 'Pass', verifiedBy: 'Sunil Verma' },
  { id: 'GL-03', module: 'Project', criteria: 'Job Number assignment auto-generated (JOB-2026-XXX)', status: 'Pass', verifiedBy: 'Vikram Mehta' },
  { id: 'GL-04', module: 'Design', criteria: 'BOM Revision control verified with engineering release', status: 'Pass', verifiedBy: 'Ramesh Shah' },
  { id: 'GL-05', module: 'Purchase', criteria: 'PO approval threshold & GRN stock integration passed', status: 'Pass', verifiedBy: 'Prakash Sharma' },
  { id: 'GL-06', module: 'Store', criteria: 'Material reservation & stock issue deduction verified', status: 'Pass', verifiedBy: 'Manish Patel' },
  { id: 'GL-07', module: 'Production', criteria: 'Work center operation progress & WIP tracking verified', status: 'Pass', verifiedBy: 'Dinesh Parmar' },
  { id: 'GL-08', module: 'Accounting', criteria: 'Sales Invoice posting & AR/AP ledgers balanced', status: 'Pass', verifiedBy: 'Rajesh Patel' },
  { id: 'GL-09', module: 'HR', criteria: 'Payroll loss-of-pay calculation & PF/ESI returns verified', status: 'Pass', verifiedBy: 'Rajesh Patel' },
  { id: 'GL-10', module: 'Maintenance', criteria: 'Equipment breakdown & service visit history linked', status: 'Pass', verifiedBy: 'Suresh Patel' },
  { id: 'GL-11', module: 'Integration', criteria: 'Job 360° 13-tab end-to-end traceability verified', status: 'Pass', verifiedBy: 'Rajesh Patel' },
  { id: 'GL-12', module: 'Backup', criteria: 'One-click full system backup & restore verified', status: 'Pass', verifiedBy: 'Rajesh Patel' },
];
