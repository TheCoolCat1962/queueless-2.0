import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Clock, MapPin, Store } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Logo } from "@/components/app/Logo";
import { EmptyState, SkeletonRows } from "@/components/app/EmptyState";
import { CategoryChips } from "@/components/explore/CategoryChips";
import { MapPanel } from "@/components/explore/MapPanel";
import { SearchBar } from "@/components/explore/SearchBar";
import { dataService } from "@/lib/data/places-service";
import { REGION } from "@/lib/region";
import type { CategoryId } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Explore wait times in New Orleans — Queueless" },
      { name: "description", content: "Community-powered wait times and local activity across the New Orleans area." },
      { property: "og:title", content: "Explore wait times in New Orleans — Queueless" },
      { property: "og:description", content: "Community-powered wait times and local activity across the New Orleans area." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

function Explore() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId>("all");
  const reports = useQuery({ queryKey: ["reports"], queryFn: () => dataService.getRecentReports() });
  const places = useQuery({ queryKey: ["places", query, category], queryFn: () => dataService.searchBusinesses({ query, category }) });

  return (
    <AppShell>
      <div className="md:grid md:h-dvh md:grid-cols-[minmax(360px,440px)_1fr]">
        <div className="space-y-5 px-4 pt-5 md:overflow-y-auto md:px-6 md:pb-8">
          <header>
            <div className="md:hidden"><Logo /></div>
            <div className="mt-4 flex items-end justify-between gap-3 md:mt-2">
              <h1 className="font-display text-3xl font-semibold tracking-tight">Explore</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <MapPin className="size-3.5 text-primary" aria-hidden /> {REGION.label}
              </span>
            </div>
          </header>
          <SearchBar value={query} onChange={setQuery} />
          <CategoryChips value={category} onChange={setCategory} />
          {query.trim() && (
            <p role="status" className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              Real business search is not connected yet, so no results can be shown for “{query.trim()}”.
            </p>
          )}

          <MapPanel className="h-[38dvh] md:hidden" />

          <section aria-labelledby="recent-h" className="space-y-3">
            <h2 id="recent-h" className="text-lg font-semibold">Recent wait reports</h2>
            {reports.isPending ? <SkeletonRows count={2} /> : reports.isError || reports.data.status === "error" ? (
              <EmptyState icon={AlertTriangle} tone="error" title="Couldn't load reports">Please try again shortly.</EmptyState>
            ) : (
              <EmptyState icon={Clock} title="No recent reports yet">
                Wait reports from the community will show here. Without a report, a wait is shown as unknown — never as 0 minutes.
              </EmptyState>
            )}
          </section>

          <section aria-labelledby="discover-h" className="space-y-3">
            <h2 id="discover-h" className="text-lg font-semibold">Discover places</h2>
            {places.isPending ? <SkeletonRows /> : places.data?.status === "ok" && places.data.data.length > 0 ? null : (
              <EmptyState icon={Store} title="Places aren't connected yet">
                Real businesses in the {REGION.label} will appear here once a places provider is connected. We don't show sample or made-up places.
              </EmptyState>
            )}
          </section>
        </div>
        <div className="hidden md:block md:p-4"><MapPanel className="h-full" /></div>
      </div>
    </AppShell>
  );
}
