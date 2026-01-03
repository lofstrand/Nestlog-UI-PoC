import React, { useState, useMemo } from "react";
import {
  Zap,
  Droplets,
  Flame,
  Globe,
  Wind,
  User,
  DollarSign,
  MapPin,
  History,
  ExternalLink,
  AlertTriangle,
  Phone,
  Cable,
  Radio,
  Shield,
  Sun,
  Trash2,
  Receipt,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Calculator,
  Settings2,
  Info,
  Calendar,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  UtilityAccount,
  Contact,
  Space,
  Tag,
  Document,
  UtilityInvoice,
} from "../types";
import DetailLayout from "./DetailLayout";
import NotesSection from "./NotesSection";
import TagsSection from "./TagsSection";
import AttachmentsSection from "./AttachmentsSection";
// Fixed: Added missing Input to imports from UIPrimitives to resolve 'Cannot find name' error on line 237
import {
  SectionHeading,
  Badge,
  Button as UIButton,
  Input,
} from "./UIPrimitives";
import UtilityAccountModal from "./UtilityAccountModal";
import SystemMetadataCard from "./SystemMetadataCard";

interface UtilityDetailViewProps {
  entity: UtilityAccount;
  availableTags: Tag[];
  availableSpaces: Space[];
  availableContacts: Contact[];
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
  onQuickAddContact?: (data: Partial<Contact>) => Promise<string>;
  onNavigateToEntity?: (type: string, id: string) => void;
}

