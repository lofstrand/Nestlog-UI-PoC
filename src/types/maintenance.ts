import type { Note } from "./common";

export enum MaintenanceTaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
}

export enum MaintenanceTaskStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum MaintenanceRecurrenceFrequency {
  None = "None",
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Quarterly = "Quarterly",
  Yearly = "Yearly",
}

export interface MaintenanceRecurrence {
  frequency: MaintenanceRecurrenceFrequency;
  interval: number;
}

export interface MaintenanceTask {
  id: string;
  propertyId: string;
  spaceIds: string[];
  assignedContactId?: string | null;
  requiredInventoryIds?: string[];
  laborHoursEstimate?: number | null;
  title: string;
  description?: string | null;
  dueDateUtc?: string | null;
  completedAtUtc?: string | null;
  nextDateUtc?: string | null;
  reminderAtUtc?: string | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  priority: MaintenanceTaskPriority;
  status: MaintenanceTaskStatus;
  recurrence?: MaintenanceRecurrence | null;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
  tags: string[];
  notes: Note[];
  documentIds: string[];
}

