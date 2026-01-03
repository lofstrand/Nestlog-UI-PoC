import React from "react";
import { Sparkles, Calendar, Repeat, X, Plus } from "lucide-react";
import type { MaintenanceSuggestion } from "@/features/maintenance/suggestions/types";
import { Button, Badge, SectionHeading } from "@/components/ui";

const formatRecurrence = (s: MaintenanceSuggestion) => {
  const r = s.recurrence;
  if (!r || r.frequency === "None") return null;
  return `${r.frequency}${r.interval && r.interval !== 1 ? ` • x${r.interval}` : ""}`;
};

export const MaintenanceSuggestionsSection: React.FC<{
  suggestions: MaintenanceSuggestion[];
  onAccept: (s: MaintenanceSuggestion) => void;
  onDismiss: (s: MaintenanceSuggestion) => void;
}> = ({ suggestions, onAccept, onDismiss }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
            <Sparkles size={18} />
          </div>
          <div>
            <SectionHeading label="Smart recommendations" />
            <p className="text-xs text-slate-400 font-bold mt-1">
              Suggestions based on type and age. Accept to create tasks.
            </p>
          </div>
        </div>
        <Badge
          color="text-slate-500"
          bgColor="bg-slate-50"
          borderColor="border-slate-100"
        >
          {suggestions.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {suggestions.map((s) => {
          const recurrenceLabel = formatRecurrence(s);
          return (
            <div
              key={`${s.templateId}::${s.entityId}`}
              className="p-5 rounded-[1.75rem] border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-base font-black text-slate-900 tracking-tight">
                    {s.title}
                  </p>
                  {s.description && (
                    <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">
                      {s.description}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-slate-400 font-bold">
                    {s.reason}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {s.dueDateUtc && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <Calendar size={12} className="opacity-60" />
                        Due {new Date(s.dueDateUtc).toLocaleDateString()}
                      </span>
                    )}
                    {recurrenceLabel && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <Repeat size={12} className="opacity-60" />
                        {recurrenceLabel}
                      </span>
                    )}
                    {s.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" icon={Plus} onClick={() => onAccept(s)}>
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={X}
                    onClick={() => onDismiss(s)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

