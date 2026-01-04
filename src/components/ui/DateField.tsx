import React from "react";
import type { LucideIcon } from "lucide-react";
import { FIELD_CONTROL_CLASS, FIELD_LABEL_CLASS } from "./fields";

export type DateFieldProps = {
  label?: string;
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  min?: string;
  max?: string;
  className?: string;
};

export const DateField: React.FC<DateFieldProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
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
      <input
        {...props}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FIELD_CONTROL_CLASS}
      />
    </div>
  );
};

