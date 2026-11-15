import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";
import { UserRound, Settings, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Queueless" },
      { name: "description", content: "Your Queueless profile and app settings." },
      { property: "og:title", content: "Profile — Queueless" },
      { property: "og:description", content: "Your Queueless profile and app settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader title="Profile" />
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-6 md:px-8">
        <EmptyState icon={UserRound} title="Accounts aren't available yet">
          Sign-in isn't part of this version. Your appearance settings are saved on this device.
        </EmptyState>
        <Link to="/settings" className="flex min-h-14 items-center justify-between rounded-xl border border-border bg-card px-4 font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring">
          <span className="flex items-center gap-3"><Settings className="size-5 text-primary" aria-hidden /> Settings</span>
          <ChevronRight className="size-5 text-muted-foreground" aria-hidden />
        </Link>
      </div>
    </AppShell>
  );
}
