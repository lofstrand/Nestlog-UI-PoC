
import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Hash, User, DollarSign, Calendar, Plus, Type } from 'lucide-react';
import { InsurancePolicy, Contact, InsurancePolicyType } from "../../types";
import { Input, SectionHeading } from "../ui/UIPrimitives";

interface InsurancePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<InsurancePolicy>) => void;
  initialData?: InsurancePolicy | null;
  availableContacts: Contact[];
  onQuickAddContact?: (data: Partial<Contact>) => Promise<string>;
}

const POLICY_TYPES: InsurancePolicyType[] = [
  'Homeowners', 'Flood', 'Hazard', 'Liability', 'Auto', 
  'Umbrella', 'Jewelry/Valuables', 'Pet', 'Travel', 
  'Art', 'Cyber', 'Life', 'Health', 'Other'
];

const InsurancePolicyModal: React.FC<InsurancePolicyModalProps> = ({ isOpen, onClose, onSave, initialData, availableContacts, onQuickAddContact }) => {
  const [title, setTitle] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [providerId, setProviderId] = useState('');
  const [type, setType] = useState<InsurancePolicyType>('Homeowners');
  const [premium, setPremium] = useState('');
  const [deductible, setDeductible] = useState('');
  const [coverageLimit, setCoverageLimit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [renewalDate, setRenewalDate] = useState('');

  // Quick Add State
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickCarrierName, setQuickCarrierName] = useState('');
  const [isProcessingQuickAdd, setIsProcessingQuickAdd] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setPolicyNumber(initialData.policyNumber);
      setProviderId(initialData.providerId);
      setType(initialData.type);
      setPremium(initialData.premium.toString());
      setDeductible(initialData.deductible.toString());
      setCoverageLimit(initialData.coverageLimit.toString());
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setRenewalDate(initialData.renewalDate);
    } else {
      setTitle('');
      setPolicyNumber('');
      setProviderId('');
      setType('Homeowners');
      setPremium('');
      setDeductible('');
      setCoverageLimit('');
      setStartDate('');
      setEndDate('');
      setRenewalDate('');
    }
    setIsQuickAdding(false);
    setQuickCarrierName('');
  }, [initialData, isOpen]);

  const handleQuickAdd = async () => {
    if (!quickCarrierName.trim() || !onQuickAddContact) return;
    setIsProcessingQuickAdd(true);
    try {
      const newId = await onQuickAddContact({
        company: quickCarrierName.trim(),
        firstName: quickCarrierName.trim(),
        surname: 'Carrier',
        category: 'Other',
        specialties: ['Insurance']
      });
      setProviderId(newId);
      setIsQuickAdding(false);
      setQuickCarrierName('');
    } catch (e) {
      console.error("Failed to quick add carrier", e);
    } finally {
      setIsProcessingQuickAdd(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      policyNumber,
      providerId,
      type,
      premium: parseFloat(premium) || 0,
      deductible: parseFloat(deductible) || 0,
      coverageLimit: parseFloat(coverageLimit) || 0,
      startDate,
      endDate,
      renewalDate
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">
            {initialData ? 'Edit Policy' : 'Add New Policy'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-6">
            <SectionHeading label="Policy Identity" icon={ShieldCheck} />
            <Input label="Descriptive Title" icon={Type} value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Stockholm Penthouse Primary" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy Category</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  {POLICY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Input label="Policy ID / Number" icon={Hash} value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} required />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><User size={10} className="mr-1.5" /> Insurance Carrier</label>
                {!isQuickAdding && (
                   <button 
                    type="button"
                    onClick={() => setIsQuickAdding(true)}
                    className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors flex items-center"
                   >
                     <Plus size={10} className="mr-1" /> Quick Add Carrier
                   </button>
                )}
              </div>

              {isQuickAdding ? (
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-indigo-600 uppercase">New Carrier Identity</p>
                    <button type="button" onClick={() => setIsQuickAdding(false)}><X size={12} className="text-indigo-400" /></button>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      placeholder="e.g. Trygg-Hansa"
                      value={quickCarrierName}
                      onChange={(e) => setQuickCarrierName(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
                    />
                    <button 
                      type="button"
                      disabled={!quickCarrierName.trim() || isProcessingQuickAdd}
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
                  <option value="">Select Carrier...</option>
                  {availableContacts.map(c => <option key={c.id} value={c.id}>{c.company || `${c.firstName} ${c.surname}`}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading label="Financial Parameters" icon={DollarSign} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Monthly Premium" icon={DollarSign} type="number" step="0.01" value={premium} onChange={(e) => setPremium(e.target.value)} required />
              <Input label="Deductible" icon={DollarSign} type="number" step="0.01" value={deductible} onChange={(e) => setDeductible(e.target.value)} required />
            </div>
            <Input label="Total Coverage Limit" icon={DollarSign} type="number" step="0.01" value={coverageLimit} onChange={(e) => setCoverageLimit(e.target.value)} required />
          </div>

          <div className="space-y-6">
            <SectionHeading label="Temporal Context" icon={Calendar} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              <Input label="Next Renewal" type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} required />
            </div>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end space-x-3 shrink-0">
          <button onClick={onClose} type="button" className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Dismiss</button>
          <button onClick={handleSubmit} type="button" className="px-8 py-2.5 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95">
            {initialData ? 'Update Policy' : 'Save Policy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsurancePolicyModal;
