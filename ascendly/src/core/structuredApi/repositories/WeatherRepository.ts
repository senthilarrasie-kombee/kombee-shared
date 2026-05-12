import {weatherClient} from '@core/api';
import {BaseRepository} from './BaseRepository';
import {Weather} from '../models';

export class WeatherRepository extends BaseRepository {
  constructor() {
    super(weatherClient);
  }

  async getCurrentWeather(lat: number, lon: number): Promise<Weather> {
    return this.get<Weather>(`/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
  }
}
