import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";
import { ClipboardList } from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a wait — Queueless" },
      { name: "description", content: "Share how long the line is at a New Orleans-area business." },
      { property: "og:title", content: "Report a wait — Queueless" },
      { property: "og:description", content: "Share how long the line is at a New Orleans-area business." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader title="Report a wait" />
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-6 md:px-8">
        <EmptyState icon={ClipboardList} title="Reporting isn't connected yet">
          Soon you'll pick a real business and share its current wait. Reports will expire after 90 minutes so times stay fresh. Nothing can be submitted in this version.
        </EmptyState>
      </div>
    </AppShell>
  );
}
