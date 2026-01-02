
import React, { useState } from 'react';
import { Box, ShoppingCart, Activity, Ruler, Calendar, MapPin, DollarSign, TrendingUp, ShieldCheck, History, Zap, QrCode, Layers, ArrowRight, AlertTriangle } from 'lucide-react';
import { InventoryItem, Tag, Document, InventoryItemStatus, Space, InventoryCategory } from '../types';
import DetailLayout from './DetailLayout';
import NotesSection from './NotesSection';
import TagsSection from './TagsSection';
import AttachmentsSection from './AttachmentsSection';
import InventoryModal from './InventoryModal';
import { SectionHeading, Badge } from './UIPrimitives';

interface InventoryDetailViewProps {
  entity: InventoryItem;
  availableTags: Tag[];
  allInventory: InventoryItem[];
  linkedDocuments: Document[];
  availableSpaces: Space[];
  availableCategories: InventoryCategory[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (text: string) => void;
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
  onAddAttachment: () => void;
  onUpdateEntity: (type: string, id: string, data: any) => void;
  onViewItem?: (id: string) => void;
  onNavigateToEntity?: (type: string, id: string) => void;
}

const InventoryDetailView: React.FC<InventoryDetailViewProps> = ({ 
  entity,
  availableTags,
  allInventory,
  linkedDocuments,
  availableSpaces,
  availableCategories,
  onBack,
  onEdit: _onEdit,
  onDelete,
  onAddNote,
  onAddTag,
  onRemoveTag,
  onAddAttachment,
  onUpdateEntity,
  onViewItem,
  onNavigateToEntity,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const getStatusColor = (s: InventoryItemStatus) => {
    switch (s) {
      case InventoryItemStatus.Excellent: return { color: 'text-[#5a6b5d]', bg: 'bg-[#f2f4f2]', bar: 'bg-[#5a6b5d]', width: '100%' };
      case InventoryItemStatus.Good: return { color: 'text-blue-600', bg: 'bg-blue-50', bar: 'bg-blue-500', width: '80%' };
      case InventoryItemStatus.Fair: return { color: 'text-[#a47148]', bg: 'bg-[#f9f4f0]', bar: 'bg-[#a47148]', width: '50%' };
      default: return { color: 'text-[#b45c43]', bg: 'bg-[#fdf3f0]', bar: 'bg-[#b45c43]', width: '20%' };
    }
  };

  const getEnergyColor = (rating?: string | null) => {
    switch (rating) {
      case 'A': return 'bg-emerald-500';
      case 'B': return 'bg-green-500';
      case 'C': return 'bg-lime-500';
      case 'D': return 'bg-yellow-500';
      case 'E': return 'bg-orange-500';
      case 'F': return 'bg-red-500';
      case 'G': return 'bg-red-700';
      default: return 'bg-slate-200';
    }
  };

  const statusStyles = getStatusColor(entity.status);
  const subItems = allInventory.filter(i => i.parentItemId === entity.id);
  const parentItem = allInventory.find(i => i.id === entity.parentItemId);

  const handleNavigate = (id: string) => {
    if (onNavigateToEntity) {
      onNavigateToEntity('inventory', id);
    } else if (onViewItem) {
      onViewItem(id);
    }
  };

  const handleSaveEdit = (data: Partial<InventoryItem>) => {
    onUpdateEntity('inventory', entity.id, data);
    setIsEditModalOpen(false);
  };

  const confirmDelete = () => {
    onDelete();
    setIsDeleteConfirmOpen(false);
  };

  return (
    <DetailLayout
      title={entity.name}
      typeLabel="Managed Asset"
      description={entity.category || "General property inventory."}
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Kit Hierarchy View */}
          {(parentItem || subItems.length > 0) && (
            <div className="bg-slate-900 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Layers size={120} className="text-white" />
               </div>
               <SectionHeading label="Architectural Hierarchy" icon={Layers} color="text-slate-500" />
               <div className="space-y-4 relative z-10">
                  {parentItem && (
                    <button onClick={() => handleNavigate(parentItem.id)} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-left">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"><Layers size={20} /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Part of Container</p>
                             <p className="text-sm font-bold text-white">{parentItem.name}</p>
                          </div>
                       </div>
                       <ArrowRight size={16} className="text-slate-600" />
                    </button>
                  )}
                  {subItems.length > 0 && (
                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contained Assets ({subItems.length})</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {subItems.map(sub => (
                            <button key={sub.id} onClick={() => handleNavigate(sub.id)} className="flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left group">
                               <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-white transition-colors"><Box size={14} /></div>
                               <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors truncate">{sub.name}</span>
                            </button>
                          ))}
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Status & Lifecycle Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-10 space-y-10 shadow-sm relative overflow-hidden">
             <div className={`absolute top-0 left-0 w-full h-1 ${statusStyles.bar}`} />
             <div className="flex items-center justify-between">
                <SectionHeading label="Lifecycle & Condition" icon={Activity} />
                <div className="flex items-center space-x-3">
                  {entity.qrCodeIdentifier && <Badge color="text-slate-400" bgColor="bg-slate-50"><QrCode size={10} className="mr-1.5" /> {entity.qrCodeIdentifier}</Badge>}
                  <Badge color={statusStyles.color} bgColor={statusStyles.bg}>{entity.status}</Badge>
                </div>
             </div>

             <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                      <span className="text-slate-400">Physical Health index</span>
                      <span className={statusStyles.color}>{statusStyles.width} Structural Integrity</span>
                   </div>
                   <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-1000 ${statusStyles.bar}`} style={{ width: statusStyles.width }} />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                   <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                           <History size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Verified</p>
                           <p className="text-lg font-black text-slate-900 tracking-tight">{entity.lastAuditDateUtc ? new Date(entity.lastAuditDateUtc).toLocaleDateString() : 'Initial Catalog'}</p>
                        </div>
                      </div>
                   </div>
                   {entity.powerWattage && (
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                            <Zap size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energy Performance</p>
                             <div className="flex items-center space-x-2">
                                <span className="text-lg font-black text-slate-900 tracking-tight">{entity.powerWattage}W</span>
                                {entity.energyClass && (
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${getEnergyColor(entity.energyClass)}`}>{entity.energyClass}</span>
                                )}
                             </div>
                          </div>
                        </div>
                      </div>
                   )}
                </div>
             </div>
          </div>

          {/* Specifications Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-10 space-y-8 shadow-sm">
            <SectionHeading label="Asset Specifications" icon={Box} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Level</p>
                    <div className="flex items-baseline space-x-2">
                       <p className="text-2xl font-black text-slate-900 tracking-tight">{entity.quantity}</p>
                       <p className="text-sm font-bold text-slate-400 uppercase">{entity.unit}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Purchased From</p>
                    <div className="flex items-center space-x-2">
                       <ShoppingCart size={14} className="text-slate-300" />
                       <p className="text-lg font-black text-slate-900 tracking-tight">{entity.store || 'Private Sale/Legacy'}</p>
                    </div>
                  </div>
               </div>
               <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Technical Reference</p>
                    <p className="text-sm font-bold text-slate-800">M/N: {entity.modelNumber || 'N/A'}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">S/N: {entity.serialNumber || 'N/A'}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Manufacturer portal</p>
                     {entity.manufacturerUrl ? (
                        <a href={entity.manufacturerUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#5a6b5d] hover:underline flex items-center">
                           Support Page
                        </a>
                     ) : <p className="text-sm font-bold text-slate-300 italic">No link available</p>}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-12">
          {/* Financial Sidebar Card */}
          <div className="bg-slate-900 rounded-2xl p-8 space-y-8 shadow-2xl">
             <SectionHeading label="Financial Valuation" color="text-slate-500" />
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Purchase Price</p>
                      <div className="flex items-center space-x-1.5 text-white font-black text-lg">
                        <DollarSign size={16} className="text-slate-500" />
                        <span>{entity.purchasePrice?.toLocaleString() || '0.00'}</span>
                      </div>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Value</p>
                      <div className="flex items-center justify-end space-x-1.5 text-[#5a6b5d] font-black text-2xl tracking-tight">
                        <TrendingUp size={20} />
                        <span>${entity.value?.toLocaleString() || '0.00'}</span>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-800 space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Procurement metadata</p>
                    <div className="flex items-center text-sm font-bold text-slate-400">
                      <Calendar size={14} className="mr-3 text-[#a47148]" />
                      Acquired: {entity.purchaseDate || 'Unlogged'}
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

      <InventoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={entity}
        availableSpaces={availableSpaces}
        availableCategories={availableCategories}
        allInventory={allInventory}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsDeleteConfirmOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 text-center space-y-8">
              <div className="w-20 h-20 bg-[#fdf3f0] text-[#b45c43] rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Delete Asset?</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Removing <strong>{entity.name}</strong> will permanently delete this inventory record.
                </p>
              </div>
              <div className="flex flex-col space-y-3 pt-2">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 bg-[#b45c43] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#9d4b35] transition-all shadow-xl shadow-[#b45c43]/20 active:scale-[0.98]"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DetailLayout>
  );
};

export default InventoryDetailView;
