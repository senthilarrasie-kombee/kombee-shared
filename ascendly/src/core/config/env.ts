import Config from 'react-native-config';

/**
 * Type-safe environment configuration wrapper.
 * This ensures that environment variables are correctly parsed and provided with defaults.
 */
export const envConfig = {
  APP_ENV: Config.APP_ENV || 'development',
  API_URL: Config.API_URL || '',
  APP_NAME: Config.APP_NAME || 'Ascendly',
  
  // Helper to check environment
  isProduction: Config.APP_ENV === 'production',
  isStaging: Config.APP_ENV === 'staging',
  isDevelopment: !Config.APP_ENV || Config.APP_ENV === 'development',
};

export default envConfig;
