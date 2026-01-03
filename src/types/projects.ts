import type { GalleryItem, Note } from "./common";

export enum ProjectStatus {
  Planned = "Planned",
  Active = "Active",
  Completed = "Completed",
  OnHold = "OnHold",
  Cancelled = "Cancelled",
}

export interface ProjectTask {
  id: string;
  title: string;
  isCompleted: boolean;
  subtasks?: ProjectTask[];
}

export interface ProjectExpense {
  id: string;
  title: string;
  amount: number;
  dateUtc: string;
  category?: string;
  documentId?: string;
}

export interface Project {
  id: string;
  propertyId: string;
  spaceIds: string[];
  assignedContactId?: string | null;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
  actualCost?: number | null;
  gallery: GalleryItem[];
  createdAtUtc: string;
  updatedAtUtc?: string | null;
  tasks: ProjectTask[];
  expenses?: ProjectExpense[];
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

