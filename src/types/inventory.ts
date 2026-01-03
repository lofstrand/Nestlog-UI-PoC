import type { Note } from "./common";

export interface InventoryCategory {
  id: string;
  propertyId: string;
  parentId?: string | null;
  name: string;
  iconName?: string | null;
  colorHex?: string | null;
  canHaveChildren?: boolean;
  estimatedDepreciationRate?: number | null;
  isInsuranceCritical: boolean;
  sortOrder: number;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

export enum InventoryItemStatus {
  Excellent = "Excellent",
  Good = "Good",
  Fair = "Fair",
  Poor = "Poor",
  Broken = "Broken",
}

export interface InventoryItem {
  id: string;
  propertyId: string;
  spaceId?: string | null;
  name: string;
  brand?: string | null;
  modelNumber?: string | null;
  serialNumber?: string | null;
  category: string;
  status: InventoryItemStatus;
  quantity: number;
  unit: string;
  store?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  value?: number | null;
  powerWattage?: number | null;
  energyClass?: "A" | "B" | "C" | "D" | "E" | "F" | "G" | null;
  lastAuditDateUtc?: string | null;
  manufacturerUrl?: string | null;
  imageUrl?: string | null;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

