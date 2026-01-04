import React from "react";
import type { LucideIcon } from "lucide-react";

export type ToggleFieldProps = {
  label: string;
  description?: string;
  icon?: LucideIcon;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  description,
  icon: Icon,
  value,
  onChange,
  disabled,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 ${className}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div
            className={`mt-0.5 p-1.5 rounded-md ${
              value ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-400"
            }`}
          >
            <Icon size={14} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-900 leading-none">{label}</p>
          {description && (
            <p className="mt-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-snug">
              {description}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          value ? "bg-slate-900" : "bg-slate-200"
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
        aria-pressed={value}
        aria-label={label}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

