import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type SortDirection = "asc" | "desc";

export type SortHeaderProps = {
  label: React.ReactNode;
  active?: boolean;
  direction?: SortDirection;
  onClick?: () => void;
  className?: string;
};

export const SortHeader: React.FC<SortHeaderProps> = ({
  label,
  active,
  direction = "asc",
  onClick,
  className = "",
}) => {
  if (!onClick) {
    return (
      <span
        className={`text-[10px] font-black text-slate-400 uppercase tracking-widest ${className}`}
      >
        {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors ${
        active ? "text-slate-900" : "text-slate-400"
      } ${className}`}
    >
      <span>{label}</span>
      {!active ? (
        <ChevronUp size={14} className="opacity-0 group-hover:opacity-30" />
      ) : direction === "asc" ? (
        <ChevronUp size={14} className="text-slate-900" />
      ) : (
        <ChevronDown size={14} className="text-slate-900" />
      )}
    </button>
  );
};

