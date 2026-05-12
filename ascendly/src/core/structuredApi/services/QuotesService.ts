import {QuotesRepository} from '../repositories/QuotesRepository';
import {Quote} from '../models';

export class QuotesService {
  private repository: QuotesRepository;

  constructor() {
    this.repository = new QuotesRepository();
  }

  async fetchRandomQuote(): Promise<Quote> {
    try {
      return await this.repository.getRandomQuote();
    } catch (error) {
      console.error('[QuotesService] Error fetching quote:', error);
      throw error;
    }
  }
}
