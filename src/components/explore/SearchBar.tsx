import { Search } from "lucide-react";

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
      <label htmlFor="explore-search" className="sr-only">Search places, addresses, or ZIP</label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input id="explore-search" type="search" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="Search places, addresses, or ZIP" autoComplete="off"
        className="h-13 w-full rounded-2xl border border-input bg-card pl-12 pr-4 text-base shadow-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30" />
    </form>
  );
}
