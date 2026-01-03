import type { MaintenanceTask, Property, Space, InventoryItem } from "@/types";
import type {
  DismissedMaintenanceSuggestion,
  MaintenanceSuggestion,
  MaintenanceTemplate,
  SuggestionEngineInput,
  SuggestionEntityType,
} from "./types";

const norm = (s: string) => s.trim().toLowerCase();

const includesAny = (haystack: string, needles?: string[]) => {
  if (!needles || needles.length === 0) return false;
  const h = norm(haystack);
  return needles.some((n) => h.includes(norm(n)));
};

const getAgeYears = (isoOrYear?: string | number | null, now = new Date()) => {
  if (isoOrYear === null || isoOrYear === undefined) return null;
  if (typeof isoOrYear === "number") {
    if (!Number.isFinite(isoOrYear)) return null;
    return Math.max(0, now.getFullYear() - isoOrYear);
  }
  const d = new Date(isoOrYear);
  if (Number.isNaN(d.getTime())) return null;
  return Math.max(0, (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
};

const dueDateFromNow = (now: Date, dueInDays?: number) => {
  if (!dueInDays) return null;
  const d = new Date(now.getTime() + dueInDays * 24 * 60 * 60 * 1000);
  return d.toISOString();
};

const dismissedKey = (s: { templateId: string; entityType: SuggestionEntityType; entityId: string }) =>
  `${s.templateId}::${s.entityType}::${s.entityId}`;

const isDismissed = (
  dismissed: DismissedMaintenanceSuggestion[],
  templateId: string,
  entityType: SuggestionEntityType,
  entityId: string
) => dismissed.some((d) => dismissedKey(d) === dismissedKey({ templateId, entityType, entityId }));

const taskAlreadyCreatedForTarget = (
  tasks: MaintenanceTask[],
  templateId: string,
  entityType: SuggestionEntityType,
  entityId: string
) => {
  const matchesTemplate = tasks.filter((t) => t.sourceTemplateId === templateId);
  if (matchesTemplate.length === 0) return false;
  if (entityType === "property") {
    return matchesTemplate.some((t) => (t.spaceIds || []).length === 0);
  }
  if (entityType === "space") {
    return matchesTemplate.some((t) => (t.spaceIds || []).includes(entityId));
  }
  return matchesTemplate.some((t) => (t.requiredInventoryIds || []).includes(entityId));
};

const appliesToProperty = (tpl: MaintenanceTemplate, property: Property) => {
  if (tpl.appliesTo.entityType !== "property") return false;
  if (tpl.appliesTo.propertyTypes && tpl.appliesTo.propertyTypes.length > 0) {
    return (tpl.appliesTo.propertyTypes || []).some(
      (t) => norm(t) === norm(property.propertyType || "")
    );
  }
  return true;
};

const appliesToSpace = (tpl: MaintenanceTemplate, space: Space) => {
  if (tpl.appliesTo.entityType !== "space") return false;
  if (tpl.appliesTo.spaceTypes && tpl.appliesTo.spaceTypes.length > 0) {
    return (tpl.appliesTo.spaceTypes || []).includes(space.spaceType);
  }
  return true;
};

const appliesToInventory = (tpl: MaintenanceTemplate, item: InventoryItem) => {
  if (tpl.appliesTo.entityType !== "inventory") return false;
  const categoryOk =
    !tpl.appliesTo.inventoryCategoryIncludes ||
    includesAny(item.category || "", tpl.appliesTo.inventoryCategoryIncludes);
  const nameOk =
    !tpl.appliesTo.inventoryNameIncludes ||
    includesAny(item.name || "", tpl.appliesTo.inventoryNameIncludes);
  return categoryOk && nameOk;
};

const conditionsSatisfied = (tpl: MaintenanceTemplate, ageYears: number | null) => {
  if (!tpl.conditions) return true;
  const min = tpl.conditions.minAgeYears;
  const max = tpl.conditions.maxAgeYears;
  if (min !== undefined && min !== null) {
    if (ageYears === null) return false;
    if (ageYears < min) return false;
  }
  if (max !== undefined && max !== null) {
    if (ageYears === null) return true;
    if (ageYears > max) return false;
  }
  return true;
};

const reasonFor = (
  tpl: MaintenanceTemplate,
  entityType: SuggestionEntityType,
  entity: Property | Space | InventoryItem,
  ageYears: number | null
) => {
  const dueInDays = tpl.schedule?.dueInDays;
  const cadence = tpl.schedule?.recurrence
    ? `${tpl.schedule.recurrence.frequency.toLowerCase()}`
    : null;
  const age =
    ageYears === null ? null : `${Math.floor(ageYears)} year${Math.floor(ageYears) === 1 ? "" : "s"}`;

  if (entityType === "property") {
    const p = entity as Property;
    const type = p.propertyType ? ` (${p.propertyType})` : "";
    if (age) return `Suggested for this property${type} because it is ~${age} old.`;
    return `Suggested for this property${type}.`;
  }
  if (entityType === "space") {
    const s = entity as Space;
    const base = `Suggested for ${s.spaceType.replace(/([A-Z])/g, " $1").trim()} spaces.`;
    if (cadence) return `${base} Recommended ${cadence}.`;
    return base;
  }

  const i = entity as InventoryItem;
  const base = `Suggested for “${i.name}”${i.category ? ` (${i.category})` : ""}.`;
  if (age) return `${base} Item age is ~${age}.`;
  if (dueInDays) return `${base} Consider doing this within ${dueInDays} days.`;
  return base;
};

export function suggestMaintenanceTasks(
  templates: MaintenanceTemplate[],
  input: SuggestionEngineInput
): MaintenanceSuggestion[] {
  const now = input.now ?? new Date();
  const { entityType, property, space, inventoryItem, existingTasks, dismissed } = input;

  const tasks = existingTasks as MaintenanceTask[];

  const entityId =
    entityType === "property"
      ? property.id
      : entityType === "space"
        ? space?.id
        : inventoryItem?.id;
  if (!entityId) return [];

  const entity =
    entityType === "property"
      ? property
      : entityType === "space"
        ? space
        : inventoryItem;
  if (!entity) return [];

  const ageYears =
    entityType === "property"
      ? getAgeYears(property.constructionYear ?? null, now)
      : entityType === "space"
        ? null
        : getAgeYears(inventoryItem?.purchaseDate ?? null, now);
  const ageYearsNumber = ageYears === null ? null : Number(ageYears);

  return templates
    .filter((tpl) => {
      if (entityType === "property") return appliesToProperty(tpl, property);
      if (entityType === "space" && space) return appliesToSpace(tpl, space);
      if (entityType === "inventory" && inventoryItem) return appliesToInventory(tpl, inventoryItem);
      return false;
    })
    .filter((tpl) => conditionsSatisfied(tpl, ageYearsNumber))
    .filter((tpl) => !isDismissed(dismissed, tpl.id, entityType, entityId))
    .filter((tpl) => !taskAlreadyCreatedForTarget(tasks, tpl.id, entityType, entityId))
    .map((tpl) => {
      const dueDateUtc = dueDateFromNow(now, tpl.schedule?.dueInDays) ?? null;
      const targetSpaceIds =
        entityType === "space" && space ? [space.id] : [];
      const requiredInventoryIds =
        entityType === "inventory" && inventoryItem ? [inventoryItem.id] : [];
      const tags = Array.from(
        new Set(["Suggested", ...(tpl.task.tags || [])])
      );

      const suggestion: MaintenanceSuggestion = {
        templateId: tpl.id,
        entityType,
        entityId,
        title: tpl.task.title,
        description: tpl.task.description ?? null,
        reason: reasonFor(tpl, entityType, entity as any, ageYearsNumber),
        dueDateUtc,
        recurrence: tpl.schedule?.recurrence ?? null,
        priority: tpl.task.priority,
        tags,
        estimatedCost: tpl.task.estimatedCost ?? null,
        laborHoursEstimate: tpl.task.laborHoursEstimate ?? null,
        target: {
          propertyId: property.id,
          spaceIds: targetSpaceIds,
          requiredInventoryIds,
        },
        source: "template",
      };
      return suggestion;
    });
}

