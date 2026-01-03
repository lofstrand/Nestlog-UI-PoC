export interface ActivityLogEntry {
  id: string;
  entityType:
    | "household"
    | "property"
    | "space"
    | "task"
    | "project"
    | "inventory"
    | "document"
    | "contact"
    | "insurance"
    | "utility"
    | "system";
  entityId: string;
  action:
    | "created"
    | "updated"
    | "deleted"
    | "completed"
    | "archived"
    | "payment_logged"
    | "note_added";
  timestamp: string;
  userName: string;
  details: string;
}

