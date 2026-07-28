import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-aurora opacity-80" />
      <div className="pointer-events-none fixed inset-0 [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_10%,transparent)_1px,transparent_0)] [background-size:32px_32px] opacity-[0.06]" />
      <header className="relative z-20">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-6 sm:pt-8">
          <Link to="/" className="group flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full glass shadow-soft">
              <span className="text-serif text-lg leading-none text-foreground">O</span>
            </span>
            <span className="text-serif text-lg tracking-[0.2em] text-foreground/90">
              ORYON <span className="italic text-foreground/60">Muse</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="relative z-10">{children}</main>
      <footer className="relative z-10 mx-auto max-w-5xl px-5 py-10 text-center text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
        ORYON Muse — an aesthetic companion
      </footer>
    </div>
  );
}
