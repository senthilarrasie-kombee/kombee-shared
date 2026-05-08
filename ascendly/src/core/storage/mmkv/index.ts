import {createMMKV} from 'react-native-mmkv';

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

export const logAllStorageData = () => {
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
};
