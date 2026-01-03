import React, { useState } from "react";
import {
  Mail,
  Phone,
  Briefcase,
  User,
  Globe,
  Star,
  Siren,
  DollarSign,
  Hammer,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  X,
  Award,
  HardHat,
} from "lucide-react";
import { Contact, Tag, Document } from "../../../types";
import DetailLayout from "../../../layouts/DetailLayout";
import NotesSection from "@/components/sections/NotesSection";
import TagsSection from "@/features/tags/components/TagsSection";
import ContactModal from "@/features/contacts/components/ContactModal";
import SystemMetadataCard from "@/components/sections/SystemMetadataCard";
import { SectionHeading, Badge } from "@/components/ui";

interface ContactDetailViewProps {
  entity: Contact;
  availableTags: Tag[];
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

const ContactDetailView: React.FC<ContactDetailViewProps> = ({
  entity,
  availableTags,
  linkedDocuments,
  allDocuments = [],
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

  const handleSaveEdit = (data: Partial<Contact>) => {
    onUpdateEntity("contact", entity.id, data);
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
      title={`${entity.firstName} ${entity.surname}`}
      typeLabel={
        entity.category?.replace(/([A-Z])/g, " $1").trim() || "Registry Entry"
      }
      description={
        entity.jobTitle || "Verified contact within the system infrastructure."
      }
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {entity.isEmergencyContact && (
            <div className="bg-[#b45c43] text-white p-6 rounded-[2rem] flex items-center justify-between shadow-xl shadow-[#b45c43]/20 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Siren size={24} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-tight leading-none">
                    Priority Dispatch Contact
                  </h3>
                  <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                    Active Emergency Console Entry
                  </p>
                </div>
              </div>
              <Badge
                color="text-[#b45c43]"
                bgColor="bg-white"
                borderColor="border-white"
                className="px-4 py-1.5 shadow-xl"
              >
                High Priority
              </Badge>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
            <SectionHeading label="Correspondence & Connectivity" icon={Mail} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2">
              <div className="space-y-8">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Email Protocol
                    </p>
                    <p className="text-lg font-black text-slate-900 tracking-tight select-all">
                      {entity.email || "Private Registry"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Direct Communication
                    </p>
                    <p className="text-lg font-black text-slate-900 tracking-tight select-all">
                      {entity.phone || "Manual Link Required"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Digital Presence
                    </p>
                    <a
                      href={entity.websiteUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-black text-indigo-600 hover:underline transition-all tracking-tight block"
                    >
                      {entity.websiteUrl
                        ? entity.websiteUrl.replace("https://", "")
                        : "No Portal Defined"}
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Organizational Scope
                    </p>
                    <p className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                      {entity.company || "Private Professional"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commercial Data (Moved from Sidebar) */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm relative overflow-hidden">
            <SectionHeading
              label="Commercial Data & Verification"
              icon={DollarSign}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2">
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Client Satisfaction Score
                  </p>
                  <div className="flex items-center space-x-2">
                    {entity.rating ? (
                      <>
                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < entity.rating!
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm font-black text-slate-900 ml-1">
                          {entity.rating}.0 / 5.0
                        </span>
                      </>
                    ) : (
                      <Badge color="text-slate-400" bgColor="bg-slate-50">
                        Unrated / Personal
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Compliance Audit
                  </p>
                  <div className="flex items-center space-x-3 text-[#5a6b5d] font-black text-lg">
                    <ShieldCheck size={20} />
                    <span>Verified Registry Member</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] shadow-inner text-center md:text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Billable Engagement Rate
                  </p>
                  <div className="flex items-baseline space-x-2 text-slate-900 font-black tracking-tighter justify-center md:justify-start">
                    <span className="text-4xl">
                      {entity.hourlyRate
                        ? entity.hourlyRate.toLocaleString()
                        : "--"}
                    </span>
                    <span className="text-sm uppercase text-slate-400">
                      / hr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities & Domain */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
            <div className="flex items-center justify-between">
              <SectionHeading
                label="Expertise & Technical Domain"
                icon={Hammer}
              />
              <Badge color="text-indigo-600" bgColor="bg-indigo-50">
                Expert Level
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <Award size={12} className="mr-2" /> Verified Skillsets
                </p>
                <div className="flex flex-wrap gap-2">
                  {entity.specialties?.map((s) => (
                    <span
                      key={s}
                      className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-tight flex items-center space-x-2 shadow-lg shadow-slate-200 transition-transform hover:scale-105"
                    >
                      <CheckCircle2 size={12} className="text-[#5a6b5d]" />
                      <span>{s}</span>
                    </span>
                  ))}
                  {(!entity.specialties || entity.specialties.length === 0) && (
                    <p className="text-sm font-bold text-slate-300 italic">
                      No technical tags assigned.
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <HardHat size={12} className="mr-2" /> Professional
                  Verification
                </p>
                <div className="space-y-4">
                  {entity.certificationId ? (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        License / ID
                      </p>
                      <p className="text-sm font-black text-slate-900 select-all font-mono">
                        {entity.certificationId}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-slate-300 italic">
                      No professional license ID provided.
                    </p>
                  )}
                  <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                    "Trade certifications and liability documents are linked in
                    the digital repository."
                  </p>
                </div>
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
          <NotesSection
            notes={entity.notes || []}
            onAddNote={onAddNote}
            onUpdateNote={onUpdateNote}
            onDeleteNote={onDeleteNote}
          />
        </div>
      </div>

      <ContactModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={entity}
        availableTags={availableTags}
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
                  Scrub Registry Profile?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Removing{" "}
                  <strong>
                    {entity.firstName} {entity.surname}
                  </strong>{" "}
                  will purge their history and unassign them from all
                  maintenance dependencies.
                </p>
              </div>
              <div className="flex flex-col space-y-3 pt-2">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 bg-[#b45c43] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#9d4b35] transition-all shadow-xl shadow-[#b45c43]/20 active:scale-[0.98]"
                >
                  Confirm Removal
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

export default ContactDetailView;
