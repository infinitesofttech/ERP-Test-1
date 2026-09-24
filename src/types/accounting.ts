export type FinancialYearStatus = 'Active' | 'Closed' | 'Previous' | 'Locked';

export type AccountCategory = 'Assets' | 'Liabilities' | 'Income' | 'Expenses' | 'Equity';

export type AccountType =
  | 'Asset'
  | 'Liability'
  | 'Equity'
  | 'Income'
  | 'Expense'
  | 'Current Asset'
  | 'Cash'
  | 'Bank'
  | 'Accounts Receivable'
  | 'Inventory'
  | 'Fixed Asset'
  | 'Current Liability'
  | 'Accounts Payable'
  | 'GST Payable'
  | 'TDS Payable'
  | 'Sales Income'
  | 'Service Income'
  | 'Purchase Expense'
  | 'Manufacturing Expense'
  | 'Direct Expense'
  | 'Indirect Expense'
  | 'Capital & Equity';

export type InvoiceStatus =
  | 'Draft'
  | 'Submitted'
  | 'Approved'
  | 'Posted'
  | 'Sent'
  | 'Partially Paid'
  | 'Paid'
  | 'Overdue'
  | 'Cancelled';

export type PurchaseInvoiceStatus =
  | 'Draft'
  | 'Pending_Posting'
  | 'Posted'
  | 'Partially Paid'
  | 'Paid'
  | 'Overdue'
  | 'Cancelled';

export type PaymentMode =
  | 'Cash'
  | 'Bank Transfer'
  | 'Bank_Transfer'
  | 'UPI'
  | 'Cheque'
  | 'NEFT'
  | 'RTGS'
  | 'Other';

export type ExpenseCategory =
  | 'Power & Electricity'
  | 'Factory Maintenance'
  | 'Machine Fuel & Lubricants'
  | 'Logistics & Freight'
  | 'Office & Admin'
  | 'Electricity & Utilities'
  | 'Rent'
  | 'Transport & Freight'
  | 'Office Expenses'
  | 'Machine Maintenance'
  | 'Travel & Conveyance'
  | 'Production Consumables'
  | 'Software & Subscriptions'
  | 'Professional Fees'
  | 'Salary & Wages'
  | 'Other';

export type AssetCategory =
  | 'Plant & Machinery'
  | 'Factory Building'
  | 'Vehicles'
  | 'Computers & IT'
  | 'Machinery'
  | 'Computer'
  | 'Furniture'
  | 'Vehicle'
  | 'Electrical Equipment'
  | 'Office Equipment'
  | 'Other';

export type DepreciationMethod = 'SLM' | 'WDV' | 'Straight Line' | 'Written Down Value';

export interface FinancialYear {
  id: string;
  name?: string;
  fyCode?: string;
  startDate: string;
  endDate: string;
  status: FinancialYearStatus;
  closedDate?: string;
  closedAt?: string;
  closedBy?: string;
}

export interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountGroup?: string;
  parentGroupId?: string;
  parentGroupName?: string;
  parentAccount?: string;
  category?: AccountCategory;
  accountType: AccountType | string;
  openingBalance: number;
  balanceType?: 'Debit' | 'Credit';
  normalBalance?: 'Debit' | 'Credit';
  currentBalance: number;
  taxApplicability?: boolean;
  status?: 'Active' | 'Inactive';
  isActive?: boolean;
}

export interface AccountGroup {
  id: string;
  groupCode: string;
  groupName: string;
  category?: AccountCategory;
  nature?: 'Asset' | 'Liability' | 'Income' | 'Expense' | 'Equity' | string;
  parentGroup?: string;
  parentGroupId?: string | null;
  affectsGrossProfit?: boolean;
}

export interface TaxMaster {
  id: string;
  taxCode?: string;
  taxName?: string;
  taxType?: 'CGST' | 'SGST' | 'IGST' | 'GST Combination' | string;
  rate?: number;
  ratePercent?: number;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  hsnSacCode?: string;
  status?: 'Active' | 'Inactive';
}

