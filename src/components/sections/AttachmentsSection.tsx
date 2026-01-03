
import React, { useMemo, useState } from "react";
import { Paperclip, FileText, ExternalLink, Plus, X } from "lucide-react";
import { Document } from "../../types";
import DocumentPreview from "./DocumentPreview";

interface AttachmentsSectionProps {
  linkedDocuments: Document[];
  onAddAttachment: () => void;
  availableDocuments?: Document[];
  explicitDocumentIds?: string[];
  onLinkDocument?: (documentId: string) => void;
  onUnlinkDocument?: (documentId: string) => void;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  linkedDocuments,
  onAddAttachment,
  availableDocuments = [],
  explicitDocumentIds = [],
  onLinkDocument,
  onUnlinkDocument,
}) => {
  const [isLinking, setIsLinking] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const linkableDocs = useMemo(() => {
    const linkedIds = new Set(linkedDocuments.map((d) => d.id));
    return availableDocuments.filter((d) => !linkedIds.has(d.id));
  }, [availableDocuments, linkedDocuments]);

  const handleLink = () => {
    if (!onLinkDocument) return;
    if (!selectedId) return;
    onLinkDocument(selectedId);
    setSelectedId("");
    setIsLinking(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#f2f4f2] text-[#5a6b5d] flex items-center justify-center rounded-xl border border-[#e1e6e1]">
            <Paperclip size={16} />
          </div>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Linked Documents</h3>
        </div>
        {onLinkDocument ? (
          <button
            onClick={() => setIsLinking(true)}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight bg-white border border-dashed border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all shadow-sm"
          >
            <Plus size={12} className="mr-1.5" /> Link
          </button>
        ) : (
          <button
            onClick={onAddAttachment}
            className="p-1.5 text-[#5a6b5d] hover:bg-[#f2f4f2] rounded-xl transition-all active:scale-90"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {isLinking && onLinkDocument && (
        <div className="flex items-center gap-2 animate-in zoom-in-95 duration-200">
          <select
            autoFocus
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            onBlur={() => {
              if (!selectedId) setIsLinking(false);
            }}
            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 bg-white shadow-inner"
          >
            <option value="">Select a document...</option>
            {linkableDocs.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title} ({doc.id})
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!selectedId}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleLink}
            className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight bg-slate-900 text-white border border-slate-900 hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Link
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setIsLinking(false);
              setSelectedId("");
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 transition-all"
          >
            <X size={14} />
          </button>
        </div>
      )}

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
              <div className="flex items-center gap-2">
                {onUnlinkDocument && explicitDocumentIds.includes(doc.id) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnlinkDocument(doc.id);
                    }}
                    className="p-1.5 rounded-xl text-slate-300 hover:text-[#b45c43] hover:bg-[#fdf3f0] transition-all"
                    title="Unlink"
                  >
                    <X size={14} />
                  </button>
                )}
                <ExternalLink size={14} className="text-slate-300 group-hover:text-[#5a6b5d] transition-colors" />
              </div>
            </div>
          ))
        ) : (
          <div className="py-5 px-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 bg-gray-50/20">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">No Documents Linked</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentsSection;
