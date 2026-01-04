import React from "react";
import type { LucideIcon } from "lucide-react";
import { DollarSign } from "lucide-react";
import { FIELD_CONTROL_CLASS, FIELD_LABEL_CLASS } from "./fields";

export type MoneyFieldProps = {
  label?: string;
  icon?: LucideIcon;
  currencyCode?: string;
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

export const MoneyField: React.FC<MoneyFieldProps> = ({
  label,
  icon,
  currencyCode,
  value,
  onChange,
  className = "",
  ...props
}) => {
  const Icon = icon ?? DollarSign;
  const resolvedLabel = currencyCode && label ? `${label} (${currencyCode})` : label;

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {resolvedLabel && (
        <label className={FIELD_LABEL_CLASS}>
          {Icon && <Icon size={10} className="mr-1.5" />}
          {resolvedLabel}
        </label>
      )}
      <input
        {...props}
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FIELD_CONTROL_CLASS}
      />
    </div>
  );
};

