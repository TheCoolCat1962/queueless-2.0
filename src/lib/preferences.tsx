import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemePref = "system" | "light" | "dark";
export const ACCENTS = ["blue", "emerald", "orange", "purple", "pink", "teal"] as const;
export type Accent = (typeof ACCENTS)[number];

const STORAGE_KEY = "queueless:prefs";
interface Prefs { theme: ThemePref; accent: Accent }
const DEFAULTS: Prefs = { theme: "system", accent: "blue" };

export function parsePrefs(raw: string | null): Prefs {
  try {
    const p = JSON.parse(raw ?? "{}") as { theme?: string; accent?: string };
    return {
      theme: ["system", "light", "dark"].includes(p.theme ?? "") ? (p.theme as ThemePref) : DEFAULTS.theme,
      accent: (ACCENTS as readonly string[]).includes(p.accent ?? "") ? (p.accent as Accent) : DEFAULTS.accent,
    };
  } catch { return DEFAULTS; }
}

function apply(p: Prefs) {
  const root = document.documentElement;
  const dark = p.theme === "dark" || (p.theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
  root.dataset["accent"] = p.accent;
}

/** Inline script run before paint to avoid a theme flash. */
export const prefsBootScript = `(function(){try{var p=JSON.parse(localStorage.getItem("${STORAGE_KEY}")||"{}");var t=p.theme||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.dataset.accent=p.accent||"blue";}catch(e){}})();`;

const Ctx = createContext<{ prefs: Prefs; setTheme: (t: ThemePref) => void; setAccent: (a: Accent) => void } | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  useEffect(() => { setPrefs(parsePrefs(localStorage.getItem(STORAGE_KEY))); }, []);
  useEffect(() => {
    apply(prefs);
    if (prefs.theme !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const on = () => apply(prefs);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [prefs]);
  const update = useCallback((patch: Partial<Prefs>) => {
    setPrefs((p) => { const n = { ...p, ...patch }; localStorage.setItem(STORAGE_KEY, JSON.stringify(n)); return n; });
  }, []);
  return (
    <Ctx.Provider value={{ prefs, setTheme: (theme) => update({ theme }), setAccent: (accent) => update({ accent }) }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePreferences() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePreferences must be used inside PreferencesProvider");
  return c;
}
