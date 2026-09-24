import {
  Designation,
  EmployeeDocumentItem,
  EmployeeOnboardingItem,
  EmployeeTransferItem,
  EmployeePromotionItem,
  EmployeeExitItem,
  FullAndFinalSettlementItem,
  ShiftMaster,
  ShiftRosterItem,
  HolidayItem,
  AttendanceRecord,
  LeaveType,
  LeaveBalance,
  LeaveRequest,
  WFHRequest,
  MissedPunchRequest,
  AttendanceRegularization,
  OvertimeRecord,
  EarlyCheckoutRequest,
  SalaryComponent,
  SalaryStructure,
  PayrollRecord,
  EmployeeAdvanceLoan,
  ReimbursementExpense,
  KPIMaster,
  EmployeeAppraisal,
  TrainingProgram,
  JobPosition,
  CandidateProfile,
  InterviewRecord,
  OfferLetter,
} from '../types/hr';

export const mockDesignations: Designation[] = [
  { id: 'DESG-01', designationCode: 'DESG-DIR', designationName: 'Managing Director / Owner', department: 'Management', level: 1, jobDescription: 'Executive head of industrial operations.', responsibilities: ['Corporate Strategy', 'Financial Oversight'], status: 'Active' },
  { id: 'DESG-02', designationCode: 'DESG-GM', designationName: 'General Manager - Operations', department: 'Management', level: 2, reportingDesignation: 'Managing Director', jobDescription: 'Overall plant production, shop floor & commercial administration.', responsibilities: ['Production Execution', 'Profitability'], status: 'Active' },
  { id: 'DESG-03', designationCode: 'DESG-MGR-PRD', designationName: 'Production Manager', department: 'Production', level: 3, reportingDesignation: 'General Manager', jobDescription: 'Shop floor planning, machine loading & WIP control.', responsibilities: ['Daily Target Execution', 'Shop Floor Safety'], status: 'Active' },
  { id: 'DESG-04', designationCode: 'DESG-MGR-PUR', designationName: 'Purchase Manager', department: 'Purchase', level: 3, reportingDesignation: 'General Manager', jobDescription: 'Vendor management, raw steel procurement & GRN clearance.', responsibilities: ['Supplier Negotiation', 'PR Approval'], status: 'Active' },
  { id: 'DESG-05', designationCode: 'DESG-MGR-HR', designationName: 'HR & Payroll Manager', department: 'HR & Payroll', level: 3, reportingDesignation: 'General Manager', jobDescription: 'Employee onboarding, attendance, statutory PF/ESI, payroll processing.', responsibilities: ['Payroll Approval', 'Compliance'], status: 'Active' },
  { id: 'DESG-06', designationCode: 'DESG-SR-ENG', designationName: 'Senior Field Service Engineer', department: 'Maintenance & Services', level: 4, reportingDesignation: 'Maintenance Manager', jobDescription: 'On-site customer machine installation, breakdown repair & AMC.', responsibilities: ['Client Site Visit', 'Service Report Sign-off'], status: 'Active' },
  { id: 'DESG-07', designationCode: 'DESG-SUP-WELD', designationName: 'Robotic Welding Supervisor', department: 'Production', level: 5, reportingDesignation: 'Production Manager', jobDescription: 'Fanuc welding cell operation, jig loading & seam quality.', responsibilities: ['Robot Programming', 'MIG Weld Quality'], status: 'Active' },
  { id: 'DESG-08', designationCode: 'DESG-ACC-EXEC', designationName: 'Senior Accountant', department: 'Accounting & Finance', level: 5, reportingDesignation: 'Finance Head', jobDescription: 'GSTR-1, GSTR-3B, Bank Reconciliation & Ledger Posting.', responsibilities: ['Sales Invoicing', 'Vendor Payment'], status: 'Active' },
];

export const mockEmployeeDocuments: EmployeeDocumentItem[] = [
  {
    id: 'DOC-101',
    employeeId: 'EMP-2026-001',
    employeeName: 'Rajesh Patel',
    documentType: 'Aadhaar',
    documentNumber: '9988-7766-5544',
    fileUrl: '/docs/aadhaar_rajesh.pdf',
    verificationStatus: 'Verified',
    verifiedBy: 'Sanjay Shah (HR)',
    verifiedDate: '2022-01-10',
  },
  {
    id: 'DOC-102',
    employeeId: 'EMP-TECH-01',
    employeeName: 'Anil Desai',
    documentType: 'Educational Degree',
    documentNumber: 'BE-MECH-2018-990',
    fileUrl: '/docs/degree_anil.pdf',
    verificationStatus: 'Verified',
    verifiedBy: 'Sanjay Shah (HR)',
    verifiedDate: '2021-06-15',
  },
];

