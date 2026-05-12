import {pokemonClient} from '@core/api';
import {BaseRepository} from './BaseRepository';
import {Pokemon, PokemonDetail} from '../models';

export class PokemonRepository extends BaseRepository {
  constructor() {
    super(pokemonClient);
  }

  async getPokemonList(limit: number = 20): Promise<{results: Pokemon[]}> {
    return this.get<{results: Pokemon[]}>(`/pokemon?limit=${limit}`);
  }

  async getPokemonByName(name: string): Promise<PokemonDetail> {
    return this.get<PokemonDetail>(`/pokemon/${name}`);
  }
}
