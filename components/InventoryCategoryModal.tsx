
import React, { useState, useEffect } from 'react';
import { X, LayoutGrid, Palette, Hash, TrendingDown, ShieldAlert, ChevronRight, Layers } from 'lucide-react';
import { InventoryCategory } from '../types';
import { Input, SectionHeading } from './UIPrimitives';

interface InventoryCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<InventoryCategory>) => void;
  initialData?: InventoryCategory | null;
  availableCategories: InventoryCategory[];
}

const CATEGORY_ICONS = [
  { name: 'Package', value: 'Package' },
  { name: 'Appliance', value: 'Refrigerator' },
  { name: 'Electronics', value: 'Cpu' },
  { name: 'Furniture', value: 'Armchair' },
  { name: 'Tools', value: 'Hammer' },
  { name: 'Garden', value: 'Sprout' },
  { name: 'Art', value: 'Palette' },
  { name: 'Safety', value: 'ShieldCheck' }
];

const InventoryCategoryModal: React.FC<InventoryCategoryModalProps> = ({ 
  isOpen, onClose, onSave, initialData, availableCategories 
}) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [iconName, setIconName] = useState('Package');
  const [colorHex, setColorHex] = useState('#1e293b');
  const [depreciationRate, setDepreciationRate] = useState('');
  const [isInsuranceCritical, setIsInsuranceCritical] = useState(false);
  const [sortOrder, setSortOrder] = useState('0');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setParentId(initialData.parentId || '');
      setIconName(initialData.iconName || 'Package');
      setColorHex(initialData.colorHex || '#1e293b');
      setDepreciationRate(initialData.estimatedDepreciationRate?.toString() || '');
      setIsInsuranceCritical(initialData.isInsuranceCritical || false);
      setSortOrder(initialData.sortOrder.toString());
    } else {
      setName('');
      setParentId('');
      setIconName('Package');
      setColorHex('#1e293b');
      setDepreciationRate('');
      setIsInsuranceCritical(false);
      setSortOrder('0');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      parentId: parentId || null,
      iconName,
      colorHex,
      estimatedDepreciationRate: depreciationRate ? parseFloat(depreciationRate) : null,
      isInsuranceCritical,
      sortOrder: parseInt(sortOrder) || 0
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">
            {initialData ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-6">
            <SectionHeading label="Core Taxonomy" icon={LayoutGrid} />
            <Input 
              autoFocus
              label="Classification Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Smart Appliances"
              required
            />
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Layers size={10} className="mr-1.5" /> Logical Hierarchy (Parent)
              </label>
              <select 
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-sm font-bold text-slate-900 shadow-inner"
              >
                <option value="">Top-Level Group</option>
                {availableCategories.filter(c => c.id !== initialData?.id).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading label="Visual Signature" icon={Palette} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Color Code</label>
                <div className="flex items-center space-x-3">
                  <input 
                    type="color" 
                    value={colorHex} 
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer overflow-hidden p-0 bg-white"
                  />
                  <Input value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="font-mono text-xs" />
                </div>
              </div>
               <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon Symbol</label>
                <select 
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  {CATEGORY_ICONS.map(i => <option key={i.value} value={i.value}>{i.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl space-y-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldAlert size={80} className="text-white" />
             </div>
             <div className="flex items-center justify-between relative z-10">
                <SectionHeading label="Insurance Ledger" icon={ShieldAlert} color="text-slate-500" />
                <button 
                  type="button"
                  onClick={() => setIsInsuranceCritical(!isInsuranceCritical)}
                  className={`
                    px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all flex items-center space-x-2
                    ${isInsuranceCritical ? 'bg-[#b45c43] border-[#b45c43] text-white shadow-lg shadow-[#b45c43]/20' : 'bg-slate-800 border-slate-700 text-slate-400'}
                  `}
                >
                  <span>{isInsuranceCritical ? 'High Criticality' : 'Standard Asset'}</span>
                </button>
             </div>
             <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm relative z-10">
               Marking a category as insurance critical ensures its items are prioritized in coverage audits and claim reports.
             </p>
          </div>

          <div className="space-y-6">
            <SectionHeading label="Asset Lifecycle Rules" icon={TrendingDown} />
            <div className="grid grid-cols-2 gap-6">
               <Input 
                label="Depreciation (% / yr)" 
                type="number" 
                step="0.1"
                value={depreciationRate} 
                onChange={(e) => setDepreciationRate(e.target.value)} 
                placeholder="e.g. 15"
              />
              <Input label="UI Sort Priority" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
            </div>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end space-x-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Dismiss</button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95">
            {initialData ? 'Update Category' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryCategoryModal;
