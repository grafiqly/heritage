import { Modal } from "../components/Modal";
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  SlidersHorizontal,
  X,
  ArrowRight,
  Minus,
  Plus,
  ZoomIn,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useStore } from "../lib/store";
import { money } from "../lib/domain";
import { catalogueService } from "../services/catalogue";
import { ProductCard, PageTitle, Empty } from "../components/shared";
export function Shop() {
  const { products, artisanProfiles: artisans, categories } = useStore();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");
  const [artisan, setArtisan] = useState("");
  const [available, setAvailable] = useState(false);
  const [max, setMax] = useState("");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);
  const [simulate, setSimulate] = useState("");
  const query = useQuery({
    queryKey: ["catalogue"],
    queryFn: () => catalogueService.list(),
    retry: 0,
  });
  const active = !!(category || artisan || available || max || search);
  const filtered = products
    .filter(
      (p) =>
        p.published &&
        (!category || p.category === category) &&
        (!artisan || p.artisan === artisan) &&
        (!available || p.stock > 0) &&
        (!max || p.price <= +max * 100) &&
        `${p.name} ${p.description}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : +b.id - +a.id,
    );
  function clear() {
    setCategory("");
    setArtisan("");
    setAvailable(false);
    setMax("");
    setSearch("");
    setParams({});
    setPage(1);
  }
  return (
    <main className="section shop">
      <PageTitle eyebrow="THE COLLECTION" title="Made slowly. Kept forever.">
        <p>Discover pieces inspired by the art and spirit of Raghurajpur.</p>
      </PageTitle>
      <div className="catalogue-toolbar">
        <input
          aria-label="Search products"
          placeholder="Search for something meaningful…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button className="button outline" onClick={() => setDrawer(!drawer)}>
          <SlidersHorizontal size={16} /> Filters
        </button>
        <select
          aria-label="Sort products"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="new">Newest additions</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
      <div className="catalogue-layout">
        <aside className={`filters ${drawer ? "visible" : ""}`}>
          <div className="section-heading">
            <h3>Refine the collection</h3>
            <button
              className="icon"
              aria-label="Close filters"
              onClick={() => setDrawer(false)}
            >
              <X size={17} />
            </button>
          </div>
          <label>
            Craft
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All crafts</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Artisan
            <select
              value={artisan}
              onChange={(e) => {
                setArtisan(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All artisans</option>
              {artisans.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Maximum price (₹)
            <input
              type="number"
              min="0"
              value={max}
              onChange={(e) => {
                setMax(e.target.value);
                setPage(1);
              }}
              placeholder="Any price"
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => {
                setAvailable(e.target.checked);
                setPage(1);
              }}
            />{" "}
            Available pieces only
          </label>
          {active && (
            <button className="text-link" onClick={clear}>
              Clear all filters <X size={14} />
            </button>
          )}
          <details>
            <summary>Demo state preview</summary>
            <select
              aria-label="Preview catalogue state"
              value={simulate}
              onChange={(e) => setSimulate(e.target.value)}
            >
              <option value="">Normal</option>
              <option>Loading</option>
              <option>Error</option>
              <option>Empty</option>
            </select>
          </details>
        </aside>
        <div>
          <div className="results-line">
            <span>{filtered.length} considered pieces</span>
            {active && (
              <button className="filter-chip" onClick={clear}>
                {category || "Filters applied"} <X size={12} />
              </button>
            )}
          </div>
          {query.isLoading || simulate === "Loading" ? (
            <div className="product-grid catalogue-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" />
              ))}
            </div>
          ) : query.isError || simulate === "Error" ? (
            <div className="empty">
              <h2>The collection couldn’t load.</h2>
              <p>Your selections are saved. Please try again.</p>
              <button
                className="button primary"
                onClick={() => {
                  setSimulate("");
                  void query.refetch();
                }}
              >
                Try again
              </button>
            </div>
          ) : !filtered.length || simulate === "Empty" ? (
            <Empty
              title="A little more to discover."
              body="No pieces match these filters. Clear your selections to explore again."
            />
          ) : (
            <>
              <div className="product-grid catalogue-grid">
                {filtered.slice((page - 1) * 9, page * 9).map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
              <div className="pagination">
                {Array.from(
                  { length: Math.ceil(filtered.length / 9) },
                  (_, i) => (
                    <button
                      className={page === i + 1 ? "selected" : ""}
                      key={i}
                      aria-label={`Page ${i + 1}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
export function ProductDetail() {
  const { id } = useParams();
  const {
    products,
    cart,
    setCart,
    notify,
    settings,
    artisanProfiles: artisans,
  } = useStore();
  const p = products.find((p) => p.id === id && p.published);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState("");
  const [zoom, setZoom] = useState(false);
  const [image, setImage] = useState(0);
  if (!p)
    return (
      <Empty
        title="Piece not found"
        body="This piece is no longer in the collection."
      />
    );
  const artisan = artisans.find((a) => a.id === p.artisan);
  const gallery = p.media?.length
    ? p.media
    : [
        { url: p.image, alt: p.name },
        { url: p.image, alt: p.name + " detail" },
      ];
  function add() {
    if (!p) return;
    const existing = cart.find(
      (c) => c.productId === p.id && c.variant === variant,
    );
    const total = cart
      .filter((c) => c.productId === p.id)
      .reduce((n, c) => n + c.quantity, 0);
    if (total + qty > p.stock) {
      notify("The selected quantity exceeds available stock.");
      return;
    }
    setCart(
      existing
        ? cart.map((c) =>
            c === existing ? { ...c, quantity: c.quantity + qty } : c,
          )
        : [...cart, { productId: p.id, quantity: qty, variant }],
    );
    notify("A little heritage, added to your bag.");
  }
  return (
    <main className="section">
      <div className="breadcrumbs">
        <Link to="/shop">Collection</Link> / {p.category} / {p.name}
      </div>
      <div className="product-detail">
        <div>
          <button
            className="detail-photo"
            onClick={() => setZoom(true)}
            aria-label="Zoom product image"
          >
            <img
              style={{ objectPosition: image ? "bottom" : "center" }}
              src={gallery[image]?.url || p.image}
              alt={gallery[image]?.alt || p.name}
            />
            <ZoomIn />
          </button>
          <div className="thumbnails">
            {gallery.map((g, i) => (
              <button
                key={i}
                aria-label={`View ${i + 1}`}
                className={image === i ? "selected" : ""}
                onClick={() => setImage(i)}
              >
                <img src={g.url} alt={g.alt} />
              </button>
            ))}
          </div>
          <small>
            Illustrative placeholder photography, not actual product imagery.
          </small>
        </div>
        <div className="product-info">
          <span className="eyebrow">{p.category} · DEMO PIECE</span>
          <h1>{p.name}</h1>
          <Link className="text-link" to={`/artisans/${p.artisan}`}>
            By {artisan?.name} <ArrowRight size={14} />
          </Link>
          <div className="detail-price">{money(p.price)}</div>
          <p>{p.description}</p>
          <p className="stock">
            {p.stock === 1
              ? "One of a kind · Only 1 available"
              : p.stock
                ? `${p.stock} pieces available`
                : "Currently unavailable"}
          </p>
          {p.variants.length > 0 && (
            <label>
              Choose a size
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
              >
                <option value="">Select size</option>
                {p.variants.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
              <small>Demo sizes share the displayed price and stock.</small>
            </label>
          )}
          <div className="add-row">
            <div className="quantity">
              <button
                aria-label="Reduce quantity"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <Minus size={14} />
              </button>
              <span>{qty}</span>
              <button
                aria-label="Increase quantity"
                disabled={qty >= p.stock}
                onClick={() => setQty(qty + 1)}
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              className="button primary"
              disabled={!p.stock || (p.variants.length > 0 && !variant)}
              onClick={add}
            >
              Add to bag <ArrowRight size={16} />
            </button>
          </div>
          <div className="delivery-note">
            {settings.cod
              ? "Cash on delivery available"
              : "COD currently unavailable"}{" "}
            · Shipping {money(settings.shipping)}
            <br />
            <small>Eligibility confirmed with your PIN code at checkout.</small>
          </div>
          {[
            [
              "The details",
              `Materials: ${p.materials}. Dimensions: ${p.dimensions}. SKU: ${p.sku}`,
            ],
            ["Care for your piece", p.care],
            [
              "The beauty of handmade",
              "Small variations in colour, line, and texture are part of the handmade process. Demo specifications require owner confirmation.",
            ],
          ].map(([title, body]) => (
            <details key={title}>
              <summary>{title}</summary>
              <p>{body}</p>
            </details>
          ))}
        </div>
      </div>
      <div className="section-heading related">
        <h2>A few kindred pieces.</h2>
        <Link to="/shop" className="text-link">
          View collection ↗
        </Link>
      </div>
      <div className="product-grid">
        {products
          .filter((x) => x.id !== id && x.published)
          .slice(0, 4)
          .map((p) => (
            <ProductCard p={p} key={p.id} />
          ))}
      </div>
      {zoom && (
        <Modal label="Product image zoom" onClose={() => setZoom(false)}>
          <button
            autoFocus
            className="button outline"
            onClick={() => setZoom(false)}
          >
            Close <X size={18} />
          </button>
          <img
            className="zoom-image"
            src={gallery[image]?.url || p.image}
            alt={gallery[image]?.alt || p.name}
          />
        </Modal>
      )}
    </main>
  );
}
