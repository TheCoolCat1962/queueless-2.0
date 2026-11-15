import type { Business, CategoryId, Favorite, WaitReport } from "../types";

export type ServiceResult<T> =
  | { status: "ok"; data: T }
  | { status: "not_connected"; reason: string }
  | { status: "error"; message: string };

/** The UI depends only on this interface. Swap the implementation to connect real data. */
export interface PlacesDataService {
  readonly connected: boolean;
  searchBusinesses(q: { query: string; category: CategoryId }): Promise<ServiceResult<Business[]>>;
  getRecentReports(): Promise<ServiceResult<WaitReport[]>>;
  getFavorites(): Promise<ServiceResult<Favorite[]>>;
}

const NOT_CONNECTED = "Real business data is not connected yet.";

/** Phase 1 implementation: returns honest "not connected" states. No fake data. */
export const notConnectedService: PlacesDataService = {
  connected: false,
  async searchBusinesses() { return { status: "not_connected", reason: NOT_CONNECTED }; },
  async getRecentReports() { return { status: "not_connected", reason: "Wait reporting is not connected yet." }; },
  async getFavorites() { return { status: "not_connected", reason: "Accounts and favorites are not connected yet." }; },
};

export const dataService: PlacesDataService = notConnectedService;
