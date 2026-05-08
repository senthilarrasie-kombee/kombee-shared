import axios from 'axios';
import { Alert } from 'react-native';


export const apiClient = axios.create({
  baseURL: 'https://quotes-db.vercel.app',
  timeout: 8000,
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`Axios interceptor: Request sent to: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('Axios interceptor: ✅ Response received');
    return response;
  },
  (error) => {
    let message = "An unexpected error occurred.";
    if (!error.response) {
      message = "Network error. Please check your internet connection.";
    } else {
      switch (error.response.status) {
        case 404: message = "The requested resource was not found."; break;
        case 500: message = "Server is down. Please try again later."; break;
        case 429: message = "Too many requests. Slow down!"; break;
      }
    }
    Alert.alert("API Error", message);
    return Promise.reject(error);
  }
);


export const jsonPlaceholderClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
});

jsonPlaceholderClient.interceptors.request.use(
  (config) => {
    console.log(`[JSONPlaceholder] ${config.method?.toUpperCase()} to: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

jsonPlaceholderClient.interceptors.response.use(
  (response) => {
    console.log(`[JSONPlaceholder] Received response from: ${response.config.url}`);
    return response;
  },
  (error) => {
    Alert.alert("API Error", error.message || "Something went wrong");
    return Promise.reject(error);
  }
);

export const pokemonClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
});

pokemonClient.interceptors.request.use(
  (config) => {
    console.log(`[PokeAPI] Request to: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

pokemonClient.interceptors.response.use(
  (response) => {
    console.log(`[PokeAPI] Response from: ${response.config.url}`);
    return response;
  },
  (error) => {
    Alert.alert("API Error", "Failed to fetch Pokemon data");
    return Promise.reject(error);
  }
);

export const dummyJsonClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

dummyJsonClient.interceptors.request.use(
  (config) => {
    console.log(`[DummyJSON] Request to: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

dummyJsonClient.interceptors.response.use(
  (response) => {
    console.log(`[DummyJSON] Response from: ${response.config.url}`);
    return response;
  },
  (error) => {
    Alert.alert("API Error", "Failed to fetch products");
    return Promise.reject(error);
  }
);

export const weatherClient = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
});

weatherClient.interceptors.request.use(
  (config) => {
    console.log(`[WeatherAPI] Request to: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

weatherClient.interceptors.response.use(
  (response) => {
    console.log(`[WeatherAPI] Response from: ${response.config.url}`);
    return response;
  },
  (error) => {
    Alert.alert("API Error", "Failed to fetch weather data");
    return Promise.reject(error);
  }
);

export default apiClient;
