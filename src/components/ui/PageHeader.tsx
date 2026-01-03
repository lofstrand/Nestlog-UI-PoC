import React from "react";

export const PageHeader: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
    <div className="space-y-1">
      <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter leading-none">
        {title}
      </h1>
      {description && (
        <p className="text-slate-500 font-medium text-sm sm:text-lg leading-tight">
          {description}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

