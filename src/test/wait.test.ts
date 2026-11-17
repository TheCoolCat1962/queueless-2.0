import { describe, expect, it } from "vitest";
import { formatWait, getWaitStatus, isReportExpired } from "@/lib/wait";
import { isWithinRegion } from "@/lib/region";
import type { WaitReport } from "@/lib/types";

const now = new Date("2026-01-01T12:00:00Z");
const r = (min: number, agoMin: number): WaitReport => ({
  id: "x",
  businessId: "b",
  waitMinutes: min,
  reportedAt: new Date(now.getTime() - agoMin * 60_000).toISOString(),
});

describe("wait rules", () => {
  it("no reports means unknown, not 0 minutes", () => {
    expect(getWaitStatus([], now)).toEqual({ kind: "unknown" });
    expect(formatWait(getWaitStatus([], now))).toBe("Wait unknown");
  });

  it.each([
    [0, false],
    [90 * 60_000 - 1, false],
    [90 * 60_000, true],
    [90 * 60_000 + 1, true],
    [91 * 60_000, true],
  ] as const)("report age %i ms has expired=%s", (ageMs, expired) => {
    const report = {
      ...r(5, 0),
      reportedAt: new Date(now.getTime() - ageMs).toISOString(),
    };

    expect(isReportExpired(report, now)).toBe(expired);
    expect(getWaitStatus([report], now)).toEqual(
      expired ? { kind: "unknown" } : { kind: "short", minutes: 5, reportedAt: report.reportedAt },
    );
  });

  it.each([-1, -0.5, 0.5, NaN, Infinity, -Infinity])(
    "rejects an invalid wait of %s minutes",
    (minutes) => {
      const report = r(minutes, 1);

      expect(getWaitStatus([report], now)).toEqual({ kind: "unknown" });
      expect(formatWait(getWaitStatus([report], now))).toBe("Wait unknown");
      expect(getWaitStatus([r(15, 5), report], now)).toEqual({
        kind: "moderate",
        minutes: 15,
        reportedAt: r(15, 5).reportedAt,
      });
    },
  );

  it.each([
    "",
    "not-a-date",
    "2026-01-01",
    "2026-01-01T11:59:00",
    "2026-13-01T12:00:00Z",
    "2026-01-01T25:00:00Z",
    "2026-01-01T11:59:00+25:00",
    "2026-01-01T12:00:00.001Z",
  ])("rejects an invalid or future timestamp %j", (reportedAt) => {
    const report = { ...r(5, 1), reportedAt };

    expect(isReportExpired(report, now)).toBe(true);
    expect(getWaitStatus([report], now)).toEqual({ kind: "unknown" });
    expect(getWaitStatus([report, r(15, 5)], now)).toEqual({
      kind: "moderate",
      minutes: 15,
      reportedAt: r(15, 5).reportedAt,
    });
  });

  it.each([
    ["2026-02-30T12:00:00Z", "2026-03-02T12:00:00Z"],
    ["2025-02-29T12:00:00Z", "2025-03-01T12:00:00Z"],
    ["2026-04-31T12:00:00Z", "2026-05-01T12:00:00Z"],
  ])("rejects an impossible calendar timestamp %j", (reportedAt, currentTime) => {
    const report = { ...r(5, 0), reportedAt };
    const currentNow = new Date(currentTime);

    expect(isReportExpired(report, currentNow)).toBe(true);
    expect(getWaitStatus([report], currentNow)).toEqual({ kind: "unknown" });
  });

  it("accepts a valid leap-day timestamp", () => {
    const report = { ...r(5, 0), reportedAt: "2024-02-29T11:45:00Z" };
    const leapDayNow = new Date("2024-02-29T12:00:00Z");

    expect(isReportExpired(report, leapDayNow)).toBe(false);
    expect(getWaitStatus([report], leapDayNow)).toEqual({
      kind: "short",
      minutes: 5,
      reportedAt: report.reportedAt,
    });
  });

  it("rejects reports when the current time is invalid", () => {
    const invalidNow = new Date(NaN);

    expect(isReportExpired(r(5, 1), invalidNow)).toBe(true);
    expect(getWaitStatus([r(5, 1)], invalidNow)).toEqual({ kind: "unknown" });
  });

  it.each([
    [0, "short"],
    [10, "short"],
    [11, "moderate"],
    [30, "moderate"],
    [31, "long"],
  ] as const)("classifies a valid %i-minute wait as %s", (minutes, kind) => {
    const report = r(minutes, 1);
    const status = getWaitStatus([report], now);

    expect(status).toEqual({ kind, minutes, reportedAt: report.reportedAt });
    expect(formatWait(status)).toBe(`~${minutes} min`);
  });

  it("lets a genuine zero-minute report replace an older positive wait", () => {
    const report = r(0, 1);

    expect(getWaitStatus([r(25, 5), report], now)).toEqual({
      kind: "short",
      minutes: 0,
      reportedAt: report.reportedAt,
    });
  });

  it("selects the latest valid report by time across timezone offsets", () => {
    const older = { ...r(5, 0), reportedAt: "2026-01-01T12:30:00+01:00" };
    const latest = r(20, 15);
    const reports = [older, latest, r(40, 25)];
    const original = reports.map((report) => ({ ...report }));

    expect(getWaitStatus(reports, now)).toEqual({
      kind: "moderate",
      minutes: 20,
      reportedAt: latest.reportedAt,
    });
    expect(reports).toEqual(original);
  });

  it("Covington is outside the service area; New Orleans is inside", () => {
    expect(isWithinRegion(30.4755, -90.1009)).toBe(false);
    expect(isWithinRegion(29.9511, -90.0715)).toBe(true);
  });
});
