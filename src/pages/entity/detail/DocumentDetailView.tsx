import React, { useState } from "react";
import {
  Paperclip,
  ExternalLink,
  FileText,
  Calendar,
  Layout,
  User,
  FolderOpen,
  Wrench,
  Shield,
  MapPin,
  Box,
  Link,
  Download,
  AlertTriangle,
  Layers,
  Tag,
} from "lucide-react";
import {
  Document,
  Tag as TagType,
  Space,
  Contact,
  Project,
  MaintenanceTask,
  InventoryItem,
} from "../../../types";
import DetailLayout from "../../../layouts/DetailLayout";
import NotesSection from "@/components/sections/NotesSection";
import TagsSection from "@/components/sections/TagsSection";
import { SectionHeading, Badge } from "../../../components/ui/UIPrimitives";
import DocumentPreview from "@/features/documents/components/DocumentPreview";
import DocumentModal from "@/features/documents/components/DocumentModal";
import SystemMetadataCard from "@/components/sections/SystemMetadataCard";

interface DocumentDetailViewProps {
  entity: Document;
  availableTags: TagType[];
  linkedDocuments: Document[];
  allDocuments: Document[];
  availableSpaces: Space[];
  availableContacts: Contact[];
  availableProjects: Project[];
  availableTasks: MaintenanceTask[];
  availableInventory: InventoryItem[];
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

const DocumentDetailView: React.FC<DocumentDetailViewProps> = ({
  entity,
  availableTags,
  linkedDocuments,
  availableSpaces,
  availableContacts,
  availableProjects,
  availableTasks,
  availableInventory,
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const linkedContact = availableContacts.find(
    (c) => c.id === entity.contactId
  );
  const linkedProjects = availableProjects.filter((p) =>
    entity.projectIds?.includes(p.id)
  );
  const linkedTasks = availableTasks.filter((t) =>
    entity.taskIds?.includes(t.id)
  );
  const linkedInventory = availableInventory.filter((i) =>
    entity.inventoryItems?.some((link) => link.inventoryItemId === i.id)
  );
  const linkedSpace = availableSpaces.find((s) => s.id === entity.spaceId);
  const linkedSurfaces =
    linkedSpace?.surfaces.filter((surf) =>
      entity.surfaceIds?.includes(surf.id)
    ) || [];

  const handleSaveEdit = (data: Partial<Document>) => {
    onUpdateEntity("document", entity.id, data);
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
      title={entity.title}
      typeLabel="Vault Document"
      description={`Record stored in your digital household vault.`}
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm relative overflow-hidden">
            <SectionHeading label="Basic Details" icon={FileText} />
            <div
              className={`absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 transition-opacity`}
            >
              <Shield size={160} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2 relative z-10">
              <div className="space-y-8">
                <div className="flex items-start space-x-5 group">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                      entity.isPrivate
                        ? "bg-[#b45c43] text-white shadow-xl shadow-[#b45c43]/20"
                        : "bg-slate-900 text-[#5a6b5d] shadow-xl shadow-slate-200"
                    }`}
                  >
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Privacy Level
                    </p>
                    <p className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                      {entity.isPrivate ? "Private Record" : "Standard Access"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                      Stored At: {entity.physicalLocation || "Digital Only"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-5 group">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                    <User size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Service Provider / Company
                    </p>
                    <p className="text-xl font-black text-slate-900 tracking-tight leading-none">
                      {linkedContact
                        ? `${
                            linkedContact.company ||
                            linkedContact.firstName +
                              " " +
                              linkedContact.surname
                          }`
                        : "Manual Entry"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-5 group">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm group-hover:bg-white group-hover:border-slate-300 transition-all">
                    <Tag size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Document Category
                    </p>
                    <p className="text-xl font-black text-slate-900 tracking-tight leading-none">
                      {entity.category || "General"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] space-y-4 shadow-inner">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Document Expiration
                    </p>
                    <div className="flex items-center text-slate-900 font-black text-lg tracking-tight">
                      <Calendar size={16} className="mr-3 text-slate-300" />
                      {entity.expiryDate || "Does not expire"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
            <div className="flex items-center justify-between">
              <SectionHeading label="Attached Files" icon={Paperclip} />
              <Badge
                color="text-slate-400"
                bgColor="bg-slate-50"
                className="px-3 py-1 font-mono tracking-tighter"
              >
                {entity.attachments?.length || 0} Files
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {entity.attachments?.map((a: any) => (
                <div
                  key={a.id}
                  className="group flex flex-col bg-slate-50 border border-slate-100 rounded-[2rem] overflow-hidden hover:bg-white hover:border-slate-300 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
                    <DocumentPreview
                      attachment={a}
                      size="lg"
                      className="border-none rounded-none w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="p-4 bg-white rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform hover:bg-slate-50 active:scale-90">
                        <Download size={24} className="text-slate-900" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-base font-black text-slate-900 truncate tracking-tight">
                        {a.fileName}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
                        {(a.sizeBytes / 1024).toFixed(1)} KB •{" "}
                        {a.contentType.split("/")[1]}
                      </p>
                    </div>
                    <FileText
                      size={20}
                      className="text-slate-200 group-hover:text-slate-900 transition-colors"
                    />
                  </div>
                </div>
              ))}
              {(!entity.attachments || entity.attachments.length === 0) && (
                <div className="col-span-full py-24 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 bg-slate-50/20">
                  <FileText
                    size={64}
                    className="mb-4 opacity-10"
                    strokeWidth={1}
                  />
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                    No files attached
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-12 shadow-sm">
            <SectionHeading label="Connected to Rooms & Items" icon={Link} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-10">
                <div className="space-y-5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center">
                    <FolderOpen size={12} className="mr-2 text-[#b45c43]" />{" "}
                    Related Projects
                  </p>
                  <div className="space-y-3">
                    {linkedProjects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group/link"
                      >
                        <span className="text-sm font-black text-slate-900 tracking-tight">
                          {p.title}
                        </span>
                        <ExternalLink
                          size={12}
                          className="text-slate-300 group-hover/link:text-slate-900"
                        />
                      </div>
                    ))}
                    {linkedProjects.length === 0 && (
                      <p className="text-xs font-bold text-slate-300 italic px-1">
                        Not linked to any projects.
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center">
                    <Wrench size={12} className="mr-2 text-[#a47148]" />{" "}
                    Maintenance Tasks
                  </p>
                  <div className="space-y-3">
                    {linkedTasks.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group/link"
                      >
                        <span className="text-sm font-black text-slate-900 tracking-tight">
                          {t.title}
                        </span>
                        <ExternalLink
                          size={12}
                          className="text-slate-300 group-hover/link:text-slate-900"
                        />
                      </div>
                    ))}
                    {linkedTasks.length === 0 && (
                      <p className="text-xs font-bold text-slate-300 italic px-1">
                        Not linked to any tasks.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-10">
                <div className="space-y-5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center">
                    <Box size={12} className="mr-2 text-[#1a2e4c]" /> Household
                    Items
                  </p>
                  <div className="space-y-3">
                    {linkedInventory.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group/link"
                      >
                        <div className="flex items-center space-x-3">
                          <Box size={14} className="text-slate-400" />
                          <span className="text-sm font-black text-slate-900 tracking-tight">
                            {i.name}
                          </span>
                        </div>
                        <ExternalLink
                          size={12}
                          className="text-slate-300 group-hover/link:text-slate-900"
                        />
                      </div>
                    ))}
                    {linkedInventory.length === 0 && (
                      <p className="text-xs font-bold text-slate-300 italic px-1">
                        Not linked to any items.
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center">
                    <Layers size={12} className="mr-2 text-[#5a6b5d]" />{" "}
                    Surfaces & Materials
                  </p>
                  <div className="space-y-3">
                    {linkedSurfaces.map((surf) => (
                      <div
                        key={surf.id}
                        className="flex items-center justify-between p-4 bg-[#f2f4f2]/50 border border-[#e1e6e1] rounded-2xl group/link hover:bg-white transition-all"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tracking-tight">
                            {surf.surfaceType}
                          </span>
                          <span className="text-[9px] font-bold text-[#5a6b5d] uppercase tracking-widest">
                            {surf.materialType} • {linkedSpace?.name}
                          </span>
                        </div>
                      </div>
                    ))}
                    {linkedSurfaces.length === 0 && (
                      <p className="text-xs font-bold text-slate-300 italic px-1">
                        Not linked to any surfaces.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-12">
          {linkedSpace && (
            <div className="bg-slate-900 rounded-[2.5rem] p-10 space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 blueprint-grid opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" />
              <SectionHeading label="Location" color="text-slate-500" />
              <div className="flex items-center space-x-5 relative z-10">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-[#5a6b5d] shadow-inner group-hover:bg-slate-700 transition-all">
                  <Layout size={32} strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    Found in
                  </p>
                  <h4 className="text-2xl font-black text-white tracking-tight leading-none">
                    {linkedSpace.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Level {linkedSpace.level} • {linkedSpace.spaceType}
                  </p>
                </div>
              </div>
            </div>
          )}

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

      <DocumentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={entity}
        availableSpaces={availableSpaces}
        availableInventory={availableInventory}
        availableProjects={availableProjects}
        availableTasks={availableTasks}
        availableContacts={availableContacts}
      />

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
                  Delete Document?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Removing <strong>{entity.title}</strong> will delete all
                  attached files and links. This action is permanent.
                </p>
              </div>
              <div className="flex flex-col space-y-3 pt-2">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 bg-[#b45c43] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#9d4b35] transition-all shadow-xl shadow-[#b45c43]/20 active:scale-[0.98]"
                >
                  Delete Permanently
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

export default DocumentDetailView;
