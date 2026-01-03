import React, { useState } from "react";
import {
  ShieldCheck,
  User,
  Calendar,
  ExternalLink,
  AlertTriangle,
  MessageSquare,
  History,
  Plus,
  DollarSign,
  TrendingUp,
  X,
  CheckCircle,
  FileText,
  Hash,
  Mail,
  Phone,
  Globe,
  MessageCircle,
  Send,
  CreditCard,
  Banknote,
  RotateCcw,
  Clock,
  Paperclip,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  Box,
  Layout,
  Trash2,
  Check,
  Layers,
} from "lucide-react";
import {
  InsurancePolicy,
  Contact,
  Document,
  Tag,
  InsuranceClaim,
  ClaimActivity,
  ClaimCommunicationMode,
  Space,
  InventoryItem,
} from "../types";
import DetailLayout from "./DetailLayout";
import NotesSection from "./NotesSection";
import TagsSection from "./TagsSection";
import AttachmentsSection from "./AttachmentsSection";
import {
  SectionHeading,
  Badge,
  Button as UIButton,
  Input,
} from "./UIPrimitives";
import InsurancePolicyModal from "./InsurancePolicyModal";
import DocumentPreview from "./DocumentPreview";
import SystemMetadataCard from "./SystemMetadataCard";

interface InsuranceDetailViewProps {
  entity: InsurancePolicy;
  availableTags: Tag[];
  availableContacts: Contact[];
  linkedDocuments: Document[];
  allDocuments: Document[];
  availableSpaces: Space[];
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
  onQuickUploadDoc?: (title: string, file: any) => Promise<string>;
  onQuickAddContact?: (data: Partial<Contact>) => Promise<string>;
  onNavigateToEntity?: (type: string, id: string) => void;
}

const COMMUNICATION_MODES: ClaimCommunicationMode[] = [
  "Email",
  "Phone",
  "Portal",
  "In-Person",
  "Mail",
  "Text",
];

