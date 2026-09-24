export interface TestCaseItem {
  id: string;
  module: 'Foundation' | 'CRM' | 'Project' | 'Design' | 'Purchase' | 'Store' | 'Production' | 'Accounting' | 'HR' | 'Maintenance' | 'Integration';
  category: string;
  title: string;
  description: string;
  steps: string[];
  expectedResult: string;
  status: 'Pass' | 'Fail' | 'Blocked' | 'Pending';
  executedBy?: string;
  executedDate?: string;
  remarks?: string;
}

export interface BugTicket {
  id: string;
  bugNo: string;
  module: string;
  page: string;
  title: string;
  description: string;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  priority: 'Urgent' | 'High' | 'Normal' | 'Low';
  assignedDeveloper: string;
  status: 'Open' | 'In_Progress' | 'Fixed' | 'Retest' | 'Closed' | 'Reopened';
  createdDate: string;
  resolvedDate?: string;
}

export interface BackupRecord {
  id: string;
  backupNo: string;
  type: 'Full_System' | 'Database_Only' | 'Documents_Only' | 'Daily_Auto' | 'Weekly_Auto';
  fileName: string;
  fileSize: string;
  recordCount: number;
  createdDate: string;
  createdBy: string;
  status: 'Verified_Valid' | 'In_Progress' | 'Failed';
  location: string;
}

export interface DataImportLog {
  id: string;
  importNo: string;
  entityType: 'Customers' | 'Suppliers' | 'Items' | 'Opening_Stock' | 'Employees' | 'Chart_of_Accounts' | 'Opening_Receivables';
  fileName: string;
  totalRecords: number;
  importedRecords: number;
  failedRecords: number;
  importedDate: string;
  importedBy: string;
  status: 'Success' | 'Partial_Success' | 'Failed';
}

export interface SecurityAuditCheck {
  id: string;
  category: 'Authentication' | 'Authorization' | 'Data_Privacy' | 'Database_Security' | 'API_Protection';
  title: string;
  description: string;
  status: 'Passed' | 'Action_Required' | 'In_Review';
  riskLevel: 'Low' | 'Medium' | 'High';
  lastAudited: string;
}

export interface GoLiveChecklistItem {
  id: string;
  module: string;
  criteria: string;
  status: 'Pass' | 'Fail' | 'Pending';
  verifiedBy: string;
}
