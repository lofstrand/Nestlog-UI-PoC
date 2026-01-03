import React, { useState } from "react";
import {
  Clock,
  Wrench,
  AlertTriangle,
  Repeat,
  Calendar,
  Layout,
  Info,
  Activity,
  CheckCircle,
} from "lucide-react";
import {
  MaintenanceTask,
  Tag,
  Document,
  MaintenanceTaskPriority,
  MaintenanceRecurrenceFrequency,
  Space,
  Contact,
  InventoryItem,
} from "../../../types";
import DetailLayout from "../../../layouts/DetailLayout";
import NotesSection from "@/components/sections/NotesSection";
import TagsSection from "@/components/sections/TagsSection";
import AttachmentsSection from "@/features/documents/components/AttachmentsSection";
import MaintenanceTaskModal from "@/features/maintenance/components/MaintenanceTaskModal";
import SystemMetadataCard from "@/components/sections/SystemMetadataCard";
import { SectionHeading, Badge } from "../../../components/ui/UIPrimitives";

interface TaskDetailViewProps {
  entity: MaintenanceTask;
  availableTags: Tag[];
  linkedDocuments: Document[];
  allDocuments?: Document[];
  availableSpaces: Space[];
  availableContacts: Contact[];
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

const TaskDetailView: React.FC<TaskDetailViewProps> = ({
  entity,
  availableTags,
  linkedDocuments,
  allDocuments = [],
  availableSpaces,
  availableContacts,
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

  const handleLinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (current.includes(documentId)) return;
    onUpdateEntity("task", entity.id, {
      documentIds: [...current, documentId],
      updatedAtUtc: new Date().toISOString(),
    });
  };

  const handleUnlinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (!current.includes(documentId)) return;
    onUpdateEntity("task", entity.id, {
      documentIds: current.filter((id) => id !== documentId),
      updatedAtUtc: new Date().toISOString(),
    });
  };

  const getPriorityStyles = (p: MaintenanceTaskPriority) => {
    switch (p) {
      case MaintenanceTaskPriority.Urgent:
        return "bg-[#fdf3f0] text-[#b45c43] border-[#f9dad3]";
      case MaintenanceTaskPriority.High:
        return "bg-[#f9f4f0] text-[#a47148] border-[#f1e6df]";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const isRecurring =
    entity.recurrence &&
    entity.recurrence.frequency !== MaintenanceRecurrenceFrequency.None;
  const linkedSpaces = availableSpaces.filter((s) =>
    entity.spaceIds?.includes(s.id)
  );

  const handleSaveEdit = (data: Partial<MaintenanceTask>) => {
    onUpdateEntity("task", entity.id, data);
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
      typeLabel="Maintenance Event"
      description={entity.description || "Operational log for property upkeep."}
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
            <SectionHeading label="Scope of Work" icon={Wrench} />
            <p className="text-slate-800 leading-relaxed text-xl font-medium">
              {entity.description ||
                "Historical maintenance log with no specific description provided."}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
            <SectionHeading label="Execution Configuration" icon={Activity} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Urgency Rank
                  </p>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-widest inline-block ${getPriorityStyles(
                      entity.priority
                    )}`}
                  >
                    {entity.priority}
                  </span>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Workflow State
                  </p>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        entity.status === "Completed"
                          ? "bg-[#5a6b5d]"
                          : "bg-[#a47148] animate-pulse"
                      }`}
                    ></div>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {entity.status}
                    </span>
                  </div>
                  {entity.completedAtUtc && (
                    <div className="flex items-center text-[#5a6b5d] font-bold text-sm mt-1">
                      <CheckCircle size={14} className="mr-2" />
                      Finished:{" "}
                      {new Date(entity.completedAtUtc).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Target Resolution
                  </p>
                  <div className="flex items-center text-slate-900 font-black text-2xl tracking-tight">
                    <Calendar size={20} className="mr-3 text-[#a47148]" />
                    {entity.dueDateUtc
                      ? new Date(entity.dueDateUtc).toLocaleDateString()
                      : "Unscheduled"}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Targeted Locations
                  </p>
                  {linkedSpaces.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {linkedSpaces.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <Layout size={14} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-700">
                            {s.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-slate-500 italic">
                      Entire Property / Global
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isRecurring && (
            <div className="bg-[#f9f4f0] border border-[#f1e6df] rounded-[2.5rem] p-10 space-y-6 shadow-sm">
              <div className="flex items-center space-x-2 text-[10px] font-black text-[#a47148] uppercase tracking-[0.2em]">
                <Repeat size={14} />
                <span>Recurrence Engine Policy</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    Every {entity.recurrence?.interval}{" "}
                    {entity.recurrence?.frequency.slice(0, -2)}
                    {entity.recurrence?.interval! > 1 ? "s" : ""}
                  </p>
                  <p className="text-[10px] font-black text-[#a47148] uppercase tracking-widest">
                    Active Automation
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm font-bold text-slate-700">
                    <Clock size={16} className="mr-3 text-[#a47148]" />
                    <span>
                      Next auto-generation:{" "}
                      {entity.nextDateUtc?.split("T")[0] ||
                        "Scheduled on completion"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    This task will automatically regenerate a new pending entry
                    based on the recurrence gap upon completion of the current
                    milestone.
                  </p>
                </div>
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

      <MaintenanceTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={entity}
        availableSpaces={availableSpaces}
        availableContacts={availableContacts}
        availableInventory={availableInventory}
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
                  Scrub Task?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Removing <strong>{entity.title}</strong> will purge this entry
                  and any historical cost or labor metrics from the property
                  records.
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

export default TaskDetailView;
