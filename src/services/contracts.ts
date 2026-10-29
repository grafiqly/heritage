import type { Product, Order, Address, CartItem, Status } from "../lib/domain";
/** Backend adapter contracts. Stage 1 implements browser-local demonstrations only. */
export interface AuthService {
  signIn(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string }>;
  signOut(): Promise<void>;
  recover(email: string): Promise<void>;
}
export interface OrderService {
  listMine(): Promise<Order[]>;
  place(input: {
    items: CartItem[];
    address: Address;
    idempotencyKey: string;
  }): Promise<Order>;
  requestCancellation(id: string): Promise<void>;
}
export interface AdminService {
  saveProduct(product: Product): Promise<Product>;
  transitionOrder(id: string, status: Status): Promise<Order>;
  retrySync(id: string): Promise<void>;
}
export interface MediaService {
  upload(
    file: File,
    onProgress: (percent: number) => void,
  ): Promise<{ id: string; url: string; alt: string }>;
}
