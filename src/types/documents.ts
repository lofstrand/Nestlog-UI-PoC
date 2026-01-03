import type { Note } from "./common";

export interface DocumentAttachment {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  createdAtUtc: string;
  thumbnailUrl?: string;
}

export interface Document {
  id: string;
  propertyId: string;
  spaceId?: string | null;
  contactId?: string | null;
  projectIds?: string[];
  taskIds?: string[];
  surfaceIds?: string[];
  title: string;
  category?: string | null;
  expiryDate?: string | null;
  physicalLocation?: string | null;
  isPrivate: boolean;
  attachments: DocumentAttachment[];
  notes: Note[];
  tags: string[];
  inventoryItems: {
    propertyId: string;
    documentId: string;
    inventoryItemId: string;
    createdAtUtc: string;
  }[];
  createdAtUtc: string;
  updatedAtUtc?: string | null;
}

