import React, { useState } from "react";
import {
  MapPin,
  Zap,
  Users,
  Camera,
  AlertTriangle,
  X,
  Shield,
  ExternalLink,
} from "lucide-react";
import {
  Property,
  Tag,
  Document,
  GalleryItem,
  HouseholdMember,
  Contact,
} from "../../../types";
import DetailLayout from "../../../layouts/DetailLayout";
import NotesSection from "@/components/sections/NotesSection";
import TagsSection from "@/features/tags/components/TagsSection";
import AttachmentsSection from "@/features/documents/components/AttachmentsSection";
import PropertyTeamSection from "@/features/properties/components/PropertyTeamSection";
import VisualArchive from "@/features/gallery/components/VisualArchive";
import GalleryModal from "@/features/gallery/components/GalleryModal";
import PropertyModal from "@/features/properties/components/PropertyModal";
import SystemMetadataCard from "@/components/sections/SystemMetadataCard";
import { SectionHeading, Badge } from "@/components/ui";

interface PropertyDetailViewProps {
  entity: Property;
  availableTags: Tag[];
  linkedDocuments: Document[];
  allDocuments?: Document[];
  allMembers: HouseholdMember[];
  availableContacts: Contact[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (text: string) => void;
  onUpdateNote?: (noteId: string, text: string) => void;
  onDeleteNote?: (noteId: string) => void;
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
  onAddAttachment: () => void;
  onViewItem?: (id: string) => void;
  onNavigateToEntity?: (type: string, id: string) => void;
  onUpdateEntity: (type: string, id: string, data: any) => void;
}

const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  entity,
  availableTags,
  linkedDocuments,
  allDocuments = [],
  allMembers,
  availableContacts,
  onBack,
  onEdit,
  onDelete,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddTag,
  onRemoveTag,
  onAddAttachment,
  onViewItem,
  onNavigateToEntity,
  onUpdateEntity,
}) => {
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleLinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (current.includes(documentId)) return;
    onUpdateEntity("property", entity.id, {
      documentIds: [...current, documentId],
      updatedAtUtc: new Date().toISOString(),
    });
  };

  const handleUnlinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (!current.includes(documentId)) return;
    onUpdateEntity("property", entity.id, {
      documentIds: current.filter((id) => id !== documentId),
      updatedAtUtc: new Date().toISOString(),
    });
  };

  const getEnergyColor = (rating?: string | null) => {
    switch (rating) {
      case "A":
        return "text-emerald-500 bg-emerald-50 border-emerald-100";
      case "B":
        return "text-green-500 bg-green-50 border-green-100";
      case "C":
        return "text-lime-500 bg-lime-50 border-lime-100";
      case "D":
        return "text-yellow-500 bg-yellow-50 border-yellow-100";
      case "E":
        return "text-orange-500 bg-orange-50 border-orange-100";
      default:
        return "text-red-500 bg-red-50 border-red-100";
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
    onUpdateEntity("property", entity.id, {
      gallery: [...(entity.gallery || []), newItem],
    });
  };

  const handleSaveEdit = (data: Partial<Property>) => {
    onUpdateEntity("property", entity.id, data);
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

  const handleViewContact = (id: string) => {
    if (onNavigateToEntity) {
      onNavigateToEntity("contact", id);
    } else if (onViewItem) {
      onViewItem(id);
    }
  };

  return (
    <DetailLayout
      title={entity.name}
      typeLabel="Property Asset"
      description="Holistic tracking of physical location, energy performance, and occupancy state."
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <MapPin size={14} className="text-[#5a6b5d]" />
                  <span>Location Metadata</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Geographic Address
                    </p>
                    <p className="text-slate-900 font-bold text-2xl leading-tight tracking-tighter">
                      {entity.address.line1}
                      <br />
                      <span className="text-slate-500 font-medium text-lg">
                        {entity.address.city}, {entity.address.stateOrRegion}{" "}
                        {entity.address.postalCode}
                      </span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-[#f2f4f2] rounded-[1.5rem] border border-[#e1e6e1] flex flex-col justify-center">
                      <p className="text-[9px] font-black text-[#5a6b5d] uppercase tracking-widest mb-1">
                        Floor Area
                      </p>
                      <div className="flex items-baseline space-x-1">
                        <p className="text-slate-900 font-black text-2xl tracking-tight">
                          {entity.floorArea || "--"}
                        </p>
                        <span className="text-[10px] font-bold text-[#5a6b5d]">
                          m²
                        </span>
                      </div>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex flex-col justify-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Built
                      </p>
                      <p className="text-slate-900 font-black text-2xl tracking-tight">
                        {entity.constructionYear || "19XX"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative group rounded-3xl overflow-hidden border border-slate-200 h-64 bg-slate-100">
                  <img
                    src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800`}
                    alt="Map view"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-all" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-white rounded-2xl shadow-2xl border border-slate-100 text-[#b45c43]">
                    <MapPin size={24} fill="currentColor" />
                  </div>
                  <button className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl border border-slate-200 flex items-center space-x-2">
                    <ExternalLink size={12} />
                    <span>Open External Maps</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
              <SectionHeading label="Energy Performance" icon={Zap} />
              <div className="flex items-center space-x-6">
                <div
                  className={`w-20 h-24 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg ${getEnergyColor(
                    entity.energyRating
                  )}`}
                >
                  <span className="text-[10px] font-black uppercase opacity-60">
                    Rating
                  </span>
                  <span className="text-4xl font-black">
                    {entity.energyRating || "?"}
                  </span>
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Primary Heating
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {entity.heatingSystemType || "Not Logged"}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Efficiency Goal
                    </p>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1">
                      <div className="h-full bg-emerald-500 rounded-full w-[40%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
              <SectionHeading label="Operational State" icon={Users} />
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Occupancy Classification
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-slate-900 tracking-tight">
                      {entity.occupancyStatus.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <Badge color="text-[#5a6b5d]" bgColor="bg-white">
                      Active Status
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="px-4 py-3 bg-white border border-slate-100 rounded-xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase">
                      Roof Structure
                    </p>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {entity.roofType || "Unknown"}
                    </p>
                  </div>
                  <div className="px-4 py-3 bg-white border border-slate-100 rounded-xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase">
                      Foundation
                    </p>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {entity.foundationType || "Standard"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
            <VisualArchive
              items={entity.gallery || []}
              onAddItem={() => setIsGalleryModalOpen(true)}
              onDeleteItem={(id) =>
                onUpdateEntity("property", entity.id, {
                  gallery: (entity.gallery || []).filter((i) => i.id !== id),
                })
              }
            />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-12">
          <PropertyTeamSection
            members={allMembers}
            propertyId={entity.id}
            allContacts={availableContacts}
            onViewContact={handleViewContact}
          />

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

      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onSave={handleAddMedia}
      />

      <PropertyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={entity}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-[#fdf3f0] text-[#b45c43] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  Delete Property?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  You are about to delete <strong>{entity.name}</strong>. This
                  will permanently remove all associated maintenance logs, room
                  registries, and document links.
                </p>
              </div>
              <div className="flex flex-col space-y-3 pt-2">
                <button
                  onClick={confirmDelete}
                  className="w-full py-3.5 bg-[#b45c43] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#9d4b35] transition-all shadow-lg shadow-[#b45c43]/20 active:scale-[0.98]"
                >
                  Confirm Deletion
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="w-full py-3.5 bg-slate-50 text-slate-500 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98]"
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

export default PropertyDetailView;
