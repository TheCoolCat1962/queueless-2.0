import { MapPinOff } from "lucide-react";
import { REGION } from "@/lib/region";

/** Map placeholder. TODO: mount a real map provider here; keep this as the not-configured state. */
export function MapPanel({ className = "" }: { className?: string }) {
  return (
    <section aria-label="Map" className={`map-grid relative overflow-hidden rounded-2xl border border-border ${className}`}>
      <div className="absolute inset-0 grid place-items-center p-6 text-center">
        <div className="max-w-xs rounded-xl bg-card/90 p-4 shadow-sm backdrop-blur">
          <MapPinOff className="mx-auto size-7 text-muted-foreground" aria-hidden />
          <p className="mt-2 font-semibold">Map not configured yet</p>
          <p className="mt-1 text-sm text-muted-foreground">A live map of the {REGION.label} will appear here once a map provider is connected. No places are shown until then.</p>
        </div>
      </div>
    </section>
  );
}
