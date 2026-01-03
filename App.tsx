import React, { useState, useEffect, useMemo } from "react";
import { LayoutDashboard, ChevronRight } from "lucide-react";
import {
  View,
  Household,
  Property,
  Space,
  SpaceType,
  SpaceSurfaceType,
  SpaceSurfaceMaterialType,
  MaintenanceTask,
  MaintenanceTaskPriority,
  MaintenanceTaskStatus,
  Project,
  ProjectStatus,
  Tag,
  InventoryItem,
  Contact,
  Document,
  InventoryCategory,
  Note,
  MaintenanceRecurrenceFrequency,
  InventoryItemStatus,
  InsurancePolicy,
  UtilityAccount,
  ActivityLogEntry,
  HouseholdMember,
  HouseholdInvite,
  SurfaceCondition,
} from "./types";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import HouseholdsList from "./components/HouseholdsList";
import PropertiesList from "./components/PropertiesList";
import SpacesList from "./components/SpacesList";
import MaintenanceList from "./components/MaintenanceList";
import ProjectsList from "./components/ProjectsList";
import TagsList from "./components/TagsList";
import InventoryList from "./components/InventoryList";
import ContactsList from "./components/ContactsList";
import DocumentsList from "./components/DocumentsList";
import InventoryCategoriesList from "./components/InventoryCategoriesList";
import GroupDashboard from "./components/GroupDashboard";
import EntityDetail from "./components/EntityDetail";
import ProfilePage from "./components/ProfilePage";
import InsuranceList from "./components/InsuranceList";
import UtilityList from "./components/UtilityList";
import NotificationsArchive from "./components/NotificationsArchive";
import ActivityLog from "./components/ActivityLog";

// --- SEED DATA: TAGS ---
const MOCK_TAGS: Tag[] = [
  {
    id: "tag1",
    propertyId: "p1",
    name: "ROT-avdrag",
    description: "Tax deductible labor.",
    iconName: "TrendingDown",
    colorHex: "#5a6b5d",
    usageCount: 18,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag2",
    propertyId: "p1",
    name: "RUT-avdrag",
    description: "Domestic services.",
    iconName: "Sparkles",
    colorHex: "#1e293b",
    usageCount: 9,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag3",
    propertyId: "p1",
    name: "Warranty",
    description: "Active warranty.",
    iconName: "ShieldCheck",
    colorHex: "#3a5a40",
    usageCount: 31,
    notes: [],
    documentIds: ["d1", "d2"],
  },
  {
    id: "tag4",
    propertyId: "p1",
    name: "Critical",
    description: "Immediate attention.",
    iconName: "AlertCircle",
    colorHex: "#b45c43",
    usageCount: 7,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag5",
    propertyId: "p1",
    name: "Energy Efficient",
    description: "Low energy usage.",
    iconName: "Zap",
    colorHex: "#a47148",
    usageCount: 21,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag6",
    propertyId: "p1",
    name: "Renovation",
    description: "Renovation work.",
    iconName: "Hammer",
    colorHex: "#6b7280",
    usageCount: 14,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag7",
    propertyId: "p1",
    name: "Plumbing",
    description: "Water systems.",
    iconName: "Droplet",
    colorHex: "#0ea5e9",
    usageCount: 11,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag8",
    propertyId: "p1",
    name: "Electrical",
    description: "Electrical systems.",
    iconName: "Plug",
    colorHex: "#f59e0b",
    usageCount: 17,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag9",
    propertyId: "p1",
    name: "Inspection Required",
    description: "Needs inspection.",
    iconName: "Search",
    colorHex: "#7c3aed",
    usageCount: 6,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag10",
    propertyId: "p1",
    name: "Outdoor",
    description: "Exterior items.",
    iconName: "Trees",
    colorHex: "#15803d",
    usageCount: 13,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag11",
    propertyId: "p1",
    name: "Smart Home",
    description: "Connected devices.",
    iconName: "Cpu",
    colorHex: "#0f172a",
    usageCount: 10,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag12",
    propertyId: "p1",
    name: "Luxury",
    description: "High-end assets.",
    iconName: "Diamond",
    colorHex: "#7c2d12",
    usageCount: 8,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag13",
    propertyId: "p1",
    name: "Fire Safety",
    description: "Fire protection.",
    iconName: "Flame",
    colorHex: "#dc2626",
    usageCount: 5,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag14",
    propertyId: "p1",
    name: "Insurance",
    description: "Insured items.",
    iconName: "FileText",
    colorHex: "#334155",
    usageCount: 22,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag15",
    propertyId: "p1",
    name: "Seasonal",
    description: "Seasonal use.",
    iconName: "Snowflake",
    colorHex: "#0ea5e9",
    usageCount: 9,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag16",
    propertyId: "p1",
    name: "Security",
    description: "Security systems.",
    iconName: "Lock",
    colorHex: "#020617",
    usageCount: 12,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag17",
    propertyId: "p1",
    name: "Audio",
    description: "Sound systems.",
    iconName: "Volume2",
    colorHex: "#4f46e5",
    usageCount: 6,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag18",
    propertyId: "p1",
    name: "Lighting",
    description: "Lighting fixtures.",
    iconName: "Lightbulb",
    colorHex: "#fde047",
    usageCount: 15,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag19",
    propertyId: "p1",
    name: "Flooring",
    description: "Floor surfaces.",
    iconName: "Grid",
    colorHex: "#78716c",
    usageCount: 4,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag20",
    propertyId: "p1",
    name: "Windows",
    description: "Glass & windows.",
    iconName: "Square",
    colorHex: "#94a3b8",
    usageCount: 7,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag21",
    propertyId: "p1",
    name: "Heating",
    description: "Heating systems.",
    iconName: "Thermometer",
    colorHex: "#ef4444",
    usageCount: 9,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag22",
    propertyId: "p1",
    name: "Cooling",
    description: "Cooling systems.",
    iconName: "Fan",
    colorHex: "#22d3ee",
    usageCount: 5,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag23",
    propertyId: "p1",
    name: "Appliance",
    description: "Household appliances.",
    iconName: "Home",
    colorHex: "#1e293b",
    usageCount: 28,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag24",
    propertyId: "p1",
    name: "High Value",
    description: "High value asset.",
    iconName: "Star",
    colorHex: "#facc15",
    usageCount: 6,
    notes: [],
    documentIds: [],
  },
  {
    id: "tag25",
    propertyId: "p1",
    name: "Maintenance Plan",
    description: "Planned maintenance.",
    iconName: "Calendar",
    colorHex: "#64748b",
    usageCount: 19,
    notes: [],
    documentIds: [],
  },
];

// --- SEED DATA: CATEGORIES ---
const MOCK_CATEGORIES: InventoryCategory[] = [
  {
    id: "cat1",
    propertyId: "p1",
    name: "White Goods",
    iconName: "Refrigerator",
    colorHex: "#1e293b",
    isInsuranceCritical: true,
    estimatedDepreciationRate: 10,
    sortOrder: 1,
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "cat2",
    propertyId: "p1",
    name: "Consumer Electronics",
    iconName: "Cpu",
    colorHex: "#2563eb",
    isInsuranceCritical: true,
    estimatedDepreciationRate: 20,
    sortOrder: 2,
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "cat3",
    propertyId: "p1",
    name: "Designer Furniture",
    iconName: "Armchair",
    colorHex: "#a47148",
    isInsuranceCritical: true,
    estimatedDepreciationRate: 5,
    sortOrder: 3,
    notes: [],
    tags: [],
    documentIds: [],
  },
];

