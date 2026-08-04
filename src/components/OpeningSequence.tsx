import { useEffect, useRef, useState } from "react";

/* Plays once per page load (not on client-side navigations back to "/").
 * The overlay is pure presentation — the homepage is always rendered beneath
 * it and emerges through it, so there is never a separate "screen".
 *
 * Each element carries its own animation class and delay — the container is
 * never animated. The reveal is strictly sequential and never simultaneous:
 *   1. the ORYON Muse lockup (0.05s),
 *   2. the editorial statement (1.0s, after the lockup settles),
 *   3. the "Powered by ORYON" signature (1.9s, after the line settles). */
let introPlayed = false;

/** The opening sequence: a minimal luxury editorial arrival that dissolves
 *  into the homepage (~4.2s total). */
export function OpeningSequence() {
  const [active, setActive] = useState(() => !introPlayed);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setActive(false);
  };

  useEffect(() => {
    introPlayed = true;
    // Safety net: unmount shortly after the dissolve completes even if the
    // animationend event is missed.
    const t = setTimeout(finish, 4600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="overlay-out fixed inset-0 z-40 flex items-center justify-center bg-background"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) finish();
      }}
    >
      <div className="flex flex-col items-center px-6 text-center">
        {/* Stage 1 — the ORYON Muse lockup alone (≈34px mobile / 48px desktop).
            Same serif, tracking, Muse accent, and colours as the header —
            only scaled to a quiet editorial size. */}
        <div className="intro-logo flex items-center gap-3 sm:gap-4">
          <span className="grid h-9 w-9 place-items-center rounded-full glass shadow-soft sm:h-12 sm:w-12">
            <span className="text-serif text-lg leading-none text-foreground sm:text-2xl">
              O
            </span>
          </span>
          <span className="text-serif text-[2.125rem] leading-none tracking-[0.22em] text-foreground/85 sm:text-[3rem]">
            ORYON <span className="text-muse">Muse</span>
          </span>
        </div>

        {/* Stage 2 — the single editorial statement: light EB Garamond, one
            continuous line on desktop, wider tracking, no width constraint. */}
        <p className="intro-statement mt-8 font-statement text-[13px] font-light leading-snug tracking-[0.07em] text-foreground/70 sm:mt-10 sm:text-[15px] sm:whitespace-nowrap">
          The first Personal Aesthetic Intelligence platform.
        </p>
      </div>

      {/* Stage 3 — the small signature, near the base with generous spacing. */}
      <p className="intro-powered absolute inset-x-0 bottom-10 text-center font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground sm:bottom-12">
        Powered by ORYON
      </p>
    </div>
  );
}
