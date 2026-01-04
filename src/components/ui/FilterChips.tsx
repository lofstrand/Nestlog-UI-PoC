import React from "react";

export type FilterChip = {
  key: string;
  label: string;
  count?: number;
};

export type FilterChipsProps = {
  items: readonly FilterChip[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
};

export const FilterChips: React.FC<FilterChipsProps> = ({
  items,
  activeKey,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide ${className}`}>
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap inline-flex items-center gap-2 ${
              active
                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                : "bg-white text-slate-400 border-slate-200 hover:border-slate-400"
            }`}
          >
            <span>{item.label}</span>
            {typeof item.count === "number" && (
              <span
                className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-black ${
                  active ? "bg-white/15 text-white" : "bg-slate-50 text-slate-500"
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

