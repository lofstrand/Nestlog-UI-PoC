
import React from 'react';
import { Paperclip, FileText, ExternalLink, Plus } from 'lucide-react';
import { Document } from '../types';
import DocumentPreview from './DocumentPreview';

interface AttachmentsSectionProps {
  linkedDocuments: Document[];
  onAddAttachment: () => void;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ linkedDocuments, onAddAttachment }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#f2f4f2] text-[#5a6b5d] flex items-center justify-center rounded-xl border border-[#e1e6e1]">
            <Paperclip size={16} />
          </div>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Linked Documents</h3>
        </div>
        <button 
          onClick={onAddAttachment}
          className="p-1.5 text-[#5a6b5d] hover:bg-[#f2f4f2] rounded-xl transition-all active:scale-90"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="space-y-3">
        {linkedDocuments.length > 0 ? (
          linkedDocuments.map((doc) => (
            <div key={doc.id} className="group p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#5a6b5d]/30 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {doc.attachments && doc.attachments.length > 0 ? (
                  <DocumentPreview attachment={doc.attachments[0]} size="sm" className="group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-8 h-8 bg-slate-50 text-slate-400 group-hover:bg-[#f2f4f2] group-hover:text-[#5a6b5d] rounded-lg flex items-center justify-center transition-all border border-transparent group-hover:border-[#e1e6e1]">
                    <FileText size={16} />
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-900 truncate max-w-[140px] tracking-tight">{doc.title}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{doc.category || 'Documentation'}</p>
                </div>
              </div>
              <ExternalLink size={14} className="text-slate-300 group-hover:text-[#5a6b5d] transition-colors" />
            </div>
          ))
        ) : (
          <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 bg-gray-50/20">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">No Documents Linked</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentsSection;
