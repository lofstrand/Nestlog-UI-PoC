import React from "react";
import { Search } from "lucide-react";
import { FIELD_CONTROL_CLASS } from "./fields";

export type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  placeholder = "Search…",
  className = "",
}) => {
  return (
    <div className={`relative group ${className}`}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${FIELD_CONTROL_CLASS} pl-10`}
      />
    </div>
  );
};

