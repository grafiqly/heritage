import { useState, useRef } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useParams,
  Navigate,
} from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Minus, Plus, Trash2, ArrowRight, Check, Package } from "lucide-react";
import { useStore } from "../lib/store";
import { money, defaultAddress, readLocal } from "../lib/domain";
import type { Address, Order } from "../lib/domain";
import { PageTitle, Empty } from "../components/shared";
export const addressSchema = z.object({
  name: z.string().trim().min(2, "Enter a recipient name"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  line1: z.string().trim().min(5, "Enter a complete street address"),
  line2: z.string(),
  locality: z.string().trim().min(2, "Enter your locality"),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().trim().min(2, "Enter your state"),
  pin: z.string().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code"),
});
export function Cart() {
  const { cart, setCart, products, settings } = useStore();
  const items = cart.map((c) => ({
    ...c,
    p: products.find((p) => p.id === c.productId),
  }));
  const subtotal = items.reduce(
    (s, c) => s + (c.p?.price || 0) * c.quantity,
    0,
  );
  if (!cart.length)
    return (
      <Empty
        title="Your bag is a blank canvas."
        body="A piece that speaks to you is waiting to be discovered."
      />
    );
  return (
    <main className="section">
      <PageTitle
        eyebrow="YOUR COLLECTION, IN THE MAKING"
        title="A few things to treasure."
      />
      <div className="checkout-layout">
        <div>
          {items.map((c, i) => (
            <article className="cart-item" key={`${c.productId}-${c.variant}`}>
              <img src={c.p?.image} alt={c.p?.name || "Unavailable product"} />
              <div>
                <small>{c.p?.category}</small>
                <h3>
                  <Link to={`/product/${c.productId}`}>
                    {c.p?.name || "Removed product"}
                  </Link>
                </h3>
                <p>
                  {c.variant || "Standard"} · {money(c.p?.price || 0)}
                </p>
                <div className="quantity">
                  <button
                    aria-label="Reduce quantity"
                    disabled={c.quantity <= 1}
                    onClick={() =>
                      setCart(
                        cart.map((x, j) =>
                          j === i ? { ...x, quantity: x.quantity - 1 } : x,
                        ),
                      )
                    }
                  >
                    <Minus size={14} />
                  </button>
                  {c.quantity}
                  <button
                    aria-label="Increase quantity"
                    disabled={
                      cart
                        .filter((x) => x.productId === c.productId)
                        .reduce((n, x) => n + x.quantity, 0) >=
                      (c.p?.stock || 0)
                    }
                    onClick={() =>
                      setCart(
                        cart.map((x, j) =>
                          j === i ? { ...x, quantity: x.quantity + 1 } : x,
                        ),
                      )
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {(!c.p?.published || c.quantity > (c.p?.stock || 0)) && (
                  <p className="error">
                    This item is unavailable or exceeds current stock. Please
                    remove it.
                  </p>
                )}
              </div>
              <div>
                <strong>{money((c.p?.price || 0) * c.quantity)}</strong>
                <button
                  className="icon"
                  aria-label={`Remove ${c.p?.name}`}
                  onClick={() => setCart(cart.filter((_, j) => j !== i))}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
        <aside className="summary-card">
          <h2>Your order</h2>
          <div>
            <span>Subtotal</span>
            {money(subtotal)}
          </div>
          <div>
            <span>Estimated shipping</span>
            {money(settings.shipping)}
          </div>
          <div className="total">
            <span>Estimated total</span>
            {money(subtotal + settings.shipping)}
          </div>
          <Link className="button primary" to="/checkout">
            Continue to checkout <ArrowRight size={16} />
          </Link>
          <p>
            Cash on delivery · India only
            <br />
            Demo checkout. No real order will be sent.
          </p>
        </aside>
      </div>
    </main>
  );
}
export function Auth() {
  const { setUser, setAdmin } = useStore();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mode = params.get("mode") || "signin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  return (
    <main className="auth-wrap">
      <div className="auth-art">
        <span className="eyebrow">A PLACE FOR THINGS WITH SOUL</span>
        <h2>
          A little heritage.
          <br />
          <em>A little closer.</em>
        </h2>
        <span className="ornament">✳</span>
      </div>
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === "recover") {
            setMessage("Demo recovery request received. No email was sent.");
            return;
          }
          setUser(email);
          if (params.get("next") === "/admin") setAdmin(true);
          navigate(params.get("next") || "/account");
        }}
      >
        <span className="eyebrow">WELCOME TO THE VILLAGE</span>
        <h1>
          {mode === "recover"
            ? "A fresh beginning."
            : mode === "signup"
              ? "Make yourself at home."
              : "Good to see you again."}
        </h1>
        <p className="notice">
          Demo authentication only. Use a sample email and a made-up password.
          No credentials are sent to a server.
        </p>
        <label>
          Email address
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        {mode !== "recover" && (
          <label>
            Demo password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <small>At least 8 characters. Never use a real password.</small>
          </label>
        )}
        <button className="button primary">
          {mode === "recover"
            ? "Preview recovery"
            : mode === "signup"
              ? "Create demo account"
              : "Sign in to demo"}{" "}
          <ArrowRight size={16} />
        </button>
        {message && <p role="status">{message}</p>}
        <Link to="/auth?mode=recover">Forgot password?</Link>
        <Link to={mode === "signup" ? "/auth" : "/auth?mode=signup"}>
          {mode === "signup"
            ? "Already have a demo account? Sign in"
            : "New here? Create a demo account"}
        </Link>
      </form>
    </main>
  );
}
export function Checkout() {
  const store = useStore();
  const { user, cart, products, settings, addresses } = store;
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const submissionLock = useRef(false);
  const [failure, setFailure] = useState("");
  const [fail, setFail] = useState(false);
  const form = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      phone: "",
      line1: "",
      line2: "",
      locality: "",
      city: "",
      state: "Odisha",
      pin: "",
    },
  });
  const pin = useWatch({ control: form.control, name: "pin" });
  if (!user) return <Navigate to="/auth?next=/checkout" replace />;
  if (!cart.length)
    return (
      <Empty
        title="Your bag is empty"
        body="Choose a piece before checking out."
      />
    );
  const subtotal = cart.reduce(
    (n, c) =>
      n + (products.find((p) => p.id === c.productId)?.price || 0) * c.quantity,
    0,
  );
  const eligible =
    settings.cod &&
    (!settings.pins ||
      settings.pins.split(",").some((p) => pin.startsWith(p.trim())));
  async function submit(address: Address) {
    if (submissionLock.current) return;
    setFailure("");
    if (readLocal<string[]>("rh-suspended", []).includes(user)) {
      setFailure("This demo account is suspended. Contact the administrator.");
      return;
    }
    if (!eligible) {
      setFailure("Cash on delivery is not available for this PIN code.");
      return;
    }
    if (
      cart.some((c) => {
        const p = products.find((p) => p.id === c.productId);
        return (
          !p?.published ||
          cart
            .filter((x) => x.productId === c.productId)
            .reduce((n, x) => n + x.quantity, 0) > p.stock
        );
      })
    ) {
      setFailure("Stock has changed. Please review your bag.");
      return;
    }
    submissionLock.current = true;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    if (fail) {
      submissionLock.current = false;
      setBusy(false);
      setFailure(
        "Demo order could not be placed. Your bag is saved. Please try again.",
      );
      return;
    }
    const order: Order = {
      id: `RH-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      date: new Date().toISOString(),
      customer: user,
      items: cart.map((c) => {
        const p = products.find((p) => p.id === c.productId)!;
        return {
          name: p.name,
          sku: p.sku,
          price: p.price,
          quantity: c.quantity,
          variant: c.variant,
        };
      }),
      address,
      shipping: settings.shipping,
      status: "Placed",
      payment: "Outstanding",
      tracking: "",
      courier: "",
      trackingUrl: "",
      notes: "",
      history: ["Placed · " + new Date().toLocaleString()],
      sync: "Pending",
    };
    store.setOrders([order, ...store.orders]);
    store.setProducts(
      products.map((p) => ({
        ...p,
        stock:
          p.stock -
          cart
            .filter((c) => c.productId === p.id)
            .reduce((n, c) => n + c.quantity, 0),
      })),
    );
    store.setAddresses([
      ...addresses.filter((a) => a.line1 !== address.line1),
      address,
    ]);
    store.setCart([]);
    navigate(`/order/${order.id}?confirmed=1`);
  }
  return (
    <main className="section">
      <PageTitle
        eyebrow="THE LAST LITTLE STEP"
        title="From our demo village to you."
      />
      <div className="notice">
        Demo order placement. No real order, payment, or delivery is initiated.
      </div>
      <form
        className="checkout-layout"
        onSubmit={(event) => {
          void form.handleSubmit(submit)(event);
        }}
      >
        <div>
          <h2>Delivery details</h2>
          {addresses.length > 0 && (
            <label>
              Saved address
              <select
                onChange={(e) =>
                  e.target.value && form.reset(addresses[+e.target.value])
                }
              >
                <option value="">Use a new address</option>
                {addresses.map((a, i) => (
                  <option key={i} value={i}>
                    {a.name} · {a.line1}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="form-grid">
            {Object.entries({
              name: "Recipient name",
              phone: "Mobile number",
              line1: "Address line 1",
              line2: "Address line 2 (optional)",
              locality: "Locality",
              city: "City",
              state: "State",
              pin: "PIN code",
            }).map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  {...form.register(key as keyof Address)}
                  autoComplete={
                    key === "pin"
                      ? "postal-code"
                      : key === "phone"
                        ? "tel"
                        : "off"
                  }
                />
                {form.formState.errors[key as keyof Address] && (
                  <span className="error">
                    {form.formState.errors[key as keyof Address]?.message}
                  </span>
                )}
              </label>
            ))}
          </div>
          {pin.length === 6 && (
            <p className={eligible ? "success" : "error"}>
              {eligible
                ? "✓ Delivery is available for this PIN code (demo rule)."
                : "Delivery is unavailable for this PIN code."}
            </p>
          )}
          <h2>Payment</h2>
          <div className="payment-choice">
            <Check size={17} /> Cash on delivery{" "}
            <span>Pay when your piece arrives</span>
          </div>
          <details>
            <summary>Demo testing options</summary>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={fail}
                onChange={(e) => setFail(e.target.checked)}
              />{" "}
              Simulate order failure
            </label>
            <button
              type="button"
              className="text-link"
              onClick={() => form.reset(defaultAddress)}
            >
              Fill sample address
            </button>
          </details>
        </div>
        <aside className="summary-card">
          <h2>In your bag</h2>
          {cart.map((c) => (
            <div key={c.productId + c.variant}>
              <span>
                {products.find((p) => p.id === c.productId)?.name} ×{" "}
                {c.quantity}
                <small>{c.variant}</small>
              </span>
              {money(
                (products.find((p) => p.id === c.productId)?.price || 0) *
                  c.quantity,
              )}
            </div>
          ))}
          <div>
            <span>Subtotal</span>
            {money(subtotal)}
          </div>
          <div>
            <span>Shipping</span>
            {money(settings.shipping)}
          </div>
          <div className="total">
            <span>COD amount due</span>
            {money(subtotal + settings.shipping)}
          </div>
          {failure && (
            <p role="alert" className="error">
              {failure}
            </p>
          )}
          <button disabled={busy || !eligible} className="button primary">
            {busy ? "Placing demo order…" : "Place COD Order"}{" "}
            <ArrowRight size={16} />
          </button>
          <small>
            By continuing, you agree to the draft <Link to="/terms">terms</Link>
            .
          </small>
        </aside>
      </form>
    </main>
  );
}
export function OrderDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { orders, user, setOrders, notify } = useStore();
  if (!user) return <Navigate to={`/auth?next=/order/${id}`} />;
  const order = orders.find((o) => o.id === id && o.customer === user);
  if (!order)
    return (
      <Empty
        title="Order not found"
        body="Sign in with the demo account that placed this order."
      />
    );
  const total = order.items.reduce(
    (n, i) => n + i.price * i.quantity,
    order.shipping,
  );
  return (
    <main className="section narrow">
      <PageTitle
        eyebrow={params.has("confirmed") ? "DEMO ORDER PLACED" : "YOUR ORDER"}
        title={
          params.has("confirmed") ? "Something to look forward to." : order.id
        }
      >
        <p>
          {order.id} · {new Date(order.date).toLocaleDateString("en-IN")} · Demo
          only
        </p>
      </PageTitle>
      <div className="notice">
        This is a locally saved demo order. No real business has received it.
      </div>
      <div className="timeline">
        {["Placed", "Confirmed", "Packed", "Shipped", "Delivered"].map(
          (s, i) => (
            <div
              key={s}
              className={
                [
                  "Placed",
                  "Confirmed",
                  "Packed",
                  "Shipped",
                  "Delivered",
                ].indexOf(order.status) >= i
                  ? "done"
                  : ""
              }
            >
              <span>
                {i === 0 ? <Check size={15} /> : <Package size={15} />}
              </span>
              <small>{s}</small>
            </div>
          ),
        )}
      </div>
      <p>
        Fulfillment: <strong>{order.status}</strong> · COD: {order.payment}
      </p>
      {order.items.map((i, n) => (
        <div className="order-line" key={n}>
          <span>
            {i.name} · {i.variant} × {i.quantity}
            <small>
              {i.sku} · Purchase price {money(i.price)}
            </small>
          </span>
          <strong>{money(i.price * i.quantity)}</strong>
        </div>
      ))}
      <div className="two-columns">
        <div>
          <h3>Delivery address</h3>
          <p>
            {order.address.name}
            <br />
            {order.address.line1}, {order.address.line2}
            <br />
            {order.address.locality}, {order.address.city}
            <br />
            {order.address.state} {order.address.pin}
            <br />
            {order.address.phone}
          </p>
        </div>
        <div>
          <h3>
            COD amount {order.payment === "Collected" ? "collected" : "due"}
          </h3>
          <h2>{money(total)}</h2>
          <p>Includes shipping: {money(order.shipping)}</p>
          {order.tracking && (
            <p>
              {order.courier}: {order.tracking}{" "}
              {/^https?:\/\//.test(order.trackingUrl) && (
                <a href={order.trackingUrl} target="_blank" rel="noreferrer">
                  Track shipment ↗
                </a>
              )}
            </p>
          )}
        </div>
      </div>
      <details>
        <summary>Order history</summary>
        {order.history.map((h, i) => (
          <p key={i}>{h}</p>
        ))}
      </details>
      {["Placed", "Confirmed"].includes(order.status) && (
        <button
          className="button outline"
          onClick={() => {
            if (window.confirm("Request cancellation for this demo order?")) {
              setOrders(
                orders.map((o) =>
                  o.id === id
                    ? {
                        ...o,
                        notes: o.notes + " Customer requested cancellation.",
                        history: [
                          ...o.history,
                          "Cancellation requested · " +
                            new Date().toLocaleString(),
                        ],
                      }
                    : o,
                ),
              );
              notify("Cancellation request recorded for admin review.");
            }
          }}
        >
          Request cancellation
        </button>
      )}
      <Link className="text-link" to="/account">
        Back to your account <ArrowRight size={16} />
      </Link>
    </main>
  );
}
export function Account() {
  const { user, setUser, orders, addresses, setAddresses } = useStore();
  if (!user) return <Navigate to="/auth" />;
  return (
    <main className="section">
      <PageTitle eyebrow="YOUR OWN LITTLE CORNER" title="Welcome home.">
        <p>{user} · Demo account</p>
      </PageTitle>
      <button className="button outline" onClick={() => setUser("")}>
        Sign out
      </button>
      <div className="two-columns">
        <div>
          <h2>Your orders</h2>
          {orders.filter((o) => o.customer === user).length ? (
            orders
              .filter((o) => o.customer === user)
              .map((o) => (
                <Link className="order-line" key={o.id} to={`/order/${o.id}`}>
                  <span>
                    {o.id}
                    <small>{new Date(o.date).toLocaleDateString()}</small>
                  </span>
                  <span>{o.status} ↗</span>
                </Link>
              ))
          ) : (
            <p>
              Your first story is still to come.{" "}
              <Link to="/shop">Explore the collection.</Link>
            </p>
          )}
        </div>
        <div>
          <h2>Saved addresses</h2>
          {addresses.map((a, i) => (
            <div className="address-card" key={i}>
              <strong>{a.name}</strong>
              <p>
                {a.line1}, {a.locality}
                <br />
                {a.city}, {a.state} {a.pin}
              </p>
              <button
                className="text-link"
                onClick={() =>
                  setAddresses(addresses.filter((_, j) => j !== i))
                }
              >
                Remove address
              </button>
            </div>
          ))}
          <p>Addresses can be added or updated during checkout.</p>
        </div>
      </div>
    </main>
  );
}
