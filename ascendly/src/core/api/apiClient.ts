import axios, {AxiosInstance} from 'axios';
import {Alert} from 'react-native';
import {AuthTokenManager} from '../auth/AuthTokenManager';
import {AuthService} from '../auth/AuthService';

/**
 * Shared function to apply Authentication and Logging interceptors to any axios instance.
 */
const applyAuthInterceptors = (instance: AxiosInstance, serviceName: string) => {
  // Request Interceptor: Attach Token & Log Request
  instance.interceptors.request.use(
    async config => {
      const token = await AuthTokenManager.getAccessToken();
      const firebaseToken = await AuthTokenManager.getFirebaseToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (firebaseToken) {
        config.headers['X-Firebase-Token'] = firebaseToken;
      }

      console.log(`[${serviceName}] REQUEST:`, {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
        data: config.data,
      });
      return config;
    },
    error => Promise.reject(error)
  );

  // Response Interceptor: Handle Refresh & Log Response
  instance.interceptors.response.use(
    response => {
      console.log(`[${serviceName}] ✅ RESPONSE:`, {
        status: response.status,
        url: response.config.url,
        headers: response.headers,
        data: response.data,
      });
      return response;
    },
    async error => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized errors for token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log(`[${serviceName} Auth] 401 Detected, attempting token refresh...`);
        originalRequest._retry = true;

        try {
          const newAccessToken = await AuthService.simulateRefresh();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log(`[${serviceName} Auth] Refresh successful, retrying original request...`);
          return instance(originalRequest); // Retry with the SAME instance
        } catch (refreshError) {
          console.error(`[${serviceName} Auth] Refresh failed, logging out...`, refreshError);
          await AuthService.logout();
          Alert.alert('Session Expired', 'Please login again.');
          return Promise.reject(refreshError);
        }
      }

      let message = 'An unexpected error occurred.';
      if (!error.response) {
        message = 'Network error. Please check your internet connection.';
      } else {
        switch (error.response.status) {
          case 404:
            message = 'The requested resource was not found.';
            break;
          case 500:
            message = 'Server is down. Please try again later.';
            break;
          case 429:
            message = 'Too many requests. Slow down!';
            break;
          default:
            message = error.message || 'Something went wrong';
        }
      }
      
      // Only show alert if it's not a 401 (which we handled above)
      if (error.response?.status !== 401) {
        Alert.alert(`${serviceName} Error`, message);
      }
      
      return Promise.reject(error);
    }
  );
};

// --- CLIENT INSTANCES ---

export const apiClient = axios.create({
  baseURL: 'https://quotes-db.vercel.app',
  timeout: 8000,
});
applyAuthInterceptors(apiClient, 'QuotesAPI');

export const jsonPlaceholderClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
});
applyAuthInterceptors(jsonPlaceholderClient, 'JSONPlaceholder');

export const pokemonClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
});
applyAuthInterceptors(pokemonClient, 'PokeAPI');

export const dummyJsonClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});
applyAuthInterceptors(dummyJsonClient, 'DummyJSON');

export const weatherClient = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
});
applyAuthInterceptors(weatherClient, 'WeatherAPI');

export default apiClient;