export const mockEmployeeOnboardings: EmployeeOnboardingItem[] = [
  {
    id: 'ONB-2026-01',
    candidateName: 'Pankaj Mehta',
    email: 'pankaj.mehta@gmail.com',
    mobile: '+91 98250 99881',
    joiningDate: '2026-10-01',
    department: 'Production',
    designation: 'CNC Machinist Operator',
    reportingManager: 'Rajesh Kumar',
    shift: 'General Day Shift (09:00 - 18:00)',
    salaryStructureId: 'SAL-STR-05',
    offeredCTC: 420000,
    onboardingChecklist: [
      { task: 'Appointment Letter Signed', completed: true, assignedTo: 'HR' },
      { task: 'Aadhaar & PAN Uploaded', completed: true, assignedTo: 'Employee' },
      { task: 'Bank Passbook Verified', completed: false, assignedTo: 'HR' },
      { task: 'Safety Goggles & PPE Issued', completed: false, assignedTo: 'Store' },
    ],
    status: 'In Progress',
  },
];

export const mockEmployeeTransfers: EmployeeTransferItem[] = [
  {
    id: 'TRN-2026-01',
    employeeId: 'EMP-TECH-03',
    employeeName: 'Vikram Solanki',
    effectiveDate: '2026-08-01',
    fromDepartment: 'Production',
    toDepartment: 'Maintenance & Services',
    fromDesignation: 'Maintenance Technician',
    toDesignation: 'Senior Field & Plant Engineer',
    fromLocation: 'Bay 1 Shopfloor',
    toLocation: 'Plant Utility & Field Service',
    reason: 'Promoted to handle Fanuc Robotic Welding & High Pressure Customer Field Visits.',
    approvedBy: 'Rajesh Patel (MD)',
    status: 'Approved',
  },
];

export const mockEmployeePromotions: EmployeePromotionItem[] = [
  {
    id: 'PRM-2026-01',
    employeeId: 'EMP-TECH-01',
    employeeName: 'Anil Desai',
    effectiveDate: '2026-04-01',
    oldDesignation: 'Field Engineer',
    newDesignation: 'Senior Field Service Engineer',
    oldGrade: 'Level 5',
    newGrade: 'Level 4',
    oldCTC: 540000,
    newCTC: 660000,
    incrementPercentage: 22.2,
    approvedBy: 'Rajesh Patel (MD)',
    status: 'Approved',
  },
];

export const mockEmployeeExits: EmployeeExitItem[] = [
  {
    id: 'EXIT-2026-01',
    employeeId: 'EMP-2025-089',
    employeeName: 'Harish Taylor',
    department: 'Store',
    designation: 'Junior Store Keeper',
    resignationDate: '2026-08-15',
    lastWorkingDate: '2026-09-15',
    noticePeriodDays: 30,
    reason: 'Relocating to native place.',
    exitInterviewNotes: 'Overall positive feedback. Completed physical stock count handover to Ramesh.',
    departmentClearance: true,
    assetReturnClearance: true,
    hrClearance: true,
    accountsClearance: true,
    status: 'Cleared',
  },
];

export const mockFullAndFinalSettlements: FullAndFinalSettlementItem[] = [
  {
    id: 'FNF-2026-01',
    employeeId: 'EMP-2025-089',
    employeeName: 'Harish Taylor',
    exitId: 'EXIT-2026-01',
    lastWorkingDate: '2026-09-15',
    pendingSalaryDays: 15,
    pendingSalaryAmount: 18500,
    leaveEncashmentDays: 6,
    leaveEncashmentAmount: 7400,
    bonusIncentive: 2500,
    overtimeAmount: 1200,
    reimbursementsAmount: 850,
    advanceRecovery: 0,
    loanRecovery: 0,
    noticePeriodRecovery: 0,
    otherDeductions: 200,
    netFinalPayable: 30250,
    settlementDate: '2026-09-20',
    paymentStatus: 'Paid',
    accountingVoucherNo: 'JV-FNF-2026-01',
  },
];

