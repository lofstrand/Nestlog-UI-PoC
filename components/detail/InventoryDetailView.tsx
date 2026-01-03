import React, { useState } from "react";
import {
  Box,
  ShoppingCart,
  Activity,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  History,
  Zap,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import {
  InventoryItem,
  Tag,
  Document,
  InventoryItemStatus,
  Space,
  InventoryCategory,
} from "../../types";
import DetailLayout from "../layout/DetailLayout";
import NotesSection from "../sections/NotesSection";
import TagsSection from "../sections/TagsSection";
import AttachmentsSection from "../sections/AttachmentsSection";
import InventoryModal from "../modals/InventoryModal";
import SystemMetadataCard from "../sections/SystemMetadataCard";
import { SectionHeading, Badge, DynamicIcon } from "../ui/UIPrimitives";

interface InventoryDetailViewProps {
  entity: InventoryItem;
  availableTags: Tag[];
  allInventory: InventoryItem[];
  linkedDocuments: Document[];
  allDocuments?: Document[];
  availableSpaces: Space[];
  availableCategories: InventoryCategory[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (text: string) => void;
  onUpdateNote?: (noteId: string, text: string) => void;
  onDeleteNote?: (noteId: string) => void;
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
  allDocuments = [],
  availableSpaces,
  availableCategories,
  onBack,
  onEdit: _onEdit,
  onDelete,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddTag,
  onRemoveTag,
  onAddAttachment,
  onUpdateEntity,
  onViewItem,
  onNavigateToEntity,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleLinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (current.includes(documentId)) return;
    onUpdateEntity("inventory", entity.id, {
      documentIds: [...current, documentId],
      updatedAtUtc: new Date().toISOString(),
    });
  };

  const handleUnlinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (!current.includes(documentId)) return;
    onUpdateEntity("inventory", entity.id, {
      documentIds: current.filter((id) => id !== documentId),
      updatedAtUtc: new Date().toISOString(),
    });
  };

  const getStatusStyles = (s: InventoryItemStatus) => {
    switch (s) {
      case InventoryItemStatus.Excellent:
        return {
          color: "text-[#5a6b5d]",
          bg: "bg-[#f2f4f2]",
          border: "border-[#e1e6e1]",
        };
      case InventoryItemStatus.Good:
        return {
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100",
        };
      case InventoryItemStatus.Fair:
        return {
          color: "text-[#a47148]",
          bg: "bg-[#f9f4f0]",
          border: "border-[#f1e6df]",
        };
      default:
        return {
          color: "text-[#b45c43]",
          bg: "bg-[#fdf3f0]",
          border: "border-[#f9dad3]",
        };
    }
  };

  const getEnergyBadgeStyles = (rating?: string | null) => {
    switch (rating) {
      case "A":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "B":
        return "text-green-600 bg-green-50 border-green-100";
      case "C":
        return "text-lime-600 bg-lime-50 border-lime-100";
      case "D":
        return "text-yellow-700 bg-yellow-50 border-yellow-100";
      case "E":
        return "text-orange-600 bg-orange-50 border-orange-100";
      case "F":
        return "text-red-600 bg-red-50 border-red-100";
      case "G":
        return "text-red-700 bg-red-50 border-red-100";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const statusStyles = getStatusStyles(entity.status);
  const space = availableSpaces.find((s) => s.id === entity.spaceId);
  const categoryDef = availableCategories.find(
    (c) => c.name === entity.category
  );

  const handleNavigate = (id: string) => {
    if (onNavigateToEntity) {
      onNavigateToEntity("inventory", id);
    } else if (onViewItem) {
      onViewItem(id);
    }
  };

  const handleSaveEdit = (data: Partial<InventoryItem>) => {
    onUpdateEntity("inventory", entity.id, data);
    setIsEditModalOpen(false);
  };

  const confirmDelete = () => {
    onDelete();
    setIsDeleteConfirmOpen(false);
  };

  const metadataRows = [
    {
      label: "Record ID",
      value: entity.id,
      valueClassName: "font-mono text-xs",
    },
    {
      label: "Created",
      value: new Date(entity.createdAtUtc).toLocaleDateString(),
    },
    {
      label: "Last Updated",
      value: entity.updatedAtUtc
        ? new Date(entity.updatedAtUtc).toLocaleDateString()
        : "—",
    },
  ];

  return (
    <DetailLayout
      title={entity.name}
      typeLabel="Managed Asset"
      description={`${space ? `Located in ${space.name}. ` : ""}${
        entity.category || "General property inventory."
      }`}
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm relative overflow-hidden">
            <SectionHeading label="Asset Overview" icon={Box} />
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
              <Box size={200} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 relative z-10">
              <div className="space-y-4">
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 overflow-hidden shadow-inner">
                  {entity.imageUrl ? (
                    <img
                      src={entity.imageUrl}
                      alt={entity.name}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="h-56 flex items-center justify-center text-slate-300">
                      <Box size={64} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    className="p-4 rounded-[1.75rem] border shadow-sm"
                    style={
                      categoryDef?.colorHex
                        ? {
                            backgroundColor: `${categoryDef.colorHex}10`,
                            borderColor: `${categoryDef.colorHex}25`,
                          }
                        : undefined
                    }
                  >
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Category
                    </p>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <div
                        className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 bg-white/70"
                        style={
                          categoryDef?.colorHex
                            ? {
                                borderColor: `${categoryDef.colorHex}25`,
                                color: categoryDef.colorHex,
                              }
                            : undefined
                        }
                      >
                        <DynamicIcon
                          name={categoryDef?.iconName || "LayoutGrid"}
                          size={14}
                        />
                      </div>
                      <p
                        className="text-xl font-black tracking-tight"
                        style={
                          categoryDef?.colorHex
                            ? { color: categoryDef.colorHex }
                            : undefined
                        }
                      >
                        {entity.category || "Uncategorized"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-[1.75rem] border shadow-sm ${statusStyles.bg} ${statusStyles.border}`}
                  >
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Condition
                    </p>
                    <div
                      className={`flex items-center space-x-2 mt-1.5 ${statusStyles.color}`}
                    >
                      <Activity size={16} />
                      <p className="text-xl font-black tracking-tight">
                        {entity.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Location
                    </p>
                    <div className="flex items-center space-x-2 text-slate-900 font-black text-lg tracking-tight">
                      <MapPin size={16} className="text-slate-300" />
                      <span>{space?.name || "Unassigned"}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Stock
                    </p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {entity.quantity}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {entity.unit}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Brand
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {entity.brand || "Not logged"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Model Number
                    </p>
                    <p className="text-sm font-bold text-slate-900 font-mono tracking-tight">
                      {entity.modelNumber || "—"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Serial Number
                    </p>
                    <p className="text-sm font-bold text-slate-900 font-mono tracking-tight">
                      {entity.serialNumber || "-"}
                    </p>
                  </div>
                </div>

                {entity.manufacturerUrl && (
                  <a
                    href={entity.manufacturerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-slate-300 transition-all text-sm font-black text-slate-900"
                  >
                    <ExternalLink size={14} className="text-slate-400" />
                    <span>Open manufacturer support</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
            <SectionHeading
              label="Procurement & Valuation"
              icon={ShoppingCart}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2">
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Purchased From
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">
                    {entity.store || "Not logged"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Purchase Date
                  </p>
                  <div className="flex items-center space-x-2 text-slate-900 font-black text-sm tracking-tight">
                    <Calendar size={14} className="text-slate-300" />
                    <span>{entity.purchaseDate || "Not logged"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Purchase Price
                    </p>
                    <div className="flex items-center space-x-2 text-slate-900 font-black">
                      <DollarSign size={14} className="text-slate-300" />
                      <span>
                        {entity.purchasePrice?.toLocaleString() || "0"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Current Value
                    </p>
                    <div className="flex items-center space-x-2 text-[#5a6b5d] font-black">
                      <TrendingUp size={14} className="text-[#5a6b5d]" />
                      <span>{entity.value?.toLocaleString() || "0"}</span>
                    </div>
                  </div>
                </div>

                {(entity.powerWattage || entity.energyClass) && (
                  <div className="p-6 bg-white border border-slate-200 rounded-[1.75rem] space-y-3 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Energy Profile
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-slate-900 font-black">
                        <Zap size={14} className="text-amber-400" />
                        <span>
                          {entity.powerWattage
                            ? `${entity.powerWattage}W`
                            : "—"}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getEnergyBadgeStyles(
                          entity.energyClass
                        )}`}
                      >
                        {entity.energyClass || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-12">
          <SystemMetadataCard rows={metadataRows} />

          <TagsSection
            entityTags={entity.tags || []}
            availableTags={availableTags}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
          />
          <AttachmentsSection
            linkedDocuments={linkedDocuments}
            onAddAttachment={onAddAttachment}
            availableDocuments={allDocuments}
            explicitDocumentIds={entity.documentIds || []}
            onLinkDocument={handleLinkDocument}
            onUnlinkDocument={handleUnlinkDocument}
          />
          <NotesSection
            notes={entity.notes || []}
            onAddNote={onAddNote}
            onUpdateNote={onUpdateNote}
            onDeleteNote={onDeleteNote}
          />
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
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 text-center space-y-8">
              <div className="w-20 h-20 bg-[#fdf3f0] text-[#b45c43] rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                  Delete Asset?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Removing <strong>{entity.name}</strong> will permanently
                  delete this inventory record.
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
