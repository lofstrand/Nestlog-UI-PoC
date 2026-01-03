import type {
  InventoryItem,
  MaintenanceRecurrence,
  MaintenanceTaskPriority,
  Property,
  Space,
} from "@/types";

export type SuggestionEntityType = "property" | "space" | "inventory";

export type DismissedMaintenanceSuggestion = {
  templateId: string;
  entityType: SuggestionEntityType;
  entityId: string;
  dismissedAtUtc: string;
};

export type MaintenanceTemplate = {
  id: string;
  appliesTo: {
    entityType: SuggestionEntityType;
    propertyTypes?: string[];
    spaceTypes?: Array<Space["spaceType"]>;
    inventoryCategoryIncludes?: string[];
    inventoryNameIncludes?: string[];
  };
  conditions?: {
    minAgeYears?: number;
    maxAgeYears?: number;
  };
  schedule?: {
    dueInDays?: number;
    recurrence?: MaintenanceRecurrence | null;
  };
  task: {
    title: string;
    description?: string;
    priority: MaintenanceTaskPriority;
    tags?: string[];
    estimatedCost?: number | null;
    laborHoursEstimate?: number | null;
  };
};

export type MaintenanceSuggestion = {
  templateId: string;
  entityType: SuggestionEntityType;
  entityId: string;
  title: string;
  description?: string | null;
  reason: string;
  dueDateUtc?: string | null;
  recurrence?: MaintenanceRecurrence | null;
  priority: MaintenanceTaskPriority;
  tags: string[];
  estimatedCost?: number | null;
  laborHoursEstimate?: number | null;
  target: {
    propertyId: string;
    spaceIds: string[];
    requiredInventoryIds: string[];
  };
  source: "template";
};

export type SuggestionEngineInput = {
  now?: Date;
  entityType: SuggestionEntityType;
  property: Property;
  space?: Space;
  inventoryItem?: InventoryItem;
  existingTasks: Array<{ sourceTemplateId?: string | null; propertyId: string; spaceIds: string[]; requiredInventoryIds?: string[] }>;
  dismissed: DismissedMaintenanceSuggestion[];
};

