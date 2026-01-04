
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Palette, TrendingDown, ShieldAlert, Layers } from 'lucide-react';
import { InventoryCategory } from "@/types";
import { Input, SectionHeading, Modal } from "@/components/ui";

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
  const [canHaveChildren, setCanHaveChildren] = useState(true);
  const [iconName, setIconName] = useState('Package');
  const [colorHex, setColorHex] = useState('#1e293b');
  const [depreciationRate, setDepreciationRate] = useState('');
  const [isInsuranceCritical, setIsInsuranceCritical] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setParentId(initialData.parentId || '');
      setCanHaveChildren(initialData.canHaveChildren ?? true);
      setIconName(initialData.iconName || 'Package');
      setColorHex(initialData.colorHex || '#1e293b');
      setDepreciationRate(initialData.estimatedDepreciationRate?.toString() || '');
      setIsInsuranceCritical(initialData.isInsuranceCritical || false);
    } else {
      setName('');
      setParentId('');
      setCanHaveChildren(true);
      setIconName('Package');
      setColorHex('#1e293b');
      setDepreciationRate('');
      setIsInsuranceCritical(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const hasChildren = !!initialData && availableCategories.some(c => c.parentId === initialData.id);
  const computedSortOrder = initialData
    ? initialData.sortOrder
    : Math.max(0, ...availableCategories.map(c => c.sortOrder || 0)) + 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      parentId: parentId || null,
      canHaveChildren: hasChildren ? true : canHaveChildren,
      iconName,
      colorHex,
      estimatedDepreciationRate: depreciationRate ? parseFloat(depreciationRate) : null,
      isInsuranceCritical,
      sortOrder: computedSortOrder
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Category" : "Add New Category"}
      subtitle="Inventory classification"
      icon={LayoutGrid}
      size="md"
      onPrimaryAction={() =>
        onSave({
          name,
          parentId: parentId || null,
          canHaveChildren: hasChildren ? true : canHaveChildren,
          iconName,
          colorHex,
          estimatedDepreciationRate: depreciationRate ? parseFloat(depreciationRate) : null,
          isInsuranceCritical,
          sortOrder: computedSortOrder,
        })
      }
      primaryActionLabel={initialData ? "Update Category" : "Save Category"}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
        >
          Dismiss
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
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
                {availableCategories
                  .filter(c => c.id !== initialData?.id)
                  .filter(c => (c.canHaveChildren ?? true))
                  .map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allow Sub-categories</p>
                {hasChildren ? (
                  <p className="text-xs font-bold text-slate-500">Locked (this category has children)</p>
                ) : (
                  <p className="text-xs font-bold text-slate-500">Controls whether this category can be used as a parent</p>
                )}
              </div>
              <button
                type="button"
                disabled={hasChildren}
                onClick={() => setCanHaveChildren(v => !v)}
                className={`
                  px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all
                  ${hasChildren ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : (canHaveChildren ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600')}
                `}
              >
                {canHaveChildren ? 'Enabled' : 'Disabled'}
              </button>
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
            <Input 
              label="Depreciation (% / yr)" 
              type="number" 
              step="0.1"
              value={depreciationRate} 
              onChange={(e) => setDepreciationRate(e.target.value)} 
              placeholder="e.g. 15"
            />
          </div>
      </form>
    </Modal>
  );
};

export default InventoryCategoryModal;
