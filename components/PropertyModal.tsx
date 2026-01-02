
import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, Calendar, Star, Info, Sparkles, Loader2, Archive, Maximize } from 'lucide-react';
import { Property, Address } from '../types';
import { generatePropertyBio } from '../services/geminiService';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Property>) => void;
  initialData?: Property | null;
}

const PROPERTY_TYPES = ['Single Family', 'Condo', 'Townhouse', 'Apartment', 'Cabin', 'Land', 'Other'];

const PropertyModal: React.FC<PropertyModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [propertyType, setPropertyType] = useState('Single Family');
  const [floorArea, setFloorArea] = useState<string>('');
  const [address, setAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    stateOrRegion: '',
    postalCode: '',
    countryCode: 'US'
  });
  const [constructionYear, setConstructionYear] = useState<string>('');
  const [constructionMonth, setConstructionMonth] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIsPrimary(initialData.isPrimaryResidence);
      setIsArchived(initialData.isArchived);
      setAddress(initialData.address);
      setPropertyType(initialData.propertyType || 'Single Family');
      setFloorArea(initialData.floorArea?.toString() || '');
      setConstructionYear(initialData.constructionYear?.toString() || '');
      setConstructionMonth(initialData.constructionMonth?.toString() || '');
    } else {
      setName('');
      setIsPrimary(false);
      setIsArchived(false);
      setAddress({ line1: '', line2: '', city: '', stateOrRegion: '', postalCode: '', countryCode: 'US' });
      setPropertyType('Single Family');
      setFloorArea('');
      setConstructionYear('');
      setConstructionMonth('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            {initialData ? 'Edit Property' : 'New Property'}
            {isPrimary && <Star size={18} className="ml-2 text-amber-500 fill-amber-500" />}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({ 
            name, 
            isPrimaryResidence: isPrimary, 
            isArchived, 
            address,
            propertyType,
            floorArea: floorArea ? parseInt(floorArea) : null,
            constructionYear: constructionYear ? parseInt(constructionYear) : null,
            constructionMonth: constructionMonth ? parseInt(constructionMonth) : null
          });
        }} className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <section className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-600">
                <Building2 size={14} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Identity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Property Name</label>
                <input 
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lakeside Cabin"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 transition-all font-medium text-gray-900"
                  required
                />
              </div>
              <div className="flex items-end pb-1">
                <div className="w-full flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Star size={14} className={isPrimary ? "text-amber-500 fill-amber-500" : "text-gray-400"} />
                    <span className="text-xs font-semibold text-gray-700">Primary Residence</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsPrimary(!isPrimary)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isPrimary ? 'bg-slate-900' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isPrimary ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-600">
                <Maximize size={14} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Technical Attributes</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Property Type</label>
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 text-sm text-gray-900"
                >
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-nowrap">Floor Area (m²)</label>
                <input 
                  type="number"
                  value={floorArea}
                  onChange={(e) => setFloorArea(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 transition-all text-gray-900"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-600">
                <MapPin size={14} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Location</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Address Line 1</label>
                <input 
                  type="text"
                  value={address.line1}
                  onChange={(e) => setAddress({...address, line1: e.target.value})}
                  placeholder="Street address"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 transition-all text-gray-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">City</label>
                  <input 
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 transition-all text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Postal Code</label>
                  <input 
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 transition-all text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-600">
                <Calendar size={14} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Construction Details</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Year Built</label>
                <input 
                  type="number"
                  value={constructionYear}
                  onChange={(e) => setConstructionYear(e.target.value)}
                  placeholder="e.g. 1995"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 transition-all text-gray-900"
                />
              </div>
            </div>
          </section>
        </form>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end space-x-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            Cancel
          </button>
          <button 
            onClick={() => onSave({ 
              name, 
              isPrimaryResidence: isPrimary, 
              isArchived, 
              address,
              propertyType,
              floorArea: floorArea ? parseInt(floorArea) : null,
              constructionYear: constructionYear ? parseInt(constructionYear) : null,
              constructionMonth: constructionMonth ? parseInt(constructionMonth) : null
            })}
            className="px-8 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-black shadow-lg transition-all active:scale-95"
          >
            {initialData ? 'Update Property' : 'Create Property'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
