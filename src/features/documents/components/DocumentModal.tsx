
import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Layout, Calendar, Plus, Link, Trash2, Paperclip, HardDrive, User, FolderOpen, Wrench, Shield, Check, MapPin, Box, Layers, Search } from 'lucide-react';
import { Document, Space, InventoryItem, Note, DocumentAttachment, Project, MaintenanceTask, Contact } from "@/types";
import { Input, SectionHeading, Button } from "@/components/ui/UIPrimitives";
import DocumentPreview from "@/features/documents/components/DocumentPreview";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Document>) => void;
  initialData?: Document | null;
  availableSpaces: Space[];
  availableInventory: InventoryItem[];
  availableProjects: Project[];
  availableTasks: MaintenanceTask[];
  availableContacts: Contact[];
}

const CATEGORY_OPTIONS = [
  'Warranty', 'User Manual', 'Receipt', 'Insurance Policy', 'Legal Deed', 'Maintenance Log', 
  'Tax Record', 'Utility Bill', 'Architectural Plan', 'Service Report', 
  'Lease Agreement', 'Property Appraisal', 'Work Permit', 'Inspection Report', 
  'Proof of Residency', 'ID/Identity', 'Financial Statement', 'Survey Map', 'Closing Document', 'Other'
];

const DocumentModal: React.FC<DocumentModalProps> = ({ 
  isOpen, onClose, onSave, initialData, availableSpaces, availableInventory, availableProjects, availableTasks, availableContacts 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Other');
  const [spaceId, setSpaceId] = useState('');
  const [contactId, setContactId] = useState('');
  const [physicalLocation, setPhysicalLocation] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [attachments, setAttachments] = useState<DocumentAttachment[]>([]);
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<string[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [selectedSurfaceIds, setSelectedSurfaceIds] = useState<string[]>([]);

  const activeSpace = availableSpaces.find(s => s.id === spaceId);
  const availableSurfaces = activeSpace?.surfaces || [];

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category || 'Other');
      setSpaceId(initialData.spaceId || '');
      setContactId(initialData.contactId || '');
      setPhysicalLocation(initialData.physicalLocation || '');
      setIsPrivate(initialData.isPrivate || false);
      setExpiryDate(initialData.expiryDate || '');
      setNotes(initialData.notes || []);
      setAttachments(initialData.attachments || []);
      setSelectedInventoryIds(initialData.inventoryItems?.map(i => i.inventoryItemId) || []);
      setSelectedProjectIds(initialData.projectIds || []);
      setSelectedTaskIds(initialData.taskIds || []);
      setSelectedSurfaceIds(initialData.surfaceIds || []);
    } else {
      setTitle('');
      setCategory('Other');
      setSpaceId('');
      setContactId('');
      setPhysicalLocation('');
      setIsPrivate(false);
      setExpiryDate('');
      setNotes([]);
      setAttachments([]);
      setSelectedInventoryIds([]);
      setSelectedProjectIds([]);
      setSelectedTaskIds([]);
      setSelectedSurfaceIds([]);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      category,
      spaceId: spaceId || null,
      contactId: contactId || null,
      physicalLocation: physicalLocation || null,
      isPrivate,
      expiryDate: expiryDate || null,
      notes,
      attachments,
      projectIds: selectedProjectIds,
      taskIds: selectedTaskIds,
      surfaceIds: selectedSurfaceIds,
      inventoryItems: selectedInventoryIds.map(id => ({
        propertyId: initialData?.propertyId || 'p1',
        documentId: initialData?.id || '',
        inventoryItemId: id,
        createdAtUtc: new Date().toISOString()
      })),
      updatedAtUtc: new Date().toISOString()
    });
  };

  const toggleLink = (id: string, list: string[], setter: (val: string[]) => void) => {
    setter(list.includes(id) ? list.filter(i => i !== id) : [...list, id]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments: DocumentAttachment[] = Array.from(files).map((file: File) => ({
      id: Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      contentType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      createdAtUtc: new Date().toISOString(),
      thumbnailUrl: file.type.startsWith('image/') ? `https://images.unsplash.com/photo-1586769852044-692d6e3703a0?auto=format&fit=crop&q=80&w=200` : undefined
    }));
    setAttachments([...attachments, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
        <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
               <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                {initialData ? 'Edit Document' : 'Add New Document'}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Household Records Vault</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12 text-slate-900">
          <section className="space-y-6">
            <SectionHeading label="Basic Information" icon={FileText} />
            <Input autoFocus label="Document Name" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Dishwasher User Manual" required />
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 shadow-inner">
                  {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><User size={10} className="mr-1.5" /> Company / Provider</label>
                <select value={contactId} onChange={(e) => setContactId(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 shadow-inner">
                  <option value="">Choose a contact...</option>
                  {availableContacts.map(c => <option key={c.id} value={c.id}>{c.company || `${c.firstName} ${c.surname}`}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-4 border-t border-slate-50">
            <SectionHeading label="Security & Storage" icon={Shield} />
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200">
              <div className="flex items-start space-x-3">
                <div className={`mt-0.5 p-2 rounded-xl shadow-sm ${isPrivate ? 'bg-[#b45c43] text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Make this document private</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tight">Only primary owners will be able to see this record.</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsPrivate(!isPrivate)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPrivate ? 'bg-[#b45c43]' : 'bg-slate-200'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <Input label="Physical Storage Location" icon={MapPin} value={physicalLocation} onChange={(e) => setPhysicalLocation(e.target.value)} placeholder="e.g. Filing cabinet, shelf A" />
          </section>

          <section className="space-y-6 pt-4 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <SectionHeading label="Files & Documents" icon={Paperclip} />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center shadow-lg"><Plus size={14} className="mr-1.5" /> Upload File</button>
              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {attachments.map(file => (
                <div key={file.id} className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-slate-300 transition-all shadow-sm">
                  <div className="flex items-center space-x-4">
                    <DocumentPreview attachment={file} size="md" />
                    <div>
                      <p className="text-sm font-black text-slate-900 truncate max-w-xs">{file.fileName}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase">{(file.sizeBytes / 1024).toFixed(1)} KB • {file.contentType.split('/')[1]}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setAttachments(attachments.filter(a => a.id !== file.id))} className="p-2 text-slate-300 hover:text-[#b45c43]"><Trash2 size={18} /></button>
                </div>
              ))}
              {attachments.length === 0 && <div className="py-16 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 bg-gray-50/20"><HardDrive size={48} className="mb-3 opacity-10" /><p className="text-[10px] font-black uppercase tracking-widest">No files uploaded</p></div>}
            </div>
          </section>

          <section className="space-y-6 pt-4 border-t border-slate-50">
            <SectionHeading label="Links" icon={Link} />
            <div className="space-y-8">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Layout size={10} className="mr-1.5" /> Link to a Room</label>
                  <select value={spaceId} onChange={(e) => setSpaceId(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 shadow-inner">
                    <option value="">Not linked to a room</option>
                    {availableSpaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
               </div>

               {spaceId && availableSurfaces.length > 0 && (
                 <div className="animate-in slide-in-from-top-2 duration-300">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center"><Layers size={10} className="mr-1.5" /> Specific Surfaces</p>
                    <div className="flex flex-wrap gap-2">
                      {availableSurfaces.map(surf => {
                        const active = selectedSurfaceIds.includes(surf.id);
                        return (
                          <button key={surf.id} type="button" onClick={() => toggleLink(surf.id, selectedSurfaceIds, setSelectedSurfaceIds)} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center space-x-2 ${active ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
                            {active && <Check size={10} />} <span>{surf.surfaceType} ({surf.materialType})</span>
                          </button>
                        );
                      })}
                    </div>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><FolderOpen size={10} className="mr-1.5" /> Link to Projects</p>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-100 rounded-2xl">
                      {availableProjects.map(p => (
                        <button key={p.id} type="button" onClick={() => toggleLink(p.id, selectedProjectIds, setSelectedProjectIds)} className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${selectedProjectIds.includes(p.id) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Wrench size={10} className="mr-1.5" /> Link to Tasks</p>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-100 rounded-2xl">
                      {availableTasks.map(t => (
                        <button key={t.id} type="button" onClick={() => toggleLink(t.id, selectedTaskIds, setSelectedTaskIds)} className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${selectedTaskIds.includes(t.id) ? 'bg-[#a47148] text-white border-[#a47148]' : 'bg-white text-slate-500 border-slate-200'}`}>
                          {t.title}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>

               <div className="space-y-3 pt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Box size={10} className="mr-1.5" /> Link to Household Items</p>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    {availableInventory.map(item => (
                      <button key={item.id} type="button" onClick={() => toggleLink(item.id, selectedInventoryIds, setSelectedInventoryIds)} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center space-x-2 ${selectedInventoryIds.includes(item.id) ? 'bg-[#5a6b5d] text-white border-[#5a6b5d] shadow-sm' : 'bg-white text-slate-500 border-slate-100'}`}>
                        {selectedInventoryIds.includes(item.id) && <Check size={10} />} <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </section>

          <section className="space-y-6 pt-4 border-t border-slate-50">
            <SectionHeading label="Important Dates" icon={Calendar} />
            <div className="grid grid-cols-1">
              <Input label="Expiration Date" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>
          </section>
        </form>

        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50 flex items-center justify-end space-x-4 shrink-0">
          <button onClick={onClose} className="px-8 py-3 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">Dismiss</button>
          <Button onClick={handleSubmit} className="px-10 py-3 text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-2xl active:scale-95 transition-all">
            {initialData ? 'Update Document' : 'Save Document'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
