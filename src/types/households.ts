import type { Note } from "./common";

export interface Household {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  description: string;
  propertyCount: number;
  lastMaintained: string;
  unitSystem?: "metric" | "imperial";
  currencyCode?: "SEK" | "EUR" | "USD";
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

export type PropertyRole = "Owner" | "Manager" | "Viewer" | "Contractor";

export interface PropertyPermission {
  propertyId: string;
  role: PropertyRole;
}

export interface HouseholdMember {
  id: string;
  householdId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedAtUtc: string;
  permissions: PropertyPermission[];
}

export interface HouseholdInvite {
  id: string;
  householdId: string;
  email: string;
  status: "Pending" | "Accepted" | "Declined" | "Expired";
  invitedBy: string;
  createdAtUtc: string;
}
