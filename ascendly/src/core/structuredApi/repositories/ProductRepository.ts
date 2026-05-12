import {dummyJsonClient} from '@core/api';
import {BaseRepository} from './BaseRepository';
import {Product} from '../models';

export class ProductRepository extends BaseRepository {
  constructor() {
    super(dummyJsonClient);
  }

  async getProducts(): Promise<{products: Product[]}> {
    return this.get<{products: Product[]}>('/products');
  }

  async getProductById(id: number): Promise<Product> {
    return this.get<Product>(`/products/${id}`);
  }
}
