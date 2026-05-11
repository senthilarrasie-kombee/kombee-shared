import {NativeModules, Platform} from 'react-native';

const {RootCheckModule} = NativeModules;

/**
 * Checks if the device is rooted or has security compromises (e.g., Frida server).
 * Only works on Android. Returns false on other platforms.
 * 
 * @param message An optional message to pass to the native module (log purpose).
 * @returns Promise<boolean> true if rooted/compromised, false otherwise.
 */
export const isDeviceRooted = async (message: string = ''): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

  if (!RootCheckModule) {
    console.warn('RootCheckModule is not available');
    return false;
  }

  try {
    return await RootCheckModule.isDeviceRooted(message);
  } catch (error) {
    console.error('Failed to check root status:', error);
    return false;
  }
};
