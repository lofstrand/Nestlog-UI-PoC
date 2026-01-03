import type { GalleryItem, Note } from "./common";

export enum SpaceType {
  Unknown = "Unknown",
  Bedroom = "Bedroom",
  Bathroom = "Bathroom",
  Kitchen = "Kitchen",
  LivingRoom = "LivingRoom",
  DiningRoom = "DiningRoom",
  Office = "Office",
  Laundry = "Laundry",
  Garage = "Garage",
  Basement = "Basement",
  Attic = "Attic",
  Outdoor = "Outdoor",
  Other = "Other",
}

export enum SpaceSurfaceType {
  Unknown = "Unknown",
  Floor = "Floor",
  Wall = "Wall",
  Ceiling = "Ceiling",
  Countertop = "Countertop",
  Backsplash = "Backsplash",
  Cabinetry = "Cabinetry",
  Trim = "Trim",
  Door = "Door",
  Window = "Window",
  Other = "Other",
}

export enum SpaceSurfaceMaterialType {
  Unknown = "Unknown",
  Paint = "Paint",
  Wallpaper = "Wallpaper",
  Tile = "Tile",
  Hardwood = "Hardwood",
  Carpet = "Carpet",
  Vinyl = "Vinyl",
  Laminate = "Laminate",
  Stone = "Stone",
  Metal = "Metal",
  Wood = "Wood",
  Glass = "Glass",
  Plaster = "Plaster",
  Drywall = "Drywall",
  Other = "Other",
}

export enum SurfaceCondition {
  Excellent = "Excellent",
  Good = "Good",
  Fair = "Fair",
  Poor = "Poor",
  RequiresReplacement = "Requires Replacement",
}

export interface SpaceSurface {
  id: string;
  spaceId: string;
  surfaceType: SpaceSurfaceType;
  materialType: SpaceSurfaceMaterialType;
  brand?: string | null;
  productLine?: string | null;
  colorName?: string | null;
  colorCode?: string | null;
  finish?: string | null;
  modelNumber?: string | null;
  area?: number | null;
  areaUnit?: "m2" | "ft2";
  condition: SurfaceCondition;
  installedDateUtc?: string | null;
  lastMaintainedDateUtc?: string | null;
  estimatedLifespanYears?: number | null;
  qrCodeIdentifier?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
  isArchived: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface Space {
  id: string;
  propertyId: string;
  name: string;
  spaceType: SpaceType;
  level?: number | null;
  isOutdoor: boolean;
  sortOrder: number;
  isArchived: boolean;
  dimensions?:
    | {
        length?: number;
        width?: number;
        height?: number;
        unit: "ft" | "m";
      }
    | null;
  surfaces: SpaceSurface[];
  gallery: GalleryItem[];
  imageUrls?: string[];
  createdAtUtc: string;
  updatedAtUtc: string;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

