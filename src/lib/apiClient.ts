/**
 * UMA Techno Fab Private Limited - ERP API Client
 * Connects Next.js frontend to Django REST Framework backend on PythonAnywhere.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://umaERP.pythonanywhere.com/api';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

// Auto-authentication helper with Inflight Deduplication & Fast Failure Cooldown
let inflightAuthPromise: Promise<string | null> | null = null;
let lastAuthFailureTime = 0;
const AUTH_FAILURE_COOLDOWN_MS = 30000; // 30s cooldown on login failure to prevent hammering backend

async function getOrRefreshToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('access_token');
  if (token) return token;

  // Don't hammer backend repeatedly if recent attempt failed
  if (Date.now() - lastAuthFailureTime < AUTH_FAILURE_COOLDOWN_MS) {
    return null;
  }

  // Deduplicate concurrent authentication requests
  if (inflightAuthPromise) {
    return inflightAuthPromise;
  }

  inflightAuthPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.access) {
          localStorage.setItem('access_token', data.access);
          if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
          return data.access;
        }
      } else {
        lastAuthFailureTime = Date.now();
      }
    } catch (err) {
      console.warn('Auto-authentication failed:', err);
      lastAuthFailureTime = Date.now();
    } finally {
      inflightAuthPromise = null;
    }
    return null;
  })();

  return inflightAuthPromise;
}

function normalizePayload(endpoint: string, body: any, method = 'POST'): any {
  if (!body || typeof body !== 'object') return body;
  const d = { ...body };
  const ep = endpoint.toLowerCase();
  const nowStr = new Date().toISOString().split('T')[0];
  const isPatchOrPut = method === 'PATCH' || method === 'PUT';

  // Only assign fallback ID for POST (creation) requests, NEVER for PATCH/PUT updates!
  if (!isPatchOrPut) {
    if (!ep.includes('/grns')) {
      d.id = d.id || d.salesOrderNumber || d.sales_order_number || d.code || d.departmentCode || d.department_code || d.leadNumber || d.leadNo || d.customerCode || d.enquiryNo || d.opportunityNo || d.quotationNumber || d.poNumber || d.soNumber || d.job_number || d.designJobNumber || d.bomNumber || d.supplierCode || d.vendorCode || d.requisitionNumber || d.rfqNumber || d.itemCode || d.warehouseCode || d.inspectionNumber || d.issueNumber || d.transferNumber || d.workCenterCode || d.planNumber || d.workOrderNumber || d.assetCode || d.requestNumber || d.designationCode || d.leaveNumber || d.loanNumber || d.invoiceNumber || d.receiptNumber || d.paymentNumber || d.expenseNumber || `DOC-${Date.now().toString().slice(-6)}`;
    }
  }

  // Organization & Employees
  if (ep.includes('/departments')) {
    d.code = d.code || d.departmentCode || d.department_code || d.id || 'DEPT';
    d.name = d.name || d.departmentName || d.code;
  } else if (ep.includes('/roles')) {
    d.id = d.id || d.code || d.roleCode || `ROLE-${Date.now().toString().slice(-4)}`;
    d.role_code = d.role_code || d.roleCode || d.code || d.id;
    d.name = d.name || 'Role';
    d.department = d.department || 'Production';
  } else if (ep.includes('/employees')) {
    d.username = d.username || (d.email ? d.email.split('@')[0] : (d.employeeId || d.id || `emp_${Date.now()}`));
    d.employee_id = d.employee_id || d.employeeId || d.id || `EMP-${Date.now().toString().slice(-4)}`;
    d.first_name = d.first_name || d.firstName || 'First';
    d.last_name = d.last_name || d.lastName || 'Last';
    d.email = d.email || `${d.username}@umaerp.com`;
  }
  // CRM
  else if (ep.includes('/leads')) {
    d.lead_no = d.lead_no || d.leadNo || d.id;
    d.leadNo = d.lead_no;
    d.company_name = d.company_name || d.companyName || '';
    d.companyName = d.company_name;
    d.contact_person = d.contact_person || d.contactPerson || '';
    d.contactPerson = d.contact_person;
    d.product_name = d.product_name || d.productName || d.requirementDescription || '';
    d.productName = d.product_name;
    d.mobile = d.mobile || d.phone || d.whatsapp || d.contactMobile || d.contact_mobile || d.alt_mobile || d.altMobile || '';
    d.alt_mobile = d.alt_mobile || d.altMobile || '';
    d.machine_type = d.machine_type || d.machineType || '';
    d.requirement_description = d.requirement_description || d.requirementDescription || '';
    d.expected_delivery = d.expected_delivery || d.expectedDelivery || '';
    d.next_follow_up_date = d.next_follow_up_date || d.nextFollowUpDate || '';
    d.assigned_sales_person_id = d.assigned_sales_person_id || d.assignedSalesPersonId || '';
    d.assigned_sales_person_name = d.assigned_sales_person_name || d.assignedSalesPersonName || '';
    d.created_date = d.created_date || d.createdDate || nowStr;
  } else if (ep.includes('/followups')) {
    d.followUpNo = d.followUpNo || d.follow_up_no || d.id || `FLW-2026-${Date.now().toString().slice(-4)}`;
    d.follow_up_no = d.followUpNo;
    d.id = d.id || d.followUpNo;
    d.leadOrCustomerId = d.leadOrCustomerId || d.lead_or_customer_id || 'REF-001';
    d.lead_or_customer_id = d.leadOrCustomerId;
    d.leadOrCustomerName = d.leadOrCustomerName || d.lead_or_customer_name || 'Customer';
    d.lead_or_customer_name = d.leadOrCustomerName;
    d.entityType = d.entityType || d.entity_type || 'lead';
    d.entity_type = d.entityType;
    d.type = d.type || 'call';
    d.assignedToId = d.assignedToId || d.assigned_to_id || 'EMP-001';
    d.assigned_to_id = d.assignedToId;
    d.assignedToName = d.assignedToName || d.assigned_to_name || 'Sales Officer';
    d.assigned_to_name = d.assignedToName;
    d.date = d.date || nowStr;
    d.time = d.time || '11:00 AM';
    d.priority = d.priority || 'medium';
    d.purpose = d.purpose || 'Follow-up';
    d.notes = d.notes || '';
    d.status = d.status || 'pending';
    d.next_follow_up_date = d.next_follow_up_date || d.nextFollowUpDate || '';
    d.nextFollowUpDate = d.next_follow_up_date;
  } else if (ep.includes('/customers')) {
    d.companyName = d.companyName || d.company_name || d.name || '';
    d.company_name = d.companyName;
    d.contactPerson = d.contactPerson || d.contact_person || d.name || '';
    d.contact_person = d.contactPerson;
    d.mobile = d.mobile || d.phone || d.whatsapp || d.contactMobile || d.contact_mobile || d.alt_mobile || d.altMobile || '';
  } else if (ep.includes('/enquiries')) {
    d.customerId = d.customerId || d.customer_id || 'CUST-001';
    d.customer_id = d.customerId;
    d.customerName = d.customerName || d.customer_name || 'Customer';
    d.customer_name = d.customerName;
    d.enquiryNo = d.enquiryNo || d.enquiry_no || d.id || `ENQ-${Date.now().toString().slice(-4)}`;
    d.enquiry_no = d.enquiryNo;
    d.machineProduct = d.machineProduct || d.productName || d.machine_product || d.requirement || 'Equipment';
    d.machine_product = d.machineProduct;
    d.requirement = d.requirement || d.title || d.specification || d.machineProduct || 'Requirements';
    d.date = d.date || d.enquiryDate || nowStr;
    d.enquiryDate = d.date;
  } else if (ep.includes('/opportunities')) {
    d.customerId = d.customerId || d.customer_id || 'CUST-001';
    d.customerName = d.customerName || d.customer_name || 'Customer';
    d.machineProduct = d.machineProduct || d.productName || d.title || 'Equipment';
    d.expectedValue = d.expectedValue || d.estimatedValue || 10000;
  } else if (ep.includes('/sales-orders')) {
    if (d.salesOrderNumber || d.sales_order_number || d.soNumber) {
      d.sales_order_number = d.sales_order_number || d.salesOrderNumber || d.soNumber;
      d.salesOrderNumber = d.sales_order_number;
    }
    if (!isPatchOrPut && !d.id && d.sales_order_number) {
      d.id = d.sales_order_number;
    }
    if (d.deliveryDate && !d.target_delivery_date) {
      d.target_delivery_date = d.deliveryDate;
    }
    if (d.orderValue !== undefined && d.grand_total === undefined) {
      d.grand_total = Number(d.orderValue);
      d.total_amount = Number(d.orderValue);
    }
  } else if (ep.includes('/customer-pos')) {
    if (d.poNumber || d.po_number) {
      d.po_number = d.po_number || d.poNumber;
      d.poNumber = d.po_number;
    }
    if (!isPatchOrPut && !d.id && d.po_number) {
      d.id = d.po_number;
    }
    if (d.poAmount !== undefined && d.po_value === undefined) {
      d.po_value = Number(d.poAmount);
    }
  }
  // Projects
  else if (ep.includes('/projects')) {
    d.customerId = d.customerId || d.customer_id || 'CUST-001';
    d.customer_id = d.customerId;
    const resolvedCustName = d.customerName || d.customer_name || d.client_name || d.clientName || '';
    if (resolvedCustName && resolvedCustName !== 'Customer') {
      d.customerName = resolvedCustName;
      d.customer_name = resolvedCustName;
    } else {
      d.customerName = d.customerName || d.customer_name || 'Customer';
      d.customer_name = d.customerName;
    }
    const resolvedProdName = d.productName || d.product_name || d.title || d.machineProduct || d.machine_product || '';
    if (resolvedProdName && resolvedProdName !== 'Project Work') {
      d.productName = resolvedProdName;
      d.product_name = resolvedProdName;
    } else {
      d.productName = d.productName || d.product_name || d.title || 'Process Equipment';
      d.product_name = d.productName;
    }
    d.startDate = d.startDate || d.start_date || nowStr;
    d.start_date = d.startDate;
    d.targetDeliveryDate = d.targetDeliveryDate || d.target_delivery_date || d.deliveryDate || d.delivery_date || nowStr;
    d.target_delivery_date = d.targetDeliveryDate;
    if (d.projectNumber || d.project_number) {
      d.projectNumber = d.projectNumber || d.project_number;
      d.project_number = d.projectNumber;
    }
    d.projectNumber = d.projectNumber || d.project_number || d.id || `PRJ-${Date.now().toString().slice(-4)}`;
    d.project_number = d.projectNumber;
    d.jobNumber = d.jobNumber || d.job_number || d.projectNumber || d.id || `JOB-${Date.now().toString().slice(-4)}`;
    d.job_number = d.jobNumber;
    d.projectName = d.projectName || d.project_name || d.productName || 'Process Equipment';
    d.project_name = d.projectName;
    if (d.salesOrderId || d.sales_order_id) {
      d.salesOrderId = d.salesOrderId || d.sales_order_id;
      d.sales_order_id = d.salesOrderId;
    }
    if (d.salesOrderNumber || d.sales_order_number) {
      d.salesOrderNumber = d.salesOrderNumber || d.sales_order_number;
      d.sales_order_number = d.salesOrderNumber;
    }
    if (d.customerPoNumber || d.customer_po_number) {
      d.customerPoNumber = d.customerPoNumber || d.customer_po_number;
      d.customer_po_number = d.customerPoNumber;
    }
  }
  // Planning Stages
  else if (ep.includes('/planning-stages')) {
    d.id = d.id || `STG-${d.projectId || d.project_id || 'PRJ'}-${Date.now().toString().slice(-4)}`;
    d.projectId = d.projectId || d.project_id || 'PRJ-2026-0001';
    d.project_id = d.projectId;
    d.stageNumber = Number(d.stageNumber ?? d.stage_number ?? 1);
    d.stage_number = d.stageNumber;
    d.name = d.name || d.stageName || d.stage_name || `Stage ${d.stageNumber}`;
    d.stageName = d.name;
    d.department = d.department || d.responsibleDepartment || 'production';
    d.responsibleDepartment = d.department;
    d.assignedEmployeeName = d.assignedEmployeeName || d.assigned_employee_name || d.responsibleEmployee || '';
    d.responsibleEmployee = d.assignedEmployeeName;
    d.assignees = Array.isArray(d.assignees) ? d.assignees : (Array.isArray(d.assignedEmployees) ? d.assignedEmployees : []);
    d.assignedEmployees = d.assignees;
    d.status = d.status || 'pending';
    d.progress = Number(d.progress ?? d.progressPercent ?? 0);
    d.progressPercent = d.progress;
    d.startDate = d.startDate || d.start_date || d.plannedStart || '';
    d.plannedStart = d.startDate;
    d.endDate = d.endDate || d.end_date || d.plannedEnd || '';
    d.plannedEnd = d.endDate;
    d.description = d.description || d.remarks || d.deliverables || '';
    d.remarks = d.description;
  }
  // Project Tasks
  else if (ep.includes('/project-tasks')) {
    d.id = d.id || d.taskId || `TSK-${Date.now().toString().slice(-4)}`;
    d.projectId = d.projectId || d.project_id || 'PRJ-2026-0001';
    d.project_id = d.projectId;
    d.title = d.title || d.taskName || d.task_name || d.name || 'Project Task';
    d.taskName = d.title;
    d.department = d.department || 'production';
    d.taskNumber = d.taskNumber || d.task_number || `TSK-${Date.now().toString().slice(-4)}`;
    d.task_number = d.taskNumber;
    d.status = d.status || 'pending';
    d.priority = d.priority || 'medium';
    d.assignedToName = d.assignedToName || d.assignedTo || d.assigned_to_name || '';
    d.assignedTo = d.assignedToName;
  }
  // Designer BOMs
  else if (ep.includes('/designer/boms') || ep.includes('/boms')) {
    d.bomNumber = d.bomNumber || d.bom_number || d.bomNo || d.id || `BOM-${Date.now().toString().slice(-4)}`;
    d.bom_number = d.bomNumber;
    if (!isPatchOrPut && !d.id) {
      d.id = d.bomNumber;
    }
    d.jobNumber = d.jobNumber || d.job_number || 'JOB-2026-001';
    d.job_number = d.jobNumber;
    d.designJobId = d.designJobId || d.design_job_id || d.jobNumber || 'DES-2026-001';
    d.design_job_id = d.designJobId;
    d.projectId = d.projectId || d.project_id || 'PRJ-2026-0001';
    d.project_id = d.projectId;
    d.preparedBy = d.preparedBy || d.prepared_by || 'Engineering Team';
    d.prepared_by = d.preparedBy;
    d.activeRevision = d.activeRevision || d.active_revision || d.revisionNumber || d.revision || d.version || 'V1';
    d.active_revision = d.activeRevision;
    d.status = d.status || 'draft';
    if (d.items && Array.isArray(d.items)) {
      d.items = d.items.map((itm: any, idx: number) => {
        const rate = Number(itm.estimatedRate ?? itm.estimated_rate ?? itm.rate ?? itm.estRate ?? itm.unitPrice ?? itm.unitCost ?? 0);
        const qty = Number(itm.quantity ?? itm.qty ?? 1);
        const total = Number(itm.totalEstimatedAmount ?? itm.total_estimated_amount ?? itm.total_amount ?? itm.totalAmount ?? (qty * rate));
        const itemType = itm.itemType || itm.item_type || 'RAW_MATERIAL';
        const rawMat = itm.material || itm.partName || itm.itemName || `Item ${idx + 1}`;
        const matParts = typeof rawMat === 'string' ? rawMat.split(' - ') : [];
        const partNo = itm.partNumber || itm.part_number || (matParts.length > 1 ? matParts[0].trim() : `MAT-${String(idx + 1).padStart(3, '0')}`);
        const name = itm.itemName || itm.item_name || itm.partName || (matParts.length > 1 ? matParts.slice(1).join(' - ').trim() : rawMat);
        return {
          id: itm.id || `bi-${Date.now()}-${idx + 1}`,
          itemNo: itm.itemNo || itm.item_no || idx + 1,
          itemNumber: itm.itemNumber || itm.item_number || `ITM-${String(idx + 1).padStart(3, '0')}`,
          partNumber: partNo,
          part_number: partNo,
          itemName: name,
          item_name: name,
          partName: name,
          itemType: itemType,
          item_type: itm.item_type || itemType,
          material: itm.material || name,
          specification: itm.specification || itm.description || `Procurement: ${itm.procurement || 'PURCHASE'}`,
          quantity: qty,
          qty: qty,
          unit: itm.unit || 'PCS',
          procurement: itm.procurement || (itm.procurementType === 'In-House' ? 'FABRICATE' : 'PURCHASE'),
          procurementType: itm.procurementType || (itm.procurement === 'FABRICATE' ? 'In-House' : 'Purchase'),
          estimatedRate: rate,
          estimated_rate: rate,
          rate: rate,
          unitCost: rate,
          unitPrice: rate,
          totalEstimatedAmount: total,
          total_estimated_amount: total,
          total_amount: total,
          totalAmount: total,
          extendedCost: total,
        };
      });
      d.totalItems = d.items.length;
      d.total_items = d.items.length;
      d.totalEstimatedCost = d.items.reduce((sum: number, itm: any) => sum + (itm.totalEstimatedAmount || 0), 0);
      d.total_estimated_cost = d.totalEstimatedCost;
      d.estimatedTotalCost = d.totalEstimatedCost;
    }
  }
  // Material Requirements (MRP)
  else if (ep.includes('/material-requirements')) {
    d.id = d.id || `MRP-${d.jobId || d.jobNumber || 'REQ'}-${Date.now().toString().slice(-4)}`;
    d.itemName = d.itemName || d.item_name || d.materialName || d.material_name || d.partName || 'Required Material';
    d.item_name = d.itemName;
    d.jobId = d.jobId || d.job_id || d.jobNumber || d.job_number || '';
    d.job_id = d.jobId;
    d.jobNumber = d.jobNumber || d.job_number || d.jobId || '';
    d.job_number = d.jobNumber;
    d.projectId = d.projectId || d.project_id || 'PRJ-2026-0001';
    d.project_id = d.projectId;
    d.bomId = d.bomId || d.bom_id || d.bomNumber || '';
    d.bom_id = d.bomId;
    d.bomNumber = d.bomNumber || d.bom_number || d.bomId || '';
    d.bom_number = d.bomNumber;
    d.bomRevision = d.bomRevision || d.bom_revision || 'V1';
    d.bom_revision = d.bomRevision;
    d.partNumber = d.partNumber || d.part_number || d.itemCode || d.item_code || '';
    d.part_number = d.partNumber;
    d.itemCode = d.itemCode || d.item_code || d.partNumber || '';
    d.item_code = d.itemCode;
    const reqQ = Number(d.requiredQuantity ?? d.required_quantity ?? d.quantity ?? 1);
    d.requiredQuantity = isNaN(reqQ) ? 1 : reqQ;
    d.required_quantity = d.requiredQuantity;
    const avail = Number(d.availableStock ?? d.available_stock ?? 0);
    d.availableStock = isNaN(avail) ? 0 : avail;
    d.available_stock = d.availableStock;
    const resv = Number(d.reservedStock ?? d.reserved_stock ?? 0);
    d.reservedStock = isNaN(resv) ? 0 : resv;
    d.reserved_stock = d.reservedStock;
    const onOrd = Number(d.onOrderQuantity ?? d.on_order_quantity ?? 0);
    d.onOrderQuantity = isNaN(onOrd) ? 0 : onOrd;
    d.on_order_quantity = d.onOrderQuantity;
    const shortQ = Number(d.shortageQuantity ?? d.shortage_quantity ?? Math.max(0, d.requiredQuantity - d.availableStock));
    d.shortageQuantity = isNaN(shortQ) ? Math.max(0, d.requiredQuantity - d.availableStock) : shortQ;
    d.shortage_quantity = d.shortageQuantity;
    d.unitOfMeasure = d.unitOfMeasure || d.unit_of_measure || d.unit || 'NOS';
    d.unit_of_measure = d.unitOfMeasure;
    d.category = d.category || 'Raw Material';
    d.procurementType = d.procurementType || d.procurement_type || 'Purchase';
    d.procurement_type = d.procurementType;
    d.status = d.status || (d.shortageQuantity > 0 ? 'shortage' : 'covered');
  }
  // Purchase
  else if (ep.includes('/suppliers')) {
    d.vendorCode = d.vendorCode || d.supplierCode || d.code || d.id || 'SUP-001';
    d.contactPerson = d.contactPerson || d.contact_person || d.name || 'Vendor Rep';
    d.mobile = d.mobile || d.phone || d.whatsapp || '';
  } else if (ep.includes('/purchase-requisitions')) {
    d.prNumber = d.prNumber || d.pr_number || d.id || `PR-2026-${Date.now().toString().slice(-4)}`;
    d.pr_number = d.prNumber;
    d.id = d.id || d.prNumber;
    d.projectId = d.projectId || d.project_id || 'PRJ-2026-0001';
    d.project_id = d.projectId;
    d.jobId = d.jobId || d.job_code || d.jobNumber || '';
    d.job_code = d.jobId;
    d.jobNumber = d.jobNumber || d.jobId || '';
    d.requisitionDate = d.requisitionDate || d.prDate || d.request_date || nowStr;
    d.prDate = d.requisitionDate;
    d.request_date = d.requisitionDate;
    d.requiredByDate = d.requiredByDate || d.required_by_date || nowStr;
    d.required_by_date = d.requiredByDate;
    d.priority = d.priority || 'High';
    d.status = d.status || 'Submitted';
    d.requestedBy = d.requestedBy || d.requested_by || 'Purchase Officer';
    d.requested_by = d.requestedBy;
    d.department = d.department || 'Purchase / Planning';
    d.items = Array.isArray(d.items) ? d.items : [];
    d.totalItems = Number(d.totalItems || d.items.length || 1);
    d.estimatedCost = Number(d.estimatedCost ?? d.total_estimated_cost ?? 0);
    d.total_estimated_cost = d.estimatedCost;
  } else if (ep.includes('/rfqs')) {
    const due = new Date();
    due.setDate(due.getDate() + 7);
    d.dueDate = d.dueDate || d.due_date || due.toISOString().split('T')[0];
    d.rfqNumber = d.rfqNumber || d.rfq_number || d.id || `RFQ-2026-${Date.now().toString().slice(-4)}`;
    d.rfq_number = d.rfqNumber;
    d.rfqDate = d.rfqDate || d.date || nowStr;
    d.date = d.rfqDate;
  } else if (ep.includes('/supplier-quotations')) {
    d.quotationNumber = d.quotationNumber || d.quotation_number || d.id || `SQ-2026-${Date.now().toString().slice(-4)}`;
    d.quotation_number = d.quotationNumber;
    d.supplierId = d.supplierId || d.supplier_id || 'SUP-001';
    d.supplier_id = d.supplierId;
    d.supplierName = d.supplierName || d.supplier_name || 'Supplier';
    d.supplier_name = d.supplierName;
    d.date = d.date || d.quotationDate || nowStr;
    d.quotationDate = d.quotationDate || d.date || nowStr;
    d.valid_until = d.valid_until || d.validityDate || d.validUntil || nowStr;
    d.validityDate = d.validityDate || d.valid_until || d.validUntil || nowStr;
    d.validUntil = d.validUntil || d.valid_until || d.validityDate || nowStr;
  } else if (ep.includes('/purchase-orders')) {
    const deliv = new Date();
    deliv.setDate(deliv.getDate() + 14);
    d.poNumber = d.poNumber || d.po_number || d.id || `PO-2026-${Date.now().toString().slice(-4)}`;
    d.po_number = d.poNumber;
    d.id = d.id || d.poNumber;
    d.supplierId = d.supplierId || d.supplier_id || 'SUP-001';
    d.supplier_id = d.supplierId;
    d.supplierName = d.supplierName || d.supplier_name || 'Supplier';
    d.supplier_name = d.supplierName;
    d.deliveryDate = d.deliveryDate || d.delivery_date || deliv.toISOString().split('T')[0];
    d.preparedBy = d.preparedBy || d.prepared_by || 'Purchase Officer';
    d.date = d.date || d.poDate || nowStr;
    d.contactPerson = d.contactPerson ?? d.contact_person ?? '';
    d.supplierGstin = d.supplierGstin ?? d.supplier_gstin ?? '';
    d.supplierAddress = d.supplierAddress ?? d.supplier_address ?? '';
    d.projectId = d.projectId || d.project_id || 'PRJ-2026-0001';
    d.jobCode = d.jobCode || d.job_code || d.jobId || d.job_id || d.jobNumber || 'JOB-2026-001';
    d.paymentTerms = d.paymentTerms || d.payment_terms || '30 Days Credit';
    d.deliveryTerms = d.deliveryTerms || d.delivery_terms || 'FOR Destination (Uma Techno Fab GIDC Works)';
    d.dispatchMode = d.dispatchMode || d.dispatch_mode || 'By Road Truck';
    d.currency = d.currency || 'INR';
    d.status = d.status || 'Submitted';

    if (typeof d.revisionNumber === 'number') {
      d.revisionNumber = `Rev-${String(d.revisionNumber).padStart(2, '0')}`;
    } else {
      d.revisionNumber = d.revisionNumber || 'Rev-00';
    }

    const sub = Number(d.subTotal ?? d.sub_total ?? 0);
    d.subTotal = isNaN(sub) ? 0 : sub;
    d.sub_total = d.subTotal;

    const disc = Number(d.discountAmount ?? d.discount_amount ?? 0);
    d.discountAmount = isNaN(disc) ? 0 : disc;
    d.discount_amount = d.discountAmount;

    const tax = Number(d.taxAmount ?? d.tax_amount ?? d.taxTotal ?? d.tax_total ?? 0);
    d.taxAmount = isNaN(tax) ? 0 : tax;
    d.tax_amount = d.taxAmount;
    d.taxTotal = d.taxAmount;
    d.tax_total = d.taxAmount;

    const freight = Number(d.freightCharges ?? d.freight_charges ?? 0);
    d.freightCharges = isNaN(freight) ? 0 : freight;
    d.freight_charges = d.freightCharges;

    const grand = Number(d.grandTotal ?? d.grand_total ?? d.totalAmount ?? (d.subTotal + d.taxAmount + d.freightCharges - d.discountAmount));
    d.grandTotal = isNaN(grand) ? (d.subTotal + d.taxAmount) : grand;
    d.grand_total = d.grandTotal;
    d.totalAmount = d.grandTotal;

    d.items = (Array.isArray(d.items) ? d.items : []).map((it: any, idx: number) => {
      if (!it || typeof it !== 'object') return it;
      const q = Number(it.quantity ?? it.orderedQuantity ?? it.qty ?? 1);
      const up = Number(it.unitPrice ?? it.unit_price ?? it.rate ?? it.unitRate ?? 0);
      const tot = Number(it.totalAmount ?? it.totalPrice ?? it.total_amount ?? it.total_price ?? (q * up));
      const uom = it.uom || it.unitOfMeasure || it.unit_of_measure || it.unit || 'NOS';
      return {
        ...it,
        id: it.id || `POI-${d.poNumber}-${idx + 1}`,
        poId: d.id || d.poNumber,
        itemCode: it.itemCode || it.item_code || it.partNumber || `ITM-${idx + 1}`,
        partNumber: it.partNumber || it.part_number || it.itemCode || '',
        itemName: it.itemName || it.item_name || it.name || 'Material Item',
        description: it.description || it.specification || it.itemName || '',
        category: it.category || 'Raw Material',
        quantity: isNaN(q) ? 1 : q,
        orderedQuantity: isNaN(q) ? 1 : q,
        uom: uom,
        unitOfMeasure: uom,
        unitPrice: isNaN(up) ? 0 : up,
        unitRate: isNaN(up) ? 0 : up,
        totalAmount: isNaN(tot) ? 0 : tot,
        totalPrice: isNaN(tot) ? 0 : tot,
      };
    });

    for (const key of Object.keys(d)) {
      if (d[key] === null) {
        if (['subTotal', 'discountAmount', 'taxAmount', 'grandTotal', 'freightCharges', 'taxTotal'].includes(key)) {
          d[key] = 0;
        } else if (key !== 'approvedBy') {
          d[key] = '';
        }
      }
    }
  } else if (ep.includes('/purchase-returns')) {
    d.returnNumber = d.returnNumber || d.return_number || d.id || `PRT-2026-${Date.now().toString().slice(-4)}`;
    d.return_number = d.returnNumber;
    d.supplierId = d.supplierId || d.supplier_id || 'SUP-001';
    d.supplier_name = d.supplierName || d.supplier_name || 'Supplier';
    d.reason = d.reason || 'Quality Rejection';
    d.date = d.date || d.returnDate || nowStr;
  }
  // Store
  else if (ep.includes('/grns')) {
    if (isPatchOrPut) {
      d.grnNumber = d.grnNumber || d.grn_number || d.id;
      d.grn_number = d.grnNumber;
    } else {
      // On POST creation, let Django backend generate the authoritative sequential GRN ID
      delete d.id;
      delete d.grnNumber;
      delete d.grn_number;
    }
    d.date = d.date || d.grnDate || d.receiptDate || nowStr;
    d.po_id = d.po_id || d.poId || '';
    d.po_number = d.po_number || d.poNumber || '';
    d.supplier_id = d.supplier_id || d.supplierId || 'SUP-001';
    d.supplier_name = d.supplier_name || d.supplierName || 'Supplier';
    d.challan_number = d.challan_number || d.deliveryChallanNumber || d.challanNumber || '';
    d.invoice_number = d.invoice_number || d.invoiceNumber || '';
    d.vehicle_number = d.vehicle_number || d.vehicleNumber || '';
    d.warehouse_id = d.warehouse_id || d.warehouseId || 'WH-001';
    d.received_by = d.received_by || d.receivedBy || 'Store Officer';
    if (Array.isArray(d.items)) {
      d.items = d.items.map((itm: any) => ({
        item_id: itm.itemId || itm.id || '',
        item_code: itm.itemCode || itm.partNumber || '',
        item_name: itm.itemName || itm.description || 'Material Item',
        received_qty: Number(itm.receivedQuantity ?? itm.receivedQty ?? itm.quantity ?? 1),
        accepted_qty: Number(itm.acceptedQuantity ?? itm.acceptedQty ?? itm.quantity ?? 1),
        rejected_qty: Number(itm.rejectedQuantity ?? itm.rejectedQty ?? 0),
        unit: itm.uom || itm.unit || 'PCS',
        unit_rate: Number(itm.unitPrice ?? itm.unitRate ?? itm.rate ?? 0),
        total_amount: Number(itm.totalAmount ?? 0),
        itemName: itm.itemName || itm.description || 'Material Item',
        receivedQty: Number(itm.receivedQuantity ?? itm.receivedQty ?? itm.quantity ?? 1),
        unitRate: Number(itm.unitPrice ?? itm.unitRate ?? itm.rate ?? 0),
      }));
    } else {
      d.items = [];
    }
  } else if (ep.includes('/warehouses')) {
    d.warehouseCode = d.warehouseCode || d.warehouse_code || d.code || d.id || 'WH-001';
    d.warehouse_code = d.warehouseCode;
    d.name = d.name || 'Main Warehouse';
  } else if (ep.includes('/qc-inspections')) {
    d.grnId = d.grnId || d.grn_id || 'GRN-001';
    d.grn_id = d.grnId;
    d.grnNumber = d.grnNumber || d.grn_number || 'GRN-2026-0001';
    d.grn_number = d.grnNumber;
    d.date = d.date || d.inspectionDate || nowStr;
    d.inspectionDate = d.date;
    d.itemName = d.itemName || d.item_name || 'Material Component';
    d.item_name = d.itemName;
    d.status = d.status || 'passed';
  } else if (ep.includes('/material-issues')) {
    d.id = d.id || d.issueNumber || d.issue_number || `ISS-2026-${Date.now().toString().slice(-4)}`;
    d.issue_number = d.issue_number || d.issueNumber || d.id;
    d.issueNumber = d.issue_number;
    d.issue_date = d.issue_date || d.issueDate || d.date || nowStr;
    d.issueDate = d.issue_date;
    d.project_id = d.project_id || d.projectId || 'PRJ-2026-0001';
    d.projectId = d.project_id;
    d.job_number = d.job_number || d.jobId || d.jobNumber || '';
    d.jobId = d.job_number;
    d.work_order_id = d.work_order_id || d.workOrderNumber || d.workOrderId || '';
    d.workOrderNumber = d.work_order_id;
    d.bom_number = d.bom_number || d.bomNumber || '';
    d.bomNumber = d.bom_number;
    d.bom_revision = d.bom_revision || d.bomRevision || 'Rev-01';
    d.bomRevision = d.bom_revision;
    d.production_stage = d.production_stage || d.productionStage || 'Shell & Dish End Cutting / Rolling';
    d.productionStage = d.production_stage;
    d.department = d.department || 'Production';
    d.issued_to = d.issued_to || d.requestedBy || 'Bhavin Shah (Production Head)';
    d.requestedBy = d.issued_to;
    d.issued_by = d.issued_by || d.issuedBy || 'Hitesh Rawal (Store Incharge)';
    d.issuedBy = d.issued_by;
    d.warehouse_id = d.warehouse_id || d.warehouseId || 'WH-001';
    d.warehouseId = d.warehouse_id;
    d.warehouse_name = d.warehouse_name || d.warehouseName || 'Main Raw Material Warehouse';
    d.warehouseName = d.warehouse_name;
    d.total_issue_value = Number(d.total_issue_value ?? d.totalIssueValue ?? 0);
    d.totalIssueValue = d.total_issue_value;
    d.notes = d.notes || d.remarks || '';
    d.remarks = d.notes;
    d.status = d.status || 'Fully Issued';
    d.items = d.items || [];
  } else if (ep.includes('/material-returns')) {
    d.id = d.id || d.returnNumber || d.return_number || `RET-2026-${Date.now().toString().slice(-4)}`;
    d.return_number = d.return_number || d.returnNumber || d.id;
    d.returnNumber = d.return_number;
    d.return_date = d.return_date || d.returnDate || d.date || nowStr;
    d.returnDate = d.return_date;
    d.project_id = d.project_id || d.projectId || 'PRJ-2026-0001';
    d.projectId = d.project_id;
    d.job_number = d.job_number || d.jobId || d.jobNumber || '';
    d.jobId = d.job_number;
    d.work_order_number = d.work_order_number || d.workOrderNumber || '';
    d.workOrderNumber = d.work_order_number;
    d.material_issue_number = d.material_issue_number || d.materialIssueNumber || '';
    d.materialIssueNumber = d.material_issue_number;
    d.department = d.department || 'Production';
    d.returned_by = d.returned_by || d.returnedBy || 'Shop Floor Supervisor';
    d.returnedBy = d.returned_by;
    d.received_by = d.received_by || d.receivedBy || 'Hitesh Rawal (Store Incharge)';
    d.receivedBy = d.received_by;
    d.warehouse_id = d.warehouse_id || d.warehouseId || 'WH-001';
    d.warehouseId = d.warehouse_id;
    d.warehouse_name = d.warehouse_name || d.warehouseName || 'Main Raw Material Warehouse';
    d.warehouseName = d.warehouse_name;
    d.total_return_value = Number(d.total_return_value ?? d.totalReturnValue ?? 0);
    d.totalReturnValue = d.total_return_value;
    d.notes = d.notes || d.remarks || '';
    d.remarks = d.notes;
    d.status = d.status || 'Completed';
    d.items = d.items || [];
  }
  // Production
  else if (ep.includes('/work-centers')) {
    d.workCenterCode = d.workCenterCode || d.center_code || d.code || d.id || 'WC-001';
    d.workCenterName = d.workCenterName || d.name || 'Work Center';
  } else if (ep.includes('/production-plans')) {
    d.planNumber = d.planNumber || d.plan_number || d.id || `PP-2026-${Date.now().toString().slice(-4)}`;
    d.plan_number = d.planNumber;
  }
  // Maintenance
  else if (ep.includes('/internal-assets')) {
    d.assetName = d.assetName || d.name || 'Industrial Asset';
    d.assetCode = d.assetCode || d.asset_code || d.code || d.id || 'AST-001';
  } else if (ep.includes('/service-requests')) {
    d.requestNumber = d.requestNumber || d.request_number || d.id || `SR-2026-${Date.now().toString().slice(-4)}`;
    d.request_number = d.requestNumber;
    d.requestDate = d.requestDate || d.date || nowStr;
    d.customerName = d.customerName || d.client_name || d.assetName || 'Client';
  } else if (ep.includes('/pm-plans')) {
    d.planNumber = d.planNumber || d.plan_number || d.id || `PM-2026-${Date.now().toString().slice(-4)}`;
    d.plan_number = d.planNumber;
    d.startDate = d.startDate || nowStr;
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + 30);
    d.nextDueDate = d.nextDueDate || nextDue.toISOString().split('T')[0];
  } else if (ep.includes('/service-visits')) {
    d.id = d.id || d.visitNumber || d.visit_number || `SRV-2026-${Date.now().toString().slice(-4)}`;
    d.visitNumber = d.visitNumber || d.visit_number || d.id;
    d.visit_number = d.visitNumber;
    d.customerName = d.customerName || d.customer_name || 'Client';
    d.customer_name = d.customerName;
    d.visitDate = d.visitDate || d.visit_date || nowStr;
    d.visit_date = d.visitDate;
  }
  // HR
  else if (ep.includes('/designations')) {
    d.designationCode = d.designationCode || d.code || d.id || 'DES-001';
    d.designationName = d.designationName || d.name || 'Designation';
  } else if (ep.includes('/leave-requests')) {
    d.id = d.id || d.leaveNumber || `LV-${Date.now().toString().slice(-4)}`;
    d.leaveNumber = d.id;
    d.employeeId = d.employeeId || d.employee_id || 'EMP-001';
    d.department = d.department || 'General';
    d.leaveName = d.leaveName || d.leaveType || 'Casual Leave';
    d.appliedDate = d.appliedDate || d.date || nowStr;
    d.fromDate = d.fromDate || d.startDate || nowStr;
    d.toDate = d.toDate || d.endDate || nowStr;
    d.reason = d.reason || 'Personal / Sick Leave';
  } else if (ep.includes('/advance-loans') || ep.includes('/employee-advances')) {
    d.id = d.id || d.loanNumber || `ADV-${Date.now().toString().slice(-4)}`;
    d.loanNumber = d.id;
    d.employeeId = d.employeeId || d.employee_id || 'EMP-001';
    d.department = d.department || 'General';
    d.disbursementDate = d.disbursementDate || nowStr;
  } else if (ep.includes('/employee-onboardings')) {
    d.id = d.id || `ONB-${Date.now().toString().slice(-4)}`;
    d.designation = d.designation || d.position || 'Staff';
    d.department = d.department || 'Production';
    d.joiningDate = d.joiningDate || d.joining_date || nowStr;
  } else if (ep.includes('/employee-exits')) {
    d.id = d.id || `EXIT-${Date.now().toString().slice(-4)}`;
    d.employeeId = d.employeeId || d.employee_id || 'EMP-001';
    d.department = d.department || 'General';
    d.designation = d.designation || 'Staff';
    d.reason = d.reason || 'Career Growth / Personal';
    d.lastWorkingDate = d.lastWorkingDate || d.resignationDate || nowStr;
  }
  // Accounting
  else if (ep.includes('/sales-invoices')) {
    const due = new Date();
    due.setDate(due.getDate() + 30);
    d.invoiceNumber = d.invoiceNumber || d.invoice_number || d.id || `INV-2026-${Date.now().toString().slice(-4)}`;
    d.invoice_number = d.invoiceNumber;
    d.invoiceDate = d.invoiceDate || d.date || nowStr;
    d.date = d.invoiceDate;
    d.dueDate = d.dueDate || due.toISOString().split('T')[0];
    d.customerId = d.customerId || 'CUST-001';
    d.customerName = d.customerName || 'Customer';
  } else if (ep.includes('/purchase-invoices')) {
    const due = new Date();
    due.setDate(due.getDate() + 30);
    d.invoiceNumber = d.invoiceNumber || d.invoice_number || d.id || `PINV-2026-${Date.now().toString().slice(-4)}`;
    d.invoice_number = d.invoiceNumber;
    d.invoiceDate = d.invoiceDate || d.date || nowStr;
    d.date = d.invoiceDate;
    d.dueDate = d.dueDate || due.toISOString().split('T')[0];
    d.supplierId = d.supplierId || 'SUP-001';
    d.supplierName = d.supplierName || 'Supplier';
  } else if (ep.includes('/customer-receipts')) {
    d.receiptNumber = d.receiptNumber || d.receipt_number || d.id || `REC-2026-${Date.now().toString().slice(-4)}`;
    d.receipt_number = d.receiptNumber;
    d.id = d.id || d.receiptNumber;
    d.receiptDate = d.receiptDate || d.date || nowStr;
    d.receipt_date = d.receiptDate;
    d.date = d.receiptDate;
    d.customerId = d.customerId || d.customer_id || 'CUST-001';
    d.customer_id = d.customerId;
    d.customerName = d.customerName || d.customer_name || 'Customer';
    d.customer_name = d.customerName;
    d.paymentMode = d.paymentMode || d.payment_mode || 'Bank Transfer';
    d.payment_mode = d.paymentMode;
    d.amount = Number(d.amount || d.totalAmount || 0);
  } else if (ep.includes('/supplier-payments')) {
    d.paymentNumber = d.paymentNumber || d.payment_number || d.id || `PAY-2026-${Date.now().toString().slice(-4)}`;
    d.payment_number = d.paymentNumber;
    d.id = d.id || d.paymentNumber;
    d.paymentDate = d.paymentDate || d.date || nowStr;
    d.payment_date = d.paymentDate;
    d.date = d.paymentDate;
    d.supplierId = d.supplierId || d.supplier_id || 'SUP-001';
    d.supplier_id = d.supplierId;
    d.supplierName = d.supplierName || d.supplier_name || 'Supplier';
    d.supplier_name = d.supplierName;
    d.paymentMode = d.paymentMode || d.payment_mode || 'Bank Transfer';
    d.payment_mode = d.paymentMode;
    d.amount = Number(d.amount || d.totalAmount || 0);
  } else if (ep.includes('/expense-entries') || ep.includes('/expenses')) {
    d.expenseNumber = d.expenseNumber || d.expense_number || d.id || `EXP-2026-${Date.now().toString().slice(-4)}`;
    d.expense_number = d.expenseNumber;
    d.expenseDate = d.expenseDate || d.date || nowStr;
    d.date = d.expenseDate;
    d.category = d.category || 'General';
  }
  // Production Module Normalization
  else if (ep.includes('/production-schedules')) {
    d.scheduleNumber = d.scheduleNumber || d.schedule_number || d.id || `SCH-2026-${Date.now().toString().slice(-4)}`;
    d.schedule_number = d.scheduleNumber;
    d.job_number = d.jobNumber || d.job_number || d.jobId || '';
    d.work_order_number = d.workOrderNumber || d.work_order_number || d.woNum || '';
    d.operation_name = d.operationName || d.operation_name || d.opName || 'Operation';
    d.work_center_code = d.workCenterCode || d.work_center_code || d.wcCode || '';
    d.work_center_name = d.workCenterName || d.work_center_name || '';
    d.assigned_operator = d.assignedOperator || d.assigned_operator || d.operator || '';
  } else if (ep.includes('/production-entries')) {
    d.productionEntryNumber = d.productionEntryNumber || d.production_entry_number || d.id || `PENTRY-2026-${Date.now().toString().slice(-4)}`;
    d.production_entry_number = d.productionEntryNumber;
    d.entry_date = d.entryDate || d.entry_date || nowStr;
    d.job_number = d.jobNumber || d.job_number || d.jobId || '';
    d.work_order_number = d.workOrderNumber || d.work_order_number || '';
    d.operation_name = d.operationName || d.operation_name || 'Production Operation';
    d.operator_name = d.operatorName || d.operator_name || d.operator || 'Operator';
    d.produced_quantity = d.producedQuantity !== undefined ? d.producedQuantity : (d.produced_quantity || 0);
    d.rejected_quantity = d.rejectedQuantity !== undefined ? d.rejectedQuantity : (d.rejected_quantity || 0);
    d.rework_quantity = d.reworkQuantity !== undefined ? d.reworkQuantity : (d.rework_quantity || 0);
    d.scrap_quantity = d.scrapQuantity !== undefined ? d.scrapQuantity : (d.scrap_quantity || 0);
    d.good_quantity = d.goodQuantity !== undefined ? d.goodQuantity : Math.max(0, Number(d.produced_quantity) - Number(d.rejected_quantity) - Number(d.scrap_quantity));
  } else if (ep.includes('/rework-orders')) {
    d.reworkNumber = d.reworkNumber || d.rework_number || d.id || `RWK-2026-${Date.now().toString().slice(-4)}`;
    d.rework_number = d.reworkNumber;
    d.job_number = d.jobNumber || d.job_number || d.jobId || '';
    d.work_order_number = d.workOrderNumber || d.work_order_number || '';
    d.item_code = d.itemCode || d.item_code || 'ITEM-001';
    d.item_name = d.itemName || d.item_name || 'Component';
    d.start_date = d.startDate || d.start_date || nowStr;
    d.assigned_operator = d.assignedOperator || d.assigned_operator || d.operator || '';
    d.rework_instructions = d.reworkInstructions || d.rework_instructions || d.instructions || '';
  } else if (ep.includes('/production-scraps')) {
    d.scrapNumber = d.scrapNumber || d.scrap_number || d.id || `PSCRAP-2026-${Date.now().toString().slice(-4)}`;
    d.scrap_number = d.scrapNumber;
    d.entry_date = d.entryDate || d.entry_date || nowStr;
    d.job_number = d.jobNumber || d.job_number || d.jobId || '';
    d.work_order_number = d.workOrderNumber || d.work_order_number || '';
    d.material_code = d.materialCode || d.material_code || 'SCRAP-001';
    d.material_name = d.materialName || d.material_name || 'Scrap Material';
    d.scrap_type = d.scrapType || d.scrap_type || 'Cutting Scrap';
    d.operator_name = d.operatorName || d.operator_name || d.operator || '';
  } else if (ep.includes('/routing-operations')) {
    d.id = d.id || `OP-${(d.operationNumber || d.sequence || 1) * 10}`;
    d.operation_number = d.operationNumber !== undefined ? d.operationNumber : (d.operation_number || 10);
    d.operation_name = d.operationName || d.operation_name || 'Routing Operation';
    d.sequence = d.sequence !== undefined ? d.sequence : (d.sequence_number || 1);
    d.work_center_code = d.workCenterCode || d.work_center_code || '';
    d.work_center_name = d.workCenterName || d.work_center_name || '';
    d.machine_name = d.machineName || d.machine_name || '';
    d.department = d.department || 'Production';
    d.planned_setup_minutes = d.plannedSetupMinutes !== undefined ? d.plannedSetupMinutes : (d.planned_setup_minutes || 0);
    d.planned_processing_minutes = d.plannedProcessingMinutes !== undefined ? d.plannedProcessingMinutes : (d.planned_processing_minutes || 0);
    d.total_planned_minutes = d.totalPlannedMinutes !== undefined ? d.totalPlannedMinutes : (Number(d.planned_setup_minutes) + Number(d.planned_processing_minutes));
    d.assigned_operator = d.assignedOperator || d.assigned_operator || '';
    d.qc_required = d.qcRequired !== undefined ? d.qcRequired : (d.qc_required !== undefined ? d.qc_required : true);
    d.instructions = d.instructions || '';
    d.status = d.status || 'Ready';
  } else if (ep.includes('/production-holds')) {
    d.holdNumber = d.holdNumber || d.hold_number || d.id || `HLD-2026-${Date.now().toString().slice(-4)}`;
    d.hold_number = d.holdNumber;
    d.job_number = d.jobNumber || d.job_number || d.jobId || '';
    d.work_order_number = d.workOrderNumber || d.work_order_number || '';
    d.operation_name = d.operationName || d.operation_name || 'Fitting & Assembly';
    d.reason = d.reason || 'Material Shortage';
    d.description = d.description || '';
    d.start_date = d.startDate || d.start_date || nowStr;
    d.expected_resume_date = d.expectedResumeDate || d.expected_resume_date || null;
    d.approved_by = d.approvedBy || d.approved_by || 'Production Manager';
    d.status = d.status || 'Active Hold';
  } else if (ep.includes('/material-issues')) {
    d.issueNumber = d.issueNumber || d.issue_number || d.id || `ISS-2026-${Date.now().toString().slice(-4)}`;
    d.issue_number = d.issueNumber;
    d.job_number = d.jobNumber || d.job_number || d.jobId || '';
    d.work_order_id = d.workOrderNumber || d.work_order_id || d.workOrderId || '';
    d.issued_to = d.issuedTo || d.issued_to || d.requestedBy || 'Production Head';
    d.issue_date = d.issueDate || d.issue_date || nowStr;
  } else if (ep.includes('/core/bug-tickets')) {
    d.id = d.id || d.bugNo || d.bug_no || `BUG-${Date.now().toString().slice(-4)}`;
    d.bug_no = d.bug_no || d.bugNo || d.id;
    d.title = d.title || d.summary || 'Bug Report';
    d.module = d.module || 'System';
    d.severity = d.severity || 'Medium';
    d.status = d.status || 'Open';
  } else if (ep.includes('/core/backups')) {
    d.id = d.id || d.backupNo || d.backup_no || `BK-${Date.now().toString().slice(-4)}`;
    d.backup_no = d.backup_no || d.backupNo || d.id;
    d.backup_type = d.backup_type || d.type || 'Full System';
    d.file_name = d.file_name || d.fileName || 'backup.bak';
    d.status = d.status || 'Verified_Valid';
  } else if (ep.includes('/projects/costs')) {
    d.id = d.id || `CST-${Date.now().toString().slice(-4)}`;
    d.projectId = d.projectId || d.project_id || 'PRJ-2026-0001';
    d.project_id = d.projectId;
    d.job_number = d.job_number || d.jobNumber || '';
  } else if (ep.includes('/project-delays')) {
    d.id = d.id || `DLY-${Date.now().toString().slice(-4)}`;
    d.projectId = d.projectId || d.project_id || 'PRJ-2026-0001';
    d.project_id = d.projectId;
    d.job_number = d.job_number || d.jobNumber || '';
  } else if (ep.includes('/project-issues')) {
    d.id = d.id || `ISS-${Date.now().toString().slice(-4)}`;
    d.projectId = d.projectId || d.project_id || 'PRJ-2026-0001';
    d.project_id = d.projectId;
    d.job_number = d.job_number || d.jobNumber || '';
  } else if (ep.includes('fixed-assets')) {
    d.id = d.id || d.assetCode || d.asset_code || `AST-${Date.now().toString().slice(-4)}`;
    d.assetCode = d.assetCode || d.asset_code || d.id;
    d.assetName = d.assetName || d.asset_name || 'Fixed Asset';
    d.purchaseDate = d.purchaseDate || d.purchase_date || nowStr;
    if (d.purchaseCost !== undefined || d.purchaseValue !== undefined) {
      d.purchaseCost = Number(d.purchaseCost ?? d.purchaseValue ?? 0);
    }
    if (d.usefulLifeYears !== undefined) {
      d.usefulLifeYears = parseInt(String(d.usefulLifeYears), 10) || 5;
    }
    if (d.depreciationRate !== undefined) {
      d.depreciationRate = Number(d.depreciationRate);
    }
    if (d.residualValue !== undefined) {
      d.residualValue = Number(d.residualValue);
    }
    if (d.accumulatedDepreciation !== undefined) {
      d.accumulatedDepreciation = Number(d.accumulatedDepreciation);
    }
    if (d.currentBookValue !== undefined) {
      d.currentBookValue = Number(d.currentBookValue);
    }
  }
  // Sanitize: remove null and undefined values so DRF serializers never throw "This field may not be null"
  for (const k of Object.keys(d)) {
    if (d[k] === null || d[k] === undefined) {
      delete d[k];
    }
  }
  return d;
}

// High-performance API cache & request deduplication store
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const memoryCache = new Map<string, CacheEntry<any>>();
const inflightRequests = new Map<string, Promise<any>>();

// Cache TTL: 30 seconds fresh, 5 minutes stale-while-revalidate
const FRESH_TTL_MS = 30 * 1000;
const STALE_TTL_MS = 5 * 60 * 1000;

export function invalidateApiCache(endpointPrefix?: string) {
  if (!endpointPrefix) {
    memoryCache.clear();
    return;
  }
  const prefix = endpointPrefix.toLowerCase();
  for (const key of memoryCache.keys()) {
    if (key.toLowerCase().includes(prefix)) {
      memoryCache.delete(key);
    }
  }
  if (typeof window !== 'undefined') {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('UMA_CACHE_') && key.toLowerCase().includes(prefix)) {
          localStorage.removeItem(key);
        }
      }
    } catch (_) {}
  }
}

export async function request<T>(rawEndpoint: string, options: RequestInit = {}): Promise<T> {
  // Normalize legacy/mismatched endpoints (e.g. /fixed-assets/ -> /accounting/fixed-assets/)
  let endpoint = rawEndpoint;
  if (/^\/?fixed-assets(\/|\?|$)/.test(endpoint)) {
    endpoint = endpoint.replace(/^\/?fixed-assets(\/|\?|$)/, '/accounting/fixed-assets$1');
  }

  const method = (options.method || 'GET').toUpperCase();
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const cacheKey = `GET:${endpoint}`;

  // 1. Invalidate cache on mutations (POST, PUT, PATCH, DELETE)
  if (method !== 'GET') {
    const basePrefix = endpoint.split('/')[1] || endpoint;
    invalidateApiCache(basePrefix);
  }

  // 2. High-speed cache lookup for GET requests
  if (method === 'GET' && !options.headers) {
    // Check in-memory cache first (instant 0ms)
    const memCached = memoryCache.get(cacheKey);
    const now = Date.now();

    if (memCached) {
      const age = now - memCached.timestamp;
      if (age < FRESH_TTL_MS) {
        return memCached.data as T;
      }
      // If stale but within 5 mins, return cached instantly and revalidate in background
      if (age < STALE_TTL_MS) {
        // Trigger background revalidation
        fetchNetworkRequest<T>(url, endpoint, options, cacheKey).catch(() => {});
        return memCached.data as T;
      }
    }

    // Check localStorage fallback for offline/cold-start instant recovery (instant 0ms)
    if (typeof window !== 'undefined') {
      try {
        const localRaw = localStorage.getItem(`UMA_CACHE_${cacheKey}`);
        if (localRaw) {
          const parsed = JSON.parse(localRaw) as CacheEntry<T>;
          if (parsed && parsed.data !== undefined) {
            memoryCache.set(cacheKey, parsed);
            // If stale, trigger background revalidation silently
            if (now - parsed.timestamp >= FRESH_TTL_MS) {
              fetchNetworkRequest<T>(url, endpoint, options, cacheKey).catch(() => {});
            }
            return parsed.data;
          }
        }
      } catch (_) {}
    }

    // Inflight Request Deduplication: avoid duplicate network requests for same endpoint
    if (inflightRequests.has(cacheKey)) {
      return inflightRequests.get(cacheKey)! as Promise<T>;
    }
  }

  // 3. Execute network request
  const fetchPromise = fetchNetworkRequest<T>(url, endpoint, options, method === 'GET' ? cacheKey : undefined);

  if (method === 'GET') {
    inflightRequests.set(cacheKey, fetchPromise);
    fetchPromise
      .finally(() => inflightRequests.delete(cacheKey))
      .catch(() => {});
  }

  return fetchPromise;
}

async function fetchNetworkRequest<T>(
  url: string,
  endpoint: string,
  options: RequestInit,
  cacheKey?: string
): Promise<T> {
  let token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!token && typeof window !== 'undefined') {
    // For non-GET requests (mutations), await authentication token
    if (options.method && options.method !== 'GET') {
      token = await getOrRefreshToken();
    } else {
      // For GET requests, trigger background login without blocking data fetch
      getOrRefreshToken().catch(() => {});
    }
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let body = options.body;
  if (body && typeof body === 'string' && (options.method === 'POST' || options.method === 'PATCH' || options.method === 'PUT')) {
    try {
      const parsed = JSON.parse(body);
      const normalized = normalizePayload(endpoint, parsed, (options.method || 'GET').toUpperCase());
      body = JSON.stringify(normalized);
    } catch (_) {}
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      body,
      headers,
    });
  } catch (netErr: any) {
    // Network failure (Django backend offline, connection refused, CORS, network down)
    console.warn(`[apiClient] Network request failed for ${url}:`, netErr?.message || netErr);

    // If cached data exists in localStorage, return it as offline recovery
    if (cacheKey && typeof window !== 'undefined') {
      try {
        const localRaw = localStorage.getItem(`UMA_CACHE_${cacheKey}`);
        if (localRaw) {
          const parsed = JSON.parse(localRaw) as CacheEntry<T>;
          if (parsed && parsed.data !== undefined) {
            return parsed.data;
          }
        }
      } catch (_) {}
    }

    // For GET list endpoints, return empty array fallback to prevent UI crash when backend is offline
    const method = (options.method || 'GET').toUpperCase();
    if (method === 'GET' && (endpoint.endsWith('/') || endpoint.includes('list'))) {
      return [] as unknown as T;
    }

    throw new ApiError(
      0,
      `Backend unreachable at ${url}. Please ensure Django server is running (python manage.py runserver 8000).`,
      netErr
    );
  }

  // If 401, attempt token refresh/re-login once and retry
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    const newToken = await getOrRefreshToken();
    if (newToken) {
      try {
        response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      } catch (_) {}
    }
  }

  if (!response.ok) {
    let errData: any;
    try {
      const text = await response.text();
      try {
        errData = JSON.parse(text);
      } catch {
        errData = text;
      }
    } catch {
      errData = 'Unknown error';
    }

    // Gracefully handle 400 when record already exists in database:
    // If the record with this ID already exists, the data is already stored in the database!
    const errString = typeof errData === 'object' ? JSON.stringify(errData) : String(errData);
    if (response.status === 400 && errString.includes('already exists')) {
      // If POST to /grns failed because of duplicate ID, retry immediately by omitting id / grnNumber
      if (options.method === 'POST' && endpoint.includes('/grns')) {
        try {
          const retryBody: any = body && typeof body === 'string' ? JSON.parse(body) : (typeof body === 'object' && body !== null ? { ...(body as any) } : {});
          delete retryBody.id;
          delete retryBody.grnNumber;
          delete retryBody.grn_number;
          const retryRes = await fetch(url, {
            ...options,
            method: 'POST',
            headers,
            body: JSON.stringify(retryBody),
          });
          if (retryRes.ok) {
            const retryJson = await retryRes.json();
            return (retryJson && typeof retryJson === 'object' && Array.isArray(retryJson.results)) ? retryJson.results : retryJson;
          }
        } catch (_) {}
      }

      // If POST to /items failed because of duplicate itemCode, resolve exact backend ID and PATCH
      if (options.method === 'POST' && endpoint.includes('/items')) {
        try {
          const p = typeof body === 'string' ? JSON.parse(body) : (body || {});
          const targetCode = String(p.itemCode || p.item_code || p.code || p.id || '').trim().toLowerCase();
          const targetId = String(p.id || '').trim().toLowerCase();
          
          let matchedId: string | null = null;
          try {
            const listRes = await fetch(url, { headers });
            if (listRes.ok) {
              const listJson = await listRes.json();
              const itemsList = Array.isArray(listJson) ? listJson : (listJson.results || []);
              const matched = itemsList.find((i: any) => {
                const c = String(i.itemCode || i.item_code || '').trim().toLowerCase();
                const mid = String(i.id || '').trim().toLowerCase();
                return (targetCode && (c === targetCode || mid === targetCode || mid === `itm-${targetCode}`)) ||
                       (targetId && (mid === targetId || c === targetId));
              });
              if (matched && matched.id) {
                matchedId = String(matched.id);
              }
            }
          } catch (_) {}

          if (!matchedId) {
            matchedId = `itm-${targetCode.replace(/[^a-z0-9]/g, '-')}`;
          }

          if (matchedId) {
            const patchRes = await fetch(`${url}${url.endsWith('/') ? '' : '/'}${encodeURIComponent(matchedId)}/`, {
              ...options,
              method: 'PATCH',
              headers,
              body,
            });
            if (patchRes.ok) {
              const patchJson = await patchRes.json();
              return (patchJson && typeof patchJson === 'object' && Array.isArray(patchJson.results)) ? patchJson.results : patchJson;
            }
          }
          return p as T;
        } catch (_) {}
      }

      // If POST conflict on duplicate ID, attempt a PATCH update to the existing record
      if (options.method === 'POST' && !endpoint.includes('/items') && !endpoint.includes('/grns')) {
        const id = (body && typeof body === 'string') ? (() => {
          try {
            const p = JSON.parse(body);
            return p.id || p.followUpNo || p.follow_up_no || p.leadNo || p.lead_no || p.enquiryNo || p.enquiry_no || p.salesOrderNumber || p.poNumber;
          } catch {
            return null;
          }
        })() : null;
        if (id) {
          try {
            const patchRes = await fetch(`${url}${url.endsWith('/') ? '' : '/'}${id}/`, {
              ...options,
              method: 'PATCH',
              headers,
              body,
            });
            if (patchRes.ok) {
              const patchJson = await patchRes.json();
              return (patchJson && typeof patchJson === 'object' && Array.isArray(patchJson.results)) ? patchJson.results : patchJson;
            }
          } catch (_) {}
        }
      }
      // If it already exists in DB, return body as successful sync so frontend state & UI don't throw warnings
      try {
        return (body && typeof body === 'string' ? JSON.parse(body) : body) as T;
      } catch (_) {
        return {} as T;
      }
    }

    throw new ApiError(response.status, `API Error: ${response.status} ${response.statusText}`, errData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  let resultData: any;
  try {
    const json = await response.json();
    resultData = (json && typeof json === 'object' && Array.isArray(json.results)) ? json.results : json;
  } catch (err) {
    console.warn(`Failed to parse JSON response from ${endpoint}:`, err);
    resultData = {} as T;
  }

  // Store in cache for GET requests
  if (cacheKey && typeof window !== 'undefined') {
    const entry: CacheEntry<T> = { data: resultData as T, timestamp: Date.now() };
    memoryCache.set(cacheKey, entry);
    try {
      localStorage.setItem(`UMA_CACHE_${cacheKey}`, JSON.stringify(entry));
    } catch (_) {}
  }

  return resultData as T;
}

const knownPlanningStageIds = new Set<string>();
const knownProjectTaskIds = new Set<string>();
const knownMrpIds = new Set<string>();

let mrpListPromise: Promise<void> | null = null;
async function ensureMrpIdsLoaded(): Promise<void> {
  if (knownMrpIds.size > 0) return;
  if (!mrpListPromise) {
    mrpListPromise = (async () => {
      try {
        const res = await request<any[]>('/material-requirements/');
        const list = Array.isArray(res) ? res : ((res as any)?.results || []);
        for (const item of list) {
          if (item?.id) knownMrpIds.add(String(item.id).toLowerCase());
        }
      } catch (_) {}
      finally {
        mrpListPromise = null;
      }
    })();
  }
  await mrpListPromise;
}

let planningStageListPromise: Promise<void> | null = null;
async function ensurePlanningStageIdsLoaded(): Promise<void> {
  if (knownPlanningStageIds.size > 0) return;
  if (!planningStageListPromise) {
    planningStageListPromise = (async () => {
      try {
        const res = await request<any[]>('/planning-stages/');
        const list = Array.isArray(res) ? res : ((res as any)?.results || []);
        for (const item of list) {
          if (item?.id) knownPlanningStageIds.add(String(item.id).toLowerCase());
        }
      } catch (_) {}
      finally {
        planningStageListPromise = null;
      }
    })();
  }
  await planningStageListPromise;
}

let projectTaskListPromise: Promise<void> | null = null;
async function ensureProjectTaskIdsLoaded(): Promise<void> {
  if (knownProjectTaskIds.size > 0) return;
  if (!projectTaskListPromise) {
    projectTaskListPromise = (async () => {
      try {
        const res = await request<any[]>('/project-tasks/');
        const list = Array.isArray(res) ? res : ((res as any)?.results || []);
        for (const item of list) {
          if (item?.id) knownProjectTaskIds.add(String(item.id).toLowerCase());
        }
      } catch (_) {}
      finally {
        projectTaskListPromise = null;
      }
    })();
  }
  await projectTaskListPromise;
}

export const api = {
  // Generic HTTP verbs
  get: <T = any>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T = any>(endpoint: string, data?: any) =>
    request<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: <T = any>(endpoint: string, data?: any) =>
    request<T>(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  patch: <T = any>(endpoint: string, data?: any) =>
    request<T>(endpoint, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  delete: <T = any>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
  invalidateCache: invalidateApiCache,

  // Authentication
  auth: {
    login: (credentials: { username?: string; email?: string; password: string }) =>
      request<{ access: string; refresh: string; user: any }>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    me: () => request<any>('/auth/me/'),
    changePassword: (data: { oldPassword: string; newPassword: string }) =>
      request<{ message: string }>('/auth/change-password/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Company Settings & Auto Numbering
  company: {
    get: () => request<any>('/company/'),
    update: (data: any) =>
      request<any>('/company/', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  numbering: {
    list: () => request<any[]>('/numbering/'),
    nextNumber: (docType: string) =>
      request<{ nextNumber: string; prefix: string; currentNumber: number }>(
        `/numbering/next-number/?docType=${docType}`
      ),
  },

  // Core & System Administration
  core: {
    auditLogs: {
      list: () => request<any[]>('/core/audit-logs/'),
      create: (data: any) => request<any>('/core/audit-logs/', { method: 'POST', body: JSON.stringify(data) }),
    },
    notifications: {
      list: () => request<any[]>('/core/notifications/'),
      create: (data: any) => request<any>('/core/notifications/', { method: 'POST', body: JSON.stringify(data) }),
      markAllRead: () => request<any>('/core/notifications/mark-all-read/', { method: 'POST' }),
    },
    backups: {
      list: () => request<any[]>('/core/backups/'),
      create: (data: any) => request<any>('/core/backups/', { method: 'POST', body: JSON.stringify(data) }),
    },
    bugTickets: {
      list: () => request<any[]>('/core/bug-tickets/'),
      create: (data: any) => request<any>('/core/bug-tickets/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/core/bug-tickets/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/core/bug-tickets/${id}/`, { method: 'DELETE' }),
    },
    dataImports: {
      list: () => request<any[]>('/core/data-imports/'),
      create: (data: any) => request<any>('/core/data-imports/', { method: 'POST', body: JSON.stringify(data) }),
    },
    goLiveChecklist: {
      list: () => request<any[]>('/core/go-live-checklist/'),
      create: (data: any) => request<any>('/core/go-live-checklist/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/core/go-live-checklist/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    securityChecks: {
      list: () => request<any[]>('/core/security-checks/'),
      create: (data: any) => request<any>('/core/security-checks/', { method: 'POST', body: JSON.stringify(data) }),
    },
  },

  // Organization
  departments: {
    list: () => request<any[]>('/departments/'),
    create: (data: any) => request<any>('/departments/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/departments/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/departments/${id}/`, { method: 'DELETE' }),
  },
  roles: {
    list: () => request<any[]>('/roles/'),
    create: (data: any) => request<any>('/roles/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/roles/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/roles/${id}/`, { method: 'DELETE' }),
  },
  employees: {
    list: () => request<any[]>('/employees/'),
    create: (data: any) => request<any>('/employees/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/employees/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/employees/${id}/`, { method: 'DELETE' }),
    resetPassword: (id: string, password: string) =>
      request<any>(`/employees/${id}/reset-password/`, { method: 'POST', body: JSON.stringify({ password }) }),
  },

  // CRM
  crm: {
    leads: {
      list: () => request<any[]>('/leads/'),
      get: (id: string) => request<any>(`/leads/${id}/`),
      create: (data: any) => request<any>('/leads/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/leads/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/leads/${id}/`, { method: 'DELETE' }),
      convert: (id: string) => request<any>(`/leads/${id}/convert/`, { method: 'POST' }),
    },
    customers: {
      list: () => request<any[]>('/customers/'),
      get: (id: string) => request<any>(`/customers/${id}/`),
      create: (data: any) => request<any>('/customers/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/customers/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/customers/${id}/`, { method: 'DELETE' }),
    },
    contacts: {
      list: () => request<any[]>('/contacts/'),
      create: (data: any) => request<any>('/contacts/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/contacts/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/contacts/${id}/`, { method: 'DELETE' }),
    },
    enquiries: {
      list: () => request<any[]>('/enquiries/'),
      create: (data: any) => request<any>('/enquiries/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/enquiries/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    opportunities: {
      list: () => request<any[]>('/opportunities/'),
      create: (data: any) => request<any>('/opportunities/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/opportunities/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    quotations: {
      list: () => request<any[]>('/crm/quotations/'),
      get: (id: string) => request<any>(`/crm/quotations/${id}/`),
      create: (data: any) => request<any>('/crm/quotations/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/crm/quotations/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/crm/quotations/${id}/`, { method: 'DELETE' }),
      addRevision: (id: string, data: any) => request<any>(`/crm/quotations/${id}/add-revision/`, { method: 'POST', body: JSON.stringify(data) }),
      updateStatus: (id: string, data: { revisionNumber?: string; status: string }) =>
        request<any>(`/crm/quotations/${id}/update-status/`, { method: 'POST', body: JSON.stringify(data) }),
      convert: (id: string, revisionNumber?: string) =>
        request<any>(`/crm/quotations/${id}/update-status/`, { method: 'POST', body: JSON.stringify({ revisionNumber: revisionNumber || 'Rev-00', status: 'accepted' }) }),
    },
    customerPos: {
      list: () => request<any[]>('/crm/customer-pos/'),
      get: (id: string) => request<any>(`/crm/customer-pos/${id}/`),
      create: (data: any) => request<any>('/crm/customer-pos/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/crm/customer-pos/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      convertToSo: (id: string) => request<any>(`/crm/customer-pos/${id}/convert-to-so/`, { method: 'POST' }),
    },
    salesOrders: {
      list: () => request<any[]>('/crm/sales-orders/'),
      get: (id: string) => request<any>(`/crm/sales-orders/${id}/`),
      create: (data: any) => request<any>('/crm/sales-orders/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/crm/sales-orders/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    followUps: {
      list: () => request<any[]>('/crm/followups/'),
      get: (id: string) => request<any>(`/crm/followups/${id}/`),
      create: (data: any) => request<any>('/crm/followups/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/crm/followups/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/crm/followups/${id}/`, { method: 'DELETE' }),
      complete: (id: string, data: { notes?: string; nextDate?: string }) =>
        request<any>(`/crm/followups/${id}/complete/`, { method: 'POST', body: JSON.stringify(data) }),
    },
    siteVisits: {
      list: async () => {
        try {
          return await request<any[]>('/visits/');
        } catch {
          return await request<any[]>('/crm/visits/');
        }
      },
      create: async (data: any) => {
        const payload = {
          ...data,
          id: data.id || data.visitNo,
          visit_no: data.visitNo || data.id,
          customer_id: data.customerId || '',
          customer_name: data.customerName || '',
          contact_person: data.contactPerson || '',
          contact_mobile: data.contactMobile || '',
          visit_date: data.visitDate || '',
          location: data.location || '',
          employee_id: data.employeeId || '',
          employee_name: data.employeeName || '',
          purpose: data.purpose || '',
          discussion_notes: data.discussionNotes || data.discussionSummary || '',
          requirement_details: data.requirementDetails || '',
          outcome: data.outcome || 'positive',
          next_action: data.nextAction || '',
          next_follow_up_date: data.nextFollowUpDate || '',
        };
        try {
          return await request<any>('/visits/', { method: 'POST', body: JSON.stringify(payload) });
        } catch {
          return await request<any>('/crm/visits/', { method: 'POST', body: JSON.stringify(payload) });
        }
      },
      update: async (id: string, data: any) => {
        const payload = {
          ...data,
          visit_no: data.visitNo || data.id || id,
          customer_id: data.customerId,
          customer_name: data.customerName,
          contact_person: data.contactPerson,
          contact_mobile: data.contactMobile,
          visit_date: data.visitDate,
          location: data.location,
          employee_id: data.employeeId,
          employee_name: data.employeeName,
          purpose: data.purpose,
          discussion_notes: data.discussionNotes || data.discussionSummary,
          requirement_details: data.requirementDetails,
          outcome: data.outcome,
          next_action: data.nextAction,
          next_follow_up_date: data.nextFollowUpDate,
        };
        try {
          return await request<any>(`/visits/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
        } catch {
          return await request<any>(`/crm/visits/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
        }
      },
      delete: async (id: string) => {
        try {
          return await request<any>(`/visits/${id}/`, { method: 'DELETE' });
        } catch {
          return await request<any>(`/crm/visits/${id}/`, { method: 'DELETE' });
        }
      },
    },
    exhibitions: {
      list: async () => {
        try {
          return await request<any[]>('/exhibitions/');
        } catch {
          return await request<any[]>('/crm/exhibitions/');
        }
      },
      create: async (data: any) => {
        const payload = {
          ...data,
          id: data.id || `EXPO-2026-${Date.now().toString().slice(-4)}`,
          expo_name: data.expoName || data.expo_name || 'Exhibition',
          organizer: data.organizer || '',
          location: data.location || '',
          start_date: data.startDate || data.start_date || '',
          end_date: data.endDate || data.end_date || '',
          stall_number: data.stallNumber || data.stall_number || '',
          contact_person: data.contactPerson || data.contact_person || '',
          budget: Number(data.budget) || 0,
          assigned_team: Array.isArray(data.assignedTeam) ? data.assignedTeam : (Array.isArray(data.assigned_team) ? data.assigned_team : []),
          products_displayed: data.productsDisplayed || data.products_displayed || '',
          notes: data.notes || '',
          total_contacts: Number(data.totalContacts) || Number(data.total_contacts) || 0,
          qualified_leads: Number(data.qualifiedLeads) || Number(data.qualified_leads) || 0,
          quotations_sent: Number(data.quotationsSent) || Number(data.quotations_sent) || 0,
          converted_customers: Number(data.convertedCustomers) || Number(data.converted_customers) || 0,
        };
        try {
          return await request<any>('/exhibitions/', { method: 'POST', body: JSON.stringify(payload) });
        } catch {
          return await request<any>('/crm/exhibitions/', { method: 'POST', body: JSON.stringify(payload) });
        }
      },
      update: async (id: string, data: any) => {
        const payload = {
          ...data,
          expo_name: data.expoName,
          start_date: data.startDate,
          end_date: data.endDate,
          stall_number: data.stallNumber,
          contact_person: data.contactPerson,
          budget: Number(data.budget),
          assigned_team: data.assignedTeam,
          products_displayed: data.productsDisplayed,
          total_contacts: Number(data.totalContacts),
          qualified_leads: Number(data.qualifiedLeads),
          quotations_sent: Number(data.quotationsSent),
          converted_customers: Number(data.convertedCustomers),
        };
        try {
          return await request<any>(`/exhibitions/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
        } catch {
          return await request<any>(`/crm/exhibitions/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
        }
      },
      delete: async (id: string) => {
        try {
          return await request<any>(`/exhibitions/${id}/`, { method: 'DELETE' });
        } catch {
          return await request<any>(`/crm/exhibitions/${id}/`, { method: 'DELETE' });
        }
      },
    },
    activities: {
      list: () => request<any[]>('/crm/activities/'),
      create: (data: any) => request<any>('/crm/activities/', { method: 'POST', body: JSON.stringify(data) }),
    },
    hubSummary: () => request<any>('/crm/leads/hub-summary/'),
  },

  // Project Management
  projects: {
    list: () => request<any[]>('/projects/'),
    get: (id: string) => request<any>(`/projects/${id}/`),
    create: async (data: any) => {
      try {
        return await request<any>('/projects/', { method: 'POST', body: JSON.stringify(data) });
      } catch (err: any) {
        const id = data.id || data.projectNumber || data.project_number;
        const isConflict =
          err?.status === 400 ||
          err?.status === 409 ||
          err?.message?.includes('already exists') ||
          JSON.stringify(err?.data || '').includes('already exists');
        if (id && isConflict) {
          return await request<any>(`/projects/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
        }
        throw err;
      }
    },
    update: (id: string, data: any) => request<any>(`/projects/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/projects/${id}/`, { method: 'DELETE' }),
    planningStages: async (projectId?: string) => {
      const res = await request<any[]>(projectId ? `/planning-stages/?projectId=${projectId}` : '/planning-stages/');
      const list = Array.isArray(res) ? res : ((res as any)?.results || []);
      for (const s of list) {
        if (s?.id) knownPlanningStageIds.add(String(s.id).toLowerCase());
      }
      return res;
    },
    createPlanningStage: async (data: any) => {
      const id = data.id;
      try {
        const res = await request<any>('/planning-stages/', { method: 'POST', body: JSON.stringify(data) });
        if (id) knownPlanningStageIds.add(String(id).toLowerCase());
        if (res?.id) knownPlanningStageIds.add(String(res.id).toLowerCase());
        return res;
      } catch (err: any) {
        const isConflict =
          err?.status === 400 ||
          err?.status === 409 ||
          err?.message?.includes('already exists') ||
          JSON.stringify(err?.data || '').includes('already exists');
        if (id && isConflict) {
          knownPlanningStageIds.add(String(id).toLowerCase());
          return await request<any>(`/planning-stages/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
        }
        throw err;
      }
    },
    updatePlanningStage: async (id: string, data: any) => {
      const lowerId = String(id).toLowerCase();
      // If confirmed on backend, PATCH directly
      if (knownPlanningStageIds.has(lowerId)) {
        try {
          return await request<any>(`/planning-stages/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
        } catch (patchErr: any) {
          if (patchErr?.status === 404) {
            knownPlanningStageIds.delete(lowerId);
            const res = await request<any>('/planning-stages/', { method: 'POST', body: JSON.stringify({ ...data, id }) });
            knownPlanningStageIds.add(lowerId);
            return res;
          }
          throw patchErr;
        }
      }

      // If not yet confirmed on backend, try POST first to avoid 404 in browser console
      try {
        const res = await request<any>('/planning-stages/', { method: 'POST', body: JSON.stringify({ ...data, id }) });
        knownPlanningStageIds.add(lowerId);
        return res;
      } catch (postErr: any) {
        const isConflict =
          postErr?.status === 400 ||
          postErr?.status === 409 ||
          postErr?.message?.includes('already exists') ||
          JSON.stringify(postErr?.data || '').includes('already exists');
        if (isConflict) {
          knownPlanningStageIds.add(lowerId);
          return await request<any>(`/planning-stages/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
        }
        throw postErr;
      }
    },
    deletePlanningStage: async (id: string) => {
      if (!id) return {} as any;
      await ensurePlanningStageIdsLoaded();
      const lowerId = String(id).toLowerCase();
      if (!knownPlanningStageIds.has(lowerId)) {
        return {} as any;
      }
      knownPlanningStageIds.delete(lowerId);
      try {
        return await request<any>(`/planning-stages/${encodeURIComponent(id)}/`, { method: 'DELETE' });
      } catch (err: any) {
        if (err?.status === 404) return {} as any;
        throw err;
      }
    },
    generatePlanningStages: (projectId: string) =>
      request<any>(`/projects/${projectId}/generate-stages/`, { method: 'POST' }),
    milestones: (projectId?: string) =>
      request<any[]>(projectId ? `/project-milestones/?projectId=${projectId}` : '/project-milestones/'),
    tasks: async (projectId?: string) => {
      const res = await request<any[]>(projectId ? `/project-tasks/?projectId=${projectId}` : '/project-tasks/');
      const list = Array.isArray(res) ? res : ((res as any)?.results || []);
      for (const t of list) {
        if (t?.id) knownProjectTaskIds.add(String(t.id).toLowerCase());
      }
      return res;
    },
    createTask: async (data: any) => {
      const id = data.id || data.taskNumber || data.task_number;
      try {
        const res = await request<any>('/project-tasks/', { method: 'POST', body: JSON.stringify(data) });
        if (id) knownProjectTaskIds.add(String(id).toLowerCase());
        if (res?.id) knownProjectTaskIds.add(String(res.id).toLowerCase());
        return res;
      } catch (err: any) {
        const isConflict =
          err?.status === 400 ||
          err?.status === 409 ||
          err?.message?.includes('already exists') ||
          JSON.stringify(err?.data || '').includes('already exists');
        if (id && isConflict) {
          knownProjectTaskIds.add(String(id).toLowerCase());
          return await request<any>(`/project-tasks/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
        }
        throw err;
      }
    },
    updateTask: async (id: string, data: any) => {
      const lowerId = String(id).toLowerCase();
      // If confirmed on backend, PATCH directly
      if (knownProjectTaskIds.has(lowerId)) {
        try {
          return await request<any>(`/project-tasks/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
        } catch (patchErr: any) {
          if (patchErr?.status === 404) {
            knownProjectTaskIds.delete(lowerId);
            const res = await request<any>('/project-tasks/', { method: 'POST', body: JSON.stringify({ ...data, id }) });
            knownProjectTaskIds.add(lowerId);
            return res;
          }
          throw patchErr;
        }
      }

      // If not yet confirmed on backend, try POST first to avoid 404 in browser console
      try {
        const res = await request<any>('/project-tasks/', { method: 'POST', body: JSON.stringify({ ...data, id }) });
        knownProjectTaskIds.add(lowerId);
        return res;
      } catch (postErr: any) {
        const isConflict =
          postErr?.status === 400 ||
          postErr?.status === 409 ||
          postErr?.message?.includes('already exists') ||
          JSON.stringify(postErr?.data || '').includes('already exists');
        if (isConflict) {
          knownProjectTaskIds.add(lowerId);
          return await request<any>(`/project-tasks/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
        }
        throw postErr;
      }
    },
    deleteTask: async (id: string) => {
      if (!id) return {} as any;
      await ensureProjectTaskIdsLoaded();
      const lowerId = String(id).toLowerCase();
      if (!knownProjectTaskIds.has(lowerId)) {
        return {} as any;
      }
      knownProjectTaskIds.delete(lowerId);
      try {
        return await request<any>(`/project-tasks/${encodeURIComponent(id)}/`, { method: 'DELETE' });
      } catch (err: any) {
        if (err?.status === 404) return {} as any;
        throw err;
      }
    },
    departmentAssignments: (projectId?: string) =>
      request<any[]>(projectId ? `/department-assignments/?projectId=${projectId}` : '/department-assignments/'),
    createDepartmentAssignment: (data: any) =>
      request<any>('/department-assignments/', { method: 'POST', body: JSON.stringify(data) }),
    updateDepartmentAssignment: (id: string, data: any) =>
      request<any>(`/department-assignments/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteDepartmentAssignment: (id: string) =>
      request<any>(`/department-assignments/${id}/`, { method: 'DELETE' }),
    documents: (projectId?: string) =>
      request<any[]>(projectId ? `/project-documents/?projectId=${projectId}` : '/project-documents/'),
    createDocument: (data: any) =>
      request<any>('/project-documents/', { method: 'POST', body: JSON.stringify(data) }),
    deleteDocument: (id: string) =>
      request<any>(`/project-documents/${id}/`, { method: 'DELETE' }),
    changeRequests: (projectId?: string) =>
      request<any[]>(projectId ? `/change-requests/?projectId=${projectId}` : '/change-requests/'),
    createChangeRequest: (data: any) =>
      request<any>('/change-requests/', { method: 'POST', body: JSON.stringify(data) }),
    updateChangeRequest: (id: string, data: any) =>
      request<any>(`/change-requests/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteChangeRequest: (id: string) =>
      request<any>(`/change-requests/${id}/`, { method: 'DELETE' }),
    costs: {
      list: (projectId?: string) => request<any[]>(projectId ? `/projects/costs/?projectId=${projectId}` : '/projects/costs/'),
      create: (data: any) => request<any>('/projects/costs/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/projects/costs/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/projects/costs/${id}/`, { method: 'DELETE' }),
    },
    delays: {
      list: (projectId?: string) => request<any[]>(projectId ? `/project-delays/?projectId=${projectId}` : '/project-delays/'),
      create: (data: any) => request<any>('/project-delays/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/project-delays/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/project-delays/${id}/`, { method: 'DELETE' }),
    },
    issues: {
      list: (projectId?: string) => request<any[]>(projectId ? `/project-issues/?projectId=${projectId}` : '/project-issues/'),
      create: (data: any) => request<any>('/project-issues/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/project-issues/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/project-issues/${id}/`, { method: 'DELETE' }),
    },
    saveProjectStages: async (data: any) => {
      const res = await request<any>('/projects/planning-stages/save-project-stages/', { method: 'POST', body: JSON.stringify(data) });
      if (Array.isArray(data?.stages)) {
        for (const s of data.stages) {
          if (s?.id) knownPlanningStageIds.add(String(s.id).toLowerCase());
        }
      }
      return res;
    },
    clearPlanningStages: (projectId: string) => request<any>('/projects/planning-stages/clear-and-reset/', { method: 'POST', body: JSON.stringify({ projectId }) }),
  },

  // Design & Engineering
  designer: {
    jobs: {
      list: () => request<any[]>('/designer/jobs/'),
      create: (data: any) => request<any>('/designer/jobs/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/designer/jobs/${encodeURIComponent(id)}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      releaseToProduction: (id: string, data?: any) =>
        request<any>(`/designer/jobs/${encodeURIComponent(id)}/release-to-production/`, { method: 'POST', body: JSON.stringify(data || {}) }),
      revokeRelease: (id: string, data?: any) =>
        request<any>(`/designer/jobs/${encodeURIComponent(id)}/revoke-release/`, { method: 'POST', body: JSON.stringify(data || {}) }),
      approve: (id: string, data?: any) =>
        request<any>(`/designer/jobs/${encodeURIComponent(id)}/approve/`, { method: 'POST', body: JSON.stringify(data || {}) }),
      disapprove: (id: string, data?: any) =>
        request<any>(`/designer/jobs/${encodeURIComponent(id)}/disapprove/`, { method: 'POST', body: JSON.stringify(data || {}) }),
    },
    requirements: {
      list: () => request<any[]>('/designer/requirements/'),
      get: (id: string) => request<any>(`/designer/requirements/${id}/`),
      create: (data: any) => request<any>('/designer/requirements/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/designer/requirements/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/designer/requirements/${id}/`, { method: 'DELETE' }),
    },
    tasks: {
      list: async () => {
        try {
          return await request<any[]>('/designer/tasks/');
        } catch {
          try {
            return await request<any[]>('/designer/design-tasks/');
          } catch {
            return [];
          }
        }
      },
      get: async (id: string) => {
        try {
          return await request<any>(`/designer/tasks/${id}/`);
        } catch {
          try {
            return await request<any>(`/designer/design-tasks/${id}/`);
          } catch {
            return null;
          }
        }
      },
      create: async (data: any) => {
        try {
          return await request<any>('/designer/tasks/', { method: 'POST', body: JSON.stringify(data) });
        } catch {
          return await request<any>('/designer/design-tasks/', { method: 'POST', body: JSON.stringify(data) });
        }
      },
      update: async (id: string, data: any) => {
        try {
          return await request<any>(`/designer/tasks/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
        } catch {
          return await request<any>(`/designer/design-tasks/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
        }
      },
      delete: async (id: string) => {
        try {
          return await request<any>(`/designer/tasks/${id}/`, { method: 'DELETE' });
        } catch {
          return await request<any>(`/designer/design-tasks/${id}/`, { method: 'DELETE' });
        }
      },
    },
    drawings2d: () => request<any[]>('/designer/drawings-2d/'),
    models3d: () => request<any[]>('/designer/models-3d/'),
    boms: {
      list: () => request<any[]>('/designer/boms/'),
      create: (data: any) => request<any>('/designer/boms/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/designer/boms/${encodeURIComponent(id)}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    technicalDocuments: {
      list: async () => {
        try {
          return await request<any[]>('/designer/technical-documents/');
        } catch {
          try {
            return await request<any[]>('/technical-documents/');
          } catch {
            return [];
          }
        }
      },
      get: async (id: string) => {
        try {
          return await request<any>(`/designer/technical-documents/${id}/`);
        } catch {
          try {
            return await request<any>(`/technical-documents/${id}/`);
          } catch {
            return null;
          }
        }
      },
      create: async (data: any) => {
        try {
          return await request<any>('/designer/technical-documents/', { method: 'POST', body: JSON.stringify(data) });
        } catch {
          return await request<any>('/technical-documents/', { method: 'POST', body: JSON.stringify(data) });
        }
      },
      update: async (id: string, data: any) => {
        try {
          return await request<any>(`/designer/technical-documents/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
        } catch {
          return await request<any>(`/technical-documents/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
        }
      },
      delete: async (id: string) => {
        try {
          return await request<any>(`/designer/technical-documents/${id}/`, { method: 'DELETE' });
        } catch {
          return await request<any>(`/technical-documents/${id}/`, { method: 'DELETE' });
        }
      },
    },
    assemblyDrawings: {
      list: () => request<any[]>('/designer/assembly-drawings/'),
      create: (data: any) => request<any>('/designer/assembly-drawings/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/designer/assembly-drawings/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/designer/assembly-drawings/${id}/`, { method: 'DELETE' }),
    },
    revisions: {
      list: () => request<any[]>('/designer/revisions/'),
      create: (data: any) => request<any>('/designer/revisions/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/designer/revisions/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    bomAddItem: (bomId: string, item: any) => request<any>('/designer/boms/add-item/', { method: 'POST', body: JSON.stringify({ bomId, item }) }),
  },

  // Purchase Management
  purchase: {
    mrp: {
      list: async () => {
        const res = await request<any[]>('/material-requirements/');
        const list = Array.isArray(res) ? res : ((res as any)?.results || []);
        for (const item of list) {
          if (item?.id) knownMrpIds.add(String(item.id).toLowerCase());
        }
        return res;
      },
      get: (id: string) => request<any>(`/material-requirements/${encodeURIComponent(id)}/`),
      create: async (data: any) => {
        await ensureMrpIdsLoaded();
        const id = data?.id;
        const lowerId = id ? String(id).toLowerCase() : '';
        // If known to exist on backend, PATCH directly to prevent 400 Bad Request error in console
        if (lowerId && knownMrpIds.has(lowerId)) {
          return await request<any>(`/material-requirements/${encodeURIComponent(id)}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
          });
        }
        try {
          const res = await request<any>('/material-requirements/', { method: 'POST', body: JSON.stringify(data) });
          if (lowerId) knownMrpIds.add(lowerId);
          if (res?.id) knownMrpIds.add(String(res.id).toLowerCase());
          return res;
        } catch (err: any) {
          const isConflict =
            err?.status === 400 ||
            err?.status === 409 ||
            err?.message?.includes('already exists') ||
            JSON.stringify(err?.data || '').includes('already exists');
          if (id && isConflict) {
            if (lowerId) knownMrpIds.add(lowerId);
            return await request<any>(`/material-requirements/${encodeURIComponent(id)}/`, {
              method: 'PATCH',
              body: JSON.stringify(data),
            });
          }
          throw err;
        }
      },
      update: async (id: string, data: any) => {
        await ensureMrpIdsLoaded();
        const lowerId = String(id).toLowerCase();
        if (knownMrpIds.has(lowerId)) {
          try {
            return await request<any>(`/material-requirements/${encodeURIComponent(id)}/`, {
              method: 'PATCH',
              body: JSON.stringify(data),
            });
          } catch (patchErr: any) {
            if (patchErr?.status === 404) {
              knownMrpIds.delete(lowerId);
              const res = await request<any>('/material-requirements/', {
                method: 'POST',
                body: JSON.stringify({ ...data, id }),
              });
              knownMrpIds.add(lowerId);
              return res;
            }
            throw patchErr;
          }
        }
        try {
          const res = await request<any>(`/material-requirements/${encodeURIComponent(id)}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
          });
          knownMrpIds.add(lowerId);
          return res;
        } catch (patchErr: any) {
          if (patchErr?.status === 404) {
            try {
              const res = await request<any>('/material-requirements/', {
                method: 'POST',
                body: JSON.stringify({ ...data, id }),
              });
              knownMrpIds.add(lowerId);
              return res;
            } catch (postErr: any) {
              const isConflict =
                postErr?.status === 400 ||
                postErr?.status === 409 ||
                postErr?.message?.includes('already exists') ||
                JSON.stringify(postErr?.data || '').includes('already exists');
              if (isConflict) {
                knownMrpIds.add(lowerId);
                return await request<any>(`/material-requirements/${encodeURIComponent(id)}/`, {
                  method: 'PATCH',
                  body: JSON.stringify(data),
                });
              }
              throw postErr;
            }
          }
          throw patchErr;
        }
      },
      upsert: async (id: string, data: any) => {
        await ensureMrpIdsLoaded();
        const lowerId = String(id).toLowerCase();
        if (knownMrpIds.has(lowerId)) {
          return await api.purchase.mrp.update(id, data);
        }
        return await api.purchase.mrp.create({ ...data, id });
      },
      delete: (id: string) => {
        knownMrpIds.delete(String(id).toLowerCase());
        return request<any>(`/material-requirements/${encodeURIComponent(id)}/`, { method: 'DELETE' });
      },
    },
    suppliers: {
      list: () => request<any[]>('/suppliers/'),
      create: (data: any) => request<any>('/suppliers/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/suppliers/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/suppliers/${id}/`, { method: 'DELETE' }),
    },
    requisitions: {
      list: () => request<any[]>('/purchase-requisitions/'),
      get: (id: string) => request<any>(`/purchase-requisitions/${encodeURIComponent(id)}/`),
      create: (data: any) => request<any>('/purchase-requisitions/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/purchase-requisitions/${encodeURIComponent(id)}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/purchase-requisitions/${encodeURIComponent(id)}/`, { method: 'DELETE' }),
      convertToRfq: (id: string) => request<any>(`/purchase-requisitions/${encodeURIComponent(id)}/convert-to-rfq/`, { method: 'POST' }),
    },
    rfqs: {
      list: () => request<any[]>('/rfqs/'),
      get: (id: string) => request<any>(`/rfqs/${id}/`),
      create: (data: any) => request<any>('/rfqs/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/rfqs/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/rfqs/${id}/`, { method: 'DELETE' }),
    },
    supplierQuotations: {
      list: () => request<any[]>('/supplier-quotations/'),
      get: (id: string) => request<any>(`/supplier-quotations/${id}/`),
      create: (data: any) => request<any>('/supplier-quotations/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/supplier-quotations/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/supplier-quotations/${id}/`, { method: 'DELETE' }),
    },
    quotationComparisons: {
      list: () => request<any[]>('/quotation-comparisons/'),
      create: (data: any) => request<any>('/quotation-comparisons/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/quotation-comparisons/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    orders: {
      list: () => request<any[]>('/purchase-orders/'),
      get: (id: string) => request<any>(`/purchase-orders/${id}/`),
      create: async (data: any) => {
        const id = data?.id || data?.poNumber || data?.po_number;
        try {
          return await request<any>('/purchase-orders/', { method: 'POST', body: JSON.stringify(data) });
        } catch (err: any) {
          const isConflict =
            err?.status === 400 ||
            err?.status === 409 ||
            err?.message?.includes('already exists') ||
            JSON.stringify(err?.data || '').includes('already exists');
          if (id && isConflict) {
            return await request<any>(`/purchase-orders/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
          }
          throw err;
        }
      },
      update: (id: string, data: any) => request<any>(`/purchase-orders/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/purchase-orders/${id}/`, { method: 'DELETE' }),
    },
    returns: () => request<any[]>('/purchase-returns/'),
  },

  // Store & Inventory
  store: {
    items: {
      list: () => request<any[]>('/items/'),
      create: (data: any) => request<any>('/items/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/items/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/items/${id}/`, { method: 'DELETE' }),
    },
    categories: () => request<any[]>('/item-categories/'),
    uoms: () => request<any[]>('/uoms/'),
    warehouses: {
      list: () => request<any[]>('/warehouses/'),
      create: (data: any) => request<any>('/warehouses/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/warehouses/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    grns: {
      list: () => request<any[]>('/grns/'),
      create: (data: any) => request<any>('/grns/', { method: 'POST', body: JSON.stringify(data) }),
    },
    qcInspections: () => request<any[]>('/qc-inspections/'),
    stock: () => request<any[]>('/stock/'),
    materialIssues: {
      list: () => request<any[]>('/material-issues/'),
      create: (data: any) => request<any>('/material-issues/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/material-issues/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/material-issues/${id}/`, { method: 'DELETE' }),
    },
    materialReturns: {
      list: () => request<any[]>('/material-returns/'),
      create: (data: any) => request<any>('/material-returns/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/material-returns/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/material-returns/${id}/`, { method: 'DELETE' }),
    },
    transfers: () => request<any[]>('/stock-transfers/'),
    adjustments: () => request<any[]>('/stock-adjustments/'),
    stockLedger: () => request<any[]>('/stock-ledger/'),
    scrap: () => request<any[]>('/scrap/'),
    reservations: {
      list: () => request<any[]>('/store/reservations/'),
      create: (data: any) => request<any>('/store/reservations/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/store/reservations/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/store/reservations/${id}/`, { method: 'DELETE' }),
    },
    locations: {
      list: () => request<any[]>('/store/locations/'),
      create: (data: any) => request<any>('/store/locations/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/store/locations/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/store/locations/${id}/`, { method: 'DELETE' }),
    },
  },

  // Production Execution
  production: {
    jobs: () => request<any[]>('/manufacturing-jobs/'),
    workCenters: {
      list: () => request<any[]>('/work-centers/'),
      create: (data: any) => request<any>('/work-centers/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/work-centers/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/work-centers/${id}/`, { method: 'DELETE' }),
    },
    routingOperations: {
      list: () => request<any[]>('/routing-operations/'),
      create: (data: any) => request<any>('/routing-operations/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/routing-operations/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/routing-operations/${id}/`, { method: 'DELETE' }),
    },
    workOrders: {
      list: () => request<any[]>('/work-orders/'),
      create: (data: any) => request<any>('/work-orders/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/work-orders/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      release: (id: string, data?: any) => request<any>(`/work-orders/${id}/release/`, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
    },
    orders: {
      list: () => request<any[]>('/production-orders/'),
      get: (id: string) => request<any>(`/production-orders/${id}/`),
      create: (data: any) => request<any>('/production-orders/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/production-orders/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/production-orders/${id}/`, { method: 'DELETE' }),
    },
    schedules: {
      list: () => request<any[]>('/production-schedules/'),
      create: (data: any) => request<any>('/production-schedules/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/production-schedules/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/production-schedules/${id}/`, { method: 'DELETE' }),
    },
    entries: {
      list: () => request<any[]>('/production-entries/'),
      create: (data: any) => request<any>('/production-entries/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/production-entries/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/production-entries/${id}/`, { method: 'DELETE' }),
    },
    wip: {
      list: () => request<any[]>('/wip-records/'),
      create: (data: any) => request<any>('/wip-records/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/wip-records/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/wip-records/${id}/`, { method: 'DELETE' }),
    },
    holds: {
      list: () => request<any[]>('/production-holds/'),
      create: (data: any) => request<any>('/production-holds/', { method: 'POST', body: JSON.stringify(data) }),
      resume: (id: string, resumeDate?: string) =>
        request<any>(`/production-holds/${id}/resume/`, { method: 'POST', body: JSON.stringify({ resume_date: resumeDate || new Date().toISOString().split('T')[0] }) }),
      update: (id: string, data: any) => request<any>(`/production-holds/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/production-holds/${id}/`, { method: 'DELETE' }),
    },
    reworkOrders: {
      list: () => request<any[]>('/rework-orders/'),
      create: (data: any) => request<any>('/rework-orders/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/rework-orders/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/rework-orders/${id}/`, { method: 'DELETE' }),
    },
    scraps: {
      list: () => request<any[]>('/production-scraps/'),
      create: (data: any) => request<any>('/production-scraps/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/production-scraps/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/production-scraps/${id}/`, { method: 'DELETE' }),
    },
    finishedGoods: {
      list: () => request<any[]>('/finished-goods/'),
      create: (data: any) => request<any>('/finished-goods/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/finished-goods/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/finished-goods/${id}/`, { method: 'DELETE' }),
      qcPass: (id: string) => request<any>(`/finished-goods/${id}/qc-pass/`, { method: 'POST' }),
    },
    materialRequests: {
      list: () => request<any[]>('/production-material-requests/'),
      create: (data: any) => request<any>('/production-material-requests/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/production-material-requests/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/production-material-requests/${id}/`, { method: 'DELETE' }),
    },
    dispatch: {
      list: () => request<any[]>('/dispatch-orders/'),
      create: (data: any) => request<any>('/dispatch-orders/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/dispatch-orders/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/dispatch-orders/${id}/`, { method: 'DELETE' }),
      markDispatched: (id: string) => request<any>(`/dispatch-orders/${id}/mark-dispatched/`, { method: 'POST' }),
      markDelivered: (id: string) => request<any>(`/dispatch-orders/${id}/mark-delivered/`, { method: 'POST' }),
    },
    updateJobProgress: (id: string, data: any) => request<any>('/production/manufacturing-jobs/update-progress/', { method: 'POST', body: JSON.stringify({ id, ...data }) }),
  },

  // Plant Maintenance & Field Service
  maintenance: {
    internalAssets: () => request<any[]>('/internal-assets/'),
    customerMachines: () => request<any[]>('/customer-machines/'),
    serviceRequests: {
      list: () => request<any[]>('/service-requests/'),
      create: (data: any) => request<any>('/service-requests/', { method: 'POST', body: JSON.stringify(data) }),
      assign: (id: string, data: { technicianId: string; technicianName: string }) =>
        request<any>(`/service-requests/${id}/assign/`, { method: 'POST', body: JSON.stringify(data) }),
      resolve: (id: string) => request<any>(`/service-requests/${id}/resolve/`, { method: 'POST' }),
    },
    breakdowns: () => request<any[]>('/breakdowns/'),
    pmPlans: () => request<any[]>('/pm-plans/'),
    serviceVisits: Object.assign(
      () => request<any[]>('/service-visits/'),
      {
        list: () => request<any[]>('/service-visits/'),
        create: (data: any) => request<any>('/service-visits/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request<any>(`/service-visits/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
        delete: (id: string) => request<any>(`/service-visits/${id}/`, { method: 'DELETE' }),
      }
    ),
    amcContracts: () => request<any[]>('/amc-contracts/'),
    serviceWorkOrders: {
      list: () => request<any[]>('/service-work-orders/'),
      create: (data: any) => request<any>('/service-work-orders/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/service-work-orders/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    servicePartIssues: {
      list: () => request<any[]>('/service-part-issues/'),
      create: (data: any) => request<any>('/service-part-issues/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/service-part-issues/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    servicePartReturns: {
      list: () => request<any[]>('/service-part-returns/'),
      create: (data: any) => request<any>('/service-part-returns/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/service-part-returns/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    serviceReports: {
      list: () => request<any[]>('/service-reports/'),
      create: (data: any) => request<any>('/service-reports/', { method: 'POST', body: JSON.stringify(data) }),
      get: (id: string) => request<any>(`/service-reports/${id}/`),
    },
    warrantyRecords: () => request<any[]>('/warranty-records/'),
    serviceContracts: () => request<any[]>('/service-contracts/'),
    downtimeRecords: () => request<any[]>('/downtime-records/'),
  },

  // HR & Payroll
  hr: {
    designations: () => request<any[]>('/designations/'),
    shifts: () => request<any[]>('/shifts/'),
    attendance: () => request<any[]>('/attendance-records/'),
    leaves: {
      list: () => request<any[]>('/leave-requests/'),
      create: (data: any) => request<any>('/leave-requests/', { method: 'POST', body: JSON.stringify(data) }),
      approve: (id: string, approvedBy?: string) =>
        request<any>(`/leave-requests/${id}/approve/`, { method: 'POST', body: JSON.stringify({ approvedBy }) }),
    },
    salaryStructures: () => request<any[]>('/salary-structures/'),
    payroll: {
      list: () => request<any[]>('/payroll-records/'),
      generate: (monthYear: string, financialYear: string) =>
        request<any[]>('/payroll-records/generate-monthly-payroll/', {
          method: 'POST',
          body: JSON.stringify({ monthYear, financialYear }),
        }),
    },
    onboardings: {
      list: () => request<any[]>('/employee-onboardings/'),
      create: (data: any) => request<any>('/employee-onboardings/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/employee-onboardings/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/employee-onboardings/${id}/`, { method: 'DELETE' }),
      complete: (id: string) => request<any>(`/employee-onboardings/${id}/complete_onboarding/`, { method: 'POST' }),
    },
    transfers: {
      list: () => request<any[]>('/employee-transfers/'),
      create: (data: any) => request<any>('/employee-transfers/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/employee-transfers/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/employee-transfers/${id}/`, { method: 'DELETE' }),
    },
    promotions: {
      list: () => request<any[]>('/employee-promotions/'),
      create: (data: any) => request<any>('/employee-promotions/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/employee-promotions/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/employee-promotions/${id}/`, { method: 'DELETE' }),
    },
    exits: {
      list: () => request<any[]>('/employee-exits/'),
      create: (data: any) => request<any>('/employee-exits/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/employee-exits/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/employee-exits/${id}/`, { method: 'DELETE' }),
    },
    holidays: {
      list: () => request<any[]>('/holidays/'),
      create: (data: any) => request<any>('/holidays/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/holidays/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/holidays/${id}/`, { method: 'DELETE' }),
    },
    wfhRequests: {
      list: () => request<any[]>('/wfh-requests/'),
      create: (data: any) => request<any>('/wfh-requests/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/wfh-requests/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/wfh-requests/${id}/`, { method: 'DELETE' }),
      approve: (id: string) => request<any>(`/wfh-requests/${id}/approve/`, { method: 'POST' }),
      reject: (id: string) => request<any>(`/wfh-requests/${id}/reject/`, { method: 'POST' }),
    },
    missedPunches: {
      list: () => request<any[]>('/missed-punches/'),
      create: (data: any) => request<any>('/missed-punches/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/missed-punches/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/missed-punches/${id}/`, { method: 'DELETE' }),
      approve: (id: string) => request<any>(`/missed-punches/${id}/approve/`, { method: 'POST' }),
      reject: (id: string) => request<any>(`/missed-punches/${id}/reject/`, { method: 'POST' }),
    },
    overtimeRecords: {
      list: () => request<any[]>('/overtime-records/'),
      create: (data: any) => request<any>('/overtime-records/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/overtime-records/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/overtime-records/${id}/`, { method: 'DELETE' }),
      approve: (id: string) => request<any>(`/overtime-records/${id}/approve_overtime/`, { method: 'POST' }),
      reject: (id: string) => request<any>(`/overtime-records/${id}/reject_overtime/`, { method: 'POST' }),
    },
    earlyCheckouts: {
      list: () => request<any[]>('/early-checkouts/'),
      create: (data: any) => request<any>('/early-checkouts/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/early-checkouts/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/early-checkouts/${id}/`, { method: 'DELETE' }),
      approve: (id: string) => request<any>(`/early-checkouts/${id}/approve/`, { method: 'POST' }),
      reject: (id: string) => request<any>(`/early-checkouts/${id}/reject/`, { method: 'POST' }),
    },
    appraisals: {
      list: () => request<any[]>('/employee-appraisals/'),
      create: (data: any) => request<any>('/employee-appraisals/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/employee-appraisals/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/employee-appraisals/${id}/`, { method: 'DELETE' }),
      approve: (id: string) => request<any>(`/employee-appraisals/${id}/approve/`, { method: 'POST' }),
      reject: (id: string) => request<any>(`/employee-appraisals/${id}/reject/`, { method: 'POST' }),
    },
    employeeDocuments: {
      list: () => request<any[]>('/hr/employee-documents/'),
      create: (data: any) => request<any>('/hr/employee-documents/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/hr/employee-documents/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/hr/employee-documents/${id}/`, { method: 'DELETE' }),
    },
    regularizations: {
      list: () => request<any[]>('/hr/regularizations/'),
      create: (data: any) => request<any>('/hr/regularizations/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/hr/regularizations/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      approve: (id: string) => request<any>(`/hr/regularizations/${id}/approve/`, { method: 'POST' }),
      delete: (id: string) => request<any>(`/hr/regularizations/${id}/`, { method: 'DELETE' }),
    },
    reimbursements: {
      list: () => request<any[]>('/hr/reimbursements/'),
      create: (data: any) => request<any>('/hr/reimbursements/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/hr/reimbursements/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/hr/reimbursements/${id}/`, { method: 'DELETE' }),
    },
    salaryComponents: {
      list: () => request<any[]>('/hr/salary-components/'),
      create: (data: any) => request<any>('/hr/salary-components/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/hr/salary-components/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/hr/salary-components/${id}/`, { method: 'DELETE' }),
    },
  },

  // Accounting & Finance
  accounting: {
    financialYears: () => request<any[]>('/financial-years/'),
    chartOfAccounts: () => request<any[]>('/chart-of-accounts/'),
    taxes: () => request<any[]>('/taxes/'),
    costCenters: () => request<any[]>('/cost-centers/'),
    salesInvoices: {
      list: () => request<any[]>('/sales-invoices/'),
      create: (data: any) => request<any>('/sales-invoices/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/sales-invoices/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      approve: (id: string) => request<any>(`/sales-invoices/${id}/`, { method: 'PATCH', body: JSON.stringify({ status: 'Approved' }) }),
      recordPayment: (id: string, data: { amount: number; paymentMode?: string; referenceNumber?: string }) =>
        request<any>(`/sales-invoices/${id}/record-payment/`, { method: 'POST', body: JSON.stringify(data) }),
    },
    purchaseInvoices: {
      list: () => request<any[]>('/purchase-invoices/'),
      create: (data: any) => request<any>('/purchase-invoices/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/purchase-invoices/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      post: (id: string) => request<any>(`/purchase-invoices/${id}/`, { method: 'PATCH', body: JSON.stringify({ status: 'Posted' }) }),
      recordPayment: (id: string, data: { amount: number; paymentMode?: string; referenceNumber?: string }) =>
        request<any>(`/purchase-invoices/${id}/record-payment/`, { method: 'POST', body: JSON.stringify(data) }),
    },
    receipts: () => request<any[]>('/customer-receipts/'),
    createReceipt: (data: any) => request<any>('/customer-receipts/', { method: 'POST', body: JSON.stringify(data) }),
    payments: () => request<any[]>('/supplier-payments/'),
    createPayment: (data: any) => request<any>('/supplier-payments/', { method: 'POST', body: JSON.stringify(data) }),
    journalEntries: {
      list: () => request<any[]>('/journal-entries/'),
      create: (data: any) => request<any>('/journal-entries/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/journal-entries/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/journal-entries/${id}/`, { method: 'DELETE' }),
    },
    jobCostings: () => request<any[]>('/job-costings/'),
    creditNotes: {
      list: () => request<any[]>('/credit-notes/'),
      create: (data: any) => request<any>('/credit-notes/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/credit-notes/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/credit-notes/${id}/`, { method: 'DELETE' }),
    },
    debitNotes: {
      list: () => request<any[]>('/debit-notes/'),
      create: (data: any) => request<any>('/debit-notes/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/debit-notes/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/debit-notes/${id}/`, { method: 'DELETE' }),
    },
    contraEntries: {
      list: () => request<any[]>('/contra-entries/'),
      create: (data: any) => request<any>('/contra-entries/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/contra-entries/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/contra-entries/${id}/`, { method: 'DELETE' }),
    },
    bankAccounts: {
      list: () => request<any[]>('/bank-accounts/'),
      create: (data: any) => request<any>('/bank-accounts/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/bank-accounts/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/bank-accounts/${id}/`, { method: 'DELETE' }),
    },
    expenses: {
      list: () => request<any[]>('/expenses/'),
      create: (data: any) => request<any>('/expenses/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/expenses/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/expenses/${id}/`, { method: 'DELETE' }),
      approve: (id: string, approvedBy?: string) =>
        request<any>(`/expenses/${id}/approve/`, { method: 'POST', body: JSON.stringify({ approved_by: approvedBy || 'Super Admin' }) }),
    },
    fixedAssets: {
      list: () => request<any[]>('/accounting/fixed-assets/'),
      create: (data: any) => request<any>('/accounting/fixed-assets/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/accounting/fixed-assets/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/accounting/fixed-assets/${id}/`, { method: 'DELETE' }),
    },
    contraVouchers: {
      list: () => request<any[]>('/accounting/contra-vouchers/'),
      create: (data: any) => request<any>('/accounting/contra-vouchers/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<any>(`/accounting/contra-vouchers/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) => request<any>(`/accounting/contra-vouchers/${id}/`, { method: 'DELETE' }),
    },
  },

  // 360° Traceability & Central Approvals
  integration: {
    job360: (jobNumber: string) => request<any>(`/job-360/${jobNumber}/`),
    customer360: () => request<any[]>('/integration/customer-360-summaries/'),
    supplier360: () => request<any[]>('/integration/supplier-360-summaries/'),
    item360: () => request<any[]>('/integration/item-360-summaries/'),
    employee360: () => request<any[]>('/integration/employee-360-summaries/'),
    jobProfitability: () => request<any[]>('/integration/job-profitability-records/'),
    executiveKpis: () => request<any[]>('/integration/executive-kpis/'),
    activityLogs: () => request<any[]>('/integration/activity-logs/'),
    reportCenter: () => request<any[]>('/integration/report-center-items/'),
    approvals: {
      list: () => request<any[]>('/approvals/'),
      approve: (id: string) => request<any>(`/approvals/${id}/approve/`, { method: 'POST' }),
      reject: (id: string) => request<any>(`/approvals/${id}/reject/`, { method: 'POST' }),
    },
    alerts: {
      list: () => request<any[]>('/alerts/'),
      markRead: (id: string) => request<any>(`/alerts/${id}/mark-read/`, { method: 'POST' }),
    },
  },
};

export default api;
