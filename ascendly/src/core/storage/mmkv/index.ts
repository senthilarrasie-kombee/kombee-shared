import {createMMKV} from 'react-native-mmkv';
import {secureStorage} from '../secureStorage';
import {STORAGE_KEYS} from '../keys';

export const storage = createMMKV();

export const setStorageItem = (key: string, value: string | number | boolean) => {
  storage.set(key, value);
};

export const getStorageString = (key: string) => {
  return storage.getString(key);
};

export const getStorageNumber = (key: string) => {
  return storage.getNumber(key);
};

export const getStorageBoolean = (key: string) => {
  return storage.getBoolean(key);
};

export const removeStorageItem = (key: string) => {
  storage.remove(key);
};

export const clearStorage = () => {
  storage.clearAll();
};

export const logAllStorageData = async () => {
  const allKeys = storage.getAllKeys();
  const storageData = allKeys.reduce((acc: any, key) => {
    // Attempt to get as different types since MMKV doesn't tell us the type easily
    const stringVal = storage.getString(key);
    const numberVal = storage.getNumber(key);
    const boolVal = storage.getBoolean(key);

    // Prioritize string since most things are strings/JSON
    acc[key] = stringVal ?? numberVal ?? boolVal ?? 'null';
    return acc;
  }, {});

  console.log('[MMKV] Current Data in Storage:', JSON.stringify(storageData, null, 2));

  // Check Secure Storage
  const secureUid = await secureStorage.getItem(STORAGE_KEYS.AUTH.USER_ID);
  console.log(
    '[Secure Storage] User ID status:',
    secureUid ? '✅ SECURELY STORED (********)' : '❌ NOT FOUND',
  );

  // MIGRATION / CLEANUP: If the old user_id is still in MMKV, remove it for security
  if (storage.contains(STORAGE_KEYS.AUTH.USER_ID)) {
    console.log('[Cleanup] Removing insecure User ID from MMKV...');
    storage.remove(STORAGE_KEYS.AUTH.USER_ID);
  }
};
