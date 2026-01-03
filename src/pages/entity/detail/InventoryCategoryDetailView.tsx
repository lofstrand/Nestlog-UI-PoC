import React, { useState } from "react";
import {
  LayoutGrid,
  TrendingDown,
  ShieldAlert,
  Layers,
  ChevronRight,
  ArrowUpCircle,
  AlertTriangle,
} from "lucide-react";
import { InventoryCategory, Tag, Document } from "../../../types";
import DetailLayout from "../../../layouts/DetailLayout";
import NotesSection from "../../../components/sections/NotesSection";
import TagsSection from "../../../components/sections/TagsSection";
import InventoryCategoryModal from "../../../components/modals/InventoryCategoryModal";
import SystemMetadataCard from "../../../components/sections/SystemMetadataCard";
import { SectionHeading, Badge, DynamicIcon } from "../../../components/ui/UIPrimitives";

interface InventoryCategoryDetailViewProps {
  entity: InventoryCategory;
  availableTags: Tag[];
  availableCategories: InventoryCategory[];
  linkedDocuments: Document[];
  allDocuments?: Document[];
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
}

const InventoryCategoryDetailView: React.FC<
  InventoryCategoryDetailViewProps
> = ({
  entity,
  availableTags,
  availableCategories,
  linkedDocuments,
  allDocuments = [],
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
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const parent = availableCategories.find((c) => c.id === entity.parentId);
  const subCategories = availableCategories.filter(
    (c) => c.parentId === entity.id
  );

  const handleSaveEdit = (data: Partial<InventoryCategory>) => {
    onUpdateEntity("inventory_category", entity.id, data);
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
      value: entity.createdAtUtc
        ? new Date(entity.createdAtUtc).toLocaleDateString()
        : "—",
    },
    {
      label: "Last Updated",
      value: entity.updatedAtUtc
        ? new Date(entity.updatedAtUtc).toLocaleDateString()
        : "—",
    },
    {
      label: "Parent Eligible",
      value: (entity.canHaveChildren ?? true) ? "Yes" : "No",
    },
  ];

  return (
    <DetailLayout
      title={entity.name}
      typeLabel="Asset Taxonomy"
      description="Global classification rules for property inventory and financial depreciation."
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm relative overflow-hidden">
            <SectionHeading label="Category Overview" icon={LayoutGrid} />
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
              <LayoutGrid size={200} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 relative z-10">
              <div className="space-y-4">
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-inner space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-white"
                      style={{ backgroundColor: entity.colorHex || "#1e293b" }}
                    >
                      <DynamicIcon name={entity.iconName || "LayoutGrid"} size={18} />
                    </div>
                    <Badge
                      color="text-slate-500"
                      bgColor="bg-white"
                      borderColor="border-slate-200"
                    >
                      ORD-{entity.sortOrder.toString().padStart(3, "0")}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(entity.canHaveChildren ?? true) ? (
                      <Badge color="text-slate-600" bgColor="bg-white" borderColor="border-slate-200">Parent Enabled</Badge>
                    ) : (
                      <Badge color="text-slate-500" bgColor="bg-slate-50" borderColor="border-slate-200">Leaf Category</Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Insurance Protocol
                    </p>
                    <Badge
                      color={
                        entity.isInsuranceCritical
                          ? "text-[#b45c43]"
                          : "text-slate-600"
                      }
                      bgColor={
                        entity.isInsuranceCritical ? "bg-[#fdf3f0]" : "bg-white"
                      }
                      borderColor={
                        entity.isInsuranceCritical
                          ? "border-[#f9dad3]"
                          : "border-slate-200"
                      }
                      className="w-fit"
                    >
                      <div className="flex items-center space-x-1.5">
                        <ShieldAlert size={10} />
                        <span>
                          {entity.isInsuranceCritical
                            ? "Critical Asset Group"
                            : "Standard Catalog"}
                        </span>
                      </div>
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Parent Category
                    </p>
                    <div className="flex items-center space-x-2 text-slate-900 font-black text-lg tracking-tight">
                      <Layers size={16} className="text-slate-300" />
                      <span>{parent?.name || "Root Hierarchy"}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Depreciation
                    </p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        -{entity.estimatedDepreciationRate || 0}%
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        per year
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] shadow-inner">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    This classification sets default lifecycle rules for assets
                    and is used as a baseline for valuation and coverage audits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
              <SectionHeading label="Hierarchy" icon={Layers} />
              <Badge
                color="text-slate-400"
                bgColor="bg-slate-50"
                borderColor="border-slate-100"
              >
                {subCategories.length} Sub-categories
              </Badge>
            </div>

            <div className="flex items-center space-x-3 p-5 bg-slate-50 border border-slate-100 rounded-[1.75rem] overflow-x-auto">
              <div className="flex items-center space-x-2 text-slate-500 font-bold text-sm shrink-0">
                <ArrowUpCircle size={16} />
                <span>Root Hierarchy</span>
              </div>
              <ChevronRight size={14} className="text-slate-300 shrink-0" />
              {parent && (
                <>
                  <span className="text-slate-600 font-bold text-sm shrink-0">
                    {parent.name}
                  </span>
                  <ChevronRight size={14} className="text-slate-300 shrink-0" />
                </>
              )}
              <span className="text-slate-900 font-black text-sm shrink-0">
                {entity.name}
              </span>
            </div>

            {subCategories.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Nested Sub-classifications
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subCategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center space-x-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <DynamicIcon name={sub.iconName || "LayoutGrid"} size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">
                          {sub.name}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                          ORD-{sub.sortOrder.toString().padStart(3, "0")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-400 italic">
                No sub-categories registered.
              </p>
            )}
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
          <NotesSection
            notes={entity.notes || []}
            onAddNote={onAddNote}
            onUpdateNote={onUpdateNote}
            onDeleteNote={onDeleteNote}
          />
        </div>
      </div>

      <InventoryCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={entity}
        availableCategories={availableCategories}
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
                  Delete Classification?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Removing <strong>{entity.name}</strong> will permanently
                  delete this category.
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

export default InventoryCategoryDetailView;