// --- SEED DATA: DOCUMENTS ---
// --- SEED DATA: DOCUMENTS ---
const MOCK_DOCUMENTS: Document[] = [
  {
    id: "d1",
    propertyId: "p1",
    title: "Östermalm Penthouse Deed",
    category: "Legal Deed",
    isPrivate: true,
    attachments: [
      {
        id: "att1",
        fileName: "deed_archive.pdf",
        contentType: "application/pdf",
        sizeBytes: 5200000,
        createdAtUtc: "2023-01-15T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Critical"],
    inventoryItems: [],
    createdAtUtc: "2023-01-15T00:00:00Z",
    projectIds: [],
    taskIds: [],
    surfaceIds: [],
  },
  {
    id: "d2",
    propertyId: "p1",
    title: "Miele Dishwasher Manual",
    category: "User Manual",
    isPrivate: false,
    attachments: [
      {
        id: "att2",
        fileName: "miele_dishwasher_guide.pdf",
        contentType: "application/pdf",
        sizeBytes: 1800000,
        createdAtUtc: "2023-02-10T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Warranty", "Appliance"],
    inventoryItems: ["i1"],
    createdAtUtc: "2023-02-10T00:00:00Z",
    projectIds: [],
    taskIds: ["t3"],
    surfaceIds: [],
  },

  {
    id: "d3",
    propertyId: "p1",
    title: "Home Insurance Policy 2024",
    category: "Insurance Policy",
    isPrivate: true,
    attachments: [
      {
        id: "att3",
        fileName: "home_insurance_2024.pdf",
        contentType: "application/pdf",
        sizeBytes: 2400000,
        createdAtUtc: "2024-01-01T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Insurance"],
    inventoryItems: [],
    createdAtUtc: "2024-01-01T00:00:00Z",
    projectIds: [],
    taskIds: [],
    surfaceIds: [],
  },

  {
    id: "d4",
    propertyId: "p1",
    title: "Fire Safety Inspection Report",
    category: "Inspection Report",
    isPrivate: false,
    attachments: [
      {
        id: "att4",
        fileName: "fire_safety_report.pdf",
        contentType: "application/pdf",
        sizeBytes: 950000,
        createdAtUtc: "2023-01-10T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Fire Safety", "Inspection Required"],
    inventoryItems: [],
    createdAtUtc: "2023-01-10T00:00:00Z",
    projectIds: ["proj18"],
    taskIds: ["t4"],
    surfaceIds: [],
  },

  {
    id: "d5",
    propertyId: "p1",
    title: "Kitchen Renovation Invoice",
    category: "Invoice",
    isPrivate: true,
    attachments: [
      {
        id: "att5",
        fileName: "kitchen_invoice_2023.pdf",
        contentType: "application/pdf",
        sizeBytes: 1200000,
        createdAtUtc: "2023-06-20T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Renovation", "ROT-avdrag"],
    inventoryItems: [],
    createdAtUtc: "2023-06-20T00:00:00Z",
    projectIds: ["proj7"],
    taskIds: [],
    surfaceIds: [],
  },

  {
    id: "d6",
    propertyId: "p1",
    title: "Electrical Panel Certificate",
    category: "Compliance Certificate",
    isPrivate: false,
    attachments: [
      {
        id: "att6",
        fileName: "electrical_panel_cert.pdf",
        contentType: "application/pdf",
        sizeBytes: 780000,
        createdAtUtc: "2022-11-05T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Electrical"],
    inventoryItems: ["i20"],
    createdAtUtc: "2022-11-05T00:00:00Z",
    projectIds: ["proj19"],
    taskIds: ["t10"],
    surfaceIds: [],
  },

  {
    id: "d7",
    propertyId: "p1",
    title: "Bosch Washer Warranty",
    category: "Warranty",
    isPrivate: false,
    attachments: [
      {
        id: "att7",
        fileName: "bosch_washer_warranty.pdf",
        contentType: "application/pdf",
        sizeBytes: 450000,
        createdAtUtc: "2022-01-20T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Warranty"],
    inventoryItems: ["i7"],
    createdAtUtc: "2022-01-20T00:00:00Z",
    projectIds: [],
    taskIds: [],
    surfaceIds: [],
  },

  {
    id: "d8",
    propertyId: "p1",
    title: "Balcony Waterproofing Quote",
    category: "Quote",
    isPrivate: false,
    attachments: [
      {
        id: "att8",
        fileName: "balcony_quote.pdf",
        contentType: "application/pdf",
        sizeBytes: 620000,
        createdAtUtc: "2024-05-10T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Outdoor", "Renovation"],
    inventoryItems: [],
    createdAtUtc: "2024-05-10T00:00:00Z",
    projectIds: ["proj6"],
    taskIds: ["t2", "t19"],
    surfaceIds: [],
  },

  {
    id: "d9",
    propertyId: "p1",
    title: "Sauna Heater Installation Manual",
    category: "User Manual",
    isPrivate: false,
    attachments: [
      {
        id: "att9",
        fileName: "harvia_cilindro_manual.pdf",
        contentType: "application/pdf",
        sizeBytes: 1300000,
        createdAtUtc: "2020-10-01T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Heating"],
    inventoryItems: ["i17"],
    createdAtUtc: "2020-10-01T00:00:00Z",
    projectIds: ["proj5"],
    taskIds: ["t15"],
    surfaceIds: [],
  },

  {
    id: "d10",
    propertyId: "p1",
    title: "Wine Cellar Climate Calibration",
    category: "Technical Report",
    isPrivate: false,
    attachments: [
      {
        id: "att10",
        fileName: "wine_climate_report.pdf",
        contentType: "application/pdf",
        sizeBytes: 880000,
        createdAtUtc: "2022-09-15T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Cooling"],
    inventoryItems: ["i18"],
    createdAtUtc: "2022-09-15T00:00:00Z",
    projectIds: ["proj11"],
    taskIds: [],
    surfaceIds: [],
  },

  {
    id: "d11",
    propertyId: "p1",
    title: "Alarm System Contract",
    category: "Contract",
    isPrivate: true,
    attachments: [
      {
        id: "att11",
        fileName: "alarm_contract.pdf",
        contentType: "application/pdf",
        sizeBytes: 1100000,
        createdAtUtc: "2024-02-01T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Security"],
    inventoryItems: ["i15"],
    createdAtUtc: "2024-02-01T00:00:00Z",
    projectIds: ["proj8"],
    taskIds: ["t20"],
    surfaceIds: [],
  },

  {
    id: "d12",
    propertyId: "p1",
    title: "Floor Restoration Before/After",
    category: "Photo Documentation",
    isPrivate: false,
    attachments: [
      {
        id: "att12",
        fileName: "floors_before_after.zip",
        contentType: "application/zip",
        sizeBytes: 9800000,
        createdAtUtc: "2022-04-15T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Flooring"],
    inventoryItems: [],
    createdAtUtc: "2022-04-15T00:00:00Z",
    projectIds: ["proj10"],
    taskIds: [],
    surfaceIds: [],
  },

  {
    id: "d13",
    propertyId: "p1",
    title: "HVAC Filter Replacement Guide",
    category: "Maintenance Guide",
    isPrivate: false,
    attachments: [
      {
        id: "att13",
        fileName: "hvac_filter_guide.pdf",
        contentType: "application/pdf",
        sizeBytes: 390000,
        createdAtUtc: "2023-03-01T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Maintenance Plan"],
    inventoryItems: [],
    createdAtUtc: "2023-03-01T00:00:00Z",
    projectIds: [],
    taskIds: ["t1"],
    surfaceIds: [],
  },

  {
    id: "d14",
    propertyId: "p1",
    title: "Window Replacement Agreement",
    category: "Contract",
    isPrivate: true,
    attachments: [
      {
        id: "att14",
        fileName: "window_replacement_contract.pdf",
        contentType: "application/pdf",
        sizeBytes: 1700000,
        createdAtUtc: "2024-05-20T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Windows"],
    inventoryItems: [],
    createdAtUtc: "2024-05-20T00:00:00Z",
    projectIds: ["proj9"],
    taskIds: ["t16"],
    surfaceIds: [],
  },

  {
    id: "d15",
    propertyId: "p1",
    title: "Smart Lighting Configuration Export",
    category: "Configuration",
    isPrivate: false,
    attachments: [
      {
        id: "att15",
        fileName: "hue_scenes.json",
        contentType: "application/json",
        sizeBytes: 120000,
        createdAtUtc: "2023-10-10T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Lighting", "Smart Home"],
    inventoryItems: ["i10"],
    createdAtUtc: "2023-10-10T00:00:00Z",
    projectIds: ["proj3", "proj15"],
    taskIds: [],
    surfaceIds: [],
  },

  {
    id: "d16",
    propertyId: "p1",
    title: "Gym Equipment Service Log",
    category: "Service Log",
    isPrivate: false,
    attachments: [
      {
        id: "att16",
        fileName: "gym_service_log.xlsx",
        contentType: "application/vnd.ms-excel",
        sizeBytes: 210000,
        createdAtUtc: "2024-01-15T00:00:00Z",
      },
    ],
    notes: [],
    tags: [],
    inventoryItems: ["i16"],
    createdAtUtc: "2024-01-15T00:00:00Z",
    projectIds: ["proj13"],
    taskIds: [],
    surfaceIds: [],
  },

  {
    id: "d17",
    propertyId: "p1",
    title: "Energy Consumption Audit Results",
    category: "Audit Report",
    isPrivate: false,
    attachments: [
      {
        id: "att17",
        fileName: "energy_audit_2024.pdf",
        contentType: "application/pdf",
        sizeBytes: 1450000,
        createdAtUtc: "2024-01-20T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Energy Efficient"],
    inventoryItems: [],
    createdAtUtc: "2024-01-20T00:00:00Z",
    projectIds: ["proj20"],
    taskIds: [],
    surfaceIds: [],
  },

  {
    id: "d18",
    propertyId: "p1",
    title: "Technical Room Wiring Diagram",
    category: "Technical Drawing",
    isPrivate: false,
    attachments: [
      {
        id: "att18",
        fileName: "technical_room_wiring.dwg",
        contentType: "application/octet-stream",
        sizeBytes: 3100000,
        createdAtUtc: "2022-11-10T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Electrical"],
    inventoryItems: ["i20"],
    createdAtUtc: "2022-11-10T00:00:00Z",
    projectIds: ["proj19"],
    taskIds: [],
    surfaceIds: [],
  },

  {
    id: "d19",
    propertyId: "p1",
    title: "Cleaning Service Agreement",
    category: "Contract",
    isPrivate: true,
    attachments: [
      {
        id: "att19",
        fileName: "cleaning_agreement.pdf",
        contentType: "application/pdf",
        sizeBytes: 600000,
        createdAtUtc: "2023-02-01T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["RUT-avdrag"],
    inventoryItems: [],
    createdAtUtc: "2023-02-01T00:00:00Z",
    projectIds: [],
    taskIds: ["t11"],
    surfaceIds: [],
  },

  {
    id: "d20",
    propertyId: "p1",
    title: "Entrance Redesign Concept",
    category: "Design Concept",
    isPrivate: false,
    attachments: [
      {
        id: "att20",
        fileName: "entrance_design.pdf",
        contentType: "application/pdf",
        sizeBytes: 2200000,
        createdAtUtc: "2024-04-15T00:00:00Z",
      },
    ],
    notes: [],
    tags: [],
    inventoryItems: [],
    createdAtUtc: "2024-04-15T00:00:00Z",
    projectIds: ["proj17"],
    taskIds: [],
    surfaceIds: [],
  },

  {
    id: "d21",
    propertyId: "p1",
    title: "Water Pressure Test Results",
    category: "Inspection Report",
    isPrivate: false,
    attachments: [
      {
        id: "att21",
        fileName: "water_pressure_test.pdf",
        contentType: "application/pdf",
        sizeBytes: 420000,
        createdAtUtc: "2024-06-22T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Plumbing"],
    inventoryItems: [],
    createdAtUtc: "2024-06-22T00:00:00Z",
    projectIds: [],
    taskIds: ["t18"],
    surfaceIds: [],
  },

  {
    id: "d22",
    propertyId: "p1",
    title: "Smoke Detector Specification Sheet",
    category: "Specification",
    isPrivate: false,
    attachments: [
      {
        id: "att22",
        fileName: "smoke_detector_specs.pdf",
        contentType: "application/pdf",
        sizeBytes: 310000,
        createdAtUtc: "2022-12-01T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Fire Safety"],
    inventoryItems: [],
    createdAtUtc: "2022-12-01T00:00:00Z",
    projectIds: [],
    taskIds: ["t4"],
    surfaceIds: [],
  },

  {
    id: "d23",
    propertyId: "p1",
    title: "Utility Meter Readings 2024",
    category: "Utility Records",
    isPrivate: false,
    attachments: [
      {
        id: "att23",
        fileName: "meter_readings_2024.xlsx",
        contentType: "application/vnd.ms-excel",
        sizeBytes: 260000,
        createdAtUtc: "2024-05-01T00:00:00Z",
      },
    ],
    notes: [],
    tags: [],
    inventoryItems: [],
    createdAtUtc: "2024-05-01T00:00:00Z",
    projectIds: [],
    taskIds: [],
    surfaceIds: [],
  },

  {
    id: "d24",
    propertyId: "p1",
    title: "Network Firmware Update Notes",
    category: "Release Notes",
    isPrivate: false,
    attachments: [
      {
        id: "att24",
        fileName: "network_firmware_notes.txt",
        contentType: "text/plain",
        sizeBytes: 48000,
        createdAtUtc: "2024-06-20T00:00:00Z",
      },
    ],
    notes: [],
    tags: ["Smart Home"],
    inventoryItems: ["i20"],
    createdAtUtc: "2024-06-20T00:00:00Z",
    projectIds: ["proj4"],
    taskIds: ["t6"],
    surfaceIds: [],
  },
];

// --- SEED DATA: HOUSEHOLDS ---
const MOCK_HOUSEHOLDS: Household[] = [
  {
    id: "h1",
    name: "Stockholm Portfolio",
    status: "Active",
    description: "Primary urban residence and surrounding investment units.",
    propertyCount: 2,
    lastMaintained: "2024-05-10",
    currencyCode: "SEK",
    notes: [],
    tags: ["Primary"],
    documentIds: [],
  },
  {
    id: "h2",
    name: "Scandanavian Retreats",
    status: "Active",
    description: "Leisure properties for seasonal use.",
    propertyCount: 2,
    lastMaintained: "2024-03-22",
    currencyCode: "SEK",
    notes: [],
    tags: ["Vacation"],
    documentIds: [],
  },
];

// --- SEED DATA: PROPERTIES ---
const MOCK_PROPERTIES: Property[] = [
  {
    id: "p1",
    name: "Östermalm Penthouse",
    isPrimaryResidence: true,
    isArchived: false,
    address: {
      line1: "Grev Turegatan 12",
      city: "Stockholm",
      stateOrRegion: "AB",
      postalCode: "114 46",
      countryCode: "SE",
    },
    constructionYear: 1912,
    floorArea: 145,
    propertyType: "Apartment",
    occupancyStatus: "OwnerOccupied",
    energyRating: "B",
    heatingSystemType: "District Heating",
    roofType: "Zinc Siding",
    gallery: [],
    createdAtUtc: "2023-01-15T00:00:00Z",
    notes: [],
    tags: ["Urban"],
    documentIds: [],
  },
];

// --- SEED DATA: SPACES ---
const MOCK_SPACES: Space[] = [
  {
    id: "s1",
    propertyId: "p1",
    name: "Kitchen",
    spaceType: SpaceType.Kitchen,
    level: 1,
    isOutdoor: false,
    sortOrder: 1,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-01T00:00:00Z",
    updatedAtUtc: "2023-01-01T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s2",
    propertyId: "p1",
    name: "Living Room",
    spaceType: SpaceType.LivingRoom,
    level: 1,
    isOutdoor: false,
    sortOrder: 2,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-01T00:00:00Z",
    updatedAtUtc: "2023-01-01T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s3",
    propertyId: "p1",
    name: "Dining Room",
    spaceType: SpaceType.DiningRoom,
    level: 1,
    isOutdoor: false,
    sortOrder: 3,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-01T00:00:00Z",
    updatedAtUtc: "2023-01-01T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s4",
    propertyId: "p1",
    name: "Master Bedroom",
    spaceType: SpaceType.Bedroom,
    level: 1,
    isOutdoor: false,
    sortOrder: 4,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-02T00:00:00Z",
    updatedAtUtc: "2023-01-02T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s5",
    propertyId: "p1",
    name: "Guest Bedroom",
    spaceType: SpaceType.Bedroom,
    level: 1,
    isOutdoor: false,
    sortOrder: 5,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-02T00:00:00Z",
    updatedAtUtc: "2023-01-02T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s6",
    propertyId: "p1",
    name: "Office",
    spaceType: SpaceType.Office,
    level: 1,
    isOutdoor: false,
    sortOrder: 6,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-03T00:00:00Z",
    updatedAtUtc: "2023-01-03T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s7",
    propertyId: "p1",
    name: "Bathroom 1",
    spaceType: SpaceType.Bathroom,
    level: 1,
    isOutdoor: false,
    sortOrder: 7,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-03T00:00:00Z",
    updatedAtUtc: "2023-01-03T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s8",
    propertyId: "p1",
    name: "Bathroom 2",
    spaceType: SpaceType.Bathroom,
    level: 1,
    isOutdoor: false,
    sortOrder: 8,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-03T00:00:00Z",
    updatedAtUtc: "2023-01-03T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s9",
    propertyId: "p1",
    name: "Hallway",
    spaceType: SpaceType.Other,
    level: 1,
    isOutdoor: false,
    sortOrder: 9,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-04T00:00:00Z",
    updatedAtUtc: "2023-01-04T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s10",
    propertyId: "p1",
    name: "Walk-in Closet",
    spaceType: SpaceType.Outdoor,
    level: 1,
    isOutdoor: false,
    sortOrder: 10,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-04T00:00:00Z",
    updatedAtUtc: "2023-01-04T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },

  // Outdoor
  {
    id: "s11",
    propertyId: "p1",
    name: "Balcony East",
    spaceType: SpaceType.Other,
    level: 1,
    isOutdoor: true,
    sortOrder: 11,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-05T00:00:00Z",
    updatedAtUtc: "2023-01-05T00:00:00Z",
    notes: [],
    tags: ["Outdoor"],
    documentIds: [],
  },
  {
    id: "s12",
    propertyId: "p1",
    name: "Balcony West",
    spaceType: SpaceType.Other,
    level: 1,
    isOutdoor: true,
    sortOrder: 12,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-05T00:00:00Z",
    updatedAtUtc: "2023-01-05T00:00:00Z",
    notes: [],
    tags: ["Outdoor"],
    documentIds: [],
  },

  // Utility / storage
  {
    id: "s13",
    propertyId: "p1",
    name: "Laundry Room",
    spaceType: SpaceType.Other,
    level: 1,
    isOutdoor: false,
    sortOrder: 13,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-06T00:00:00Z",
    updatedAtUtc: "2023-01-06T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s14",
    propertyId: "p1",
    name: "Pantry",
    spaceType: SpaceType.Outdoor,
    level: 1,
    isOutdoor: false,
    sortOrder: 14,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-06T00:00:00Z",
    updatedAtUtc: "2023-01-06T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s15",
    propertyId: "p1",
    name: "Wine Cellar",
    spaceType: SpaceType.Outdoor,
    level: 0,
    isOutdoor: false,
    sortOrder: 15,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-07T00:00:00Z",
    updatedAtUtc: "2023-01-07T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },

  // Extra rooms
  {
    id: "s16",
    propertyId: "p1",
    name: "Media Room",
    spaceType: SpaceType.LivingRoom,
    level: 1,
    isOutdoor: false,
    sortOrder: 16,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-08T00:00:00Z",
    updatedAtUtc: "2023-01-08T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s17",
    propertyId: "p1",
    name: "Gym",
    spaceType: SpaceType.Other,
    level: 1,
    isOutdoor: false,
    sortOrder: 17,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-08T00:00:00Z",
    updatedAtUtc: "2023-01-08T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s18",
    propertyId: "p1",
    name: "Sauna",
    spaceType: SpaceType.Other,
    level: 1,
    isOutdoor: false,
    sortOrder: 18,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-09T00:00:00Z",
    updatedAtUtc: "2023-01-09T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s19",
    propertyId: "p1",
    name: "Guest WC",
    spaceType: SpaceType.Bathroom,
    level: 1,
    isOutdoor: false,
    sortOrder: 19,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-09T00:00:00Z",
    updatedAtUtc: "2023-01-09T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s20",
    propertyId: "p1",
    name: "Storage Room",
    spaceType: SpaceType.Outdoor,
    level: 0,
    isOutdoor: false,
    sortOrder: 20,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-10T00:00:00Z",
    updatedAtUtc: "2023-01-10T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s21",
    propertyId: "p1",
    name: "Technical Room",
    spaceType: SpaceType.Other,
    level: 0,
    isOutdoor: false,
    sortOrder: 21,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-10T00:00:00Z",
    updatedAtUtc: "2023-01-10T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "s22",
    propertyId: "p1",
    name: "Entrance",
    spaceType: SpaceType.Other,
    level: 1,
    isOutdoor: false,
    sortOrder: 22,
    isArchived: false,
    surfaces: [],
    gallery: [],
    createdAtUtc: "2023-01-11T00:00:00Z",
    updatedAtUtc: "2023-01-11T00:00:00Z",
    notes: [],
    tags: [],
    documentIds: [],
  },
];

// --- SEED DATA: INVENTORY ---
const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "i1",
    propertyId: "p1",
    spaceId: "s1",
    name: "Miele Dishwasher",
    brand: "Miele",
    modelNumber: "G 7160",
    category: "White Goods",
    status: InventoryItemStatus.Excellent,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2023-02-15",
    purchasePrice: 15400,
    value: 14000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Warranty"],
    documentIds: [],
  },
  {
    id: "i2",
    propertyId: "p1",
    spaceId: "s1",
    name: "Siemens Induction Hob",
    brand: "Siemens",
    modelNumber: "EH675",
    category: "White Goods",
    status: InventoryItemStatus.Excellent,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2023-02-10",
    purchasePrice: 11200,
    value: 10000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Energy Efficient"],
    documentIds: [],
  },
  {
    id: "i3",
    propertyId: "p1",
    spaceId: "s2",
    name: "Samsung Frame TV",
    brand: "Samsung",
    modelNumber: "LS03B",
    category: "Consumer Electronics",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2022-11-01",
    purchasePrice: 17900,
    value: 13500,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Smart Home"],
    documentIds: [],
  },
  {
    id: "i4",
    propertyId: "p1",
    spaceId: "s4",
    name: "Hästens Bed",
    brand: "Hästens",
    modelNumber: "2000T",
    category: "Designer Furniture",
    status: InventoryItemStatus.Excellent,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2021-05-12",
    purchasePrice: 185000,
    value: 160000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["High Value"],
    documentIds: [],
  },
  {
    id: "i5",
    propertyId: "p1",
    spaceId: "s6",
    name: "Herman Miller Aeron",
    brand: "Herman Miller",
    modelNumber: "Aeron",
    category: "Designer Furniture",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2022-03-14",
    purchasePrice: 16500,
    value: 12500,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: [],
    documentIds: [],
  },

  // kitchen + utility
  {
    id: "i6",
    propertyId: "p1",
    spaceId: "s1",
    name: "Miele Fridge",
    brand: "Miele",
    modelNumber: "KFN 4795",
    category: "White Goods",
    status: InventoryItemStatus.Excellent,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2023-02-15",
    purchasePrice: 24800,
    value: 22000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Warranty"],
    documentIds: [],
  },
  {
    id: "i7",
    propertyId: "p1",
    spaceId: "s13",
    name: "Bosch Washer",
    brand: "Bosch",
    modelNumber: "WAX32",
    category: "White Goods",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2022-01-20",
    purchasePrice: 8900,
    value: 6200,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "i8",
    propertyId: "p1",
    spaceId: "s13",
    name: "Bosch Dryer",
    brand: "Bosch",
    modelNumber: "WTW85",
    category: "White Goods",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2022-01-20",
    purchasePrice: 9100,
    value: 6500,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: [],
    documentIds: [],
  },

  // audio / lighting
  {
    id: "i9",
    propertyId: "p1",
    spaceId: "s16",
    name: "Sonos Arc",
    brand: "Sonos",
    modelNumber: "Arc",
    category: "Consumer Electronics",
    status: InventoryItemStatus.Excellent,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2023-09-01",
    purchasePrice: 9990,
    value: 8500,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Audio"],
    documentIds: [],
  },
  {
    id: "i10",
    propertyId: "p1",
    spaceId: "s16",
    name: "Philips Hue Set",
    brand: "Philips",
    modelNumber: "Hue White",
    category: "Lighting",
    status: InventoryItemStatus.Excellent,
    quantity: 12,
    unit: "pcs",
    purchaseDate: "2023-10-05",
    purchasePrice: 7400,
    value: 6500,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Smart Home"],
    documentIds: [],
  },

  // bathrooms
  {
    id: "i11",
    propertyId: "p1",
    spaceId: "s7",
    name: "Hansgrohe Shower",
    brand: "Hansgrohe",
    modelNumber: "RainSelect",
    category: "Bathroom Fixtures",
    status: InventoryItemStatus.Excellent,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2023-04-01",
    purchasePrice: 12500,
    value: 11000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Plumbing"],
    documentIds: [],
  },
  {
    id: "i12",
    propertyId: "p1",
    spaceId: "s8",
    name: "Duravit Sink",
    brand: "Duravit",
    modelNumber: "ME by Starck",
    category: "Bathroom Fixtures",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2021-07-01",
    purchasePrice: 5600,
    value: 3800,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: [],
    documentIds: [],
  },

  // outdoor
  {
    id: "i13",
    propertyId: "p1",
    spaceId: "s11",
    name: "Outdoor Heater",
    brand: "Muurikka",
    modelNumber: "Electric Patio",
    category: "Outdoor Equipment",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2022-05-15",
    purchasePrice: 4200,
    value: 3000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Outdoor"],
    documentIds: [],
  },
  {
    id: "i14",
    propertyId: "p1",
    spaceId: "s12",
    name: "Outdoor Table",
    brand: "Skagerak",
    modelNumber: "Pelago",
    category: "Outdoor Equipment",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2022-05-15",
    purchasePrice: 18000,
    value: 14000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Outdoor"],
    documentIds: [],
  },

  // misc
  {
    id: "i15",
    propertyId: "p1",
    spaceId: "s10",
    name: "Safe Cabinet",
    brand: "Yale",
    modelNumber: "YSV/390",
    category: "Consumer Electronics",
    status: InventoryItemStatus.Excellent,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2021-12-01",
    purchasePrice: 6900,
    value: 5500,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Security"],
    documentIds: [],
  },
  {
    id: "i16",
    propertyId: "p1",
    spaceId: "s17",
    name: "Treadmill",
    brand: "Technogym",
    modelNumber: "Run Personal",
    category: "Consumer Electronics",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2020-10-01",
    purchasePrice: 68000,
    value: 42000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "i17",
    propertyId: "p1",
    spaceId: "s18",
    name: "Sauna Heater",
    brand: "Harvia",
    modelNumber: "Cilindro",
    category: "Consumer Electronics",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2020-10-01",
    purchasePrice: 14500,
    value: 9000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Heating"],
    documentIds: [],
  },

  // storage
  {
    id: "i18",
    propertyId: "p1",
    spaceId: "s15",
    name: "Wine Fridge",
    brand: "Liebherr",
    modelNumber: "WKT 5551",
    category: "White Goods",
    status: InventoryItemStatus.Excellent,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2022-02-01",
    purchasePrice: 22000,
    value: 18000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "i19",
    propertyId: "p1",
    spaceId: "s20",
    name: "Tool Cabinet",
    brand: "Bosch",
    modelNumber: "ProBox",
    category: "Consumer Electronics",
    status: InventoryItemStatus.Fair,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2019-04-01",
    purchasePrice: 3800,
    value: 1500,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "i20",
    propertyId: "p1",
    spaceId: "s21",
    name: "Network Rack",
    brand: "Ubiquiti",
    modelNumber: "UniFi Rack",
    category: "Consumer Electronics",
    status: InventoryItemStatus.Excellent,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2023-01-01",
    purchasePrice: 12500,
    value: 11000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: ["Smart Home"],
    documentIds: [],
  },

  // extras
  {
    id: "i21",
    propertyId: "p1",
    spaceId: "s3",
    name: "Dining Table",
    brand: "Carl Hansen",
    modelNumber: "CH327",
    category: "Designer Furniture",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2021-03-01",
    purchasePrice: 42000,
    value: 32000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "i22",
    propertyId: "p1",
    spaceId: "s3",
    name: "Dining Chairs",
    brand: "Carl Hansen",
    modelNumber: "CH24",
    category: "Designer Furniture",
    status: InventoryItemStatus.Good,
    quantity: 6,
    unit: "pcs",
    purchaseDate: "2021-03-01",
    purchasePrice: 36000,
    value: 27000,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "i23",
    propertyId: "p1",
    spaceId: "s9",
    name: "Hallway Mirror",
    brand: "Gubi",
    modelNumber: "Adnet",
    category: "Designer Furniture",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2022-08-01",
    purchasePrice: 8900,
    value: 6400,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "i24",
    propertyId: "p1",
    spaceId: "s22",
    name: "Entrance Bench",
    brand: "Muuto",
    modelNumber: "Outline",
    category: "Designer Furniture",
    status: InventoryItemStatus.Good,
    quantity: 1,
    unit: "unit",
    purchaseDate: "2022-08-01",
    purchasePrice: 11200,
    value: 8500,
    createdAtUtc: new Date().toISOString(),
    notes: [],
    tags: [],
    documentIds: [],
  },
];

// --- SEED DATA: TASKS ---
const MOCK_TASKS: MaintenanceTask[] = [
  {
    id: "t1",
    propertyId: "p1",
    title: "Replace HVAC Filter",
    dueDateUtc: "2024-06-15T00:00:00Z",
    priority: MaintenanceTaskPriority.High,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Energy Efficient"],
    notes: [],
    documentIds: [],
    spaceIds: ["s21"],
  },
  {
    id: "t2",
    propertyId: "p1",
    title: "Inspect Balcony Drainage",
    dueDateUtc: "2024-07-01T00:00:00Z",
    priority: MaintenanceTaskPriority.Medium,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Outdoor"],
    notes: [],
    documentIds: [],
    spaceIds: ["s11", "s12"],
  },
  {
    id: "t3",
    propertyId: "p1",
    title: "Service Dishwasher",
    dueDateUtc: "2024-08-10T00:00:00Z",
    priority: MaintenanceTaskPriority.Low,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Warranty"],
    notes: [],
    documentIds: [],
    spaceIds: ["s1"],
  },

  {
    id: "t4",
    propertyId: "p1",
    title: "Test Smoke Detectors",
    dueDateUtc: "2024-06-01T00:00:00Z",
    priority: MaintenanceTaskPriority.High,
    status: MaintenanceTaskStatus.Completed,
    createdAtUtc: new Date().toISOString(),
    tags: ["Fire Safety"],
    notes: [],
    documentIds: [],
    spaceIds: ["s2", "s4", "s5"],
  },
  {
    id: "t5",
    propertyId: "p1",
    title: "Flush Water Heater",
    dueDateUtc: "2024-09-01T00:00:00Z",
    priority: MaintenanceTaskPriority.Medium,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Plumbing"],
    notes: [],
    documentIds: [],
    spaceIds: ["s21"],
  },
  {
    id: "t6",
    propertyId: "p1",
    title: "Update Network Firmware",
    dueDateUtc: "2024-06-20T00:00:00Z",
    priority: MaintenanceTaskPriority.Low,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Smart Home"],
    notes: [],
    documentIds: [],
    spaceIds: ["s21"],
  },

  {
    id: "t7",
    propertyId: "p1",
    title: "Reseal Bathroom Tiles",
    dueDateUtc: "2024-10-01T00:00:00Z",
    priority: MaintenanceTaskPriority.Medium,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Renovation"],
    notes: [],
    documentIds: [],
    spaceIds: ["s7"],
  },
  {
    id: "t8",
    propertyId: "p1",
    title: "Clean Ventilation Ducts",
    dueDateUtc: "2024-11-01T00:00:00Z",
    priority: MaintenanceTaskPriority.Low,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: [],
    notes: [],
    documentIds: [],
    spaceIds: ["s21"],
  },
  {
    id: "t9",
    propertyId: "p1",
    title: "Lubricate Door Hinges",
    dueDateUtc: "2024-06-05T00:00:00Z",
    priority: MaintenanceTaskPriority.Low,
    status: MaintenanceTaskStatus.Completed,
    createdAtUtc: new Date().toISOString(),
    tags: [],
    notes: [],
    documentIds: [],
    spaceIds: ["s22"],
  },

  {
    id: "t10",
    propertyId: "p1",
    title: "Inspect Electrical Panel",
    dueDateUtc: "2024-07-15T00:00:00Z",
    priority: MaintenanceTaskPriority.High,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Electrical"],
    notes: [],
    documentIds: [],
    spaceIds: ["s21"],
  },
  {
    id: "t11",
    propertyId: "p1",
    title: "Deep Clean Kitchen",
    dueDateUtc: "2024-06-30T00:00:00Z",
    priority: MaintenanceTaskPriority.Medium,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["RUT-avdrag"],
    notes: [],
    documentIds: [],
    spaceIds: ["s1"],
  },
  {
    id: "t12",
    propertyId: "p1",
    title: "Calibrate Thermostats",
    dueDateUtc: "2024-10-15T00:00:00Z",
    priority: MaintenanceTaskPriority.Low,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Heating"],
    notes: [],
    documentIds: [],
    spaceIds: ["s2", "s4"],
  },

  // additional
  {
    id: "t13",
    propertyId: "p1",
    title: "Inspect Roof Access",
    dueDateUtc: "2024-09-01T00:00:00Z",
    priority: MaintenanceTaskPriority.Medium,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: [],
    notes: [],
    documentIds: [],
    spaceIds: [],
  },
  {
    id: "t14",
    propertyId: "p1",
    title: "Replace Lightbulbs",
    dueDateUtc: "2024-06-18T00:00:00Z",
    priority: MaintenanceTaskPriority.Low,
    status: MaintenanceTaskStatus.Completed,
    createdAtUtc: new Date().toISOString(),
    tags: ["Lighting"],
    notes: [],
    documentIds: [],
    spaceIds: ["s2", "s9"],
  },
  {
    id: "t15",
    propertyId: "p1",
    title: "Clean Sauna Heater",
    dueDateUtc: "2024-07-05T00:00:00Z",
    priority: MaintenanceTaskPriority.Low,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: [],
    notes: [],
    documentIds: [],
    spaceIds: ["s18"],
  },

  {
    id: "t16",
    propertyId: "p1",
    title: "Inspect Window Seals",
    dueDateUtc: "2024-09-20T00:00:00Z",
    priority: MaintenanceTaskPriority.Medium,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Windows"],
    notes: [],
    documentIds: [],
    spaceIds: ["s2", "s4", "s5"],
  },
  {
    id: "t17",
    propertyId: "p1",
    title: "Service Wine Fridge",
    dueDateUtc: "2024-08-01T00:00:00Z",
    priority: MaintenanceTaskPriority.Low,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Warranty"],
    notes: [],
    documentIds: [],
    spaceIds: ["s15"],
  },
  {
    id: "t18",
    propertyId: "p1",
    title: "Check Water Pressure",
    dueDateUtc: "2024-06-22T00:00:00Z",
    priority: MaintenanceTaskPriority.Medium,
    status: MaintenanceTaskStatus.Completed,
    createdAtUtc: new Date().toISOString(),
    tags: ["Plumbing"],
    notes: [],
    documentIds: [],
    spaceIds: ["s7", "s8"],
  },

  {
    id: "t19",
    propertyId: "p1",
    title: "Inspect Balcony Tiles",
    dueDateUtc: "2024-10-01T00:00:00Z",
    priority: MaintenanceTaskPriority.Medium,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Outdoor"],
    notes: [],
    documentIds: [],
    spaceIds: ["s11"],
  },
  {
    id: "t20",
    propertyId: "p1",
    title: "Test Alarm System",
    dueDateUtc: "2024-06-10T00:00:00Z",
    priority: MaintenanceTaskPriority.High,
    status: MaintenanceTaskStatus.Completed,
    createdAtUtc: new Date().toISOString(),
    tags: ["Security"],
    notes: [],
    documentIds: [],
    spaceIds: [],
  },
  {
    id: "t21",
    propertyId: "p1",
    title: "Polish Wood Floors",
    dueDateUtc: "2024-11-01T00:00:00Z",
    priority: MaintenanceTaskPriority.Low,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Flooring"],
    notes: [],
    documentIds: [],
    spaceIds: ["s2", "s4"],
  },
  {
    id: "t22",
    propertyId: "p1",
    title: "Update Maintenance Log",
    dueDateUtc: "2024-06-25T00:00:00Z",
    priority: MaintenanceTaskPriority.Low,
    status: MaintenanceTaskStatus.Pending,
    createdAtUtc: new Date().toISOString(),
    tags: ["Maintenance Plan"],
    notes: [],
    documentIds: [],
    spaceIds: [],
  },
];

// --- SEED DATA: PROJECTS ---
const MOCK_PROJECTS: Project[] = [
  {
    id: "proj1",
    propertyId: "p1",
    title: "Solar Panel Installation",
    status: ProjectStatus.Active,
    startDate: "2024-05-01",
    budget: 185000,
    actualCost: 95000,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Energy Efficient"],
    documentIds: [],
    spaceIds: [],
  },
  {
    id: "proj2",
    propertyId: "p1",
    title: "Bathroom Renovation",
    status: ProjectStatus.Planned,
    startDate: "2024-09-01",
    budget: 240000,
    actualCost: 0,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Renovation", "ROT-avdrag"],
    documentIds: [],
    spaceIds: ["s7", "s8"],
  },
  {
    id: "proj3",
    propertyId: "p1",
    title: "Smart Lighting Upgrade",
    status: ProjectStatus.Completed,
    startDate: "2023-10-01",
    budget: 48000,
    actualCost: 46500,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Electrical"],
    documentIds: [],
    spaceIds: ["s2", "s4"],
  },

  {
    id: "proj4",
    propertyId: "p1",
    title: "Network Infrastructure Upgrade",
    status: ProjectStatus.Completed,
    startDate: "2023-03-01",
    budget: 32000,
    actualCost: 31000,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Smart Home"],
    documentIds: [],
    spaceIds: ["s21"],
  },
  {
    id: "proj5",
    propertyId: "p1",
    title: "Sauna Refurbishment",
    status: ProjectStatus.Active,
    startDate: "2024-04-01",
    budget: 68000,
    actualCost: 42000,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Heating"],
    documentIds: [],
    spaceIds: ["s18"],
  },

  {
    id: "proj6",
    propertyId: "p1",
    title: "Balcony Waterproofing",
    status: ProjectStatus.Planned,
    startDate: "2024-08-01",
    budget: 52000,
    actualCost: 0,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Outdoor"],
    documentIds: [],
    spaceIds: ["s11", "s12"],
  },
  {
    id: "proj7",
    propertyId: "p1",
    title: "Kitchen Cabinet Refinish",
    status: ProjectStatus.Completed,
    startDate: "2023-06-01",
    budget: 74000,
    actualCost: 71500,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Renovation"],
    documentIds: [],
    spaceIds: ["s1"],
  },

  {
    id: "proj8",
    propertyId: "p1",
    title: "Security System Expansion",
    status: ProjectStatus.Active,
    startDate: "2024-02-01",
    budget: 39000,
    actualCost: 28000,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Security"],
    documentIds: [],
    spaceIds: [],
  },
  {
    id: "proj9",
    propertyId: "p1",
    title: "Window Replacement",
    status: ProjectStatus.Planned,
    startDate: "2024-11-01",
    budget: 160000,
    actualCost: 0,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Windows"],
    documentIds: [],
    spaceIds: [],
  },

  {
    id: "proj10",
    propertyId: "p1",
    title: "Floor Restoration",
    status: ProjectStatus.Completed,
    startDate: "2022-04-01",
    budget: 88000,
    actualCost: 86500,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Flooring"],
    documentIds: [],
    spaceIds: ["s2", "s4"],
  },

  {
    id: "proj11",
    propertyId: "p1",
    title: "Wine Cellar Climate Control",
    status: ProjectStatus.Completed,
    startDate: "2022-09-01",
    budget: 42000,
    actualCost: 41000,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Cooling"],
    documentIds: [],
    spaceIds: ["s15"],
  },
  {
    id: "proj12",
    propertyId: "p1",
    title: "Home Office Buildout",
    status: ProjectStatus.Completed,
    startDate: "2021-02-01",
    budget: 56000,
    actualCost: 54500,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: [],
    documentIds: [],
    spaceIds: ["s6"],
  },

  {
    id: "proj13",
    propertyId: "p1",
    title: "Gym Equipment Upgrade",
    status: ProjectStatus.Active,
    startDate: "2024-01-01",
    budget: 95000,
    actualCost: 62000,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: [],
    documentIds: [],
    spaceIds: ["s17"],
  },
  {
    id: "proj14",
    propertyId: "p1",
    title: "Hallway Storage Optimization",
    status: ProjectStatus.Completed,
    startDate: "2023-05-01",
    budget: 24000,
    actualCost: 22500,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: [],
    documentIds: [],
    spaceIds: ["s9"],
  },

  {
    id: "proj15",
    propertyId: "p1",
    title: "Lighting Scene Programming",
    status: ProjectStatus.Completed,
    startDate: "2023-10-10",
    budget: 12000,
    actualCost: 11500,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Lighting"],
    documentIds: [],
    spaceIds: [],
  },

  {
    id: "proj16",
    propertyId: "p1",
    title: "Appliance Warranty Audit",
    status: ProjectStatus.Completed,
    startDate: "2024-03-01",
    budget: 0,
    actualCost: 0,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Warranty"],
    documentIds: [],
    spaceIds: [],
  },
  {
    id: "proj17",
    propertyId: "p1",
    title: "Entrance Redesign",
    status: ProjectStatus.Planned,
    startDate: "2024-12-01",
    budget: 68000,
    actualCost: 0,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: [],
    documentIds: [],
    spaceIds: ["s22"],
  },

  {
    id: "proj18",
    propertyId: "p1",
    title: "Fire Safety Compliance Review",
    status: ProjectStatus.Completed,
    startDate: "2023-01-01",
    budget: 18000,
    actualCost: 17500,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Fire Safety"],
    documentIds: [],
    spaceIds: [],
  },
  {
    id: "proj19",
    propertyId: "p1",
    title: "Technical Room Rewire",
    status: ProjectStatus.Completed,
    startDate: "2022-11-01",
    budget: 52000,
    actualCost: 51000,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Electrical"],
    documentIds: [],
    spaceIds: ["s21"],
  },
  {
    id: "proj20",
    propertyId: "p1",
    title: "Energy Consumption Audit",
    status: ProjectStatus.Completed,
    startDate: "2024-01-15",
    budget: 15000,
    actualCost: 15000,
    gallery: [],
    createdAtUtc: new Date().toISOString(),
    tasks: [],
    notes: [],
    tags: ["Energy Efficient"],
    documentIds: [],
    spaceIds: [],
  },
];

// --- SEED DATA: CONTACTS ---
const MOCK_CONTACTS: Contact[] = [
  {
    id: "c1",
    propertyId: "p1",
    firstName: "Anders",
    surname: "Svensson",
    company: "Vattenfall",
    category: "Vendor",
    email: "anders@vattenfall.se",
    phone: "+46 70 123 45 67",
    isEmergencyContact: true,
    specialties: ["Electricity"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c2",
    propertyId: "p1",
    firstName: "Karin",
    surname: "Lundberg",
    company: "Trygg-Hansa",
    category: "Vendor",
    email: "karin@th.se",
    phone: "+46 8 500 222 11",
    isEmergencyContact: false,
    specialties: ["Insurance"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c3",
    propertyId: "p1",
    firstName: "Johan",
    surname: "Eriksson",
    company: "Eriksson VVS",
    category: "Vendor",
    email: "johan@erikssonvvs.se",
    phone: "+46 70 555 12 34",
    isEmergencyContact: true,
    specialties: ["Plumbing"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c4",
    propertyId: "p1",
    firstName: "Maria",
    surname: "Holm",
    company: "Nordic Cleaning",
    category: "Vendor",
    email: "maria@nordicclean.se",
    phone: "+46 8 400 123 45",
    isEmergencyContact: false,
    specialties: ["Cleaning"],
    notes: [],
    tags: [],
    documentIds: [],
  },

  {
    id: "c5",
    propertyId: "p1",
    firstName: "Lars",
    surname: "Pettersson",
    company: "Pettersson Bygg",
    category: "Vendor",
    email: "lars@petterssonbygg.se",
    phone: "+46 70 222 11 00",
    isEmergencyContact: false,
    specialties: ["Construction"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c6",
    propertyId: "p1",
    firstName: "Eva",
    surname: "Nilsson",
    company: "Nilsson Glas",
    category: "Vendor",
    email: "eva@nilssonglas.se",
    phone: "+46 70 333 22 11",
    isEmergencyContact: false,
    specialties: ["Windows"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c7",
    propertyId: "p1",
    firstName: "Oskar",
    surname: "Berg",
    company: "Berg Lås",
    category: "Vendor",
    email: "oskar@berglas.se",
    phone: "+46 70 888 77 66",
    isEmergencyContact: true,
    specialties: ["Security"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c8",
    propertyId: "p1",
    firstName: "Helena",
    surname: "Karlsson",
    company: "Karlsson Design",
    category: "Consultant",
    email: "helena@karlssondesign.se",
    phone: "+46 70 111 22 33",
    isEmergencyContact: false,
    specialties: ["Interior Design"],
    notes: [],
    tags: [],
    documentIds: [],
  },

  {
    id: "c9",
    propertyId: "p1",
    firstName: "Per",
    surname: "Lind",
    company: "Lind Energi",
    category: "Vendor",
    email: "per@lindenergi.se",
    phone: "+46 70 999 00 11",
    isEmergencyContact: false,
    specialties: ["Energy"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c10",
    propertyId: "p1",
    firstName: "Anna",
    surname: "Forsberg",
    company: "Forsberg Ventilation",
    category: "Vendor",
    email: "anna@forsbergvent.se",
    phone: "+46 70 444 33 22",
    isEmergencyContact: false,
    specialties: ["Ventilation"],
    notes: [],
    tags: [],
    documentIds: [],
  },

  // personal / admin
  {
    id: "c11",
    propertyId: "p1",
    firstName: "Mats",
    surname: "Johansson",
    company: "HOA Board",
    category: "Other",
    email: "mats@hoa.se",
    phone: "+46 8 123 456",
    isEmergencyContact: false,
    specialties: [],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c12",
    propertyId: "p1",
    firstName: "Sofia",
    surname: "Ek",
    company: "Property Management AB",
    category: "Vendor",
    email: "sofia@pmab.se",
    phone: "+46 8 987 654",
    isEmergencyContact: false,
    specialties: ["Management"],
    notes: [],
    tags: [],
    documentIds: [],
  },

  // additional vendors
  {
    id: "c13",
    propertyId: "p1",
    firstName: "Daniel",
    surname: "Wallin",
    company: "Wallin El",
    category: "Vendor",
    email: "daniel@wallinel.se",
    phone: "+46 70 555 66 77",
    isEmergencyContact: false,
    specialties: ["Electrical"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c14",
    propertyId: "p1",
    firstName: "Ulrika",
    surname: "Sand",
    company: "Sand Måleri",
    category: "Vendor",
    email: "ulrika@sandmaleri.se",
    phone: "+46 70 333 44 55",
    isEmergencyContact: false,
    specialties: ["Painting"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c15",
    propertyId: "p1",
    firstName: "Niklas",
    surname: "Holmqvist",
    company: "Holmqvist Golv",
    category: "Vendor",
    email: "niklas@holmqvistgolv.se",
    phone: "+46 70 666 77 88",
    isEmergencyContact: false,
    specialties: ["Flooring"],
    notes: [],
    tags: [],
    documentIds: [],
  },

  {
    id: "c16",
    propertyId: "p1",
    firstName: "Camilla",
    surname: "Björk",
    company: "Björk Sten",
    category: "Vendor",
    email: "camilla@bjorksten.se",
    phone: "+46 70 111 99 88",
    isEmergencyContact: false,
    specialties: ["Stone"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c17",
    propertyId: "p1",
    firstName: "Henrik",
    surname: "Åström",
    company: "Åström Snickeri",
    category: "Vendor",
    email: "henrik@astromsnick.se",
    phone: "+46 70 222 88 99",
    isEmergencyContact: false,
    specialties: ["Carpentry"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c18",
    propertyId: "p1",
    firstName: "Linda",
    surname: "Rosén",
    company: "Rosén Arkitektur",
    category: "Consultant",
    email: "linda@rosenark.se",
    phone: "+46 70 999 88 77",
    isEmergencyContact: false,
    specialties: ["Architecture"],
    notes: [],
    tags: [],
    documentIds: [],
  },

  {
    id: "c19",
    propertyId: "p1",
    firstName: "Peter",
    surname: "Löfgren",
    company: "Löfgren Lås",
    category: "Vendor",
    email: "peter@lofgrenlas.se",
    phone: "+46 70 444 55 66",
    isEmergencyContact: true,
    specialties: ["Locks"],
    notes: [],
    tags: [],
    documentIds: [],
  },
  {
    id: "c20",
    propertyId: "p1",
    firstName: "Elin",
    surname: "Nyberg",
    company: "Nyberg Städ",
    category: "Vendor",
    email: "elin@nybergstad.se",
    phone: "+46 70 777 88 99",
    isEmergencyContact: false,
    specialties: ["Cleaning"],
    notes: [],
    tags: [],
    documentIds: [],
  },
];

// --- SEED DATA: INSURANCE ---
const MOCK_POLICIES: InsurancePolicy[] = [
  {
    id: "pol1",
    propertyId: "p1",
    providerId: "c2",
    title: "Primary Home Policy",
    policyNumber: "HOME-001",
    type: "Homeowners",
    premium: 450,
    deductible: 1500,
    coverageLimit: 12000000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },
  {
    id: "pol2",
    propertyId: "p1",
    providerId: "c2",
    title: "Valuables Coverage",
    policyNumber: "VAL-002",
    type: "Valuables",
    premium: 120,
    deductible: 500,
    coverageLimit: 500000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2024-11-20",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },

  {
    id: "pol3",
    propertyId: "p1",
    providerId: "c2",
    title: "Electronics Protection",
    policyNumber: "ELEC-003",
    type: "Electronics",
    premium: 90,
    deductible: 1000,
    coverageLimit: 300000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },
  {
    id: "pol4",
    propertyId: "p1",
    providerId: "c2",
    title: "Appliance Extended Warranty",
    policyNumber: "APP-004",
    type: "Appliance",
    premium: 60,
    deductible: 0,
    coverageLimit: 150000,
    startDate: "2023-06-01",
    endDate: "2026-06-01",
    renewalDate: "2026-06-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },

  {
    id: "pol5",
    propertyId: "p1",
    providerId: "c2",
    title: "Water Damage Insurance",
    policyNumber: "WAT-005",
    type: "Water Damage",
    premium: 75,
    deductible: 2000,
    coverageLimit: 1000000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },
  {
    id: "pol6",
    propertyId: "p1",
    providerId: "c2",
    title: "Fire Insurance",
    policyNumber: "FIRE-006",
    type: "Fire",
    premium: 110,
    deductible: 3000,
    coverageLimit: 5000000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },

  {
    id: "pol7",
    propertyId: "p1",
    providerId: "c2",
    title: "Theft Protection",
    policyNumber: "THF-007",
    type: "Theft",
    premium: 85,
    deductible: 1500,
    coverageLimit: 800000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },
  {
    id: "pol8",
    propertyId: "p1",
    providerId: "c2",
    title: "Art Insurance",
    policyNumber: "ART-008",
    type: "Art",
    premium: 95,
    deductible: 1000,
    coverageLimit: 400000,
    startDate: "2023-05-01",
    endDate: "2025-05-01",
    renewalDate: "2025-05-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },

  {
    id: "pol9",
    propertyId: "p1",
    providerId: "c2",
    title: "Furniture Insurance",
    policyNumber: "FURN-009",
    type: "Furniture",
    premium: 70,
    deductible: 1500,
    coverageLimit: 600000,
    startDate: "2023-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },
  {
    id: "pol10",
    propertyId: "p1",
    providerId: "c2",
    title: "Glass Coverage",
    policyNumber: "GLASS-010",
    type: "Glass",
    premium: 40,
    deductible: 500,
    coverageLimit: 250000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },

  {
    id: "pol11",
    propertyId: "p1",
    providerId: "c2",
    title: "Liability Insurance",
    policyNumber: "LIAB-011",
    type: "Liability",
    premium: 55,
    deductible: 0,
    coverageLimit: 10000000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },
  {
    id: "pol12",
    propertyId: "p1",
    providerId: "c2",
    title: "Legal Protection",
    policyNumber: "LEGAL-012",
    type: "Legal",
    premium: 35,
    deductible: 0,
    coverageLimit: 2000000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },

  {
    id: "pol13",
    propertyId: "p1",
    providerId: "c2",
    title: "Outdoor Property Insurance",
    policyNumber: "OUT-013",
    type: "Outdoor",
    premium: 45,
    deductible: 1000,
    coverageLimit: 300000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },
  {
    id: "pol14",
    propertyId: "p1",
    providerId: "c2",
    title: "Home Office Insurance",
    policyNumber: "OFF-014",
    type: "Office",
    premium: 50,
    deductible: 1000,
    coverageLimit: 350000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },

  {
    id: "pol15",
    propertyId: "p1",
    providerId: "c2",
    title: "Gym Equipment Insurance",
    policyNumber: "GYM-015",
    type: "Equipment",
    premium: 60,
    deductible: 2000,
    coverageLimit: 500000,
    startDate: "2023-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },
  {
    id: "pol16",
    propertyId: "p1",
    providerId: "c2",
    title: "Wine Collection Insurance",
    policyNumber: "WINE-016",
    type: "Valuables",
    premium: 85,
    deductible: 1000,
    coverageLimit: 750000,
    startDate: "2023-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },

  {
    id: "pol17",
    propertyId: "p1",
    providerId: "c2",
    title: "Temporary Renovation Cover",
    policyNumber: "REN-017",
    type: "Renovation",
    premium: 65,
    deductible: 3000,
    coverageLimit: 1000000,
    startDate: "2024-09-01",
    endDate: "2025-03-01",
    renewalDate: "2025-03-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },
  {
    id: "pol18",
    propertyId: "p1",
    providerId: "c2",
    title: "Flood Insurance",
    policyNumber: "FLD-018",
    type: "Flood",
    premium: 40,
    deductible: 5000,
    coverageLimit: 2000000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },

  {
    id: "pol19",
    propertyId: "p1",
    providerId: "c2",
    title: "Power Surge Protection",
    policyNumber: "SUR-019",
    type: "Electrical",
    premium: 25,
    deductible: 500,
    coverageLimit: 200000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2025-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },
  {
    id: "pol20",
    propertyId: "p1",
    providerId: "c2",
    title: "Extended Property Protection",
    policyNumber: "EXT-020",
    type: "Property",
    premium: 95,
    deductible: 2500,
    coverageLimit: 15000000,
    startDate: "2024-01-01",
    endDate: "2026-01-01",
    renewalDate: "2026-01-01",
    notes: [],
    documentIds: [],
    tags: [],
    claims: [],
  },
];

// --- SEED DATA: UTILITIES ---
const MOCK_UTILITIES: UtilityAccount[] = [
  {
    id: "ut1",
    propertyId: "p1",
    providerId: "c1",
    title: "Electricity Main",
    type: "Electricity",
    accountNumber: "EL-001",
    averageMonthlyCost: 1850,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-04-28",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
  {
    id: "ut2",
    propertyId: "p1",
    providerId: "c3",
    title: "Water & Sewage",
    type: "Water",
    accountNumber: "WAT-002",
    averageMonthlyCost: 640,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-02",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
  {
    id: "ut3",
    propertyId: "p1",
    providerId: "c9",
    title: "District Heating",
    type: "Heating",
    accountNumber: "HEAT-003",
    averageMonthlyCost: 2200,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-04-20",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
  {
    id: "ut4",
    propertyId: "p1",
    providerId: "c10",
    title: "Ventilation Service",
    type: "Ventilation",
    accountNumber: "VENT-004",
    averageMonthlyCost: 350,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-10",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },

  {
    id: "ut5",
    propertyId: "p1",
    providerId: "c7",
    title: "Alarm Monitoring",
    type: "Security",
    accountNumber: "SEC-005",
    averageMonthlyCost: 480,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-01",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
  {
    id: "ut6",
    propertyId: "p1",
    providerId: "c4",
    title: "Weekly Cleaning",
    type: "Cleaning",
    accountNumber: "CLN-006",
    averageMonthlyCost: 2200,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-06",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },

  {
    id: "ut7",
    propertyId: "p1",
    providerId: "c12",
    title: "Property Management Fee",
    type: "Management",
    accountNumber: "PM-007",
    averageMonthlyCost: 3500,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-01",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
  {
    id: "ut8",
    propertyId: "p1",
    providerId: "c11",
    title: "HOA Fee",
    type: "HOA",
    accountNumber: "HOA-008",
    averageMonthlyCost: 4800,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-01",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },

  {
    id: "ut9",
    propertyId: "p1",
    providerId: "c1",
    title: "Backup Electricity",
    type: "Electricity",
    accountNumber: "EL-009",
    averageMonthlyCost: 420,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-04-28",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
  {
    id: "ut10",
    propertyId: "p1",
    providerId: "c3",
    title: "Hot Water Subscription",
    type: "Water",
    accountNumber: "WAT-010",
    averageMonthlyCost: 520,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-02",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },

  {
    id: "ut11",
    propertyId: "p1",
    providerId: "c9",
    title: "Energy Audit Service",
    type: "Energy",
    accountNumber: "ENE-011",
    averageMonthlyCost: 180,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-04-15",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
  {
    id: "ut12",
    propertyId: "p1",
    providerId: "c10",
    title: "Air Filter Replacement Plan",
    type: "Ventilation",
    accountNumber: "VENT-012",
    averageMonthlyCost: 140,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-10",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },

  {
    id: "ut13",
    propertyId: "p1",
    providerId: "c7",
    title: "CCTV Cloud Storage",
    type: "Security",
    accountNumber: "SEC-013",
    averageMonthlyCost: 95,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-01",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
  {
    id: "ut14",
    propertyId: "p1",
    providerId: "c4",
    title: "Seasonal Deep Cleaning",
    type: "Cleaning",
    accountNumber: "CLN-014",
    averageMonthlyCost: 680,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-04-15",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },

  {
    id: "ut15",
    propertyId: "p1",
    providerId: "c1",
    title: "Electric Vehicle Charging",
    type: "Electricity",
    accountNumber: "EL-015",
    averageMonthlyCost: 320,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-04-28",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
  {
    id: "ut16",
    propertyId: "p1",
    providerId: "c9",
    title: "Solar Monitoring",
    type: "Energy",
    accountNumber: "ENE-016",
    averageMonthlyCost: 75,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-05",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },

  {
    id: "ut17",
    propertyId: "p1",
    providerId: "c12",
    title: "Admin Services",
    type: "Management",
    accountNumber: "PM-017",
    averageMonthlyCost: 420,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-01",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
  {
    id: "ut18",
    propertyId: "p1",
    providerId: "c11",
    title: "Special HOA Assessment",
    type: "HOA",
    accountNumber: "HOA-018",
    averageMonthlyCost: 950,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-01",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },

  {
    id: "ut19",
    propertyId: "p1",
    providerId: "c3",
    title: "Emergency Plumbing Coverage",
    type: "Water",
    accountNumber: "WAT-019",
    averageMonthlyCost: 110,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-02",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
  {
    id: "ut20",
    propertyId: "p1",
    providerId: "c7",
    title: "24/7 Alarm Response",
    type: "Security",
    accountNumber: "SEC-020",
    averageMonthlyCost: 260,
    useCalculatedAverage: false,
    lastPaymentDate: "2024-05-01",
    notes: [],
    tags: [],
    documentIds: [],
    invoices: [],
  },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("overview");
  const [lastView, setLastView] = useState<View | null>(null);
  const [households, setHouseholds] = useState<Household[]>(() => {
    const nowIso = new Date().toISOString();
    return MOCK_HOUSEHOLDS.map((h, index) => ({
      ...h,
      createdAtUtc:
        h.createdAtUtc ||
        new Date(Date.now() - (index + 1) * 86400000).toISOString(),
      updatedAtUtc: h.updatedAtUtc || nowIso,
    }));
  });
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [activeHouseholdId, setActiveHouseholdId] = useState<string | null>(
    MOCK_HOUSEHOLDS[0]?.id ?? null
  );
  const [activePropertyId, setActivePropertyId] = useState<string | null>(
    MOCK_PROPERTIES[0]?.id ?? null
  );
  const [spaces, setSpaces] = useState<Space[]>(MOCK_SPACES);
  const [tasks, setTasks] = useState<MaintenanceTask[]>(() => {
    const nowIso = new Date().toISOString();
    return MOCK_TASKS.map((t, index) => ({
      ...t,
      createdAtUtc:
        t.createdAtUtc ||
        new Date(Date.now() - (index + 1) * 86400000).toISOString(),
      updatedAtUtc: t.updatedAtUtc || nowIso,
    }));
  });
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tags, setTags] = useState<Tag[]>(() => {
    const nowIso = new Date().toISOString();
    return MOCK_TAGS.map((tag, index) => {
      const createdAtUtc =
        tag.createdAtUtc || new Date(Date.now() - (index + 1) * 86400000).toISOString();
      return {
        ...tag,
        createdAtUtc,
        updatedAtUtc: tag.updatedAtUtc || nowIso,
      };
    });
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const nowIso = new Date().toISOString();
    return MOCK_CONTACTS.map((c, index) => ({
      ...c,
      createdAtUtc:
        c.createdAtUtc ||
        new Date(Date.now() - (index + 1) * 86400000).toISOString(),
      updatedAtUtc: c.updatedAtUtc || nowIso,
    }));
  });
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [inventoryCategories, setInventoryCategories] = useState<
    InventoryCategory[]
  >(() => {
    const nowIso = new Date().toISOString();
    return MOCK_CATEGORIES.map((c, index) => ({
      ...c,
      canHaveChildren: c.canHaveChildren ?? true,
      createdAtUtc:
        c.createdAtUtc ||
        new Date(Date.now() - (index + 1) * 86400000).toISOString(),
      updatedAtUtc: c.updatedAtUtc || nowIso,
    }));
  });
  const [insurance, setInsurance] = useState<InsurancePolicy[]>(() => {
    const nowIso = new Date().toISOString();
    return MOCK_POLICIES.map((p, index) => ({
      ...p,
      createdAtUtc:
        p.createdAtUtc ||
        new Date(Date.now() - (index + 1) * 86400000).toISOString(),
      updatedAtUtc: p.updatedAtUtc || nowIso,
    }));
  });
  const [utilities, setUtilities] = useState<UtilityAccount[]>(() => {
    const nowIso = new Date().toISOString();
    return MOCK_UTILITIES.map((u, index) => ({
      ...u,
      createdAtUtc:
        u.createdAtUtc ||
        new Date(Date.now() - (index + 1) * 86400000).toISOString(),
      updatedAtUtc: u.updatedAtUtc || nowIso,
    }));
  });
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<{
    type: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    if (!activeHouseholdId) {
      setActiveHouseholdId(households[0]?.id ?? null);
      return;
    }
    if (!households.some((h) => h.id === activeHouseholdId)) {
      setActiveHouseholdId(households[0]?.id ?? null);
    }
  }, [households, activeHouseholdId]);

  useEffect(() => {
    if (!activePropertyId) return;
    if (!properties.some((p) => p.id === activePropertyId)) {
      setActivePropertyId(properties[0]?.id ?? null);
    }
  }, [properties, activePropertyId]);

  const scopedSpaces = useMemo(
    () =>
      activePropertyId
        ? spaces.filter((s) => s.propertyId === activePropertyId)
        : spaces,
    [spaces, activePropertyId]
  );
  const scopedTasks = useMemo(
    () =>
      activePropertyId
        ? tasks.filter((t) => t.propertyId === activePropertyId)
        : tasks,
    [tasks, activePropertyId]
  );
  const scopedProjects = useMemo(
    () =>
      activePropertyId
        ? projects.filter((p) => p.propertyId === activePropertyId)
        : projects,
    [projects, activePropertyId]
  );
  const scopedInventory = useMemo(
    () =>
      activePropertyId
        ? inventory.filter((i) => i.propertyId === activePropertyId)
        : inventory,
    [inventory, activePropertyId]
  );
  const scopedContacts = useMemo(
    () =>
      activePropertyId
        ? contacts.filter((c) => c.propertyId === activePropertyId)
        : contacts,
    [contacts, activePropertyId]
  );
  const scopedDocuments = useMemo(
    () =>
      activePropertyId
        ? documents.filter((d) => d.propertyId === activePropertyId)
        : documents,
    [documents, activePropertyId]
  );
  const scopedInsurance = useMemo(
    () =>
      activePropertyId
        ? insurance.filter((p) => p.propertyId === activePropertyId)
        : insurance,
    [insurance, activePropertyId]
  );
  const scopedUtilities = useMemo(
    () =>
      activePropertyId
        ? utilities.filter((u) => u.propertyId === activePropertyId)
        : utilities,
    [utilities, activePropertyId]
  );

  const tagUsageByName = useMemo(() => {
    const counts: Record<string, number> = {};
    const add = (tagNames?: string[]) => {
      (tagNames || []).forEach((name) => {
        counts[name] = (counts[name] || 0) + 1;
      });
    };

    properties.forEach((p) => add(p.tags));
    spaces.forEach((s) => add(s.tags));
    tasks.forEach((t) => add(t.tags));
    projects.forEach((p) => add(p.tags));
    inventory.forEach((i) => add(i.tags));
    inventoryCategories.forEach((c) => add(c.tags));
    contacts.forEach((c) => add(c.tags));
    documents.forEach((d) => add(d.tags));
    households.forEach((h) => add(h.tags));
    insurance.forEach((p) => add(p.tags));
    utilities.forEach((u) => add(u.tags));

    return counts;
  }, [
    properties,
    spaces,
    tasks,
    projects,
    inventory,
    inventoryCategories,
    contacts,
    documents,
    households,
    insurance,
    utilities,
  ]);

  // COMPUTED FINANCE DATA
  const financeOverviewData = useMemo(() => {
    const insuranceLoad = insurance.reduce((acc, p) => acc + p.premium, 0);
    const utilityBurn = utilities.reduce(
      (acc, u) => acc + u.averageMonthlyCost,
      0
    );

    const upcomingDeadlines: any[] = [
      ...insurance.map((p) => ({
        id: p.id,
        label: p.title,
        type: "renewal",
        date: p.renewalDate,
        amount: p.premium,
      })),
      ...utilities.flatMap((u) =>
        (u.invoices || [])
          .filter((inv) => new Date(inv.dueDateUtc) > new Date())
          .map((inv) => ({
            id: inv.id,
            label: u.title,
            type: "payment",
            date: inv.dueDateUtc,
            amount: inv.amount,
          }))
      ),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const enrichedDeadlines = upcomingDeadlines
      .map((d) => {
        const diff = new Date(d.date).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        let urgency: "critical" | "soon" | "normal" = "normal";
        if (days < 7) urgency = "critical";
        else if (days < 14) urgency = "soon";
        return { ...d, urgency };
      })
      .slice(0, 5); // LIMIT TO 5 AS REQUESTED

    return {
      totalMonthlyCommitment: insuranceLoad + utilityBurn,
      insuranceLoad,
      utilityBurn,
      upcomingDeadlines: enrichedDeadlines,
    };
  }, [insurance, utilities]);

  const stats = {
    households: households.length,
    properties: properties.length,
    spaces: spaces.length,
    maintenance: tasks.length,
    projects: projects.length,
    insurance: insurance.length,
    utilities: utilities.length,
    documents: documents.length,
    contacts: contacts.length,
    inventory: inventory.length,
    inventory_categories: inventoryCategories.length,
    tags: tags.length,
  };

  const navigateTo = (view: View) => {
    setLastView(currentView);
    setCurrentView(view);
    if (view !== "entity_detail") setSelectedEntity(null);
  };

  const handleUpdateEntity = (type: string, id: string, data: any) => {
    const updater = (list: any[]) =>
      list.map((item) => (item.id === id ? { ...item, ...data } : item));
    switch (type) {
      case "household":
        setHouseholds(updater);
        break;
      case "property":
        setProperties(updater);
        break;
      case "space":
        setSpaces(updater);
        break;
      case "task":
        setTasks(updater);
        break;
      case "project":
        setProjects(updater);
        break;
      case "inventory":
        setInventory(updater);
        break;
      case "contact":
        setContacts(updater);
        break;
      case "document":
        setDocuments(updater);
        break;
      case "inventory_category":
        setInventoryCategories(updater);
        break;
      case "tag":
        setTags(updater);
        break;
      case "insurance":
        setInsurance(updater);
        break;
      case "utility":
        setUtilities(updater);
        break;
    }
  };

  const handleQuickAddContact = async (
    data: Partial<Contact>
  ): Promise<string> => {
    const nowIso = new Date().toISOString();
    const newContact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId: "p1",
      firstName: data.firstName || "New",
      surname: data.surname || "Contact",
      company: data.company,
      category: data.category || "Other",
      specialties: data.specialties || [],
      isEmergencyContact: false,
      rating: 5,
      notes: [],
      tags: [],
      documentIds: [],
      createdAtUtc: nowIso,
      updatedAtUtc: nowIso,
    };
    setContacts((prev) => [newContact, ...prev]);
    return newContact.id;
  };

  const ensureTagExists = (tagName: string) => {
    const trimmed = tagName.trim();
    if (!trimmed) return null;

    const existing = tags.find(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) return existing.name;

    const nowIso = new Date().toISOString();
    const propertyId = activePropertyId || "p1";
    const newTag: Tag = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId,
      name: trimmed,
      description: "",
      iconName: "Tag",
      colorHex: "#1e293b",
      usageCount: 0,
      notes: [],
      documentIds: [],
      createdAtUtc: nowIso,
      updatedAtUtc: nowIso,
    };

    setTags((prev) => [newTag, ...prev]);
    return newTag.name;
  };

  const handleAddTagToSelectedEntity = (tagName: string) => {
    if (!selectedEntity) return;

    const canonicalTagName = ensureTagExists(tagName);
    if (!canonicalTagName) return;

    const entityObj = findEntity();
    const currentTags: string[] = entityObj?.tags || [];
    if (
      currentTags.some(
        (t) => t.toLowerCase() === canonicalTagName.toLowerCase()
      )
    ) {
      return;
    }

    const nowIso = new Date().toISOString();
    handleUpdateEntity(selectedEntity.type, selectedEntity.id, {
      tags: [...currentTags, canonicalTagName],
      updatedAtUtc: nowIso,
    });
  };

  const handleRemoveTagFromSelectedEntity = (tagName: string) => {
    if (!selectedEntity) return;

    const entityObj = findEntity();
    const currentTags: string[] = entityObj?.tags || [];
    if (currentTags.length === 0) return;

    const nowIso = new Date().toISOString();
    handleUpdateEntity(selectedEntity.type, selectedEntity.id, {
      tags: currentTags.filter((t) => t.toLowerCase() !== tagName.toLowerCase()),
      updatedAtUtc: nowIso,
    });
  };

  const findEntity = () => {
    if (!selectedEntity) return null;
    const { type, id } = selectedEntity;
    switch (type) {
      case "property":
        return properties.find((p) => p.id === id);
      case "household":
        return households.find((h) => h.id === id);
      case "space":
        return spaces.find((s) => s.id === id);
      case "task":
        return tasks.find((t) => t.id === id);
      case "project":
        return projects.find((p) => p.id === id);
      case "document":
        return documents.find((d) => d.id === id);
      case "contact":
        return contacts.find((c) => c.id === id);
      case "inventory":
        return inventory.find((i) => i.id === id);
      case "inventory_category":
        return inventoryCategories.find((c) => c.id === id);
      case "insurance":
        return insurance.find((p) => p.id === id);
      case "utility":
        return utilities.find((u) => u.id === id);
      case "tag":
        return tags.find((t) => t.id === id);
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden blueprint-grid bg-[#fcfcf9]">
      <Sidebar
        currentView={currentView}
        setCurrentView={navigateTo}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setCurrentView={navigateTo}
          households={households}
          properties={properties}
          activeHouseholdId={activeHouseholdId}
          activePropertyId={activePropertyId}
          onSelectHousehold={setActiveHouseholdId}
          onSelectProperty={setActivePropertyId}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {currentView === "overview" && (
              <Dashboard households={households} onNavigate={navigateTo} />
            )}
            {["workspace", "planner", "finance", "library"].includes(
              currentView
            ) && (
              <GroupDashboard
                title={currentView}
                type={currentView as any}
                onNavigate={navigateTo}
                stats={stats}
                financeData={
                  currentView === "finance" ? financeOverviewData : undefined
                }
              />
            )}

            {/* WORKSPACE VIEWS */}
            {currentView === "households" && (
              <HouseholdsList
                households={households}
                availableTags={tags}
                onRefresh={() => {}}
                onView={(id) => {
                  setSelectedEntity({ type: "household", id });
                  navigateTo("entity_detail");
                }}
                onDelete={(id) =>
                  setHouseholds((h) => h.filter((x) => x.id !== id))
                }
              />
            )}
            {currentView === "properties" && (
              <PropertiesList
                properties={properties}
                availableTags={tags}
                onRefresh={() => {}}
                onView={(id) => {
                  setSelectedEntity({ type: "property", id });
                  navigateTo("entity_detail");
                }}
                onDelete={(id) =>
                  setProperties((p) => p.filter((x) => x.id !== id))
                }
              />
            )}
            {currentView === "spaces" && (
              <SpacesList
                spaces={scopedSpaces}
                availableTags={tags}
                availableDocuments={scopedDocuments}
                onRefresh={() => {}}
                onView={(id) => {
                  setSelectedEntity({ type: "space", id });
                  navigateTo("entity_detail");
                }}
                onDelete={(id) =>
                  setSpaces((s) => s.filter((x) => x.id !== id))
                }
              />
            )}

            {/* PLANNER VIEWS */}
            {currentView === "maintenance" && (
              <MaintenanceList
                tasks={scopedTasks}
                spaces={scopedSpaces}
                availableTags={tags}
                availableInventory={scopedInventory}
                availableContacts={scopedContacts}
                onRefresh={() => {}}
                onView={(id) => {
                  setSelectedEntity({ type: "task", id });
                  navigateTo("entity_detail");
                }}
                onDelete={(id) => setTasks((t) => t.filter((x) => x.id !== id))}
              />
            )}
            {currentView === "projects" && (
              <ProjectsList
                projects={scopedProjects}
                availableTags={tags}
                availableSpaces={scopedSpaces}
                availableContacts={scopedContacts}
                onRefresh={() => {}}
                onView={(id) => {
                  setSelectedEntity({ type: "project", id });
                  navigateTo("entity_detail");
                }}
                onDelete={(id) =>
                  setProjects((p) => p.filter((x) => x.id !== id))
                }
              />
            )}

            {/* FINANCE VIEWS */}
            {currentView === "insurance" && (
              <InsuranceList
                policies={scopedInsurance}
                contacts={scopedContacts}
                onView={(id) => {
                  setSelectedEntity({ type: "insurance", id });
                  navigateTo("entity_detail");
                }}
                onDelete={(id) =>
                  setInsurance((i) => i.filter((x) => x.id !== id))
                }
                onEdit={() => {}}
                onSave={(data) =>
                  handleUpdateEntity("insurance", data.id!, data)
                }
                onQuickAddContact={handleQuickAddContact}
              />
            )}
            {currentView === "utilities" && (
              <UtilityList
                accounts={scopedUtilities}
                contacts={scopedContacts}
                onView={(id) => {
                  setSelectedEntity({ type: "utility", id });
                  navigateTo("entity_detail");
                }}
                onDelete={(id) =>
                  setUtilities((prev) => prev.filter((x) => x.id !== id))
                }
                onQuickAddContact={handleQuickAddContact}
                onSave={(data) => handleUpdateEntity("utility", data.id!, data)}
                availableSpaces={scopedSpaces}
              />
            )}

            {/* LIBRARY VIEWS */}
            {currentView === "documents" && (
              <DocumentsList
                documents={scopedDocuments}
                spaces={scopedSpaces}
                inventory={scopedInventory}
                projects={scopedProjects}
                tasks={scopedTasks}
                contacts={scopedContacts}
                availableTags={tags}
                onRefresh={() => {}}
                onView={(id) => {
                  setSelectedEntity({ type: "document", id });
                  navigateTo("entity_detail");
                }}
                onDelete={(id) =>
                  setDocuments((d) => d.filter((x) => x.id !== id))
                }
              />
            )}
            {currentView === "contacts" && (
              <ContactsList
                contacts={scopedContacts}
                tags={tags}
                onRefresh={() => {}}
                onView={(id) => {
                  setSelectedEntity({ type: "contact", id });
                  navigateTo("entity_detail");
                }}
                onDelete={(id) =>
                  setContacts((c) => c.filter((x) => x.id !== id))
                }
              />
            )}
            {currentView === "inventory" && (
              <InventoryList
                items={scopedInventory}
                spaces={scopedSpaces}
                categories={inventoryCategories}
                availableTags={tags}
                onRefresh={() => {}}
                onView={(id) => {
                  setSelectedEntity({ type: "inventory", id });
                  navigateTo("entity_detail");
                }}
              />
            )}
            {currentView === "inventory_categories" && (
              <InventoryCategoriesList
                categories={inventoryCategories}
                onRefresh={() => {}}
                onView={(id) => {
                  setSelectedEntity({ type: "inventory_category", id });
                  navigateTo("entity_detail");
                }}
              />
            )}
            {currentView === "tags" && (
              <TagsList
                tags={tags}
                usageByName={tagUsageByName}
                onRefresh={() => {}}
                onView={(id) => {
                  setSelectedEntity({ type: "tag", id });
                  navigateTo("entity_detail");
                }}
              />
            )}

            {/* SYSTEM VIEWS */}
            {currentView === "profile" && <ProfilePage />}
            {currentView === "activity_log" && (
              <ActivityLog activities={activities} />
            )}
            {currentView === "notifications_archive" && (
              <NotificationsArchive />
            )}

            {currentView === "entity_detail" && (
              <EntityDetail
                type={selectedEntity?.type || ""}
                entity={findEntity()}
                allTags={tags}
                allDocuments={documents}
                allSpaces={spaces}
                allContacts={contacts}
                allProjects={projects}
                allTasks={tasks}
                allInventory={inventory}
                allCategories={inventoryCategories}
                allProperties={properties}
                allHouseholds={households}
                allInsurance={insurance}
                allUtilities={utilities}
                onBack={() => navigateTo(lastView || "overview")}
                onEdit={() => {}}
                onDelete={() => {
                  if (!selectedEntity) return;
                  switch (selectedEntity.type) {
                    case "inventory":
                      setInventory((prev) =>
                        prev.filter((item) => item.id !== selectedEntity.id)
                      );
                      navigateTo(lastView || "inventory");
                      break;
                    case "inventory_category":
                      setInventoryCategories((prev) =>
                        prev.filter((item) => item.id !== selectedEntity.id)
                      );
                      navigateTo(lastView || "inventory_categories");
                      break;
                    case "tag":
                      setTags((prev) =>
                        prev.filter((item) => item.id !== selectedEntity.id)
                      );
                      navigateTo(lastView || "tags");
                      break;
                    default:
                      return;
                  }
                }}
                onAddNote={(text) => {}}
                onAddTag={handleAddTagToSelectedEntity}
                onRemoveTag={handleRemoveTagFromSelectedEntity}
                onAddAttachment={() => {}}
                onUpdateEntity={handleUpdateEntity}
                onQuickAddContact={handleQuickAddContact}
                onNavigateToEntity={(type, id) => {
                  setSelectedEntity({ type, id });
                  navigateTo("entity_detail");
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
