import React, { useState } from "react";
import { Info, Users, Shield, Layout, AlertTriangle, X } from "lucide-react";
import {
  Household,
  Tag,
  Document,
  HouseholdMember,
  HouseholdInvite,
  Property,
} from "../types";
import DetailLayout from "./DetailLayout";
import NotesSection from "./NotesSection";
import TagsSection from "./TagsSection";
import AttachmentsSection from "./AttachmentsSection";
import HouseholdMembersSection from "./HouseholdMembersSection";
import HouseholdArchitectureSection from "./HouseholdArchitectureSection";
import InviteModal from "./InviteModal";
import HouseholdModal from "./HouseholdModal";
import SystemMetadataCard from "./SystemMetadataCard";
import { Badge } from "./UIPrimitives";

interface HouseholdDetailViewProps {
  entity: Household;
  availableTags: Tag[];
  linkedDocuments: Document[];
  allDocuments?: Document[];
  allMembers: HouseholdMember[];
  allInvites: HouseholdInvite[];
  allProperties: Property[];
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

const HouseholdDetailView: React.FC<HouseholdDetailViewProps> = ({
  entity,
  availableTags,
  linkedDocuments,
  allDocuments = [],
  allMembers,
  allInvites,
  allProperties,
  onBack,
  onEdit,
  onDelete,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddTag,
  onRemoveTag,
  onAddAttachment,
  onUpdateEntity,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "collaboration">(
    "overview"
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const householdMembers = allMembers.filter(
    (m) => m.householdId === entity.id
  );
  const householdInvites = allInvites.filter(
    (i) => i.householdId === entity.id && i.status === "Pending"
  );
  const householdProperties = allProperties;

  const handleLinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (current.includes(documentId)) return;
    onUpdateEntity("household", entity.id, {
      documentIds: [...current, documentId],
      updatedAtUtc: new Date().toISOString(),
    });
  };

  const handleUnlinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (!current.includes(documentId)) return;
    onUpdateEntity("household", entity.id, {
      documentIds: current.filter((id) => id !== documentId),
      updatedAtUtc: new Date().toISOString(),
    });
  };

  const handleSaveEdit = (data: Partial<Household>) => {
    onUpdateEntity("household", entity.id, data);
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
  ];

  return (
    <DetailLayout
      title={entity.name}
      typeLabel="Household"
      description={entity.description}
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
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("collaboration")}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "collaboration"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Users size={16} />
          <span>Collaboration</span>
          {householdInvites.length > 0 && (
            <span className="w-2 h-2 bg-[#b45c43] rounded-full ml-1"></span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "overview" ? (
            <HouseholdArchitectureSection
              entity={entity}
              memberCount={householdMembers.length}
            />
          ) : (
            <HouseholdMembersSection
              members={householdMembers}
              invites={householdInvites}
              properties={householdProperties}
              onInvite={() => setIsInviteModalOpen(true)}
              onRemoveMember={() => {}}
              onCancelInvite={() => {}}
              onUpdateRole={() => {}}
            />
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

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={(email) => {
          console.log(`Invite sent to: ${email}`);
        }}
        householdName={entity.name}
      />

      <HouseholdModal
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
                  Delete Household?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  You are about to delete <strong>{entity.name}</strong>. This
                  action is final and will unlink all associated property
                  metadata.
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

export default HouseholdDetailView;