export const mockShifts: ShiftMaster[] = [
  { id: 'SHF-01', shiftName: 'General Day Shift', startTime: '09:00', endTime: '18:00', gracePeriodMinutes: 15, breakDurationMinutes: 60, lateRule: '3 Lates = 0.5 LOP Day', earlyCheckoutRule: 'Requires Manager Permission', overtimeRule: '1.5x Hourly Rate after 18:30', weeklyOff: 'Sunday', status: 'Active' },
  { id: 'SHF-02', shiftName: 'Production Shift A (Morning)', startTime: '07:00', endTime: '15:30', gracePeriodMinutes: 10, breakDurationMinutes: 30, lateRule: 'Marked Late', earlyCheckoutRule: 'Not Allowed', overtimeRule: '2.0x Rate', weeklyOff: 'Sunday', status: 'Active' },
  { id: 'SHF-03', shiftName: 'Production Shift B (Evening)', startTime: '15:30', endTime: '00:00', gracePeriodMinutes: 10, breakDurationMinutes: 30, lateRule: 'Marked Late', earlyCheckoutRule: 'Not Allowed', overtimeRule: '2.0x Rate', weeklyOff: 'Sunday', status: 'Active' },
];

export const mockShiftRosters: ShiftRosterItem[] = [
  { id: 'RST-101', employeeId: 'EMP-TECH-01', employeeName: 'Anil Desai', department: 'Maintenance & Services', date: '2026-09-24', shiftId: 'SHF-01', shiftName: 'General Day Shift', assignedBy: 'Sanjay Shah (HR)' },
  { id: 'RST-102', employeeId: 'EMP-TECH-02', employeeName: 'Suresh Verma', department: 'Field Service', date: '2026-09-24', shiftId: 'SHF-01', shiftName: 'General Day Shift', assignedBy: 'Sanjay Shah (HR)' },
  { id: 'RST-103', employeeId: 'EMP-TECH-03', employeeName: 'Vikram Solanki', department: 'Plant Maintenance', date: '2026-09-24', shiftId: 'SHF-02', shiftName: 'Production Shift A', assignedBy: 'Rajesh Kumar' },
];

export const mockHolidays: HolidayItem[] = [
  { id: 'HOL-01', holidayName: 'Mahatma Gandhi Jayanti', date: '2026-10-02', holidayType: 'Public Holiday', location: 'Surat & Pune Plants', applicableDepartments: ['All'], isOptional: false, status: 'Active' },
  { id: 'HOL-02', holidayName: 'Diwali (Laxmi Pujan)', date: '2026-11-08', holidayType: 'Festival', location: 'Surat Plant', applicableDepartments: ['All'], isOptional: false, status: 'Active' },
  { id: 'HOL-03', holidayName: 'New Year Day', date: '2027-01-01', holidayType: 'Company Holiday', location: 'All Locations', applicableDepartments: ['All'], isOptional: true, status: 'Active' },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 'ATT-101', employeeId: 'EMP-TECH-01', employeeName: 'Anil Desai', department: 'Maintenance & Services', date: '2026-09-24', shiftName: 'General Day Shift', checkIn: '08:52 AM', checkOut: '06:15 PM', totalHours: 9.38, lateMinutes: 0, earlyCheckoutMinutes: 0, overtimeHours: 0.5, status: 'Present', source: 'Biometric System' },
  { id: 'ATT-102', employeeId: 'EMP-TECH-02', employeeName: 'Suresh Verma', department: 'Field Service', date: '2026-09-24', shiftName: 'General Day Shift', checkIn: '09:05 AM', checkOut: '06:30 PM', totalHours: 9.41, lateMinutes: 5, earlyCheckoutMinutes: 0, overtimeHours: 0.5, status: 'Present', source: 'Mobile App GPS' },
  { id: 'ATT-103', employeeId: 'EMP-TECH-03', employeeName: 'Vikram Solanki', department: 'Plant Maintenance', date: '2026-09-24', shiftName: 'Production Shift A', checkIn: '06:55 AM', checkOut: '03:45 PM', totalHours: 8.83, lateMinutes: 0, earlyCheckoutMinutes: 0, overtimeHours: 0.25, status: 'Present', source: 'Biometric System' },
  { id: 'ATT-104', employeeId: 'EMP-2026-004', employeeName: 'Pravin Jadhav', department: 'Production', date: '2026-09-24', shiftName: 'General Day Shift', checkIn: '09:25 AM', checkOut: '06:00 PM', totalHours: 8.58, lateMinutes: 25, earlyCheckoutMinutes: 0, overtimeHours: 0, status: 'Late', source: 'Biometric System', remarks: 'Traffic delay' },
];

