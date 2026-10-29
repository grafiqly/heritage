import { Link, NavLink } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  UserRound,
  ArrowUpRight,
  Menu,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useState } from "react";
import { BRAND, money } from "../lib/domain";
import type { Product } from "../lib/domain";
import { useStore } from "../lib/store";
export function Header() {
  const { cart } = useStore();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  return (
    <>
      <div className="announcement">
        A living tradition. A little closer to home.{" "}
        <span>
          Discover the spirit of Raghurajpur <ArrowUpRight size={12} />
        </span>
      </div>
      <header>
        <Link to="/" className="brand">
          <span className="brand-mark">✺</span>
          <span>
            {BRAND.split(" ")[0]}
            <small>HERITAGE</small>
          </span>
        </Link>
        <nav className={open ? "open" : ""} onClick={() => setOpen(false)}>
          {[
            ["Shop", "/shop"],
            ["Crafts", "/crafts"],
            ["Our Village", "/village"],
            ["Artisans", "/artisans"],
            ["About", "/about"],
          ].map(([n, p]) => (
            <NavLink key={p} to={p}>
              {n}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link to="/shop" aria-label="Search collection">
            <Search size={20} />
          </Link>
          <Link to="/account" aria-label="Account">
            <UserRound size={20} />
          </Link>
          <Link
            className="bag"
            to="/cart"
            aria-label={`Cart, ${cart.reduce((a, b) => a + b.quantity, 0)} items`}
          >
            <ShoppingBag size={20} />
            <sup>{cart.reduce((a, b) => a + b.quantity, 0)}</sup>
          </Link>
          <button
            className="icon theme"
            aria-label="Toggle color theme"
            onClick={() => {
              setDark(!dark);
              document.documentElement.dataset.theme = dark ? "light" : "dark";
            }}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="icon mobile-menu"
            aria-label="Toggle navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <Link to="/" className="brand">
            <span className="brand-mark">✺</span>
            {BRAND}
          </Link>
          <p>
            A village of stories.
            <br />A collection with soul.
          </p>
          <small>
            Frontend demonstration · All products & artisan records are
            fictional.
          </small>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/shop">The collection</Link>
          <Link to="/village">Our village</Link>
          <Link to="/artisans">Meet the artisans</Link>
          <Link to="/admin" className="button outline admin-entry-button">
            Admin panel <ArrowUpRight size={15} />
          </Link>
        </div>
        <div>
          <h4>Here to help</h4>
          {["Contact", "Shipping", "Returns", "Privacy", "Terms"].map((p) => (
            <Link key={p} to={`/${p.toLowerCase()}`}>
              {p}
            </Link>
          ))}
        </div>
        <div>
          <h4>A note from the village</h4>
          <p>
            Thoughtful objects. Stories of making.
            <br />
            Discover something worth keeping.
          </p>
          <Link to="/shop">Explore the collection ↗</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {BRAND} · Demo concept
        </span>
        <span>
          Editorial photos:{" "}
          <a href="https://commons.wikimedia.org/wiki/File:Raghurajpur_10.jpg">
            Rangan Datta Wiki
          </a>{" "}
          &{" "}
          <a href="https://commons.wikimedia.org/wiki/File:Raghurajpur_-_Decorated_Village_House.jpg">
            Sumit Surai
          </a>{" "}
          ·{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">
            CC BY-SA 4.0
          </a>{" "}
          · Cropped
        </span>
      </div>
    </footer>
  );
}
export function ProductCard({ p }: { p: Product }) {
  const { artisanProfiles: artisans } = useStore();
  return (
    <article className="product-card">
      <Link className="product-photo" to={`/product/${p.id}`}>
        <img
          src={p.image}
          alt={`Illustrative placeholder for ${p.name}`}
          loading="lazy"
          decoding="async"
        />
        {p.stock === 1 ? (
          <span className="badge">One of a kind</span>
        ) : p.stock === 0 ? (
          <span className="badge">Currently unavailable</span>
        ) : null}
        <span className="photo-action">
          Discover the piece <ArrowUpRight size={16} />
        </span>
      </Link>
      <div className="product-meta">
        {p.category}
        <span>DEMO COLLECTION</span>
      </div>
      <div className="product-title">
        <Link to={`/product/${p.id}`}>{p.name}</Link>
        <span>{money(p.price)}</span>
      </div>
      <small>
        By {artisans.find((a) => a.id === p.artisan)?.name || p.artisan}
      </small>
    </article>
  );
}
export function PageTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty">
      <span className="ornament">✳</span>
      <h2>{title}</h2>
      <p>{body}</p>
      <Link className="button primary" to="/shop">
        Explore the collection
      </Link>
    </div>
  );
}
