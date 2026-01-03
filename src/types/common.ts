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
  authorName?: string;
  authorAvatarUrl?: string;
}

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  createdAtUtc: string;
}