const UtilityDetailView: React.FC<UtilityDetailViewProps> = ({
  entity,
  availableTags,
  availableSpaces,
  availableContacts,
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
  onQuickAddContact,
  onNavigateToEntity,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [newInvoiceAmount, setNewInvoiceAmount] = useState("");
  const [newInvoiceDate, setNewInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newInvoiceNote, setNewInvoiceNote] = useState("");

  const invoices = entity.invoices || [];

  const calculatedAverage = useMemo(() => {
    if (invoices.length === 0) return 0;
    const sum = invoices.reduce((acc, inv) => acc + inv.amount, 0);
    return Math.round((sum / invoices.length) * 100) / 100;
  }, [invoices]);

  const trend = useMemo(() => {
    if (invoices.length < 2) return null;
    const latest = invoices[0].amount;
    const previous = invoices[1].amount;
    const diff = latest - previous;
    const percent = Math.round((diff / previous) * 100);
    return {
      diff,
      percent,
      direction: diff > 0 ? "up" : diff < 0 ? "down" : "neutral",
    };
  }, [invoices]);

  const displayAverage = entity.useCalculatedAverage
    ? calculatedAverage
    : entity.averageMonthlyCost;
  const provider = availableContacts.find((c) => c.id === entity.providerId);
  const meterSpace = availableSpaces.find((s) => s.id === entity.spaceId);

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

  const getThemeColor = (type: string) => {
    switch (type) {
      case "Electricity":
        return { primary: "text-amber-500", accent: "amber", icon: Zap };
      case "Water":
        return { primary: "text-blue-500", accent: "blue", icon: Droplets };
      case "Gas":
        return { primary: "text-orange-500", accent: "orange", icon: Flame };
      case "Heating":
        return { primary: "text-orange-400", accent: "orange", icon: Sun };
      case "Internet":
        return { primary: "text-indigo-500", accent: "indigo", icon: Globe };
      case "Mobile":
        return { primary: "text-blue-400", accent: "blue", icon: Radio };
      case "Security":
        return { primary: "text-red-500", accent: "red", icon: Shield };
      case "Cable TV":
        return { primary: "text-purple-500", accent: "purple", icon: Cable };
      default:
        return { primary: "text-slate-400", accent: "slate", icon: Wind };
    }
  };

  const theme = getThemeColor(entity.type);

  const handleAddInvoice = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newInvoiceAmount) return;

    const newInvoice: UtilityInvoice = {
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(newInvoiceAmount),
      dueDateUtc: new Date(newInvoiceDate).toISOString(),
      note: newInvoiceNote || undefined,
    };

    const updatedInvoices = [newInvoice, ...invoices].sort(
      (a, b) =>
        new Date(b.dueDateUtc).getTime() - new Date(a.dueDateUtc).getTime()
    );

    onUpdateEntity("utility", entity.id, {
      invoices: updatedInvoices,
      lastPaymentDate: updatedInvoices[0]?.dueDateUtc.split("T")[0],
    });

    setNewInvoiceAmount("");
    setNewInvoiceNote("");
    setIsAddingInvoice(false);
  };

  const removeInvoice = (id: string) => {
    const updatedInvoices = invoices.filter((i) => i.id !== id);
    onUpdateEntity("utility", entity.id, { invoices: updatedInvoices });
  };

  const handleToggleAverageMode = () => {
    onUpdateEntity("utility", entity.id, {
      useCalculatedAverage: !entity.useCalculatedAverage,
    });
  };

  return (
    <DetailLayout
      title={entity.title || `${entity.type} Account`}
      typeLabel="Utility Register"
      description={`Monitoring of ${entity.type.toLowerCase()} infrastructure and consumption trends.`}
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* FINANCIAL HERO CARD */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-1 shadow-sm overflow-hidden">
            <div className="p-8 md:p-10 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg`}
                  >
                    <theme.icon size={20} strokeWidth={2.5} />
                  </div>
                  <SectionHeading
                    label="Consumption Metrics"
                    icon={DollarSign}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleAverageMode}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest ${
                      entity.useCalculatedAverage
                        ? "bg-indigo-900 border-indigo-900 text-white shadow-lg"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-white"
                    }`}
                  >
                    <Calculator size={12} />
                    <span>
                      {entity.useCalculatedAverage
                        ? "Rolling Average"
                        : "Static Baseline"}
                    </span>
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                  >
                    <Settings2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Monthly Burn Rate
                  </p>
                  <div className="flex items-baseline space-x-3">
                    <span
                      className={`text-6xl font-black tracking-tighter ${
                        entity.useCalculatedAverage
                          ? "text-indigo-900"
                          : "text-slate-900"
                      }`}
                    >
                      $
                      {displayAverage.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                      })}
                    </span>
                    <span className="text-lg font-black text-slate-300 tracking-tight">
                      / mo
                    </span>
                  </div>
                  {trend && (
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${
                        trend.direction === "up"
                          ? "bg-rose-50 border-rose-100 text-rose-600"
                          : "bg-emerald-50 border-emerald-100 text-emerald-600"
                      }`}
                    >
                      {trend.direction === "up" ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {trend.percent}% vs previous
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] transition-opacity">
                      <theme.icon size={80} />
                    </div>
                    <div className="space-y-1 relative z-10">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        Active Provider
                      </p>
                      <p className="text-base font-black text-slate-900 truncate tracking-tight">
                        {provider?.company ||
                          provider?.firstName ||
                          "Private Vendor"}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        Acct: {entity.accountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 px-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      No Overdue Invoices
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT LEDGER */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
              <SectionHeading label="Transaction Ledger" icon={Receipt} />
              {!isAddingInvoice && (
                <button
                  onClick={() => setIsAddingInvoice(true)}
                  className="flex items-center space-x-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all active:scale-95"
                >
                  <Plus size={12} />
                  <span>Post Invoice</span>
                </button>
              )}
            </div>

            {isAddingInvoice && (
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-8 animate-in slide-in-from-top-4 duration-500 shadow-inner">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em]">
                    Ledger Entry
                  </p>
                  <button
                    onClick={() => setIsAddingInvoice(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleAddInvoice} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Invoice Total
                      </label>
                      <input
                        autoFocus
                        type="number"
                        step="0.01"
                        value={newInvoiceAmount}
                        onChange={(e) => setNewInvoiceAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-xl font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newInvoiceDate}
                        onChange={(e) => setNewInvoiceDate(e.target.value)}
                        className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <Input
                    label="Reference Note"
                    value={newInvoiceNote}
                    onChange={(e) => setNewInvoiceNote(e.target.value)}
                    placeholder="e.g. June Statement"
                  />
                  <div className="flex justify-end items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingInvoice(false)}
                      className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                      Cancel
                    </button>
                    <UIButton
                      type="submit"
                      disabled={!newInvoiceAmount}
                      size="sm"
                    >
                      Commit to Registry
                    </UIButton>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {invoices.length > 0 ? (
                <div className="border border-slate-100 rounded-[1.5rem] overflow-hidden divide-y divide-slate-50 bg-slate-50/10 shadow-inner">
                  {invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-6 flex items-center justify-between hover:bg-white transition-all group/row"
                    >
                      <div className="flex items-center space-x-8 min-w-0">
                        <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-100 shrink-0 shadow-sm group-hover/row:border-slate-300">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            {new Date(inv.dueDateUtc).toLocaleString(
                              "default",
                              { month: "short" }
                            )}
                          </span>
                          <span className="text-base font-black text-slate-900 tracking-tighter">
                            {new Date(inv.dueDateUtc).getDate()}
                          </span>
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl font-black text-slate-900 tracking-tighter">
                              $
                              {inv.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                            {inv.note && (
                              <span className="text-[9px] font-bold text-slate-400 italic truncate max-w-[200px]">
                                {inv.note}
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                            Processed:{" "}
                            {new Date(inv.dueDateUtc).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeInvoice(inv.id)}
                        className="p-2 text-slate-100 hover:text-[#b45c43] opacity-0 group-hover/row:opacity-100 transition-all active:scale-90"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
                  <Receipt size={32} className="opacity-10 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Registry Unpopulated
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-8 shadow-sm">
              <SectionHeading label="Support Details" icon={User} />
              <div className="flex items-start space-x-5">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-xl shrink-0 bg-slate-900`}
                >
                  <theme.icon size={28} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xl font-black text-slate-900 truncate tracking-tight leading-none">
                    {provider?.company ||
                      provider?.firstName ||
                      "Private Carrier"}
                  </h4>
                  <div className="mt-8 space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center text-xs font-bold text-slate-700">
                      <Phone size={14} className="mr-3 text-slate-300" />
                      <span className="select-all">
                        {provider?.phone || "No direct line"}
                      </span>
                    </div>
                    {provider?.websiteUrl && (
                      <a
                        href={provider.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center text-xs font-black hover:underline ${theme.primary}`}
                      >
                        <ExternalLink size={14} className="mr-3" />
                        Digital Portal
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-8 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 blueprint-grid opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
              <SectionHeading label="Registry Location" icon={MapPin} />
              <div className="flex items-center space-x-6 relative z-10">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner group-hover:bg-white transition-all">
                  <MapPin
                    size={28}
                    strokeWidth={1.5}
                    className="text-slate-300 group-hover:text-slate-900 transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Physical Site
                    </p>
                    <p className="text-xl font-black text-slate-900 leading-none">
                      {meterSpace?.name || "External Interface"}
                    </p>
                  </div>
                  {meterSpace && (
                    <button
                      onClick={() =>
                        onNavigateToEntity?.("space", meterSpace.id)
                      }
                      className="flex items-center space-x-2 text-[9px] font-black uppercase text-[#5a6b5d] hover:underline"
                    >
                      <span>View Floorplan</span>
                      <ArrowRight size={10} />
                    </button>
                  )}
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
          <AttachmentsSection
            linkedDocuments={linkedDocuments}
            onAddAttachment={onAddAttachment}
          />
          <NotesSection notes={entity.notes || []} onAddNote={onAddNote} />
        </div>
      </div>

      <UtilityAccountModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        availableContacts={availableContacts}
        availableSpaces={availableSpaces}
        initialData={entity}
        onSave={(data) => {
          onUpdateEntity("utility", entity.id, data);
          setIsEditModalOpen(false);
        }}
        onQuickAddContact={onQuickAddContact}
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
                  Scrub Account?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Removing <strong>{entity.title || entity.type}</strong> will
                  purge all historical burn metrics and registry ledger entries.
                </p>
              </div>
              <div className="flex flex-col space-y-2 pt-2">
                <button
                  onClick={() => {
                    onDelete();
                    setIsDeleteConfirmOpen(false);
                  }}
                  className="w-full py-4 bg-[#b45c43] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#9d4b35] transition-all shadow-xl active:scale-[0.98]"
                >
                  Final Deletion
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98]"
                >
                  Keep Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DetailLayout>
  );
};

export default UtilityDetailView;
