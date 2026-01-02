
import React, { useState, useEffect } from 'react';
import { X, Package, Tag, Layout, Calendar, DollarSign, TrendingUp, Hash, Tag as BrandIcon, ShoppingCart, Activity, Ruler, Layers, Zap, QrCode } from 'lucide-react';
import { InventoryItem, Space, InventoryCategory, InventoryItemStatus } from '../types';
import { Input, SectionHeading } from './UIPrimitives';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<InventoryItem>) => void;
  initialData?: InventoryItem | null;
  availableSpaces: Space[];
  availableCategories: InventoryCategory[];
  allInventory: InventoryItem[];
}

const STATUS_OPTIONS = Object.values(InventoryItemStatus);
const ENERGY_CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, onSave, initialData, availableSpaces, availableCategories, allInventory }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [qrCodeIdentifier, setQrCodeIdentifier] = useState('');
  const [category, setCategory] = useState('Other');
  const [spaceId, setSpaceId] = useState('');
  const [parentItemId, setParentItemId] = useState('');
  const [status, setStatus] = useState<InventoryItemStatus>(InventoryItemStatus.Good);
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('pcs');
  const [store, setStore] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [value, setValue] = useState('');
  const [powerWattage, setPowerWattage] = useState('');
  const [energyClass, setEnergyClass] = useState<typeof ENERGY_CLASSES[number] | ''>('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setBrand(initialData.brand || '');
      setModelNumber(initialData.modelNumber || '');
      setSerialNumber(initialData.serialNumber || '');
      setQrCodeIdentifier(initialData.qrCodeIdentifier || '');
      setCategory(initialData.category);
      setSpaceId(initialData.spaceId || '');
      setParentItemId(initialData.parentItemId || '');
      setStatus(initialData.status || InventoryItemStatus.Good);
      setQuantity(initialData.quantity?.toString() || '1');
      setUnit(initialData.unit || 'pcs');
      setStore(initialData.store || '');
      setPurchaseDate(initialData.purchaseDate || '');
      setPurchasePrice(initialData.purchasePrice?.toString() || '');
      setValue(initialData.value?.toString() || '');
      setPowerWattage(initialData.powerWattage?.toString() || '');
      setEnergyClass(initialData.energyClass || '');
    } else {
      setName('');
      setBrand('');
      setModelNumber('');
      setSerialNumber('');
      setQrCodeIdentifier('');
      setCategory(availableCategories[0]?.name || 'Other');
      setSpaceId('');
      setParentItemId('');
      setStatus(InventoryItemStatus.Good);
      setQuantity('1');
      setUnit('pcs');
      setStore('');
      setPurchaseDate('');
      setPurchasePrice('');
      setValue('');
      setPowerWattage('');
      setEnergyClass('');
    }
  }, [initialData, isOpen, availableCategories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      brand,
      modelNumber,
      serialNumber,
      qrCodeIdentifier: qrCodeIdentifier || null,
      category,
      spaceId: spaceId || null,
      parentItemId: parentItemId || null,
      status,
      quantity: parseInt(quantity) || 1,
      unit,
      store: store || null,
      purchaseDate: purchaseDate || null,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
      value: value ? parseFloat(value) : null,
      powerWattage: powerWattage ? parseFloat(powerWattage) : null,
      energyClass: (energyClass as any) || null,
      updatedAtUtc: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">
            {initialData ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-6">
            <SectionHeading label="Core Identity" icon={Package} />
            <Input 
              autoFocus
              label="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Smart LED Television"
              required
            />
            <div className="grid grid-cols-2 gap-6">
              <Input label="Brand / Manufacturer" icon={BrandIcon} value={brand} onChange={(e) => setBrand(e.target.value)} />
              <Input label="Model Reference" icon={Hash} value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} />
            </div>
            <Input label="Physical ID (QR/Barcode)" icon={QrCode} value={qrCodeIdentifier} onChange={(e) => setQrCodeIdentifier(e.target.value)} placeholder="e.g. ASSET-001" />
          </div>

          <div className="space-y-6">
            <SectionHeading label="Sustainability & Energy" icon={Zap} />
            <div className="grid grid-cols-2 gap-6">
              <Input label="Power Load (Watts)" type="number" value={powerWattage} onChange={(e) => setPowerWattage(e.target.value)} placeholder="e.g. 150" />
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energy Rating</label>
                <select 
                  value={energyClass}
                  onChange={(e) => setEnergyClass(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  <option value="">Unknown</option>
                  {ENERGY_CLASSES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading label="Architectural Placement" icon={Layers} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Physical Room</label>
                <select 
                  value={spaceId}
                  onChange={(e) => setSpaceId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  <option value="">Unassigned</option>
                  {availableSpaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contained In (Parent)</label>
                <select 
                  value={parentItemId}
                  onChange={(e) => setParentItemId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  <option value="">Standalone / Container Root</option>
                  {allInventory.filter(i => i.id !== initialData?.id).map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                   <Activity size={10} className="mr-1.5" /> Functional Status
                </label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InventoryItemStatus)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Stock Qty" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <Input label="Unit Type" placeholder="pcs" value={unit} onChange={(e) => setUnit(e.target.value)} />
              </div>
          </div>

          <div className="space-y-6">
            <SectionHeading label="History & Taxonomy" icon={ShoppingCart} />
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input label="Acquisition Date" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Input label="Initial Cost" icon={DollarSign} type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
              <Input label="Current Value" icon={TrendingUp} type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end space-x-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Dismiss</button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95">
            {initialData ? 'Update Item' : 'Save Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
