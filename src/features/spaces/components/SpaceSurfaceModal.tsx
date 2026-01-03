
import React, { useState, useEffect } from 'react';
import { X, Layers, Box, Tag, Palette, StickyNote, Check, Ruler, Activity, Calendar, Search, Link, FileText, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { SpaceSurface, SpaceSurfaceType, SpaceSurfaceMaterialType, Document, SurfaceCondition } from "@/types";
import { SectionHeading, Input, Button } from "@/components/ui/UIPrimitives";

interface SpaceSurfaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<SpaceSurface>) => void;
  initialData?: SpaceSurface | null;
  availableDocuments: Document[];
  onQuickUploadDoc?: (title: string, file: any) => Promise<string>;
}

const CONDITION_OPTIONS = Object.values(SurfaceCondition);

const SpaceSurfaceModal: React.FC<SpaceSurfaceModalProps> = ({ 
  isOpen, onClose, onSave, initialData, availableDocuments, onQuickUploadDoc 
}) => {
  const [surfaceType, setSurfaceType] = useState<SpaceSurfaceType>(SpaceSurfaceType.Unknown);
  const [materialType, setMaterialType] = useState<SpaceSurfaceMaterialType>(SpaceSurfaceMaterialType.Unknown);
  const [brand, setBrand] = useState('');
  const [colorName, setColorName] = useState('');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState<'m2' | 'ft2'>('m2');
  const [condition, setCondition] = useState<SurfaceCondition>(SurfaceCondition.Excellent);
  const [installedDate, setInstalledDate] = useState('');
  const [lastMaintainedDate, setLastMaintainedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  
  // UX State
  const [docSearch, setDocSearch] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSurfaceType(initialData.surfaceType);
      setMaterialType(initialData.materialType);
      setBrand(initialData.brand || '');
      setColorName(initialData.colorName || '');
      setArea(initialData.area?.toString() || '');
      setAreaUnit(initialData.areaUnit || 'm2');
      setCondition(initialData.condition || SurfaceCondition.Excellent);
      setInstalledDate(initialData.installedDateUtc?.split('T')[0] || '');
      setLastMaintainedDate(initialData.lastMaintainedDateUtc?.split('T')[0] || '');
      setNotes(initialData.notes?.[0]?.text || '');
      setSelectedDocumentIds(initialData.documentIds || []);
    } else {
      resetForm();
    }
    setDocSearch('');
    setShowUploadForm(false);
  }, [initialData, isOpen]);

  const resetForm = () => {
    setSurfaceType(SpaceSurfaceType.Unknown);
    setMaterialType(SpaceSurfaceMaterialType.Unknown);
    setBrand('');
    setColorName('');
    setArea('');
    setAreaUnit('m2');
    setCondition(SurfaceCondition.Excellent);
    setInstalledDate('');
    setLastMaintainedDate('');
    setNotes('');
    setSelectedDocumentIds([]);
  };

  const handleQuickUpload = async () => {
    if (!newDocTitle.trim() || !onQuickUploadDoc) return;
    setIsUploading(true);
    try {
      const newId = await onQuickUploadDoc(newDocTitle, null);
      setSelectedDocumentIds(prev => [...prev, newId]);
      setNewDocTitle('');
      setShowUploadForm(false);
    } catch (error) {
      console.error("Quick upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleDocument = (id: string) => {
    setSelectedDocumentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    setDocSearch('');
  };

  const linkedDocs = availableDocuments.filter(doc => selectedDocumentIds.includes(doc.id));
  const searchResults = docSearch.trim() === '' ? [] : 
    availableDocuments.filter(doc => 
      !selectedDocumentIds.includes(doc.id) && 
      doc.title.toLowerCase().includes(docSearch.toLowerCase())
    ).slice(0, 5);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
            {initialData ? 'Edit Surface Registry' : 'New Surface'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({ 
            surfaceType, materialType, brand, colorName,
            area: area ? parseFloat(area) : null,
            areaUnit, condition,
            installedDateUtc: installedDate ? new Date(installedDate).toISOString() : null,
            lastMaintainedDateUtc: lastMaintainedDate ? new Date(lastMaintainedDate).toISOString() : null,
            notes: notes ? [{ id: Math.random().toString(36).substr(2, 9), text: notes, createdAtUtc: new Date().toISOString() }] : [],
            documentIds: selectedDocumentIds
          });
        }} className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Layers size={10} className="mr-1.5" /> Component Class</label>
              <select value={surfaceType} onChange={(e) => setSurfaceType(e.target.value as SpaceSurfaceType)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 shadow-inner">
                {(Object.values(SpaceSurfaceType) as string[]).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Box size={10} className="mr-1.5" /> Material Domain</label>
              <select value={materialType} onChange={(e) => setMaterialType(e.target.value as SpaceSurfaceMaterialType)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 shadow-inner">
                {(Object.values(SpaceSurfaceMaterialType) as string[]).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Ruler size={10} className="mr-1.5" /> Area Density</label>
              <div className="flex space-x-2">
                <input type="number" step="0.1" value={area} onChange={(e) => setArea(e.target.value)} placeholder="0.0" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 shadow-inner" />
                <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value as any)} className="px-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black uppercase"><option value="m2">m²</option><option value="ft2">ft²</option></select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Activity size={10} className="mr-1.5" /> Health State</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value as SurfaceCondition)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 shadow-inner">
                {CONDITION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between px-1">
              <SectionHeading label="Linked Documents" icon={Link} />
              {!showUploadForm && (
                <button 
                  type="button" 
                  onClick={() => setShowUploadForm(true)}
                  className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center space-x-1 hover:text-indigo-700 transition-colors"
                >
                  <Plus size={10} /> <span>Quick Upload</span>
                </button>
              )}
            </div>

            {showUploadForm ? (
              <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-[1.5rem] space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Inline Document Entry</p>
                  <button type="button" onClick={() => setShowUploadForm(false)} className="text-indigo-400 hover:text-indigo-600 transition-colors"><X size={14} /></button>
                </div>
                <Input 
                  autoFocus
                  label="Document Title" 
                  value={newDocTitle} 
                  onChange={(e) => setNewDocTitle(e.target.value)} 
                  placeholder="e.g. Countertop Care Guide" 
                />
                <div className="flex items-center justify-end space-x-3">
                   <button type="button" onClick={() => setShowUploadForm(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Abort</button>
                   <Button size="sm" onClick={handleQuickUpload} disabled={isUploading || !newDocTitle.trim()}>
                    {isUploading ? 'Finalizing...' : 'Save & Link'}
                   </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative group">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <input 
                    type="text" value={docSearch} onChange={(e) => setDocSearch(e.target.value)} 
                    placeholder="Search documents by title..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner" 
                  />
                  {docSearch && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-20 overflow-hidden divide-y divide-slate-50">
                      {searchResults.map(doc => (
                        <button key={doc.id} type="button" onClick={() => toggleDocument(doc.id)} className="w-full p-3 flex items-center space-x-3 hover:bg-slate-50 text-left transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><FileText size={14} /></div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-900 truncate">{doc.title}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{doc.category || 'Document'}</p>
                          </div>
                          <Plus size={14} className="text-indigo-600" />
                        </button>
                      ))}
                      {searchResults.length === 0 && <div className="p-4 text-center text-[10px] text-slate-400 font-bold italic">No documents found matching "{docSearch}"</div>}
                    </div>
                  )}
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {linkedDocs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm group hover:border-slate-200 transition-all">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                          <FileText size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate tracking-tight">{doc.title}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{doc.category || 'Documentation'}</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => toggleDocument(doc.id)} 
                        className="p-2 text-slate-300 hover:text-[#b45c43] hover:bg-[#fdf3f0] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Unlink document"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {linkedDocs.length === 0 && !docSearch && (
                    <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-[1.5rem] bg-slate-50/50">
                      <FileText size={24} className="mx-auto text-slate-200 mb-2 opacity-50" />
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">No documents linked</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><StickyNote size={10} className="mr-1.5" /> Technical Notes</label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="e.g. Specific cleaning chemicals, paint code nuances, or warranty details..." 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 shadow-inner resize-none focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all" 
              rows={3} 
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Dismiss</button>
            <button type="submit" className="px-8 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-xl active:scale-95 transition-all">
              {initialData ? 'Update Surface' : 'Create Surface'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpaceSurfaceModal;
