import React from "react";

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}> = ({ children, className = "", noPadding = false }) => (
  <div
    className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ${
      noPadding ? "" : "p-5 sm:p-8"
    } ${className}`}
  >
    {children}
  </div>
);

