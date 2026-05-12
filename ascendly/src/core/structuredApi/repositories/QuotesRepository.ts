import {apiClient} from '@core/api';
import {BaseRepository} from './BaseRepository';
import {Quote} from '../models';

export class QuotesRepository extends BaseRepository {
  constructor() {
    super(apiClient);
  }

  async getRandomQuote(): Promise<Quote> {
    return this.get<Quote>('/api/random');
  }
}
