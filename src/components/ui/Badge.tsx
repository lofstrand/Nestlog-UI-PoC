import React from "react";

export const Badge: React.FC<{
  children: React.ReactNode;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  className?: string;
}> = ({
  children,
  color = "text-slate-500",
  bgColor = "bg-slate-50",
  borderColor = "border-slate-200",
  className = "",
}) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${color} ${bgColor} ${borderColor} ${className}`}
  >
    {children}
  </span>
);