export const mockLeaveTypes: LeaveType[] = [
  { id: 'LT-01', leaveCode: 'CL', leaveName: 'Casual Leave', annualQuota: 12, monthlyAccrual: 1, carryForwardAllowed: false, maxConsecutiveDays: 3, halfDayAllowed: true, attachmentRequired: false, status: 'Active' },
  { id: 'LT-02', leaveCode: 'SL', leaveName: 'Sick Leave', annualQuota: 12, monthlyAccrual: 1, carryForwardAllowed: true, maxConsecutiveDays: 5, halfDayAllowed: true, attachmentRequired: true, status: 'Active' },
  { id: 'LT-03', leaveCode: 'EL', leaveName: 'Earned / Privilege Leave', annualQuota: 18, monthlyAccrual: 1.5, carryForwardAllowed: true, maxConsecutiveDays: 15, halfDayAllowed: false, attachmentRequired: false, status: 'Active' },
];

export const mockLeaveBalances: LeaveBalance[] = [
  { employeeId: 'EMP-TECH-01', leaveTypeId: 'LT-01', leaveName: 'Casual Leave', totalQuota: 12, usedDays: 3, pendingDays: 0, availableBalance: 9 },
  { employeeId: 'EMP-TECH-01', leaveTypeId: 'LT-02', leaveName: 'Sick Leave', totalQuota: 12, usedDays: 1, pendingDays: 0, availableBalance: 11 },
  { employeeId: 'EMP-TECH-01', leaveTypeId: 'LT-03', leaveName: 'Earned Leave', totalQuota: 18, usedDays: 4, pendingDays: 1, availableBalance: 13 },
];

export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'LR-2026-01', leaveNumber: 'LV-2026-001', employeeId: 'EMP-TECH-01', employeeName: 'Anil Desai', department: 'Maintenance & Services', leaveTypeId: 'LT-03', leaveName: 'Earned Leave', fromDate: '2026-10-05', toDate: '2026-10-07', numberOfDays: 3, isHalfDay: false, reason: 'Family function at hometown.', reportingManager: 'Sanjay Shah (HR)', status: 'Approved', appliedDate: '2026-09-20', approvedBy: 'Sanjay Shah', approvedDate: '2026-09-21' },
  { id: 'LR-2026-02', leaveNumber: 'LV-2026-002', employeeId: 'EMP-TECH-02', employeeName: 'Suresh Verma', department: 'Field Service', leaveTypeId: 'LT-02', leaveName: 'Sick Leave', fromDate: '2026-09-28', toDate: '2026-09-28', numberOfDays: 1, isHalfDay: false, reason: 'Viral fever checkup.', reportingManager: 'Sanjay Shah (HR)', status: 'Pending', appliedDate: '2026-09-23' },
];

export const mockWFHRequests: WFHRequest[] = [
  { id: 'WFH-2026-01', wfhNumber: 'WFH-2026-001', employeeId: 'EMP-2026-005', employeeName: 'Sneha Sharma', department: 'Designer', fromDate: '2026-09-25', toDate: '2026-09-25', numberOfDays: 1, reason: 'Home broadband fiber installation', workDescription: '3D CAD Model revision for Heavy Gantry Frame', reportingManager: 'Design Head', status: 'Approved' },
];

export const mockMissedPunchRequests: MissedPunchRequest[] = [
  { id: 'MP-2026-01', requestNumber: 'MP-2026-001', employeeId: 'EMP-TECH-03', employeeName: 'Vikram Solanki', date: '2026-09-22', missingPunchType: 'Check-Out', requestedTime: '06:15 PM', reason: 'Biometric reader power reset during evening shift change.', reportingManager: 'Rajesh Kumar', status: 'Approved' },
];

