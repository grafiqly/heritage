import { Modal } from "../components/Modal";
import { useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  ArrowUpRight,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useStore } from "../lib/store";
import { money, seedProducts, statuses, readLocal } from "../lib/domain";
import type { Product, Order, Status } from "../lib/domain";
const transition: Record<Status, Status[]> = {
  Placed: ["Confirmed", "Cancelled"],
  Confirmed: ["Packed", "Cancelled"],
  Packed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered", "Delivery Failed"],
  Delivered: ["Returned"],
  Cancelled: [],
  "Delivery Failed": ["Shipped", "Returned"],
  Returned: [],
};
export default function Admin() {
  const s = useStore();
  const artisans = s.artisanProfiles;
  const { pathname } = useLocation();
  const tab = pathname.split("/")[2] || "dashboard";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [payment, setPayment] = useState("");
  const [date, setDate] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [orderId, setOrderId] = useState("");
  const [customer, setCustomer] = useState("");
  const [suspended, setSuspended] = useState<string[]>(() =>
    readLocal("rh-suspended", []),
  );
  const [imageStatus, setImageStatus] = useState("");
  const [images, setImages] = useState<{ url: string; alt: string }[]>([]);
  const [content, setContent] = useState(() =>
    readLocal("rh-content", "A village shaped by art."),
  );
  const [categoryNames, setCategoryNames] = useState(() =>
    readLocal(
      "rh-categories",
      "Pattachitra, Palm leaf art, Wood & papier-mâché",
    ),
  );
  const selected = s.orders.find((o) => o.id === orderId);
  function changeOrder(next: Order) {
    s.setOrders(s.orders.map((o) => (o.id === next.id ? next : o)));
  }
  if (!s.admin)
    return (
      <main className="section narrow">
        <span className="eyebrow">DEMO ADMINISTRATION</span>
        <h1>The studio, behind the scenes.</h1>
        <p>
          This protected demo workspace uses a separate, session-only admin
          gate. It is not production authentication or authorization.
        </p>
        <button className="button primary" onClick={() => s.setAdmin(true)}>
          Enter demo administrator workspace <ArrowUpRight size={17} />
        </button>
      </main>
    );
  const delivered = s.orders.filter((o) => o.status === "Delivered");
  const orderValue = (o: Order) =>
    o.items.reduce((n, i) => n + i.price * i.quantity, o.shipping);
  const filteredOrders = s.orders.filter(
    (o) =>
      (o.id + " " + o.customer).toLowerCase().includes(search.toLowerCase()) &&
      (!filter || o.status === filter) &&
      (!payment || o.payment === payment) &&
      (!date || o.date.slice(0, 10) === date),
  );
  function tableOrders(orders: Order[]) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order / customer</th>
              <th>Date</th>
              <th>Fulfillment</th>
              <th>COD</th>
              <th>Amount due</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <strong>{o.id}</strong>
                  <small>{o.customer}</small>
                </td>
                <td>{new Date(o.date).toLocaleDateString("en-IN")}</td>
                <td>
                  <span className="status-badge">{o.status}</span>
                </td>
                <td>{o.payment}</td>
                <td>{money(orderValue(o))}</td>
                <td>
                  <button
                    className="text-link"
                    onClick={() => setOrderId(o.id)}
                  >
                    View ↗
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length && <p className="empty">No matching orders.</p>}
      </div>
    );
  }
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link className="brand" to="/">
          ✺{" "}
          <span>
            Heritage<small>STUDIO ADMIN</small>
          </span>
        </Link>
        {[
          [LayoutDashboard, "Overview", "dashboard"],
          [Package, "Products", "products"],
          [ShoppingBag, "Orders", "orders"],
          [Users, "Customers", "users"],
          [Settings, "Content & settings", "settings"],
        ].map(([Icon, label, path]) => {
          const I = Icon as typeof Search;
          return (
            <NavLink
              key={String(path)}
              to={`/admin/${path}`}
              onClick={() => {
                setFilter("");
                setSearch("");
              }}
            >
              <I size={18} />
              {String(label)}
            </NavLink>
          );
        })}
        <div className="admin-sidebar-bottom">
          <small>Demo mode · Local data only</small>
          <Link to="/">View storefront ↗</Link>
          <button className="text-link" onClick={() => s.setAdmin(false)}>
            Leave admin workspace
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-top">
          <span>RAGHURAJPUR / STUDIO</span>
          <span className="status-badge">Frontend demo</span>
        </div>
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR STORE, THOUGHTFULLY MANAGED</span>
            <h1>
              {(
                {
                  dashboard: "A view of the studio.",
                  products: "The collection.",
                  orders: "Every order, a story.",
                  users: "Your community.",
                  settings: "Make it your own.",
                } as Record<string, string>
              )[tab] || "Overview"}
            </h1>
          </div>
          {tab === "products" && (
            <button
              className="button primary"
              onClick={() => {
                setEditing({
                  ...seedProducts[0],
                  id: String(Date.now()),
                  name: "",
                  sku: "",
                  stock: 0,
                  published: false,
                });
                setImages([]);
              }}
            >
              <Plus size={16} /> Add product
            </button>
          )}
        </div>
        {tab === "dashboard" && (
          <>
            <div className="metrics">
              {[
                ["Total orders", s.orders.length],
                [
                  "Pending confirmation",
                  s.orders.filter((o) => o.status === "Placed").length,
                ],
                [
                  "Pending dispatch",
                  s.orders.filter((o) =>
                    ["Confirmed", "Packed"].includes(o.status),
                  ).length,
                ],
                [
                  "Delivered order value",
                  money(delivered.reduce((n, o) => n + orderValue(o), 0)),
                ],
                [
                  "COD collected",
                  money(
                    s.orders
                      .filter((o) => o.payment === "Collected")
                      .reduce((n, o) => n + orderValue(o), 0),
                  ),
                ],
                [
                  "COD outstanding (active)",
                  money(
                    s.orders
                      .filter(
                        (o) =>
                          o.payment === "Outstanding" &&
                          !["Cancelled", "Returned"].includes(o.status),
                      )
                      .reduce((n, o) => n + orderValue(o), 0),
                  ),
                ],
              ].map(([label, value]) => (
                <div className="metric" key={label}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                  <span>Local demo records</span>
                </div>
              ))}
            </div>
            <h2>Recent orders</h2>
            {tableOrders(s.orders.slice(0, 5))}
            <h2>Running low</h2>
            <div className="low-stock">
              {s.products
                .filter((p) => p.stock <= 2)
                .map((p) => (
                  <div key={p.id}>
                    <span>{p.name}</span>
                    <strong>{p.stock} remaining</strong>
                  </div>
                ))}
            </div>
          </>
        )}
        {tab === "products" && (
          <>
            <div className="catalogue-toolbar">
              <input
                aria-label="Search products"
                placeholder="Search by product name or SKU"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                aria-label="Publication filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All products</option>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Craft</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {s.products
                    .filter(
                      (p) =>
                        (p.name + p.sku)
                          .toLowerCase()
                          .includes(search.toLowerCase()) &&
                        (!filter || p.published === (filter === "Published")),
                    )
                    .map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="table-product">
                            <img src={p.image} alt="" />
                            <span>
                              {p.name}
                              <small>{p.sku}</small>
                            </span>
                          </div>
                        </td>
                        <td>{p.category}</td>
                        <td>{money(p.price)}</td>
                        <td>{p.stock}</td>
                        <td>
                          <span className="status-badge">
                            {p.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="text-link"
                            onClick={() => {
                              setEditing(p);
                              setImages(
                                p.media || [{ url: p.image, alt: p.name }],
                              );
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-link"
                            onClick={() => {
                              if (
                                confirm(
                                  `Archive ${p.name}? It will be hidden from the storefront.`,
                                )
                              ) {
                                s.setProducts(
                                  s.products.map((x) =>
                                    x.id === p.id
                                      ? { ...x, published: false }
                                      : x,
                                  ),
                                );
                                s.notify("Product archived.");
                              }
                            }}
                          >
                            Archive
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "orders" && (
          <>
            <div className="catalogue-toolbar">
              <input
                aria-label="Search orders"
                placeholder="Search order reference or customer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                aria-label="Fulfillment status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All fulfillment states</option>
                {statuses.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <select
                aria-label="Payment status"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option value="">All COD states</option>
                <option>Collected</option>
                <option>Outstanding</option>
              </select>
              <input
                aria-label="Order date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            {tableOrders(filteredOrders)}
          </>
        )}
        {tab === "users" && (
          <>
            <div className="notice">
              Demo customer operations. Privileged roles cannot be assigned from
              this interface.
            </div>
            <input
              aria-label="Search customers"
              placeholder="Search customers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Orders</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(
                    new Set([
                      ...s.orders.map((o) => o.customer),
                      "Sample Customer Two",
                      "Sample Customer Three",
                    ]),
                  )
                    .filter((c) =>
                      c.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((c) => (
                      <tr key={c}>
                        <td>{c}</td>
                        <td>
                          {s.orders.filter((o) => o.customer === c).length}
                        </td>
                        <td>
                          {suspended.includes(c) ? "Suspended" : "Active"}
                        </td>
                        <td>
                          <button
                            className="text-link"
                            onClick={() => setCustomer(c)}
                          >
                            Order history
                          </button>
                          <button
                            className="text-link"
                            onClick={() => {
                              if (
                                confirm(
                                  `${suspended.includes(c) ? "Reactivate" : "Suspend"} this demo customer?`,
                                )
                              ) {
                                const next = suspended.includes(c)
                                  ? suspended.filter((x) => x !== c)
                                  : [...suspended, c];
                                setSuspended(next);
                                localStorage.setItem(
                                  "rh-suspended",
                                  JSON.stringify(next),
                                );
                              }
                            }}
                          >
                            {suspended.includes(c) ? "Reactivate" : "Suspend"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {customer && (
              <>
                <h2>{customer} · Order history</h2>
                {tableOrders(s.orders.filter((o) => o.customer === customer))}
              </>
            )}
          </>
        )}
        {tab === "settings" && (
          <div className="settings-grid">
            <form
              className="panel stack"
              onSubmit={(e) => {
                e.preventDefault();
                s.notify("Demo shipping settings saved.");
              }}
            >
              <h2>Delivery & cash on delivery</h2>
              <label>
                Shipping charge (₹)
                <input
                  min="0"
                  type="number"
                  value={s.settings.shipping / 100}
                  onChange={(e) =>
                    s.setSettings({
                      ...s.settings,
                      shipping: Math.round(+e.target.value * 100),
                    })
                  }
                />
              </label>
              <label>
                Eligible PIN prefixes
                <input
                  value={s.settings.pins}
                  placeholder="All India, or 75, 76"
                  onChange={(e) =>
                    s.setSettings({ ...s.settings, pins: e.target.value })
                  }
                />
                <small>
                  Comma-separated prefixes. Empty means all valid Indian PINs in
                  demo mode.
                </small>
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={s.settings.cod}
                  onChange={(e) =>
                    s.setSettings({ ...s.settings, cod: e.target.checked })
                  }
                />{" "}
                Enable COD
              </label>
              <button className="button primary">Save delivery settings</button>
            </form>
            <form
              className="panel stack"
              onSubmit={(e) => {
                e.preventDefault();
                localStorage.setItem("rh-content", JSON.stringify(content));
                s.setCategories(
                  Array.from(
                    new Set([
                      ...s.categories,
                      ...categoryNames
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    ]),
                  ),
                );
                localStorage.setItem(
                  "rh-categories",
                  JSON.stringify(categoryNames),
                );
                s.notify(
                  "Editorial draft saved locally. Publication is awaiting business review.",
                );
              }}
            >
              <h2>Editorial draft</h2>
              <label>
                Homepage feature copy
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </label>
              <label>
                Add craft categories (comma separated)
                <input
                  value={categoryNames}
                  onChange={(e) => setCategoryNames(e.target.value)}
                />
              </label>
              <button className="button primary">Save content draft</button>
              <p>
                Demo artisan profiles:{" "}
                <Link to="/artisans">View directory ↗</Link>
              </p>
            </form>
            <div className="panel stack">
              <h2>Artisan profiles</h2>
              <p>
                Fictional demo biographies. Replace with approved artisan
                stories before launch.
              </p>
              {artisans.map((a, i) => (
                <details key={a.id}>
                  <summary>{a.name}</summary>
                  <div className="stack">
                    <label>
                      Name
                      <input
                        value={a.name}
                        onChange={(e) =>
                          s.setArtisanProfiles(
                            artisans.map((x, j) =>
                              i === j ? { ...x, name: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </label>
                    <label>
                      Craft specialty
                      <input
                        value={a.craft}
                        onChange={(e) =>
                          s.setArtisanProfiles(
                            artisans.map((x, j) =>
                              i === j ? { ...x, craft: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </label>
                    <label>
                      Biography
                      <textarea
                        value={a.bio}
                        onChange={(e) =>
                          s.setArtisanProfiles(
                            artisans.map((x, j) =>
                              i === j ? { ...x, bio: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </label>
                  </div>
                </details>
              ))}
              <button
                className="button outline"
                onClick={() =>
                  s.setArtisanProfiles([
                    ...artisans,
                    {
                      id: "artisan-" + Date.now(),
                      name: "New demo artisan",
                      craft: "Craft specialty",
                      bio: "Fictional demo biography. Owner confirmation required.",
                    },
                  ])
                }
              >
                Add artisan profile
              </button>
              <small>
                Edits save locally and appear in the public directory.
              </small>
            </div>
            <div className="panel">
              <h2>Heritage content draft</h2>
              <label>
                Village editorial copy
                <textarea
                  defaultValue={readLocal(
                    "rh-heritage",
                    "Our village journal is a work in progress.",
                  )}
                  onBlur={(e) => {
                    localStorage.setItem(
                      "rh-heritage",
                      JSON.stringify(e.target.value),
                    );
                    s.notify("Heritage draft saved locally.");
                  }}
                />
              </label>
              <p>Copy must be verified before publication.</p>
            </div>
            <div className="panel">
              <h2>Google integrations</h2>
              <p>
                <strong>Google Drive</strong> · Not connected
              </p>
              <p>
                <strong>Google Sheets</strong> · Not connected
              </p>
              <p>
                Backend setup begins after frontend approval. Sync controls
                simulate queue states only.
              </p>
              <button
                className="button outline"
                onClick={() =>
                  s.notify(
                    "Demo connection check failed: backend is not configured.",
                  )
                }
              >
                Check demo connection
              </button>
            </div>
            <div className="panel">
              <h2>Demo data</h2>
              <p>
                All changes stay in this browser. Products and orders are
                fictional.
              </p>
              <button
                className="button outline"
                onClick={() => {
                  if (
                    confirm("Reset all demo data, including cart and orders?")
                  ) {
                    Object.keys(localStorage)
                      .filter((k) => k.startsWith("rh-"))
                      .forEach((k) => localStorage.removeItem(k));
                    location.reload();
                  }
                }}
              >
                Reset demo
              </button>
            </div>
          </div>
        )}
        {editing && (
          <Modal label="Edit product" onClose={() => setEditing(null)}>
            <div className="section-heading">
              <h2>{editing.name || "A new piece"}</h2>
              <button
                className="icon"
                aria-label="Close editor"
                onClick={() => setEditing(null)}
              >
                <X />
              </button>
            </div>
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                if (images.some((i) => !i.alt.trim())) {
                  s.notify("Please add alt text to every image.");
                  return;
                }
                s.setProducts([
                  ...s.products.filter((p) => p.id !== editing.id),
                  {
                    ...editing,
                    image: images[0]?.url || editing.image,
                    media: images,
                  },
                ]);
                setEditing(null);
                s.notify("Product saved locally.");
              }}
            >
              <div className="form-grid">
                {(
                  ["name", "sku", "materials", "dimensions", "care"] as const
                ).map((key) => (
                  <label key={key}>
                    {key}
                    <input
                      required
                      value={editing[key]}
                      onChange={(e) =>
                        setEditing({ ...editing, [key]: e.target.value })
                      }
                    />
                  </label>
                ))}
                <label>
                  Slug
                  <input
                    required
                    pattern="[a-z0-9-]+"
                    value={
                      editing.slug ||
                      editing.name.toLowerCase().replaceAll(" ", "-") ||
                      "new-piece"
                    }
                    onChange={(e) =>
                      setEditing({ ...editing, slug: e.target.value })
                    }
                  />
                </label>
                <label>
                  Price (₹)
                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={editing.price / 100}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: Math.round(+e.target.value * 100),
                      })
                    }
                  />
                </label>
                <label>
                  Stock
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={editing.stock}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        stock: Math.max(0, Math.floor(+e.target.value)),
                      })
                    }
                  />
                </label>
                <label>
                  Category
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                  >
                    {[
                      "Pattachitra",
                      "Palm leaf art",
                      "Wood & papier-mâché",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Artisan
                  <select
                    value={editing.artisan}
                    onChange={(e) =>
                      setEditing({ ...editing, artisan: e.target.value })
                    }
                  >
                    {artisans.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Description
                <textarea
                  required
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </label>
              <label>
                Variants (comma separated)
                <input
                  value={editing.variants.join(",")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      variants: e.target.value ? e.target.value.split(",") : [],
                    })
                  }
                />
              </label>
              <label>
                Product images
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={async (e) => {
                    setImageStatus("Uploading preview…");
                    const files = Array.from(e.target.files || []);
                    if (
                      files.some(
                        (f) =>
                          f.size > 3 * 1024 * 1024 ||
                          !["image/jpeg", "image/png", "image/webp"].includes(
                            f.type,
                          ),
                      )
                    ) {
                      setImageStatus(
                        "Upload failed. Use JPEG, PNG or WebP up to 3 MB.",
                      );
                      return;
                    }
                    const next = await Promise.all(
                      files.map(
                        (file) =>
                          new Promise<{ url: string; alt: string }>(
                            (resolve) => {
                              const r = new FileReader();
                              r.onload = () =>
                                resolve({ url: String(r.result), alt: "" });
                              r.readAsDataURL(file);
                            },
                          ),
                      ),
                    );
                    setImages([...images, ...next]);
                    setImageStatus("Preview upload complete · Local demo only");
                  }}
                />
              </label>
              <p role="status">{imageStatus}</p>
              {images.map((img, i) => (
                <div className="image-editor" key={i}>
                  <img src={img.url} alt={img.alt} />
                  <label>
                    {i === 0 ? "Cover image" : "Image"} alt text
                    <input
                      required
                      value={img.alt}
                      onChange={(e) =>
                        setImages(
                          images.map((x, j) =>
                            j === i ? { ...x, alt: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() =>
                      setImages([img, ...images.filter((_, j) => j !== i)])
                    }
                  >
                    Make cover
                  </button>
                  <button
                    type="button"
                    className="icon"
                    aria-label="Remove image"
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) =>
                    setEditing({ ...editing, published: e.target.checked })
                  }
                />{" "}
                Published
              </label>
              <button className="button primary">Save product</button>
            </form>
          </Modal>
        )}
        {selected && (
          <Modal label="Order operations" onClose={() => setOrderId("")}>
            <div className="section-heading">
              <div>
                <span className="eyebrow">DEMO ORDER</span>
                <h2>{selected.id}</h2>
              </div>
              <button
                className="icon"
                aria-label="Close order"
                onClick={() => setOrderId("")}
              >
                <X />
              </button>
            </div>
            <p>
              {selected.customer} · {selected.address.phone}
            </p>
            <p>
              {selected.address.name}, {selected.address.line1},{" "}
              {selected.address.locality}, {selected.address.city},{" "}
              {selected.address.state} {selected.address.pin}
            </p>
            {selected.items.map((i, n) => (
              <div className="order-line" key={n}>
                <span>
                  {i.name} × {i.quantity}
                  <small>
                    {i.sku} · {i.variant || "Standard"} · Immutable unit price{" "}
                    {money(i.price)}
                  </small>
                </span>
                {money(i.price * i.quantity)}
              </div>
            ))}
            <p>
              Shipping {money(selected.shipping)} · Total{" "}
              <strong>{money(orderValue(selected))}</strong>
            </p>
            <label>
              Fulfillment status
              <select
                value={selected.status}
                onChange={(e) => {
                  const next = e.target.value as Status;
                  if (confirm(`Move order to ${next}?`))
                    changeOrder({
                      ...selected,
                      status: next,
                      history: [
                        ...selected.history,
                        `${next} · ${new Date().toLocaleString()}`,
                      ],
                    });
                }}
              >
                <option>{selected.status}</option>
                {transition[selected.status].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <p className="caption">
              Inventory is not automatically restocked on cancellation or return
              in this frontend demo.
            </p>
            <label>
              COD status
              <select
                value={selected.payment}
                onChange={(e) =>
                  changeOrder({
                    ...selected,
                    payment: e.target.value as Order["payment"],
                    history: [
                      ...selected.history,
                      `COD ${e.target.value} · ${new Date().toLocaleString()}`,
                    ],
                  })
                }
              >
                <option>Outstanding</option>
                <option>Collected</option>
              </select>
            </label>
            <div className="form-grid">
              {(["courier", "tracking", "trackingUrl"] as const).map((k) => (
                <label key={k}>
                  {k}
                  <input
                    type={k === "trackingUrl" ? "url" : "text"}
                    value={selected[k]}
                    onChange={(e) =>
                      changeOrder({ ...selected, [k]: e.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <label>
              Internal notes
              <textarea
                value={selected.notes}
                onChange={(e) =>
                  changeOrder({ ...selected, notes: e.target.value })
                }
              />
            </label>
            <p>
              Google Sheets sync: <strong>{selected.sync}</strong>
            </p>
            <button
              className="button outline"
              onClick={() => {
                changeOrder({ ...selected, sync: "Pending" });
                s.notify(
                  "Demo retry queued. No Google connection is configured.",
                );
              }}
            >
              Retry demo synchronization
            </button>
            <details open>
              <summary>Status history</summary>
              {selected.history.map((h, i) => (
                <p key={i}>{h}</p>
              ))}
            </details>
          </Modal>
        )}
      </main>
    </div>
  );
}
