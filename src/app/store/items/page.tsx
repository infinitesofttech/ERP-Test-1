'use client';

import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { ItemMaster, ItemType } from '../../../types/store';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Tag,
  Layers,
  AlertTriangle,
  Building,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function ItemMasterPage() {
  const { itemMasters, addItemMaster, updateItemMaster, itemCategories, uoms, warehouses, suppliers } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Item Form State
  const [formData, setFormData] = useState<Omit<ItemMaster, 'id' | 'createdAt'>>({
    itemCode: '',
    itemName: '',
    itemType: 'Plate',
    category: 'Stainless Steel Plates & Sheets',
    description: '',
    specification: '',
    brandMake: '',
    hsnSac: '72193200',
    gstRate: 18,
    uom: 'Kg',
    status: 'Active',
    minimumStock: 1000,
    maximumStock: 10000,
    reorderLevel: 2500,
    safetyStock: 800,
    leadTimeDays: 10,
    defaultWarehouseId: 'WH-001',
    defaultLocationBin: 'W1-ZA-R1-S1-B01',
    batchTracking: true,
    serialTracking: false,
    lotTracking: true,
    defaultPurchaseRate: 350,
    lastPurchaseRate: 350,
    standardCost: 350,
  });

  const filteredItems = itemMasters.filter((item) => {
    const matchesSearch =
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.itemType === selectedType;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemCode || !formData.itemName) return;
    addItemMaster(formData);
    setIsModalOpen(false);
    setFormData({
      itemCode: '',
      itemName: '',
      itemType: 'Plate',
      category: 'Stainless Steel Plates & Sheets',
      description: '',
      specification: '',
      brandMake: '',
      hsnSac: '72193200',
      gstRate: 18,
      uom: 'Kg',
      status: 'Active',
      minimumStock: 1000,
      maximumStock: 10000,
      reorderLevel: 2500,
      safetyStock: 800,
      leadTimeDays: 10,
      defaultWarehouseId: 'WH-001',
      defaultLocationBin: 'W1-ZA-R1-S1-B01',
      batchTracking: true,
      serialTracking: false,
      lotTracking: true,
      defaultPurchaseRate: 350,
      lastPurchaseRate: 350,
      standardCost: 350,
    });
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-semibold">
              STORE CATALOG
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Item & Material Master</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Centralized master repository for raw materials, bought-out items, consumables, hardware, and finished goods.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
        >
          <Plus className="w-4 h-4" />
          Add New Item
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code, name, specification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Item Types</option>
            <option value="Plate">Plate / Sheet</option>
            <option value="Pipe">Pipe / Tube</option>
            <option value="Bought-Out Item">Bought-Out Item</option>
            <option value="Consumable">Consumable</option>
            <option value="Hardware">Hardware</option>
            <option value="Finished Good">Finished Good</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {itemCategories.map((c) => (
              <option key={c.id} value={c.categoryName}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-white font-bold">{filteredItems.length}</span> of {itemMasters.length} items
        </div>
      </div>

      {/* Item Master Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">Item Code & Name</th>
                <th className="p-3.5">Type & Category</th>
                <th className="p-3.5">Specification & HSN</th>
                <th className="p-3.5">UOM</th>
                <th className="p-3.5 text-right">Min / Max Stock</th>
                <th className="p-3.5 text-right">Reorder Level</th>
                <th className="p-3.5 text-right">Std Cost (₹)</th>
                <th className="p-3.5 text-center">Batch / Serial</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-medium">
                    <div className="font-bold text-white text-xs">{item.itemCode}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.itemName}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-semibold border border-blue-500/30">
                      {item.itemType}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{item.category}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-slate-300 text-xs font-mono">{item.specification}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">HSN: {item.hsnSac} | GST: {item.gstRate}%</div>
                  </td>
                  <td className="p-3.5 font-bold text-slate-200">{item.uom}</td>
                  <td className="p-3.5 text-right font-mono">
                    <div className="text-emerald-400 font-bold">{item.minimumStock}</div>
                    <div className="text-[10px] text-slate-400">Max: {item.maximumStock}</div>
                  </td>
                  <td className="p-3.5 text-right font-mono text-amber-400 font-bold">{item.reorderLevel}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">₹{item.standardCost.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono">
                      {item.batchTracking && <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Batch</span>}
                      {item.serialTracking && <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Serial</span>}
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                Add New Item to Master Catalog
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Item Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.itemCode}
                    onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                    placeholder="e.g. RM-SS316-12MM"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="e.g. SS 316L Plate 12mm"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Item Type</label>
                  <select
                    value={formData.itemType}
                    onChange={(e) => setFormData({ ...formData, itemType: e.target.value as ItemType })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Plate">Plate</option>
                    <option value="Pipe">Pipe</option>
                    <option value="Bought-Out Item">Bought-Out Item</option>
                    <option value="Consumable">Consumable</option>
                    <option value="Hardware">Hardware</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {itemCategories.map((c) => (
                      <option key={c.id} value={c.categoryName}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">UOM</label>
                  <select
                    value={formData.uom}
                    onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {uoms.map((u) => (
                      <option key={u.id} value={u.uomCode}>
                        {u.uomCode} - {u.uomName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Technical Specification</label>
                <input
                  type="text"
                  value={formData.specification}
                  onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                  placeholder="e.g. ASME SA 240 SS 316L Prime Grade"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Min Stock</label>
                  <input
                    type="number"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Standard Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.standardCost}
                    onChange={(e) => setFormData({ ...formData, standardCost: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">HSN Code</label>
                  <input
                    type="text"
                    value={formData.hsnSac}
                    onChange={(e) => setFormData({ ...formData, hsnSac: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 text-xs font-semibold shadow-lg shadow-blue-600/30"
                >
                  Save Item Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
