import React, { useState } from "react";
import {
  Layers,
  Palette,
  Info,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Layout,
  Paperclip,
  FileText,
  Mountain,
  Navigation,
  Boxes,
  MapPin,
} from "lucide-react";
import {
  Space,
  Tag,
  Document,
  SurfaceCondition,
  GalleryItem,
  SpaceSurface,
} from "../types";
import DetailLayout from "./DetailLayout";
import NotesSection from "./NotesSection";
import TagsSection from "./TagsSection";
import AttachmentsSection from "./AttachmentsSection";
import VisualArchive from "./VisualArchive";
import GalleryModal from "./GalleryModal";
import SpaceModal from "./SpaceModal";
import SpaceSurfaceModal from "./SpaceSurfaceModal";
import SystemMetadataCard from "./SystemMetadataCard";
import { Badge, SectionHeading, Button } from "./UIPrimitives";

interface SpaceDetailViewProps {
  entity: Space;
  availableTags: Tag[];
  linkedDocuments: Document[];
  allDocuments: Document[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (text: string) => void;
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
  onAddAttachment: () => void;
  onUpdateEntity: (type: string, id: string, data: any) => void;
  onQuickUploadDoc?: (title: string, file: any) => Promise<string>;
}

const SpaceDetailView: React.FC<SpaceDetailViewProps> = ({
  entity,
  availableTags,
  linkedDocuments,
  allDocuments,
  onBack,
  onEdit,
  onDelete,
  onAddNote,
  onAddTag,
  onRemoveTag,
  onAddAttachment,
  onUpdateEntity,
  onQuickUploadDoc,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "surfaces">(
    "overview"
  );
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSurfaceModalOpen, setIsSurfaceModalOpen] = useState(false);
  const [editingSurface, setEditingSurface] = useState<SpaceSurface | null>(
    null
  );

  const getConditionStyles = (c: SurfaceCondition) => {
    switch (c) {
      case SurfaceCondition.Excellent:
        return {
          color: "text-[#5a6b5d]",
          bg: "bg-[#f2f4f2]",
          width: "100%",
          label: "Excellent",
        };
      case SurfaceCondition.Good:
        return {
          color: "text-blue-600",
          bg: "bg-blue-50",
          width: "75%",
          label: "Good",
        };
      case SurfaceCondition.Fair:
        return {
          color: "text-[#a47148]",
          bg: "bg-[#f9f4f0]",
          width: "50%",
          label: "Fair",
        };
      default:
        return {
          color: "text-[#b45c43]",
          bg: "bg-[#fdf3f0]",
          width: "25%",
          label: "Requires Attention",
        };
    }
  };

  const handleAddMedia = (data: {
    type: "image" | "video";
    url: string;
    title: string;
    description: string;
  }) => {
    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAtUtc: new Date().toISOString(),
    };
    onUpdateEntity("space", entity.id, {
      gallery: [...(entity.gallery || []), newItem],
    });
  };

