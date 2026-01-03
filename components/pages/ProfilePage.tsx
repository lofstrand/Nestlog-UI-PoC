import React, { useMemo, useState } from "react";
import {
  User,
  Layout,
  Save,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Ruler,
  DollarSign,
  Bell,
  Monitor,
  Clock,
} from "lucide-react";
import { Badge, Button, Card, Input, PageHeader, SectionHeading } from "../ui/UIPrimitives";

type TabId = "profile" | "preferences";

type ProfileDraft = {
  userName: string;
  jobTitle: string;
  bio: string;
  unitSystem: "metric" | "imperial";
  currency: "SEK" | "EUR" | "USD";
  notificationsEnabled: boolean;
  securityAlertsEnabled: boolean;
  maintenanceRemindersEnabled: boolean;
  insuranceRenewalsEnabled: boolean;
  utilityOutagesEnabled: boolean;
  blueprintGrid: boolean;
  highDensityMode: boolean;
};

const getInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "U";
};

const formatSavedAt = (date: Date | null) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const ToggleRow: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}> = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-4 p-5 sm:p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 tracking-tight truncate">{label}</p>
        {description && (
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-slate-900" : "bg-slate-200"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const [draft, setDraft] = useState<ProfileDraft>({
    userName: "John Doe",
    jobTitle: "Chief Household Officer",
    bio: "Managing multiple high-value properties in Stockholm and Gotland. Focused on sustainability and energy efficiency.",
    unitSystem: "metric",
    currency: "SEK",
    notificationsEnabled: true,
    securityAlertsEnabled: true,
    maintenanceRemindersEnabled: true,
    insuranceRenewalsEnabled: true,
    utilityOutagesEnabled: false,
    blueprintGrid: true,
    highDensityMode: false,
  });

  const [savedSnapshot, setSavedSnapshot] = useState<ProfileDraft>(draft);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const initials = useMemo(() => getInitials(draft.userName), [draft.userName]);
  const isDirty =
    draft.userName !== savedSnapshot.userName ||
    draft.jobTitle !== savedSnapshot.jobTitle ||
    draft.bio !== savedSnapshot.bio ||
    draft.unitSystem !== savedSnapshot.unitSystem ||
    draft.currency !== savedSnapshot.currency ||
    draft.notificationsEnabled !== savedSnapshot.notificationsEnabled ||
    draft.securityAlertsEnabled !== savedSnapshot.securityAlertsEnabled ||
    draft.maintenanceRemindersEnabled !== savedSnapshot.maintenanceRemindersEnabled ||
    draft.insuranceRenewalsEnabled !== savedSnapshot.insuranceRenewalsEnabled ||
    draft.utilityOutagesEnabled !== savedSnapshot.utilityOutagesEnabled ||
    draft.blueprintGrid !== savedSnapshot.blueprintGrid ||
    draft.highDensityMode !== savedSnapshot.highDensityMode;

  const tabs: Array<{ id: TabId; label: string; icon: any }> = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Layout },
  ];

  const save = () => {
    setSavedSnapshot(draft);
    setLastSavedAt(new Date());
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Profile"
        description="Manage your identity and global preferences."
        action={
          <div className="flex items-center gap-3">
            <Badge
              className="hidden sm:inline-flex"
              bgColor={isDirty ? "bg-amber-50" : "bg-emerald-50"}
              borderColor={isDirty ? "border-amber-200" : "border-emerald-200"}
              color={isDirty ? "text-amber-700" : "text-emerald-700"}
            >
              {isDirty ? "Unsaved" : "Saved"}
            </Badge>
            <Button icon={Save} onClick={save} disabled={!isDirty}>
              Save changes
            </Button>
          </div>
        }
      />

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-1 p-1 bg-slate-100/50 rounded-2xl border border-slate-100 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card noPadding className="overflow-hidden">
              <div className="h-36 sm:h-44 bg-slate-900 relative">
                <div className="absolute inset-0 blueprint-grid opacity-[0.12]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-800/70" />
                <button
                  type="button"
                  className="absolute bottom-4 right-4 sm:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
                  aria-label="Change cover"
                >
                  <Camera size={18} />
                </button>
              </div>

              <div className="px-5 sm:px-8 pb-6 sm:pb-8 -mt-10 sm:-mt-12 relative">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div className="flex items-end gap-4">
                    <div className="relative inline-block group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] bg-slate-800 border-4 border-white flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-xl">
                        {initials}
                      </div>
                      <button
                        type="button"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem]"
                        aria-label="Change avatar"
                      >
                        <Camera size={20} />
                      </button>
                    </div>

                    <div className="min-w-0">
                      <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
                        {draft.userName || "Unnamed user"}
                      </p>
                      <p className="text-sm font-semibold text-slate-500 truncate">
                        {draft.jobTitle || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Badge bgColor="bg-emerald-50" borderColor="border-emerald-200" color="text-emerald-700">
                      Verified
                    </Badge>
                    <Badge bgColor="bg-slate-50" borderColor="border-slate-200" color="text-slate-600">
                      Member
                    </Badge>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Name"
                    value={draft.userName}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, userName: e.target.value }))
                    }
                  />
                  <Input
                    label="Role"
                    value={draft.jobTitle}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, jobTitle: e.target.value }))
                    }
                  />
                </div>

                <div className="mt-6">
                  <SectionHeading label="Bio" icon={User} />
                  <Input
                    textarea
                    rows={4}
                    placeholder="Describe your responsibilities…"
                    value={draft.bio}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, bio: e.target.value }))
                    }
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-slate-900 border-slate-900 text-white">
              <SectionHeading icon={ShieldCheck} label="Account" color="text-slate-400" />
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} className="text-emerald-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black tracking-tight">Secure session</p>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Your account is protected with standard security controls.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-slate-200" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black tracking-tight">Last saved</p>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {formatSavedAt(lastSavedAt)}
                    </p>
                  </div>
                </div>

                {isDirty && (
                  <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                    <AlertTriangle size={16} className="text-amber-300 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-slate-200 leading-snug">
                      You have changes that haven’t been saved yet.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "preferences" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <SectionHeading icon={Ruler} label="Localization" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Unit system
                </p>
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100">
                  {(["metric", "imperial"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, unitSystem: u }))}
                      className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${
                        draft.unitSystem === u
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {u === "metric" ? "Metric (m²)" : "Imperial (ft²)"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Currency
                </p>
                <select
                  value={draft.currency}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      currency: e.target.value as ProfileDraft["currency"],
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                >
                  <option value="SEK">Swedish Krona (kr)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">US Dollar ($)</option>
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeading icon={Monitor} label="Interface" />
            <div className="space-y-4">
              <ToggleRow
                label="Blueprint grid"
                description="Show architectural grid lines"
                checked={draft.blueprintGrid}
                onChange={(next) => setDraft((d) => ({ ...d, blueprintGrid: next }))}
              />
              <ToggleRow
                label="High density lists"
                description="Reduce whitespace in tables"
                checked={draft.highDensityMode}
                onChange={(next) => setDraft((d) => ({ ...d, highDensityMode: next }))}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading icon={Bell} label="Notifications" />
            <div className="space-y-4">
              <ToggleRow
                label="Push notifications"
                description="Alerts and reminders"
                checked={draft.notificationsEnabled}
                onChange={(next) =>
                  setDraft((d) => ({ ...d, notificationsEnabled: next }))
                }
              />
              <ToggleRow
                label="Security alerts"
                description="Critical changes and access events"
                checked={draft.securityAlertsEnabled}
                onChange={(next) =>
                  setDraft((d) => ({ ...d, securityAlertsEnabled: next }))
                }
              />
              <ToggleRow
                label="Maintenance reminders"
                description="Tasks and service schedules"
                checked={draft.maintenanceRemindersEnabled}
                onChange={(next) =>
                  setDraft((d) => ({ ...d, maintenanceRemindersEnabled: next }))
                }
              />
              <ToggleRow
                label="Insurance renewals"
                description="Policy expirations and renewals"
                checked={draft.insuranceRenewalsEnabled}
                onChange={(next) =>
                  setDraft((d) => ({ ...d, insuranceRenewalsEnabled: next }))
                }
              />
              <ToggleRow
                label="Utility outages"
                description="Service interruptions and incidents"
                checked={draft.utilityOutagesEnabled}
                onChange={(next) =>
                  setDraft((d) => ({ ...d, utilityOutagesEnabled: next }))
                }
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
