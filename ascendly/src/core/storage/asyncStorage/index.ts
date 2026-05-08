import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage Utility Wrapper
 * Used for large, non-critical, or asynchronous data as per project architecture.
 */

export const asyncStorage = {
  /**
   * Set a string value
   */
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`AsyncStorage Error (setItem): ${key}`, error);
    }
  },

  /**
   * Get a string value
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`AsyncStorage Error (getItem): ${key}`, error);
      return null;
    }
  },

  /**
   * Set an object (auto-stringified)
   */
  setObject: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`AsyncStorage Error (setObject): ${key}`, error);
    }
  },

  /**
   * Get an object (auto-parsed)
   */
  getObject: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`AsyncStorage Error (getObject): ${key}`, error);
      return null;
    }
  },

  /**
   * Remove an item
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`AsyncStorage Error (removeItem): ${key}`, error);
    }
  },

  /**
   * Clear all AsyncStorage data
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage Error (clear)', error);
    }
  },

  /**
   * Get all keys
   */
  getAllKeys: async (): Promise<readonly string[]> => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('AsyncStorage Error (getAllKeys)', error);
      return [];
    }
  },

  /**
   * Log all AsyncStorage data for debugging
   */
  logAllData: async (): Promise<void> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      const data = result.reduce((acc: any, [key, value]) => {
        try {
          acc[key] = value != null ? JSON.parse(value) : null;
        } catch {
          acc[key] = value;
        }
        return acc;
      }, {});
      console.log('[AsyncStorage] Current Data:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('AsyncStorage Error (logAllData)', error);
    }
  },
};
