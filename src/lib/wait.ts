import type { WaitReport, WaitStatus } from "./types";

export const REPORT_TTL_MINUTES = 90;

export function isReportExpired(report: WaitReport, now: Date = new Date()): boolean {
  const ageMs = now.getTime() - new Date(report.reportedAt).getTime();
  return ageMs > REPORT_TTL_MINUTES * 60_000;
}

/** Latest non-expired report wins. No valid report => unknown (never 0 minutes). */
export function getWaitStatus(reports: WaitReport[], now: Date = new Date()): WaitStatus {
  const valid = reports
    .filter((r) => !isReportExpired(r, now))
    .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt));
  const latest = valid[0];
  if (!latest) return { kind: "unknown" };
  const m = latest.waitMinutes;
  const kind = m <= 10 ? "short" : m <= 30 ? "moderate" : "long";
  return { kind, minutes: m, reportedAt: latest.reportedAt };
}

export function formatWait(status: WaitStatus): string {
  return status.kind === "unknown" ? "Wait unknown" : `~${status.minutes} min`;
}
