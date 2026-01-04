import React from "react";
import type { LucideIcon } from "lucide-react";
import { FIELD_CONTROL_CLASS, FIELD_LABEL_CLASS } from "./fields";

export type TextAreaFieldProps = {
  label?: string;
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  rows?: number;
  className?: string;
};

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  rows = 3,
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className={FIELD_LABEL_CLASS}>
          {Icon && <Icon size={10} className="mr-1.5" />}
          {label}
        </label>
      )}
      <textarea
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`${FIELD_CONTROL_CLASS} resize-none leading-relaxed`}
      />
    </div>
  );
};

