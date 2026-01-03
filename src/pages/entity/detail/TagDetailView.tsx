import React, { useState } from "react";
import {
  Tags,
  BarChart2,
  Info,
  Box,
  Wrench,
  FolderOpen,
  Layers,
  Users,
  ShieldCheck,
  Zap,
  AlertTriangle,
} from "lucide-react";
import {
  Tag as TagType,
  InventoryItem,
  InventoryCategory,
  Household,
  InsurancePolicy,
  UtilityAccount,
  MaintenanceTask,
  Project,
  Space,
  Contact,
  Property,
} from "../../../types";
import DetailLayout from "../../../layouts/DetailLayout";
import TagModal from "@/features/tags/components/TagModal";
import SystemMetadataCard from "../../../components/sections/SystemMetadataCard";
import { SectionHeading, Badge } from "../../../components/ui/UIPrimitives";

interface TagDetailViewProps {
  entity: TagType;
  availableTags: TagType[];
  allInventory?: InventoryItem[];
  allCategories?: InventoryCategory[];
  allHouseholds?: Household[];
  allInsurance?: InsurancePolicy[];
  allUtilities?: UtilityAccount[];
  availableTasks?: MaintenanceTask[];
  availableProjects?: Project[];
  availableSpaces?: Space[];
  availableContacts?: Contact[];
  allProperties?: Property[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (text: string) => void;
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
  onUpdateEntity: (type: string, id: string, data: any) => void;
}

const TagDetailView: React.FC<TagDetailViewProps> = ({
  entity,
  onBack,
  onEdit: _onEdit,
  onDelete,
  onAddNote,
  onUpdateEntity,
  allInventory,
  allCategories,
  allHouseholds,
  allInsurance,
  allUtilities,
  availableTasks,
  availableProjects,
  availableSpaces,
  availableContacts,
  allProperties,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleSaveEdit = (data: Partial<TagType>) => {
    onUpdateEntity("tag", entity.id, data);
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

  const normalizedTagName = entity.name;
  const computedInventory = (allInventory || []).filter((i) =>
    (i.tags || []).includes(normalizedTagName)
  );
  const computedInventoryCategories = (allCategories || []).filter((c) =>
    (c.tags || []).includes(normalizedTagName)
  );
  const computedHouseholds = (allHouseholds || []).filter((h) =>
    (h.tags || []).includes(normalizedTagName)
  );
  const computedInsurance = (allInsurance || []).filter((p) =>
    (p.tags || []).includes(normalizedTagName)
  );
  const computedUtilities = (allUtilities || []).filter((u) =>
    (u.tags || []).includes(normalizedTagName)
  );
  const computedTasks = (availableTasks || []).filter((t) =>
    (t.tags || []).includes(normalizedTagName)
  );
  const computedProjects = (availableProjects || []).filter((p) =>
    (p.tags || []).includes(normalizedTagName)
  );
  const computedSpaces = (availableSpaces || []).filter((s) =>
    (s.tags || []).includes(normalizedTagName)
  );
  const computedContacts = (availableContacts || []).filter((c) =>
    (c.tags || []).includes(normalizedTagName)
  );
  const computedProperties = (allProperties || []).filter((p) =>
    (p.tags || []).includes(normalizedTagName)
  );

  const totalLinkedEntities =
    computedInventory.length +
    computedInventoryCategories.length +
    computedHouseholds.length +
    computedInsurance.length +
    computedUtilities.length +
    computedTasks.length +
    computedProjects.length +
    computedSpaces.length +
    computedContacts.length +
    computedProperties.length;

  return (
    <DetailLayout
      title={entity.name}
      typeLabel="Global Index Tag"
      description="Cross-platform classification label used for granular data organization."
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm relative overflow-hidden">
            <SectionHeading label="Tag Overview" icon={Tags} />
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
              <Tags size={200} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 relative z-10">
              <div className="space-y-4">
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-inner space-y-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: entity.colorHex || "#1e293b" }}
                  >
                    <Tags size={26} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Color
                    </p>
                    <Badge
                      color="text-slate-500"
                      bgColor="bg-white"
                      borderColor="border-slate-200"
                      className="font-mono tracking-tighter w-fit"
                    >
                      {entity.colorHex?.toUpperCase() || "DEFAULT"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Defined Identifier
                  </p>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                    {entity.name}
                  </h2>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <SectionHeading
                    label="Label Intent & Guidelines"
                    icon={Info}
                  />
                  <p className="text-slate-700 leading-relaxed text-lg font-medium">
                    {entity.description ||
                      "No formal usage guidelines have been defined for this index tag. Define constraints to ensure consistent household classification."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
              <SectionHeading label="Linked Entities" icon={FolderOpen} />
              <Badge
                color="text-slate-400"
                bgColor="bg-slate-50"
                borderColor="border-slate-100"
              >
                {totalLinkedEntities} Total Links
              </Badge>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Inventory Categories",
                    icon: Layers,
                    count: computedInventoryCategories.length,
                  },
                  {
                    label: "Inventory Assets",
                    icon: Box,
                    count: computedInventory.length,
                  },
                  {
                    label: "Service Tasks",
                    icon: Wrench,
                    count: computedTasks.length,
                  },
                {
                  label: "Active Projects",
                  icon: FolderOpen,
                  count: computedProjects.length,
                },
                { label: "Spaces", icon: Layers, count: computedSpaces.length },
                {
                  label: "Contacts",
                  icon: Users,
                  count: computedContacts.length,
                },
                {
                  label: "Properties",
                  icon: Layers,
                  count: computedProperties.length,
                },
                {
                  label: "Households",
                  icon: Users,
                  count: computedHouseholds.length,
                },
                {
                  label: "Insurance",
                  icon: ShieldCheck,
                  count: computedInsurance.length,
                },
                {
                  label: "Utilities",
                  icon: Zap,
                  count: computedUtilities.length,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                      <row.icon size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 truncate">
                      {row.label}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-12">
          <SystemMetadataCard rows={metadataRows} />
        </div>
      </div>

      <TagModal
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
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 text-center space-y-8">
              <div className="w-20 h-20 bg-[#fdf3f0] text-[#b45c43] rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                  Delete Index Tag?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Removing <strong>{entity.name}</strong> will permanently
                  delete this tag.
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

export default TagDetailView;
