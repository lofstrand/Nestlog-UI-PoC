import type { Note } from "./common";

export type InsurancePolicyType =
  | "Homeowners"
  | "Flood"
  | "Hazard"
  | "Liability"
  | "Auto"
  | "Umbrella"
  | "Jewelry/Valuables"
  | "Pet"
  | "Travel"
  | "Art"
  | "Cyber"
  | "Life"
  | "Health"
  | "Other";

export type ClaimCommunicationMode =
  | "Email"
  | "Phone"
  | "Portal"
  | "In-Person"
  | "Mail"
  | "Text";

export interface ClaimActivity {
  id: string;
  type: "Log" | "StatusChange" | "Communication" | "Payout" | "Attachment";
  content: string;
  communicationMode?: ClaimCommunicationMode;
  timestamp: string;
  eventDateUtc?: string;
  userName: string;
}

export interface InsuranceClaim {
  id: string;
  title: string;
  description: string;
  incidentDateUtc: string;
  status:
    | "Draft"
    | "Filed"
    | "InReview"
    | "AdjusterAssigned"
    | "Settled"
    | "Denied"
    | "Closed";
  payoutAmount?: number;
  payoutDestination?: string;
  settlementDateUtc?: string;
  contactPerson?: string;
  companyClaimId?: string;
  communicationMode?: ClaimCommunicationMode;
  conversationLog: ClaimActivity[];
  documentIds: string[];
  spaceIds?: string[];
  inventoryItemIds?: string[];
}

export interface InsurancePolicy {
  id: string;
  propertyId: string;
  providerId: string;
  title: string;
  policyNumber: string;
  type: InsurancePolicyType;
  premium: number;
  metric?: string;
  deductible: number;
  coverageLimit: number;
  startDate: string;
  endDate: string;
  renewalDate: string;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  documentIds: string[];
  tags: string[];
  claims?: InsuranceClaim[];
}

