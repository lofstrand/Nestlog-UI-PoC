import React from "react";
import type { LucideIcon } from "lucide-react";
import { FIELD_CONTROL_CLASS, FIELD_LABEL_CLASS } from "./fields";

export type SelectOption<TValue extends string> = {
  value: TValue;
  label: string;
  disabled?: boolean;
};

export type SelectFieldProps<TValue extends string> = {
  label?: string;
  icon?: LucideIcon;
  value: TValue;
  onChange: (value: TValue) => void;
  options: readonly SelectOption<TValue>[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
};

export function SelectField<TValue extends string>({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder,
  className = "",
  ...props
}: SelectFieldProps<TValue>) {
  const placeholderValue = "" as TValue;

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className={FIELD_LABEL_CLASS}>
          {Icon && <Icon size={10} className="mr-1.5" />}
          {label}
        </label>
      )}
      <select
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value as TValue)}
        className={FIELD_CONTROL_CLASS}
      >
        {placeholder && (
          <option value={placeholderValue} disabled={props.required}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

