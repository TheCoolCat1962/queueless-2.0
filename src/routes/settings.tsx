import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronLeft, Monitor, Moon, Sun } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/EmptyState";
import { ACCENTS, usePreferences, type Accent, type ThemePref } from "@/lib/preferences";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Queueless" },
      { name: "description", content: "Choose your Queueless theme and accent color." },
      { property: "og:title", content: "Settings — Queueless" },
      { property: "og:description", content: "Choose your Queueless theme and accent color." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

const THEMES: { id: ThemePref; label: string; icon: typeof Sun }[] = [
  { id: "system", label: "System", icon: Monitor },
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
];

function SettingsPage() {
  const { prefs, setTheme, setAccent } = usePreferences();
  return (
    <AppShell>
      <div className="px-4 pt-4 md:px-8">
        <Link to="/profile" className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" aria-hidden /> Profile</Link>
      </div>
      <PageHeader title="Settings" subtitle="Saved on this device." />
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-6 md:px-8">
        <fieldset>
          <legend className="mb-3 font-semibold">Theme</legend>
          <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2">
            {THEMES.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" role="radio" aria-checked={prefs.theme === id} onClick={() => setTheme(id)}
                className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${prefs.theme === id ? "border-primary bg-accent text-primary" : "border-border bg-card hover:bg-accent"}`}>
                <Icon className="size-5" aria-hidden /> {label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-3 font-semibold">Accent color</legend>
          <div role="radiogroup" aria-label="Accent color" className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {ACCENTS.map((a: Accent) => (
              <button key={a} type="button" role="radio" aria-checked={prefs.accent === a} onClick={() => setAccent(a)}
                className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border text-sm font-medium capitalize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${prefs.accent === a ? "border-foreground bg-accent" : "border-border bg-card hover:bg-accent"}`}>
                <span data-accent={a} className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                  {prefs.accent === a && <Check className="size-4" aria-hidden />}
                </span>
                {a}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Wait-time colors stay fixed so they're always easy to read.</p>
        </fieldset>
      </div>
    </AppShell>
  );
}
