import type { CategoryId } from "@/lib/types";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "food", label: "Food & Drinks" },
  { id: "shopping", label: "Shopping" },
  { id: "services", label: "Services" },
  { id: "attractions", label: "Attractions" },
];

export function CategoryChips({ value, onChange }: { value: CategoryId; onChange: (c: CategoryId) => void }) {
  return (
    <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      {CATEGORIES.map((c) => {
        const active = c.id === value;
        return (
          <button key={c.id} type="button" aria-pressed={active} onClick={() => onChange(c.id)}
            className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-accent"}`}>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
