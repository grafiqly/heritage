import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
type Props = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
  credit: string;
  align?: "left" | "right";
};
export function EditorialBanner({
  image,
  alt,
  eyebrow,
  title,
  description,
  href,
  action,
  credit,
  align = "left",
}: Props) {
  return (
    <section
      className={`editorial-banner editorial-banner-${align}`}
      style={{ "--banner-image": `url("${image}")` } as CSSProperties}
    >
      <img
        className="editorial-banner-image"
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
      <div className="editorial-banner-shade" />
      <div className="editorial-banner-content">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link className="film-secondary" to={href}>
          {action}
          <ArrowUpRight size={18} />
        </Link>
      </div>
      <span className="editorial-banner-credit">{credit}</span>
    </section>
  );
}
