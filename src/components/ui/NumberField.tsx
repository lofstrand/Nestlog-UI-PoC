import React from "react";
import type { LucideIcon } from "lucide-react";
import { FIELD_CONTROL_CLASS, FIELD_LABEL_CLASS } from "./fields";

export type NumberFieldProps = {
  label?: string;
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  className?: string;
};

export const NumberField: React.FC<NumberFieldProps> = ({
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
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FIELD_CONTROL_CLASS}
      />
    </div>
  );
};

