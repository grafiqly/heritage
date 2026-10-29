import { useSectionMotion } from "./hooks/useSectionMotion";
import { Arrival } from "./components/Arrival";
import React, { useEffect, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "./lib/store";
import { Header, Footer, Empty } from "./components/shared";
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() =>
  import("./pages/Shop").then((m) => ({ default: m.Shop })),
);
const ProductDetail = lazy(() =>
  import("./pages/Shop").then((m) => ({ default: m.ProductDetail })),
);
const Cart = lazy(() =>
  import("./pages/Commerce").then((m) => ({ default: m.Cart })),
);
const Auth = lazy(() =>
  import("./pages/Commerce").then((m) => ({ default: m.Auth })),
);
const Checkout = lazy(() =>
  import("./pages/Commerce").then((m) => ({ default: m.Checkout })),
);
const Account = lazy(() =>
  import("./pages/Commerce").then((m) => ({ default: m.Account })),
);
const OrderDetail = lazy(() =>
  import("./pages/Commerce").then((m) => ({ default: m.OrderDetail })),
);
const Editorial = lazy(() =>
  import("./pages/Editorial").then((m) => ({ default: m.Editorial })),
);
const Artisans = lazy(() =>
  import("./pages/Editorial").then((m) => ({ default: m.Artisans })),
);
const Supporting = lazy(() =>
  import("./pages/Editorial").then((m) => ({ default: m.Supporting })),
);
const Admin = lazy(() => import("./pages/Admin"));
import "./styles.css";
const client = new QueryClient();
function App() {
  useSectionMotion();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const admin = location.pathname.startsWith("/admin");
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {!admin && <Header />}
      <div id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="empty" role="status">
              A little patience. Your story is loading…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route
              path="/product/:id"
              element={<ProductDetail key={location.pathname} />}
            />
            {["village", "about", "crafts"].map((p) => (
              <Route key={p} path={`/${p}`} element={<Editorial />} />
            ))}
            <Route path="/artisans" element={<Artisans />} />
            <Route path="/artisans/:id" element={<Artisans />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<Account />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            {["contact", "shipping", "returns", "privacy", "terms"].map((p) => (
              <Route key={p} path={`/${p}`} element={<Supporting />} />
            ))}
            <Route
              path="/admin/*"
              element={
                <Suspense
                  fallback={<div className="empty">Opening the studio…</div>}
                >
                  <Admin />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Empty
                  title="A path less travelled."
                  body="This page doesn’t exist. Let’s find your way back to the collection."
                />
              }
            />
          </Routes>
        </Suspense>
      </div>
      {!admin && <Footer />}
    </>
  );
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Arrival>
        <StoreProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StoreProvider>
      </Arrival>
    </QueryClientProvider>
  </React.StrictMode>,
);
