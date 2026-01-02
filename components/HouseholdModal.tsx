
import React, { useState, useEffect } from 'react';
import { X, Home, AlignLeft, Archive, Sparkles, Loader2, Info } from 'lucide-react';
import { Household } from '../types';
import { generateSmartDescription } from '../services/geminiService';

interface HouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Household>) => void;
  initialData?: Household | null;
}

const HouseholdModal: React.FC<HouseholdModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isArchived, setIsArchived] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setIsArchived(initialData.status === 'Inactive');
    } else {
      setName('');
      setDescription('');
      setIsArchived(false);
    }
  }, [initialData, isOpen]);

  const handleMagicGenerate = async () => {
    if (!name) return;
    setIsGenerating(true);
    const suggested = await generateSmartDescription(name);
    if (suggested) setDescription(suggested.trim());
    setIsGenerating(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? 'Edit Household' : 'New Household'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({ name, description, status: isArchived ? 'Inactive' : 'Active' });
        }} className="p-6 space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                <Home size={12} className="mr-1.5" /> Name
              </label>
              <input 
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Highland Manor"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-gray-900"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                  <AlignLeft size={12} className="mr-1.5" /> Description
                </label>
                <button 
                  type="button"
                  onClick={handleMagicGenerate}
                  disabled={!name || isGenerating}
                  className="text-[10px] flex items-center space-x-1 font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:animate-pulse" />}
                  <span>SMART GENERATE</span>
                </button>
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional details about this household..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm text-gray-900 resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 p-1.5 bg-gray-200 text-gray-600 rounded-md">
                  <Archive size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-none">Archived</p>
                  <p className="text-[10px] text-gray-500 mt-1">Hide this household from main workspace lists.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsArchived(!isArchived)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isArchived ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isArchived ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black shadow-lg hover:shadow-gray-200 transition-all active:scale-95"
            >
              {initialData ? 'Update Household' : 'Create Household'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HouseholdModal;
