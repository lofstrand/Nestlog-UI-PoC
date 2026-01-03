import React from "react";
import type { LucideIcon } from "lucide-react";

export const SectionHeading: React.FC<{
  icon?: LucideIcon;
  label: string;
  color?: string;
}> = ({ icon: Icon, label, color = "text-slate-400" }) => (
  <div className="flex items-center space-x-2 mb-4">
    {Icon && <Icon size={14} className={color} />}
    <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${color}`}>
      {label}
    </h3>
  </div>
);