export interface TDSMaster {
  id: string;
  sectionCode: string;
  description: string;
  rate?: number;
  ratePercent?: number;
  thresholdLimit: number;
  applicablePartyType?: 'Company' | 'Individual/HUF' | 'All';
  glAccountCode?: string;
  status?: 'Active' | 'Inactive';
}

export interface CostCenter {
  id: string;
  code?: string;
  costCenterCode?: string;
  name?: string;
  costCenterName?: string;
  department?: string;
  managerName?: string;
  status?: 'Active' | 'Inactive';
}

export interface SalesInvoiceItem {
  id: string;
  itemId?: string;
  itemCode?: string;
  itemName?: string;
  description: string;
  hsnSac: string;
  quantity: number;
  uom?: string;
  unitPrice?: number;
  rate?: number;
  taxRate?: number;
  gstRatePercent?: number;
  discountAmount?: number;
  taxableValue?: number;
  taxAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  totalAmount: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerId: string;
  customerCode?: string;
  customerName: string;
  customerGstin: string;
  billingAddress?: string;
  shippingAddress?: string;
  placeOfSupply: string;
  salesOrderId?: string;
  salesOrderNumber?: string;
  customerPoNumber?: string;
  projectId?: string;
  jobNumber?: string;
  paymentTerms?: string;
  items: SalesInvoiceItem[];
  subTotal?: number;
  subtotal?: number;
  discountTotal?: number;
  taxableAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  cgstTotal?: number;
  sgstTotal?: number;
  igstTotal?: number;
  taxTotal?: number;
  roundOff?: number;
  grandTotal: number;
  paidAmount?: number;
  outstandingAmount?: number;
  status: InvoiceStatus | string;
  paymentStatus?: 'Paid' | 'Unpaid' | 'Partially Paid';
  termsAndConditions?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface PurchaseInvoiceItem {
  id: string;
  itemId?: string;
  itemCode?: string;
  itemName?: string;
  description?: string;
  hsnSac: string;
  quantity: number;
  uom?: string;
  unitPrice?: number;
  rate?: number;
  taxRate?: number;
  gstRatePercent?: number;
  discountAmount?: number;
  taxableAmount?: number;
  taxAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  totalAmount: number;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  vendorInvoiceNumber?: string;
  supplierInvoiceNumber?: string;
  invoiceDate: string;
  dueDate: string;
  supplierId: string;
  supplierName: string;
  supplierGstin: string;
  poNumber?: string;
  grnNumber?: string;
  projectId?: string;
  jobNumber?: string;
  paymentTerms?: string;
  items: PurchaseInvoiceItem[];
  subTotal?: number;
  subtotal?: number;
  freightCharges?: number;
  otherCharges?: number;
  taxableAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  cgstTotal?: number;
  sgstTotal?: number;
  igstTotal?: number;
  taxTotal?: number;
  tdsSection?: string;
  tdsRate?: number;
  tdsAmount?: number;
  tdsDeducted?: number;
  roundOff?: number;
  grandTotal: number;
  paidAmount?: number;
  outstandingAmount?: number;
  status: PurchaseInvoiceStatus | string;
  paymentStatus?: 'Paid' | 'Unpaid' | 'Partially Paid';
  createdBy?: string;
  createdAt?: string;
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  date?: string;
  creditNoteDate?: string;
  customerId: string;
  customerName: string;
  originalInvoiceNumber: string;
  jobNumber?: string;
  reason: string;
  taxableAmount: number;
  taxAmount?: number;
  gstAmount?: number;
  totalAmount: number;
  remarks?: string;
  status: 'Draft' | 'Approved' | 'Applied' | 'Cancelled' | string;
  createdBy?: string;
}

export interface DebitNote {
  id: string;
  debitNoteNumber: string;
  date?: string;
  debitNoteDate?: string;
  supplierId: string;
  supplierName: string;
  originalInvoiceNumber: string;
  jobNumber?: string;
  reason: string;
  taxableAmount: number;
  taxAmount?: number;
  gstAmount?: number;
  totalAmount: number;
  remarks?: string;
  status: 'Draft' | 'Approved' | 'Applied' | 'Cancelled' | string;
  createdBy?: string;
}

export interface CustomerReceipt {
  id: string;
  receiptNumber: string;
  date?: string;
  receiptDate?: string;
  customerId: string;
  customerName: string;
  salesInvoiceNumber?: string;
  paymentMode: PaymentMode | string;
  bankAccountId?: string;
  bankName?: string;
  bankCashAccountCode?: string;
  bankCashAccountName?: string;
  amountPaid?: number;
  amount?: number;
  referenceNumber: string;
  tdsDeductedByCustomer?: number;
  allocations?: { invoiceId?: string; invoiceNumber?: string; allocatedAmount: number }[];
  remarks?: string;
  status: 'Received' | 'Posted' | 'Cancelled' | string;
  createdBy?: string;
}

export interface SupplierPayment {
  id: string;
  paymentNumber: string;
  date?: string;
  paymentDate?: string;
  supplierId: string;
  supplierName: string;
  purchaseInvoiceNumber?: string;
  paymentMode: PaymentMode | string;
  bankAccountId?: string;
  bankName?: string;
  bankCashAccountCode?: string;
  bankCashAccountName?: string;
  amountPaid?: number;
  amount?: number;
  referenceNumber: string;
  tdsDeducted?: number;
  allocations?: { invoiceId?: string; invoiceNumber?: string; allocatedAmount: number }[];
  remarks?: string;
  status: 'Paid' | 'Posted' | 'Cancelled' | string;
  createdBy?: string;
}

export interface JournalEntryLine {
  id: string;
  accountId?: string;
  accountCode: string;
  accountName: string;
  debitAmount: number;
  creditAmount: number;
  costCenterCode?: string;
  jobNumber?: string;
  narration?: string;
}

export interface JournalEntry {
  id: string;
  journalNumber: string;
  date?: string;
  journalDate?: string;
  voucherType?: 'Journal' | 'Adjustment' | 'Depreciation' | 'Opening' | string;
  vouchertype?: string;
  narration: string;
  reference?: string;
  lines: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  isBalanced?: boolean;
  status: 'Draft' | 'Approved' | 'Posted' | 'Reversed' | string;
  createdBy: string;
  approvedBy?: string;
}

export interface ContraEntry {
  id: string;
  contraNumber: string;
  date?: string;
  contraDate?: string;
  contraType: 'Bank_to_Bank' | 'Bank_to_Cash' | 'Cash_to_Bank' | string;
  fromAccountId?: string;
  fromAccountName: string;
  fromAccountCode?: string;
  toAccountId?: string;
  toAccountName: string;
  toAccountCode?: string;
  amount: number;
  referenceNumber: string;
  narration: string;
  status: 'Posted' | 'Cancelled' | string;
  createdBy?: string;
}

export interface ExpenseEntry {
  id: string;
  expenseNumber: string;
  date?: string;
  expenseDate?: string;
  category: ExpenseCategory | string;
  vendorName?: string;
  employeeName?: string;
  claimedBy?: string;
  subTotal?: number;
  taxAmount?: number;
  grandTotal?: number;
  amount?: number;
  gstAmount?: number;
  totalAmount?: number;
  paymentMode: PaymentMode | string;
  bankCashAccountName?: string;
  projectId?: string;
  jobNumber?: string;
  costCenterCode?: string;
  description?: string;
  remarks?: string;
  status: 'Draft' | 'Pending_Approval' | 'Submitted' | 'Approved' | 'Paid' | 'Rejected' | string;
  approvedBy?: string;
}

export interface BankAccount {
  id: string;
  accountName?: string;
  accountType: 'Current' | 'Savings' | 'Overdraft' | 'Cash_Credit' | 'Cash' | string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch?: string;
  branchName?: string;
  glAccountCode?: string;
  openingBalance: number;
  currentBalance: number;
  status?: 'Active' | 'Inactive';
  isActive?: boolean;
}

export interface BankTransaction {
  id: string;
  transactionDate: string;
  bankDate?: string;
  bankAccountId: string;
  referenceNumber?: string;
  transactionRef?: string;
  description: string;
  amount?: number;
  withdrawalAmount?: number;
  depositAmount?: number;
  matchedErpDocNumber?: string;
  reconciliationStatus: 'Reconciled' | 'Matched' | 'Unmatched' | 'Partially Matched' | 'Ignored' | string;
  isReconciled?: boolean;
}

export interface BankReconciliation {
  id: string;
  reconciliationNumber?: string;
  reconciliationDate?: string;
  bankAccountId: string;
  bankAccountName?: string;
  statementEndingDate?: string;
  erpBalance?: number;
  bankBalance?: number;
  difference?: number;
  status?: 'In Progress' | 'Completed';
}

export interface FixedAsset {
  id: string;
  assetCode: string;
  assetName: string;
  category: AssetCategory | string;
  purchaseDate: string;
  purchaseCost?: number;
  purchaseValue?: number;
  supplierName?: string;
  invoiceNumber?: string;
  location: string;
  department?: string;
  usefulLifeYears: number;
  depreciationMethod: DepreciationMethod | string;
  depreciationRate?: number;
  residualValue?: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  status: 'Active' | 'Disposed' | 'Written Off' | string;
}

export interface DepreciationEntry {
  id: string;
  depreciationNumber?: string;
  journalEntryNumber?: string;
  date?: string;
  depreciationDate?: string;
  assetId: string;
  assetCode?: string;
  assetName?: string;
  period: string;
  amount: number;
  depreciationAmount?: number;
  accumulatedDepreciation?: number;
  accumulatedDepreciationAfter?: number;
  bookValueAfter: number;
}

export interface JobCostingSummary {
  jobId?: string;
  jobNumber: string;
  productName?: string;
  machineModel?: string;
  customerName?: string;
  salesValue?: number;
  salesOrderValue?: number;
  invoicedValue?: number;
  receivedValue?: number;
  estimatedMaterialCost?: number;
  purchaseCost?: number;
  actualCost?: number;
  totalActualCost?: number;
  profit?: number;
  netProfit?: number;
  marginPercent?: number;
  profitMarginPercent?: number;
  materialCost?: number;
  materialIssuedCost?: number;
  materialReturnedValue?: number;
  scrapValue?: number;
  labourCost?: number;
  machineCost?: number;
  subcontractCost?: number;
  transportInstallationCost?: number;
  overheadCost?: number;
  productionOverheads?: number;
  reworkCost?: number;
  totalEstimatedCost?: number;
  costVariance?: number;
}

export interface ProjectCostingSummary {
  projectId: string;
  projectNumber?: string;
  customerName: string;
  salesValue: number;
  purchaseCost?: number;
  materialCost?: number;
  productionCost?: number;
  labourCost?: number;
  expenses?: number;
  totalCost?: number;
  invoicedAmount?: number;
  receivedAmount?: number;
  outstandingAmount?: number;
  budgetedCost?: number;
  actualCost?: number;
  variance?: number;
}

export interface ReceivableAging {
  customerId: string;
  customerCode?: string;
  customerName: string;
  current?: number;
  days0to30?: number;
  days1_30?: number;
  days31to60?: number;
  days31_60?: number;
  days61to90?: number;
  days61_90?: number;
  days90Plus?: number;
  totalOutstanding: number;
}

export interface PayableAging {
  supplierId: string;
  supplierCode?: string;
  supplierName: string;
  current?: number;
  days0to30?: number;
  days1_30?: number;
  days31to60?: number;
  days31_60?: number;
  days61to90?: number;
  days61_90?: number;
  days90Plus?: number;
  totalOutstanding: number;
}
