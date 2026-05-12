import {WeatherRepository} from '../repositories/WeatherRepository';
import {Weather} from '../models';

export class WeatherService {
  private repository: WeatherRepository;

  constructor() {
    this.repository = new WeatherRepository();
  }

  async fetchWeather(lat: number, lon: number): Promise<Weather> {
    try {
      return await this.repository.getCurrentWeather(lat, lon);
    } catch (error) {
      console.error('[WeatherService] Error fetching weather:', error);
      throw error;
    }
  }
}
