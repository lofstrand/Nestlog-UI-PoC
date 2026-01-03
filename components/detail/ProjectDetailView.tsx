import React, { useState } from "react";
import {
  CheckCircle2,
  ListChecks,
  TrendingUp,
  Calendar,
  Layout,
  User,
  AlertTriangle,
  Plus,
  Activity,
  CornerDownRight,
  Trash2,
  X,
  BarChart3,
  Briefcase,
  Shield,
  CirclePlus,
  DollarSign,
  Receipt,
  History,
  Paperclip,
  FileText,
  ChevronDown,
} from "lucide-react";
import {
  Project,
  Tag,
  Document,
  Space,
  Contact,
  GalleryItem,
  ProjectTask,
  ProjectExpense,
} from "../../types";
import DetailLayout from "../layout/DetailLayout";
import NotesSection from "../sections/NotesSection";
import TagsSection from "../sections/TagsSection";
import AttachmentsSection from "../sections/AttachmentsSection";
import VisualArchive from "../sections/VisualArchive";
import GalleryModal from "../modals/GalleryModal";
import ProjectModal from "../modals/ProjectModal";
import SystemMetadataCard from "../sections/SystemMetadataCard";
import { SectionHeading, Badge, Button as UIButton } from "../ui/UIPrimitives";