export const mockRegularizationRequests: AttendanceRegularization[] = [
  { id: 'REG-2026-01', regularizationNo: 'REG-2026-001', employeeId: 'EMP-2026-004', employeeName: 'Pravin Jadhav', date: '2026-09-24', originalStatus: 'Late', requestedStatus: 'Present', originalCheckIn: '09:25 AM', originalCheckOut: '06:00 PM', correctedCheckIn: '09:00 AM', correctedCheckOut: '06:00 PM', reason: 'Assisted Reliance client emergency call at 08:30 AM before entering factory gate.', status: 'Approved' },
];

export const mockOvertimeRecords: OvertimeRecord[] = [
  { id: 'OT-2026-01', overtimeNo: 'OT-2026-001', employeeId: 'EMP-TECH-01', employeeName: 'Anil Desai', department: 'Maintenance & Services', date: '2026-09-21', regularHours: 8, overtimeHours: 3.5, reason: 'Emergency SKF Bearing replacement at Adani Mundra Port site.', overtimeRateMultiplier: 1.5, overtimeAmount: 1850, approvedBy: 'Sanjay Shah (HR)', status: 'Approved' },
  { id: 'OT-2026-02', overtimeNo: 'OT-2026-002', employeeId: 'EMP-TECH-03', employeeName: 'Vikram Solanki', department: 'Plant Maintenance', date: '2026-09-23', regularHours: 8, overtimeHours: 2.5, reason: 'Fanuc Robotic Welding cell emergency encoder battery calibration.', overtimeRateMultiplier: 1.5, overtimeAmount: 1250, approvedBy: 'Rajesh Kumar', status: 'Approved' },
];

export const mockEarlyCheckoutRequests: EarlyCheckoutRequest[] = [
  { id: 'EC-2026-01', requestNumber: 'EC-2026-001', employeeId: 'EMP-TECH-02', employeeName: 'Suresh Verma', date: '2026-09-26', shiftName: 'General Day Shift', expectedCheckout: '18:00', requestedCheckout: '16:30', reason: 'Catching evening train for Tata Motors Pune site service trip.', status: 'Approved' },
];

export const mockSalaryComponents: SalaryComponent[] = [
  { id: 'SC-01', componentCode: 'BASIC', componentName: 'Basic Salary', componentType: 'Earning', calculationType: 'Percentage of Basic', percentageOrFormula: '50% of CTC', isTaxable: true, isStatutory: true, status: 'Active' },
  { id: 'SC-02', componentCode: 'HRA', componentName: 'House Rent Allowance', componentType: 'Earning', calculationType: 'Percentage of Basic', percentageOrFormula: '40% of Basic', isTaxable: false, isStatutory: false, status: 'Active' },
  { id: 'SC-03', componentCode: 'CONV', componentName: 'Conveyance Allowance', componentType: 'Earning', calculationType: 'Fixed Amount', percentageOrFormula: '₹1,600 / Month', isTaxable: false, isStatutory: false, status: 'Active' },
  { id: 'SC-04', componentCode: 'MED', componentName: 'Medical Allowance', componentType: 'Earning', calculationType: 'Fixed Amount', percentageOrFormula: '₹1,250 / Month', isTaxable: false, isStatutory: false, status: 'Active' },
  { id: 'SC-05', componentCode: 'SPL', componentName: 'Special Allowance', componentType: 'Earning', calculationType: 'Fixed Amount', percentageOrFormula: 'Balancing Component', isTaxable: true, isStatutory: false, status: 'Active' },
  { id: 'SC-06', componentCode: 'PF_EMP', componentName: 'Employee Provident Fund (PF)', componentType: 'Deduction', calculationType: 'Percentage of Basic', percentageOrFormula: '12% of Basic (Max ₹1,800)', isTaxable: false, isStatutory: true, status: 'Active' },
  { id: 'SC-07', componentCode: 'ESI_EMP', componentName: 'Employee State Insurance (ESIC)', componentType: 'Deduction', calculationType: 'Percentage of Basic', percentageOrFormula: '0.75% of Gross', isTaxable: false, isStatutory: true, status: 'Active' },
  { id: 'SC-08', componentCode: 'PT', componentName: 'Professional Tax (PT)', componentType: 'Deduction', calculationType: 'Fixed Amount', percentageOrFormula: 'Gujarat / Maharashtra Slab (₹200)', isTaxable: false, isStatutory: true, status: 'Active' },
];

