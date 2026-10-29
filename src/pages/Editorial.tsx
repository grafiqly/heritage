import { ArtisanImage } from "../components/ArtisanImage";
import { Link, useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { photos, BRAND, readLocal } from "../lib/domain";
import { useStore } from "../lib/store";
import { PageTitle, ProductCard, Empty } from "../components/shared";
export function Artisans() {
  const { id } = useParams();
  const { products, artisanProfiles: artisans } = useStore();
  const a = artisans.find((a) => a.id === id);
  if (id && !a)
    return (
      <Empty
        title="Artisan not found"
        body="Explore our demo artisan directory."
      />
    );
  return (
    <main className="section">
      <PageTitle
        eyebrow="THE PEOPLE BEHIND THE PIECES"
        title={a ? a.name : "Craft begins with a person."}
      >
        <p>
          {a
            ? a.craft
            : "Meet the hands and imaginations behind our sample collection."}
        </p>
      </PageTitle>
      <div className="notice">
        All profiles and biographies on this page are fictional demo content.
        Portraits and verified stories will be added with artisan consent.
      </div>
      {a ? (
        <>
          <div className="artisan-bio">
            <span className="profile-monogram">
              {a.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <div>
              <h2>A life in the making.</h2>
              <p>{a.bio}</p>
              <small>
                Fictional biography · No awards, affiliations, or authenticity
                claims.
              </small>
            </div>
          </div>
          <h2>From this demo studio</h2>
          <div className="product-grid">
            {products
              .filter((p) => p.artisan === id && p.published)
              .map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
          </div>
        </>
      ) : (
        <div className="artisan-grid directory">
          {artisans.map((a) => (
            <Link className="artisan-card" key={a.id} to={`/artisans/${a.id}`}>
              <ArtisanImage craft={a.craft} />
              <h2>{a.name}</h2>
              <span>{a.craft}</span>
              <p>{a.bio}</p>
              <span className="text-link">Visit the demo studio ↗</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
export function Editorial() {
  const { pathname } = useLocation();
  const crafts = pathname === "/crafts";
  return (
    <main>
      <section className="editorial-hero">
        <span className="eyebrow">
          {crafts ? "A LIVING LANGUAGE" : "THE ROOTS OF OUR STORY"}
        </span>
        <h1>
          {crafts ? "Tradition, in every detail." : "Where art feels at home."}
        </h1>
        <p>
          {crafts
            ? "An introduction to the forms in our demo collection."
            : "Raghurajpur, near Puri in Odisha. A village known for its artistic traditions."}
        </p>
      </section>
      <div className="wide-photo">
        <img
          src={photos.village}
          alt="Decorated village house in Raghurajpur, photograph by Sumit Surai"
        />
        <span>
          Raghurajpur · Sumit Surai · CC BY-SA 4.0 · Cropped for layout
        </span>
      </div>
      <section className="section two-columns">
        <div>
          <span className="eyebrow">LOOK A LITTLE CLOSER</span>
          <h2>
            A story told
            <br />
            <em>through the hands.</em>
          </h2>
        </div>
        <div>
          <p>
            {BRAND} is a demo storefront concept designed to connect thoughtful
            objects with the people and places behind them.
          </p>
          <p>
            {readLocal(
              "rh-heritage",
              "Our village journal is a work in progress.",
            )}
          </p>
          <p>
            The collection introduces Pattachitra, palm leaf art, and painted
            sculptural forms. All product specifications and cultural
            descriptions require research and owner confirmation before launch.
          </p>
          <p>
            <a
              className="text-link"
              href="https://www.incredibleindia.gov.in/en/rural-tourism/raghurajpur"
              target="_blank"
              rel="noreferrer"
            >
              Village context: Incredible India ↗
            </a>
          </p>
          <div className="notice">
            Editorial draft. Historical details, craft processes, artisan
            stories, and location imagery need verified sources and business
            review.
          </div>
        </div>
      </section>
      <section className="section devotion">
        <span className="eyebrow">WITH RESPECT AND REVERENCE</span>
        <h2>
          Lord Jagannath &<br />
          the stories of Odisha.
        </h2>
        <p>
          Lord Jagannath is central to Odisha’s cultural and devotional life.
          This section is reserved for carefully researched storytelling, with
          culturally appropriate artwork selected in consultation with the owner
          and artists.
        </p>
        <small>
          Draft context · Owner and cultural review required before publication.
        </small>
      </section>
      <section className="section">
        <h2>Explore the craft families.</h2>
        <div className="craft-grid">
          {["Pattachitra", "Palm leaf art", "Wood & papier-mâché"].map(
            (c, i) => (
              <Link
                className="editorial-craft"
                key={c}
                to={`/shop?category=${encodeURIComponent(c)}`}
              >
                <span className="eyebrow">0{i + 1}</span>
                <h3>{c}</h3>
                <p>
                  {
                    [
                      "Painted stories and considered linework.",
                      "Intricate marks across a natural surface.",
                      "Sculptural forms, brought to life through colour.",
                    ][i]
                  }
                </p>
                <span className="text-link">Explore demo pieces ↗</span>
              </Link>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
export function Supporting() {
  const { pathname } = useLocation();
  const [sent, setSent] = useState(false);
  const title = pathname.slice(1);
  if (title === "contact")
    return (
      <main className="section narrow">
        <PageTitle
          eyebrow="LET’S BEGIN A CONVERSATION"
          title="A note to the village."
        />
        <p>
          Contact details are awaiting business confirmation. This form is a
          local demonstration and sends no messages.
        </p>
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label>
            Your name
            <input required minLength={2} />
          </label>
          <label>
            Email
            <input type="email" required />
          </label>
          <label>
            Your message
            <textarea required minLength={10} />
          </label>
          <button className="button primary">Preview message submission</button>
          {sent && (
            <p role="status" className="success">
              Demo message received locally. No message was sent.
            </p>
          )}
        </form>
      </main>
    );
  const copy: Record<string, string[]> = {
    shipping: [
      "India-focused delivery",
      "Shipping charges and delivery eligibility are configured by the store administrator. Your exact shipping charge is shown before order confirmation. No delivery timeframe has been confirmed for this demo.",
      "Cash on delivery",
      "COD is the only proposed payment method. Availability depends on the configured delivery area.",
    ],
    returns: [
      "Requesting a return",
      "Return eligibility, timeframes, damage reporting, and refund procedures require business approval. Contact details will be published before launch.",
      "Handmade variations",
      "Actual product photos and accurate descriptions must explain expected handmade variations. This draft does not restrict statutory rights.",
    ],
    privacy: [
      "Your information",
      "This frontend demonstration saves sample cart, profile, addresses, and orders in browser local storage. Do not enter sensitive or real personal information.",
      "Managing demo data",
      "Clear browser site storage to remove locally saved demo data. Production retention, processors, and privacy contacts remain to be defined.",
    ],
    terms: [
      "Using this demonstration",
      "Products, profiles, prices, and orders are illustrative. No sale, payment, or delivery occurs through this demo.",
      "Before launch",
      "Business identity, applicable terms, consumer rights, contact information, and policies require legal and business review.",
    ],
  };
  return (
    <main className="section narrow">
      <PageTitle
        eyebrow="HERE TO HELP"
        title={`${title.charAt(0).toUpperCase() + title.slice(1)} policy`}
      />
      <div className="notice">
        Draft content requiring business review. Not an approved operating
        policy.
      </div>
      {(copy[title] || copy.terms).map((p, i) =>
        i % 2 ? <p key={i}>{p}</p> : <h2 key={i}>{p}</h2>,
      )}
    </main>
  );
}
