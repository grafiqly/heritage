import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { readLocal, seedProducts, seedOrders, artisans } from "./domain";
import type { Product, CartItem, Order, Address } from "./domain";
type Settings = { shipping: number; cod: boolean; pins: string };
type Store = {
  artisanProfiles: typeof artisans;
  setArtisanProfiles: (v: typeof artisans) => void;
  categories: string[];
  setCategories: (v: string[]) => void;
  products: Product[];
  setProducts: (v: Product[]) => void;
  cart: CartItem[];
  setCart: (v: CartItem[]) => void;
  orders: Order[];
  setOrders: (v: Order[]) => void;
  user: string;
  setUser: (v: string) => void;
  admin: boolean;
  setAdmin: (v: boolean) => void;
  addresses: Address[];
  setAddresses: (v: Address[]) => void;
  settings: Settings;
  setSettings: (v: Settings) => void;
  toast: string;
  notify: (s: string) => void;
};
const Context = createContext<Store | null>(null);
function usePersist<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, set] = useState(() => readLocal(key, initial));
  return [
    v,
    (next: T) => {
      set(next);
      localStorage.setItem(key, JSON.stringify(next));
    },
  ];
}
export function StoreProvider({ children }: { children: ReactNode }) {
  const [artisanProfiles, setArtisanProfiles] = usePersist(
    "rh-artisans",
    artisans,
  );
  const [categories, setCategories] = usePersist("rh-category-list", [
    "Pattachitra",
    "Palm leaf art",
    "Wood & papier-mâché",
  ]);
  const [products, setProducts] = usePersist("rh-products", seedProducts);
  const [cart, setCart] = usePersist<CartItem[]>("rh-cart", []);
  const [orders, setOrders] = usePersist("rh-orders", seedOrders);
  const [user, setUser] = usePersist("rh-user", "");
  const [admin, setAdmin] = useState(false);
  const [addressBook, setAddressBook] = usePersist<Record<string, Address[]>>(
    "rh-address-book",
    {},
  );
  const addresses = addressBook[user] || [];
  const setAddresses = (next: Address[]) =>
    setAddressBook({ ...addressBook, [user]: next });
  const [settings, setSettings] = usePersist<Settings>("rh-settings", {
    shipping: 9900,
    cod: true,
    pins: "",
  });
  const [toast, setToast] = useState("");
  function notify(s: string) {
    setToast(s);
    setTimeout(() => setToast(""), 3500);
  }
  return (
    <Context.Provider
      value={{
        artisanProfiles,
        setArtisanProfiles,
        categories,
        setCategories,
        products,
        setProducts,
        cart,
        setCart,
        orders,
        setOrders,
        user,
        setUser,
        admin,
        setAdmin,
        addresses,
        setAddresses,
        settings,
        setSettings,
        toast,
        notify,
      }}
    >
      {children}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </Context.Provider>
  );
}
export function useStore() {
  return useContext(Context)!;
}
