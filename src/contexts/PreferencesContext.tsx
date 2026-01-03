import React, { createContext, useContext, useMemo } from "react";

export type UnitSystem = "metric" | "imperial";
export type CurrencyCode = "SEK" | "EUR" | "USD";

type CurrencyFormatOptions = {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

export type PreferencesContextValue = {
  unitSystem: UnitSystem;
  currencyCode: CurrencyCode;
  formatCurrency: (value?: number | null, opts?: CurrencyFormatOptions) => string;
  formatArea: (areaM2?: number | null) => string;
  areaUnitLabel: string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export const PreferencesProvider: React.FC<{
  unitSystem: UnitSystem;
  currencyCode: CurrencyCode;
  children: React.ReactNode;
}> = ({ unitSystem, currencyCode, children }) => {
  const value = useMemo<PreferencesContextValue>(() => {
    const areaUnitLabel = unitSystem === "imperial" ? "ft²" : "m²";

    const formatCurrency: PreferencesContextValue["formatCurrency"] = (
      amount,
      opts
    ) => {
      if (amount === null || amount === undefined) return "—";
      const maximumFractionDigits = opts?.maximumFractionDigits ?? 0;
      const minimumFractionDigits = opts?.minimumFractionDigits ?? 0;
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits,
        minimumFractionDigits,
      }).format(amount);
    };

    const formatArea: PreferencesContextValue["formatArea"] = (areaM2) => {
      if (areaM2 === null || areaM2 === undefined) return "--";
      if (unitSystem === "imperial") {
        const ft2 = areaM2 * 10.7639;
        return Math.round(ft2).toLocaleString();
      }
      return areaM2.toLocaleString();
    };

    return { unitSystem, currencyCode, formatCurrency, formatArea, areaUnitLabel };
  }, [unitSystem, currencyCode]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    return {
      unitSystem: "metric" as const,
      currencyCode: "SEK" as const,
      formatCurrency: (value?: number | null) =>
        value === null || value === undefined
          ? "—"
          : new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "SEK",
              maximumFractionDigits: 0,
            }).format(value),
      formatArea: (areaM2?: number | null) =>
        areaM2 === null || areaM2 === undefined ? "--" : areaM2.toLocaleString(),
      areaUnitLabel: "m²",
    };
  }
  return ctx;
};

