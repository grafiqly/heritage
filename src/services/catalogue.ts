import { seedProducts } from "../lib/domain";
import type { Product } from "../lib/domain";
export interface CatalogueService {
  list(): Promise<Product[]>;
  save(product: Product): Promise<void>;
}
export class MockCatalogueService implements CatalogueService {
  async list() {
    await new Promise((r) => setTimeout(r, 250));
    return JSON.parse(
      localStorage.getItem("rh-products") || JSON.stringify(seedProducts),
    ) as Product[];
  }
  async save(product: Product) {
    const all = await this.list();
    localStorage.setItem(
      "rh-products",
      JSON.stringify([...all.filter((p) => p.id !== product.id), product]),
    );
  }
}
export const catalogueService = new MockCatalogueService();
