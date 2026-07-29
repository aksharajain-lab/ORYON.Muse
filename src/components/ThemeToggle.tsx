import { useEffect, useState } from "react";
import { Moon, Sparkles } from "lucide-react";

const KEY = "oryon.theme";
type Theme = "muse" | "academia";

function apply(t: Theme) {
  const root = document.documentElement;
  if (t === "academia") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("muse");
  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as Theme) || "muse";
    setTheme(saved);
    apply(saved);
  }, []);
  const toggle = () => {
    const next: Theme = theme === "muse" ? "academia" : "muse";
    setTheme(next);
    apply(next);
    try { localStorage.setItem(KEY, next); } catch {}
  };
  return { theme, toggle };
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "academia";
  return (
    <button
      onClick={toggle}
      aria-label="Toggle aesthetic theme"
      className="inline-flex h-9 items-center gap-2 rounded-full border border-border/30 px-3.5 text-[10px] uppercase tracking-[0.25em] text-foreground/60 transition hover:border-foreground/30 hover:text-foreground"
    >
      {isDark ? <Moon className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
      <span className="hidden sm:inline">{isDark ? "Dark Academia" : "Soft Muse"}</span>
    </button>
  );
}
