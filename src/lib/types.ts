/** Core domain types. Kept provider-agnostic so Google Places / Supabase can map into them. */
export type CategoryId = "all" | "food" | "shopping" | "services" | "attractions";

export interface LatLng { lat: number; lng: number }

export interface Business {
  id: string;
  /** Provider-specific id (e.g. Google Place ID). */
  externalId?: string;
  name: string;
  category: Exclude<CategoryId, "all">;
  address: string;
  zip?: string;
  location: LatLng;
}

export interface WaitReport {
  id: string;
  businessId: string;
  /** Reported wait in minutes. A missing report means "unknown", never 0. */
  waitMinutes: number;
  reportedAt: string; // ISO timestamp
  note?: string;
}

export interface Favorite {
  id: string;
  businessId: string;
  createdAt: string;
}

export type WaitStatus =
  | { kind: "unknown" }
  | { kind: "short" | "moderate" | "long"; minutes: number; reportedAt: string };
