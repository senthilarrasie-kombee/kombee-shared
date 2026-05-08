import * as Keychain from 'react-native-keychain';

/**
 * Secure Storage implementation using Keychain (iOS) and Keystore (Android).
 * Used for storing sensitive information like tokens, passwords, and private keys.
 */

export const setSecureItem = async (key: string, value: string): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword(key, value, {
      service: key,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return true;
  } catch (error) {
    console.error(`Error setting secure item for key: ${key}`, error);
    return false;
  }
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: key });
    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error(`Error getting secure item for key: ${key}`, error);
    return null;
  }
};

export const deleteSecureItem = async (key: string): Promise<boolean> => {
  try {
    await Keychain.resetGenericPassword({ service: key });
    return true;
  } catch (error) {
    console.error(`Error deleting secure item for key: ${key}`, error);
    return false;
  }
};

export const logSecureItem = async (key: string): Promise<void> => {
  if (__DEV__) {
    const value = await getSecureItem(key);
    console.log(`[Keychain Debug] ${key}:`, value ? '********' : 'null');
    // If you REALLY want to see the value during development, uncomment below:
    // console.log(`[Keychain Debug] ${key} raw:`, value);
  }
};

export const secureStorage = {
  setItem: setSecureItem,
  getItem: getSecureItem,
  deleteItem: deleteSecureItem,
  logItem: logSecureItem,
};

export default secureStorage;
