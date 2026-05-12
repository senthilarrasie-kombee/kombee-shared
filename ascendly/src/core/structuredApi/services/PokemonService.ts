import {PokemonRepository} from '../repositories/PokemonRepository';
import {Pokemon, PokemonDetail} from '../models';

export class PokemonService {
  private repository: PokemonRepository;

  constructor() {
    this.repository = new PokemonRepository();
  }

  async fetchPokemonList(limit?: number): Promise<Pokemon[]> {
    try {
      const response = await this.repository.getPokemonList(limit);
      return response.results;
    } catch (error) {
      console.error('[PokemonService] Error fetching pokemon list:', error);
      throw error;
    }
  }

  async fetchPokemonDetail(name: string): Promise<PokemonDetail> {
    try {
      return await this.repository.getPokemonByName(name);
    } catch (error) {
      console.error(`[PokemonService] Error fetching pokemon ${name}:`, error);
      throw error;
    }
  }
}
