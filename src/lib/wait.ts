import { z } from "zod";
import type { WaitReport, WaitStatus } from "./types";

export const REPORT_TTL_MINUTES = 90;
const reportTimestampSchema = z.string().datetime({ offset: true });

/** Invalid or future timestamps are unusable, just like expired reports. */
export function isReportExpired(report: WaitReport, now: Date = new Date()): boolean {
  // Date alone normalizes impossible calendar dates instead of rejecting them.
  if (!reportTimestampSchema.safeParse(report.reportedAt).success) return true;
  const ageMs = now.getTime() - new Date(report.reportedAt).getTime();
  return !Number.isFinite(ageMs) || ageMs < 0 || ageMs >= REPORT_TTL_MINUTES * 60_000;
}

/** Latest non-expired report wins. No valid report => unknown (never 0 minutes). */
export function getWaitStatus(reports: WaitReport[], now: Date = new Date()): WaitStatus {
  const valid = reports
    .filter(
      (r) => Number.isInteger(r.waitMinutes) && r.waitMinutes >= 0 && !isReportExpired(r, now),
    )
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
  const latest = valid[0];
  if (!latest) return { kind: "unknown" };
  const m = latest.waitMinutes;
  const kind = m <= 10 ? "short" : m <= 30 ? "moderate" : "long";
  return { kind, minutes: m, reportedAt: latest.reportedAt };
}

export function formatWait(status: WaitStatus): string {
  return status.kind === "unknown" ? "Wait unknown" : `~${status.minutes} min`;
}
