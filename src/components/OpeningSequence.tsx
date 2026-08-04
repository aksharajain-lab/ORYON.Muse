import { useEffect, useRef, useState } from "react";

/* Plays once per page load (not on client-side navigations back to "/").
 * The overlay is pure presentation — the homepage is always rendered beneath
 * it and emerges through it, so there is never a separate "screen". */
let introPlayed = false;

/** The opening sequence. Rendered above the homepage on first load; the
 *  layers dissolve into the settled page (no fade to black, no cut). */
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
    // animationend event is missed (e.g. reduced-motion environments where
    // the overlay is hidden by CSS and never animates).
    const t = setTimeout(finish, 4600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="overlay-out fixed inset-0 z-40 flex items-center justify-center bg-background motion-reduce:hidden"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) finish();
      }}
    >
      <div className="flex flex-col items-center px-6 text-center">
        {/* The ORYON Muse lockup — identical to the header: same serif,
            same tracking, same Muse accent. */}
        <div className="intro-logo flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft">
            <span className="text-serif text-xl leading-none text-foreground">O</span>
          </span>
          <span className="text-serif text-xl tracking-[0.22em] text-foreground/85">
            ORYON <span className="text-muse">Muse</span>
          </span>
        </div>

        <p className="intro-label mt-7 text-[10px] uppercase tracking-[0.5em] text-muted-foreground">
          Personal Aesthetic Intelligence
        </p>

        <p className="intro-line mt-5 text-serif text-xl leading-relaxed text-foreground/70 sm:text-2xl">
          A studio for <em className="italic text-foreground/85">discovering,</em>
          <br />
          interpreting, and evolving your visual identity.
        </p>
      </div>
    </div>
  );
}