export const mockSalaryStructures: SalaryStructure[] = [
  {
    id: 'SAL-STR-01',
    structureName: 'Senior Field Service Engineer Structure',
    employeeId: 'EMP-TECH-01',
    employeeName: 'Anil Desai',
    effectiveFrom: '2026-04-01',
    basicSalary: 27500,
    hra: 11000,
    conveyanceAllowance: 1600,
    medicalAllowance: 1250,
    specialAllowance: 13650,
    grossSalary: 55000,
    employeePF: 1800,
    employeeESI: 0,
    professionalTax: 200,
    tdsMonthly: 1500,
    totalDeductions: 3500,
    netSalary: 51500,
    employerPF: 1800,
    employerESI: 0,
    totalCTC: 56800,
    status: 'Active',
  },
  {
    id: 'SAL-STR-02',
    structureName: 'Technician Lead Structure',
    employeeId: 'EMP-TECH-02',
    employeeName: 'Suresh Verma',
    effectiveFrom: '2026-04-01',
    basicSalary: 22000,
    hra: 8800,
    conveyanceAllowance: 1600,
    medicalAllowance: 1250,
    specialAllowance: 8350,
    grossSalary: 42000,
    employeePF: 1800,
    employeeESI: 0,
    professionalTax: 200,
    tdsMonthly: 800,
    totalDeductions: 2800,
    netSalary: 39200,
    employerPF: 1800,
    employerESI: 0,
    totalCTC: 43800,
    status: 'Active',
  },
];

export const mockPayrollRecords: PayrollRecord[] = [
  {
    id: 'PAY-2026-09-01',
    payrollNumber: 'SLIP-2026-09-001',
    monthYear: 'September 2026',
    financialYear: '2026-2027',
    employeeId: 'EMP-TECH-01',
    employeeName: 'Anil Desai',
    department: 'Maintenance & Services',
    designation: 'Senior Field Service Engineer',
    workingDays: 26,
    presentDays: 25,
    leaveDays: 1,
    lossOfPayDays: 0,
    overtimeHours: 3.5,
    basicSalary: 27500,
    hra: 11000,
    allowances: 16500,
    overtimeAmount: 1850,
    grossEarnings: 56850,
    pfDeduction: 1800,
    esiDeduction: 0,
    ptDeduction: 200,
    tdsDeduction: 1500,
    loanAdvanceRecovery: 0,
    otherDeductions: 0,
    totalDeductions: 3500,
    netSalary: 53350,
    employerPF: 1800,
    employerESI: 0,
    totalCTC: 58650,
    status: 'Approved',
    processedDate: '2026-09-24',
    approvedBy: 'Sanjay Shah (HR)',
    accountingVoucherRef: 'JV-PAY-2026-09',
  },
];

export const mockEmployeeAdvances: EmployeeAdvanceLoan[] = [
  {
    id: 'LN-2026-01',
    loanNumber: 'ADV-2026-001',
    employeeId: 'EMP-TECH-02',
    employeeName: 'Suresh Verma',
    department: 'Field Service',
    loanType: 'Emergency Loan',
    sanctionedAmount: 30000,
    disbursementDate: '2026-07-10',
    reason: 'Medical emergency expenses for family.',
    emiAmount: 5000,
    totalInstallments: 6,
    paidInstallments: 2,
    outstandingBalance: 20000,
    recoveryStartMonth: 'August 2026',
    status: 'Active',
  },
];

export const mockReimbursements: ReimbursementExpense[] = [
  {
    id: 'REIMB-2026-01',
    reimbursementNo: 'EXP-2026-001',
    employeeId: 'EMP-TECH-01',
    employeeName: 'Anil Desai',
    department: 'Maintenance & Services',
    expenseDate: '2026-09-22',
    category: 'Travel / Conveyance',
    amount: 2500,
    description: 'Taxi fare & hotel meals during Reliance Hazira client service trip.',
    receiptUrl: '/receipts/hazira_trip.pdf',
    projectId: 'PRJ-2026-001',
    jobNumber: 'JOB-2026-001',
    status: 'Approved',
    approvedBy: 'Sanjay Shah (HR)',
  },
];