const InsuranceDetailView: React.FC<InsuranceDetailViewProps> = ({
  entity,
  availableTags,
  availableContacts,
  linkedDocuments,
  allDocuments,
  availableSpaces,
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
  onQuickUploadDoc,
  onQuickAddContact,
  onNavigateToEntity,
}) => {
  const [activeTab, setActiveTab] = useState<"policy" | "claims">("policy");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleLinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (current.includes(documentId)) return;
    onUpdateEntity("insurance", entity.id, {
      documentIds: [...current, documentId],
      updatedAtUtc: new Date().toISOString(),
    });
  };

  const handleUnlinkDocument = (documentId: string) => {
    const current = entity.documentIds || [];
    if (!current.includes(documentId)) return;
    onUpdateEntity("insurance", entity.id, {
      documentIds: current.filter((id) => id !== documentId),
      updatedAtUtc: new Date().toISOString(),
    });
  };

  // Claims UI States
  const [isAddingClaim, setIsAddingClaim] = useState(false);
  const [newClaimTitle, setNewClaimTitle] = useState("");
  const [newClaimDesc, setNewClaimDesc] = useState("");
  const [newClaimPayout, setNewClaimPayout] = useState("");
  const [newCompanyId, setNewCompanyId] = useState("");
  const [newCommMode, setNewCommMode] =
    useState<ClaimCommunicationMode>("Portal");

  // Evidence / Attachment States
  const [linkingClaimId, setLinkingClaimId] = useState<string | null>(null);
  const [evidenceSearch, setEvidenceSearch] = useState("");
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);
  const [newEvidenceTitle, setNewEvidenceTitle] = useState("");

  // Asset Linking States
  const [managingAssetsForId, setManagingAssetsForId] = useState<string | null>(
    null
  );

  // Settlement States
  const [settlingClaimId, setSettlingClaimId] = useState<string | null>(null);
  const [finalPayout, setFinalPayout] = useState("");
  const [payoutDest, setPayoutDest] = useState("");
  const [settlementDate, setSettlementDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Timeline Addition States
  const [addingActivityToId, setAddingActivityToId] = useState<string | null>(
    null
  );
  const [newActivityContent, setNewActivityContent] = useState("");
  const [newActivityMode, setNewActivityMode] =
    useState<ClaimCommunicationMode>("Email");
  const [newActivityDate, setNewActivityDate] = useState("");

  const carrier = availableContacts.find((c) => c.id === entity.providerId);
  const now = new Date();
  const renewalDate = new Date(entity.renewalDate);
  const daysUntilRenewal = Math.ceil(
    (renewalDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
  );
  const isCritical = daysUntilRenewal < 30;

  const claims = entity.claims || [];
  const totalRecovered = claims.reduce(
    (acc, c) => acc + (c.payoutAmount || 0),
    0
  );

  const handleSaveEdit = (data: Partial<InsurancePolicy>) => {
    onUpdateEntity("insurance", entity.id, data);
    setIsEditModalOpen(false);
  };

  const handleAddClaim = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newClaimTitle.trim()) return;

    const initialActivity: ClaimActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type: "StatusChange",
      content: "Claim filed and initial registry record created.",
      timestamp: new Date().toISOString(),
      userName: "John Doe",
      communicationMode: newCommMode,
    };

    const newClaim: InsuranceClaim = {
      id: Math.random().toString(36).substr(2, 9),
      title: newClaimTitle,
      description: newClaimDesc,
      incidentDateUtc: new Date().toISOString(),
      status: "Filed",
      companyClaimId: newCompanyId || undefined,
      communicationMode: newCommMode,
      payoutAmount: parseFloat(newClaimPayout) || 0,
      conversationLog: [initialActivity],
      documentIds: [],
      spaceIds: [],
      inventoryItemIds: [],
    };

    onUpdateEntity("insurance", entity.id, { claims: [newClaim, ...claims] });
    setNewClaimTitle("");
    setNewClaimDesc("");
    setNewClaimPayout("");
    setNewCompanyId("");
    setIsAddingClaim(false);
  };

  const handleFinalSettle = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!settlingClaimId) return;

    const claim = claims.find((c) => c.id === settlingClaimId);
    if (!claim) return;

    const activity: ClaimActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type: "Payout",
      content: `Resolution confirmed. Funds: $${parseFloat(
        finalPayout
      ).toLocaleString()} dispatched to ${payoutDest || "Primary Account"}.`,
      timestamp: new Date().toISOString(),
      eventDateUtc: settlementDate
        ? new Date(settlementDate).toISOString()
        : undefined,
      userName: "John Doe",
    };

    const updatedClaims = claims.map((c) =>
      c.id === settlingClaimId
        ? {
            ...c,
            status: "Settled" as const,
            payoutAmount: parseFloat(finalPayout),
            payoutDestination: payoutDest,
            settlementDateUtc: settlementDate
              ? new Date(settlementDate).toISOString()
              : undefined,
            conversationLog: [activity, ...(c.conversationLog || [])],
          }
        : c
    );

    onUpdateEntity("insurance", entity.id, { claims: updatedClaims });
    setSettlingClaimId(null);
    setFinalPayout("");
    setPayoutDest("");
  };

  const handleReopenClaim = (claimId: string) => {
    const activity: ClaimActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type: "StatusChange",
      content:
        "Claim re-opened for further investigation or supplemental recovery.",
      timestamp: new Date().toISOString(),
      userName: "John Doe",
    };

    const updatedClaims = claims.map((c) =>
      c.id === claimId
        ? {
            ...c,
            status: "InReview" as const,
            conversationLog: [activity, ...(c.conversationLog || [])],
          }
        : c
    );
    onUpdateEntity("insurance", entity.id, { claims: updatedClaims });
  };

  const handleLinkEvidence = (claimId: string, docId: string) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    const doc = allDocuments.find((d) => d.id === docId);
    const activity: ClaimActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type: "Attachment",
      content: `Evidence linked: ${doc?.title || "Unknown document"}.`,
      timestamp: new Date().toISOString(),
      userName: "John Doe",
    };

    const updatedClaims = claims.map((c) =>
      c.id === claimId
        ? {
            ...c,
            documentIds: Array.from(new Set([...(c.documentIds || []), docId])),
            conversationLog: [activity, ...(c.conversationLog || [])],
          }
        : c
    );
    onUpdateEntity("insurance", entity.id, { claims: updatedClaims });
    setLinkingClaimId(null);
    setEvidenceSearch("");
  };

  const handleToggleAssetLink = (
    claimId: string,
    type: "space" | "inventory",
    assetId: string
  ) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    const field = type === "space" ? "spaceIds" : "inventoryItemIds";
    const current = (claim as any)[field] || [];
    const updated = current.includes(assetId)
      ? current.filter((id: string) => id !== assetId)
      : [...current, assetId];

    const updatedClaims = claims.map((c) =>
      c.id === claimId ? { ...c, [field]: updated } : c
    );
    onUpdateEntity("insurance", entity.id, { claims: updatedClaims });
  };

  const handleUploadEvidence = async (claimId: string) => {
    if (!newEvidenceTitle.trim() || !onQuickUploadDoc) return;
    setIsUploadingEvidence(true);
    try {
      const newDocId = await onQuickUploadDoc(newEvidenceTitle, null);
      handleLinkEvidence(claimId, newDocId);
      setNewEvidenceTitle("");
    } finally {
      setIsUploadingEvidence(false);
    }
  };

  const handleAddActivity = (claimId: string) => {
    if (!newActivityContent.trim()) return;

    const activity: ClaimActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type: "Communication",
      content: newActivityContent.trim(),
      communicationMode: newActivityMode,
      timestamp: new Date().toISOString(),
      eventDateUtc: newActivityDate
        ? new Date(newActivityDate).toISOString()
        : undefined,
      userName: "John Doe",
    };

    const updatedClaims = claims.map((c) =>
      c.id === claimId
        ? {
            ...c,
            conversationLog: [activity, ...(c.conversationLog || [])].sort(
              (a, b) => {
                const timeA = new Date(a.eventDateUtc || a.timestamp).getTime();
                const timeB = new Date(b.eventDateUtc || b.timestamp).getTime();
                return timeB - timeA;
              }
            ),
          }
        : c
    );

    onUpdateEntity("insurance", entity.id, { claims: updatedClaims });
    setNewActivityContent("");
    setNewActivityDate("");
    setAddingActivityToId(null);
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

  const getModeIcon = (mode?: ClaimCommunicationMode) => {
    switch (mode) {
      case "Email":
        return <Mail size={14} />;
      case "Phone":
        return <Phone size={14} />;
      case "Portal":
        return <Globe size={14} />;
      case "In-Person":
        return <User size={14} />;
      case "Mail":
        return <FileText size={14} />;
      case "Text":
        return <MessageCircle size={14} />;
      default:
        return <MessageSquare size={14} />;
    }
  };

  return (
    <DetailLayout
      title={entity.title || `${entity.type} Coverage`}
      typeLabel="Insurance Registry"
      description={`Active protection record: ${entity.policyNumber}`}
      onBack={onBack}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
    >
      <div className="flex space-x-1 p-1 bg-slate-100/50 rounded-2xl border border-slate-100 w-fit mb-8">
        <button
          onClick={() => setActiveTab("policy")}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "policy"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <ShieldCheck size={16} />
          <span>Policy Configuration</span>
        </button>
        <button
          onClick={() => setActiveTab("claims")}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "claims"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <History size={16} />
          <span>Incident Registry</span>
          <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black">
            {claims.length}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "policy" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
              {/* Coverage Totals */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 shadow-sm relative overflow-hidden">
                <SectionHeading
                  label="Coverage Thresholds"
                  icon={ShieldCheck}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Policy Limit
                    </p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                      ${entity.coverageLimit.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Monthly Premium
                    </p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                      ${entity.premium.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Deductible
                    </p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                      ${entity.deductible.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recovery Performance */}
              {totalRecovered > 0 && (
                <div className="bg-[#f2f4f2] border border-[#e1e6e1] rounded-[2rem] p-8 flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#5a6b5d] shadow-sm">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#5a6b5d] uppercase tracking-widest">
                        Total Recovery Volume
                      </p>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">
                        ${totalRecovered.toLocaleString()} Returned
                      </h4>
                    </div>
                  </div>
                  <Badge color="text-[#5a6b5d]" bgColor="bg-white">
                    Active Audit
                  </Badge>
                </div>
              )}

              {/* Carrier Details */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                <SectionHeading label="Underwriting Entity" icon={User} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-[#5a6b5d] shadow-lg shrink-0">
                      <User size={32} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                        {carrier?.company || "Direct Carrier"}
                      </h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                        Official Underwriter
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Claim Line
                      </p>
                      <p className="text-sm font-bold text-slate-900 select-all">
                        {carrier?.phone || "Private Record"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Portal Domain
                      </p>
                      <a
                        href={carrier?.websiteUrl || "#"}
                        className="text-sm font-bold text-[#5a6b5d] hover:underline flex items-center"
                      >
                        Secure Link{" "}
                        <ExternalLink size={12} className="ml-1.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timelines */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <SectionHeading label="Temporal Milestones" icon={Calendar} />
                  {isCritical && (
                    <Badge color="text-[#b45c43]" bgColor="bg-[#fdf3f0]">
                      Renewal Imminent
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Commenced
                    </p>
                    <p className="text-lg font-black text-slate-900 tracking-tight">
                      {new Date(entity.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Termination
                    </p>
                    <p className="text-lg font-black text-slate-900 tracking-tight">
                      {new Date(entity.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`p-6 rounded-[1.5rem] border shadow-inner space-y-1 ${
                      isCritical
                        ? "bg-[#fdf3f0] border-[#f9dad3]"
                        : "bg-[#f2f4f2] border-[#e1e6e1]"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        isCritical ? "text-[#b45c43]" : "text-[#5a6b5d]"
                      }`}
                    >
                      Renewal Goal
                    </p>
                    <p className="text-lg font-black text-slate-900 tracking-tight">
                      {new Date(entity.renewalDate).toLocaleDateString()}
                    </p>
                    <p
                      className={`text-[9px] font-bold uppercase ${
                        isCritical ? "text-[#b45c43]" : "text-slate-400"
                      }`}
                    >
                      {daysUntilRenewal} Days Remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* INCIDENT REGISTRY TAB */
            <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <SectionHeading
                    icon={MessageSquare}
                    label="Managed Incidents"
                  />
                  {!isAddingClaim && (
                    <UIButton
                      size="sm"
                      icon={Plus}
                      onClick={() => setIsAddingClaim(true)}
                    >
                      Log New Incident
                    </UIButton>
                  )}
                </div>

                {isAddingClaim && (
                  <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-6 animate-in slide-in-from-top-4 duration-300 shadow-inner">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                        New Claim Data
                      </p>
                      <button
                        onClick={() => setIsAddingClaim(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <form onSubmit={handleAddClaim} className="space-y-6">
                      <Input
                        autoFocus
                        label="Incident Title"
                        value={newClaimTitle}
                        onChange={(e) => setNewClaimTitle(e.target.value)}
                        placeholder="e.g. Roof Leak Damage"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Company Claim Ref ID"
                          icon={Hash}
                          value={newCompanyId}
                          onChange={(e) => setNewCompanyId(e.target.value)}
                          placeholder="e.g. INS-992-B"
                        />
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Send size={10} className="mr-1.5" /> Initial
                            Contact Method
                          </label>
                          <select
                            value={newCommMode}
                            onChange={(e) =>
                              setNewCommMode(e.target.value as any)
                            }
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                          >
                            {COMMUNICATION_MODES.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <Input
                        textarea
                        label="Issue Description"
                        value={newClaimDesc}
                        onChange={(e) => setNewClaimDesc(e.target.value)}
                        placeholder="Explain the root cause..."
                        rows={2}
                      />
                      <Input
                        label="Provisional Payout Expected"
                        icon={DollarSign}
                        type="number"
                        value={newClaimPayout}
                        onChange={(e) => setNewClaimPayout(e.target.value)}
                      />
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingClaim(false)}
                          className="px-6 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                        <UIButton type="submit" disabled={!newClaimTitle}>
                          Initialize Claim
                        </UIButton>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-12">
                  {claims.length > 0 ? (
                    claims.map((claim) => (
                      <div
                        key={claim.id}
                        className="relative p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-slate-300 transition-all group"
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                                {claim.title}
                              </h3>
                              <Badge
                                color={
                                  claim.status === "Settled"
                                    ? "text-[#5a6b5d]"
                                    : "text-[#a47148]"
                                }
                                bgColor="bg-slate-50"
                                className="px-3 py-1"
                              >
                                {claim.status.replace(/([A-Z])/g, " $1").trim()}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Hash size={12} className="text-[#a47148]" />
                                <span>
                                  Ref: {claim.companyClaimId || "Unassigned"}
                                </span>
                              </div>
                              <div
                                className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                                  claim.status === "Settled"
                                    ? "bg-[#f2f4f2] text-[#5a6b5d] border-[#e1e6e1]"
                                    : "bg-slate-50 text-slate-400 border-slate-100"
                                }`}
                              >
                                <TrendingUp size={12} />
                                <span>
                                  {claim.status === "Settled"
                                    ? "Disbursed"
                                    : "Provisional"}
                                  : $
                                  {claim.payoutAmount?.toLocaleString() || "0"}
                                </span>
                              </div>
                              {claim.payoutDestination && (
                                <div className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                  <CreditCard size={12} />
                                  <span>Dest: {claim.payoutDestination}</span>
                                </div>
                              )}
                            </div>

                            <p className="text-base text-slate-500 font-medium leading-relaxed">
                              {claim.description}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {claim.status !== "Settled" &&
                            claim.status !== "Closed" &&
                            claim.status !== "Denied" ? (
                              <button
                                onClick={() => {
                                  setSettlingClaimId(claim.id);
                                  setFinalPayout(
                                    claim.payoutAmount?.toString() || ""
                                  );
                                }}
                                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center space-x-2"
                              >
                                <CheckCircle size={14} />
                                <span>Final Settlement</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReopenClaim(claim.id)}
                                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center space-x-2"
                              >
                                <RotateCcw size={14} />
                                <span>Re-open Claim</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Final Settlement Form */}
                        {settlingClaimId === claim.id && (
                          <div className="mb-12 p-12 bg-slate-50 border border-slate-200 rounded-[3rem] space-y-10 shadow-inner animate-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center justify-between">
                              <SectionHeading
                                label="Resolution & Disbursement"
                                icon={Banknote}
                                color="text-[#5a6b5d]"
                              />
                              <button
                                onClick={() => setSettlingClaimId(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <X size={22} />
                              </button>
                            </div>

                            <form
                              onSubmit={handleFinalSettle}
                              className="space-y-10"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                                <Input
                                  label="Final Recovery Amount"
                                  icon={DollarSign}
                                  type="number"
                                  step="0.01"
                                  value={finalPayout}
                                  onChange={(e) =>
                                    setFinalPayout(e.target.value)
                                  }
                                  placeholder="0.00"
                                />
                                <Input
                                  label="Settlement Date"
                                  type="date"
                                  value={settlementDate}
                                  onChange={(e) =>
                                    setSettlementDate(e.target.value)
                                  }
                                />
                                <Input
                                  label="Disbursement Destination"
                                  icon={CreditCard}
                                  placeholder="e.g. Main Savings"
                                  value={payoutDest}
                                  onChange={(e) =>
                                    setPayoutDest(e.target.value)
                                  }
                                />
                              </div>
                              <div className="flex justify-end items-center space-x-6 pt-6 border-t border-slate-200/50">
                                <button
                                  type="button"
                                  onClick={() => setSettlingClaimId(null)}
                                  className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-all"
                                >
                                  Abort Resolution
                                </button>
                                <UIButton type="submit" disabled={!finalPayout}>
                                  Confirm & Close Registry
                                </UIButton>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* LINKED ASSETS (ROOMS & INVENTORY) */}
                        <div className="mb-8 pt-8 border-t border-slate-100 space-y-6">
                          <div className="flex items-center justify-between">
                            <SectionHeading
                              label="Affiliated Assets"
                              icon={Layers}
                              color="text-slate-400"
                            />
                            <button
                              onClick={() =>
                                setManagingAssetsForId(
                                  managingAssetsForId === claim.id
                                    ? null
                                    : claim.id
                                )
                              }
                              className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                            >
                              {managingAssetsForId === claim.id
                                ? "Close Selector"
                                : "+ Manage Linkages"}
                            </button>
                          </div>

                          {managingAssetsForId === claim.id && (
                            <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-8 animate-in zoom-in-95 duration-200 shadow-inner">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                    <Layout size={12} className="mr-2" /> Select
                                    Affected Rooms
                                  </p>
                                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                    {availableSpaces.map((s) => {
                                      const isActive = (
                                        claim.spaceIds || []
                                      ).includes(s.id);
                                      return (
                                        <button
                                          key={s.id}
                                          onClick={() =>
                                            handleToggleAssetLink(
                                              claim.id,
                                              "space",
                                              s.id
                                            )
                                          }
                                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center space-x-2 ${
                                            isActive
                                              ? "bg-slate-900 text-white border-slate-900"
                                              : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300"
                                          }`}
                                        >
                                          {isActive && <Check size={10} />}{" "}
                                          <span>{s.name}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                    <Box size={12} className="mr-2" /> Select
                                    Impacted Assets
                                  </p>
                                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                    {availableInventory.map((item) => {
                                      const isActive = (
                                        claim.inventoryItemIds || []
                                      ).includes(item.id);
                                      return (
                                        <button
                                          key={item.id}
                                          onClick={() =>
                                            handleToggleAssetLink(
                                              claim.id,
                                              "inventory",
                                              item.id
                                            )
                                          }
                                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center space-x-2 ${
                                            isActive
                                              ? "bg-[#5a6b5d] text-white border-[#5a6b5d]"
                                              : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300"
                                          }`}
                                        >
                                          {isActive && <Check size={10} />}{" "}
                                          <span>{item.name}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3">
                            {(claim.spaceIds || []).map((id) => {
                              const s = availableSpaces.find(
                                (x) => x.id === id
                              );
                              if (!s) return null;
                              return (
                                <div
                                  key={id}
                                  onClick={() =>
                                    onNavigateToEntity?.("space", s.id)
                                  }
                                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-2 hover:bg-white hover:shadow-md cursor-pointer transition-all"
                                >
                                  <Layout
                                    size={12}
                                    className="text-slate-400"
                                  />
                                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                                    {s.name}
                                  </span>
                                </div>
                              );
                            })}
                            {(claim.inventoryItemIds || []).map((id) => {
                              const item = availableInventory.find(
                                (x) => x.id === id
                              );
                              if (!item) return null;
                              return (
                                <div
                                  key={id}
                                  onClick={() =>
                                    onNavigateToEntity?.("inventory", item.id)
                                  }
                                  className="px-4 py-2 bg-[#f2f4f2] border border-[#e1e6e1] rounded-2xl flex items-center space-x-2 hover:bg-white hover:shadow-md cursor-pointer transition-all"
                                >
                                  <Box size={12} className="text-[#5a6b5d]" />
                                  <span className="text-[10px] font-black text-[#5a6b5d] uppercase tracking-tight">
                                    {item.name}
                                  </span>
                                </div>
                              );
                            })}
                            {!claim.spaceIds?.length &&
                              !claim.inventoryItemIds?.length && (
                                <div className="flex items-center space-x-3 px-6 py-3 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 grayscale opacity-40">
                                  <LinkIcon
                                    size={18}
                                    className="text-slate-300"
                                  />
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    No assets linked to incident
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* EVIDENCE REGISTRY SECTION */}
                        <div className="mb-8 pt-8 border-t border-slate-100 space-y-6">
                          <div className="flex items-center justify-between">
                            <SectionHeading
                              label="Evidence & Documentation"
                              icon={Paperclip}
                              color="text-slate-400"
                            />
                            {linkingClaimId !== claim.id ? (
                              <button
                                onClick={() => setLinkingClaimId(claim.id)}
                                className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                              >
                                + Link Proof
                              </button>
                            ) : (
                              <button
                                onClick={() => setLinkingClaimId(null)}
                                className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>

                          {linkingClaimId === claim.id && (
                            <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-8 animate-in zoom-in-95 duration-200 shadow-inner">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* LINK EXISTING */}
                                <div className="space-y-4">
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                    <LinkIcon size={12} className="mr-2" /> Link
                                    Existing Library Item
                                  </p>
                                  <div className="relative group">
                                    <Search
                                      size={14}
                                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Filter vault..."
                                      value={evidenceSearch}
                                      onChange={(e) =>
                                        setEvidenceSearch(e.target.value)
                                      }
                                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                                    />
                                    {evidenceSearch && (
                                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-20 overflow-hidden divide-y divide-slate-50">
                                        {allDocuments
                                          .filter(
                                            (d) =>
                                              d.title
                                                .toLowerCase()
                                                .includes(
                                                  evidenceSearch.toLowerCase()
                                                ) &&
                                              !claim.documentIds?.includes(d.id)
                                          )
                                          .slice(0, 4)
                                          .map((doc) => (
                                            <button
                                              key={doc.id}
                                              onClick={() =>
                                                handleLinkEvidence(
                                                  claim.id,
                                                  doc.id
                                                )
                                              }
                                              className="w-full p-3 flex items-center space-x-3 hover:bg-slate-50 text-left transition-colors"
                                            >
                                              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                <FileText size={14} />
                                              </div>
                                              <span className="text-xs font-black text-slate-700 truncate">
                                                {doc.title}
                                              </span>
                                            </button>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {/* QUICK UPLOAD */}
                                <div className="space-y-4">
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                    <ImageIcon size={12} className="mr-2" />{" "}
                                    Upload New Evidence
                                  </p>
                                  <div className="flex space-x-2">
                                    <input
                                      placeholder="e.g. Repair Receipt #204"
                                      value={newEvidenceTitle}
                                      onChange={(e) =>
                                        setNewEvidenceTitle(e.target.value)
                                      }
                                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                                    />
                                    <button
                                      onClick={() =>
                                        handleUploadEvidence(claim.id)
                                      }
                                      disabled={
                                        !newEvidenceTitle.trim() ||
                                        isUploadingEvidence
                                      }
                                      className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-30 transition-all whitespace-nowrap shadow-lg shadow-indigo-100"
                                    >
                                      {isUploadingEvidence ? "..." : "Upload"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-4">
                            {(claim.documentIds || []).map((docId) => {
                              const doc = allDocuments.find(
                                (d) => d.id === docId
                              );
                              if (!doc) return null;
                              return (
                                <div
                                  key={docId}
                                  className="group relative flex flex-col items-center space-y-2 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 hover:shadow-md transition-all w-24"
                                >
                                  <DocumentPreview
                                    attachment={
                                      doc.attachments?.[0] || {
                                        id: "fallback",
                                        fileName: "fallback",
                                        contentType: "application/pdf",
                                        sizeBytes: 0,
                                        createdAtUtc: "",
                                      }
                                    }
                                    size="sm"
                                    className="mb-1"
                                  />
                                  <span className="text-[9px] font-black text-slate-500 uppercase truncate w-full text-center tracking-tight px-1">
                                    {doc.title}
                                  </span>
                                  <button
                                    onClick={() =>
                                      onUpdateEntity("insurance", entity.id, {
                                        claims: claims.map((c) =>
                                          c.id === claim.id
                                            ? {
                                                ...c,
                                                documentIds: (
                                                  c.documentIds || []
                                                ).filter((id) => id !== docId),
                                              }
                                            : c
                                        ),
                                      })
                                    }
                                    className="absolute -top-1 -right-1 p-1 bg-white border border-slate-200 rounded-full text-slate-300 hover:text-[#b45c43] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              );
                            })}
                            {(claim.documentIds || []).length === 0 && (
                              <div className="flex items-center space-x-3 px-6 py-3 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 grayscale opacity-40">
                                <ImageIcon
                                  size={18}
                                  className="text-slate-300"
                                />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  No documentation linked
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* TIMELINE REGISTRY */}
                        <div className="pt-8 border-t border-slate-100 space-y-6">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center">
                              <History size={12} className="mr-2" /> Audit
                              Timeline
                            </p>
                            {addingActivityToId !== claim.id ? (
                              <button
                                onClick={() => setAddingActivityToId(claim.id)}
                                className="text-[9px] font-black text-indigo-600 uppercase hover:underline"
                              >
                                + Append Step
                              </button>
                            ) : (
                              <div className="flex items-center space-x-2 animate-in slide-in-from-right-2">
                                <select
                                  value={newActivityMode}
                                  onChange={(e) =>
                                    setNewActivityMode(e.target.value as any)
                                  }
                                  className="text-[9px] font-black uppercase bg-slate-100 border-none rounded-lg py-1 px-2 focus:ring-0"
                                >
                                  {COMMUNICATION_MODES.map((m) => (
                                    <option key={m} value={m}>
                                      {m}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => setAddingActivityToId(null)}
                                  className="text-slate-300 hover:text-slate-600"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            )}
                          </div>

                          {addingActivityToId === claim.id && (
                            <div className="space-y-4 mb-8 p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] animate-in zoom-in-95 duration-200 shadow-inner">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                    <Clock size={10} className="mr-1.5" />{" "}
                                    Incident / Event Date (Optional)
                                  </label>
                                  <input
                                    type="datetime-local"
                                    value={newActivityDate}
                                    onChange={(e) =>
                                      setNewActivityDate(e.target.value)
                                    }
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 shadow-inner"
                                  />
                                </div>
                              </div>
                              <div className="relative">
                                <textarea
                                  autoFocus
                                  placeholder="Log communication, inspection details, or status notes..."
                                  value={newActivityContent}
                                  onChange={(e) =>
                                    setNewActivityContent(e.target.value)
                                  }
                                  className="w-full bg-white border border-slate-200 rounded-[1.5rem] p-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner resize-none"
                                  rows={3}
                                />
                                <button
                                  onClick={() => handleAddActivity(claim.id)}
                                  disabled={!newActivityContent.trim()}
                                  className="absolute bottom-4 right-4 p-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-all shadow-lg disabled:opacity-30"
                                >
                                  <Send size={16} />
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="space-y-4 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                            {claim.conversationLog?.map((activity) => (
                              <div key={activity.id} className="relative pl-12">
                                <div
                                  className={`absolute left-0 top-1.5 w-9 h-9 rounded-xl border-4 border-white flex items-center justify-center shadow-sm z-10 
                                      ${
                                        activity.type === "StatusChange"
                                          ? "bg-[#fdf3f0] text-[#b45c43]"
                                          : activity.type === "Payout"
                                          ? "bg-[#f2f4f2] text-[#5a6b5d]"
                                          : activity.type === "Attachment"
                                          ? "bg-indigo-50 text-indigo-600"
                                          : "bg-slate-100 text-slate-400"
                                      }`}
                                >
                                  {activity.type === "Communication" ? (
                                    getModeIcon(activity.communicationMode)
                                  ) : activity.type === "Payout" ? (
                                    <Banknote size={14} />
                                  ) : activity.type === "Attachment" ? (
                                    <Paperclip size={14} />
                                  ) : (
                                    <CheckCircle size={14} />
                                  )}
                                </div>
                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-md transition-all">
                                  <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                      {activity.content}
                                    </p>
                                    <div className="text-right ml-4 shrink-0">
                                      <span className="text-[9px] font-black text-slate-300 uppercase block">
                                        {new Date(
                                          activity.timestamp
                                        ).toLocaleDateString()}
                                      </span>
                                      {activity.eventDateUtc && (
                                        <span className="text-[9px] font-black text-[#a47148] uppercase block mt-1">
                                          Hist:{" "}
                                          {new Date(
                                            activity.eventDateUtc
                                          ).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">
                                      {activity.userName}
                                    </span>
                                    {activity.communicationMode && (
                                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                        • via {activity.communicationMode}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 bg-gray-50/20">
                      <AlertTriangle
                        size={64}
                        strokeWidth={1}
                        className="mb-6 opacity-20"
                      />
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                        Incident Registry Empty
                      </p>
                      <p className="text-xs font-medium text-slate-400 mt-2">
                        Historical data is required to verify property insurance
                        ROI.
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

      <InsurancePolicyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={entity}
        availableContacts={availableContacts}
        onQuickAddContact={onQuickAddContact}
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
                  Scrub Policy?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Removing this policy will erase the coverage ledger, incident
                  history, and recovery metrics. This cannot be undone.
                </p>
              </div>
              <div className="flex flex-col space-y-3 pt-2">
                <button
                  onClick={confirmDelete}
                  className="w-full py-3.5 bg-[#b45c43] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#9d4b35] transition-all shadow-lg shadow-[#b45c43]/20 active:scale-[0.98]"
                >
                  Finalize Removal
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

export default InsuranceDetailView;
