import {
  MaintenanceRecurrenceFrequency,
  MaintenanceTaskPriority,
  SpaceType,
} from "@/types";
import type { MaintenanceTemplate } from "./types";

export const MAINTENANCE_TEMPLATES: MaintenanceTemplate[] = [
  {
    id: "prop-yearly-safety-check",
    appliesTo: { entityType: "property" },
    schedule: {
      dueInDays: 14,
      recurrence: { frequency: MaintenanceRecurrenceFrequency.Yearly, interval: 1 },
    },
    task: {
      title: "Annual property safety check",
      description:
        "Review smoke/CO detectors, emergency exits, and basic safety systems. Document findings and replace batteries where needed.",
      priority: MaintenanceTaskPriority.Medium,
      tags: ["Safety", "Inspection"],
    },
  },
  {
    id: "prop-seasonal-gutter-clean",
    appliesTo: { entityType: "property", propertyTypes: ["House", "Villa", "Townhouse"] },
    schedule: {
      dueInDays: 30,
      recurrence: {
        frequency: MaintenanceRecurrenceFrequency.Quarterly,
        interval: 1,
      },
    },
    task: {
      title: "Clean gutters and roof drainage",
      description:
        "Clear debris from gutters, downspouts, and roof drainage to prevent water damage.",
      priority: MaintenanceTaskPriority.Medium,
      tags: ["Exterior", "Seasonal"],
    },
  },
  {
    id: "prop-roof-inspection",
    appliesTo: { entityType: "property" },
    conditions: { minAgeYears: 5 },
    schedule: {
      dueInDays: 30,
      recurrence: { frequency: MaintenanceRecurrenceFrequency.Yearly, interval: 1 },
    },
    task: {
      title: "Inspect roof and flashing",
      description:
        "Check roof condition, flashing, and visible seals. Capture photos and note any wear or leaks.",
      priority: MaintenanceTaskPriority.Medium,
      tags: ["Exterior", "Inspection"],
    },
  },
  {
    id: "bathroom-sealant-check",
    appliesTo: { entityType: "space", spaceTypes: [SpaceType.Bathroom] },
    schedule: {
      dueInDays: 21,
      recurrence: { frequency: MaintenanceRecurrenceFrequency.Quarterly, interval: 1 },
    },
    task: {
      title: "Check bathroom sealant and grout",
      description:
        "Inspect sealant around shower/tub and grout lines. Re-seal if cracking, discoloration, or gaps appear.",
      priority: MaintenanceTaskPriority.Medium,
      tags: ["Bathroom", "Inspection"],
    },
  },
  {
    id: "bathroom-ventilation-clean",
    appliesTo: { entityType: "space", spaceTypes: [SpaceType.Bathroom, SpaceType.Laundry] },
    schedule: {
      dueInDays: 30,
      recurrence: { frequency: MaintenanceRecurrenceFrequency.Yearly, interval: 1 },
    },
    task: {
      title: "Clean ventilation fan / filter",
      description:
        "Clean ventilation fan cover and check airflow. Replace filter where applicable.",
      priority: MaintenanceTaskPriority.Low,
      tags: ["Ventilation"],
    },
  },
  {
    id: "kitchen-appliance-filter-clean",
    appliesTo: {
      entityType: "inventory",
      inventoryCategoryIncludes: ["Appliance", "Kitchen", "Cleaning"],
      inventoryNameIncludes: ["dishwasher", "vacuum", "dryer", "washer"],
    },
    conditions: { minAgeYears: 1 },
    schedule: {
      dueInDays: 14,
      recurrence: { frequency: MaintenanceRecurrenceFrequency.Quarterly, interval: 1 },
    },
    task: {
      title: "Clean filters and check moving parts",
      description:
        "Clean/replace filters and check hoses, seals, and common wear parts. Record any issues.",
      priority: MaintenanceTaskPriority.Low,
      tags: ["Appliance", "Preventive"],
    },
  },
  {
    id: "inventory-annual-manufacturer-check",
    appliesTo: { entityType: "inventory", inventoryCategoryIncludes: ["Electronics", "Appliance"] },
    schedule: {
      dueInDays: 30,
      recurrence: { frequency: MaintenanceRecurrenceFrequency.Yearly, interval: 1 },
    },
    task: {
      title: "Review warranty & manufacturer guidance",
      description:
        "Check warranty status, recommended service intervals, and keep documentation up to date.",
      priority: MaintenanceTaskPriority.Low,
      tags: ["Documentation"],
    },
  },
];

