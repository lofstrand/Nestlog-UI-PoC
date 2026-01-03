import type { Note } from "./common";

export interface Tag {
  id: string;
  propertyId: string;
  name: string;
  description?: string | null;
  iconName?: string | null;
  colorHex?: string | null;
  usageCount?: number;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  documentIds: string[];
}

