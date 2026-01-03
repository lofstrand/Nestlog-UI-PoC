import React from "react";
import type { LucideIcon } from "lucide-react";

export const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
      label?: string;
      icon?: LucideIcon;
      textarea?: boolean;
    }
> = ({ label, icon: Icon, textarea, ...props }) => {
  const Component = textarea ? "textarea" : "input";
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
          {Icon && <Icon size={10} className="mr-1.5" />}
          {label}
        </label>
      )}
      <Component
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-sm font-bold text-slate-900 shadow-inner placeholder:text-slate-300"
        {...(props as any)}
      />
    </div>
  );
};

