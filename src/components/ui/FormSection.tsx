import React from "react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export type FormSectionProps = {
  title: string;
  icon?: LucideIcon;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon,
  description,
  actions,
  children,
  className = "",
}) => {
  return (
    <section className={`space-y-6 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <SectionHeading label={title} icon={icon} />
          {description && (
            <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {children}
    </section>
  );
};

