import type { Address, GalleryItem, Note } from "./common";

export interface Property {
  id: string;
  householdId?: string;
  name: string;
  isArchived: boolean;
  isPrimaryResidence: boolean;
  address: Address;
  constructionYear?: number | null;
  constructionMonth?: number | null;
  floorArea?: number | null;
  propertyType?: string | null;
  occupancyStatus: "OwnerOccupied" | "TenantOccupied" | "Vacant" | "ShortTermRental";
  energyRating?: "A" | "B" | "C" | "D" | "E" | "F" | "G" | null;
  heatingSystemType?: string | null;
  roofType?: string | null;
  foundationType?: string | null;
  imageUrls?: string[];
  gallery: GalleryItem[];
  createdAtUtc: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}
