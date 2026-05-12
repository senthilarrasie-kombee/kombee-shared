import {AuthTokenManager} from './AuthTokenManager';

export class AuthService {
  /**
   * Simulates a login call that returns access and refresh tokens.
   */
  static async simulateLogin(firebaseToken?: string): Promise<{accessToken: string; refreshToken: string}> {
    console.log('[AuthService] Simulating login and generating fake tokens...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(() => resolve(null), 1000));

    const fakeAccessToken = `fake_access_token_${Date.now()}`;
    const fakeRefreshToken = `fake_refresh_token_${Date.now()}`;

    await AuthTokenManager.setTokens(fakeAccessToken, fakeRefreshToken, firebaseToken);
    
    console.log('[AuthService] Login simulation complete with Firebase Token.');
    return {accessToken: fakeAccessToken, refreshToken: fakeRefreshToken};
  }

  /**
   * Simulates a token refresh call.
   */
  static async simulateRefresh(): Promise<string> {
    console.log('[AuthService] Simulating token refresh...');
    
    const refreshToken = await AuthTokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(() => resolve(null), 800));

    const newAccessToken = `fake_access_token_refreshed_${Date.now()}`;
    const newRefreshToken = `fake_refresh_token_refreshed_${Date.now()}`;

    await AuthTokenManager.setTokens(newAccessToken, newRefreshToken);
    
    console.log('[AuthService] Token refresh simulation successful.');
    return newAccessToken;
  }

  static async logout(): Promise<void> {
    await AuthTokenManager.clearTokens();
    console.log('[AuthService] Logged out.');
  }
}
