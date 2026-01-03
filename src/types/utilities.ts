import type { Note } from "./common";

export interface UtilityInvoice {
  id: string;
  amount: number;
  dueDateUtc: string;
  documentId?: string;
  note?: string;
}

export interface UtilityAccount {
  id: string;
  propertyId: string;
  providerId: string;
  title: string;
  type:
    | "Electricity"
    | "Water"
    | "Gas"
    | "Heating"
    | "Cooling"
    | "Trash/Recycling"
    | "Waste"
    | "Internet"
    | "Mobile"
    | "Phone"
    | "Security"
    | "Solar"
    | "Cable TV"
    | "Other";
  accountNumber: string;
  averageMonthlyCost: number;
  useCalculatedAverage: boolean;
  lastPaymentDate?: string | null;
  spaceId?: string | null;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
  invoices: UtilityInvoice[];
}

