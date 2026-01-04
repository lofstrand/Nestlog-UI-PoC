
import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Calendar, Star, Info, Archive, Maximize } from 'lucide-react';
import { Property, Address } from "@/types";
import { Modal } from "@/components/ui";

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Property>) => void;
  initialData?: Property | null;
}

const PROPERTY_TYPES = ['Single Family', 'Condo', 'Townhouse', 'Apartment', 'Cabin', 'Land', 'Other'];

const PropertyModal: React.FC<PropertyModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const formId = "property-modal-form";
  const [name, setName] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [propertyType, setPropertyType] = useState('Single Family');
  const [floorArea, setFloorArea] = useState<string>('');
  const [unitSystem, setUnitSystem] = useState<"" | "metric" | "imperial">("");
  const [currencyCode, setCurrencyCode] = useState<"" | "SEK" | "EUR" | "USD">("");
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
      setUnitSystem(initialData.unitSystem || "");
      setCurrencyCode(initialData.currencyCode || "");
      setConstructionYear(initialData.constructionYear?.toString() || '');
      setConstructionMonth(initialData.constructionMonth?.toString() || '');
    } else {
      setName('');
      setIsPrimary(false);
      setIsArchived(false);
      setAddress({ line1: '', line2: '', city: '', stateOrRegion: '', postalCode: '', countryCode: 'US' });
      setPropertyType('Single Family');
      setFloorArea('');
      setUnitSystem("");
      setCurrencyCode("");
      setConstructionYear('');
      setConstructionMonth('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      name, 
      isPrimaryResidence: isPrimary, 
      isArchived, 
      address,
      unitSystem: unitSystem || undefined,
      currencyCode: currencyCode || undefined,
      propertyType,
      floorArea: floorArea ? parseInt(floorArea) : null,
      constructionYear: constructionYear ? parseInt(constructionYear) : null,
      constructionMonth: constructionMonth ? parseInt(constructionMonth) : null
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Property" : "New Property"}
      icon={Building2}
      size="lg"
      primaryActionLabel={initialData ? "Update Property" : "Create Property"}
      primaryActionType="submit"
      formId={formId}
      footer={
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          type="button"
        >
          Cancel
        </button>
      }
    >
        <form id={formId} onSubmit={handleSubmit} className="space-y-8">
          
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
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Unit system</label>
                <select
                  value={unitSystem}
                  onChange={(e) => setUnitSystem(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 text-sm text-gray-900"
                >
                  <option value="">Inherit</option>
                  <option value="metric">Metric (m², °C)</option>
                  <option value="imperial">Imperial (ft², °F)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Currency</label>
                <select
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 text-sm text-gray-900"
                >
                  <option value="">Inherit</option>
                  <option value="SEK">Swedish Krona (SEK)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">US Dollar (USD)</option>
                </select>
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
    </Modal>
  );
};

export default PropertyModal;
