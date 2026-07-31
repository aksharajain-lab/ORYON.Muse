import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Subtle paper-like texture */}
      <div className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
        }}
      />
      {/* Dark Academia — deeper archival grain */}
      <div className="pointer-events-none fixed inset-0 hidden dark:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='240' height='240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.055'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />
      {/* Fine dot pattern */}
      <div className="pointer-events-none fixed inset-0 [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_5%,transparent)_1px,transparent_0)] [background-size:48px_48px] opacity-[0.035]" />
      <header className="relative z-20">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-6 sm:pt-8">
          <Link to="/" className="group flex items-center gap-2.5 transition hover:opacity-80">
            <span className="grid h-8 w-8 place-items-center rounded-full glass shadow-soft">
              <span className="text-serif text-base leading-none text-foreground">O</span>
            </span>
            <span className="text-serif text-base tracking-[0.22em] text-foreground/85">
              ORYON <span className="text-muse">Muse</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="relative z-10">{children}</main>
      <footer className="relative z-10 mx-auto max-w-5xl px-5 py-8 text-center text-[9px] uppercase tracking-[0.4em] text-muted-foreground">
        ORYON Muse — an aesthetic companion
      </footer>
    </div>
  );
}
