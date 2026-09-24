export type DepartmentType =
  | 'crm'
  | 'project'
  | 'designer'
  | 'purchase'
  | 'store'
  | 'production'
  | 'accounting'
  | 'maintenance'
  | 'hr';

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'department_manager'
  | 'department_employee';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'assign'
  | 'export'
  | 'print'
  | 'submit'
  | 'final_approval';

export interface UserPermission {
  department: DepartmentType;
  actions: PermissionAction[];
  pages?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: DepartmentType;
  designation: string;
  avatarUrl?: string;
  phone: string;
  isFamilyMember?: boolean;
  assignedDepartments?: DepartmentType[];
  permissions: UserPermission[];
}

export type JobStatus =
  | 'draft'
  | 'planning'
  | 'design'
  | 'material_planning'
  | 'purchase'
  | 'production'
  | 'qc'
  | 'ready_for_dispatch'
  | 'dispatched'
  | 'installation'
  | 'completed'
  | 'cancelled';

export interface WorkflowStep {
  id: string;
  name: string;
  department: DepartmentType;
  status: 'completed' | 'in_progress' | 'pending' | 'delayed' | 'skipped';
  completedAt?: string;
  completedBy?: string;
  documentRef?: string;
  remarks?: string;
}

export interface JobTraceabilityRecord {
  jobNumber: string; // e.g., 'JOB-2026-001'
  salesOrderId: string; // e.g., 'SO-2026-012'
  quotationId: string; // e.g., 'QUO-2026-045'
  customerPoNumber: string; // e.g., 'PO/ABC/2026/89'
  customerId: string;
  customerName: string;
  productName: string;
  productCode: string;
  specification: string;
  quantity: number;
  unit: string;
  orderValue: number;
  startDate: string;
  targetDeliveryDate: string;
  currentStatus: JobStatus;
  progressPercent: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectManager: string;
  steps: WorkflowStep[];
  linkedRecords: {
    leadId?: string;
    designRev?: string;
    bomId?: string;
    purchaseOrders?: string[];
    grnNumbers?: string[];
    materialIssues?: string[];
    workOrderIds?: string[];
    qcReportId?: string[];
    invoiceNumbers?: string[];
    serviceId?: string;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  department: DepartmentType;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'LOGIN' | 'LOGOUT';
  module: string;
  page: string;
  recordId: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert' | 'approval_request';
  department: DepartmentType;
  linkUrl?: string;
  isRead: boolean;
  priority: 'normal' | 'high';
}
