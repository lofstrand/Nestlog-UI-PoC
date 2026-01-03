import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Info,
  ListTodo,
  MessageSquareQuote,
  UserRound,
} from "lucide-react";
import { View } from "@/types";
import { Badge, Card, PageHeader } from "@/components/ui";

type FeatureStatus = "Requested" | "Planned" | "In Progress" | "Done";

const STATUS_STYLES: Record<
  FeatureStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    Icon: any;
  }
> = {
  Requested: {
    label: "Requested",
    color: "text-[#b45c43]",
    bgColor: "bg-[#fbf2ef]",
    borderColor: "border-[#f3d6cc]",
    Icon: MessageSquareQuote,
  },
  Done: {
    label: "Done",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    Icon: CheckCircle2,
  },
  "In Progress": {
    label: "In progress",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-100",
    Icon: CircleDashed,
  },
  Planned: {
    label: "Planned",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    Icon: ListTodo,
  },
};

const FEATURE_REQUESTS: Array<{
  title: string;
  status: FeatureStatus;
  description: string;
  requestor?: string;
  quote?: string;
  area:
    | "UI/UX"
    | "Domain"
    | "Data"
    | "Integration"
    | "Automation"
    | "Performance"
    | "Security";
}> = [
  {
    title: "Improve Overall User Interface and Visual Design",
    status: "Planned",
    description:
      "Redesign the user interface to improve visual consistency, readability, and usability. This includes updating layout, spacing, typography, color usage, and component hierarchy to create a more modern, intuitive, and accessible user experience.",
    quote: "The design is ugly",
    requestor: "Sara Löfstrand",
    area: "UI/UX",
  },
  {
    title: "Recommended Maintenance Suggestions",
    status: "Requested",
    description:
      "When a user creates or views a property, room, or asset, the system should automatically suggest relevant maintenance tasks (e.g. inspections, servicing, replacements) based on type, age, or usage.",
    requestor: "Sara Löfstrand",
    area: "Data",
  },
  {
    title: "Upload Documents and Media Directly from Mobile Devices",
    status: "Planned",
    description:
      "Allow users to upload documents and media directly from their phone.",
    requestor: "Sara Löfstrand",
    area: "UI/UX",
  },
  {
    title: "Project Templates (e.g. Renovation Projects)",
    status: "Requested",
    description:
      "Users can start a project from a predefined template that includes common tasks, timelines, and cost categories, reducing setup time and ensuring best practices.",
    requestor: "Sara Löfstrand",
    area: "Data",
  },
];

const LandingPage: React.FC<{ onNavigate: (view: View) => void }> = ({
  onNavigate,
}) => {
  const getInitials = (name: string) => {
    const cleaned = name.trim();
    if (!cleaned) return "?";
    const parts = cleaned.split(/\s+/g).filter(Boolean);
    const first = parts[0]?.[0] ?? "?";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader
        title="Welcome to Nestlog"
        description="A structured workspace for households and properties — track maintenance, inventory, documents, finance, and shared context."
        action={
          <button
            type="button"
            onClick={() => onNavigate("overview")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Open Overview</span>
            <ArrowRight size={14} />
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700">
                <Info size={16} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                  How It Works
                </h2>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  Nestlog is organized as{" "}
                  <span className="font-semibold">Households</span> that contain{" "}
                  <span className="font-semibold">Properties</span>. When you
                  select a household and property in the header, lists and
                  dashboards automatically scope to that context.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate("households")}
                    className="text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors p-4"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Step 1
                    </div>
                    <div className="mt-2 text-sm font-bold text-slate-900">
                      Pick a household
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Collaboration, ownership, portfolio.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate("properties")}
                    className="text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors p-4"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Step 2
                    </div>
                    <div className="mt-2 text-sm font-bold text-slate-900">
                      Select a property
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Everything scopes to the selection.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate("maintenance")}
                    className="text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors p-4"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Step 3
                    </div>
                    <div className="mt-2 text-sm font-bold text-slate-900">
                      Work in modules
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Tasks, projects, docs, inventory, finance.
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                  Feature Requests
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  A lightweight backlog to track what to build next.
                </p>
              </div>
              <Badge>Backlog</Badge>
            </div>

            <div className="mt-6 space-y-3">
              {FEATURE_REQUESTS.map((item) => {
                const styles = STATUS_STYLES[item.status];
                const StatusIcon = styles.Icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {item.title}
                          </div>
                          <Badge
                            color={styles.color}
                            bgColor={styles.bgColor}
                            borderColor={styles.borderColor}
                            className="shrink-0"
                          >
                            <span className="inline-flex items-center gap-1">
                              <StatusIcon size={12} />
                              {styles.label}
                            </span>
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 leading-relaxed">
                          {item.description}
                        </div>
                        {(item.requestor || item.quote) && (
                          <div className="mt-4 space-y-3">
                            {item.quote && (
                              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-3">
                                <MessageSquareQuote
                                  size={18}
                                  className="absolute right-3 top-3 text-slate-200"
                                />
                                <blockquote className="border-l-4 border-slate-900/10 pl-3 text-sm text-slate-700 italic leading-relaxed">
                                  “{item.quote}”
                                </blockquote>
                              </div>
                            )}
                            {item.requestor && (
                              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black tracking-widest">
                                  {getInitials(item.requestor)}
                                </div>
                                <div className="leading-tight">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Requested by
                                  </div>
                                  <div className="text-xs font-bold text-slate-900">
                                    {item.requestor}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Badge className="shrink-0">{item.area}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
              Quick Start
            </h2>
            <div className="mt-5 space-y-2">
              {[
                { label: "Households", view: "households" as View },
                { label: "Properties", view: "properties" as View },
                { label: "Maintenance", view: "maintenance" as View },
                { label: "Inventory", view: "inventory" as View },
                { label: "Documents", view: "documents" as View },
              ].map((item) => (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => onNavigate(item.view)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900">
                    {item.label}
                  </span>
                  <ArrowRight size={16} className="text-slate-400" />
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
              Notes
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              This is a UI/UX proof of concept. Data is seeded, and all changes
              are reset when the system is updated.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
