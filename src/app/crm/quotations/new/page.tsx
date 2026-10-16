'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useERP } from '../../../../context/ERPContext';
import { ArrowLeft, FileCheck2, Plus, Trash2, Save, IndianRupee } from 'lucide-react';
import { QuotationItem } from '../../../../types/crm';
import { formatCurrency } from '../../../../lib/utils';

function QuotationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customers, enquiries, leads, addQuotation, currentUser } = useERP();

  const prefillCustId = searchParams.get('customerId') || '';
  const prefillEnqId = searchParams.get('enquiryId') || '';
  const prefillLeadId = searchParams.get('leadId') || '';

  // Match Lead from search params or localStorage
  const matchedLead = leads.find((l) =>
    (prefillLeadId && (l.id === prefillLeadId || l.leadNo === prefillLeadId)) ||
    (prefillEnqId && (l.convertedEnquiryId === prefillEnqId || l.id === prefillEnqId)) ||
    (prefillCustId && (l.convertedCustomerId === prefillCustId || l.id === prefillCustId))
  ) || (typeof window !== 'undefined' ? (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('UMA_ERP_leads') || '[]');
      return stored.find((l: any) =>
        (prefillLeadId && (l.id === prefillLeadId || l.leadNo === prefillLeadId)) ||
        (prefillEnqId && (l.convertedEnquiryId === prefillEnqId || l.id === prefillEnqId)) ||
        (prefillCustId && (l.convertedCustomerId === prefillCustId || l.id === prefillCustId))
      );
    } catch (_) { return null; }
  })() : null);

  const matchedEnquiry = enquiries.find((e) =>
    (prefillEnqId && (e.id === prefillEnqId || e.enquiryNo === prefillEnqId)) ||
    (prefillCustId && e.customerId === prefillCustId) ||
    (prefillLeadId && e.leadId === prefillLeadId)
  );

  const leadMatchedCustomer = customers.find((c) =>
    (matchedLead?.convertedCustomerId && (c.id === matchedLead.convertedCustomerId || c.customerCode === matchedLead.convertedCustomerId)) ||
    (matchedLead?.companyName && c.companyName && c.companyName.trim().toLowerCase() === matchedLead.companyName.trim().toLowerCase())
  );

  const initialCustomerId =
    prefillCustId ||
    matchedEnquiry?.customerId ||
    matchedLead?.convertedCustomerId ||
    leadMatchedCustomer?.id ||
    '';
  const initCompanyName =
    matchedEnquiry?.customerName ||
    matchedLead?.companyName ||
    leadMatchedCustomer?.companyName ||
    customers.find((c) => c.id === initialCustomerId)?.companyName ||
    '';

  const initialLeadId =
    matchedLead?.id ||
    prefillLeadId ||
    '';
  const initContactPerson =
    matchedLead?.contactPerson ||
    leadMatchedCustomer?.contactPerson ||
    '';

  const [leadId, setLeadId] = useState(initialLeadId);
  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [companyName, setCompanyName] = useState(initCompanyName);
  const [contactPerson, setContactPerson] = useState(initContactPerson);

  React.useEffect(() => {
    const targetLead = leads.find((l) =>
      (prefillLeadId && (l.id === prefillLeadId || l.leadNo === prefillLeadId)) ||
      (leadId && (l.id === leadId || l.leadNo === leadId))
    );
    if (targetLead) {
      if (!leadId) setLeadId(targetLead.id);
      if (targetLead.contactPerson && !contactPerson) setContactPerson(targetLead.contactPerson);
      if (targetLead.companyName && !companyName) setCompanyName(targetLead.companyName);
      if (targetLead.convertedCustomerId) setCustomerId(targetLead.convertedCustomerId);
    }
  }, [prefillLeadId, leads]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('2026-10-30');

  // Compute initial product name, desc, qty, rate from lead/enquiry
  const initProductName =
    matchedLead?.productName ||
    matchedEnquiry?.machineProduct ||
    'Heavy SS 316L Chemical Reactor Vessel (10 KL)';
  const initDesc =
    matchedLead?.requirementDescription ||
    matchedEnquiry?.requirement ||
    matchedEnquiry?.specification ||
    'Shell: 8mm SS 316L, Jacket: Dimple SS 304, 15 HP Anchor Agitator with Dual Mechanical Seal.';
  const initQty = Number(matchedLead?.quantity || matchedEnquiry?.quantity || 1);
  const initRate = matchedLead?.budget
    ? Math.round(Number(matchedLead.budget) / (initQty || 1))
    : 4200000;
  const initTax = 18;
  const initBase = initQty * initRate;
  const initAmount = Math.round(initBase * (1 + initTax / 100));

  // Items
  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: 'item-1',
      productName: initProductName,
      description: initDesc,
      descriptionLines: initDesc ? [initDesc] : ['Standard technical specifications'],
      quantity: initQty,
      unit: 'Set',
      rate: initRate,
      discountPercent: 0,
      taxPercent: initTax,
      amount: initAmount,
    },
  ]);

  // Commercials & Scope
  const [technicalSpecs, setTechnicalSpecs] = useState(
    matchedLead?.capacity
      ? `Capacity: ${matchedLead.capacity} (${matchedLead.machineType || 'Industrial Equipment'}). ${matchedLead.requirementDescription || ''}`
      : matchedEnquiry?.specification || 'Design Code: ASME Sec VIII Div 1. Hydro test: 12 Bar. Design Temp: 180°C.'
  );
  const [scopeOfSupply, setScopeOfSupply] = useState(
    matchedLead?.productName
      ? `Supply, fabrication, inspection and testing of ${matchedLead.productName} as per specifications.`
      : 'Supply of complete reactor vessel, motor, gearbox, seal pot, mounting stool.'
  );
  const [exclusions, setExclusions] = useState('Civil foundations, interconnecting piping, insulation cladding.');
  const [paymentTerms, setPaymentTerms] = useState('30% Advance, 60% ag. Proforma Invoice, 10% after Commissioning.');
  const [deliveryTime, setDeliveryTime] = useState(matchedLead?.expectedDelivery ? `By ${matchedLead.expectedDelivery}` : '8 to 10 Weeks from approved GA drawing.');
  const [warranty, setWarranty] = useState('18 Months from dispatch or 12 Months from commissioning.');
  const [termsAndConditions, setTermsAndConditions] = useState('Prices Ex-Works Makarpura, Vadodara. Freight extra at actuals.');
  const [termsList, setTermsList] = useState<string[]>([
    'Prices Ex-Works Makarpura, Vadodara. Freight extra at actuals.',
  ]);

  const addTerm = () => {
    setTermsList([...termsList, '']);
  };

  const removeTerm = (idx: number) => {
    setTermsList(termsList.filter((_, i) => i !== idx));
  };

  const handleTermChange = (idx: number, value: string) => {
    const updated = [...termsList];
    updated[idx] = value;
    setTermsList(updated);
  };

  const handleItemChange = (idx: number, field: keyof QuotationItem, value: any) => {
    const updated = [...items];
    (updated[idx] as any)[field] = value;

    // Recalculate amount
    const qty = Number(updated[idx].quantity) || 1;
    const rate = Number(updated[idx].rate) || 0;
    const disc = Number(updated[idx].discountPercent) || 0;
    const tax = Number(updated[idx].taxPercent) || 0;

    const base = qty * rate * (1 - disc / 100);
    const amt = base * (1 + tax / 100);
    updated[idx].amount = Math.round(amt);

    setItems(updated);
  };

  const addDescriptionLine = (itemIdx: number) => {
    const updated = [...items];
    const currentLines =
      updated[itemIdx].descriptionLines && updated[itemIdx].descriptionLines!.length > 0
        ? [...updated[itemIdx].descriptionLines!]
        : updated[itemIdx].description
        ? updated[itemIdx].description.split('\n')
        : [''];
    const newLines = [...currentLines, ''];
    updated[itemIdx].descriptionLines = newLines;
    updated[itemIdx].description = newLines.join('\n');
    setItems(updated);
  };

  const handleDescriptionLineChange = (itemIdx: number, lineIdx: number, val: string) => {
    const updated = [...items];
    const currentLines =
      updated[itemIdx].descriptionLines && updated[itemIdx].descriptionLines!.length > 0
        ? [...updated[itemIdx].descriptionLines!]
        : updated[itemIdx].description
        ? updated[itemIdx].description.split('\n')
        : [''];
    currentLines[lineIdx] = val;
    updated[itemIdx].descriptionLines = currentLines;
    updated[itemIdx].description = currentLines.join('\n');
    setItems(updated);
  };

  const removeDescriptionLine = (itemIdx: number, lineIdx: number) => {
    const updated = [...items];
    const currentLines =
      updated[itemIdx].descriptionLines && updated[itemIdx].descriptionLines!.length > 0
        ? [...updated[itemIdx].descriptionLines!]
        : updated[itemIdx].description
        ? updated[itemIdx].description.split('\n')
        : [''];
    const newLines = currentLines.filter((_, i) => i !== lineIdx);
    const finalLines = newLines.length > 0 ? newLines : [''];
    updated[itemIdx].descriptionLines = finalLines;
    updated[itemIdx].description = finalLines.join('\n');
    setItems(updated);
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${prev.length + 1}`,
        productName: '',
        description: 'Standard technical specifications',
        descriptionLines: ['Standard technical specifications'],
        quantity: 1,
        unit: 'Set',
        rate: 100000,
        discountPercent: 0,
        taxPercent: 18,
        amount: 118000,
      },
    ]);
  };

  const removeItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.rate * (1 - item.discountPercent / 100)), 0);
  const totalTax = items.reduce((sum, item) => sum + (item.quantity * item.rate * (1 - item.discountPercent / 100) * (item.taxPercent / 100)), 0);
  const grandTotal = Math.round(subTotal + totalTax);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust =
      customers.find((c) => c.id === customerId) ||
      leads.find((l) => l.id === customerId || l.convertedCustomerId === customerId) ||
      enquiries.find((enq) => enq.customerId === customerId || enq.id === customerId);

    const activeLead = leads.find((l) => l.id === leadId || l.leadNo === leadId) || matchedLead;

    const resolvedCustomerName =
      companyName.trim() ||
      activeLead?.companyName ||
      (cust as any)?.companyName ||
      (cust as any)?.customerName ||
      matchedEnquiry?.customerName ||
      'Customer';

    const resolvedContactPerson =
      contactPerson.trim() ||
      activeLead?.contactPerson ||
      (cust as any)?.contactPerson ||
      (cust as any)?.contact_person ||
      'Purchase Head';

    const resolvedContactEmail =
      activeLead?.email ||
      (cust as any)?.email ||
      (cust as any)?.contact_email ||
      '';

    const resolvedContactMobile =
      activeLead?.mobile ||
      (cust as any)?.mobile ||
      (cust as any)?.phone ||
      '';

    const created = addQuotation({
      currentRevision: 'Rev-00',
      date,
      validUntil,
      customerId: customerId || `CUST-${Date.now().toString().slice(-4)}`,
      customerName: resolvedCustomerName,
      contactPerson: resolvedContactPerson,
      contactEmail: resolvedContactEmail,
      contactMobile: resolvedContactMobile,
      enquiryId: prefillEnqId || undefined,
      latestSummary: {
        grandTotal,
        status: 'draft',
        machineProduct: items.map((it) => it.productName.trim()).filter(Boolean).join(', ') || 'Custom Manufacturing Machine',
      },
      revisions: [
        {
          revisionNumber: 'Rev-00',
          date,
          preparedBy: `${currentUser.firstName} ${currentUser.lastName}`,
          items: items.map((it, itIdx) => {
            const rawLines = (it.descriptionLines && it.descriptionLines.length > 0
              ? it.descriptionLines
              : it.description
              ? it.description.split('\n')
              : []
            ).map((l) => l.trim()).filter(Boolean);

            const lines = rawLines.length > 0 ? rawLines : ['Standard technical specifications'];

            return {
              ...it,
              id: it.id || `item-${Date.now()}-${itIdx + 1}`,
              productName: it.productName.trim() || `Equipment / Machine #${itIdx + 1}`,
              description: lines.join('\n'),
              descriptionLines: lines,
              quantity: Number(it.quantity) || 1,
              rate: Number(it.rate) || 0,
              discountPercent: Number(it.discountPercent) || 0,
              taxPercent: Number(it.taxPercent) || 18,
              unit: it.unit || 'Set',
            };
          }),
          subTotal: Math.round(subTotal),
          discountAmount: 0,
          taxAmount: Math.round(totalTax),
          grandTotal,
          technicalSpecs,
          scopeOfSupply,
          exclusions,
          paymentTerms,
          deliveryTime,
          warranty,
          termsAndConditions: termsList.filter((t) => t.trim()).join('\n') || 'Prices Ex-Works Makarpura, Vadodara. Freight extra at actuals.',
          status: 'draft',
        },
      ],
    });

    router.push(`/crm/quotations/${created.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 text-xs pb-10">
      <Link href="/crm/quotations" className="inline-flex items-center gap-1.5 text-crm-brand-700 hover:underline font-semibold">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Quotations
      </Link>

      <div className="bg-white dark:bg-white border border-slate-200 dark:border-[#EBE3DB] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-[#EBE3DB] pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-[#211B17] flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-crm-brand-700" />
              Generate Technical & Commercial Quotation (Rev-00)
            </h1>
            <p className="text-[#70665F] mt-0.5">
              Build formal machine quotation with line items, tax calculations, technical scope, and payment milestones.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* HEADER METADATA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-[#544B45] font-semibold mb-1">
                Select Lead <span className="text-rose-500">*</span>
              </label>
              <select
                value={leadId}
                onChange={(e) => {
                  const newLeadId = e.target.value;
                  setLeadId(newLeadId);
                  const foundLead = leads.find((l) => l.id === newLeadId || l.leadNo === newLeadId);
                  if (foundLead) {
                    setContactPerson(foundLead.contactPerson || '');
                    setCompanyName(foundLead.companyName || '');
                    setCustomerId(foundLead.convertedCustomerId || foundLead.id);

                    const prodName = foundLead.productName;
                    const desc = foundLead.requirementDescription;
                    const qty = Number(foundLead.quantity || 1);
                    const rate = foundLead.budget ? Math.round(Number(foundLead.budget) / (qty || 1)) : 100000;
                    const tax = 18;
                    const base = qty * rate;
                    const amt = Math.round(base * (1 + tax / 100));

                    if (prodName) {
                      setItems((prevItems) => {
                        const firstItem: QuotationItem = {
                          id: prevItems[0]?.id || 'item-1',
                          productName: prodName,
                          description: desc || 'Standard technical specifications',
                          descriptionLines: desc ? [desc] : ['Standard technical specifications'],
                          quantity: qty,
                          unit: prevItems[0]?.unit || 'Set',
                          rate,
                          discountPercent: 0,
                          taxPercent: tax,
                          amount: amt,
                        };
                        const otherItems = prevItems.slice(1);
                        return [firstItem, ...otherItems];
                      });
                      setScopeOfSupply(`Supply, fabrication, inspection and testing of ${prodName} as per specifications.`);
                    }
                    if (foundLead.capacity) {
                      setTechnicalSpecs(`Capacity: ${foundLead.capacity} (${foundLead.machineType || 'Industrial'}). ${foundLead.requirementDescription || ''}`);
                    }
                    if (foundLead.expectedDelivery) {
                      setDeliveryTime(`By ${foundLead.expectedDelivery}`);
                    }
                  } else {
                    setContactPerson('');
                    setCompanyName('');
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#FAF7F2] border border-[#E7DED5] rounded-lg font-bold text-slate-900 dark:text-[#211B17]"
              >
                <option value="">-- Select Lead --</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.companyName} {l.contactPerson ? `(${l.contactPerson})` : `(${l.leadNo})`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-[#544B45] font-semibold mb-1">
                Person Name (Contact Person) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Auto-filled from selected lead"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#FAF7F2] border border-[#E7DED5] rounded-lg font-bold text-slate-900 dark:text-[#211B17]"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-[#544B45] font-semibold mb-1">Quotation Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#FAF7F2] border border-[#E7DED5] rounded-lg"
              />
            </div>
          </div>

          {/* LINE ITEMS TABLE */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-[#EBE3DB]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 dark:text-[#544B45]">Equipment / Machine Line Items</h3>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 dark:border-[#EBE3DB] bg-slate-50/50 dark:bg-[#FAF7F2]/30 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-slate-600 font-semibold">
                          Machine / Item Name * {items.length > 1 ? `(#${idx + 1})` : ''}
                        </label>
                        {idx === 0 && (
                          <button
                            type="button"
                            onClick={addItem}
                            className="px-2.5 py-1 bg-[#FAF7F2] text-[#3E2723] hover:bg-[#F2ECE4] border border-[#E7DED5] rounded-md font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#8B7355]" /> Add Machine
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        value={item.productName}
                        onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                        placeholder="e.g. 10 KL SS 316L Limpet Jacketed Reactor"
                        className="w-full px-3 py-1.5 bg-white dark:bg-white border rounded-lg font-bold"
                      />
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg mt-7 transition cursor-pointer"
                        title="Remove machine item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-slate-600 font-semibold">Item Technical Description</label>
                      <button
                        type="button"
                        onClick={() => addDescriptionLine(idx)}
                        className="px-2.5 py-1 bg-[#FAF7F2] text-[#3E2723] hover:bg-[#F2ECE4] border border-[#E7DED5] rounded-md font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#8B7355]" /> Add Line
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(item.descriptionLines && item.descriptionLines.length > 0
                        ? item.descriptionLines
                        : item.description
                        ? item.description.split('\n')
                        : ['']
                      ).map((line, lineIdx, allLines) => (
                        <div key={lineIdx} className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#70665F] w-5 text-center shrink-0">
                            {lineIdx + 1}.
                          </span>
                          <input
                            type="text"
                            value={line}
                            onChange={(e) => handleDescriptionLineChange(idx, lineIdx, e.target.value)}
                            placeholder="Shell thk, dish ends, agitator drive, motor rating..."
                            className="flex-1 px-3 py-1.5 bg-white dark:bg-white border border-[#E7DED5] rounded-lg text-xs font-medium"
                          />
                          {allLines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDescriptionLine(idx, lineIdx)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Remove line"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-[11px]">
                    <div>
                      <label className="block text-[#70665F] mb-0.5">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        placeholder="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white dark:bg-white border rounded font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[#70665F] mb-0.5">Unit Rate (₹)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, 'rate', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white dark:bg-white border rounded font-mono font-bold text-slate-800 dark:text-[#544B45]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#70665F] mb-0.5">Discount %</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.discountPercent}
                        onChange={(e) => handleItemChange(idx, 'discountPercent', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white dark:bg-white border rounded font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#70665F] mb-0.5">GST %</label>
                      <select
                        value={item.taxPercent}
                        onChange={(e) => handleItemChange(idx, 'taxPercent', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white dark:bg-white border rounded font-mono"
                      >
                        <option value={18}>18% GST</option>
                        <option value={12}>12% GST</option>
                        <option value={5}>5% GST</option>
                        <option value={0}>0% Exempt</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#70665F] mb-0.5">Total Amount (₹)</label>
                      <span className="px-2 py-1 bg-slate-200 dark:bg-[#FAF7F2] rounded font-mono font-bold text-emerald-600 block text-center">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary Strip */}
            <div className="p-4 bg-slate-100 dark:bg-[#FAF7F2] rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="font-semibold text-slate-600 dark:text-[#70665F]">
                Taxable Subtotal: {formatCurrency(subTotal)} • Total Tax: {formatCurrency(totalTax)}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-800 dark:text-[#544B45]">Grand Total:</span>
                <span className="text-base font-extrabold text-emerald-600 font-mono">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* TERMS & CONDITIONS */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-[#EBE3DB]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 dark:text-[#544B45]">Terms & Conditions</h3>
              <button
                type="button"
                onClick={addTerm}
                className="px-3 py-1.5 bg-[#FAF7F2] text-[#3E2723] hover:bg-[#F2ECE4] border border-[#E7DED5] rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add New
              </button>
            </div>

            <div className="space-y-2.5">
              {termsList.map((term, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#70665F] w-6 flex-shrink-0 text-center">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => handleTermChange(idx, e.target.value)}
                    placeholder="Enter term or condition..."
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#FAF7F2] border border-[#E7DED5] rounded-lg text-xs font-medium text-slate-900 dark:text-[#211B17] outline-none focus:bg-white focus:border-blue-600"
                  />
                  {termsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTerm(idx)}
                      title="Remove condition"
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-[#EBE3DB]">
            <Link
              href="/crm/quotations"
              className="px-4 py-2 border rounded-lg hover:bg-slate-100 font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-crm-brand-700 hover:bg-crm-brand-800 text-white rounded-xl font-bold shadow-md transition"
            >
              Save & Generate Quotation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewQuotationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#70665F]">Loading quotation editor...</div>}>
      <QuotationFormContent />
    </Suspense>
  );
}
