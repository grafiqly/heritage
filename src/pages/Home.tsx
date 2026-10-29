import { EditorialBanner } from "../components/EditorialBanner";
import { ArtisanImage } from "../components/ArtisanImage";
import { VideoHero } from "../components/VideoHero";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  PackageCheck,
  HandHeart,
  MapPin,
} from "lucide-react";
import { useStore } from "../lib/store";
import { ProductCard } from "../components/shared";
export default function Home() {
  const { products, artisanProfiles: artisans } = useStore();
  return (
    <>
      <VideoHero />
      <div className="promise-bar">
        <span>
          <HandHeart size={18} /> The beauty of the handmade
        </span>
        <span>
          <MapPin size={18} /> Inspired by Raghurajpur, Odisha
        </span>
        <span>
          <PackageCheck size={18} /> Cash on delivery available
        </span>
      </div>
      <section className="section craft-collection" id="craft-collection">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A LANGUAGE OF ITS OWN</span>
            <h2>Many crafts. One village.</h2>
          </div>
          <Link className="text-link" to="/crafts">
            Explore the crafts <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="craft-grid">
          {[
            [
              "Pattachitra",
              "Stories, painted by hand",
              "/media/pattachitra-studio.jpg",
            ],
            [
              "Palm leaf art",
              "A world in the finest lines",
              "/media/palm-leaf-craft.jpg",
            ],
            [
              "Wood & papier-mâché",
              "Tradition takes a new shape",
              "/media/wooden-toys.jpg",
            ],
          ].map(([name, desc, img], i) => (
            <Link
              key={name}
              to={`/shop?category=${encodeURIComponent(name)}`}
              className="craft-card"
            >
              <img
                src={img}
                alt={`${name} craft reference photography; illustrative of the craft, not demo inventory`}
                loading="lazy"
                decoding="async"
              />
              <div>
                <span>0{i + 1} / THE CRAFT</span>
                <h3>{name}</h3>
                <p>{desc}</p>
                <ArrowUpRight size={22} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="making-banner">
        <img
          src="/media/artist-at-work.jpg"
          alt="An artist painting Pattachitra in Raghurajpur, photographed by Sumit Surai"
          loading="lazy"
          decoding="async"
        />
        <div className="banner-shade" />
        <div className="making-copy">
          <span className="eyebrow">SLOW DOWN. LOOK CLOSER.</span>
          <h2>
            Behind every beautiful piece,
            <br />
            <em>a world of making.</em>
          </h2>
          <p>
            The delicate lines. The patient hands. The quiet details.
            <br />
            There is more to discover than meets the eye.
          </p>
          <Link to="/crafts" className="film-secondary">
            Discover the craft <ArrowUpRight size={18} />
          </Link>
        </div>
        <span className="banner-credit">
          SUMIT SURAI · CC BY-SA 4.0 · CROPPED
        </span>
      </section>
      <section className="section featured media-featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CHOSEN WITH CARE</span>
            <h2>Objects with a little more soul.</h2>
          </div>
          <Link className="text-link" to="/shop">
            Shop the collection <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.published)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
        </div>
        <p className="caption">
          Sample collection · Fictional products · Illustrative craft reference
          photography
        </p>
      </section>
      <section className="village-feature">
        <div className="village-photo">
          <img
            src="/media/village-house.jpg"
            alt="Decorated village house in Raghurajpur, photograph by Sumit Surai"
            loading="lazy"
            decoding="async"
          />
          <span>THE PLACE BEHIND THE PIECES</span>
        </div>
        <div className="editorial-copy">
          <span className="eyebrow">WELCOME TO RAGHURAJPUR</span>
          <h2>
            A small village.
            <br />
            <em>An extraordinary canvas.</em>
          </h2>
          <p>
            Near Puri in Odisha, Raghurajpur is known for its artistic
            traditions. Here, craft is an invitation to look closer: at a line,
            a story, a way of making.
          </p>
          <p className="muted">
            Our village journal is a work in progress. Detailed cultural and
            historical copy awaits research and owner review.
          </p>
          <Link className="text-link" to="/village">
            Step into the village <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section className="section devotion devotion-gallery">
        <div>
          <span className="eyebrow">CULTURE, WITH REVERENCE</span>
          <h2>
            Stories of devotion.
            <br />
            Expressions of belonging.
          </h2>
          <p>
            Lord Jagannath holds a special place in Odisha’s cultural life. We
            approach this connection with care, making space for the stories and
            artistic traditions that surround it.
          </p>
          <Link className="text-link" to="/village">
            Explore our heritage <ArrowRight size={16} />
          </Link>
        </div>
        <figure className="jagannath-art">
          <div className="jagannath-frame">
            <img
              src="/media/lord-jagannath.jpg"
              alt="Detailed Pattachitra painting of Lord Jagannath with Balabhadra and Subhadra, photographed by Patrick.zip"
              loading="lazy"
              decoding="async"
              width="2228"
              height="3772"
            />
          </div>
          <figcaption>
            <a href="https://commons.wikimedia.org/wiki/File:Pattachitra_of_Jagannath.jpg">
              Pattachitra of Jagannath · Patrick.zip
            </a>{" "}
            ·{" "}
            <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>
          </figcaption>
        </figure>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE PEOPLE BEHIND THE PIECES</span>
            <h2>Meet the hands. Know the story.</h2>
          </div>
          <Link className="text-link" to="/artisans">
            All artisans <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="artisan-grid artisan-image-grid">
          {artisans.map((a, i) => (
            <Link to={`/artisans/${a.id}`} className="artisan-tile" key={a.id}>
              <ArtisanImage craft={a.craft} />
              <div className="artisan-tile-body">
                <span className="artisan-number">0{i + 1}</span>
                <div>
                  <h3>{a.name}</h3>
                  <p>{a.craft}</p>
                  <small>Fictional demo profile</small>
                </div>
                <ArrowUpRight />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <EditorialBanner
        image="/media/pattachitra-studio.jpg"
        alt="A large Pattachitra painting displayed in an artist’s studio in Raghurajpur"
        eyebrow="THE PAINTED COLLECTION"
        title="A thousand details. A story of your own."
        description="Look closer at a world of intricate lines and expressive colour. Find a piece that invites you to keep looking."
        href="/shop?category=Pattachitra"
        action="Explore Pattachitra"
        credit="RANGAN DATTA WIKI · CC BY-SA 4.0 · CROPPED"
        align="right"
      />
      <section className="visual-journal section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">POSTCARDS FROM THE WORLD OF CRAFT</span>
            <h2>Stay a little longer.</h2>
          </div>
          <Link className="text-link" to="/village">
            The village journal <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="journal-grid">
          <Link to="/village" className="journal-image journal-tall">
            <img
              src="/media/village-house.jpg"
              alt="Colourful decorated house in Raghurajpur"
              loading="lazy"
              decoding="async"
            />
            <span>
              01 / A village with art on its walls <ArrowUpRight size={17} />
            </span>
          </Link>
          <Link to="/crafts" className="journal-image">
            <img
              src="/media/palm-leaf-craft.jpg"
              alt="Palm leaf craft demonstration by Maga Nayak, photographed by Manoj Choudhury"
              loading="lazy"
              decoding="async"
            />
            <span>
              02 / A closer look at the details <ArrowUpRight size={17} />
            </span>
          </Link>
          <Link to="/crafts" className="journal-image">
            <img
              src="/media/pattachitra-studio.jpg"
              alt="An artist displaying a Pattachitra painting in Raghurajpur"
              loading="lazy"
              decoding="async"
            />
            <span>
              03 / Stories within a painting <ArrowUpRight size={17} />
            </span>
          </Link>
        </div>
        <details className="media-credits">
          <summary>Photography & film credits</summary>
          <p>
            Hero film supplied by the owner. Editorial photographs illustrate
            craft traditions and are not images of the fictional products or
            artisan profiles.
          </p>
          <p>
            <a href="https://commons.wikimedia.org/wiki/File:Raghurajpur_Artist.JPG">
              Artist at work — Sumit Surai
            </a>
            ;{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Raghurajpur_7.jpg">
              Pattachitra studio — Rangan Datta Wiki
            </a>
            ; village house — Sumit Surai; devotional painting — Rangan Datta
            Wiki.{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/">
              CC BY-SA 4.0
            </a>
            .
          </p>
          <p>
            <a href="https://commons.wikimedia.org/wiki/File:Odia_Palm_leaf_manuscipt.JPG">
              Palm leaf craft — Manoj Choudhury
            </a>
            ;{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Wooden_toys_of_Raghurajpur.jpg">
              Wooden toys — Swetapadma07
            </a>
            .{" "}
            <a href="https://creativecommons.org/licenses/by-sa/3.0/">
              CC BY-SA 3.0
            </a>
            . Images cropped to fit. No endorsement implied.
          </p>
        </details>
      </section>
      <EditorialBanner
        image="/media/village-house.jpg"
        alt="Painted walls and decorated doorways of a house in Raghurajpur"
        eyebrow="BEYOND THE OBJECT"
        title="Some places stay with you."
        description="Step beyond the collection, into the colours, doorways, and artistic spirit that inspire it."
        href="/village"
        action="Discover the village"
        credit="SUMIT SURAI · CC BY-SA 4.0 · CROPPED"
      />
      <section className="handmade-note">
        <span className="handmade-mandala" aria-hidden="true" />
        <h2>Perfectly, beautifully imperfect.</h2>
        <p>
          A brushstroke, a texture, a subtle difference in colour.
          <br />
          Handmade pieces carry the character of the hands that make them.
        </p>
        <span
          className="handmade-mandala handmade-mandala-end"
          aria-hidden="true"
        />
      </section>
    </>
  );
}
