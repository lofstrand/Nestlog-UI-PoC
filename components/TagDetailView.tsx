
import React from 'react';
import { Tags, BarChart2, Info, Layout, Box, FileText, Wrench, FolderOpen, History } from 'lucide-react';
import { Tag as TagType, Document } from '../types';
import DetailLayout from './DetailLayout';
import NotesSection from './NotesSection';
import AttachmentsSection from './AttachmentsSection';
import { SectionHeading, Badge } from './UIPrimitives';

interface TagDetailViewProps {
  entity: TagType;
  availableTags: TagType[];
  linkedDocuments: Document[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (text: string) => void;
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
  onAddAttachment: () => void;
}

const TagDetailView: React.FC<TagDetailViewProps> = ({ 
  entity, onBack, onEdit, onDelete, onAddNote, linkedDocuments, onAddAttachment 
}) => {
  return (
    <DetailLayout
      title={entity.name}
      typeLabel="Global Index Tag"
      description="Cross-platform classification label used for granular data organization."
      onBack={onBack}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Visual Identity Hero */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 space-y-10 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: entity.colorHex || '#1e293b' }} />
             
             <div className="flex items-center space-x-10">
                <div className="w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-default" style={{ backgroundColor: entity.colorHex || '#1e293b' }}>
                   <Tags size={64} strokeWidth={1.5} />
                </div>
                <div className="space-y-4 flex-1">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Defined Identifier</p>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{entity.name}</h2>
                   </div>
                   <div className="flex items-center space-x-3">
                      <Badge color="text-slate-400" bgColor="bg-slate-50"># {entity.colorHex?.toUpperCase() || 'DEFAULT'}</Badge>
                      <Badge color="text-[#5a6b5d]" bgColor="bg-[#f2f4f2]">Status: Active Index</Badge>
                   </div>
                </div>
             </div>

             <div className="pt-10 border-t border-slate-100 space-y-4">
                <SectionHeading label="Label Intent & Guidelines" icon={Info} />
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                   {entity.description || "No formal usage guidelines have been defined for this index tag. Define constraints to ensure consistent household classification."}
                </p>
             </div>
          </div>

          {/* Usage Intensity Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-slate-900 rounded-[2rem] p-8 space-y-6 shadow-2xl shadow-slate-200">
                <SectionHeading label="Distribution Intensity" icon={BarChart2} color="text-slate-500" />
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-5xl font-black text-white tracking-tighter">{entity.usageCount || 0}</span>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-right leading-tight">Applied Entities<br/>Across System</p>
                   </div>
                   <div className="pt-4 border-t border-slate-800">
                      <p className="text-xs text-slate-400 font-medium leading-relaxed italic">"Frequent usage indicates a high-priority classification pillar for your household."</p>
                   </div>
                </div>
             </div>

             <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-6 shadow-sm">
                <SectionHeading label="Structural Scope" icon={Layout} />
                <div className="space-y-3">
                   {[
                      { label: 'Inventory Assets', icon: Box, count: '-' },
                      { label: 'Documents', icon: FileText, count: entity.documentIds?.length || 0 },
                      { label: 'Service Tasks', icon: Wrench, count: '-' },
                      { label: 'Active Projects', icon: FolderOpen, count: '-' }
                   ].map(cat => (
                      <div key={cat.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-white hover:border-slate-300 transition-all">
                         <div className="flex items-center space-x-3">
                            <cat.icon size={14} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                            <span className="text-xs font-bold text-slate-600">{cat.label}</span>
                         </div>
                         <span className="text-xs font-black text-slate-900">{cat.count}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-12">
          {/* Metadata Context */}
          <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 space-y-6 shadow-inner">
             <SectionHeading label="System Metadata" icon={History} />
             <div className="space-y-4">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Index Domain</p>
                   <p className="text-sm font-bold text-slate-900 tracking-tight">Cross-Property (Global)</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Policy</p>
                   <p className="text-sm font-bold text-slate-900 tracking-tight">Manual Application</p>
                </div>
             </div>
          </div>

          <NotesSection notes={entity.notes || []} onAddNote={onAddNote} />
          <AttachmentsSection linkedDocuments={linkedDocuments} onAddAttachment={onAddAttachment} />
        </div>
      </div>
    </DetailLayout>
  );
};

export default TagDetailView;
