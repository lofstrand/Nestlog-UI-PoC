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
  QrCode,
  Layers,
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
} from "../types";
import DetailLayout from "./DetailLayout";
import NotesSection from "./NotesSection";
import TagsSection from "./TagsSection";
import AttachmentsSection from "./AttachmentsSection";
import InventoryModal from "./InventoryModal";
import SystemMetadataCard from "./SystemMetadataCard";
import { SectionHeading, Badge } from "./UIPrimitives";

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
  const subItems = allInventory.filter((i) => i.parentItemId === entity.id);
  const parentItem = allInventory.find((i) => i.id === entity.parentItemId);

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

                <div className="flex flex-wrap gap-2">
                  <Badge
                    color={statusStyles.color}
                    bgColor={statusStyles.bg}
                    borderColor={statusStyles.border}
                  >
                    <div className="flex items-center space-x-1.5">
                      <Activity size={10} />
                      <span>{entity.status}</span>
                    </div>
                  </Badge>
                  {entity.qrCodeIdentifier && (
                    <Badge
                      color="text-slate-500"
                      bgColor="bg-slate-50"
                      borderColor="border-slate-200"
                      className="font-mono tracking-tighter"
                    >
                      <div className="flex items-center space-x-1.5">
                        <QrCode size={10} />
                        <span>{entity.qrCodeIdentifier}</span>
                      </div>
                    </Badge>
                  )}
                  <Badge
                    color="text-slate-500"
                    bgColor="bg-slate-50"
                    borderColor="border-slate-200"
                    style={
                      categoryDef?.colorHex
                        ? {
                            color: categoryDef.colorHex,
                            backgroundColor: `${categoryDef.colorHex}10`,
                            borderColor: `${categoryDef.colorHex}25`,
                          }
                        : undefined
                    }
                  >
                    {entity.category || "Uncategorized"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-8">
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
                      {entity.serialNumber || "—"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Last Audit
                    </p>
                    <div className="flex items-center space-x-2 text-slate-900 font-black text-sm tracking-tight">
                      <History size={14} className="text-slate-300" />
                      <span>
                        {entity.lastAuditDateUtc
                          ? new Date(
                              entity.lastAuditDateUtc
                            ).toLocaleDateString()
                          : "Not audited"}
                      </span>
                    </div>
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

          {(parentItem || subItems.length > 0) && (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
              <SectionHeading label="Relationships" icon={Layers} />
              <div className="space-y-6">
                {parentItem && (
                  <button
                    onClick={() => handleNavigate(parentItem.id)}
                    className="w-full flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-[1.75rem] hover:bg-white hover:border-slate-300 transition-all text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                        <Layers size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Contained In
                        </p>
                        <p className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                          {parentItem.name}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-300" />
                  </button>
                )}

                {subItems.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Contains ({subItems.length})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {subItems.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleNavigate(sub.id)}
                          className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 hover:bg-slate-50/40 transition-all text-left group"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:border-slate-300 transition-all shrink-0">
                              <Box size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-slate-900 truncate">
                                {sub.name}
                              </p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                {sub.category || "Uncategorized"}
                              </p>
                            </div>
                          </div>
                          <ArrowRight
                            size={14}
                            className="text-slate-300 shrink-0"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-12">
          <SystemMetadataCard rows={metadataRows} />

          <TagsSection
            entityTags={entity.tags || []}
            availableTags={availableTags}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
          />
          <NotesSection notes={entity.notes || []} onAddNote={onAddNote} />
          <AttachmentsSection
            linkedDocuments={linkedDocuments}
            onAddAttachment={onAddAttachment}
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
