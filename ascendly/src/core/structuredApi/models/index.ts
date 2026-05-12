export interface Quote {
  quote: string;
  author: string;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonDetail {
  name: string;
  height: number;
  weight: number;
  base_experience: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface Weather {
  latitude: number;
  longitude: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}
