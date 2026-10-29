import { useEffect } from "react";
/** Pause decorative animation outside the viewport; no scroll listeners or React updates per frame. */
export function useSectionMotion() {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          (entry.target as HTMLElement).dataset.motionVisible =
            entry.isIntersecting ? "yes" : "no";
      },
      { rootMargin: "100px" },
    );
    const register = () => {
      document
        .querySelectorAll(
          "section,main.section,.auth-wrap,.admin-main,.editorial-hero,.promise-bar,footer",
        )
        .forEach((el) => {
          if (!seen.has(el)) {
            seen.add(el);
            (el as HTMLElement).dataset.motionVisible = "no";
            observer.observe(el);
          }
        });
    };
    const changes = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(register);
    });
    changes.observe(document.getElementById("root")!, {
      childList: true,
      subtree: true,
    });
    register();
    return () => {
      changes.disconnect();
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
}
