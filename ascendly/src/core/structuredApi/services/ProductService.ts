import {ProductRepository} from '../repositories/ProductRepository';
import {Product} from '../models';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async fetchProducts(): Promise<Product[]> {
    try {
      const response = await this.repository.getProducts();
      return response.products;
    } catch (error) {
      console.error('[ProductService] Error fetching products:', error);
      throw error;
    }
  }

  async fetchProductById(id: number): Promise<Product> {
    try {
      return await this.repository.getProductById(id);
    } catch (error) {
      console.error(`[ProductService] Error fetching product ${id}:`, error);
      throw error;
    }
  }
}