interface ProjectDetailViewProps {
  entity: Project;
  availableTags: Tag[];
  linkedDocuments: Document[];
  allDocuments: Document[];
  availableSpaces: Space[];
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
  onUpdateEntity: (type: string, id: string, data: any) => void;
  onNavigateToEntity?: (type: string, id: string) => void;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  entity,
  availableTags,
  linkedDocuments,
  allDocuments,
  availableSpaces,
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
  onUpdateEntity,
  onNavigateToEntity,
}) => {
  const [activeTab, setActiveTab] = useState<"strategy" | "roadmap">(
    "strategy"
  );
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleLinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (current.includes(documentId)) return;
    onUpdateEntity("project", entity.id, {
      documentIds: [...current, documentId],
      updatedAtUtc: new Date().toISOString(),
    });
  };

  const handleUnlinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (!current.includes(documentId)) return;
    onUpdateEntity("project", entity.id, {
      documentIds: current.filter((id) => id !== documentId),
      updatedAtUtc: new Date().toISOString(),
    });
  };

  // Roadmap UX States
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [newPhaseTitle, setNewPhaseTitle] = useState("");
  const [addingTaskToId, setAddingTaskToId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Financial UX States
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpenseTitle, setNewExpenseTitle] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseDocId, setNewExpenseDocId] = useState("");

  const expenses = entity.expenses || [];
  const budget = entity.budget || 0;
  const actual =
    expenses.length > 0
      ? expenses.reduce((acc, exp) => acc + exp.amount, 0)
      : entity.actualCost || 0;

  const variance = budget - actual;
  const isOverBudget = variance < 0;
  const burnRate = budget > 0 ? (actual / budget) * 100 : 0;

  const linkedSpaces = availableSpaces.filter((s) =>
    entity.spaceIds?.includes(s.id)
  );
  const linkedContact = availableContacts.find(
    (c) => c.id === entity.assignedContactId
  );

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
    onUpdateEntity("project", entity.id, {
      gallery: [...(entity.gallery || []), newItem],
    });
  };

  const handleSaveEdit = (data: Partial<Project>) => {
    onUpdateEntity("project", entity.id, data);
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

  // --- ROADMAP LOGIC ---
  const handleAddPhase = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newPhaseTitle.trim()) {
      setIsAddingPhase(false);
      return;
    }

    const newPhase: ProjectTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newPhaseTitle.trim(),
      isCompleted: false,
      subtasks: [],
    };

    onUpdateEntity("project", entity.id, {
      tasks: [...(entity.tasks || []), newPhase],
    });
    setNewPhaseTitle("");
    setIsAddingPhase(false);
  };

  const handleAddTask = (parentId: string, e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskTitle.trim()) {
      setAddingTaskToId(null);
      return;
    }

    const newTask: ProjectTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle.trim(),
      isCompleted: false,
    };

    const updatedPhases = (entity.tasks || []).map((p) => {
      if (p.id === parentId) {
        return {
          ...p,
          subtasks: [...(p.subtasks || []), newTask],
        };
      }
      return p;
    });

    onUpdateEntity("project", entity.id, { tasks: updatedPhases });
    setNewTaskTitle("");
    setAddingTaskToId(null);
  };

  const togglePhase = (phaseId: string) => {
    const updatedPhases = (entity.tasks || []).map((p) =>
      p.id === phaseId ? { ...p, isCompleted: !p.isCompleted } : p
    );
    onUpdateEntity("project", entity.id, { tasks: updatedPhases });
  };

  const toggleTask = (phaseId: string, taskId: string) => {
    const updatedPhases = (entity.tasks || []).map((p) => {
      if (p.id === phaseId) {
        return {
          ...p,
          subtasks: (p.subtasks || []).map((t) =>
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
          ),
        };
      }
      return p;
    });
    onUpdateEntity("project", entity.id, { tasks: updatedPhases });
  };

  const removePhase = (phaseId: string) => {
    const updatedPhases = (entity.tasks || []).filter((p) => p.id !== phaseId);
    onUpdateEntity("project", entity.id, { tasks: updatedPhases });
  };

  const removeTask = (phaseId: string, taskId: string) => {
    const updatedPhases = (entity.tasks || []).map((p) => {
      if (p.id === phaseId) {
        return {
          ...p,
          subtasks: (p.subtasks || []).filter((t) => t.id !== taskId),
        };
      }
      return p;
    });
    onUpdateEntity("project", entity.id, { tasks: updatedPhases });
  };

  // --- FINANCIAL LEDGER LOGIC ---
  const handleAddExpense = (e?: React.FormEvent) => {
    e?.preventDefault();
    const amountNum = parseFloat(newExpenseAmount);
    if (!newExpenseTitle.trim() || isNaN(amountNum)) {
      setIsAddingExpense(false);
      return;
    }

    const newExpense: ProjectExpense = {
      id: Math.random().toString(36).substr(2, 9),
      title: newExpenseTitle.trim(),
      amount: amountNum,
      dateUtc: new Date().toISOString(),
      documentId: newExpenseDocId || undefined,
    };

    const updatedExpenses = [...expenses, newExpense];
    onUpdateEntity("project", entity.id, {
      expenses: updatedExpenses,
      actualCost: updatedExpenses.reduce((acc, exp) => acc + exp.amount, 0),
    });

    setNewExpenseTitle("");
    setNewExpenseAmount("");
    setNewExpenseDocId("");
    setIsAddingExpense(false);
  };

  const removeExpense = (id: string) => {
    const updatedExpenses = expenses.filter((e) => e.id !== id);
    onUpdateEntity("project", entity.id, {
      expenses: updatedExpenses,
      actualCost: updatedExpenses.reduce((acc, exp) => acc + exp.amount, 0),
    });
  };

  const getRoadmapProgress = () => {
    const phases = entity.tasks || [];
    if (phases.length === 0) return 0;

    const sliceWeight = 100 / phases.length;
    let totalProgress = 0;
    let previousPhaseGated = false;

    phases.forEach((phase) => {
      if (previousPhaseGated) return;
      if (phase.isCompleted) {
        totalProgress += sliceWeight;
      } else {
        const tasks = phase.subtasks || [];
        if (tasks.length > 0) {
          const completedTasks = tasks.filter((t) => t.isCompleted).length;
          const taskProgress = (completedTasks / tasks.length) * sliceWeight;
          totalProgress += taskProgress;
        }
        previousPhaseGated = true;
      }
    });
    return Math.min(100, totalProgress);
  };

  return (
    <DetailLayout
      title={entity.title}
      typeLabel="Renovation Initiative"
      description={
        entity.description ||
        "Systematic coordination of property improvements."
      }
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="flex space-x-1 p-1 bg-slate-100/50 rounded-2xl border border-slate-100 w-fit mb-8">
        <button
          onClick={() => setActiveTab("strategy")}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "strategy"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <BarChart3 size={16} />
          <span>Executive Summary</span>
        </button>
        <button
          onClick={() => setActiveTab("roadmap")}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "roadmap"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <ListChecks size={16} />
          <span>Implementation Roadmap</span>
          <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black">
            {entity.tasks?.length || 0}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "strategy" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
              {/* Execution Config */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-8 shadow-sm">
                <SectionHeading
                  label="Execution Configuration"
                  icon={Activity}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Workflow State
                      </p>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            entity.status === "Completed"
                              ? "bg-[#5a6b5d]"
                              : "bg-[#a47148] animate-pulse"
                          }`}
                        ></div>
                        <span className="text-xl font-black text-slate-900 tracking-tight">
                          {entity.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Lead Contractor
                      </p>
                      <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {linkedContact
                              ? `${linkedContact.firstName} ${linkedContact.surname}`
                              : "Self Managed"}
                          </p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {linkedContact?.company || "Internal Resource"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Execution Timeline
                      </p>
                      <div className="flex items-center text-slate-900 font-black text-xl tracking-tight">
                        <Calendar size={18} className="mr-3 text-[#a47148]" />
                        {entity.startDate || "TBD"} — {entity.endDate || "TBD"}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Targeted Locations
                      </p>
                      {linkedSpaces.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {linkedSpaces.map((s) => (
                            <Badge
                              key={s.id}
                              color="text-slate-600"
                              bgColor="bg-slate-50"
                              borderColor="border-slate-200"
                              className="px-3 py-1"
                            >
                              {s.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-slate-400 italic">
                          Global Scope
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Audit */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-1.5 h-full ${
                    isOverBudget ? "bg-[#b45c43]" : "bg-[#5a6b5d]"
                  }`}
                />
                <div className="mb-4">
                  <SectionHeading icon={TrendingUp} label="Financial Audit" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Total Budget
                    </p>
                    <p className="text-xl font-black text-slate-900 tracking-tighter">
                      ${budget.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Disbursed Funds
                    </p>
                    <p
                      className={`text-xl font-black tracking-tighter ${
                        isOverBudget ? "text-[#b45c43]" : "text-slate-900"
                      }`}
                    >
                      ${actual.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Variance
                    </p>
                    <div className="flex items-center space-x-2">
                      <p
                        className={`text-xl font-black tracking-tighter ${
                          isOverBudget ? "text-[#b45c43]" : "text-[#5a6b5d]"
                        }`}
                      >
                        ${Math.abs(variance).toLocaleString()}
                      </p>
                      {isOverBudget && (
                        <AlertTriangle size={14} className="text-[#b45c43]" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Budget Utilization</span>
                    <span
                      className={
                        isOverBudget ? "text-[#b45c43]" : "text-[#5a6b5d]"
                      }
                    >
                      {burnRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        isOverBudget ? "bg-[#b45c43]" : "bg-[#5a6b5d]"
                      }`}
                      style={{ width: `${Math.min(100, burnRate)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* FINANCIAL LEDGER */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <SectionHeading label="Project Ledger" icon={Receipt} />
                  {!isAddingExpense && (
                    <button
                      onClick={() => setIsAddingExpense(true)}
                      className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center space-x-1 hover:text-indigo-700 transition-colors"
                    >
                      <Plus size={10} /> <span>Record Cost</span>
                    </button>
                  )}
                </div>

                {isAddingExpense ? (
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] space-y-5 animate-in slide-in-from-top-2 duration-300 shadow-inner">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                        New Transaction
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsAddingExpense(false)}
                        className="text-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Description
                          </label>
                          <input
                            autoFocus
                            placeholder="e.g. Copper Piping"
                            value={newExpenseTitle}
                            onChange={(e) => setNewExpenseTitle(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Amount
                          </label>
                          <div className="relative">
                            <DollarSign
                              size={14}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                            />
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={newExpenseAmount}
                              onChange={(e) =>
                                setNewExpenseAmount(e.target.value)
                              }
                              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                          <Paperclip size={10} className="mr-1.5" /> Link
                          digital proof (optional)
                        </label>
                        <div className="relative group">
                          <select
                            value={newExpenseDocId}
                            onChange={(e) => setNewExpenseDocId(e.target.value)}
                            className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm cursor-pointer"
                          >
                            <option value="">No Document Linked</option>
                            {allDocuments.map((doc) => (
                              <option key={doc.id} value={doc.id}>
                                {doc.title}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingExpense(false)}
                          className="px-5 py-2.5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all active:scale-95 disabled:opacity-30"
                          disabled={!newExpenseTitle || !newExpenseAmount}
                        >
                          Post to Ledger
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.length > 0 ? (
                      <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50 shadow-sm">
                        {expenses.map((expense) => {
                          const doc = allDocuments.find(
                            (d) => d.id === expense.documentId
                          );
                          return (
                            <div
                              key={expense.id}
                              className="p-4 bg-white flex items-center justify-between group hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center space-x-4 min-w-0">
                                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors shrink-0">
                                  <History size={16} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-800 tracking-tight truncate">
                                    {expense.title}
                                  </p>
                                  <div className="flex items-center space-x-3 mt-0.5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                      {new Date(
                                        expense.dateUtc
                                      ).toLocaleDateString()}
                                    </p>
                                    {doc && (
                                      <button
                                        onClick={() =>
                                          onNavigateToEntity?.(
                                            "document",
                                            doc.id
                                          )
                                        }
                                        className="flex items-center space-x-1 text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                                      >
                                        <Paperclip size={10} />
                                        <span className="truncate max-w-[120px]">
                                          View Receipt
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-6 shrink-0">
                                <span className="text-sm font-black text-slate-900">
                                  ${expense.amount.toLocaleString()}
                                </span>
                                <button
                                  onClick={() => removeExpense(expense.id)}
                                  className="p-1.5 text-slate-200 hover:text-[#b45c43] opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-12 border-2 border-dashed border-slate-100 rounded-[1.5rem] bg-slate-50/30 flex flex-col items-center justify-center text-slate-300">
                        <Receipt size={32} className="mb-2 opacity-10" />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em]">
                          No Ledger Entries Found
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 mt-1">
                          Record individual material or labor costs here.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
                <VisualArchive
                  items={entity.gallery || []}
                  onAddItem={() => setIsGalleryModalOpen(true)}
                  onDeleteItem={(id) =>
                    onUpdateEntity("project", entity.id, {
                      gallery: (entity.gallery || []).filter(
                        (i) => i.id !== id
                      ),
                    })
                  }
                />
              </div>
            </div>
          ) : (
            /* IMPLEMENTATION ROADMAP TAB */
            <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
                <div className="flex items-center justify-between">
                  <SectionHeading
                    icon={ListChecks}
                    label="Implementation Roadmap"
                  />
                  <Badge color="text-[#5a6b5d]" bgColor="bg-[#f2f4f2]">
                    {getRoadmapProgress().toFixed(0)}% Overall Progress
                  </Badge>
                </div>

                <div className="space-y-10">
                  {entity.tasks?.map((phase: any) => (
                    <div key={phase.id} className="space-y-4">
                      <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-[2rem] group hover:bg-white hover:border-slate-400 hover:shadow-xl transition-all">
                        <button
                          onClick={() => togglePhase(phase.id)}
                          className="flex items-center space-x-5 flex-1 text-left"
                        >
                          {phase.isCompleted ? (
                            <div className="w-6 h-6 bg-[#5a6b5d] text-white rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle2 size={18} />
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-slate-300 rounded-full bg-white group-hover:border-slate-800 transition-colors" />
                          )}
                          <div>
                            <span
                              className={`text-xl font-black tracking-tight block ${
                                phase.isCompleted
                                  ? "text-slate-300 line-through"
                                  : "text-slate-900"
                              }`}
                            >
                              {phase.title}
                            </span>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mt-0.5">
                              Project Phase
                            </p>
                          </div>
                        </button>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => {
                              setAddingTaskToId(phase.id);
                              setNewTaskTitle("");
                            }}
                            className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="Add Task"
                          >
                            <Plus size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => removePhase(phase.id)}
                            className="p-2.5 text-slate-300 hover:text-[#b45c43] hover:bg-[#fdf3f0] rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="ml-14 space-y-3 relative before:absolute before:left-[-1.5rem] before:top-0 before:bottom-4 before:w-px before:bg-slate-100">
                        {phase.subtasks?.map((task: any) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group/task hover:border-slate-300 hover:shadow-md transition-all"
                          >
                            <button
                              onClick={() => toggleTask(phase.id, task.id)}
                              className="flex items-center space-x-4 flex-1 text-left"
                            >
                              <div className="flex items-center justify-center text-slate-200">
                                <CornerDownRight size={14} />
                              </div>
                              {task.isCompleted || phase.isCompleted ? (
                                <CheckCircle2
                                  size={18}
                                  className={
                                    phase.isCompleted
                                      ? "text-slate-300"
                                      : "text-[#5a6b5d]"
                                  }
                                />
                              ) : (
                                <div className="w-4.5 h-4.5 border-2 border-slate-200 rounded-full" />
                              )}
                              <span
                                className={`text-sm font-bold tracking-tight ${
                                  task.isCompleted || phase.isCompleted
                                    ? "text-slate-300 line-through"
                                    : "text-slate-700"
                                }`}
                              >
                                {task.title}
                              </span>
                            </button>
                            <button
                              onClick={() => removeTask(phase.id, task.id)}
                              className="p-1.5 text-slate-200 hover:text-[#b45c43] opacity-0 group-hover/task:opacity-100 transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}

                        {addingTaskToId === phase.id ? (
                          <div className="flex items-center space-x-3 p-2 animate-in slide-in-from-left-2 duration-300">
                            <CornerDownRight
                              size={14}
                              className="text-slate-300 ml-1"
                            />
                            <form
                              onSubmit={(e) => handleAddTask(phase.id, e)}
                              className="flex-1 flex items-center space-x-2"
                            >
                              <input
                                autoFocus
                                placeholder="Define task..."
                                value={newTaskTitle}
                                onChange={(e) =>
                                  setNewTaskTitle(e.target.value)
                                }
                                onBlur={() =>
                                  !newTaskTitle && setAddingTaskToId(null)
                                }
                                className="flex-1 bg-transparent border-b border-indigo-200 py-1 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 transition-all"
                              />
                              <button
                                type="submit"
                                className="text-indigo-600 font-black text-[10px] uppercase tracking-widest"
                              >
                                Add
                              </button>
                            </form>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setAddingTaskToId(phase.id);
                              setNewTaskTitle("");
                            }}
                            className="ml-10 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-indigo-600 flex items-center space-x-2 transition-colors py-2"
                          >
                            <Plus size={12} strokeWidth={3} />
                            <span>Add Implementation Task</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-6 border-t border-slate-50">
                    {isAddingPhase ? (
                      <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl animate-in slide-in-from-bottom-2 duration-300 relative group">
                        <div className="absolute top-8 left-0 w-1 h-12 bg-slate-900 rounded-r-full" />
                        <form onSubmit={handleAddPhase} className="space-y-6">
                          <div className="space-y-1 ml-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                              Initialize Phase
                            </label>
                            <input
                              autoFocus
                              placeholder="Enter phase title (e.g. Structural Foundations)..."
                              value={newPhaseTitle}
                              onChange={(e) => setNewPhaseTitle(e.target.value)}
                              className="w-full bg-transparent border-b-2 border-slate-100 py-3 text-2xl font-black text-slate-900 focus:outline-none focus:border-slate-900 transition-all placeholder:text-slate-200"
                            />
                          </div>
                          <div className="flex items-center justify-end space-x-4">
                            <button
                              type="button"
                              onClick={() => setIsAddingPhase(false)}
                              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                            >
                              Dismiss
                            </button>
                            <button
                              type="submit"
                              disabled={!newPhaseTitle.trim()}
                              className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
                            >
                              Register Phase
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAddingPhase(true)}
                        className="w-full py-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center space-y-3 text-slate-300 hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50 transition-all group"
                      >
                        <CirclePlus
                          size={36}
                          strokeWidth={1.5}
                          className="group-hover:scale-110 group-hover:rotate-90 transition-transform duration-500"
                        />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                          Add Project Phase
                        </span>
                      </button>
                    )}
                  </div>

                  {(!entity.tasks || entity.tasks.length === 0) &&
                    !isAddingPhase && (
                      <div className="py-24 flex flex-col items-center justify-center text-slate-300">
                        <ListChecks size={64} className="mb-6 opacity-10" />
                        <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">
                          Roadmap Unpopulated
                        </p>
                        <p className="text-xs font-medium text-slate-400 mt-2">
                          Initialize the implementation plan by defining your
                          first phase above.
                        </p>
                      </div>
                    )}
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

      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={entity}
        availableSpaces={availableSpaces}
        availableContacts={availableContacts}
      />

      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onSave={handleAddMedia}
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
                  Purge Project?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Removing <strong>{entity.title}</strong> will erase all
                  roadmap data, financial burn metrics, and linked architectural
                  documents.
                </p>
              </div>
              <div className="flex flex-col space-y-3 pt-2">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 bg-[#b45c43] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#9d4b35] transition-all shadow-xl shadow-[#b45c43]/20 active:scale-[0.98]"
                >
                  Confirm Deletion
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

export default ProjectDetailView;
