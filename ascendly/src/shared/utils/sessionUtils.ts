import {storage} from '@core/storage/mmkv';
import {STORAGE_KEYS} from '@core/storage/keys';
import {ROUTES} from '@app/routes';
import {MainStack} from '@app/navigation/navigationTypes';

/**
 * Determines the initial route based on user login status and session age.
 * Returns ROUTES.DRAWER if the user is logged in within the last 10 days,
 * otherwise returns ROUTES.LOGIN.
 */
export const getInitialRoute = (): keyof MainStack => {
  const isLoggedIn = storage.getBoolean(STORAGE_KEYS.AUTH.IS_LOGGED_IN);
  const lastLogin = storage.getString(STORAGE_KEYS.APP.LAST_LOGIN);

  if (isLoggedIn && lastLogin) {
    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const diffInMs = now.getTime() - lastLoginDate.getTime();
    const diffInDays = diffInMs / (1000 * 3600 * 24);

    // If logged in within the last 10 days, go to Dashboard
    if (diffInDays < 10) {
      return ROUTES.DRAWER;
    }
  }
  return ROUTES.LOGIN;
};
