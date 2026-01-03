import type { Address, Note } from "./common";

export type ContactCategory =
  | "ServiceProvider"
  | "Agency"
  | "InsuranceCarrier"
  | "Contractor"
  | "Vendor"
  | "Tenant"
  | "Owner"
  | "Family"
  | "Neighbor"
  | "Other";

export interface Contact {
  id: string;
  propertyId: string;
  firstName: string;
  surname: string;
  company?: string | null;
  jobTitle?: string | null;
  category?: ContactCategory;
  email?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  isEmergencyContact: boolean;
  rating?: number | null;
  hourlyRate?: number | null;
  currency?: string | null;
  specialties: string[];
  certificationId?: string | null;
  businessAddress?: Address | null;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

