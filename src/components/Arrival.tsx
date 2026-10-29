import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { BRAND } from "../lib/domain";
/** The page mounts on entry, so hidden video and offscreen images do not load behind the welcome. */
export function Arrival({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<"welcome" | "revealing" | "entered">(() =>
    location.pathname.startsWith("/admin") ? "entered" : "welcome",
  );
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (phase === "entered") return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [phase]);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  useEffect(() => {
    if (phase === "entered")
      document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [phase]);
  function enter() {
    if (phase !== "welcome") return;
    setPhase("revealing");
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 650;
    timeout.current = setTimeout(() => {
      setPhase("entered");
      requestAnimationFrame(() => {
        document.getElementById("main-content")?.focus({ preventScroll: true });
      });
    }, duration);
  }
  return (
    <>
      {phase !== "welcome" && (
        <div
          className={phase === "revealing" ? "site-reveal" : undefined}
          inert={phase === "revealing"}
        >
          {children}
        </div>
      )}
      {phase !== "entered" && (
        <div
          className={`arrival-screen ${phase === "revealing" ? "arrival-leaving" : ""}`}
        >
          <div className="arrival-stars" aria-hidden="true" />
          <div className="arrival-patterns" aria-hidden="true"><span className="arrival-pattern-flower arrival-pattern-flower-left"/><span className="arrival-pattern-flower arrival-pattern-flower-right"/><span className="arrival-pattern-lattice"/></div>
          <main
            className="arrival-content"
            aria-label="Welcome to Raghurajpur Heritage"
          >
            <span className="arrival-kicker">
              PURI · ODISHA · LIVING TRADITIONS
            </span>
            <div className="arrival-cosmos" aria-hidden="true">
              <span className="arrival-orbit" />
              <span className="arrival-mandala" />
              <span className="arrival-inner" />
              <span className="arrival-center">✧</span>
            </div>
            <div className="arrival-devotional-mark">
              <svg
                viewBox="0 0 120 95"
                role="img"
                aria-label="A stationary Jagannath-inspired brand motif"
              >
                <path
                  className="mark-gold"
                  d="M26 23 19 9 39 16 45 3 60 14 75 3 81 16 101 9 94 23Z"
                />
                <path
                  className="mark-maroon"
                  d="M22 26Q60 15 98 26L103 73Q60 96 17 73Z"
                />
                <circle className="mark-ivory" cx="39" cy="49" r="17" />
                <circle className="mark-ivory" cx="81" cy="49" r="17" />
                <circle className="mark-terra" cx="39" cy="49" r="12" />
                <circle className="mark-terra" cx="81" cy="49" r="12" />
                <circle className="mark-ivory" cx="39" cy="49" r="9" />
                <circle className="mark-ivory" cx="81" cy="49" r="9" />
                <circle className="mark-maroon" cx="39" cy="49" r="5" />
                <circle className="mark-maroon" cx="81" cy="49" r="5" />
                <path
                  d="M60 30V39M47 74Q60 82 73 74"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="arrival-overline">IN THE SPIRIT OF JAGANNATH</span>
            <h1>{BRAND}</h1>
            <p>
              A celebration of devotion, colour, and craft.
              <br />A little of Odisha, held close.
            </p>
            <button
              autoFocus
              className="arrival-enter"
              onClick={enter}
              disabled={phase === "revealing"}
            >
              Enter the site <ArrowRight size={17} />
            </button>
            <span className="arrival-footnote">
              A village of artists. An invitation to discover.
            </span>
          </main>
          <span className="arrival-coordinate" aria-hidden="true">
            CRAFTED WITH CARE · CHERISHED WITH TIME
          </span>
        </div>
      )}
    </>
  );
}
