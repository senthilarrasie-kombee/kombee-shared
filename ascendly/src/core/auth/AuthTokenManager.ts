import {secureStorage} from '@core/storage';
import {STORAGE_KEYS} from '@core/storage/keys';

export class AuthTokenManager {
  static async setTokens(accessToken: string, refreshToken: string, firebaseToken?: string): Promise<void> {
    console.log('[AuthTokenManager] Setting new tokens');
    await secureStorage.setItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, accessToken);
    await secureStorage.setItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN, refreshToken);
    if (firebaseToken) {
      await secureStorage.setItem(STORAGE_KEYS.AUTH.FIREBASE_TOKEN, firebaseToken);
    }
  }

  static async getAccessToken(): Promise<string | null> {
    return await secureStorage.getItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN);
  }

  static async getRefreshToken(): Promise<string | null> {
    return await secureStorage.getItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN);
  }

  static async getFirebaseToken(): Promise<string | null> {
    return await secureStorage.getItem(STORAGE_KEYS.AUTH.FIREBASE_TOKEN);
  }

  static async clearTokens(): Promise<void> {
    console.log('[AuthTokenManager] Clearing tokens');
    await secureStorage.deleteItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN);
    await secureStorage.deleteItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN);
    await secureStorage.deleteItem(STORAGE_KEYS.AUTH.FIREBASE_TOKEN);
  }
}
