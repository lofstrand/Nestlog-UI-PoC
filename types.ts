
export interface Address {
  line1: string;
  line2?: string | null;
  city: string;
  stateOrRegion?: string | null;
  postalCode: string;
  countryCode: string;
}

export interface Note {
  id: string;
  text: string;
  createdAtUtc: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  createdAtUtc: string;
}

export interface Property {
  id: string;
  name: string;
  isArchived: boolean;
  isPrimaryResidence: boolean;
  address: Address;
  constructionYear?: number | null;
  constructionMonth?: number | null;
  floorArea?: number | null;
  propertyType?: string | null;
  occupancyStatus: 'OwnerOccupied' | 'TenantOccupied' | 'Vacant' | 'ShortTermRental';
  energyRating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null;
  heatingSystemType?: string | null;
  roofType?: string | null;
  foundationType?: string | null;
  imageUrls?: string[];
  gallery: GalleryItem[];
  createdAtUtc: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

export interface Household {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  description: string;
  propertyCount: number;
  lastMaintained: string;
  currencyCode?: string;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

export type PropertyRole = 'Owner' | 'Manager' | 'Viewer' | 'Contractor';

export interface PropertyPermission {
  propertyId: string;
  role: PropertyRole;
}

export interface HouseholdMember {
  id: string;
  householdId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedAtUtc: string;
  permissions: PropertyPermission[];
}

export interface HouseholdInvite {
  id: string;
  householdId: string;
  email: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Expired';
  invitedBy: string;
  createdAtUtc: string;
}

export enum SpaceType {
  Unknown = 'Unknown',
  Bedroom = 'Bedroom',
  Bathroom = 'Bathroom',
  Kitchen = 'Kitchen',
  LivingRoom = 'LivingRoom',
  DiningRoom = 'DiningRoom',
  Office = 'Office',
  Laundry = 'Laundry',
  Garage = 'Garage',
  Basement = 'Basement',
  Attic = 'Attic',
  Outdoor = 'Outdoor',
  Other = 'Other'
}

export enum SpaceSurfaceType {
  Unknown = 'Unknown',
  Floor = 'Floor',
  Wall = 'Wall',
  Ceiling = 'Ceiling',
  Countertop = 'Countertop',
  Backsplash = 'Backsplash',
  Cabinetry = 'Cabinetry',
  Trim = 'Trim',
  Door = 'Door',
  Window = 'Window',
  Other = 'Other'
}

export enum SpaceSurfaceMaterialType {
  Unknown = 'Unknown',
  Paint = 'Paint',
  Wallpaper = 'Wallpaper',
  Tile = 'Tile',
  Hardwood = 'Hardwood',
  Carpet = 'Carpet',
  Vinyl = 'Vinyl',
  Laminate = 'Laminate',
  Stone = 'Stone',
  Metal = 'Metal',
  Wood = 'Wood',
  Glass = 'Glass',
  Plaster = 'Plaster',
  Drywall = 'Drywall',
  Other = 'Other'
}

export enum SurfaceCondition {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
  RequiresReplacement = 'Requires Replacement'
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
  areaUnit?: 'm2' | 'ft2';
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
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: 'ft' | 'm';
  } | null;
  surfaces: SpaceSurface[];
  gallery: GalleryItem[];
  imageUrls?: string[];
  createdAtUtc: string;
  updatedAtUtc: string;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

export enum MaintenanceTaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent'
}

export enum MaintenanceTaskStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum MaintenanceRecurrenceFrequency {
  None = 'None',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Yearly = 'Yearly'
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

export enum ProjectStatus {
  Planned = 'Planned',
  Active = 'Active',
  Completed = 'Completed',
  OnHold = 'OnHold',
  Cancelled = 'Cancelled'
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

export interface InventoryCategory {
  id: string;
  propertyId: string;
  parentId?: string | null;
  name: string;
  iconName?: string | null;
  colorHex?: string | null;
  estimatedDepreciationRate?: number | null;
  isInsuranceCritical: boolean;
  sortOrder: number;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

export enum InventoryItemStatus {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
  Broken = 'Broken'
}

export interface InventoryItem {
  id: string;
  propertyId: string;
  spaceId?: string | null;
  name: string;
  brand?: string | null;
  modelNumber?: string | null;
  serialNumber?: string | null;
  category: string;
  status: InventoryItemStatus;
  quantity: number;
  unit: string;
  store?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  value?: number | null;
  powerWattage?: number | null;
  energyClass?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null;
  lastAuditDateUtc?: string | null;
  manufacturerUrl?: string | null;
  imageUrl?: string | null;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

export type ContactCategory = 'ServiceProvider' | 'Agency' | 'InsuranceCarrier' | 'Contractor' | 'Vendor' | 'Tenant' | 'Owner' | 'Family' | 'Neighbor' | 'Other';

export interface Contact {
  id: string;
  propertyId: string;
  firstName: string;
  surname: string;
  company?: string | null;
  jobTitle?: string | null;
  category?: ContactCategory;
  email?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  isEmergencyContact: boolean;
  rating?: number | null;
  hourlyRate?: number | null;
  currency?: string | null;
  specialties: string[];
  certificationId?: string | null;
  businessAddress?: Address | null;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
}

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

export type InsurancePolicyType = 'Homeowners' | 'Flood' | 'Hazard' | 'Liability' | 'Auto' | 'Umbrella' | 'Jewelry/Valuables' | 'Pet' | 'Travel' | 'Art' | 'Cyber' | 'Life' | 'Health' | 'Other';

export type ClaimCommunicationMode = 'Email' | 'Phone' | 'Portal' | 'In-Person' | 'Mail' | 'Text';

export interface ClaimActivity {
  id: string;
  type: 'Log' | 'StatusChange' | 'Communication' | 'Payout' | 'Attachment';
  content: string;
  communicationMode?: ClaimCommunicationMode;
  timestamp: string; // System-generated time
  eventDateUtc?: string; // Optional user-provided historical time
  userName: string;
}

export interface InsuranceClaim {
  id: string;
  title: string;
  description: string;
  incidentDateUtc: string;
  status: 'Draft' | 'Filed' | 'InReview' | 'AdjusterAssigned' | 'Settled' | 'Denied' | 'Closed';
  payoutAmount?: number;
  payoutDestination?: string; // e.g. "Main Savings", "Escrow", "Vendor Direct"
  settlementDateUtc?: string;
  contactPerson?: string;
  companyClaimId?: string;
  communicationMode?: ClaimCommunicationMode;
  conversationLog: ClaimActivity[]; 
  documentIds: string[];
  spaceIds?: string[]; // New: Linked rooms affected
  inventoryItemIds?: string[]; // New: Linked assets damaged/stolen
}

export interface InsurancePolicy {
  id: string;
  propertyId: string;
  providerId: string;
  title: string;
  policyNumber: string;
  type: InsurancePolicyType;
  premium: number;
  metric?: string;
  deductible: number;
  coverageLimit: number;
  startDate: string;
  endDate: string;
  renewalDate: string;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  documentIds: string[];
  tags: string[];
  claims?: InsuranceClaim[];
}

export interface UtilityInvoice {
  id: string;
  amount: number;
  dueDateUtc: string;
  documentId?: string;
  note?: string;
}

export interface UtilityAccount {
  id: string;
  propertyId: string;
  providerId: string;
  title: string;
  type: 'Electricity' | 'Water' | 'Gas' | 'Heating' | 'Cooling' | 'Trash/Recycling' | 'Waste' | 'Internet' | 'Mobile' | 'Phone' | 'Security' | 'Solar' | 'Cable TV' | 'Other';
  accountNumber: string;
  averageMonthlyCost: number;
  useCalculatedAverage: boolean;
  lastPaymentDate?: string | null;
  spaceId?: string | null;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  notes: Note[];
  tags: string[];
  documentIds: string[];
  invoices: UtilityInvoice[];
}

export interface ActivityLogEntry {
  id: string;
  entityType: 'household' | 'property' | 'space' | 'task' | 'project' | 'inventory' | 'document' | 'contact' | 'insurance' | 'utility' | 'system';
  entityId: string;
  action: 'created' | 'updated' | 'deleted' | 'completed' | 'archived' | 'payment_logged' | 'note_added';
  timestamp: string;
  userName: string;
  details: string;
}

export type View = 'overview' | 'workspace' | 'planner' | 'finance' | 'library' | 'households' | 'properties' | 'spaces' | 'maintenance' | 'projects' | 'insurance' | 'utilities' | 'tags' | 'documents' | 'contacts' | 'inventory' | 'inventory_categories' | 'entity_detail' | 'profile' | 'notifications_archive' | 'activity_log';
