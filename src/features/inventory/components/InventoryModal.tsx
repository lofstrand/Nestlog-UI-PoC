
import React, { useState, useEffect } from 'react';
import { Box, MapPin, DollarSign, TrendingUp, Hash, ShoppingCart, Activity, Layers, Zap } from 'lucide-react';
import { InventoryItem, Space, InventoryCategory, InventoryItemStatus } from "@/types";
import { Input, Modal, SectionHeading } from "@/components/ui";
import { usePreferences } from "@/contexts/PreferencesContext";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<InventoryItem>) => void;
  initialData?: InventoryItem | null;
  availableSpaces: Space[];
  availableCategories: InventoryCategory[];
}

const STATUS_OPTIONS = Object.values(InventoryItemStatus);
const ENERGY_CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, onSave, initialData, availableSpaces, availableCategories }) => {
  const formId = "inventory-modal-form";
  const { currencyCode } = usePreferences();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Other');
  const [spaceId, setSpaceId] = useState('');
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
      setImageUrl(initialData.imageUrl || '');
      setCategory(initialData.category);
      setSpaceId(initialData.spaceId || '');
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
      setImageUrl('');
      setCategory(availableCategories[0]?.name || 'Other');
      setSpaceId('');
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
      imageUrl: imageUrl || null,
      category,
      spaceId: spaceId || null,
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit inventory item" : "New inventory item"}
      icon={Box}
      size="lg"
      primaryActionLabel={initialData ? "Update item" : "Create item"}
      primaryActionType="submit"
      formId={formId}
      footer={
        <button
          onClick={onClose}
          type="button"
          className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
        >
          Dismiss
        </button>
      }
    >
        <form id={formId} onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <SectionHeading label="Asset Overview" icon={Box} />
            <Input 
              autoFocus
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Smart LED Television"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
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
              <Input label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Samsung" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Model number" icon={Hash} value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} placeholder="e.g. QN55Q60" />
              <Input label="Serial number" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="e.g. SN-12345" />
            </div>
            <Input label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          </div>

          <div className="space-y-6">
            <SectionHeading label="Energy" icon={Zap} />
            <div className="grid grid-cols-2 gap-6">
              <Input label="Power (W)" type="number" value={powerWattage} onChange={(e) => setPowerWattage(e.target.value)} placeholder="e.g. 150" />
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energy class</label>
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
            <SectionHeading label="Location" icon={MapPin} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Space</label>
                <select 
                  value={spaceId}
                  onChange={(e) => setSpaceId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  <option value="">Unassigned</option>
                  {availableSpaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading label="Stock & Condition" icon={Activity} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Condition</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InventoryItemStatus)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <Input label="Unit" placeholder="pcs" value={unit} onChange={(e) => setUnit(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading label="Procurement & Valuation" icon={ShoppingCart} />
            <div className="grid grid-cols-2 gap-6">
              <Input label="Store" value={store} onChange={(e) => setStore(e.target.value)} placeholder="e.g. IKEA" />
              <Input label="Purchase date" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Input label={`Purchase price (${currencyCode})`} icon={DollarSign} type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
              <Input label={`Value (${currencyCode})`} icon={TrendingUp} type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
          </div>
        </form>
    </Modal>
  );
};

export default InventoryModal;
