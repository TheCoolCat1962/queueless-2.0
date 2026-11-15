/** Service area. Phase 1: label only. TODO: polygon boundary validation. */
export const REGION = {
  id: "nola-metro",
  label: "New Orleans area",
  /** Rough bounding box for the metro (south shore). Excludes the Northshore (e.g. Covington). */
  bounds: { north: 30.1, south: 29.8, west: -90.35, east: -89.85 },
} as const;

export function isWithinRegion(lat: number, lng: number): boolean {
  const b = REGION.bounds;
  return lat <= b.north && lat >= b.south && lng >= b.west && lng <= b.east;
}
