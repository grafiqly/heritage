import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { readLocal } from "../lib/domain";
export function VideoHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [source] = useState(() =>
    matchMedia("(max-width: 767px)").matches
      ? "/media/hero-art-mobile.mp4"
      : "/media/hero-art.mp4",
  );
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const userPaused = useRef(false);
  useEffect(() => {
    const media = video.current;
    if (!media) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const sync = () => {
      if (!visible || document.hidden || motion.matches || userPaused.current)
        media.pause();
      else void media.play().catch(() => setPlaying(false));
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(media);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      media.pause();
    };
  }, []);
  function toggle() {
    const media = video.current;
    if (!media) return;
    if (media.paused) {
      userPaused.current = false;
      void media.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      media.pause();
    }
  }
  return (
    <section
      className="film-hero"
      aria-label="An introduction to Raghurajpur Heritage"
    >
      <img
        className="film-poster"
        src="/media/hero-poster.jpg"
        alt="Golden sunlight over the sea, from the supplied heritage film"
        fetchPriority="high"
      />
      {!failed && (
        <video
          ref={video}
          src={source}
          className="hero-film"
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-poster.jpg"
          aria-label="Heritage film supplied by the store owner"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={(event) => {
            if (event.currentTarget.error) setFailed(true);
          }}
        ></video>
      )}
      <div className="film-shade" />
      <div className="film-content">
        <span className="eyebrow">
          <span className="tiny-line" /> ODISHA, THROUGH ANOTHER LENS
        </span>
        <h1>
          Not just made.
          <br />
          <em>Passed down.</em>
        </h1>
        <p>
          {readLocal("rh-content", "A village shaped by art.")}
          <br />
          Discover the craft, the people, and the stories of Raghurajpur.
        </p>
        <div className="film-actions">
          <Link className="button film-primary" to="/shop">
            Explore the Collection <ArrowUpRight size={18} />
          </Link>
          <Link className="film-secondary" to="/village">
            Discover the Village <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      <div className="film-bottom">
        <span>THE ART OF MAKING. THE JOY OF KEEPING.</span>
        <a href="#craft-collection" className="film-scroll">
          A world of craft awaits <ArrowDown size={16} />
        </a>
        {!failed && (
          <button
            className="film-playback"
            onClick={toggle}
            aria-label={playing ? "Pause hero video" : "Play hero video"}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
            <span>{playing ? "Pause film" : "Play film"}</span>
          </button>
        )}
      </div>
    </section>
  );
}
