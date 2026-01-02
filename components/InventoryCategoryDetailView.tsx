
import React from 'react';
import { LayoutGrid, TrendingDown, ShieldAlert, Layers, ChevronRight, Calculator, ListChecks, ArrowUpCircle } from 'lucide-react';
import { InventoryCategory, Tag, Document } from '../types';
import DetailLayout from './DetailLayout';
import NotesSection from './NotesSection';
import TagsSection from './TagsSection';
import AttachmentsSection from './AttachmentsSection';
import { SectionHeading, Badge } from './UIPrimitives';

interface InventoryCategoryDetailViewProps {
  entity: InventoryCategory;
  availableTags: Tag[];
  availableCategories: InventoryCategory[];
  linkedDocuments: Document[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (text: string) => void;
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
  onAddAttachment: () => void;
}

const InventoryCategoryDetailView: React.FC<InventoryCategoryDetailViewProps> = ({ 
  entity, availableTags, availableCategories, linkedDocuments, onBack, onEdit, onDelete, onAddNote, onAddTag, onRemoveTag, onAddAttachment 
}) => {
  const parent = availableCategories.find(c => c.id === entity.parentId);
  const subCategories = availableCategories.filter(c => c.parentId === entity.id);

  return (
    <DetailLayout
      title={entity.name}
      typeLabel="Asset Taxonomy"
      description="Global classification rules for property inventory and financial depreciation."
      onBack={onBack}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Taxonomy Hierarchy Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-10 space-y-8 shadow-sm">
             <div className="flex items-center justify-between">
                <SectionHeading label="Logical Placement" icon={Layers} />
                <Badge color="text-slate-400" bgColor="bg-slate-50">Sort Rank: {entity.sortOrder}</Badge>
             </div>
             
             <div className="flex items-center space-x-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3 text-slate-400 font-bold text-sm">
                   <ArrowUpCircle size={16} />
                   <span>Root Hierarchy</span>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
                {parent && (
                  <>
                    <span className="text-slate-500 font-bold text-sm">{parent.name}</span>
                    <ChevronRight size={14} className="text-slate-300" />
                  </>
                )}
                <span className="text-slate-900 font-black text-lg tracking-tight underline decoration-slate-300 decoration-4 underline-offset-4">{entity.name}</span>
             </div>

             {subCategories.length > 0 && (
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nested Sub-classifications</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {subCategories.map(sub => (
                        <div key={sub.id} className="flex items-center space-x-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-300 transition-all cursor-pointer group">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                              <LayoutGrid size={14} />
                           </div>
                           <span className="text-sm font-bold text-slate-800">{sub.name}</span>
                        </div>
                      ))}
                   </div>
                </div>
             )}
          </div>

          {/* Financial Profile Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-10 space-y-8 shadow-sm">
             <SectionHeading label="Asset Lifecycle Profile" icon={TrendingDown} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                   <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                         <Calculator size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Annual Depreciation</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">-{entity.estimatedDepreciationRate || '0'}%</p>
                      </div>
                   </div>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">This rate is used as the default baseline for all assets cataloged within this classification to estimate market value over time.</p>
                </div>
                <div className="space-y-4">
                   <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                         <ListChecks size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entity Guidelines</p>
                        <p className="text-lg font-black text-slate-900 tracking-tight">Verified Protocol</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-12">
          {/* Visual Identity Sidebar Card */}
          <div className="bg-slate-900 rounded-2xl p-8 space-y-8 shadow-2xl">
             <SectionHeading label="Audit Context" color="text-slate-500" />
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visual Marker</p>
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-xl" style={{ backgroundColor: entity.colorHex || '#1e293b' }} />
                         <span className="text-xs font-mono text-slate-400">{entity.colorHex}</span>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-800 space-y-6">
                   <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${entity.isInsuranceCritical ? 'bg-[#b45c43] border-[#b45c43] text-white animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        <ShieldAlert size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Insurance Protocol</p>
                        <p className="text-sm font-bold text-white tracking-tight">{entity.isInsuranceCritical ? 'Critical Asset Group' : 'Standard Catalog'}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <TagsSection 
            entityTags={entity.tags || []} 
            availableTags={availableTags} 
            onAddTag={onAddTag} 
            onRemoveTag={onRemoveTag} 
          />
          <NotesSection notes={entity.notes || []} onAddNote={onAddNote} />
          <AttachmentsSection linkedDocuments={linkedDocuments} onAddAttachment={onAddAttachment} />
        </div>
      </div>
    </DetailLayout>
  );
};

export default InventoryCategoryDetailView;
