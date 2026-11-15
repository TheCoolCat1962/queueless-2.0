import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — Queueless" },
      { name: "description", content: "Save New Orleans-area places to check their wait times quickly." },
      { property: "og:title", content: "Favorites — Queueless" },
      { property: "og:description", content: "Save New Orleans-area places to check their wait times quickly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader title="Favorites" />
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-6 md:px-8">
        <EmptyState icon={Heart} title="Favorites aren't set up yet">
          Saving places needs accounts and real business data, which aren't connected in this version. Nothing is saved or simulated.
        </EmptyState>
        <Link to="/" className="block text-center text-sm font-medium text-primary underline-offset-4 hover:underline">Back to Explore</Link>
      </div>
    </AppShell>
  );
}
