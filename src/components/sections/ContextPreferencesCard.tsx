import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { SectionHeading } from "@/components/ui";

type UnitSystem = "metric" | "imperial";
type CurrencyCode = "SEK" | "EUR" | "USD";

interface ContextPreferencesCardProps {
  unitSystem?: UnitSystem;
  currencyCode?: CurrencyCode;
  allowInherit?: boolean;
  onChangeUnitSystem?: (next: UnitSystem | undefined) => void;
  onChangeCurrencyCode?: (next: CurrencyCode | undefined) => void;
}

const selectBase =
  "w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all";

const ContextPreferencesCard: React.FC<ContextPreferencesCardProps> = ({
  unitSystem,
  currencyCode,
  allowInherit = false,
  onChangeUnitSystem,
  onChangeCurrencyCode,
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-inner">
      <SectionHeading label="Preferences" icon={SlidersHorizontal} />
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between gap-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
              Unit System
            </span>
          </div>
          <select
            value={unitSystem ?? ""}
            onChange={(e) => {
              const raw = e.target.value.trim();
              onChangeUnitSystem?.(
                raw ? (raw as UnitSystem) : undefined
              );
            }}
            className={selectBase}
          >
            {allowInherit && <option value="">Inherit</option>}
            <option value="metric">Metric (m², °C)</option>
            <option value="imperial">Imperial (ft², °F)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between gap-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
              Currency
            </span>
          </div>
          <select
            value={currencyCode ?? ""}
            onChange={(e) => {
              const raw = e.target.value.trim();
              onChangeCurrencyCode?.(
                raw ? (raw as CurrencyCode) : undefined
              );
            }}
            className={selectBase}
          >
            {allowInherit && <option value="">Inherit</option>}
            <option value="SEK">Swedish Krona (SEK)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">US Dollar (USD)</option>
          </select>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Used for formatting measurements and money across the workspace.
        </p>
      </div>
    </div>
  );
};

export default ContextPreferencesCard;

