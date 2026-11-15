import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ icon: Icon, title, children, tone = "default" }: { icon: LucideIcon; title: string; children?: ReactNode; tone?: "default" | "error" }) {
  return (
    <div role={tone === "error" ? "alert" : undefined} className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center">
      <Icon className={tone === "error" ? "size-8 text-destructive" : "size-8 text-muted-foreground"} aria-hidden />
      <h3 className="mt-3 font-semibold">{title}</h3>
      {children && <div className="mt-1 max-w-sm text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="px-4 pt-6 md:px-8 md:pt-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </header>
  );
}

export function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading" className="space-y-3">
      {Array.from({ length: count }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}
    </div>
  );
}
