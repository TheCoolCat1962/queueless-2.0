import { Link } from "@tanstack/react-router";
import { Compass, Heart, PlusCircle, User } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Explore", icon: Compass },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/report", label: "Report", icon: PlusCircle },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground md:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">Skip to content</a>
      <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-border md:bg-card md:p-5">
        <Logo />
        <nav aria-label="Main" className="mt-8 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring data-[status=active]:bg-accent data-[status=active]:text-primary">
              <Icon className="size-5" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main id="main" className="min-w-0 flex-1 pb-24 md:pb-0">{children}</main>
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <ul className="grid grid-cols-4">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link to={to} activeOptions={{ exact: to === "/" }}
                className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring data-[status=active]:text-primary">
                <Icon className="size-6" aria-hidden /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
