export const BRAND = "Raghurajpur Heritage";
export type Product = {
  id: string;
  name: string;
  category: string;
  artisan: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  materials: string;
  dimensions: string;
  care: string;
  published: boolean;
  sku: string;
  variants: string[];
  slug?: string;
  media?: { url: string; alt: string }[];
};
export type CartItem = { productId: string; quantity: number; variant: string };
export type Address = {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  locality: string;
  city: string;
  state: string;
  pin: string;
};
export const statuses = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Delivery Failed",
  "Returned",
] as const;
export type Status = (typeof statuses)[number];
export type Order = {
  id: string;
  date: string;
  customer: string;
  items: {
    name: string;
    sku: string;
    price: number;
    quantity: number;
    variant: string;
  }[];
  address: Address;
  shipping: number;
  status: Status;
  payment: "Outstanding" | "Collected";
  tracking: string;
  courier: string;
  trackingUrl: string;
  notes: string;
  history: string[];
  sync: "Pending" | "Failed" | "Synced";
};
export const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n / 100);
export const photos = {
  hero: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Raghurajpur_10.jpg/1280px-Raghurajpur_10.jpg",
  village:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Raghurajpur_-_Decorated_Village_House.jpg/1280px-Raghurajpur_-_Decorated_Village_House.jpg",
  art: "/media/pattachitra-art.jpg",
  pot: "/media/wooden-toys.jpg",
  textile: "/media/pattachitra-studio.jpg",
  wood: "/media/palm-leaf-craft.jpg",
};
export const artisans = [
  {
    id: "madhab",
    name: "Madhab Maharana",
    craft: "Pattachitra painting",
    bio: "A fictional artisan profile exploring delicate linework, natural palettes, and storytelling through painting.",
  },
  {
    id: "lalita",
    name: "Lalita Das",
    craft: "Palm leaf engraving",
    bio: "A fictional craftsperson whose sample work pairs fine etched patterns with stories drawn from everyday life.",
  },
  {
    id: "bikash",
    name: "Bikash Sahoo",
    craft: "Wood & papier-mâché",
    bio: "A fictional maker exploring sculptural forms and hand-painted surfaces.",
  },
];
const names = [
  "The Lotus Garden",
  "Stories of the Sacred",
  "Palm Leaf Reverie",
  "The Painted Tusker",
  "A Circle of Joy",
  "Forest in Bloom",
  "The Little Storyteller",
  "Rhythm of the Village",
  "Indigo Reverie",
  "The Golden Fish",
  "Songs of the Earth",
  "A Heritage Keepsake",
];
export const seedProducts: Product[] = names.map((name, i) => ({
  id: String(i + 1),
  name,
  category: [
    "Pattachitra",
    "Pattachitra",
    "Palm leaf art",
    "Wood & papier-mâché",
  ][i % 4],
  artisan: artisans[i % 3].id,
  price: [280000, 420000, 160000, 95000, 320000, 180000][i % 6],
  stock: i === 2 ? 1 : i === 7 ? 0 : 6 + i,
  image: [photos.art, photos.textile, photos.wood, photos.pot][i % 4],
  description:
    "A considered piece for a meaningful home. This fictional demo product illustrates the collection; photography is an illustrative placeholder and does not depict the actual craft.",
  materials:
    i % 2 ? "Painted wood, pigments" : "Cloth, prepared surface, pigments",
  dimensions: "30 × 40 cm (illustrative)",
  care: "Keep dry and away from direct sunlight. Dust gently with a soft cloth.",
  published: true,
  sku: `RH-${String(i + 1).padStart(3, "0")}`,
  variants: i % 3 === 0 ? ["Small", "Large"] : [],
}));
export function readLocal<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
export const defaultAddress: Address = {
  name: "Aarav Das",
  phone: "9876543210",
  line1: "12, Sample Lane",
  line2: "",
  locality: "Bali Sahi",
  city: "Puri",
  state: "Odisha",
  pin: "752001",
};
export const seedOrders: Order[] = ["Placed", "Packed", "Delivered"].map(
  (status, i) => ({
    id: `RH-100${i + 1}`,
    date: new Date(2026, 9, 25 + i).toISOString(),
    customer: "Demo Customer",
    items: [
      {
        name: names[i],
        sku: `RH-00${i + 1}`,
        price: seedProducts[i].price,
        quantity: 1,
        variant: "",
      },
    ],
    address: defaultAddress,
    shipping: 9900,
    status: status as Status,
    payment: i === 2 ? "Collected" : "Outstanding",
    tracking: "",
    courier: "",
    trackingUrl: "",
    notes: "",
    history: [`Placed · ${new Date(2026, 9, 25 + i).toLocaleDateString()}`],
    sync: i === 1 ? "Failed" : "Pending",
  }),
);
