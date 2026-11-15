import { describe, expect, it } from "vitest";
import { formatWait, getWaitStatus, isReportExpired } from "@/lib/wait";
import { isWithinRegion } from "@/lib/region";

const now = new Date("2026-01-01T12:00:00Z");
const r = (min: number, agoMin: number) => ({ id: "x", businessId: "b", waitMinutes: min, reportedAt: new Date(now.getTime() - agoMin * 60000).toISOString() });

describe("wait rules", () => {
  it("no reports means unknown, not 0 minutes", () => {
    expect(formatWait(getWaitStatus([], now))).toBe("Wait unknown");
  });
  it("reports expire after 90 minutes", () => {
    expect(isReportExpired(r(5, 89), now)).toBe(false);
    expect(isReportExpired(r(5, 91), now)).toBe(true);
    expect(getWaitStatus([r(5, 91)], now).kind).toBe("unknown");
  });
  it("Covington is outside the service area; New Orleans is inside", () => {
    expect(isWithinRegion(30.4755, -90.1009)).toBe(false);
    expect(isWithinRegion(29.9511, -90.0715)).toBe(true);
  });
});