  const handleSaveSpace = (data: Partial<Space>) => {
    onUpdateEntity("space", entity.id, data);
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
      value: new Date(entity.updatedAtUtc).toLocaleDateString(),
    },
  ];

  const handleAddSurface = () => {
    setEditingSurface(null);
    setIsSurfaceModalOpen(true);
  };

  const handleEditSurface = (s: SpaceSurface) => {
    setEditingSurface(s);
    setIsSurfaceModalOpen(true);
  };

  const handleSaveSurface = (data: Partial<SpaceSurface>) => {
    let updatedSurfaces;
    if (editingSurface) {
      updatedSurfaces = entity.surfaces.map((s) =>
        s.id === editingSurface.id ? { ...s, ...data } : s
      );
    } else {
      const newSurface = {
        id: Math.random().toString(36).substr(2, 9),
        spaceId: entity.id,
        ...data,
        isArchived: false,
        createdAtUtc: new Date().toISOString(),
        updatedAtUtc: new Date().toISOString(),
      } as SpaceSurface;
      updatedSurfaces = [...(entity.surfaces || []), newSurface];
    }
    onUpdateEntity("space", entity.id, { surfaces: updatedSurfaces });
    setIsSurfaceModalOpen(false);
  };

  const handleRemoveSurface = (id: string) => {
    const updatedSurfaces = entity.surfaces.filter((s) => s.id !== id);
    onUpdateEntity("space", entity.id, { surfaces: updatedSurfaces });
  };

  return (
    <DetailLayout
      title={entity.name}
      typeLabel="Spatial Registry"
      description="Detailed catalog of architectural room metadata and physical finishes."
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="flex space-x-1 p-1 bg-slate-100/50 rounded-2xl border border-slate-100 w-fit mb-8">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "overview"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Layout size={16} />
          <span>Structural Blueprint</span>
        </button>
        <button
          onClick={() => setActiveTab("surfaces")}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "surfaces"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Palette size={16} />
          <span>Surface Inventory</span>
          <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black">
            {entity.surfaces?.length || 0}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "overview" ? (
            <>
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
                <SectionHeading label="Space Configuration" icon={Boxes} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-2">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Type
                    </p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                      {entity.spaceType}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Floor Level
                    </p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none font-mono">
                      {entity.level === 0 ? "Ground" : entity.level}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Environment
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        color={
                          entity.isOutdoor ? "text-[#5a6b5d]" : "text-blue-400"
                        }
                        bgColor="bg-slate-50"
                        borderColor="border-slate-100"
                        className="px-4 py-1.5 rounded-full shadow-inner"
                      >
                        {entity.isOutdoor ? "Outdoor" : "Indoor"}
                      </Badge>
                      <MapPin
                        size={14}
                        className={
                          entity.isOutdoor ? "text-[#5a6b5d]" : "text-blue-400"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
                <VisualArchive
                  items={entity.gallery || []}
                  onAddItem={() => setIsGalleryModalOpen(true)}
                  onDeleteItem={(id) =>
                    onUpdateEntity("space", entity.id, {
                      gallery: (entity.gallery || []).filter(
                        (i) => i.id !== id
                      ),
                    })
                  }
                />
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-3 text-xs font-black text-slate-900 uppercase tracking-widest">
                  <Palette size={18} />
                  <span>Managed Finishes ({entity.surfaces?.length || 0})</span>
                </div>
                <Button size="sm" icon={Plus} onClick={handleAddSurface}>
                  New Surface
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {entity.surfaces
                  ?.filter((s) => !s.isArchived)
                  .map((s) => {
                    const surfaceDocs = allDocuments.filter((doc) =>
                      s.documentIds?.includes(doc.id)
                    );
                    const condition = getConditionStyles(
                      s.condition || SurfaceCondition.Excellent
                    );
                    return (
                      <div
                        key={s.id}
                        className="relative p-8 bg-white border border-slate-200 rounded-[2.5rem] space-y-8 group hover:shadow-2xl hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                              <Palette size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                              <div className="flex items-center space-x-4">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                                  {s.surfaceType}
                                </h3>
                                <Badge
                                  color={condition.color}
                                  bgColor={condition.bg}
                                >
                                  {condition.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-500 font-bold mt-2">
                                {s.materialType} •{" "}
                                {s.brand || "Unbranded Material"}{" "}
                                {s.colorName ? `• ${s.colorName}` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditSurface(s)}
                              className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleRemoveSurface(s.id)}
                              className="p-3 text-slate-400 hover:text-[#b45c43] hover:bg-[#fdf3f0] rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-6 border-y border-slate-100">
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                              Health Index
                            </p>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${condition.color.replace(
                                  "text",
                                  "bg"
                                )}`}
                                style={{ width: condition.width }}
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                              Dimension Area
                            </p>
                            <p className="text-lg font-black text-slate-800 tracking-tight">
                              {s.area || "--"} {s.areaUnit || "m²"}
                            </p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-end">
                              Log Date
                            </p>
                            <p className="text-lg font-black text-slate-800 tracking-tight">
                              {s.installedDateUtc
                                ? new Date(
                                    s.installedDateUtc
                                  ).toLocaleDateString()
                                : "Unlogged"}
                            </p>
                          </div>
                        </div>

                        {surfaceDocs.length > 0 && (
                          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">
                              Attached Documents:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {surfaceDocs.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center space-x-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-slate-300 cursor-pointer transition-all"
                                >
                                  <FileText size={10} />
                                  <span>{doc.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                {(!entity.surfaces || entity.surfaces.length === 0) && (
                  <div className="py-32 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 bg-white/50">
                    <Palette
                      size={64}
                      strokeWidth={1}
                      className="mb-6 opacity-20"
                    />
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                      Inventory Registry Empty
                    </p>
                    <button
                      onClick={handleAddSurface}
                      className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                      New Surface
                    </button>
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
          <AttachmentsSection
            linkedDocuments={linkedDocuments}
            onAddAttachment={onAddAttachment}
          />
          <NotesSection notes={entity.notes || []} onAddNote={onAddNote} />
        </div>
      </div>

      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onSave={handleAddMedia}
      />

      <SpaceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveSpace}
        initialData={entity}
        availableDocuments={allDocuments}
      />

      <SpaceSurfaceModal
        isOpen={isSurfaceModalOpen}
        onClose={() => setIsSurfaceModalOpen(false)}
        onSave={handleSaveSurface}
        initialData={editingSurface}
        availableDocuments={allDocuments}
        onQuickUploadDoc={onQuickUploadDoc}
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
                  Scrub Space?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Removing <strong>{entity.name}</strong> will purge all surface
                  metrics, historical logs, and gallery metadata from the master
                  database.
                </p>
              </div>
              <div className="flex flex-col space-y-3 pt-2">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 bg-[#b45c43] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#9d4b35] transition-all shadow-xl shadow-[#b45c43]/20 active:scale-[0.98]"
                >
                  Finalize Removal
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98]"
                >
                  Abort Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DetailLayout>
  );
};

export default SpaceDetailView;