export const mockKPIMasters: KPIMaster[] = [
  { id: 'KPI-01', kpiCode: 'KPI-MTTR', kpiName: 'Field Service MTTR (Mean Time to Repair)', department: 'Maintenance & Services', measurementUnit: 'Hours', targetValue: 3.0, weightagePercent: 30, description: 'Average time taken to resolve customer machine breakdown.' },
  { id: 'KPI-02', kpiCode: 'KPI-CSAT', kpiName: 'Customer Service Satisfaction Rating', department: 'Maintenance & Services', measurementUnit: 'Score out of 5', targetValue: 4.8, weightagePercent: 30, description: 'Client feedback score on official signed Service Reports.' },
  { id: 'KPI-03', kpiCode: 'KPI-PM-COMP', kpiName: 'Preventive Maintenance Schedule Compliance', department: 'Maintenance & Services', measurementUnit: 'Percentage %', targetValue: 95, weightagePercent: 40, description: 'On-time completion of monthly PM checkups.' },
];

export const mockEmployeeAppraisals: EmployeeAppraisal[] = [
  { id: 'APP-2026-01', appraisalNumber: 'APR-2026-001', employeeId: 'EMP-TECH-01', employeeName: 'Anil Desai', department: 'Maintenance & Services', cyclePeriod: 'FY 2025-26 Annual', kpiScore: 4.9, selfRating: 4.8, managerRating: 4.9, finalScore: 4.9, managerComments: 'Outstanding performance on Hazira & Mundra port critical breakdown recoveries.', promotionRecommended: true, recommendedIncrementPct: 15.0, status: 'Completed' },
];

export const mockTrainingPrograms: TrainingProgram[] = [
  { id: 'TRN-2026-01', trainingCode: 'TRN-ROBOT-01', title: 'Fanuc 6-Axis Robotic Welding & Safety Certification', department: 'Production & Maintenance', trainerName: 'Fanuc India Master Trainer', trainingDate: '2026-10-10', durationHours: 16, trainingType: 'CNC Machine Operation', totalParticipants: 8, costPerParticipant: 4500, status: 'Scheduled' },
];

export const mockJobPositions: JobPosition[] = [
  { id: 'JOB-POS-01', positionCode: 'POS-CNC-02', title: 'Senior 5-Axis CNC Milling Operator', department: 'Production', designation: 'CNC Operator', vacancies: 2, experienceRequired: '4-6 Years', salaryMin: 35000, salaryMax: 48000, jobDescription: 'Haas VMC-850 programming, fixture setup and high precision machining.', status: 'Open' },
  { id: 'JOB-POS-02', positionCode: 'POS-SRV-01', title: 'Field Service Engineer (Hydraulics)', department: 'Maintenance & Services', designation: 'Field Service Engineer', vacancies: 1, experienceRequired: '3-5 Years', salaryMin: 40000, salaryMax: 55000, jobDescription: 'On-site hydraulic power pack overhaul and proportional valve troubleshooting.', status: 'Open' },
];

export const mockCandidateProfiles: CandidateProfile[] = [
  { id: 'CAND-101', candidateCode: 'CND-2026-01', candidateName: 'Pravin Solanki', email: 'pravin.solanki@gmail.com', mobile: '+91 97120 88776', appliedPosition: 'Senior 5-Axis CNC Milling Operator', department: 'Production', experienceYears: 5, noticePeriodDays: 30, currentCTC: 420000, expectedCTC: 520000, resumeUrl: '/resumes/pravin_solanki.pdf', status: 'Offered' },
];

export const mockInterviewRecords: InterviewRecord[] = [
  { id: 'INT-2026-01', candidateId: 'CAND-101', candidateName: 'Pravin Solanki', position: 'Senior 5-Axis CNC Milling Operator', interviewRound: 'Round 1 Technical', interviewerName: 'Rajesh Kumar (Production Manager)', interviewDate: '2026-09-15', technicalScore: 9, communicationScore: 8, result: 'Pass', remarks: 'Excellent G-code programming & fixture setup experience.' },
];

export const mockOfferLetters: OfferLetter[] = [
  { id: 'OFF-2026-01', offerNumber: 'OFF-2026-001', candidateId: 'CAND-101', candidateName: 'Pravin Solanki', position: 'Senior 5-Axis CNC Milling Operator', offeredDesignation: 'CNC Operator', offeredCTC: 500000, joiningDate: '2026-10-01', validUntil: '2026-09-28', status: 'Accepted' },
];
