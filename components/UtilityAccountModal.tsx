
import React, { useState, useEffect } from 'react';
import { X, Zap, Hash, User, DollarSign, Calendar, Layout, Info, Plus, Type, Calculator, Settings2 } from 'lucide-react';
import { UtilityAccount, Contact, Space } from '../types';
import { Input, SectionHeading } from './UIPrimitives';

interface UtilityAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<UtilityAccount>) => void;
  initialData?: UtilityAccount | null;
  availableContacts: Contact[];
  availableSpaces: Space[];
  onQuickAddContact?: (data: Partial<Contact>) => Promise<string>;
}

const UTILITY_TYPES = [
  'Electricity', 'Water', 'Gas', 'Heating', 'Cooling', 
  'Trash/Recycling', 'Waste', 'Internet', 'Mobile', 
  'Phone', 'Security', 'Solar', 'Cable TV', 'Other'
] as const;

const UtilityAccountModal: React.FC<UtilityAccountModalProps> = ({ isOpen, onClose, onSave, initialData, availableContacts, availableSpaces, onQuickAddContact }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<UtilityAccount['type']>('Electricity');
  const [providerId, setProviderId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [averageMonthlyCost, setAverageMonthlyCost] = useState('');
  const [useCalculatedAverage, setUseCalculatedAverage] = useState(false);
  const [lastPaymentDate, setLastPaymentDate] = useState('');
  const [spaceId, setSpaceId] = useState('');

  // Quick Add State
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickProviderName, setQuickProviderName] = useState('');
  const [isProcessingQuickAdd, setIsProcessingQuickAdd] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setType(initialData.type);
      setProviderId(initialData.providerId);
      setAccountNumber(initialData.accountNumber);
      setAverageMonthlyCost(initialData.averageMonthlyCost.toString());
      setUseCalculatedAverage(initialData.useCalculatedAverage || false);
      setLastPaymentDate(initialData.lastPaymentDate || '');
      setSpaceId(initialData.spaceId || '');
    } else {
      setTitle('');
      setType('Electricity');
      setProviderId('');
      setAccountNumber('');
      setAverageMonthlyCost('');
      setUseCalculatedAverage(false);
      setLastPaymentDate('');
      setSpaceId('');
    }
    setIsQuickAdding(false);
    setQuickProviderName('');
  }, [initialData, isOpen]);

  const handleQuickAdd = async () => {
    if (!quickProviderName.trim() || !onQuickAddContact) return;
    setIsProcessingQuickAdd(true);
    try {
      const newId = await onQuickAddContact({
        company: quickProviderName.trim(),
        firstName: quickProviderName.trim(),
        surname: 'Provider',
        category: 'Vendor',
        specialties: [type]
      });
      setProviderId(newId);
      setIsQuickAdding(false);
      setQuickProviderName('');
    } catch (e) {
      console.error("Failed to quick add provider", e);
    } finally {
      setIsProcessingQuickAdd(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      type,
      providerId,
      accountNumber,
      averageMonthlyCost: parseFloat(averageMonthlyCost) || 0,
      useCalculatedAverage,
      lastPaymentDate: lastPaymentDate || null,
      spaceId: spaceId || null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">
            {initialData ? 'Edit Utility' : 'Add New Utility'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-6">
            <SectionHeading label="Service Definition" icon={Zap} />
            <Input label="Descriptive Title" icon={Type} value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Primary Residence Power" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Category</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  {UTILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Input label="Account Designation" icon={Hash} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required placeholder="e.g. 99-821-X" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><User size={10} className="mr-1.5" /> Service Provider</label>
                {!isQuickAdding && (
                   <button 
                    type="button"
                    onClick={() => setIsQuickAdding(true)}
                    className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors flex items-center"
                   >
                     <Plus size={10} className="mr-1" /> Quick Add Provider
                   </button>
                )}
              </div>

              {isQuickAdding ? (
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-indigo-600 uppercase">New Provider Identity</p>
                    <button type="button" onClick={() => setIsQuickAdding(false)}><X size={12} className="text-indigo-400" /></button>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      placeholder="e.g. Vattenfall"
                      value={quickProviderName}
                      onChange={(e) => setQuickProviderName(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
                    />
                    <button 
                      type="button"
                      disabled={!quickProviderName.trim() || isProcessingQuickAdd}
                      onClick={handleQuickAdd}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isProcessingQuickAdd ? '...' : 'Register'}
                    </button>
                  </div>
                </div>
              ) : (
                <select 
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  <option value="">Select Provider...</option>
                  {availableContacts.map(c => <option key={c.id} value={c.id}>{c.company || `${c.firstName} ${c.surname}`}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading label="Financial Oversight" icon={DollarSign} />
            
            <div className="p-5 bg-slate-900 rounded-[1.5rem] space-y-5 shadow-xl">
               <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center"><Calculator size={12} className="mr-2" /> Burn Calculation Mode</p>
                  <button 
                    type="button"
                    onClick={() => setUseCalculatedAverage(!useCalculatedAverage)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useCalculatedAverage ? 'bg-[#5a6b5d]' : 'bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useCalculatedAverage ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className={`text-[10px] font-black uppercase ${!useCalculatedAverage ? 'text-white' : 'text-slate-600'}`}>Static Entry</p>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="number" 
                        step="0.01" 
                        value={averageMonthlyCost} 
                        onChange={(e) => setAverageMonthlyCost(e.target.value)} 
                        disabled={useCalculatedAverage}
                        className={`w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5a6b5d]/30 transition-all ${!useCalculatedAverage ? 'text-white' : 'text-slate-600 opacity-50'}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className={`text-[10px] font-black uppercase ${useCalculatedAverage ? 'text-white' : 'text-slate-600'}`}>Rolling Avg.</p>
                    <div className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-slate-400 flex items-center">
                      {useCalculatedAverage ? 'Auto-Calculated' : 'Disabled'}
                    </div>
                  </div>
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">
                 "Calculated Mode" uses the ledger history on the detail page to determine your average burn rate automatically.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <Input label="Last Bill Payment" type="date" value={lastPaymentDate} onChange={(e) => setLastPaymentDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading label="Infrastructure link" icon={Layout} />
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Info size={10} className="mr-1.5" /> Meter Location</label>
              <select 
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
              >
                <option value="">Unknown / External</option>
                {availableSpaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end space-x-3 shrink-0">
          <button onClick={onClose} type="button" className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Dismiss</button>
          <button onClick={handleSubmit} type="button" className="px-8 py-2.5 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95">
            {initialData ? 'Update Utility' : 'Save Utility'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UtilityAccountModal;
